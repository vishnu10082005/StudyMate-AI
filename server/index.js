import express from "express";
import cors from "cors";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import User from "./Schema/User.js";
import connectDB from "./DatabaseConnection/dbConnection.js";
import authRoute from "./APIRoutes/authRoute.js";
dotenv.config();

const app = express();
const port = 3005;
app.use(cors());
app.use(express.json());
connectDB();
app.use("/auth", authRoute);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINIAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINIAI_API_KEY);

async function imageUrlToBase64(imageUrl) {
  console.log("Image URL:", imageUrl);
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    return Buffer.from(response.data).toString("base64");
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}

app.post("/:userId/summarize", async (req, res) => {
  try {
    const { image, content, title } = req.body;
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    let summaryText = "";
    let chatMessages = [];
    if (content && !image) {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `${content} 
        Please format the response in a single paragraph where each point is separated by a newline character ('\\n'). Do not add extra spaces or blank lines between points. I will handle the formatting in the UI, so ensure all points are concise and flow in one paragraph.`,
      });

      summaryText = response.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate summary";
    }
    // Case 2: Image provided
    else if (image) {
      const base64Image = await imageUrlToBase64(image);
      if (!base64Image) {
        return res.status(500).json({ error: "Failed to convert image to base64" });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const serverPrompt = `Summarize the content of this image in simple Indian English elaborately so that I can understand it easily.
      Please format the response in a single paragraph where each point is separated by a newline character ('\\n').`;

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      };

      const generatedContent = await model.generateContent([serverPrompt, imagePart]);
      summaryText = generatedContent.response.text() || "Failed to generate summary";
    }
    else {
      return res.status(400).json({ error: "Please provide either an image or content." });
    }

    // Store chat message
    
    chatMessages.push({ role: "user", content: content || "" ,image : image || ""});
    chatMessages.push({ role: "bot", content: summaryText });

    // Step 1: Generate a title for the chat
    const titlePrompt = `Generate a short 2 word and relevant title for this conversation based on the input given to you this is the input : ${content}`;

    const titleResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: titlePrompt,
    });

    const generatedTitle = titleResponse.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "Untitled Chat";

    // Step 2: Check if title already exists in userChats
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let existingChat = user.userChats.find(chat => chat.title === title);



    if (existingChat) {
      existingChat.messages.push(...chatMessages);
    } else {
      user.userChats.push({
        title: generatedTitle,
        messages: chatMessages,
      });
    }

    await user.save();

    res.json({ user: user, chatTitle: generatedTitle, ResponseText: summaryText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});


app.post("/:userId/mindMap", async (req, res) => {
  try {
    const { content, title } = req.body;
    const userId = req.params.userId;

    if (!content || !userId) {
      return res.status(400).json({ error: "User ID and content are required" });
    }

    // AI Prompt for Generating Mind Map Data
    const prompt = `
      Generate a structured JSON representation of a mind map for the topic: "${content}".
      The main/root node should have the label: "${content}". 
      Provide relevant subtopics as child nodes. the colors of the nodes and the edges should be uniques and look attractive so select different colors for the different node boxes and the edges .
      Format the response in this JSON structure:
      
      {
        "nodes": [
          { "id": "1", "data": { "label": "${content}" }, "position": { "x": 250, "y": 0 }, "style": { "background": "#6D28D9", "color": "#fff", "border": "2px solid #4C1D95", "borderRadius": "10px", "padding": "10px" } }
        ],
        "edges": [
          { "id": "e1-2", "source": "1", "target": "2", "style": { "stroke": "#F97316", "strokeWidth": 2 } }
        ]
      }

      Ensure the mind map covers essential subtopics related to "${content}" and maintains a structured hierarchy with visually appealing colors.
    `;

    // Call Gemini AI to generate content
    const mindMapResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    let rawResponse = mindMapResponse.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    rawResponse = rawResponse.replace(/```json\n|```/g, "").trim();

    const mindMapData = JSON.parse(rawResponse);

    // Check if parsed JSON is valid
    if (!mindMapData.nodes || !mindMapData.edges) {
      return res.status(500).json({ error: "Invalid mind map data from AI." });
    }

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if a mind map with this title already exists
    const existingMindMapIndex = user.userMindMaps.findIndex(map => map.title === title);
    
    if (existingMindMapIndex !== -1) {
      // Update existing mind map
      user.userMindMaps[existingMindMapIndex].mindMapData = mindMapData;
    } else {
      // Add new mind map
      user.userMindMaps.push({
        title: title || `Mind Map for ${content}`,
        mindMapData: mindMapData, // No need to stringify since schema accepts Object
      });
    }

    await user.save();

    // Send success response after all operations are complete
    return res.status(200).json({ 
      success: true, 
      message: "Mind map saved successfully",
      mindMapData 
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
});



// Route to get all chats of a user
app.get("/:userId/getChats", async (req, res) => {
  console.log("user Id ", req.params.id);
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.userChats);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error ", error)
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
