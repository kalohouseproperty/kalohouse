"use client";

import { usePathname } from "next/navigation";
import { KalohouseProvider } from "@/components/providers/KalohouseProvider";
import { Footer } from "@/components/layout/Footer";
import type { Language } from "@/lib/translations";

export function ClientLayout({ children, lang }: { children: React.ReactNode; lang?: Language }) {
  const pathname = usePathname();
  const showFooter = !pathname.startsWith("/dashboard") && !pathname.startsWith("/auth");

  return (
    <KalohouseProvider initialLanguage={lang}>
      {children}
      {showFooter && <Footer />}
    </KalohouseProvider>
  );
}
