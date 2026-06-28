"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Mail, Lock, User as UserIcon } from "lucide-react";

import "./auth.css";
import { useKalohouse } from "@/components/providers/KalohouseProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { registerUser, requestPasswordReset } from "@/app/actions/auth";

type SessionRoleUser = {
  role?: "client" | "owner" | "agent" | "admin";
};

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { toast } = useKalohouse();
  const redirectTo = searchParams.get("next") || "";
  const requestedMode = searchParams.get("mode");

  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">(
    requestedMode === "signup" ? "signup" : "login"
  );
  const [signupRole, setSignupRole] = useState<"client" | "owner">("client");

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const role = (session.user as SessionRoleUser).role || "client";
      if (redirectTo.startsWith("/")) {
        router.replace(redirectTo);
        return;
      }
      
      // Clients go to properties marketplace, others to dashboard
      if (role === "client") {
        router.replace("/properties");
      } else {
        router.replace(`/dashboard/${role}`);
      }
    }
  }, [status, session, router, redirectTo]);
  
  // Credentials state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [nationality, setNationality] = useState("");
  const [nationalId, setNationalId] = useState("");

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    localStorage.setItem("kalohouse_pending_role", signupRole);

    try {
      await signIn("google", {
        callbackUrl: redirectTo.startsWith("/") ? redirectTo : "/properties",
        redirect: true,
      });
    } catch (err: unknown) {
      console.error("OAuth Error:", err);
      toast("Auth Error: Could not start Google flow. Try refreshing.", "danger");
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
          role: signupRole,
          nationality,
          nationalId,
        });

        if (result.error) {
          toast(result.error, "danger");
          setIsLoading(false);
          return;
        }

        const successMessage = "message" in result 
          ? result.message || "Account created. Check your email to verify your account."
          : "Account created. Check your email to verify your account.";
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

      // Login - use redirect: false to handle it manually in useEffect
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast("Invalid credentials or email not verified.", "danger");
        setIsLoading(false);
      }
      // If successful, the useEffect will handle redirection when session updates
    } catch (err: unknown) {
      console.error("Auth Error:", err);
      toast("An error occurred during authentication.", "danger");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="auth-wrapper relative overflow-hidden flex flex-col items-center">
        <div className="flex justify-center mb-8">
          <div className="relative size-20 overflow-hidden rounded-full border border-gold/30 shadow-[0_0_20px_rgba(201,166,70,0.3)]">
            <Image src="/kalohouse.png" alt="Kalohouse Logo" fill className="object-cover" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Kalohouse</h1>
          <p className="text-text-secondary text-sm">Rwanda&apos;s trust-first property marketplace.</p>
        </div>

        <div className="w-full flex flex-col gap-4">
          {/* Auth Mode Toggle */}
          <div className="flex bg-white/5 p-1 rounded-xl mb-2">
            <button 
              onClick={() => setAuthMode("login")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authMode === "login" || authMode === "forgot" ? "bg-gold text-navy-dark" : "text-text-secondary hover:text-white"}`}
            >
              LOGIN
            </button>
            <button 
              onClick={() => setAuthMode("signup")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authMode === "signup" ? "bg-gold text-navy-dark" : "text-text-secondary hover:text-white"}`}
            >
              SIGN UP
            </button>
          </div>

          <form onSubmit={handleCredentialsAuth} className="space-y-4">
            {authMode === "signup" && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gold/80 ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-secondary/50" />
                    <Input 
                      placeholder="John Doe" 
                      className="pl-11 h-12 bg-white/5 border-white/10" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold/80 ml-1">
                    Select your role
                  </label>
                  <Select 
                    value={signupRole} 
                    onChange={(e) => {
                      const newRole = e.target.value;
                      if (newRole === "client" || newRole === "owner") {
                        setSignupRole(newRole);
                      }
                    }} 
                    className="h-12 bg-white/5 border-white/10"
                  >
                    <option value="client">I&apos;m a Client (Buy/Rent)</option>
                    <option value="owner">I&apos;m an Owner (Selling)</option>
                  </Select>
                </div>

                {signupRole === "owner" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gold/80 ml-1">Nationality</label>
                      <Input 
                        placeholder="e.g., Rwandan" 
                        className="h-12 bg-white/5 border-white/10" 
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gold/80 ml-1">National ID Number</label>
                      <Input 
                        placeholder="Enter your national ID" 
                        className="h-12 bg-white/5 border-white/10" 
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gold/80 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-secondary/50" />
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-11 h-12 bg-white/5 border-white/10" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {authMode !== "forgot" && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gold/80 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-secondary/50" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-11 h-12 bg-white/5 border-white/10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            )}

            {authMode === "login" && (
              <button
                type="button"
                onClick={() => setAuthMode("forgot")}
                className="text-xs font-bold text-gold/80 hover:text-gold"
              >
                Forgot password?
              </button>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gold text-navy-dark hover:bg-gold-light font-bold rounded-xl transition-all shadow-lg shadow-gold/10"
            >
              {isLoading ? "Processing..." : authMode === "login" ? "Sign In" : authMode === "forgot" ? "Send Reset Link" : "Create Account"}
            </Button>

            {authMode === "forgot" && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAuthMode("login")}
                className="w-full"
              >
                Back to login
              </Button>
            )}
          </form>

          <div className="relative py-2 mt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="bg-[#111827] px-4 text-text-secondary/50">OR</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full h-12 bg-[#ffffff] text-[#3c4043] hover:bg-[#f8f9fa] border border-[#dadce0] font-semibold gap-3 rounded-xl transition-all active:scale-95 shadow-sm disabled:opacity-50"
          >
            <svg className="size-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <p className="text-[11px] text-center text-text-secondary/60 leading-relaxed px-4 mt-2">
            By continuing, you agree to Kalohouse&apos;s <a href="#" className="underline hover:text-gold transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-gold transition-colors">Privacy Policy</a>.
          </p>
        </div>

        <div className="mt-8 flex gap-2 items-center justify-center text-[10px] uppercase tracking-widest text-gold/30 font-bold border-t border-white/5 pt-6 w-full">
          <ShieldCheck className="size-3.5" /> Kalohouse Secured Access
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
