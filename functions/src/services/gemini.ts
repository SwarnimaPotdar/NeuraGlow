import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateChatReply(userMessage: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

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
