import { redirect } from "next/navigation";
import { getClientDashboardData } from "@/lib/dal";
import { ClientDashboardContent } from "./ClientDashboardContent";
import { authorizeRole } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  const user = await authorizeRole(["owner", "client", "admin"]);
  if (!user) redirect("/auth");

  const data = await getClientDashboardData(user.id);

  return (
    <ClientDashboardContent
      visits={data.visits}
      payments={data.payments}
      refunds={data.refunds}
      saved={data.saved}
      recommended={data.recommended}
    />
  );
}
