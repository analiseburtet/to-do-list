import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ERROR_MESSAGE_500 = {
  error: "Erro ao gerar emoji. Verifique sua chave ou modelo.",
};
const MODEL = "gemini-2.0-flash";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const { values } = await req.json();

  try {
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: `Gere apenas um emoji para a seguinte mensagem: ${values.task} e nada mais`,
    });

    return NextResponse.json(result.text);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(ERROR_MESSAGE_500, { status: 500 });
  }
}
