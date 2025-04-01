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
    console.log("Current Title ",title);
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    let summaryText = "";
    let chatMessages = [];

    // Case 1: Only content is provided
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
    // Case 3: No content or image
    else {
      return res.status(400).json({ error: "Please provide either an image or content." });
    }

    chatMessages.push({ role: "user", content: content });
    chatMessages.push({ role: "bot", content: summaryText });

    const titlePrompt = `Generate a short 2 word and relevant title for this conversation based on the input given to you this is the input : ${content}}`;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let existingChat = user.userChats.find(chat => chat.title === title);
    console.log("Existing Chat ",existingChat);
    const titleResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: titlePrompt,
    });

    const generatedTitle = titleResponse.candidates?.[0]?.content?.parts?.[0]?.text || "Untitled Chat";
    if (existingChat) {
      existingChat.messages.push(...chatMessages);
    } else {
      
      user.userChats.push({
        title: generatedTitle,
        messages: chatMessages,
      });
    }

    await user.save();

    res.json({ user: user, chatTitle: generatedTitle , ResponseText : summaryText});
    console.log("user ", user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
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
