import type { Metadata } from "next";
import { ShieldAlert, AlertTriangle, CheckCircle2, Phone, Mail, Lock, Eye, Flag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

export const metadata: Metadata = {
  title: "Anti-Fraud Policy | Kalohouse",
  description:
    "Learn how Kalohouse detects, prevents, and responds to fraudulent activity to keep your property transactions safe.",
  openGraph: {
    title: "Anti-Fraud Policy | Kalohouse",
    description:
      "Learn how Kalohouse detects, prevents, and responds to fraudulent activity to keep your property transactions safe.",
  },
};

export default function AntiFraudPage() {
  return (
    <main className="min-h-screen bg-main-bg text-text-primary">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full -top-24 -left-24" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-danger/10 border border-danger/20 px-4 py-2 mb-8">
            <ShieldAlert className="size-4 text-danger" />
            <span className="text-xs font-bold uppercase tracking-widest text-danger">Protection</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl mb-6 leading-tight">
            Anti-Fraud <span className="text-gold">Policy</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Kalohouse is committed to maintaining a safe, trustworthy marketplace. We actively detect, prevent, and respond to fraudulent activity.
          </p>
        </div>
      </section>

      {/* How We Protect You */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-3xl text-center mb-16">How We Protect You</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Lock,
                title: "Escrow Payments",
                desc: "All payments are held in escrow. Sellers only receive funds after verification and buyer confirmation. This eliminates the risk of paying for properties that don't exist.",
              },
              {
                icon: Eye,
                title: "Agent Verification",
                desc: "Every property listing is physically verified by an authorized sector agent before it goes live. We confirm location, ownership, and property details in person.",
              },
              {
                icon: CheckCircle2,
                title: "Identity Verification",
                desc: "Property owners must verify their identity before listing. Verified owners receive a trust badge, giving buyers confidence in the listing's legitimacy.",
              },
              {
                icon: Flag,
                title: "Fraud Detection",
                desc: "Our system monitors for suspicious activity including duplicate listings, fake photos, unusual payment patterns, and reports from the community.",
              },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-3xl p-8 border border-white/10 hover:border-gold/30 transition-all group">
                <div className="size-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                  <item.icon className="size-7 text-gold" />
                </div>
                <h3 className="font-serif text-xl mb-4">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Scams */}
      <section className="py-20 bg-soft-bg/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-center mb-16">Common Scams to Watch For</h2>
          <div className="space-y-6">
            {[
              {
                title: "Advance Fee Fraud",
                desc: "Scammers ask you to pay a deposit or fee before seeing the property. On Kalohouse, never pay outside the platform. All legitimate transactions go through our escrow system.",
                color: "danger",
              },
              {
                title: "Fake Listings",
                desc: "Fraudulent listings use stolen photos and fake descriptions. Our agent verification process catches most of these, but always look for the Verified badge on listings.",
                color: "warning",
              },
              {
                title: "Impersonation",
                desc: "Scammers may impersonate Kalohouse staff, agents, or property owners. We will never ask for your password or PIN via email, phone, or chat.",
                color: "warning",
              },
              {
                title: "Price Too Good to Be True",
                desc: "If a property is priced far below market value, it may be a scam. Our platform shows fair market prices based on verified data.",
                color: "info",
              },
              {
                title: "Pressure to Act Fast",
                desc: "Scammers create urgency to prevent you from doing due diligence. Take your time, verify the listing, and use our escrow protection.",
                color: "info",
              },
            ].map((item) => (
              <div key={item.title} className={`flex gap-4 p-6 glass-card rounded-2xl border border-${item.color}/20 bg-${item.color}/5`}>
                <div className={`size-12 rounded-xl bg-${item.color}/10 flex items-center justify-center shrink-0`}>
                  <AlertTriangle className={`size-6 text-${item.color}`} />
                </div>
                <div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-center mb-16">Our Anti-Fraud Measures</h2>
          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Prevention",
                items: ["Mandatory identity verification for owners", "Physical property verification by agents", "Escrow system for all payments", "Secure authentication with encryption"],
              },
              {
                step: "02",
                title: "Detection",
                items: ["Automated fraud detection algorithms", "Community reporting system", "Regular listing audits", "Payment pattern analysis"],
              },
              {
                step: "03",
                title: "Response",
                items: ["Immediate listing suspension on fraud reports", "Full refund for verified fraud victims", "Account termination for fraudsters", "Cooperation with law enforcement"],
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="size-12 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-gold">{item.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-4">{item.title}</h3>
                  <ul className="space-y-2">
                    {item.items.map((text) => (
                      <li key={text} className="flex items-center gap-2 text-sm text-text-secondary">
                        <CheckCircle2 className="size-4 text-success shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Fraud CTA */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-5xl glass-card rounded-[3rem] p-12 sm:p-20 text-center border border-danger/20 bg-gradient-to-b from-danger/5 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <ShieldAlert className="size-16 text-danger mx-auto mb-8 relative z-10" />
          <h2 className="font-serif text-4xl sm:text-5xl mb-6 relative z-10">Suspected <span className="text-danger">Fraud</span>?</h2>
          <p className="text-text-secondary max-w-xl mx-auto mb-10 relative z-10">
            If you encounter a suspicious listing or believe you&apos;ve been targeted by a scam, report it immediately. We take all reports seriously and respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button asChild size="lg" className="h-16 px-10 rounded-2xl text-lg bg-danger hover:bg-danger/80">
              <Link href="/about#contact">
                <Flag className="size-5 mr-2" />
                Report Fraud
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="h-16 px-10 rounded-2xl text-lg">
              <Link href="/buyer-protection">
                <ShieldAlert className="size-5 mr-2" />
                Buyer Protection
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
