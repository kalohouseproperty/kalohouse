"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { registerAgentWithInvite, getInviteByToken } from "@/app/actions/auth";
import { Building2, ShieldCheck, Lock, MapPin } from "lucide-react";
import Image from "next/image";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      getInviteByToken(token).then((invite) => {
        if (invite?.name) setFullName(invite.name);
      });
    }
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="glass-card p-8 text-center max-w-md border-white/5">
          <ShieldCheck className="size-16 text-danger mx-auto mb-6 opacity-50" />
          <h1 className="text-2xl font-serif text-white mb-2">Invalid Access</h1>
          <p className="text-muted-text">An invitation token is required to access this page.</p>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await registerAgentWithInvite({ token, fullName, password });
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/auth?message=registration_success");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="fixed right-4 top-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="mb-8 text-center">
        <Image src="/kalohouse-v2.png" alt="Kalohouse" width={180} height={60} className="mx-auto" />
        <p className="text-gold font-serif mt-4 text-xl tracking-tight">Agent Onboarding</p>
      </div>

      <Card className="glass-card w-full max-w-md p-8 border-white/5 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Building2 className="size-32" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <h2 className="text-white font-serif text-xl">Complete Your Profile</h2>
            <p className="text-xs text-muted-text">As an invited agent, please provide your details to activate your account.</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-muted-text uppercase font-black tracking-widest px-1">Full Name</label>
              <div className="relative">
                <Input
                  required
                  disabled
                  value={fullName}
                  className="h-12 rounded-xl bg-white/5 border-white/10 text-white/50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-muted-text uppercase font-black tracking-widest px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                <Input
                  required
                  type="password"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-muted-text uppercase font-black tracking-widest px-1">Confirm Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                <Input
                  required
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 pl-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-gold text-black hover:bg-gold-light transition-all font-black"
          >
            {loading ? "Activating Account..." : "Activate Agent Account"}
          </Button>

          <p className="text-[10px] text-muted-text text-center italic">
            By activating, you agree to follow Kalohouse&apos;s field agent protocols and verification standards.
          </p>
        </form>
      </Card>
      
      <p className="mt-8 text-muted-text text-xs flex items-center gap-2">
        <MapPin className="size-3 text-gold" /> Serving the heart of Kigali
      </p>
    </div>
  );
}

export default function AgentRegistrationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold animate-pulse font-serif text-xl">Loading onboarding...</div>
      </div>
    }>
      <RegistrationForm />
    </Suspense>
  );
}
