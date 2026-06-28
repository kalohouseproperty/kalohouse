"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useKalohouse } from "./KalohouseProvider";
import { translateTexts } from "@/lib/groq-translate";
import { Loader2 } from "lucide-react";

const ATTR = "data-nyumba-t";
const BATCH_SIZE = 50;
const CACHE_KEY = "nyumba-translations";

export function AutoTranslate({ children }: { children: React.ReactNode }) {
  const { language } = useKalohouse();
  console.log("AutoTranslate received language:", language); // DEBUG
  const rootRef = useRef<HTMLDivElement>(null);
  const cacheRef = useRef<Map<string, string>>(new Map());
  const translatingRef = useRef(false);
  const [showIndicator, setShowIndicator] = useState(false);

  // Load cached translations from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          cacheRef.current = new Map(Object.entries(parsed));
        }
      }
    } catch (e) {
      console.error("Failed to load translation cache:", e);
    }
  }, []);

  // Save translations to localStorage when they change
  useEffect(() => {
    if (language === "en") return;
    try {
      const cacheEntries = Array.from(cacheRef.current.entries());
      localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(cacheEntries)));
    } catch (e) {
      console.error("Failed to save translation cache:", e);
    }
  }, [language]);

  const translateDom = useCallback(async () => {
    if (translatingRef.current || language === "en") return;
    translatingRef.current = true;

    try {
      const root = rootRef.current;
      if (!root) return;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          if (!node.textContent || node.textContent.trim().length < 2) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent || parent.hasAttribute(ATTR) || parent.closest(`[${ATTR}]`)) return NodeFilter.FILTER_REJECT;
          if (parent.tagName === "SCRIPT" || parent.tagName === "STYLE" || parent.tagName === "CODE") return NodeFilter.FILTER_REJECT;
          const text = node.textContent.trim();
          if (/^[\d\s%$€£RWF.,/()+\-:]+$/.test(text) || text.startsWith("http")) return NodeFilter.FILTER_REJECT;
          if (cacheRef.current.has(text)) {
            parent.setAttribute(ATTR, "true");
            node.textContent = text.replace(text, cacheRef.current.get(text)!);
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      const texts: string[] = [];
      const textNodes: Text[] = [];

      let node: Text | null;
      while ((node = walker.nextNode() as Text | null)) {
        const text = node.textContent.trim();
        if (!text) continue;
        if (!texts.includes(text)) {
          texts.push(text);
          textNodes.push(node);
        }
      }

      if (texts.length === 0) return;

      for (let i = 0; i < texts.length; i += BATCH_SIZE) {
        const batch = texts.slice(i, i + BATCH_SIZE);
        const translated = await translateTexts(batch, language);
        batch.forEach((original, j) => {
          if (translated[j] && translated[j] !== original) {
            cacheRef.current.set(original, translated[j]);
          }
        });
      }

      textNodes.forEach((tn, idx) => {
        const original = texts[idx];
        const translation = cacheRef.current.get(original);
        if (translation && tn.parentElement) {
          tn.parentElement.setAttribute(ATTR, "true");
          tn.textContent = original.replace(original, translation);
        }
      });
    } catch (e) {
      console.error("AutoTranslate error:", e);
    } finally {
      translatingRef.current = false;
    }
  }, [language]);

  useEffect(() => {
    if (language === "en") {
      cacheRef.current.clear();
      setShowIndicator(false);
      return;
    }
    setShowIndicator(true);
    translateDom().finally(() => setShowIndicator(false));
  }, [language, translateDom]);

  useEffect(() => {
    if (language === "en") return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(translateDom, 1500);
    });

    if (rootRef.current) {
      observer.observe(rootRef.current, { childList: true, subtree: true });
    }

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
