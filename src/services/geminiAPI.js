import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function sendChatMessage(userMessage) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a calm, empathetic mental wellness companion for students.
Do NOT diagnose.
Do NOT mention medications.
Be supportive and encouraging.

User: ${userMessage}
AI:
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
