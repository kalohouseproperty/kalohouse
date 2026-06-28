export const dynamic = "force-dynamic";

import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPublishedProperties } from "@/lib/dal";
import { getTranslations, parseLanguage } from "@/lib/i18n-server";
import { LandingV2Content } from "@/components/home/LandingV2Content";
import type { User } from "@/types/models";

type LandingPageProps = {
  searchParams?: Promise<{ lang?: string | string[] }>;
};

export default async function LandingPage({ searchParams }: LandingPageProps) {
  noStore();
  const session = await auth();

  if (session?.user?.email) {
    redirect("/properties");
  }

  const properties = await getPublishedProperties();
  const params = await searchParams;
  const tData = getTranslations(parseLanguage(params?.lang));

  return (
    <LandingV2Content
      properties={properties}
      currentUser={session?.user as User | null ?? null}
      tData={tData}
    />
  );
}
