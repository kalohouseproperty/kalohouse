"use client";

import { Banknote, CircleDollarSign, FilePlus2, Home, Send, Wallet, RefreshCw } from "lucide-react";
import { useState } from "react";

import { StatusBadge } from "@/components/cards/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PropertyImage } from "@/components/ui/property-image";
import { PropertyWizard } from "@/components/forms/PropertyWizard";
import { formatMoney } from "@/lib/format";
import { getMediaUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { requestPayout } from "@/app/actions/admin";
import type { PropertyStatus, Property, Payout } from "@/types/models";

const statuses: PropertyStatus[] = ["Pending Verification", "Agent Assigned", "Verified", "Published", "Rejected"];

interface OwnerDashboardContentProps {
  properties: Property[];
  payouts: Payout[];
  revenue: { pending: number; totalEarned: number; total: number };
}

export function OwnerDashboardContent({ properties, payouts, revenue }: OwnerDashboardContentProps) {
  const [open, setOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const pendingPayout = payouts.filter((p) => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0);

  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      await requestPayout(Number(properties[0]?.ownerId ?? 0));
    } catch (err) {
      console.error("Withdraw failed", err);
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <DashboardShell title="Owner dashboard" role="owner">
      <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <Card className="gold-ring p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">Landlord and seller workspace</p>
          <h2 className="mt-3 font-serif text-4xl text-text-primary">Submit and track verified listings</h2>
          <p className="mt-4 max-w-2xl leading-7 text-text-secondary">
            Property submissions move through verification, publication, visit payments, and payout status from one clean owner view.
          </p>
          <Button className="mt-7" size="lg" onClick={() => setOpen(true)}>
            <FilePlus2 className="size-5" />
            Submit property
          </Button>
        </Card>
        <Card className="p-6 border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
          <Wallet className="mb-5 size-9 text-gold" />
          <p className="text-sm text-text-secondary">Available balance</p>
          <p className="mt-3 text-3xl font-bold text-gold-light">{formatMoney(revenue.pending)}</p>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Total earned: {formatMoney(revenue.totalEarned)}
          </p>
          <Button
            className="mt-4 w-full"
            disabled={pendingPayout <= 0 || withdrawing}
            onClick={handleWithdraw}
          >
            <RefreshCw className={cn("size-4 mr-2", withdrawing && "animate-spin")} />
            {withdrawing ? "Processing..." : pendingPayout > 0 ? `Withdraw ${formatMoney(pendingPayout)}` : "No funds to withdraw"}
          </Button>
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-4">
        <StatCard label="Submitted properties" value={String(properties.length)} icon={Home} />
        <StatCard label="Published" value={String(properties.filter((p) => p.status === "Published").length)} icon={Send} tone="success" />
        <StatCard label="Total revenue" value={formatMoney(revenue.total)} icon={Banknote} tone="info" />
        <StatCard label="Withdrawn" value={formatMoney(revenue.totalEarned)} icon={CircleDollarSign} tone="success" />
      </section>

      <Card className="p-6">
        <h3 className="font-serif text-2xl text-text-primary">Status tracking</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-5">
          {statuses.map((status) => (
            <div key={status} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <StatusBadge status={status} />
            </div>
          ))}
        </div>
      </Card>

      <section className="grid gap-5 md:grid-cols-2">
        {properties.map((property) => (
          <Card key={property.id} className="hover-lift p-5">
            <div className="flex gap-4">
              <span className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-black">
                {property.media.images[0] ? (
                  <PropertyImage src={getMediaUrl(property.media.images[0].url)} alt={property.title} fill sizes="96px" className="object-cover" />
                ) : null}
              </span>
              <div>
                <p className="font-serif text-xl text-text-primary">{property.title}</p>
                <p className="mt-1 text-sm text-text-secondary">
                  {property.sector}, {property.district} · {formatMoney(property.finalDisplayPrice, property.purpose as any)}
                </p>
                <div className="mt-3">
                  <StatusBadge status={property.status} />
                </div>
                {property.rejectionReason ? <p className="mt-2 text-sm text-danger">{property.rejectionReason}</p> : null}
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* Payouts History */}
      {payouts.length > 0 && (
        <Card className="p-6">
          <h3 className="font-serif text-2xl text-text-primary mb-5">Payout history</h3>
          <div className="space-y-3">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div>
                  <p className="font-medium text-text-primary">{(payout as any).propertyTitle || "Property"}</p>
                  <p className="text-sm text-text-secondary">{formatMoney(payout.amount)}</p>
                </div>
                <span className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold uppercase",
                  payout.status === "Paid" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                )}>
                  {payout.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {open && (
        <PropertyWizard onClose={() => setOpen(false)} onSuccess={() => setOpen(false)} />
      )}
    </DashboardShell>
  );
}
