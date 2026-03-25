import express from "express";
import { OpenRouter } from "@openrouter/sdk";
import cors from "cors";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import User from "./Schema/User.js";
import OpenAI from "openai";
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

/*
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
*/

dotenv.config();
const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000', // Optional
    'X-OpenRouter-Title': 'StudyMate AI',       // Optional
  },
});

app.post("/:userId/summarize", async (req, res) => {
  try {
    const { image, content, title } = req.body;
    const { userId } = req.params;
    const summaryType = req.query.summaryType || "normal";

    // ✅ Basic validations
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Credit logic
    if (summaryType === "smart" && !user.isPro) {
      if (user.smartSummaries <= 0) {
        return res.status(403).json({ error: "Smart-summary limit reached." });
      }
      user.smartSummaries -= 1;
    }

    // ✅ Prompt
    const systemRule =
      "If user greets only greets (hi/hello),then reply: 'Welcome to StudyMate AI! How can I help you today?'.else dont wish Otherwise, generate the requested summary.";

    const fullPrompt = `
${systemRule}

Task: ${summaryType === "smart"
        ? `You are an expert assistant.
Your goal is to make the user understand everything deeply, even if they are a beginner.
Always follow this structure:
Explain the concept in simple and clear terms.
Key Points

`
        : `You are a helpful assistant.
Your goal is to answer user queries clearly and simply.
`
      }

Content:
${content}
`;

    // ✅ NVIDIA API call
    const response = await axios.post(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        model: "qwen/qwen3.5-122b-a10b",
        messages: [
          {
            role: "user",
            content: fullPrompt,
          },
        ],
        max_tokens: 1024,
        temperature: 0.6,
        top_p: 0.95,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
          Accept: "application/json",
        },
        timeout: 20000, // ✅ prevents hanging
      }
    );

    const summaryText =
      response.data?.choices?.[0]?.message?.content || "No response";

    // ✅ Save chat history
    const chatMessages = [
      { role: "user", content },
      { role: "bot", content: summaryText },
    ];

    const existingChat = user.userChats.find((c) => c.title === title);

    if (existingChat) {
      existingChat.messages.push(...chatMessages);
    } else {
      user.userChats.push({
        title: title || "New Summary",
        messages: chatMessages,
      });
    }

    await user.save();

    // ✅ Final response
    return res.json({
      user,
      chatTitle: title || "New Summary",
      ResponseText: summaryText,
    });
  } catch (err) {
    console.error("Summarize error:", err?.response?.data || err.message);

    return res.status(500).json({
      error: "AI Service Error",
      details: err?.response?.data || err.message,
    });
  }
});

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});


app.post("/:userId/mindMap", async (req, res) => {
  try {
    const { content } = req.body;
    const { userId } = req.params;

    if (!content || !userId) {
      return res.status(400).json({ error: "User ID and content are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const maxNodes = user.isPro ? 5 : 3;

    // 🔥 Strong prompt (prevents junk)
    const prompt = `
DO NOT include thinking, reasoning, or explanations.
DO NOT include <think> tags.
DO NOT include markdown.
ONLY return valid JSON.

Rules:
- Maximum ${maxNodes} nodes total (including root)
- Keep it simple
- Root node id must be "1"

Return format:
{
  "nodes": [
    {
      "id": "1",
      "data": { "label": "${content}" },
      "style": {
        "background": "#6D28D9",
        "color": "#fff",
        "border": "2px solid #4C1D95",
        "borderRadius": "10px",
        "padding": "10px"
      }
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2",
      "style": { "stroke": "#F97316", "strokeWidth": 2 }
    }
  ]
}
`;

    // ✅ API call
    const completion = await openai.chat.completions.create({
      model: "minimaxai/minimax-m2.5",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
    });

    let rawData = completion.choices?.[0]?.message?.content || "";

    // =========================
    // 🔥 CLEAN RESPONSE
    // =========================
    rawData = rawData
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .replace(/```json|```/g, "")
      .trim();

    // =========================
    // 🔥 EXTRACT JSON ONLY
    // =========================
    const jsonMatch = rawData.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.status(500).json({
        error: "No JSON found in response",
        raw: rawData,
      });
    }

    let cleanJson = jsonMatch[0];

    // =========================
    // 🔥 PARSE + REPAIR
    // =========================
    let mindMapData;

    try {
      mindMapData = JSON.parse(cleanJson);
    } catch (err) {
      console.warn("Parse failed → repairing JSON");

      try {
        cleanJson = cleanJson
          .replace(/,\s*}/g, "}")
          .replace(/,\s*]/g, "]")
          .replace(/"strokeWidth":\s*$/g, '"strokeWidth": 2');

        mindMapData = JSON.parse(cleanJson);
      } catch (repairErr) {
        console.error("Repair failed → fallback used");

        // 🔥 FINAL FALLBACK (never break UI)
        mindMapData = {
          nodes: [
            {
              id: "1",
              data: { label: content },
              style: {
                background: "#6D28D9",
                color: "#fff",
                border: "2px solid #4C1D95",
                borderRadius: "10px",
                padding: "10px",
              },
            },
          ],
          edges: [],
        };
      }
    }

    // =========================
    // 🔥 VALIDATION
    // =========================
    if (!mindMapData.nodes || !mindMapData.edges) {
      return res.status(500).json({
        error: "Invalid structure from AI",
      });
    }

    // =========================
    // 🔥 ENFORCE LIMIT
    // =========================
    mindMapData.nodes = mindMapData.nodes.slice(0, maxNodes);

    const allowedIds = new Set(mindMapData.nodes.map((n) => n.id));

    mindMapData.edges = mindMapData.edges.filter(
      (e) => allowedIds.has(e.source) && allowedIds.has(e.target)
    );

    // =========================
    // ✅ SAVE
    // =========================
    const cleanData = {
      title: `Mind Map for ${content}`,
      mindMaps: mindMapData,
    };

    user.userMindMaps.push(cleanData);

    if (!user.isPro && user.monthlymindMaps > 0) {
      user.monthlymindMaps -= 1;
    }

    await user.save();

    const currentMindMap =
      user.userMindMaps[user.userMindMaps.length - 1];

    return res.status(200).json({
      success: true,
      message: "Mind map created",
      ...cleanData,
      currentMindMap,
    });

  } catch (error) {
    console.error("MindMap Error:", error?.message);

    return res.status(500).json({
      error: "Something went wrong",
      details: error?.message,
    });
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
