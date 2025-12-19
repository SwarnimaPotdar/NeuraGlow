"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChatReply = generateChatReply;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.AIzaSyCkT6oTmOc_1kCikLixAkskP7fjaIRJOaY);
async function generateChatReply(userMessage) {
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
