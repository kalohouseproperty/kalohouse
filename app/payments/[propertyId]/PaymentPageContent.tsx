"use client";

import { CreditCard, Loader2, ShieldCheck, Unlock, ArrowLeft, Smartphone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { startMobileMoneyPayment, payCommissionToUnlockContact, createStripeCheckoutSession } from "@/app/actions/visits";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PropertyImage } from "@/components/ui/property-image";
import { getMediaUrl } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/models";

type Provider = "mtn" | "airtel";
type PaymentMethod = "mobile" | "card";

export function PaymentPageContent({ property, paymentType = "purchase" }: { property: Property; paymentType?: "purchase" | "unlock" }) {
  const [provider, setProvider] = useState<Provider>("mtn");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mobile");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUnlock = paymentType === "unlock";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    if (isUnlock) {
      const result = await payCommissionToUnlockContact(Number(property.id));
      if (result.error) {
        setError(result.error);
      } else {
        setMessage("Contact info unlocked! Redirecting to property...");
        setTimeout(() => {
          window.location.href = `/properties/${property.id}`;
        }, 1500);
      }
    } else if (paymentMethod === "card") {
      const result = await createStripeCheckoutSession(Number(property.id));
      if (result.error) {
        setError(result.error);
      } else if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } else {
      const result = await startMobileMoneyPayment({
        propertyId: Number(property.id),
        provider,
        phone,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setMessage(result.message || "Payment request created. Check your phone to approve it.");
      }
    }

    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-main-bg px-4 py-8 text-text-primary sm:px-6 lg:px-8">
      <div className="fixed right-4 top-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-card-bg shadow-2xl">
          <div className="relative w-full h-[24rem]">
            <PropertyImage
              src={property.media.images[0] ? getMediaUrl(property.media.images[0].url) : undefined}
              alt={property.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 p-6">
              <p className="mb-2 text-xs font-black uppercase tracking-widest text-gold">{property.purpose}</p>
              <h1 className="font-serif text-3xl leading-tight text-white">{property.title}</h1>
              <p className="mt-2 text-sm font-semibold text-white/70">{property.sector}, {property.district}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 p-5 text-center">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-widest text-text-secondary">Beds</p>
              <p className="mt-1 text-xl font-black">{property.bedrooms}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-widest text-text-secondary">Baths</p>
              <p className="mt-1 text-xl font-black">{property.bathrooms}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-widest text-text-secondary">Parking</p>
              <p className="mt-1 text-xl font-black">{property.parkingCapacity}</p>
            </div>
          </div>
        </section>

        <Card className="p-6 glass-card border-gold/25 sm:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-gold">Secure checkout</p>
              <h2 className="mt-3 font-serif text-4xl">
                {isUnlock ? "Unlock Owner Contact" : "Property Purchase"}
              </h2>
            </div>
            <div className="rounded-2xl border border-gold/30 bg-gold/10 p-3 text-gold">
              {isUnlock ? <Unlock className="size-6" /> : <ShieldCheck className="size-6" />}
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-text-secondary">Amount to pay</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-gold-light">
              {isUnlock
                ? formatMoney(property.commissionAmount)
                : formatMoney(property.finalDisplayPrice, property.purpose)
              }
            </p>
            {isUnlock && (
              <p className="mt-2 text-xs text-text-secondary">
                One-time commission fee to unlock the owner&apos;s contact information.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isUnlock && (
              <>
                <div>
                  <p className="mb-3 text-xs font-black uppercase tracking-widest text-text-secondary">Payment method</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("mobile")}
                      className={cn(
                        "flex h-16 items-center justify-center gap-2 rounded-2xl border text-sm font-black transition-all",
                        paymentMethod === "mobile"
                          ? "border-gold bg-gold text-main-bg shadow-xl shadow-gold/15"
                          : "border-white/10 bg-white/5 text-text-primary hover:bg-white/10"
                      )}
                    >
                      <Smartphone className="size-5" />
                      Mobile Money
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={cn(
                        "flex h-16 items-center justify-center gap-2 rounded-2xl border text-sm font-black transition-all",
                        paymentMethod === "card"
                          ? "border-gold bg-gold text-main-bg shadow-xl shadow-gold/15"
                          : "border-white/10 bg-white/5 text-text-primary hover:bg-white/10"
                      )}
                    >
                      <CreditCard className="size-5" />
                      Visa / Mastercard
                    </button>
                  </div>
                </div>

                {paymentMethod === "mobile" && (
                  <>
                    <div>
                      <p className="mb-3 text-xs font-black uppercase tracking-widest text-text-secondary">Choose provider</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "mtn" as const, label: "MTN MoMo" },
                          { id: "airtel" as const, label: "Airtel Money" },
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setProvider(item.id)}
                            className={cn(
                              "flex h-16 items-center justify-center rounded-2xl border text-sm font-black transition-all",
                              provider === item.id
                                ? "border-gold bg-gold text-main-bg shadow-xl shadow-gold/15"
                                : "border-white/10 bg-white/5 text-text-primary hover:bg-white/10"
                            )}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="block space-y-2">
                      <span className="text-xs font-black uppercase tracking-widest text-text-secondary">Mobile money number</span>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gold/70" />
                        <Input
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          placeholder="+250 78..."
                          type="tel"
                          className="h-13 rounded-2xl border-white/10 bg-white/5 pl-11"
                          required
                        />
                      </div>
                    </label>
                  </>
                )}

                {paymentMethod === "card" && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                    <CreditCard className="mx-auto mb-3 size-10 text-gold/70" />
                    <p className="text-sm font-semibold text-text-secondary">
                      You will be redirected to Stripe&apos;s secure checkout to pay with your Visa or Mastercard.
                    </p>
                  </div>
                )}
              </>
            )}

            {message && (
              <div className="rounded-2xl border border-success/25 bg-success/10 p-4 text-sm font-semibold text-success">
                {message}
              </div>
            )}
            {error && (
              <div className="rounded-2xl border border-danger/25 bg-danger/10 p-4 text-sm font-semibold text-danger">
                {error}
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="h-14 w-full rounded-2xl text-base font-black">
              {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : isUnlock ? <Unlock className="size-5" /> : <CreditCard className="size-5" />}
              {isSubmitting
                ? "Processing..."
                : isUnlock
                  ? `Pay ${formatMoney(property.commissionAmount)} to Unlock`
                  : paymentMethod === "card"
                    ? "Pay with Card"
                    : `Pay with ${provider === "mtn" ? "MTN MoMo" : "Airtel Money"}`
              }
            </Button>
            <Button asChild type="button" variant="secondary" className="h-12 w-full rounded-2xl">
              <Link href={`/properties/${property.id}`}>
                <ArrowLeft className="size-4 mr-2" />
                Back to property
              </Link>
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
