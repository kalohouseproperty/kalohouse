import { redirect } from "next/navigation";
import { getAdminDashboardData } from "@/lib/dal";
import { authorizeRole } from "@/lib/auth-utils";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/card";
import { Building2, Clock3, User as UserIcon } from "lucide-react";
import { AgentAssignmentSelect } from "@/components/dashboard/AgentAssignmentSelect";

export const dynamic = "force-dynamic";

export default async function AdminVerificationsPage() {
  const user = await authorizeRole(["admin"]);
  if (!user) redirect("/auth");

  const data = await getAdminDashboardData();
  const pendingProperties = data.pendingVerificationsList;

  return (
    <DashboardShell title="Verification Queue" role="admin">
      <div className="mb-10">
        <h1 className="text-4xl font-serif text-white tracking-tight">Full Verification Queue</h1>
        <p className="text-muted-text mt-2 text-lg">Manage all properties awaiting physical verification and agent assignment.</p>
      </div>

      <div className="space-y-4">
        {pendingProperties.length > 0 ? pendingProperties.map((property) => (
          <Card key={property.id} className="glass-card p-6 border-white/5 hover:border-white/10 transition-all group">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="size-16 rounded-2xl bg-gold/5 flex items-center justify-center border border-gold/10 shrink-0">
                  <Building2 className="size-8 text-gold/60" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">{property.title}</h3>
                  <p className="text-muted-text flex items-center gap-2 mt-1">
                    <span className="font-medium text-white/60">{property.district}</span>
                    <span className="size-1 bg-white/10 rounded-full" />
                    <span>{property.sector}</span>
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-[10px] font-black uppercase tracking-widest border border-warning/20 flex items-center gap-1">
                      <Clock3 className="size-3" /> {property.status}
                    </span>
                    {property.assignedAgentId && (
                       <span className="px-3 py-1 rounded-full bg-info/10 text-info text-[10px] font-black uppercase tracking-widest border border-info/20 flex items-center gap-1">
                         <UserIcon className="size-3" /> Assigned
                       </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-64">
                  <p className="text-[10px] text-muted-text uppercase font-black tracking-widest mb-2 px-1">Verification Agent</p>
                  <AgentAssignmentSelect 
                    propertyId={Number(property.id)}
                    assignedAgentId={property.assignedAgentId}
                    agents={data.agents}
                  />
                </div>
              </div>
            </div>
          </Card>
        )) : (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
            <Clock3 className="size-12 text-white/10 mx-auto mb-4" />
            <p className="text-muted-text text-xl font-medium italic">No properties require verification at this time.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
