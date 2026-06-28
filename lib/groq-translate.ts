"use server";

import Groq from "groq-sdk";

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

export async function translateTexts(
  texts: string[],
  targetLanguage: "fr"
): Promise<string[]> {
  if (!groq) {
    console.warn("GROQ_API_KEY not set — skipping translation");
    return texts;
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following English text into natural French. Return ONLY a JSON array of translated strings, in the exact same order as the input. Do NOT add any explanation, markdown, or formatting. Just the raw JSON array. If a string cannot be translated, return the original.`,
        },
        {
          role: "user",
          content: JSON.stringify(texts),
        },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      console.warn("Groq returned empty response");
      return texts;
    }

    // Strip markdown code fences if present
    const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(cleaned);

    if (Array.isArray(parsed) && parsed.length === texts.length) {
      return parsed.map((t: unknown) => (typeof t === "string" ? t : String(t)));
    }

    console.warn("Groq translation length mismatch:", parsed.length, "vs", texts.length);
    return texts;
  } catch (e) {
    console.error("Groq translation failed:", e);
    return texts;
  }
}
