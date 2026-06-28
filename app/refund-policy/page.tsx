import { ShieldCheck, Clock, AlertTriangle, CheckCircle2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-main-bg text-text-primary">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full -top-24 -left-24" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/20 px-4 py-2 mb-8">
            <ShieldCheck className="size-4 text-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Buyer Protection</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl mb-6 leading-tight">
            Refund <span className="text-gold">Policy</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Your satisfaction and security are our top priority. Learn about our refund process and how we protect your payments.
          </p>
          <p className="text-sm text-muted-text mt-4">Last updated: June 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-16">

          {/* Overview */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10">
            <h2 className="font-serif text-3xl mb-6">Overview</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              At Kalohouse, we are committed to ensuring a safe and trustworthy real estate marketplace in Rwanda. We understand that sometimes a refund may be necessary. This policy outlines the conditions under which refunds are available and the process for requesting one.
            </p>
            <p className="text-text-secondary leading-relaxed">
              All payments made through Kalohouse are protected by our Buyer Protection program. We act as an intermediary to ensure that your funds are handled securely until all parties are satisfied.
            </p>
          </div>

          {/* Eligibility */}
          <div>
            <h2 className="font-serif text-3xl mb-8">When Are Refunds Available?</h2>
            <div className="grid gap-6">
              {[
                {
                  icon: CheckCircle2,
                  title: "Property Not As Described",
                  desc: "If the property you purchased differs significantly from the listing description (e.g., wrong location, different specifications, missing features), you are eligible for a full refund.",
                  color: "text-success",
                  bg: "bg-success/10",
                },
                {
                  icon: CheckCircle2,
                  title: "Seller Unresponsive After Payment",
                  desc: "If the property owner does not respond or complete the transaction within 7 days of your payment, you may request a refund.",
                  color: "text-success",
                  bg: "bg-success/10",
                },
                {
                  icon: CheckCircle2,
                  title: "Duplicate Payment",
                  desc: "If you accidentally made a duplicate payment for the same property, the extra payment will be refunded in full.",
                  color: "text-success",
                  bg: "bg-success/10",
                },
                {
                  icon: CheckCircle2,
                  title: "Property Withdrawn by Owner",
                  desc: "If the property owner withdraws the listing after your payment has been confirmed, you will receive a full refund.",
                  color: "text-success",
                  bg: "bg-success/10",
                },
                {
                  icon: AlertTriangle,
                  title: "Transaction Cancelled by Admin",
                  desc: "If Kalohouse administration cancels the transaction due to policy violations or fraud concerns, a full refund will be issued.",
                  color: "text-warning",
                  bg: "bg-warning/10",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-6 glass-card rounded-2xl border border-white/5 hover:border-gold/20 transition-colors">
                  <div className={`size-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                    <item.icon className={`size-6 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Non-Refundable */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-danger/20 bg-danger/5">
            <h2 className="font-serif text-3xl mb-6 text-danger">Non-Refundable Situations</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>The following situations are <strong className="text-text-primary">not eligible</strong> for a refund:</p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <span className="text-danger mt-1">&#x2022;</span>
                  <span>You changed your mind after the property owner has already responded and the transaction is in progress.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-danger mt-1">&#x2022;</span>
                  <span>The property description was accurate at the time of viewing, but you discovered personal preferences that differ.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-danger mt-1">&#x2022;</span>
                  <span>The refund request is made more than 14 days after the payment date.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-danger mt-1">&#x2022;</span>
                  <span>The commission fee paid to unlock owner contact information (non-purchase payments).</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="font-serif text-3xl mb-8">Refund Process & Timeline</h2>
            <div className="space-y-0 relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />
              {[
                {
                  step: "01",
                  title: "Submit Request",
                  desc: "Click the 'Request Refund' button on your property page or dashboard. Provide a reason for your refund request.",
                  time: "Day 1",
                },
                {
                  step: "02",
                  title: "Review by Admin",
                  desc: "Our team will review your request and verify the details. We may contact you for additional information.",
                  time: "1-3 Business Days",
                },
                {
                  step: "03",
                  title: "Decision",
                  desc: "You will be notified via email whether your refund has been approved or rejected. If approved, we proceed to processing.",
                  time: "3-5 Business Days",
                },
                {
                  step: "04",
                  title: "Refund Issued",
                  desc: "The refund is processed to your original payment method. Mobile Money refunds arrive within 24 hours; card refunds within 5-10 business days.",
                  time: "5-10 Business Days",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 py-6 relative">
                  <div className="size-12 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center shrink-0 z-10 bg-main-bg">
                    <span className="text-xs font-black text-gold">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold">
                        <Clock className="size-3" />
                        {item.time}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to Request */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-gold/20 bg-gold/5">
            <h2 className="font-serif text-3xl mb-6">How to Request a Refund</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>You can request a refund through any of these methods:</p>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5">
                  <div className="size-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="size-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">From Your Dashboard</p>
                    <p className="text-xs text-text-secondary">Go to Dashboard &rarr; Properties you paid for &rarr; Request Refund</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5">
                  <div className="size-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <Mail className="size-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Via Email</p>
                    <p className="text-xs text-text-secondary">Send a request to support@kalohouse.rw with your payment details</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center space-y-6">
            <h2 className="font-serif text-3xl">Questions About Refunds?</h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Our support team is here to help. If you have any questions about the refund process, don&apos;t hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-8 rounded-2xl">
                <Link href="/about#contact">
                  <Mail className="size-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="h-14 px-8 rounded-2xl">
                <Link href="/properties">
                  <ArrowLeft className="size-4 mr-2" />
                  Back to Properties
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
