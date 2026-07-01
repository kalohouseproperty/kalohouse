import { translations, type Language } from "./translations";

export function parseLanguage(value: string | string[] | null | undefined): Language {
  const lang = Array.isArray(value) ? value[0] : value;
  return lang === "fr" || lang === "en" ? lang : "en";
}

export function getTranslations(lang: Language = "en") {
  return translations[lang] || translations.en;
}

export type Translations = ReturnType<typeof getTranslations>;
