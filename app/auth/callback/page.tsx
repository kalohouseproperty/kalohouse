"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("kalohouse_pending_role") || "client";
    router.push(`/dashboard/${role}`);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220]">
      <div className="fixed right-4 top-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="flex flex-col items-center gap-4 text-center">
        <div className="size-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-secondary animate-pulse">Completing secure authentication...</p>
      </div>
    </div>
  );
}
