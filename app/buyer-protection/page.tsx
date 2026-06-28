import { ShieldCheck, Lock, CreditCard, AlertTriangle, CheckCircle2, ArrowLeft, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

export default function BuyerProtectionPage() {
  return (
    <main className="min-h-screen bg-main-bg text-text-primary">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full -top-24 -left-24" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/20 px-4 py-2 mb-8">
            <ShieldCheck className="size-4 text-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Your Safety</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl mb-6 leading-tight">
            Buyer <span className="text-gold">Protection</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Every transaction on Kalohouse is backed by our comprehensive buyer protection program. Your money is safe until you&apos;re satisfied.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-3xl text-center mb-16">How Buyer Protection Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "You Make a Payment",
                desc: "When you purchase a property or unlock owner contact, your payment is held securely by Kalohouse. The funds are not released to the seller immediately.",
                icon: CreditCard,
              },
              {
                step: "02",
                title: "We Verify Everything",
                desc: "Our team verifies that the property matches its listing description, the owner is legitimate, and all documentation is in order before any funds are released.",
                icon: ShieldCheck,
              },
              {
                step: "03",
                title: "Funds Released on Confirmation",
                desc: "Only after you confirm that everything is as described do we release the payment to the property owner. If there's an issue, we help you get a refund.",
                icon: Lock,
              },
            ].map((item) => (
              <div key={item.step} className="glass-card rounded-3xl p-8 border border-white/10 hover:border-gold/30 transition-all group text-center">
                <div className="size-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors">
                  <item.icon className="size-7 text-gold" />
                </div>
                <span className="text-xs font-black text-gold/50 uppercase tracking-widest">Step {item.step}</span>
                <h3 className="font-serif text-xl mt-3 mb-4">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Covered */}
      <section className="py-20 bg-soft-bg/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-center mb-16">What&apos;s Covered</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: "Property Not As Described",
                desc: "If the property significantly differs from the listing (wrong location, size, features, or condition), you are eligible for a full refund.",
                icon: CheckCircle2,
              },
              {
                title: "Seller Non-Responsive",
                desc: "If the property owner does not respond or complete the transaction within 7 days of your payment, your funds are protected.",
                icon: CheckCircle2,
              },
              {
                title: "Duplicate Payments",
                desc: "Accidentally paid twice? We'll refund the duplicate charge in full within 5 business days.",
                icon: CheckCircle2,
              },
              {
                title: "Property Withdrawn",
                desc: "If the owner withdraws the listing after your payment, you receive a full refund. No questions asked.",
                icon: CheckCircle2,
              },
              {
                title: "Fraudulent Listings",
                desc: "If a listing turns out to be fraudulent, we not only refund your payment but also take action against the seller.",
                icon: CheckCircle2,
              },
              {
                title: "Unauthorized Transactions",
                desc: "If someone makes a payment on your account without authorization, we'll investigate and issue a full refund.",
                icon: CheckCircle2,
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-6 glass-card rounded-2xl border border-white/5 hover:border-success/20 transition-colors">
                <div className="size-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                  <item.icon className="size-6 text-success" />
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

      {/* What's NOT Covered */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-center mb-16">What&apos;s Not Covered</h2>
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-danger/20 bg-danger/5 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-danger mt-0.5 shrink-0" />
              <p className="text-text-secondary leading-relaxed">Change of mind after the owner has responded and the transaction is in progress.</p>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-danger mt-0.5 shrink-0" />
              <p className="text-text-secondary leading-relaxed">Personal preference differences that were not related to the listing description.</p>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-danger mt-0.5 shrink-0" />
              <p className="text-text-secondary leading-relaxed">Refund requests made more than 14 days after the payment date.</p>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-danger mt-0.5 shrink-0" />
              <p className="text-text-secondary leading-relaxed">Commission fees paid to unlock owner contact information.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-5xl glass-card rounded-[3rem] p-12 sm:p-20 text-center border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <ShieldCheck className="size-16 text-gold mx-auto mb-8 relative z-10" />
          <h2 className="font-serif text-4xl sm:text-5xl mb-6 relative z-10">Shop with <span className="text-gold">Confidence</span></h2>
          <p className="text-text-secondary max-w-xl mx-auto mb-10 relative z-10">
            Every property on Kalohouse is verified by local agents, and every payment is protected. Your dream home is just a safe transaction away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button asChild size="lg" className="h-16 px-10 rounded-2xl text-lg">
              <Link href="/properties">Browse Properties</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="h-16 px-10 rounded-2xl text-lg">
              <Link href="/about#contact">
                <Phone className="size-4 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
