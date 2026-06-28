import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "gold"
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "gold" | "success" | "info" | "warning";
}) {
  const toneClass = {
    gold: "bg-gold/12 text-gold-light",
    success: "bg-success/12 text-success",
    info: "bg-info/12 text-info",
    warning: "bg-warning/12 text-warning"
  }[tone];

  return (
    <Card className="hover-lift p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="mt-3 text-3xl font-bold text-text-primary">{value}</p>
        </div>
        <span className={`flex size-12 items-center justify-center rounded-2xl ${toneClass}`}>
          <Icon className="size-6" />
        </span>
      </div>
    </Card>
  );
}
