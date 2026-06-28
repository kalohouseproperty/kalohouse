import { redirect } from "next/navigation";
import { getAgentDashboardData } from "@/lib/dal";
import { AgentDashboardContent } from "./AgentDashboardContent";
import { authorizeRole } from "@/lib/auth-utils";

export const revalidate = 3600; // 1 hour revalidation interval

export default async function AgentDashboardPage() {
  const user = await authorizeRole(["agent", "admin"]);
  if (!user) redirect("/auth");

  const data = await getAgentDashboardData(user.id, user.sector_id);

  return (
    <AgentDashboardContent
      properties={data.properties as any}
      sector={data.sector}
      earnings={data.earnings}
    />
  );
}
