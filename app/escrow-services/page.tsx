import { Lock, ShieldCheck, CheckCircle2, ArrowLeft, Phone, Mail, Clock, Banknote } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

export default function EscrowServicesPage() {
  return (
    <main className="min-h-screen bg-main-bg text-text-primary">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full -top-24 -left-24" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/20 px-4 py-2 mb-8">
            <Lock className="size-4 text-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Secure Payments</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl mb-6 leading-tight">
            Escrow <span className="text-gold">Services</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Kalohouse acts as a trusted third party, holding your funds securely until all conditions of the property transaction are met.
          </p>
        </div>
      </section>

      {/* What is Escrow */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="font-serif text-4xl">What is Escrow?</h2>
              <p className="text-lg text-text-secondary leading-relaxed">
                Escrow is a financial arrangement where a trusted third party (Kalohouse) holds and regulates the payment of funds between the buyer and the seller. This ensures that neither party is at risk during the transaction.
              </p>
              <p className="text-text-secondary leading-relaxed">
                In real estate, this means your payment is held safely until the property owner fulfills their obligations — delivering the property as described, completing all documentation, and transferring ownership.
              </p>
            </div>
            <div className="glass-card rounded-3xl p-10 border border-gold/20 bg-gold/5">
              <div className="space-y-6">
                {[
                  { icon: ShieldCheck, text: "Funds held by Kalohouse, not the seller" },
                  { icon: Lock, text: "Released only when conditions are met" },
                  { icon: Banknote, text: "Full refund if transaction fails" },
                  { icon: Clock, text: "Quick resolution within 5-10 business days" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                      <item.icon className="size-5 text-gold" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Escrow Works */}
      <section className="py-20 bg-soft-bg/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-center mb-16">How Escrow Works on Kalohouse</h2>
          <div className="space-y-0 relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />
            {[
              {
                step: "01",
                title: "Buyer Initiates Payment",
                desc: "You select a property and make a payment. The funds are held securely in Kalohouse's escrow account — not sent directly to the seller.",
                time: "Immediate",
              },
              {
                step: "02",
                title: "Seller is Notified",
                desc: "The property owner is notified that a payment has been received and is being held in escrow. They can now proceed with the transaction.",
                time: "Immediate",
              },
              {
                step: "03",
                title: "Verification Period",
                desc: "Our team verifies that the property matches its listing, the owner is legitimate, and all required documentation is in order.",
                time: "1-3 Days",
              },
              {
                step: "04",
                title: "Buyer Confirms",
                desc: "You inspect the property and confirm that everything matches the listing description. If satisfied, you approve the release of funds.",
                time: "Up to 7 Days",
              },
              {
                step: "05",
                title: "Funds Released",
                desc: "Once you confirm, the payment (minus commission) is released to the property owner. The transaction is complete.",
                time: "1-2 Days",
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
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-3xl text-center mb-16">Why Use Escrow?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card rounded-3xl p-8 border border-white/10 hover:border-gold/30 transition-all">
              <div className="size-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6">
                <ShieldCheck className="size-7 text-gold" />
              </div>
              <h3 className="font-serif text-xl mb-4">For Buyers</h3>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />
                  <span>Your money is safe until you&apos;re satisfied with the property</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />
                  <span>Full refund if the property doesn&apos;t match the description</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />
                  <span>No risk of dealing with fraudulent sellers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />
                  <span>Professional dispute resolution if issues arise</span>
                </li>
              </ul>
            </div>
            <div className="glass-card rounded-3xl p-8 border border-white/10 hover:border-gold/30 transition-all">
              <div className="size-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6">
                <Banknote className="size-7 text-gold" />
              </div>
              <h3 className="font-serif text-xl mb-4">For Sellers</h3>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />
                  <span>Proof that the buyer has funds available</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />
                  <span>Guaranteed payment once conditions are met</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />
                  <span>Protected from payment chargebacks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />
                  <span>Transparent and fair transaction process</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-5xl glass-card rounded-[3rem] p-12 sm:p-20 text-center border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <Lock className="size-16 text-gold mx-auto mb-8 relative z-10" />
          <h2 className="font-serif text-4xl sm:text-5xl mb-6 relative z-10">Your Funds, <span className="text-gold">Fully Protected</span></h2>
          <p className="text-text-secondary max-w-xl mx-auto mb-10 relative z-10">
            Every transaction on Kalohouse uses our secure escrow system. Buy property with complete peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button asChild size="lg" className="h-16 px-10 rounded-2xl text-lg">
              <Link href="/properties">Start Buying</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="h-16 px-10 rounded-2xl text-lg">
              <Link href="/about#contact">
                <Phone className="size-4 mr-2" />
                Talk to Support
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
