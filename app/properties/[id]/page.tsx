import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getPropertyDetails } from "@/lib/dal";
import { PropertyDetailsContent } from "./PropertyDetailsContent";
import type { User, UserRole } from "@/types/models";
import { notFound } from "next/navigation";

export const revalidate = 3600; // 1 hour revalidation interval

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  let dbUser: User | null = null;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user) {
      dbUser = {
        id: String(user.id),
        name: user.full_name,
        email: user.email,
        role: user.role as UserRole,
        status: user.is_active ? "active" : "suspended",
        isVerified: user.is_verified,
        mapAccessPaid: user.map_access_paid,
        saved_property_ids: (user as any).saved_property_ids || [],
        createdAt: user.created_at.toISOString(),
      };
    }
  }

  const data = await getPropertyDetails(Number(id), dbUser ? Number(dbUser.id) : undefined);

  if (!data) {
    return notFound();
  }

  return (
    <PropertyDetailsContent
      property={data.property as any}
      verification={data.verification}
      hasPaid={data.hasPaid}
      hasUnlockedContact={data.hasUnlockedContact}
      currentUser={dbUser}
      isSaved={data.isSaved}
      paymentId={data.paymentId}
      hasRefund={data.hasRefund}
    />
  );
}
