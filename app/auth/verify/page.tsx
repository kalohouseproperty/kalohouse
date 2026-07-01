"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { verifyEmail } from "@/app/actions/auth";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyShell message="Verifying your email..." />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      const result = await verifyEmail(token);
      if (cancelled) return;

      if (result.error) {
        setStatus("error");
        setMessage(result.error);
        return;
      }

      setStatus("success");
      setMessage("Your email is verified. You can now sign in.");
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-main-bg">
      <div className="fixed right-4 top-4 z-20">
        <LanguageSwitcher />
      </div>

      <section className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6 text-center">
        <h1 className="text-2xl font-bold text-white">Email verification</h1>
        <p className={`mt-4 text-sm ${status === "error" ? "text-red-300" : "text-text-secondary"}`}>
          {message}
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href="/auth">Back to login</Link>
        </Button>
      </section>
    </main>
  );
}

function VerifyShell({ message }: { message: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-main-bg">
      <div className="fixed right-4 top-4 z-20">
        <LanguageSwitcher />
      </div>

      <section className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6 text-center">
        <h1 className="text-2xl font-bold text-white">Email verification</h1>
        <p className="mt-4 text-sm text-text-secondary">{message}</p>
      </section>
    </main>
  );
}
