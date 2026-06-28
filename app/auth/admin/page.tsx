"use client";

import { useEffect } from "react";
import "../auth.css";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function AdminAuthPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/auth");
      return;
    }
    if ((session.user as any).role !== "admin") {
      void signOut({ redirect: false });
      router.replace("/auth");
    }
  }, [session, router]);

  if (session && (session.user as any).role !== "admin") return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="glass-card gold-ring auth-wrapper p-6">
        <h1 className="text-2xl font-serif text-white text-center mb-6">Admin Access</h1>
        <p className="text-sm text-text-secondary text-center">
          Admin access requires administrative privileges.
        </p>
        <Button type="button" className="mt-5 w-full h-10 bg-gold text-navy-primary font-bold hover:bg-gold-light" onClick={() => router.push("/auth")}>
          Go To Sign In
        </Button>
      </div>
    </div>
  );
}
