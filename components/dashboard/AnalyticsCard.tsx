"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  label: string;
  value: string | number;
  trend: number;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}

export function AnalyticsCard({ label, value, trend, icon: Icon }: AnalyticsCardProps) {
  return (
    <Card className="glass-card p-5 border border-white/5 bg-white/5 flex flex-col gap-3">
      <div className="flex items-center justify-between text-muted-text">
        <span className="text-sm">{label}</span>
        <Icon className="size-4 text-gold" />
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-white">{value}</span>
        <div className={cn("flex items-center text-xs font-medium", trend > 0 ? "text-green-400" : "text-red-400")}>
          {trend > 0 ? <TrendingUp className="size-3 mr-1" /> : <TrendingDown className="size-3 mr-1" />}
          {Math.abs(trend)}%
        </div>
      </div>
    </Card>
  );
}
