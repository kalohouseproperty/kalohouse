"use client";

import type { Metadata } from "next";
import { useState, useEffect } from "react";
import { Cookie, Shield, BarChart3, Target, Settings, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

const cookieCategories = [
  {
    id: "essential",
    label: "Essential Cookies",
    description: "Required for the Platform to function. These cannot be disabled.",
    icon: Shield,
    required: true,
    defaultEnabled: true,
  },
  {
    id: "functional",
    label: "Functional Cookies",
    description: "Remember your preferences, language settings, and login state.",
    icon: Settings,
    required: false,
    defaultEnabled: true,
  },
  {
    id: "analytics",
    label: "Analytics Cookies",
    description: "Help us understand how visitors interact with the Platform to improve performance.",
    icon: BarChart3,
    required: false,
    defaultEnabled: false,
  },
  {
    id: "marketing",
    label: "Marketing Cookies",
    description: "Used to deliver relevant advertisements and track campaign effectiveness.",
    icon: Target,
    required: false,
    defaultEnabled: false,
  },
];

export default function CookieSettingsPage() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("kalohouse-cookie-preferences");
    if (saved) {
      setPreferences(JSON.parse(saved));
    } else {
      const defaults: Record<string, boolean> = {};
      cookieCategories.forEach((c) => (defaults[c.id] = c.defaultEnabled));
      setPreferences(defaults);
    }
  }, []);

  const toggle = (id: string) => {
    const cat = cookieCategories.find((c) => c.id === id);
    if (cat?.required) return;
    setPreferences((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const save = () => {
    localStorage.setItem("kalohouse-cookie-preferences", JSON.stringify(preferences));
  };

  const acceptAll = () => {
    const all: Record<string, boolean> = {};
    cookieCategories.forEach((c) => (all[c.id] = true));
    setPreferences(all);
    localStorage.setItem("kalohouse-cookie-preferences", JSON.stringify(all));
  };

  const rejectOptional = () => {
    const essential: Record<string, boolean> = {};
    cookieCategories.forEach((c) => (essential[c.id] = c.required));
    setPreferences(essential);
    localStorage.setItem("kalohouse-cookie-preferences", JSON.stringify(essential));
  };

  return (
    <main className="min-h-screen bg-main-bg text-text-primary">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full -top-24 -left-24" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/20 px-4 py-2 mb-8">
            <Cookie className="size-4 text-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Preferences</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl mb-6 leading-tight">
            Cookie <span className="text-gold">Settings</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Manage how Kalohouse uses cookies and tracking technologies on your device.
          </p>
        </div>
      </section>

      {/* Cookie Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {cookieCategories.map((cat) => (
            <div
              key={cat.id}
              className={`glass-card rounded-2xl p-6 border transition-all ${
                preferences[cat.id] ? "border-gold/30 bg-gold/5" : "border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <cat.icon className="size-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{cat.label}</h3>
                    <p className="text-sm text-text-secondary mt-1">{cat.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggle(cat.id)}
                  disabled={cat.required}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    preferences[cat.id] ? "bg-gold" : "bg-white/10"
                  } ${cat.required ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span
                    className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${
                      preferences[cat.id] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {cat.required && (
                <p className="text-[10px] text-muted-text mt-3 ml-16">Always active — required for the Platform to function</p>
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button onClick={acceptAll} className="flex-1 h-12 rounded-xl font-bold">
              <CheckCircle2 className="size-4 mr-2" />
              Accept All
            </Button>
            <Button onClick={rejectOptional} variant="secondary" className="flex-1 h-12 rounded-xl font-bold">
              Reject Optional
            </Button>
            <Button onClick={save} variant="secondary" className="flex-1 h-12 rounded-xl font-bold">
              Save Preferences
            </Button>
          </div>

          {/* Info */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 mt-8 space-y-4 text-sm text-text-secondary leading-relaxed">
            <h3 className="font-bold text-text-primary">About Cookies</h3>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your experience.
            </p>
            <p>
              We use cookies to keep you logged in, remember your language preference, analyze how the Platform is used, and detect fraudulent activity. You can change your cookie settings at any time by revisiting this page.
            </p>
            <p>
              For more details, see our <Link href="/privacy-policy" className="text-gold hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
