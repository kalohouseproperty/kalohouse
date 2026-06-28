import { redirect } from "next/navigation";
import { authorizeRole } from "@/lib/auth-utils";
import { getAdminDashboardData } from "@/lib/dal";
import { AnalyticsContent } from "./AnalyticsContent";

export const dynamic = "force-dynamic";

export default async function AnalyticsDashboard() {
  const user = await authorizeRole(["admin"]);
  if (!user) redirect("/auth");

  const data = await getAdminDashboardData();

  return (
    <AnalyticsContent 
      stats={data.stats}
      analytics={data.analytics}
    />
  );
}

