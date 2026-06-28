"use client";

import { createContext, startTransition, useContext, useEffect, useState, useCallback, useRef } from "react";
import { SavedPropertiesSidebar } from "@/components/cards/SavedPropertiesSidebar";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createId } from "@/lib/format";
import { type Language, translations } from "@/lib/translations";
import { parseLanguage } from "@/lib/i18n-server";
import { translateTexts } from "@/lib/groq-translate";
import type { User, UserRole, KalohouseState } from "@/types/models";
import type { Property } from "@/types/models";
import { seedState } from "@/data/seed";

const LANGUAGE_KEY = "kalohouse_language";

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (stored === "en" || stored === "fr") return stored;
  } catch {}
  return "en";
}

function persistLanguage(lang: Language) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_KEY, lang);
  document.cookie = `language=${lang};path=/;max-age=31536000;SameSite=Lax`;
}

type Toast = {
  id: string;
  title: string;
  tone?: "success" | "warning" | "danger" | "info";
  isDev?: boolean;
};

type StoreContext = {
  state: KalohouseState;
  currentUser: User | null;
  loading: boolean;
  toasts: Toast[];
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  toast: (title: string, tone?: Toast["tone"]) => void;
  saved_property_ids: string[];
  savedPropertiesData: Record<string, Property>;
  toggleSaveProperty: (propertyId: string, propertyData?: Property) => void;
  showSavedPanel: boolean;
  openSavedPanel: () => void;
  closeSavedPanel: () => void;
  logout: () => Promise<void>;
  updateAgent: (id: string, data: Partial<User>) => void;
};

type SessionUserFields = {
  id?: string;
  role?: UserRole;
  isVerified?: boolean;
};

const KalohouseContext = createContext<StoreContext | null>(null);
const SAVED_PROPERTIES_KEY = "kalohouse_saved_property_ids";
const SAVED_DATA_KEY = "kalohouse_saved_properties_data";

function getSavedPropertyIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(SAVED_PROPERTIES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function setSavedPropertyIds(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SAVED_PROPERTIES_KEY, JSON.stringify(ids));
}

function getSavedPropertiesData(): Record<string, Property> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(SAVED_DATA_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function setSavedPropertiesData(data: Record<string, Property>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SAVED_DATA_KEY, JSON.stringify(data));
}

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";

  const urlLang = new URL(window.location.href).searchParams.get("lang");
  if (urlLang) return parseLanguage(urlLang);

  return parseLanguage(localStorage.getItem(LANGUAGE_KEY));
}

export function KalohouseProvider({ children, initialLanguage }: { children: React.ReactNode; initialLanguage?: Language }) {
  const { data: session, status } = useSession();
  const [appState, setAppState] = useState<KalohouseState>(seedState);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [language, setLanguageState] = useState<Language>(initialLanguage ?? getStoredLanguage);
const [saved_property_ids, setSavedPropertyIdsState] = useState<string[]>([]);
const [savedPropertiesData, setSavedPropertiesDataState] = useState<Record<string, Property>>({});
const [showSavedPanel, setShowSavedPanel] = useState(false);
const openSavedPanel = useCallback(() => setShowSavedPanel(true), []);
const closeSavedPanel = useCallback(() => setShowSavedPanel(false), []);

  useEffect(() => {
    const ids = getSavedPropertyIds();
    const data = getSavedPropertiesData();
    setSavedPropertyIdsState(ids);
    setSavedPropertiesDataState(data);
  }, []);

  useEffect(() => {
  if (status !== "loading") {
    startTransition(() => {
      if (session?.user) {
        const sessionUser = session.user as typeof session.user & SessionUserFields;
        // Find user in seed state or use session
        const dbUser = appState.users.find(u => u.email === sessionUser.email);
        const saved_property_ids = dbUser?.saved_property_ids || [];
        setCurrentUser(dbUser || {
          id: sessionUser.id || createId("user"),
          name: sessionUser.name || "User",
          email: sessionUser.email || "",
          role: sessionUser.role || "client",
          status: "active",
          isVerified: sessionUser.isVerified || false,
          mapAccessPaid: false,
          saved_property_ids: saved_property_ids,
          createdAt: new Date().toISOString(),
        });
        // Load saved properties from user record
        setSavedPropertyIdsState(saved_property_ids);
        setSavedPropertiesDataState(getSavedPropertiesData());
      } else {
        setCurrentUser(null);
        // Reset saved properties for unauthenticated users
        setSavedPropertyIdsState(getSavedPropertyIds());
        setSavedPropertiesDataState(getSavedPropertiesData());
      }
      setLoading(false);
    });
  }
}, [status, session, appState.users]);

  const toast = useCallback((title: string, tone: Toast["tone"] = "success") => {
    setToasts((items) => {
      // Prevent duplicate messages if one is already showing
      if (items.some(item => item.title === title)) return items;
      
      const id = createId("toast");
      const isDev = process.env.NODE_ENV === "development" && (title.includes("http://") || title.includes("https://"));
      const next = [...items, { id, title, tone, isDev }];
      
      // Development links stay longer (30 seconds), production toasts disappear after 5 seconds
      const timeout = isDev ? 30000 : 5000;
      window.setTimeout(() => {
        setToasts((curr) => curr.filter((item) => item.id !== id));
      }, timeout);
      
      return next;
    });
  }, []);

  const GROQ_CACHE_KEY = "nyumbanziza_groq_translations";

  const getCachedGroq = useCallback((): Record<string, string> => {
    if (typeof window === "undefined") return {};
    try {
      const cached = localStorage.getItem(GROQ_CACHE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  }, []);

  const t = useCallback(
    (key: string) => {
      const langData = translations[language] as Record<string, string>;
      if (langData[key]) return langData[key];
      if (language === "en") return key;
      const groqCache = getCachedGroq();
      return groqCache[key] || key;
    },
    [language, getCachedGroq]
  );

  const fetchingRef = useRef(false);

  const setLanguage = useCallback(async (lang: Language) => {
    console.log("setLanguage called with:", lang); // DEBUG
    setLanguageState(lang);
    persistLanguage(lang);

    if (lang === "en") {
      localStorage.removeItem(GROQ_CACHE_KEY);
      return;
    }

    const langData = translations[lang] as Record<string, string>;
    const enData = translations.en as Record<string, string>;
    const missingKeys = Object.keys(enData).filter((k) => !langData[k]);

    if (missingKeys.length === 0 || fetchingRef.current) return;

    fetchingRef.current = true;
    const results = await translateTexts(missingKeys, lang);
    const newCache: Record<string, string> = {};
    missingKeys.forEach((key, i) => {
      newCache[key] = results[i] || key;
    });
    localStorage.setItem(GROQ_CACHE_KEY, JSON.stringify(newCache));
    fetchingRef.current = false;
  }, [getCachedGroq]);

const toggleSaveProperty = useCallback(async (propertyId: string, propertyData?: Property) => {
  setSavedPropertyIdsState((prev) => {
    const isAdding = !prev.includes(propertyId);
    const next = isAdding ? [...prev, propertyId] : prev.filter((id) => id !== propertyId);
    setSavedPropertyIds(next);

    if (isAdding && propertyData) {
      setSavedPropertiesDataState((prevData) => {
        const newData = { ...prevData, [propertyId]: propertyData };
        setSavedPropertiesData(newData);
        return newData;
      });
    } else if (!isAdding) {
      setSavedPropertiesDataState((prevData) => {
        const { [propertyId]: _, ...rest } = prevData;
        setSavedPropertiesData(rest);
        return rest;
      });
    }

    // Sync with user account if authenticated
    if (currentUser) {
      // This would normally call an API endpoint to update the user's saved properties in the database
      // For now, we'll just log this as a placeholder for the actual implementation
      console.log('Syncing saved property with user account:', { userId: currentUser.id, propertyId, saved: isAdding });
    }

    return next;
  });
}, [currentUser]);

  const logout = useCallback(async () => {
    await signOut({ redirect: true, callbackUrl: "/auth" });
  }, []);

  const updateAgent = useCallback((id: string, data: Partial<User>) => {
    setAppState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, ...data } : u)
    }));
    toast("Agent status updated locally", "success");
  }, [toast]);

  return (
    <KalohouseContext.Provider
      value={{
        state: appState,
        currentUser,
        loading,
        toasts,
        language,
        setLanguage,
        t,
        toast,
        saved_property_ids,
        savedPropertiesData,
        toggleSaveProperty,
        showSavedPanel,
        openSavedPanel,
        closeSavedPanel,
        logout,
        updateAgent,
      }}
    >
      {children}

      {/* Global Toasts - Centered at the top for maximum visibility */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 w-full max-w-2xl px-4 pointer-events-none">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between gap-3 rounded-2xl border px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-in fade-in zoom-in-95 slide-in-from-top-4 pointer-events-auto ${
              item.tone === "success"
                ? "border-success/20 bg-success/20 text-success"
                : item.tone === "danger"
                  ? "border-danger/20 bg-danger/20 text-danger"
                  : "border-gold/30 bg-gold/20 text-gold-light"
              }`}
          >
            {(() => {
              const urlMatch = item.title.match(/(https?:\/\/[^\s]+)/);
              if (item.isDev && urlMatch) {
                const url = urlMatch[1];
                const textBeforeUrl = item.title.substring(0, urlMatch.index);
                return (
                  <div className="flex-1 flex flex-col gap-2">
                    {textBeforeUrl && <p className="text-sm font-bold tracking-wide">{textBeforeUrl}</p>}
                    <a 
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline hover:opacity-80 transition-opacity break-all"
                    >
                      {url}
                    </a>
                  </div>
                );
              }
              return <p className="text-sm font-bold tracking-wide flex-1 break-words">{item.title}</p>;
            })()}
            {item.isDev && (
              <button
                onClick={() => setToasts((curr) => curr.filter((t) => t.id !== item.id))}
                className="flex-shrink-0 ml-4 text-lg opacity-60 hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </KalohouseContext.Provider>
  );
}

export function useKalohouse() {
  const context = useContext(KalohouseContext);
  if (!context) throw new Error("useKalohouse must be used within KalohouseProvider");
  return context;
}

export function useRequireRole(role: UserRole) {
  const { currentUser, loading } = useKalohouse();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!currentUser || (currentUser.role !== role && currentUser.role !== "admin"))) {
      router.replace("/auth");
    }
  }, [currentUser, loading, role, router]);

  return { currentUser, loading };
}
