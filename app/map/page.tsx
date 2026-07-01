import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getPublishedProperties } from "@/lib/dal";
import MapView from "@/components/map/MapView";
import type { User, UserRole } from "@/types/models";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const session = await auth();
  let dbUser: User | null = null;
  let hasMapAccess = false;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user) {
      hasMapAccess = user.map_access_paid;

      dbUser = {
        id: String(user.id),
        name: user.full_name,
        email: user.email,
        role: user.role as UserRole,
        status: user.is_active ? "active" : "suspended",
        isVerified: user.is_verified,
        mapAccessPaid: user.map_access_paid,
        saved_property_ids: [],
        createdAt: user.created_at.toISOString(),
      };
    }
  }

  const properties = await getPublishedProperties();

  return <MapView properties={properties as any} currentUser={dbUser} hasMapAccess={hasMapAccess} />;
}
