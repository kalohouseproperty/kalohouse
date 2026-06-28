"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { resetPassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetShell message="Loading reset form..." />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const result = await resetPassword(token, password);
    if (result.error) {
      setMessage(result.error);
      setSuccess(false);
    } else {
      setMessage("Password updated. You can now sign in.");
      setSuccess(true);
      setPassword("");
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#0b1120]">
      <section className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold text-white">Reset password</h1>
        <p className="mt-2 text-sm text-text-secondary">Choose a new password for your account.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="New password"
            required
            minLength={8}
            className="h-12 bg-white/5 border-white/10"
          />
          {message ? (
            <p className={`text-sm ${success ? "text-green-300" : "text-red-300"}`}>{message}</p>
          ) : null}
          <Button type="submit" disabled={isLoading || !token} className="w-full">
            {isLoading ? "Updating..." : "Update password"}
          </Button>
          <Button asChild type="button" variant="ghost" className="w-full">
            <Link href="/auth">Back to login</Link>
          </Button>
        </form>
      </section>
    </main>
  );
}

function ResetShell({ message }: { message: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#0b1120]">
      <section className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold text-white">Reset password</h1>
        <p className="mt-2 text-sm text-text-secondary">{message}</p>
      </section>
    </main>
  );
}
