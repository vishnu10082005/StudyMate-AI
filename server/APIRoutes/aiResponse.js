import dotenv from "dotenv";

dotenv.config();
console.log("Gemini Key ",process.env.GEMINIAI_API_KEY);
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey:  process.env.GEMINIAI_API_KEY});

export default async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Just Give me the 5 Interview Questions for the role of the frontend react developer only five",
  });
  const questions = response.text.split(", ");
  console.log(typeof(questions));
  console.log(questions);
}

