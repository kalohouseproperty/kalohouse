import { redirect } from "next/navigation";
import { getOwnerDashboardData } from "@/lib/dal";
import { OwnerDashboardContent } from "./OwnerDashboardContent";
import { authorizeRole } from "@/lib/auth-utils";

export const revalidate = 3600; // 1 hour revalidation interval

export default async function OwnerDashboardPage() {
  const user = await authorizeRole(["owner", "admin"]);
  if (!user) redirect("/auth");

  const data = await getOwnerDashboardData(user.id);

  return (
    <OwnerDashboardContent
      properties={data.properties as any}
      payouts={data.payouts as any}
      revenue={data.revenue}
    />
  );
}
