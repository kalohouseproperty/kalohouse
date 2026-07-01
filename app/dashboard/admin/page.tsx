import { redirect } from "next/navigation";
import { getAdminDashboardData } from "@/lib/dal";
import { AdminDashboardContent } from "./AdminDashboardContent";
import { authorizeRole } from "@/lib/auth-utils";

export const revalidate = 3600; // 1 hour revalidation interval

export default async function AdminDashboardPage() {
  // Strict Auth
  const user = await authorizeRole(["admin"]);
  if (!user) redirect("/auth");

  const data = await getAdminDashboardData();

  return (
    <AdminDashboardContent
      stats={data.stats}
      analytics={data.analytics}
      recentProperties={data.recentProperties as any}
      pendingVerifications={data.pendingVerificationsList as any}
      recentPayments={data.recentPayments as any}
      agents={data.agents}
      refunds={data.refunds as any}
      commissionRate={data.commissionRate}
    />
  );
}
