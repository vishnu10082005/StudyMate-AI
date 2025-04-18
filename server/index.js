import express from "express";

import cors from "cors";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import User from "./schema/User.js";
import connectDB from "./DatabaseConnection/dbConnection.js";
import authRoute from "./APIRoutes/authRoute.js";
import userRouter from "./APIRoutes/userRoutes.js";
import blogRouter from "./APIRoutes/routes.js";
import todoRouter from "./APIRoutes/todoRoutes.js";
dotenv.config();

const app = express();
const port = 3005;
const allowedOrigins = [
  'http://localhost:3000',
  'https://study-mateai.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
connectDB();
app.use("/auth", authRoute);
app.use(userRouter);
app.use(blogRouter)
app.use("/todos",todoRouter)
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
        Please format the response in a single paragraph where each point is separated by a newline character ('\\n').`,
      });
      summaryText = response.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate summary";
    }
    else if (image) {
      const base64Image = await imageUrlToBase64(image);
      if (!base64Image) {
        return res.status(500).json({ error: "Failed to convert image to base64" });
      }
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const serverPrompt = `Summarize the content of this image where each point is separated by a newline character ('\\n')`;
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

    chatMessages.push({ role: "user", content: content || "", image: image || "" });
    chatMessages.push({ role: "bot", content: summaryText });

    
    let generatedTitle = title; 
    
    if (title === "New Chat") {
      const titlePrompt = `Generate a short 3-4 word and exact title for this conversation it should relevant to this what is the topic mentiond in this : ${summaryText}`;
      const titleResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: titlePrompt,
      });
      generatedTitle = titleResponse.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "Untitled Chat";
    }

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

    res.json({ 
      user: user, 
      chatTitle: generatedTitle, // Send back the actual title used
      ResponseText: summaryText 
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});


app.post("/:userId/mindMap", async (req, res) => {
  try {
    const content = req.body;
    const userId = req.params.userId;

    if (!content || !userId) {
      return res.status(400).json({ error: "User ID and content are required" });
    }

    const prompt = `
      Generate a structured JSON representation of a mind map for the topic: "${content.content}".
      The main/root node should have the label: "${content.content}". The Mind Map should consists of the Broad data make every node and each and every topic in the clear way and give the every node .
      Provide relevant subtopics as child nodes. the colors of the nodes and the edges should be uniques and look attractive so select different colors for the different node boxes and the edges . Give me the positions correctly as it is looking clumsy if the data is more or if the nodes are more 
      Format the response in this JSON structure:
      
      {
        "nodes": [
          { "id": "1", "data": { "label": "${content.content}" }, "position": { "x": 250, "y": 0 }, "style": { "background": "#6D28D9", "color": "#fff", "border": "2px solid #4C1D95", "borderRadius": "10px", "padding": "10px" } }
        ],
        "edges": [
          { "id": "e1-2", "source": "1", "target": "2", "style": { "stroke": "#F97316", "strokeWidth": 2 } }
        ]
      }

      Ensure the mind map covers essential subtopics related to "${content}" and maintains a structured hierarchy with visually appealing colors.
    `;

    const mindMapResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    let rawResponse = mindMapResponse.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    rawResponse = rawResponse.replace(/```json\n|```/g, "").trim();

    const mindMapData = JSON.parse(rawResponse);

    if (!mindMapData.nodes || !mindMapData.edges) {
      return res.status(500).json({ error: "Invalid mind map data from AI." });
    }

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.userMindMaps.push({
      title: `Mind Map for ${content.content}`,
      mindMaps: mindMapData,
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Mind map saved successfully",
      mindMapData,
      latestOne: user.userMindMaps.length - 1,
      allMindMaps: user.userMindMaps
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

app.get("/", (req, res) => {
  res.send("API IS RUNNING");
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
