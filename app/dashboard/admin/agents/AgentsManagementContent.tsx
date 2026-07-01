"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserX, UserCheck, Eye } from "lucide-react";
// import { updateAgentStatus } from "@/app/actions/admin"; // We'll need to create this action if it doesn't exist

interface AgentsManagementContentProps {
  agents: any[];
}

export function AgentsManagementContent({ agents }: AgentsManagementContentProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <DashboardShell title="Agent Management" role="admin">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent List */}
        <Card className="lg:col-span-1 glass-card p-6 border border-white/5">
          <h2 className="text-xl font-serif text-white mb-6">All Agents ({agents.length})</h2>
          <div className="space-y-3">
            {agents.length > 0 ? agents.map((agent) => (
              <div 
                key={agent.id} 
                className={`p-3 rounded-xl border cursor-pointer transition ${selectedAgentId === agent.id ? "bg-gold/10 border-gold/40" : "bg-white/5 border-white/5 hover:bg-white/10"}`}
                onClick={() => setSelectedAgentId(agent.id)}
              >
                <p className="font-medium text-white">{agent.name}</p>
                <p className="text-xs text-muted-text">{agent.email} • {agent.status}</p>
              </div>
            )) : <p className="text-muted-text italic">No agents found in database.</p>}
          </div>
        </Card>

        {/* Agent Details & History */}
        <Card className="lg:col-span-2 glass-card p-6 border border-white/5">
          {selectedAgent ? (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-serif text-white">{selectedAgent.name}</h2>
                  <p className="text-muted-text">{selectedAgent.email}</p>
                  <p className="text-xs text-gold mt-1 uppercase tracking-widest font-bold">
                    {selectedAgent.assignedSector || "Unassigned"} • {selectedAgent.assignedDistrict || ""}
                  </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => alert("Update status feature coming soon to real DB")}>
                        {selectedAgent.status === "active" ? <UserX className="size-4 mr-2 text-danger" /> : <UserCheck className="size-4 mr-2 text-success" />}
                        {selectedAgent.status === "active" ? "Suspend" : "Activate"}
                    </Button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-4">Verification History</h3>
              <div className="space-y-3">
                <p className="text-muted-text italic text-sm">Real verification history is linked to live property data in the database.</p>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-text">Select an agent to view details</div>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
