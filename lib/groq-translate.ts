"use server";

import Groq from "groq-sdk";
import type { Language } from "./translations";

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

let rateLimitedUntil = 0;
let lastRateLimitLog = 0;

function getRetryAfterMs(error: unknown) {
  const retryAfter = (error as { headers?: { get?: (name: string) => string | null } })?.headers?.get?.("retry-after");
  const retryAfterSeconds = retryAfter ? Number(retryAfter) : NaN;
  return Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
    ? retryAfterSeconds * 1000
    : 5 * 60 * 1000;
}

function isRateLimitError(error: unknown) {
  return (error as { status?: number })?.status === 429;
}

export async function translateTexts(
  texts: string[],
  targetLanguage: Exclude<Language, "en">
): Promise<string[]> {
  if (!groq) {
    return texts;
  }

  if (texts.length === 0) return texts;
  if (Date.now() < rateLimitedUntil) return texts;

  try {
    const targetLanguageName = targetLanguage === "fr" ? "French" : targetLanguage;
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a professional English-to-${targetLanguageName} translator. Translate each string in the JSON array to natural ${targetLanguageName}. Return ONLY a JSON array of the same length. No explanation, no markdown, no code fences. If a string is a single word or proper noun, keep proper nouns as-is.`,
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
    if (!content) return texts;

    const cleaned = content
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) return texts;

    // Map results back — pad with originals if length mismatches
    return texts.map(
      (original, i) =>
        (typeof parsed[i] === "string" ? parsed[i] : original) || original
    );
  } catch (e) {
    if (isRateLimitError(e)) {
      rateLimitedUntil = Date.now() + getRetryAfterMs(e);

      if (Date.now() - lastRateLimitLog > 60_000) {
        lastRateLimitLog = Date.now();
        console.warn(
          `Groq translation rate limited. Pausing translation calls until ${new Date(rateLimitedUntil).toLocaleTimeString()}.`
        );
      }

      return texts;
    }

    console.error("Groq translation error:", e);
    return texts;
  }
}
