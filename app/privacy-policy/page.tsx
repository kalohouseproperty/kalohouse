import type { Metadata } from "next";
import { Lock, Eye, Database, Share2, Shield, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

export const metadata: Metadata = {
  title: "Privacy Policy | Kalohouse",
  description:
    "Learn how Kalohouse collects, uses, and protects your personal information. Your privacy is our priority.",
  openGraph: {
    title: "Privacy Policy | Kalohouse",
    description:
      "Learn how Kalohouse collects, uses, and protects your personal information. Your privacy is our priority.",
    images: [{ url: "/kalohouse-v2.png", width: 1200, height: 630, alt: "Kalohouse Logo" }],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-main-bg text-text-primary">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full -top-24 -left-24" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/20 px-4 py-2 mb-8">
            <Lock className="size-4 text-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Privacy</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl mb-6 leading-tight">
            Privacy <span className="text-gold">Policy</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Your privacy matters to us. This policy explains what data we collect, how we use it, and how we keep it safe.
          </p>
          <p className="text-sm text-muted-text mt-4">Last updated: June 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-16">

          {/* 1. Information We Collect */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-gold/10 flex items-center justify-center"><Database className="size-5 text-gold" /></div>
              <h2 className="font-serif text-3xl">1. Information We Collect</h2>
            </div>
            <div className="space-y-6 text-text-secondary leading-relaxed">
              <div>
                <h3 className="font-bold text-text-primary mb-2">Account Information</h3>
                <p>When you create an account, we collect your name, email address, phone number, and role (buyer, seller, agent, or owner).</p>
              </div>
              <div>
                <h3 className="font-bold text-text-primary mb-2">Property Data</h3>
                <p>Property listings include location details, descriptions, photos, pricing, and verification notes submitted by owners and agents.</p>
              </div>
              <div>
                <h3 className="font-bold text-text-primary mb-2">Payment Information</h3>
                <p>Transaction records including payment amounts, methods, dates, and statuses. We do not store credit card numbers — payments are processed through secure third-party providers (Stripe, MTN MoMo, Airtel Money).</p>
              </div>
              <div>
                <h3 className="font-bold text-text-primary mb-2">Usage Data</h3>
                <p>We automatically collect information about how you interact with the Platform, including IP address, browser type, pages visited, time spent, and referring URLs.</p>
              </div>
            </div>
          </div>

          {/* 2. How We Use Your Information */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-gold/10 flex items-center justify-center"><Eye className="size-5 text-gold" /></div>
              <h2 className="font-serif text-3xl">2. How We Use Your Information</h2>
            </div>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>We use your information to:</p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Provide, maintain, and improve our services.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Process transactions and manage escrow payments.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Verify property listings through authorized agents.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Send transactional emails (verification, receipts, updates).</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Detect and prevent fraud, spam, and abuse.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Comply with legal obligations under Rwandan law.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Improve user experience through analytics and feedback.</li>
              </ul>
            </div>
          </div>

          {/* 3. Data Sharing */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-gold/10 flex items-center justify-center"><Share2 className="size-5 text-gold" /></div>
              <h2 className="font-serif text-3xl">3. Data Sharing</h2>
            </div>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>We do not sell your personal data. We may share information with:</p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span><strong className="text-text-primary">Property buyers/sellers:</strong> When a transaction is initiated, relevant contact details are shared to facilitate the deal.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span><strong className="text-text-primary">Verified agents:</strong> Assigned agents receive property details to perform verification visits.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span><strong className="text-text-primary">Payment processors:</strong> Stripe, MTN MoMo, and Airtel Money receive transaction data as needed to process payments.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span><strong className="text-text-primary">Legal authorities:</strong> When required by law, court order, or to protect the safety of our users.</li>
              </ul>
            </div>
          </div>

          {/* 4. Data Security */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-success/20 bg-success/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-success/10 flex items-center justify-center"><Shield className="size-5 text-success" /></div>
              <h2 className="font-serif text-3xl">4. Data Security</h2>
            </div>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3"><span className="text-success mt-1">&#x2022;</span>SSL/TLS encryption for all data in transit.</li>
                <li className="flex items-start gap-3"><span className="text-success mt-1">&#x2022;</span>Encrypted storage for sensitive data at rest.</li>
                <li className="flex items-start gap-3"><span className="text-success mt-1">&#x2022;</span>Regular security audits and vulnerability assessments.</li>
                <li className="flex items-start gap-3"><span className="text-success mt-1">&#x2022;</span>Limited access controls — only authorized personnel can access user data.</li>
                <li className="flex items-start gap-3"><span className="text-success mt-1">&#x2022;</span>Secure database hosting on encrypted cloud infrastructure.</li>
              </ul>
              <p>While we strive to protect your data, no method of transmission over the Internet is 100% secure. We encourage users to use strong passwords and enable two-factor authentication where available.</p>
            </div>
          </div>

          {/* 5. Your Rights */}
          <div>
            <h2 className="font-serif text-3xl mb-6">5. Your Rights</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>You have the right to:</p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span><strong className="text-text-primary">Access</strong> your personal data and request a copy.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span><strong className="text-text-primary">Correct</strong> inaccurate or incomplete data.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span><strong className="text-text-primary">Delete</strong> your account and associated data (subject to legal retention requirements).</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span><strong className="text-text-primary">Object</strong> to certain processing of your data.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span><strong className="text-text-primary">Withdraw consent</strong> where processing is based on your consent.</li>
              </ul>
              <p>To exercise these rights, contact us at dushimimanaelie@kalohouse.com.</p>
            </div>
          </div>

          {/* 6. Cookies */}
          <div>
            <h2 className="font-serif text-3xl mb-6">6. Cookies & Tracking</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>We use cookies and similar technologies to:</p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Maintain your session and keep you logged in.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Remember your preferences and language settings.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Analyze usage patterns to improve the Platform.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span>Detect and prevent fraudulent activity.</li>
              </ul>
              <p>You can manage cookie preferences through your browser settings. See our <Link href="/cookie-settings" className="text-gold hover:underline">Cookie Settings</Link> page for more details.</p>
            </div>
          </div>

          {/* 7. Data Retention */}
          <div>
            <h2 className="font-serif text-3xl mb-6">7. Data Retention</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>We retain your personal data for as long as your account is active or as needed to provide services. Specific retention periods:</p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span><strong className="text-text-primary">Account data:</strong> Until you delete your account, plus 30 days for backup recovery.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span><strong className="text-text-primary">Transaction records:</strong> 7 years as required by Rwandan financial regulations.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span><strong className="text-text-primary">Property listings:</strong> Until delisted, plus 1 year for dispute resolution.</li>
                <li className="flex items-start gap-3"><span className="text-gold mt-1">&#x2022;</span><strong className="text-text-primary">Support tickets:</strong> 2 years after resolution.</li>
              </ul>
            </div>
          </div>

          {/* 8. Children's Privacy */}
          <div>
            <h2 className="font-serif text-3xl mb-6">8. Children&apos;s Privacy</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Kalohouse is not intended for users under the age of 18. We do not knowingly collect personal data from children. If we become aware that a child has provided us with personal data, we will take steps to delete it promptly.
              </p>
            </div>
          </div>

          {/* 9. Changes */}
          <div>
            <h2 className="font-serif text-3xl mb-6">9. Changes to This Policy</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page with an updated &quot;Last updated&quot; date. We encourage you to review this policy periodically.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-gold/20 bg-gold/5 text-center space-y-6">
            <Mail className="size-12 text-gold mx-auto" />
            <h2 className="font-serif text-3xl">Contact Us About Privacy</h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              If you have questions about this Privacy Policy or how we handle your data, reach out to our privacy team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-8 rounded-2xl">
                <Link href="/about#contact">Contact Us</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="h-14 px-8 rounded-2xl">
                <Link href="/terms-of-service">Terms of Service</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
