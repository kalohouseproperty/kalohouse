"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/card";
import { PropertyImage } from "@/components/ui/property-image";
import { formatMoney } from "@/lib/format";
import type { Property } from "@/types/models";

interface MarketplaceContentProps {
  properties: Property[];
}

export function MarketplaceContent({ properties }: MarketplaceContentProps) {
  return (
    <DashboardShell title="Marketplace Oversight" role="admin">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length > 0 ? properties.map((p) => (
          <Card key={p.id} className="glass-card overflow-hidden border-white/5 bg-white/5">
            <div className="aspect-video relative w-full h-[200px]">
              <PropertyImage src={p.media.images[0]?.url} alt={p.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-white font-serif font-bold">{p.title}</h3>
              <p className="text-xs text-muted-text">{p.district} • {p.sector}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gold font-bold">{formatMoney(p.finalDisplayPrice)}</span>
                <span className="text-[10px] uppercase tracking-widest font-black text-muted-text">{p.status}</span>
              </div>
            </div>
          </Card>
        )) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                <p className="text-muted-text italic">No properties in the marketplace yet.</p>
            </div>
        )}
      </div>
    </DashboardShell>
  );
}
