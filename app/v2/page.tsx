export const dynamic = "force-dynamic";

import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getPublishedProperties } from "@/lib/dal";
import { getTranslations, parseLanguage } from "@/lib/i18n-server";
import { LandingPageContentV2 } from "@/components/home/LandingPageContent";
import type { User, UserRole } from "@/types/models";

type LandingPageV2Props = {
  searchParams?: Promise<{ lang?: string | string[] }>;
};

export default async function LandingPageV2({ searchParams }: LandingPageV2Props) {
  noStore();
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

  const properties = await getPublishedProperties();
  const params = await searchParams;
  const tData = getTranslations(parseLanguage(params?.lang));

  return (
    <LandingPageContentV2
      properties={properties}
      currentUser={dbUser}
      tData={tData}
    />
  );
}
