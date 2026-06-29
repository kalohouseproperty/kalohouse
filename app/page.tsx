export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPublishedProperties } from "@/lib/dal";
import { getTranslations, parseLanguage } from "@/lib/i18n-server";
import { LandingV2Content } from "@/components/home/LandingV2Content";
import type { User } from "@/types/models";

export const metadata: Metadata = {
  title: "Kalohouse — Rwanda's Trust-First Property Marketplace",
  description:
    "Find verified properties for sale and rent in Kigali, Rwanda. Secure escrow payments, agent-verified listings, and buyer protection.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || "https://kalohouse.com",
  },
};

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
  const cookieStore = await cookies();
  const langFromUrl = params?.lang ? parseLanguage(params.lang) : undefined;
  const langFromCookie = cookieStore.get("language")?.value;
  const language = langFromUrl ?? parseLanguage(langFromCookie);
  const tData = getTranslations(language);

  return (
    <LandingV2Content
      properties={properties}
      currentUser={session?.user as User | null ?? null}
      tData={tData}
    />
  );
}
