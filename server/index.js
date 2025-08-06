import express from "express";

import cors from "cors";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import User from "./Schema/User.js";
import connectDB from "./DatabaseConnection/dbConnection.js";
import authRoute from "./APIRoutes/authRoute.js";
import userRouter from "./APIRoutes/userRoutes.js";
import blogRouter from "./APIRoutes/routes.js";
import todoRouter from "./APIRoutes/todoRoutes.js";
import razorrouter from "./APIRoutes/razorroutes.js";
import resetrouter from "./APIRoutes/resetSummary.js";
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
    console.log("Request Body:", content);

    const userId = req.params.userId;
    if (!content || !userId) {
      return res.status(400).json({ error: "User ID and content are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ---- Prompt (no fixed positions, only styles) ----
    let prompt;
    if (user.isPro) {
      prompt = `
        Generate a very detailed and premium JSON mind map for: "${content.content}".
        Include all root nodes, subtopics, and deeply nested concepts.
        Assign unique attractive colors and styles to nodes and edges.
        Do NOT include positions (x,y) - positions will be handled separately.
        Return ONLY valid JSON exactly in this format:
        {
          "nodes": [
            { "id": "1", "data": { "label": "${content.content}" }, 
              "style": { "background": "#6D28D9", "color": "#fff",
                         "border": "2px solid #4C1D95",
                         "borderRadius": "10px", "padding": "10px" } }
          ],
          "edges": [
            { "id": "e1-2", "source": "1", "target": "2",
              "style": { "stroke": "#F97316", "strokeWidth": 2 } }
          ]
        }
        Do NOT include extra text, only JSON.
      `;
    } else {
      prompt = `
        Generate a structured JSON mind map for: "${content.content}".
        Include broad level nodes and subtopics (not deep).
        Assign unique colors and styles to nodes and edges.
        Do NOT include positions (x,y) - positions will be handled separately.
        Return ONLY valid JSON exactly in this format:
        {
          "nodes": [
            { "id": "1", "data": { "label": "${content.content}" }, 
              "style": { "background": "#6D28D9", "color": "#fff",
                         "border": "2px solid #4C1D95",
                         "borderRadius": "10px", "padding": "10px" } }
          ],
          "edges": [
            { "id": "e1-2", "source": "1", "target": "2",
              "style": { "stroke": "#F97316", "strokeWidth": 2 } }
          ]
        }
        Do NOT include extra text, only JSON.
      `;
    }

    // ---- AI Call ----
    const mindMapResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    let rawData = mindMapResponse?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    rawData = rawData.replace(/```json|```/g, "").trim();

    let mindMapData;
    try {
      mindMapData = JSON.parse(rawData);
    } catch (e) {
      console.error("Invalid JSON returned by AI:", rawData);
      return res.status(500).json({ error: "AI returned invalid JSON format" });
    }

    if (!mindMapData.nodes || !mindMapData.edges) {
      console.error("Missing nodes or edges in AI response");
      return res.status(500).json({ error: "Invalid mind map data from AI." });
    }

    const cleanData = {
      title: `Mind Map for ${content.content}`.trim(),
      mindMaps: {
        nodes: mindMapData.nodes,
        edges: mindMapData.edges,
      },
    };

    // ---- Save ----
    user.userMindMaps.push(cleanData);
    if (!user.isPro && user.monthlymindMaps > 0) {
      user.monthlymindMaps -= 1;
    }
    await user.save();

    const currentMindMap = user.userMindMaps[user.userMindMaps.length - 1];
    return res.status(200).json({
      success: true,
      message: "Mind map saved successfully",
      ...cleanData,
      currentMindMap,
    });

  } catch (error) {
    console.error("MindMap Creating Error:", error);
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

    res.status(200).json({ allMindMaps: user.userMindMaps });
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
