"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AnalyticsCard } from "@/components/dashboard/AnalyticsCard";
import { Banknote, Building2, Users, Eye, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AnalyticsContentProps {
  stats: any;
  analytics: {
    monthlyRevenue: { name: string; total: number }[];
    districtData: { name: string; value: number }[];
  };
}

const COLORS = ['#D6A84F', '#3B82f6', '#2ECC71', '#E74C3C', '#9B59B6'];

export function AnalyticsContent({ stats, analytics }: AnalyticsContentProps) {
  const [timeRange, setTimeRange] = useState("This Month");

  // Fallback for empty district data to show a neutral state
  const pieData = analytics.districtData.length > 0 
    ? analytics.districtData 
    : [{ name: 'No Data', value: 1 }];

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardShell title="Marketplace Intelligence" role="admin">
      <div className="flex justify-end gap-2 mb-6">
        {['Today', 'This Week', 'This Month'].map(range => (
          <Button key={range} variant={timeRange === range ? "default" : "secondary"} size="sm" onClick={() => setTimeRange(range)}>
            {range}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <AnalyticsCard label="Revenue" value={formatMoney(stats.totalPayments)} trend={0} icon={Banknote} />
        <AnalyticsCard label="Listings" value={String(stats.totalProperties)} trend={0} icon={Building2} />
        <AnalyticsCard label="Verified" value={String(stats.publishedProperties)} trend={0} icon={ShieldCheck} />
        <AnalyticsCard label="Agents" value={String(stats.totalAgents)} trend={0} icon={Users} />
        <AnalyticsCard label="Refunds" value={String(stats.refundRequests)} trend={0} icon={Eye} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 glass-card p-6 border border-white/5 bg-white/5">
          <h3 className="text-white font-serif text-lg mb-6">Revenue Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D6A84F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D6A84F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#201d1a', border: '1px solid #334155' }} />
                <Area type="monotone" dataKey="total" stroke="#D6A84F" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass-card p-6 border border-white/5 bg-white/5">
            <h3 className="text-white font-serif text-lg mb-4">Properties by District</h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={index} fill={entry.name === 'No Data' ? '#334155' : COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
                {analytics.districtData.slice(0, 4).map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between text-xs text-text-secondary">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span>{entry.name}</span>
                        </div>
                        <span>{entry.value}</span>
                    </div>
                ))}
            </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
