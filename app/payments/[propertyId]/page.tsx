export const dynamic = "force-dynamic";

import { unstable_noStore as noStore } from "next/cache";
import { redirect, notFound } from "next/navigation";

import { auth } from "@/auth";
import { getPropertyDetails } from "@/lib/dal";
import { PaymentPageContent } from "./PaymentPageContent";

export default async function PaymentPage({ params, searchParams }: { params: Promise<{ propertyId: string }>; searchParams?: Promise<{ type?: string }> }) {
  noStore();
  const { propertyId } = await params;
  const sp = searchParams ? await searchParams : {};
  const type = sp.type;
  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/auth?mode=signup&next=${encodeURIComponent(`/payments/${propertyId}`)}`);
  }

  const data = await getPropertyDetails(Number(propertyId));

  if (!data) {
    notFound();
  }

  return <PaymentPageContent property={data.property} paymentType={type === "unlock" ? "unlock" : "purchase"} />;
}
