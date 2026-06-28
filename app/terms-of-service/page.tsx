import type { Metadata } from "next";
import { FileText, Scale, AlertTriangle, ShieldCheck, Users, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

export const metadata: Metadata = {
  title: "Terms of Service | Kalohouse",
  description:
    "Read the terms and conditions governing the use of Kalohouse, Rwanda's trusted real estate marketplace.",
  openGraph: {
    title: "Terms of Service | Kalohouse",
    description:
      "Read the terms and conditions governing the use of Kalohouse, Rwanda's trusted real estate marketplace.",
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-main-bg text-text-primary">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full -top-24 -left-24" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/20 px-4 py-2 mb-8">
            <Scale className="size-4 text-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Legal</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl mb-6 leading-tight">
            Terms of <span className="text-gold">Service</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Please read these terms carefully before using Kalohouse. By accessing our platform, you agree to be bound by these conditions.
          </p>
          <p className="text-sm text-muted-text mt-4">Last updated: June 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-16">

          {/* 1. Acceptance */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-gold/10 flex items-center justify-center"><FileText className="size-5 text-gold" /></div>
              <h2 className="font-serif text-3xl">1. Acceptance of Terms</h2>
            </div>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                By accessing or using Kalohouse (&quot;the Platform&quot;), operated by Kalohouse Ltd (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you must not access or use the Platform.
              </p>
              <p>
                These terms apply to all users of the Platform, including buyers, sellers, property owners, agents, and visitors. We reserve the right to modify these terms at any time, and continued use of the Platform constitutes acceptance of any changes.
              </p>
            </div>
          </div>

          {/* 2. Eligibility */}
          <div>
            <h2 className="font-serif text-3xl mb-6">2. Eligibility</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>To use Kalohouse, you must:</p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Be at least 18 years of age or the legal age of majority in your jurisdiction.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Have the legal capacity to enter into binding agreements.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Provide accurate and complete registration information.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Not be prohibited from using the Platform under any applicable law.</li>
              </ul>
            </div>
          </div>

          {/* 3. Accounts */}
          <div>
            <h2 className="font-serif text-3xl mb-6">3. User Accounts</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>When you create an account on Kalohouse, you agree to:</p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Maintain the confidentiality of your login credentials.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Accept full responsibility for all activities that occur under your account.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Notify us immediately of any unauthorized use of your account.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Ensure that your account information is current, accurate, and complete.</li>
              </ul>
              <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
            </div>
          </div>

          {/* 4. Property Listings */}
          <div>
            <h2 className="font-serif text-3xl mb-6">4. Property Listings</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>Property owners and agents who list properties on Kalohouse agree that:</p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>All listing information is accurate, truthful, and not misleading.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>They have the legal right to list and sell/rent the property.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Photos and media accurately represent the current state of the property.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>They will respond to inquiries and complete transactions in good faith.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>They will not list properties that are subject to legal disputes or encumbrances without disclosure.</li>
              </ul>
              <p>Kalohouse verifies listings through authorized sector agents but does not guarantee the accuracy of all details. Buyers should perform their own due diligence.</p>
            </div>
          </div>

          {/* 5. Payments & Escrow */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-gold/10 flex items-center justify-center"><CreditCard className="size-5 text-gold" /></div>
              <h2 className="font-serif text-3xl">5. Payments & Escrow</h2>
            </div>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>All payments made through Kalohouse are processed through our secure escrow system:</p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Payments are held in escrow until the buyer confirms satisfaction with the transaction.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Funds are released to the seller only after verification and buyer confirmation.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Commission fees are deducted as disclosed before the transaction.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Refunds are processed according to our Refund Policy.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Kalohouse is not responsible for bank fees, currency conversion charges, or payment processor delays.</li>
              </ul>
            </div>
          </div>

          {/* 6. Prohibited Conduct */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-danger/20 bg-danger/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-danger/10 flex items-center justify-center"><AlertTriangle className="size-5 text-danger" /></div>
              <h2 className="font-serif text-3xl">6. Prohibited Conduct</h2>
            </div>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>You must not:</p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3"><span className="text-danger mt-1">&#x2022;</span>Use the Platform for any unlawful purpose or in violation of any local, national, or international law.</li>
                <li className="flex items-start gap-3"><span className="text-danger mt-1">&#x2022;</span>Post false, misleading, or fraudulent property listings.</li>
                <li className="flex items-start gap-3"><span className="text-danger mt-1">&#x2022;</span>Impersonate another person or entity.</li>
                <li className="flex items-start gap-3"><span className="text-danger mt-1">&#x2022;</span>Attempt to circumvent the escrow system or pay sellers directly.</li>
                <li className="flex items-start gap-3"><span className="text-danger mt-1">&#x2022;</span>Interfere with or disrupt the Platform&apos;s infrastructure.</li>
                <li className="flex items-start gap-3"><span className="text-danger mt-1">&#x2022;</span>Collect user data without explicit consent.</li>
              </ul>
            </div>
          </div>

          {/* 7. Intellectual Property */}
          <div>
            <h2 className="font-serif text-3xl mb-6">7. Intellectual Property</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                All content on Kalohouse, including text, graphics, logos, icons, images, data compilations, and software, is the property of Kalohouse or its content suppliers and is protected by Rwandan and international copyright laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, or create derivative works from any content on the Platform without our prior written consent.
              </p>
            </div>
          </div>

          {/* 8. Limitation of Liability */}
          <div>
            <h2 className="font-serif text-3xl mb-6">8. Limitation of Liability</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                To the maximum extent permitted by law, Kalohouse shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform. Our total liability shall not exceed the amount of fees you paid to us in the twelve (12) months preceding the claim.
              </p>
              <p>
                Kalohouse acts as an intermediary between buyers and sellers. We are not a party to the actual transaction between buyer and seller, except for our escrow and verification services.
              </p>
            </div>
          </div>

          {/* 9. Dispute Resolution */}
          <div>
            <h2 className="font-serif text-3xl mb-6">9. Dispute Resolution</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Any disputes arising from or relating to these terms or your use of the Platform shall first be attempted to be resolved through good-faith negotiation. If unresolved within thirty (30) days, disputes shall be submitted to the exclusive jurisdiction of the courts of Kigali, Rwanda.
              </p>
            </div>
          </div>

          {/* 10. Changes */}
          <div>
            <h2 className="font-serif text-3xl mb-6">10. Changes to These Terms</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                We reserve the right to update these Terms of Service at any time. Changes will be effective upon posting on this page with an updated &quot;Last updated&quot; date. Your continued use of the Platform after any changes constitutes acceptance of the new terms.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-gold/20 bg-gold/5 text-center space-y-6">
            <ShieldCheck className="size-12 text-gold mx-auto" />
            <h2 className="font-serif text-3xl">Questions About These Terms?</h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              If you have any questions about these Terms of Service, please contact our legal team.
            </p>
            <Button asChild size="lg" className="h-14 px-8 rounded-2xl">
              <Link href="/about#contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
