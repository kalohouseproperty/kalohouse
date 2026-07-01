"use client";

import { CheckCircle2, Home, ShieldCheck, XCircle, DollarSign } from "lucide-react";
import { useState } from "react";

import { StatusBadge } from "@/components/cards/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { PropertyWizard } from "@/components/forms/PropertyWizard";
import { formatMoney } from "@/lib/format";
import type { Property } from "@/types/models";
import { verifyProperty } from "../../actions/properties";

interface AgentDashboardContentProps {
  properties: Property[];
  sector: { name: string; district: string } | null;
  earnings: { total: number; verifiedCount: number };
}

export function AgentDashboardContent({ properties, sector, earnings }: AgentDashboardContentProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [openWizard, setOpenWizard] = useState(false);

  const pending = properties.filter((property) => ["Pending Verification", "Agent Assigned"].includes(property.status));
  const verified = properties.filter((property) => property.status === "Published" || property.status === "Verified");
  const rejected = properties.filter((property) => property.status === "Rejected");

  return (
    <DashboardShell title="Agent dashboard" role="agent">
      <div className="mb-5 flex justify-end">
        <Button onClick={() => setOpenWizard(true)}>Submit property</Button>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Card className="gold-ring p-5">
          <p className="text-sm text-text-secondary">My Sector</p>
          <p className="mt-3 font-serif text-3xl text-text-primary">{sector?.name ?? "Unassigned"}</p>
          <p className="mt-2 text-sm text-gold-light">{sector?.district ?? "No district"} District</p>
        </Card>
        <StatCard label="Pending properties" value={String(pending.length)} icon={Home} tone="warning" />
        <StatCard label="Verified properties" value={String(verified.length)} icon={CheckCircle2} tone="success" />
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Rejected properties" value={String(rejected.length)} icon={XCircle} tone="info" />
        <StatCard label="Properties verified by me" value={String(earnings.verifiedCount)} icon={CheckCircle2} tone="success" />
        <StatCard label="Commission earned" value={formatMoney(earnings.total)} icon={DollarSign} tone="info" />
        <Card className="p-5 bg-gradient-to-br from-gold/10 to-transparent border-gold/20">
          <p className="text-sm text-text-secondary">My Earnings</p>
          <p className="mt-2 font-serif text-3xl text-gold-light">{formatMoney(earnings.total)}</p>
          <p className="mt-1 text-xs text-text-secondary">20% share from {earnings.verifiedCount} verified {earnings.verifiedCount === 1 ? "property" : "properties"}</p>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <h2 className="font-serif text-2xl text-text-primary">Property verification list</h2>
          <div className="mt-5 grid gap-4">
            {pending.length ? (
              pending.map((property) => (
                <div key={property.id} className="grid gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4 md:grid-cols-[1fr_0.5fr_0.4fr] md:items-center">
                  <div>
                    <p className="font-semibold text-text-primary">{property.title}</p>
                    <p className="text-sm text-text-secondary">
                      {property.sector}, {property.district} · {formatMoney(property.finalDisplayPrice, property.purpose as any)}
                    </p>
                  </div>
                  <StatusBadge status={property.status} />
                  <Button onClick={() => setSelectedProperty(property)}>Open</Button>
                </div>
              ))
            ) : (
              <EmptyState icon={ShieldCheck} title="No pending properties" copy="Your sector has no properties waiting for verification." />
            )}
          </div>
        </Card>
        <Card className="p-6">
          <ShieldCheck className="mb-5 size-9 text-gold-light" />
          <h2 className="font-serif text-3xl text-text-primary">Sector-only workload</h2>
          <p className="mt-4 leading-7 text-text-secondary">
            Agents only see houses assigned to their sector. Approving requires exactly four images, one video, and notes.
          </p>
        </Card>
      </section>

      {openWizard ? (
        <PropertyWizard onClose={() => setOpenWizard(false)} onSuccess={() => setOpenWizard(false)} />
      ) : null}

      <VerificationModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
    </DashboardShell>
  );
}

function VerificationModal({
  property,
  onClose
}: {
  property: Property | null;
  onClose: () => void;
}) {
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [reason, setReason] = useState("");

  const resetAndClose = () => {
    setImages([]);
    setVideo(null);
    setNotes("");
    setReason("");
    onClose();
  };

  return (
    <Modal open={Boolean(property)} title="Verify property" onClose={resetAndClose}>
      {property ? (
        <div className="space-y-5">
          <div>
            <h3 className="font-serif text-2xl text-text-primary">{property.title}</h3>
            <p className="text-sm text-text-secondary">
              {property.address} · {property.sector}, {property.district}
            </p>
          </div>
          <label className="grid gap-2 text-sm text-text-secondary">
            Select exactly 4 images (Simulated)
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => setImages(Array.from(event.target.files ?? []).slice(0, 4))}
            />
          </label>
          <p className="text-sm text-text-secondary">{images.length}/4 images selected</p>
          <label className="grid gap-2 text-sm text-text-secondary">
            Select 1 video (Simulated)
            <Input
              type="file"
              accept="video/*"
              onChange={(event) => setVideo(event.target.files?.[0] ?? null)}
            />
          </label>
          <label className="grid gap-2 text-sm text-text-secondary">
            Verification notes
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ownership, condition, utilities, access..." />
          </label>
          <label className="grid gap-2 text-sm text-text-secondary">
            Rejection reason
            <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Required if rejecting" />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={async () => {
                await verifyProperty(Number(property.id), true, notes);
                resetAndClose();
              }}
            >
              Approve and publish
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                await verifyProperty(Number(property.id), false, notes, reason);
                resetAndClose();
              }}
            >
              Reject
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
