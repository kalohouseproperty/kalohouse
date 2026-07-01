"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

import "./auth.css";
import { useKalohouse } from "@/components/providers/KalohouseProvider";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser, requestPasswordReset } from "@/app/actions/auth";

type SessionRoleUser = {
  role?: "client" | "owner" | "agent" | "admin";
};

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { toast, t } = useKalohouse();
  const redirectTo = searchParams.get("next") || "";
  const requestedMode = searchParams.get("mode");
  const tabRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">(
    requestedMode === "signup" ? "signup" : "login"
  );
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const role = (session.user as SessionRoleUser).role || "client";
      if (redirectTo.startsWith("/")) {
        router.replace(redirectTo);
        return;
      }
      if (role === "client") {
        router.replace("/properties");
      } else {
        router.replace(`/dashboard/${role}`);
      }
    }
  }, [status, session, router, redirectTo]);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/auth/callback",
        redirect: true,
      });
    } catch (err: unknown) {
      console.error("Google OAuth error:", err);
      toast("Could not start Google sign-in. Please try again.", "danger");
      setIsLoading(false);
    }
  };

  const handleCredentialsAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === "signup") {
        const result = await registerUser({
          email,
          password,
          fullName,
          role: "owner",
        });

        if (result.error) {
          toast(result.error, "danger");
          setIsLoading(false);
          return;
        }

        const successMessage = "message" in result
          ? result.message || "Account created. We sent a verification email. Check your inbox to verify your account."
          : "Account created. We sent a verification email. Check your inbox to verify your account.";
        toast(successMessage, "success");
        setAuthMode("login");
        setIsLoading(false);
        return;
      }

      if (authMode === "forgot") {
        const result = await requestPasswordReset(email);
        if (result.error) {
          toast(result.error, "danger");
          setIsLoading(false);
          return;
        }
        const resetMessage = "message" in result
          ? result.message || "If that email exists, a reset link was sent."
          : "If that email exists, a reset link was sent.";
        toast(resetMessage, "success");
        setAuthMode("login");
        setIsLoading(false);
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast("Invalid credentials or email not verified.", "danger");
        setIsLoading(false);
      }
    } catch (err: unknown) {
      console.error("Auth Error:", err);
      toast("An error occurred during authentication.", "danger");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      <div className="fixed right-4 top-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Left Panel - Brand (visible on desktop, hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] auth-brand-panel relative items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 premium-grid opacity-[0.06]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/[0.07] blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gold/[0.04] blur-[120px]" />
        </div>
        
        <div className="relative z-10 max-w-lg px-16">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="relative size-14 overflow-hidden rounded-2xl border border-gold/20 shadow-[0_0_30px_rgba(201,166,70,0.15)]">
              <Image src="/kalohouse-v2.png" alt="Kalohouse" fill className="object-cover" />
            </div>
            <span className="font-serif text-3xl text-white tracking-tight">Kalohouse</span>
          </div>

          {/* Hero Text */}
          <h1 className="font-serif text-[3.5rem] text-white leading-[1.05] mb-6 tracking-tight">
            Find your next{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-gold">home</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-gold/20 -skew-x-3" />
            </span>{" "}
            with confidence.
          </h1>
          
          <p className="text-text-secondary/60 text-base leading-relaxed mb-14 max-w-md">
            {t("heroSubtitle")}
          </p>

          {/* Trust Indicators */}
          <div className="space-y-5">
            {[
              { icon: ShieldCheck, text: "Agent-verified listings" },
              { icon: CheckCircle2, text: "Secure escrow payments" },
              { icon: Sparkles, text: "Buyer protection guarantee" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <item.icon className="size-5 text-gold/60" />
                </div>
                <span className="text-sm text-text-secondary/50 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-start lg:items-center justify-center p-5 sm:p-8 bg-main-bg relative overflow-y-auto">
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-gold/[0.02] blur-[100px]" />
          <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] rounded-full bg-gold/[0.015] blur-[80px]" />
        </div>

        <div className="w-full max-w-[420px] relative z-10 py-4 sm:py-0 my-auto">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-6 lg:hidden">
            <div className="relative size-16 overflow-hidden rounded-2xl border border-gold/20 shadow-[0_0_25px_rgba(201,166,70,0.2)]">
              <Image src="/kalohouse-v2.png" alt="Kalohouse" fill className="object-cover" />
            </div>
          </div>

          {/* Header */}
          <div className="mb-7 auth-fade-in-up">
            <h2 className="text-[1.6rem] font-bold text-white mb-1.5 tracking-tight">
              {authMode === "login" ? "Welcome back" : authMode === "signup" ? "Create your account" : "Reset password"}
            </h2>
            <p className="text-text-secondary/45 text-[13px]">
              {authMode === "login" 
                ? "Sign in to access your dashboard" 
                : authMode === "signup" 
                  ? "Join Rwanda's trusted property marketplace"
                  : "Enter your email to receive a reset link"}
            </p>
          </div>

          {/* Mode Tabs */}
          {authMode !== "forgot" && (
            <div className="relative flex bg-white/[0.025] p-1 rounded-2xl mb-7 border border-white/[0.04] auth-fade-in-up auth-fade-in-up-delay-1">
              <div
                ref={tabRef}
                className="auth-tab-indicator"
                style={{
                  left: authMode === "login" ? "4px" : "calc(50% + 2px)",
                  width: "calc(50% - 6px)",
                }}
              />
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`relative z-10 flex-1 py-2.5 text-xs font-bold rounded-xl transition-colors duration-300 ${
                  authMode === "login" ? "text-main-bg" : "text-text-secondary/40 hover:text-white/60"
                }`}
              >
                {t("login")}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className={`relative z-10 flex-1 py-2.5 text-xs font-bold rounded-xl transition-colors duration-300 ${
                  authMode === "signup" ? "text-main-bg" : "text-text-secondary/40 hover:text-white/60"
                }`}
              >
                {t("signup")}
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCredentialsAuth} className="space-y-4">
            {/* Signup Fields */}
            {authMode === "signup" && (
              <div className="space-y-3.5 auth-form-animate">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary/35 ml-1">{t("name")}</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-secondary/20" />
                    <Input 
                      placeholder="John Doe" 
                      className="auth-input pl-12 h-[48px]" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary/35 ml-1">{t("email")}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-secondary/20" />
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="auth-input pl-12 h-[48px]" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            {authMode !== "forgot" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary/35">{t("password")}</label>
                  {authMode === "login" && (
                    <button
                      type="button"
                      onClick={() => setAuthMode("forgot")}
                      className="text-[10px] font-bold text-gold/50 hover:text-gold transition-colors uppercase tracking-wider"
                    >
                      {t("forgotPassword")}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-secondary/20" />
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    className="auth-input pl-12 pr-12 h-[48px]" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary/20 hover:text-text-secondary/50 transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="auth-submit w-full h-[48px] rounded-xl font-bold text-sm mt-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2.5">
                  <div className="size-4 border-2 border-main-bg/30 border-t-main-bg rounded-full animate-spin" />
                  Processing...
                </div>
              ) : authMode === "login" ? (
                <span className="flex items-center justify-center gap-2">
                  {t("signin")} <ArrowRight className="size-4" />
                </span>
              ) : authMode === "forgot" ? (
                "Send Reset Link"
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {t("createAccount")} <ArrowRight className="size-4" />
                </span>
              )}
            </Button>

            {authMode === "forgot" && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAuthMode("login")}
                className="w-full h-[48px] text-text-secondary/45 hover:text-white"
              >
                {t("backToLogin")}
              </Button>
            )}
          </form>

          {/* Divider */}
          {authMode !== "forgot" && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.04]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-main-bg px-4 text-[10px] uppercase tracking-[0.25em] font-bold text-text-secondary/20">or</span>
                </div>
              </div>

              {/* Google */}
              <Button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="auth-google w-full h-[48px] rounded-xl font-semibold text-sm gap-3"
              >
                <svg className="size-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
            </>
          )}

          {/* Terms */}
          <p className="text-[10px] text-center text-text-secondary/20 leading-relaxed mt-6 px-4">
            By continuing, you agree to Kalohouse&apos;s{" "}
            <a href="/terms-of-service" className="text-gold/45 hover:text-gold transition-colors underline underline-offset-2 decoration-gold/15">{t("termsOfService")}</a>
            {" "}&{" "}
            <a href="/privacy-policy" className="text-gold/45 hover:text-gold transition-colors underline underline-offset-2 decoration-gold/15">{t("privacyPolicy")}</a>
          </p>

          {/* Footer */}
          <div className="mt-8 pt-5 border-t border-white/[0.03] flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-text-secondary/12 font-bold">
            <ShieldCheck className="size-3" />
            Secured by Kalohouse
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-main-bg" />}>
      <AuthPageContent />
    </Suspense>
  );
}
