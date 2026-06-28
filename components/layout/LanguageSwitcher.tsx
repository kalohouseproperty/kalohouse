"use client";

import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useKalohouse } from "@/components/providers/KalohouseProvider";
import { type Language } from "@/lib/translations";
import { cn } from "@/lib/utils";

const languages: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useKalohouse();

  const handleLanguageChange = (lang: Language) => {
    void setLanguage(lang);

    const params = new URLSearchParams(window.location.search);
    params.set("lang", lang);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div data-nyumba-t="true" className="flex items-center gap-1 rounded-full border border-white/8 bg-white/[0.03] p-1">
      <div className="flex size-7 items-center justify-center rounded-full bg-gold/10 text-gold-light">
        <Globe className="size-3.5" />
      </div>
      <div className="flex gap-0.5 pr-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            type="button"
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold transition-all",
              language === lang.code
                ? "bg-gold text-main-bg shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
