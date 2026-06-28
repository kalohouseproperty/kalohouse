"use client";

import { usePathname } from "next/navigation";
import { KalohouseProvider } from "@/components/providers/KalohouseProvider";
import { AutoTranslate } from "@/components/providers/AutoTranslate";
import { Footer } from "@/components/layout/Footer";
import type { Language } from "@/lib/translations";

export function ClientLayout({ children, lang }: { children: React.ReactNode; lang?: Language }) {
  const pathname = usePathname();
  const showFooter = !pathname.startsWith("/dashboard") && !pathname.startsWith("/auth");

  return (
    <KalohouseProvider initialLanguage={lang}>
      <AutoTranslate>
        {children}
        {showFooter && <Footer />}
      </AutoTranslate>
    </KalohouseProvider>
  );
}
