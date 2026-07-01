"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useKalohouse } from "@/components/providers/KalohouseProvider";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { toast } = useKalohouse();
  const toastShown = useRef(false);
  const [message, setMessage] = useState("Completing secure authentication...");

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    const createdAt = (session.user as any).createdAt as string | undefined;
    const nextPath = searchParams.get("next")?.startsWith("/") ? searchParams.get("next") : "/properties";

    if (createdAt && !toastShown.current) {
      const diff = Date.now() - new Date(createdAt).getTime();
      if (diff < 2 * 60_000) {
        toastShown.current = true;
        toast(
          "Your Google account is connected. We sent a verification email if needed.",
          "success"
        );
      }
    }

    setMessage("Authentication complete. Redirecting...");
    router.replace(nextPath ?? "/properties");
  }, [status, session, router, toast, searchParams]);

  useEffect(() => {
    if (status === "unauthenticated") {
      setMessage("Authentication was not completed. Redirecting to sign in...");
      const timeout = window.setTimeout(() => {
        router.replace("/auth");
      }, 1200);

      return () => window.clearTimeout(timeout);
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-bg">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="size-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary animate-pulse">{message}</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-main-bg" /> }>
      <AuthCallbackContent />
    </Suspense>
  );
}
