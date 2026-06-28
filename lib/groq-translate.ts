"use server";

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function translateTexts(
  texts: string[],
  targetLanguage: "fr"
): Promise<string[]> {
  if (!process.env.GROQ_API_KEY) {
    return texts;
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a professional translator who ONLY speaks and writes French. You will translate the following English text into perfect, natural French. Do NOT use any other language, not even a single word. Do NOT explain anything. Do NOT add any formatting. Return ONLY a JSON array of translated strings, in the exact same order as the input. If you cannot translate something accurately, return the original English word.`,
        },
        {
          role: "user",
          content: JSON.stringify(texts),
        },
      ],
      temperature: 0.05,
      max_tokens: 4096,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) return texts;

    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length === texts.length) {
      return parsed.map((t: unknown) => (typeof t === "string" ? t : String(t)));
    }

    return texts;
  } catch {
    return texts;
  }
}
