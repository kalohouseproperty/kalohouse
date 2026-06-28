"use client";

import { 
  Banknote, Building2, Clock3, Link2, Map, Users, 
  CheckCircle, TrendingUp, PieChart as PieChartIcon, 
  ArrowUpRight, ArrowDownRight, Activity
} from "lucide-react";
import { useMemo, useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";

import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/ui/modal";
import { kigaliSectorsByDistrict } from "@/data/sectors";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { District, Property, Payment, Refund } from "@/types/models";
import Link from "next/link";
import { createAgentInvite, updateCommissionRate, assignPropertyToAgent, decideRefund } from "../../actions/admin";
import { AgentAssignmentSelect } from "@/components/dashboard/AgentAssignmentSelect";

const CHART_COLORS = ["#C9A646", "#46C9A6", "#466CC9", "#C94669", "#A646C9"];

interface AdminDashboardContentProps {
  stats: any;
  analytics: {
    monthlyRevenue: any[];
    districtData: any[];
  };
  recentProperties: Property[];
  pendingVerifications: Property[];
  recentPayments: Payment[];
  agents: any[];
  refunds: Refund[];
  commissionRate: number;
}

export function AdminDashboardContent({
  stats,
  analytics,
  recentProperties,
  pendingVerifications,
  recentPayments,
  agents,
  refunds,
  commissionRate
}: AdminDashboardContentProps) {
  const [inviteName, setInviteName] = useState("");
  const [inviteDistrict, setInviteDistrict] = useState<District>("Gasabo");
  const [inviteSector, setInviteSector] = useState("Kimihurura");
  const [inviteEmail, setInviteEmail] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [inviteSending, setInviteSending] = useState(false);
  const [commission, setCommission] = useState(String(commissionRate * 100));
  const [commissionSaved, setCommissionSaved] = useState(false);
  const [confirmRefund, setConfirmRefund] = useState<{ id: string; status: "approved" | "rejected" } | null>(null);

  const pendingQueue = pendingVerifications;

  const handleUpdateCommission = async () => {
    await updateCommissionRate(Number(commission) / 100);
    setCommissionSaved(true);
    setTimeout(() => setCommissionSaved(false), 3000);
  };

  const handleCopy = async () => {
    if (!generatedLink) return;
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardShell title="Control Center" role="admin">
      {/* 1. Executive Header */}
      <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-white tracking-tight">Kalohouse Control Center</h1>
          <p className="text-muted-text mt-2 text-lg">Marketplace health and operational oversight for Kigali.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" className="h-12 px-6 bg-gold text-navy-dark font-black rounded-xl shadow-lg shadow-gold/10 hover:bg-gold-light transition-all active:scale-95">
            <Activity className="size-4 mr-2" /> System Health
          </Button>
          <Button asChild variant="secondary" className="h-12 px-6 rounded-xl border-white/10 hover:bg-white/5">
            <Link href="/map"><Map className="size-4 mr-2" /> Live Market Map</Link>
          </Button>
        </div>
      </div>

      {/* 2. Primary KPIs */}
      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 mb-10">
        <StatCard label="Total Inventory" value={String(stats.totalProperties)} icon={Building2} />
        <StatCard label="Live Listings" value={String(stats.publishedProperties)} icon={CheckCircle} tone="success" />
        <StatCard label="Awaiting Action" value={String(stats.pendingVerifications)} icon={Clock3} tone="warning" />
        <StatCard label="Field Agents" value={String(stats.totalAgents)} icon={Users} tone="info" />
        <div className="md:col-span-2">
            <StatCard 
              label="Market Volume (Last 30d)" 
              value={formatMoney(stats.totalPayments)} 
              icon={Banknote} 
              tone="success" 
            />
        </div>
      </section>

      {/* 3. Advanced Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
        {/* Revenue Trend Chart */}
        <Card className="xl:col-span-2 glass-card p-8 border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-serif text-white">Revenue Growth</h2>
              <p className="text-xs text-muted-text uppercase tracking-widest font-bold mt-1">Monthly commission volume (RWF)</p>
            </div>
            <div className="flex items-center gap-2 text-success font-bold text-sm">
              <TrendingUp className="size-4" /> +12.5%
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A646" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C9A646" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff40" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#ffffff40" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `RWF ${val / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#07111F", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                  itemStyle={{ color: "#C9A646" }}
                />
                <Area type="monotone" dataKey="total" stroke="#C9A646" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Inventory Distribution */}
        <Card className="glass-card p-8 border-white/5 flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-serif text-white">Inventory by District</h2>
            <p className="text-xs text-muted-text uppercase tracking-widest font-bold mt-1">Listing density overview</p>
          </div>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.districtData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.districtData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 4. Operational Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 glass-card p-8 border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-serif text-white">Pending Verification Queue</h2>
            <Link href="/dashboard/admin/verifications" className="text-xs text-gold font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="size-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {pendingQueue.length > 0 ? pendingQueue.slice(0, 3).map((property) => (
              <div key={property.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-gold/5 flex items-center justify-center border border-gold/10">
                    <Building2 className="size-5 text-gold/60" />
                  </div>
                  <div>
                    <p className="font-bold text-white group-hover:text-gold transition-colors">{property.title}</p>
                    <p className="text-xs text-muted-text">{property.district} • {property.sector}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-[10px] font-black uppercase tracking-widest border border-warning/20">
                    {property.status}
                  </span>
                  <div className="w-48">
                    <AgentAssignmentSelect 
                      propertyId={Number(property.id)}
                      assignedAgentId={property.assignedAgentId}
                      agents={agents}
                    />
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-muted-text italic">Verification queue is empty. Good job!</p>
              </div>
            )}
          </div>
        </Card>

        {/* Global Controls */}
        <div className="space-y-8">
          <Card className="glass-card p-8 border-white/5">
            <h2 className="text-xl font-serif text-white mb-6">Quick Actions</h2>
            <div className="grid gap-3">
              <div className="pt-2 space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs text-muted-text font-black uppercase tracking-[0.2em]">Commission Rate</label>
                  <span className="text-gold font-bold">{commission}%</span>
                </div>
                <div className="flex gap-2">
                    <Input 
                      value={commission} 
                      type="number" 
                      className="h-12 rounded-xl bg-white/5 border-white/10"
                      onChange={(e) => setCommission(e.target.value)} 
                    />
                    <Button 
                      onClick={handleUpdateCommission} 
                      className={cn(
                        "h-12 px-6 rounded-xl font-black transition-all",
                        commissionSaved ? "bg-success text-white" : "bg-gold text-navy-dark"
                      )}
                    >
                      {commissionSaved ? "Saved!" : "Apply"}
                    </Button>
                </div>
                {commissionSaved && (
                  <p className="text-[10px] text-success font-bold animate-in fade-in slide-in-from-left-1">
                    ✓ Commission rate updated successfully
                  </p>
                )}
                <p className="text-[10px] text-muted-text italic">Changes apply to all future listings immediately.</p>
              </div>
            </div>
          </Card>

          {/* Invite Agent Card */}
          <Card className="glass-card p-8 border-white/5">
            <h2 className="text-xl font-serif text-white mb-6">Invite Agent</h2>
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-muted-text uppercase font-black tracking-widest px-1">Agent Name</label>
                <Input 
                  placeholder="e.g. Jean Paul" 
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="h-12 rounded-xl bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-muted-text uppercase font-black tracking-widest px-1">Target Email</label>
                <Input 
                  placeholder="agent@email.com" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="h-12 rounded-xl bg-white/5 border-white/10"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-text uppercase font-black tracking-widest px-1">District</label>
                  <Select value={inviteDistrict} onChange={(e) => { const d = e.target.value as District; setInviteDistrict(d); setInviteSector(kigaliSectorsByDistrict[d][0]); }}>
                    {Object.keys(kigaliSectorsByDistrict).map(d => <option key={d} value={d}>{d}</option>)}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-text uppercase font-black tracking-widest px-1">Sector</label>
                  <Select value={inviteSector} onChange={(e) => setInviteSector(e.target.value)}>
                    {kigaliSectorsByDistrict[inviteDistrict].map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>
              </div>

              <Button 
                disabled={inviteSending}
                onClick={async () => {
                  if (!inviteEmail) return alert("Please enter an email");
                  if (!inviteName) return alert("Please enter the agent's name");
                  setInviteSending(true);
                  try {
                    const res = await createAgentInvite(inviteEmail, inviteName, inviteDistrict, inviteSector);
                    if (res.success) {
                      const link = `${window.location.origin}/auth/agent/register?token=${res.token}`;
                      setGeneratedLink(link);
                      setCopied(false);
                      setInviteEmail("");
                      setInviteName("");
                    }
                  } finally {
                    setInviteSending(false);
                  }
                }}
                className="h-14 mt-2 rounded-2xl bg-gold text-navy-dark hover:bg-gold-light transition-all font-black flex items-center justify-center gap-2"
              >
                <Link2 className="size-5" />
                {inviteSending ? "Sending Invite..." : "Invite Agent"}
              </Button>

              {generatedLink && (
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-[10px] text-muted-text uppercase font-black tracking-widest mb-2 px-1">Active Invite Link</p>
                  <div className="flex gap-2">
                    <Input 
                      readOnly 
                      value={generatedLink} 
                      className="h-10 text-xs bg-navy-dark/50 border-white/5 text-muted-text truncate"
                    />
                    <Button 
                      onClick={handleCopy}
                      className={cn(
                        "h-10 px-4 rounded-xl transition-all font-bold text-xs shrink-0",
                        copied ? "bg-success text-white" : "bg-white/10 text-white hover:bg-white/20"
                      )}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              )}
              
              <p className="text-[10px] text-muted-text italic text-center">Link is one-time use and expires in 7 days.</p>
            </div>
          </Card>
        </div>
      </div>

      {/* 5. Financial Exceptions */}
        <Card className="glass-card p-8 mt-10 border-white/5 bg-danger/5">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="size-6 text-danger" />
            <h2 className="text-xl font-serif text-white">Refund Requests & Exceptions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {refunds.length > 0 ? refunds.map((refund: any) => (
                <div key={refund.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-danger/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-2xl font-black text-white">{formatMoney(refund.amount)}</p>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      refund.status === "Pending" ? "bg-warning/20 text-warning" : 
                      refund.status === "Approved" ? "bg-success/20 text-success" :
                      refund.status === "Rejected" ? "bg-danger/20 text-danger" : "bg-success/20 text-success"
                    )}>
                      {refund.status}
                    </span>
                  </div>
                  {refund.propertyTitle && (
                    <p className="text-sm font-bold text-white mb-1">{refund.propertyTitle}</p>
                  )}
                  {refund.propertyDistrict && (
                    <p className="text-xs text-text-secondary mb-3">{refund.propertyDistrict}</p>
                  )}
                  <p className="text-sm text-muted-text mb-6 line-clamp-2">{refund.reason || "No reason provided"}</p>
                  {refund.status === "Pending" && (
                      <div className="flex gap-2">
                          <Button size="sm" className="flex-1 rounded-xl bg-success/20 text-success hover:bg-success/30 border-none font-bold" onClick={() => setConfirmRefund({ id: refund.id, status: "approved" })}>Approve</Button>
                          <Button size="sm" variant="danger" className="flex-1 rounded-xl bg-danger/20 text-danger hover:bg-danger/30 border-none font-bold" onClick={() => setConfirmRefund({ id: refund.id, status: "rejected" })}>Reject</Button>
                      </div>
                  )}
                </div>
              )) : (
                <div className="col-span-full py-10 text-center border border-white/5 bg-white/5 rounded-3xl">
                  <p className="text-muted-text font-medium">No refund requests found.</p>
                </div>
              )}
          </div>
        </Card>

      <ConfirmModal
        open={Boolean(confirmRefund)}
        title="Execute Refund"
        message="Are you sure you want to process this refund? The funds will be queued for the original payment provider."
        confirmLabel={confirmRefund?.status === "approved" ? "Approve Refund" : "Deny Request"}
        onClose={() => setConfirmRefund(null)}
        onConfirm={async () => {
          if (confirmRefund) {
            await decideRefund(Number(confirmRefund.id), confirmRefund.status);
            setConfirmRefund(null);
          }
        }}
      />
    </DashboardShell>
  );
}
