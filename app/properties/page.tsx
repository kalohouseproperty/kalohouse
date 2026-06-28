export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { getPublishedProperties } from "@/lib/dal";
import { PropertiesContent } from "./PropertiesContent";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import type { User, UserRole } from "@/types/models";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent in Kigali, Rwanda",
  description:
    "Browse verified properties for sale and rent in Kigali and across Rwanda. Find apartments, houses, villas, and land with secure escrow payments.",
  openGraph: {
    title: "Properties for Sale & Rent | Kalohouse",
    description:
      "Browse verified properties for sale and rent in Kigali and across Rwanda.",
  },
};

export default async function PropertiesPage() {
  noStore();
  const properties = await getPublishedProperties();
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
        saved_property_ids: [],
        createdAt: user.created_at.toISOString(),
      };
    }
  }

  return <PropertiesContent properties={properties} currentUser={dbUser} />;
}
