"use client";

import { Select } from "@/components/ui/select";
import { assignPropertyToAgent } from "@/app/actions/admin";

interface AgentAssignmentSelectProps {
  propertyId: number;
  assignedAgentId?: string;
  agents: any[];
}

export function AgentAssignmentSelect({
  propertyId,
  assignedAgentId,
  agents
}: AgentAssignmentSelectProps) {
  return (
    <Select
      className="h-12 w-full text-sm bg-white/5 border-white/10"
      value={assignedAgentId ?? ""}
      onChange={async (event) => {
        await assignPropertyToAgent(propertyId, Number(event.target.value || 0));
      }}
    >
      <option value="">Unassigned (Open Queue)</option>
      {agents.map((agent) => (
        <option key={agent.id} value={agent.id}>
          {agent.name}
        </option>
      ))}
    </Select>
  );
}
