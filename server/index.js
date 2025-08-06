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
import razorrouter from "./APIRoutes/razorroutes.js";
import resetrouter from "./APIRoutes/resetSummary.js";
dotenv.config();
// This is the start of the project 
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
app.use("/todos", todoRouter)
app.use(razorrouter)
app.use(resetrouter)
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
    const summaryType = req.query.summaryType || "normal";

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    /* ------------------------------------------------------------------ */
    /*  SMART‑SUMMARY CREDIT CHECK                                        */
    /* ------------------------------------------------------------------ */
    if (summaryType === "smart" && !user.isPro) {
      if (user.smartSummaries <= 0) {
        return res.status(403).json({
          error:
            "Smart‑summary limit reached. Upgrade to Pro for unlimited summaries.",
        });
      }
      user.smartSummaries -= 1;
    }

    /* ------------------------------------------------------------------ */
    /*  SYSTEM RULE: polite greeting                                      */
    /* ------------------------------------------------------------------ */
    const systemRule =
      "RULE: If the user message is **only** a greeting " +
      "(hi, hello, hey, good morning, good evening, namaste, etc.), " +
      'reply exactly with: "Welcome to StudyMate AI! How can I help you today?" ' +
      "in a friendly, humble tone. Otherwise ignore this rule and follow the " +
      "additional instructions below.\n\n";

    let summaryText = "";
    let chatMessages = [];
    if (content && !image) {
      const prompt =
        systemRule +
        (summaryType === "smart"
          ? `${content}\nSummarize with deep understanding, highlighting key insights, emotions and concepts. Use bullet format with newline (\\n) after each point. Do **not** use markdown/bold (**).`
          : `${content}\nSummarize in one paragraph, each point separated by newline (\\n). Do **not** use markdown/bold (**).`);

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      summaryText =
        response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Failed to generate summary";
    }
    else if (image) {
      const base64Image = await imageUrlToBase64(image);
      if (!base64Image)
        return res.status(500).json({ error: "Failed to convert image." });

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const serverPrompt =
        systemRule +
        (summaryType === "smart"
          ? "Smartly summarise this image: deep insights, context and highlights. Each point newline‑separated (\\n). No markdown/bold."
          : "Summarise this image in simple newline‑separated points (\\n). No markdown/bold.");

      const imagePart = {
        inlineData: { data: base64Image, mimeType: "image/jpeg" },
      };

      const generated = await model.generateContent([serverPrompt, imagePart]);
      summaryText = generated.response.text() || "Failed to generate summary";
    }

    else {
      return res
        .status(400)
        .json({ error: "Please provide either an image or content." });
    }
    chatMessages.push({ role: "user", content: content || "", image: image || "" });
    chatMessages.push({ role: "bot", content: summaryText });

    let generatedTitle = title;
    if (title === "New Chat") {
      const titlePrompt =
        systemRule +
        `Generate a short (3‑4 word) plain‑text title relevant to: ${summaryText}`;
      const titleResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: titlePrompt,
      });
      generatedTitle =
        titleResponse.candidates?.[0]?.content?.parts?.[0]?.text.trim() ||
        "Untitled Chat";
    }

    const existingChat = user.userChats.find((c) => c.title === title);
    if (existingChat) {
      existingChat.messages.push(...chatMessages);
    } else {
      user.userChats.push({ title: generatedTitle, messages: chatMessages });
    }

    await user.save();

    return res.json({
      user,
      chatTitle: generatedTitle,
      ResponseText: summaryText,
    });
  } catch (err) {
    console.error("summarize route error:", err);
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
    if (!user.isPro && user.monthlymindMaps > 0) {
      user.userMindMaps.push({
        title: `Mind Map for ${content.content}`,
        mindMaps: mindMapData,
      });
      user.monthlymindMaps -= 1;
      console.log("MindMaps Remaining ",user.monthlymindMaps)
    }
    else if (user.isPro) {
      user.userMindMaps.push({
        title: `Mind Map for ${content.content}`,
        mindMaps: mindMapData,
      });
    }
    
    
    console.log("MindMaps Remaining ",user.monthlymindMaps)
    await user.save();
    console.log(user);
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
app.get("/:userId/getAllMindMaps", async (req, res) => {
  console.log("user Id ", req.params.id);
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({allMindMaps: user.userMindMaps});
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
