import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { question, reasoning, correctAnswer } = await req.json();

    // 1. Debug: Check if the API key is actually loading
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ ERROR: GEMINI_API_KEY is missing from .env.local");
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
      You are a Socratic CAT (Common Admission Test) coach. 
      A student is reviewing a Quantitative Aptitude question.
      
      QUESTION: ${question}
      CORRECT ANSWER: ${correctAnswer}
      STUDENT'S REASONING: "${reasoning}"
      
      INSTRUCTIONS:
      1. Do NOT just give the full solution immediately.
      2. If the student's reasoning is correct, praise them and ask if they can think of a faster "shortcut" (common in CAT).
      3. If the reasoning is wrong, identify the specific logical gap and ask a leading question.
      4. Keep it concise and encouraging.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ analysis: text });

  } catch (error: any) {
    // 2. Debug: Log the actual error to your VS Code terminal
    console.error("❌ GEMINI API ERROR:", error.message || error);
    
    return NextResponse.json({ 
      error: "Failed to analyze", 
      details: error.message 
    }, { status: 500 });
  }
}