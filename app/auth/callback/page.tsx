"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useKalohouse } from "@/components/providers/KalohouseProvider";

export default function AuthCallback() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useKalohouse();
  const toastShown = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    const createdAt = (session.user as any).createdAt as string | undefined;

    if (createdAt && !toastShown.current) {
      const diff = Date.now() - new Date(createdAt).getTime();
      if (diff < 2 * 60_000) {
        toastShown.current = true;
        toast(
          "Account created! We sent a verification email to your address. Please check your inbox.",
          "success"
        );
      }
    }

    const role = ((session.user as any).role as string) || "owner";
    router.replace(`/dashboard/${role}`);
  }, [status, session, router, toast]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-bg">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="size-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary animate-pulse">
          Completing secure authentication...
        </p>
      </div>
    </div>
  );
}
