import type { Metadata } from "next";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getPropertyDetails } from "@/lib/dal";
import { PropertyDetailsContent } from "./PropertyDetailsContent";
import type { User, UserRole } from "@/types/models";
import { notFound } from "next/navigation";

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kalohouse.com";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await getPropertyDetails(Number(id));
    if (!data) return { title: "Property Not Found" };
    const p = data.property;
    const title = `${p.title} — ${p.purpose === "Rent" ? "For Rent" : "For Sale"} in ${p.district}`;
    const desc = p.description?.slice(0, 160) || `${p.title} in ${p.district}, Kigali. ${p.bedrooms} bed, ${p.bathrooms} bath. Verified on Kalohouse.`;
    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        url: `${baseUrl}/properties/${id}`,
        images: p.media?.images?.[0]?.url ? [{ url: p.media.images[0].url, width: 1200, height: 630, alt: p.title }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: desc,
      },
      alternates: {
        canonical: `${baseUrl}/properties/${id}`,
      },
    };
  } catch {
    return { title: "Property" };
  }
}

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
