"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useKalohouse } from "./KalohouseProvider";
import { translateTexts } from "@/lib/groq-translate";
import { Loader2 } from "lucide-react";

const ATTR = "data-nyumba-t";
const BATCH_SIZE = 30;
const CACHE_KEY = "nyumba-translations";
const ORIGINAL_KEY = "nyumba-originals";

function getOriginalMap(): Map<string, string> {
  if (typeof window === "undefined") return new Map();
  try {
    const raw = localStorage.getItem(ORIGINAL_KEY);
    if (raw) return new Map(Object.entries(JSON.parse(raw)));
  } catch {}
  return new Map();
}

function saveOriginalMap(map: Map<string, string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORIGINAL_KEY, JSON.stringify(Object.fromEntries(map)));
}

function getTranslationCache(): Map<string, string> {
  if (typeof window === "undefined") return new Map();
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return new Map(Object.entries(JSON.parse(raw)));
  } catch {}
  return new Map();
}

function saveTranslationCache(map: Map<string, string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(map)));
}

export function AutoTranslate({ children }: { children: React.ReactNode }) {
  const { language } = useKalohouse();
  const rootRef = useRef<HTMLDivElement>(null);
  const [showIndicator, setShowIndicator] = useState(false);
  const translatingRef = useRef(false);

  // Revert to English: restore all original text
  const revertToEnglish = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    const originals = getOriginalMap();
    if (originals.size === 0) return;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node: Text | null;
      while ((node = walker.nextNode() as Text | null)) {
        if (!node.textContent) continue;
        const trimmed = node.textContent.trim();
        if (originals.has(trimmed) && node.parentElement) {
          node.textContent = node.textContent.replace(trimmed, originals.get(trimmed)!);
          node.parentElement.removeAttribute(ATTR);
        }
    }

    localStorage.removeItem(ORIGINAL_KEY);
  }, []);

  // Translate DOM
  const translateDom = useCallback(async () => {
    if (translatingRef.current || language === "en") return;
    translatingRef.current = true;
    setShowIndicator(true);

    try {
      const root = rootRef.current;
      if (!root) return;

      const translationCache = getTranslationCache();
      const originals = getOriginalMap();
      const translatedTexts: string[] = [];
      const textNodes: Text[] = [];

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          if (!node.textContent || node.textContent.trim().length < 2)
            return NodeFilter.FILTER_REJECT;

          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (parent.closest(`[${ATTR}]`)) return NodeFilter.FILTER_REJECT;
          if (["SCRIPT", "STYLE", "CODE", "PRE", "KBD"].includes(parent.tagName))
            return NodeFilter.FILTER_REJECT;

          const text = node.textContent.trim();

          // Skip numbers, prices, URLs, short strings
          if (/^[\d\s%$€£RWF.,/()+\-:]+$/.test(text)) return NodeFilter.FILTER_REJECT;
          if (text.startsWith("http")) return NodeFilter.FILTER_REJECT;

          // Already cached — apply immediately
          if (translationCache.has(text)) {
            node.parentElement.setAttribute(ATTR, "true");
            node.textContent = node.textContent.replace(text, translationCache.get(text)!);
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        },
      });

      // Collect unique texts and their FIRST matching node
      const seen = new Set<string>();
      let node: Text | null;
      while ((node = walker.nextNode() as Text | null)) {
        const text = node.textContent!.trim();
        if (!seen.has(text)) {
          seen.add(text);
          translatedTexts.push(text);
          textNodes.push(node);

          // Store original for reversion
          if (!originals.has(text)) {
            originals.set(text, text);
          }
        }
      }

      if (translatedTexts.length === 0) return;

      // Batch translate
      for (let i = 0; i < translatedTexts.length; i += BATCH_SIZE) {
        const batch = translatedTexts.slice(i, i + BATCH_SIZE);
        const results = await translateTexts(batch, language);

        batch.forEach((original, j) => {
          const translated = results[j];
          if (translated && translated !== original) {
            translationCache.set(original, translated);
            originals.set(translated, original);
          }
        });
      }

      // Apply translations to DOM
      translatedTexts.forEach((original, idx) => {
        const translated = translationCache.get(original);
        if (!translated) return;

        const tn = textNodes[idx];
        if (tn && tn.parentElement && !tn.parentElement.closest(`[${ATTR}]`)) {
          tn.parentElement.setAttribute(ATTR, "true");
          tn.textContent = tn.textContent!.replace(original, translated);
        }
      });

      // Persist caches
      saveTranslationCache(translationCache);
      saveOriginalMap(originals);
    } catch (e) {
      console.error("AutoTranslate error:", e);
    } finally {
      translatingRef.current = false;
      setShowIndicator(false);
    }
  }, [language]);

  // Handle language changes
  useEffect(() => {
    if (language === "en") {
      revertToEnglish();
      localStorage.removeItem(CACHE_KEY);
      return;
    }
    // Small delay to let DOM settle after route change
    const timer = setTimeout(translateDom, 300);
    return () => clearTimeout(timer);
  }, [language, translateDom, revertToEnglish]);

  // Watch for dynamic DOM changes (e.g. from React re-renders)
  useEffect(() => {
    if (language === "en") return;
    const root = rootRef.current;
    if (!root) return;

    let timer: ReturnType<typeof setTimeout>;
    let pending = false;

    const observer = new MutationObserver(() => {
      if (pending) return;
      pending = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        pending = false;
        translateDom();
      }, 2000);
    });

    observer.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [language, translateDom]);

  return (
    <div ref={rootRef} className="relative">
      {showIndicator && (
        <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2 rounded-2xl bg-gold/90 px-4 py-2 text-sm font-bold text-navy-dark shadow-lg shadow-gold/20">
          <Loader2 className="size-4 animate-spin" />
          Translating...
        </div>
      )}
      {children}
    </div>
  );
}
