import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardRedirect() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/auth");
  }

  switch (user.role) {
    case "admin":
      return redirect("/dashboard/admin");
    case "agent":
      return redirect("/dashboard/agent");
    case "owner":
      return redirect("/dashboard/owner");
    case "client":
    default:
      return redirect("/dashboard/client");
  }
}
