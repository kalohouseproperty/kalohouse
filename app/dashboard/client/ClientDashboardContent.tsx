"use client";

import { CreditCard, Heart, Home, RotateCcw, Sparkles, RefreshCw, Building2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PaymentProtectionCard } from "@/components/cards/PaymentProtectionCard";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PropertyImage } from "@/components/ui/property-image";
import { formatMoney } from "@/lib/format";
import { getMediaUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Property, Payment, Refund } from "@/types/models";
import { decideVisit, requestRefund } from "../../actions/visits";

interface ClientDashboardContentProps {
  visits: any[];
  payments: Payment[];
  refunds: Refund[];
  saved: Property[];
  recommended: Property[];
}

export function ClientDashboardContent({
  visits,
  payments,
  refunds,
  saved,
  recommended
}: ClientDashboardContentProps) {
  const [refundingId, setRefundingId] = useState<number | null>(null);

  const handleRequestRefund = async (payment: any) => {
    setRefundingId(Number(payment.id));
    try {
      await requestRefund(Number(payment.id));
    } catch (err) {
      console.error("Refund request failed", err);
    } finally {
      setRefundingId(null);
    }
  };

  const paidPayments = payments.filter((p: any) => p.status === "Paid" && !p.hasRefund);

  return (
    <DashboardShell title="Client dashboard" role="client">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Saved properties" value={String(saved.length)} icon={Heart} />
        <StatCard label="Visit requests" value={String(visits.length)} icon={Home} tone="info" />
        <StatCard label="Payments" value={formatMoney(payments.reduce((sum, p: any) => sum + p.finalDisplayPrice, 0))} icon={CreditCard} tone="success" />
        <StatCard label="Refund status" value={`${refunds.filter((r) => r.status === "Pending").length} pending`} icon={RotateCcw} tone="warning" />
      </section>

      {/* Paid Properties - clear view of houses the client paid for */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <CheckCircle2 className="size-6 text-success" />
          <h2 className="font-serif text-3xl text-text-primary">Properties you paid for</h2>
        </div>
        {paidPayments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {paidPayments.map((payment: any) => (
              <Card key={payment.id} className="p-5 border-success/20 bg-success/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-xl text-text-primary">{payment.propertyTitle || "Property"}</p>
                    <p className="text-lg font-bold text-gold-light mt-1">{formatMoney(payment.finalDisplayPrice)}</p>
                    <p className="text-xs text-text-secondary mt-1">Paid via {payment.provider || "Mobile Money"}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="danger"
                    className="shrink-0"
                    onClick={() => handleRequestRefund(payment)}
                    disabled={refundingId === Number(payment.id)}
                  >
                    <RefreshCw className={cn("size-3.5 mr-1.5", refundingId === Number(payment.id) && "animate-spin")} />
                    {refundingId === Number(payment.id) ? "Requesting..." : "Request refund"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center border-dashed border-white/10">
            <Building2 className="size-12 text-white/10 mx-auto mb-3" />
            <p className="text-text-secondary">You haven&apos;t paid for any properties yet.</p>
            <Button asChild className="mt-4" variant="secondary">
              <Link href="/properties">Browse properties</Link>
            </Button>
          </Card>
        )}
      </section>

      <section id="visits" className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card className="p-6">
          <h2 className="font-serif text-2xl text-text-primary">Visit requests</h2>
          <div className="mt-5 grid gap-3">
            {visits.length ? (
              visits.map((visit) => {
                return (
                  <div key={visit.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="font-semibold text-text-primary">{visit.property?.title ?? "Property"}</p>
                    <p className="text-sm text-text-secondary">
                      {visit.status}
                    </p>
                    {visit.status === "Scheduled" ? (
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <Button size="sm" onClick={async () => await decideVisit(Number(visit.id), "accepted")}>
                          Accept property
                        </Button>
                        <Button size="sm" variant="danger" onClick={async () => await decideVisit(Number(visit.id), "cancelled")}>
                          Cancel and request refund
                        </Button>
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <EmptyState icon={Home} title="No visit requests" copy="Pay before visit on a published property to create a visit request." />
            )}
          </div>
        </Card>
        <PaymentProtectionCard />
      </section>

      <section id="payments" className="grid gap-5 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-serif text-2xl text-text-primary">Payment transactions</h2>
          <div className="mt-5 space-y-3">
            {payments.length ? payments.map((payment: any) => (
              <div key={payment.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text-primary truncate">{payment.propertyTitle || "Property"}</p>
                    <p className="text-lg font-bold text-gold-light mt-1">{formatMoney(payment.finalDisplayPrice)}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-text-secondary">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        payment.status === "Paid" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                      )}>
                        {payment.status}
                      </span>
                      {payment.provider && payment.provider !== "simulated" && payment.provider !== "commission_unlock" && (
                        <span>via {payment.provider}</span>
                      )}
                      {payment.providerReference && (
                        <span className="font-mono">Ref: {payment.providerReference.slice(0, 12)}...</span>
                      )}
                    </div>
                  </div>
                  {payment.status === "Paid" && !payment.hasRefund && (
                    <Button
                      size="sm"
                      variant="danger"
                      className="shrink-0"
                      onClick={() => handleRequestRefund(payment)}
                      disabled={refundingId === Number(payment.id)}
                    >
                      <RefreshCw className={cn("size-3.5 mr-1.5", refundingId === Number(payment.id) && "animate-spin")} />
                      {refundingId === Number(payment.id) ? "Requesting..." : "Request refund"}
                    </Button>
                  )}
                  {payment.hasRefund && (
                    <span className="shrink-0 text-xs font-medium text-warning">Refund {payment.refundStatus}</span>
                  )}
                </div>
              </div>
            )) : (
              <EmptyState icon={CreditCard} title="No payments" copy="Pay for a property to see your transactions here." />
            )}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="font-serif text-2xl text-text-primary">Refund status</h2>
          <div className="mt-5 space-y-3">
            {refunds.length ? refunds.map((refund: any) => (
              <div key={refund.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-text-primary">{formatMoney(refund.amount)}</p>
                    <p className="text-sm text-text-secondary mt-0.5">{refund.reason}</p>
                  </div>
                  <span className={cn(
                    "shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    refund.status === "Pending" && "bg-warning/15 text-warning",
                    refund.status === "Approved" && "bg-success/15 text-success",
                    refund.status === "Rejected" && "bg-danger/15 text-danger",
                    refund.status === "Completed" && "bg-success/15 text-success",
                  )}>
                    {refund.status}
                  </span>
                </div>
              </div>
            )) : (
              <EmptyState icon={RotateCcw} title="No refunds" copy="Request a refund on a paid transaction to see it here." />
            )}
          </div>
        </Card>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-3">
          <Sparkles className="size-6 text-gold-light" />
          <h2 className="font-serif text-3xl text-text-primary">Recommended verified homes</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(saved.length ? saved : recommended).map((property) => (
            <PropertyCard key={property.id} property={property as any} />
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
