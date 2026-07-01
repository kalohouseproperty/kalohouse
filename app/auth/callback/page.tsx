"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useKalohouse } from "@/components/providers/KalohouseProvider";

type SessionUserWithCreatedAt = {
  createdAt?: string;
};

export default function AuthCallback() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useKalohouse();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && session?.user) {
      const userWithCreatedAt = session.user as SessionUserWithCreatedAt;
      const createdAt = userWithCreatedAt.createdAt;
      const isNewUser =
        createdAt &&
        new Date().getTime() - new Date(createdAt).getTime() < 2 * 60 * 1000;

      if (isNewUser && !redirecting) {
        toast(
          "Account created! We sent a verification email to your address. Please check your inbox.",
          "success"
        );
        setRedirecting(true);
      }

      const role = (session.user as { role?: string }).role || "owner";
      router.replace(`/dashboard/${role}`);
    } else if (status === "unauthenticated") {
      router.replace("/auth");
    }
  }, [status, session, router, toast, redirecting]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-bg">
      <div className="fixed right-4 top-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="flex flex-col items-center gap-4 text-center">
        <div className="size-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-secondary animate-pulse">
          Completing secure authentication...
        </p>
      </div>
    </div>
  );
}
