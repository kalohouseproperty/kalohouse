import { redirect } from "next/navigation";
import { authorizeRole } from "@/lib/auth-utils";
import { getAdminDashboardData } from "@/lib/dal";
import { PaymentsContent } from "./PaymentsContent";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const user = await authorizeRole(["admin"]);
  if (!user) redirect("/auth");

  const data = await getAdminDashboardData();

  return (
    <PaymentsContent 
      payments={data.recentPayments}
    />
  );
}
