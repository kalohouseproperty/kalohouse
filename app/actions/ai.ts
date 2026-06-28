"use server";

export async function translateContent(text: string, targetLang: string) {
  try {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      console.warn("GOOGLE_TRANSLATE_API_KEY not set, returning original text");
      return text;
    }

    const map: Record<string, string> = {
      en: "en",
      fr: "fr",
    };

    const target = map[targetLang] || "en";
    if (target === "en") return text;

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          target,
          format: "text",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Google Translate error:", data);
      return text;
    }

    return data?.data?.translations?.[0]?.translatedText || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}
