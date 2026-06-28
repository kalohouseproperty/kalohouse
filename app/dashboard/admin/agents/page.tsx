import { redirect } from "next/navigation";
import { authorizeRole } from "@/lib/auth-utils";
import { getAdminDashboardData } from "@/lib/dal";
import { AgentsManagementContent } from "./AgentsManagementContent";

export const dynamic = "force-dynamic";

export default async function AdminAgentsManagementPage() {
  const user = await authorizeRole(["admin"]);
  if (!user) redirect("/auth");

  const data = await getAdminDashboardData();

  return (
    <AgentsManagementContent 
      agents={data.agents}
    />
  );
}
