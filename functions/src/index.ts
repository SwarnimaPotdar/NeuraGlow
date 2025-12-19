import * as functions from "firebase-functions";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function generateChatReply(userMessage: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a supportive, calm mental wellness companion for students.
Do NOT diagnose.
Do NOT suggest medication.
Keep responses empathetic and short.

User: ${userMessage}
AI:
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

const app = express();
app.use(express.json());

app.post("/chat", async (req: any, res: any) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await generateChatReply(message);
    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "I'm here with you, but something went wrong. Please try again."
    });
  }
});

export const api = functions.https.onRequest(app);
