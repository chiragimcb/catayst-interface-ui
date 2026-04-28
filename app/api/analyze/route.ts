import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { question, reasoning, imageBase64, correctAnswer } =
      await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }); // Stable for JSON

    const prompt: any[] = [
      {
        text: `
          You are an expert CAT (Common Admission Test) Quant Professor and Socratic Coach.
          
          ### CONTEXT
          - Question: ${question}
          - Correct Answer: ${correctAnswer}

          ### TASK: EVALUATE & COACH
          Evaluate the student's reasoning (provided via image or text). 
          1. Critique (Socratic Layer): Identify logic failures or praise logic. Ask one insightful question.
          2. Traditional Layer: Provide step-by-step LaTeX solution.
          3. Smart Layer: Provide CAT shortcuts (triplets, digital sums, etc).

          ### OUTPUT FORMAT
          Return ONLY a single JSON object. 
          { "critique": "string", "traditional": "string", "smart": "string" }
        `,
      },
    ];

    // 2. Add the Image Part (if it exists)
    if (imageBase64) {
      const base64Data = imageBase64.split(",")[1]; // Remove data:image/jpeg;base64, prefix
      prompt.push({
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      });
    }

    // 3. Add the Text Reasoning Part (if it exists)
    if (reasoning) {
      prompt.push({ text: `Student's Typed Reasoning: "${reasoning}"` });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // 1. Safe text extraction
    let text = "";
    try {
      text = response.text();
    } catch (e) {
      // Fallback for some SDK versions
      text = (response as any).candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    // 2. Linear Cleaning: Remove markdown blocks and find the first/last braces
    const jsonMatch = text
      .replace(/```json|```/g, "")
      .trim()
      .match(/\{[\s\S]*\}/);
    const cleanJsonString = jsonMatch ? jsonMatch[0] : text;

    try {
      const parsed = JSON.parse(cleanJsonString);

      let finalData = {
        critique: parsed.critique,
        traditional: parsed.traditional,
        smart: parsed.smart,
      };

      // 3. THE "RUSSIAN DOLL" CHECK
      // If critique contains "traditional", it means the AI put the whole object inside the critique key
      if (
        typeof parsed.critique === "string" &&
        parsed.critique.includes('"traditional"')
      ) {
        try {
          const nested = JSON.parse(parsed.critique.trim());
          finalData = {
            critique: nested.critique || finalData.critique,
            traditional: nested.traditional || finalData.traditional,
            smart: nested.smart || finalData.smart,
          };
        } catch (e) {
          console.warn("Found nested string but failed to parse inner JSON");
        }
      }

      // 4. PLACEHOLDER REJECTION
      // If smart/traditional are just "Look for shortcuts", but critique is huge,
      // it's a sign the data mapping failed.
      const isPlaceholder = (s: string) =>
        !s || s.length < 50 || s.toLowerCase().includes("refer to");

      if (
        isPlaceholder(finalData.smart) &&
        !isPlaceholder(finalData.critique)
      ) {
        // This is a safety catch for the exact bug you're seeing
        console.log("DEBUG: Placeholder detected. Mapping may be misaligned.");
      }

      return NextResponse.json(finalData);
    } catch (parseError) {
      console.error("❌ JSON Parse Error. Raw Text was:", text);
      return NextResponse.json({
        critique: text,
        traditional: "Refer to the descriptive solution.",
        smart: "Look for numerical shortcuts.",
      });
    }
  } catch (error) {
    console.error("Critical Error:", error);
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 });
  }
}
