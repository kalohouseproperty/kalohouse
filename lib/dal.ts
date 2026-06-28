import prisma from "./prisma";
import {
  PropertyStatus as PrismaStatus,
  PropertyPurpose as PrismaPropertyPurpose,
} from "@/prisma/generated/client";
import type { Property, PropertyPurpose, PropertyStatus } from "@/types/models";

/** UI / form values (Rent, Sale) → Prisma enum (rent, sale) */
export function toPrismaPropertyPurpose(
  purpose: string
): PrismaPropertyPurpose | null {
  const key = purpose.trim().toLowerCase();
  if (key === "rent" || key === "lease") return PrismaPropertyPurpose.rent;
  if (key === "sale") return PrismaPropertyPurpose.sale;
  return null;
}

export function fromPrismaPropertyPurpose(
  purpose: PrismaPropertyPurpose
): PropertyPurpose {
  return purpose === PrismaPropertyPurpose.rent ? "Rent" : "Sale";
}

const mapStatus = (status: PrismaStatus): PropertyStatus => {
  const mapping: Record<PrismaStatus, PropertyStatus> = {
    pending_verification: "Pending Verification",
    agent_assigned: "Agent Assigned",
    verified: "Verified",
    published: "Published",
    rejected: "Rejected",
    reserved: "Published",
    paid: "Published",
    completed: "Published"
  };
  return mapping[status] || "Pending Verification";
};

const mapProperty = (p: any): Property => ({
  id: String(p.id),
  ownerId: String(p.owner_id),
  title: p.title,
  description: p.description,
  purpose: fromPrismaPropertyPurpose(p.purpose),
  district: p.district,
  sector: p.sector,
  city: p.city || "Kigali",
  cell: p.cell || undefined,
  village: p.village || undefined,
  street: p.street || undefined,
  address: p.address,
  propertyType: p.property_type,
  bedrooms: p.bedrooms,
  bathrooms: p.bathrooms,
  kitchens: p.kitchens,
  livingRooms: p.living_rooms,
  sizeSqM: p.size_sq_m ? Number(p.size_sq_m) : undefined,
  parkingCapacity: p.parking_capacity,
  hasFence: p.has_fence,
  hasCctv: p.has_cctv,
  hasSecurityGuard: p.has_security_guard,
  isGatedCommunity: p.is_gated_community,
  hasFiber: p.has_fiber,
  hasCanalbox: p.has_canalbox,
  otherInternet: p.other_internet || undefined,
  ownerFullName: p.owner_full_name || undefined,
  ownerPhone: p.owner_phone || undefined,
  ownerWhatsapp: p.owner_whatsapp || undefined,
  ownerEmail: p.owner_email || undefined,
  ownerAltPhone: p.owner_alt_phone || undefined,
  ownerIdUrl: p.owner_id_url || undefined,
  isOwnerVerified: p.is_owner_verified,
  ownerPrice: Number(p.owner_price),
  commissionAmount: Number(p.commission_amount),
  finalDisplayPrice: Number(p.final_display_price),
  contactInfo: p.contact_info,
  location: p.location || undefined,
  latitude: p.latitude ? Number(p.latitude) : undefined,
  longitude: p.longitude ? Number(p.longitude) : undefined,
  status: mapStatus(p.status),
  createdAt: p.created_at.toISOString(),
  media: {
    images: p.media?.filter((m: any) => m.media_type === "image").map((m: any) => ({ url: m.url, label: m.label || undefined })) || [],
    video: p.media?.find((m: any) => m.media_type === "video")?.url,
  },
  assignedAgentId: p.assigned_agent_id ? String(p.assigned_agent_id) : undefined,
  rejectionReason: p.rejection_reason || undefined,
});

export async function getAdminDashboardData() {
  const [
    totalUsers,
    totalAgents,
    totalProperties,
    pendingVerifications,
    publishedProperties,
    totalPayments,
    totalCommissions,
    refundRequests,
    payoutsCount,
    recentProperties,
    recentPayments,
    allAgents,
    sectors,
    refunds,
    allPending
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "agent" } }),
    prisma.property.count(),
    prisma.property.count({ where: { status: { in: ["pending_verification", "agent_assigned"] } } }),
    prisma.property.count({ where: { status: "published" } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "paid" } }),
    prisma.property.aggregate({ _sum: { commission_amount: true }, where: { status: { in: ["paid", "completed"] } } }),
    prisma.refund.count({ where: { status: "requested" } }),
    prisma.payout.count(),
    prisma.property.findMany({
      include: { media: true },
      orderBy: { created_at: "desc" },
      take: 10
    }),
    prisma.payment.findMany({
      orderBy: { created_at: "desc" },
      take: 10
    }),
    prisma.user.findMany({
      where: { role: { in: ["agent", "admin"] } },
      orderBy: { full_name: "asc" }
    }),
    prisma.sector.findMany({ orderBy: [{ district: "asc" }, { name: "asc" }] }),
    prisma.refund.findMany({
      include: { property: { select: { title: true, district: true, sector: true } } },
      orderBy: { created_at: "desc" }
    }),
    prisma.property.findMany({
      where: { status: { in: ["pending_verification", "agent_assigned"] } },
      include: { media: true },
      orderBy: { created_at: "desc" }
    }),
  ]);

  const commissionSetting = await prisma.commissionSetting.findFirst({
    where: { is_active: true },
    orderBy: { id: "desc" },
  });

  // Analytics: Monthly Revenue (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const payments = await prisma.payment.findMany({
    where: {
      status: "paid",
      created_at: { gte: sixMonthsAgo }
    },
    select: {
      amount: true,
      created_at: true
    }
  });

  const monthlyRevenue = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = d.toLocaleString('default', { month: 'short' });
    const total = payments
      .filter(p => p.created_at.getMonth() === d.getMonth() && p.created_at.getFullYear() === d.getFullYear())
      .reduce((sum, p) => sum + Number(p.amount), 0);
    return { name: monthName, total };
  }).reverse();

  // Analytics: Properties by District
  const propertyCounts = await prisma.property.groupBy({
    by: ['district'],
    _count: { id: true }
  });

  const districtData = propertyCounts.map(item => ({
    name: item.district,
    value: item._count.id
  }));

  return {
    stats: {
      totalUsers,
      totalAgents,
      totalProperties,
      pendingVerifications,
      publishedProperties,
      totalPayments: Number(totalPayments._sum.amount || 0),
      totalCommissions: Number(totalCommissions._sum.commission_amount || 0),
      refundRequests,
      payoutsCount,
    },
    analytics: {
      monthlyRevenue,
      districtData
    },
    recentProperties: recentProperties.map(mapProperty),
    recentPayments: recentPayments.map(p => ({
      id: String(p.id),
      propertyId: String(p.property_id),
      clientId: String(p.client_id),
      amount: Number(p.amount),
      status: "Paid", 
      provider: p.provider,
      createdAt: p.created_at.toISOString(),
      finalDisplayPrice: Number(p.amount),
    })),
    agents: allAgents.map(a => ({
      id: String(a.id),
      name: a.full_name,
      email: a.email,
      role: a.role,
      assignedDistrict: a.sector_id ? "Gasabo" : undefined,
      assignedSector: a.sector_id ? "Kimihurura" : undefined,
      isVerified: a.is_verified,
      saved_property_ids: (a as any).saved_property_ids || [],
      status: a.is_active ? "active" : "suspended",
      createdAt: a.created_at.toISOString(),
    })),
    sectors,
    refunds: refunds.map(r => ({
      id: String(r.id),
      propertyId: String(r.property_id),
      paymentId: String(r.payment_id),
      clientId: String(r.client_id),
      amount: Number(r.amount),
      status: r.status === "requested" ? "Pending" : r.status === "approved" ? "Approved" : r.status === "rejected" ? "Rejected" : "Completed",
      reason: r.reason || "",
      createdAt: r.created_at.toISOString(),
      propertyTitle: (r as any).property?.title || "Property",
      propertyDistrict: (r as any).property?.district || "",
    })),
    pendingVerificationsList: (allPending || []).map(mapProperty),
    commissionRate: Number(commissionSetting?.rate || 0.10),
  };
}

export async function getOwnerDashboardData(ownerId: number) {
  const [properties, payouts, user] = await Promise.all([
    prisma.property.findMany({
      where: { owner_id: ownerId },
      include: { media: true },
      orderBy: { created_at: "desc" },
    }),
    prisma.payout.findMany({
      where: { owner_id: ownerId },
      include: { property: { select: { title: true } } },
      orderBy: { created_at: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: ownerId },
      select: { saved_property_ids: true } as any,
    }),
  ]);

  const pendingBalance = payouts
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalEarned = payouts
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return {
    properties: properties.map(mapProperty),
    payouts: payouts.map((p) => ({
      id: String(p.id),
      propertyId: String(p.property_id),
      ownerId: String(p.owner_id),
      amount: Number(p.amount),
      status: p.status === "completed" ? "Paid" : "Pending",
      createdAt: p.created_at.toISOString(),
      propertyTitle: (p as any).property?.title || "Property",
    })),
    revenue: {
      pending: pendingBalance,
      totalEarned,
      total: pendingBalance + totalEarned,
    },
    user: user ? { savedPropertyIds: user.saved_property_ids || [] } : null,
  };
}

export async function getAgentDashboardData(agentId: number, sectorId: number | null) {
  const [properties, sector, user] = await Promise.all([
    prisma.property.findMany({
      where: {
        OR: [
          { assigned_agent_id: agentId },
          { sector_id: sectorId || -1 }
        ],
      },
      include: { media: true, verification: true },
      orderBy: { created_at: "desc" },
    }),
    sectorId ? prisma.sector.findUnique({ where: { id: sectorId } }) : Promise.resolve(null),
    prisma.user.findUnique({
      where: { id: agentId },
      select: { saved_property_ids: true } as any,
    }),
  ]);

  // Calculate earnings: 20% of commission_amount for properties agent verified and are published/paid/completed
  const approvedVerifications = properties.filter(
    (p) => p.verification?.status === "approved" &&
    ["published", "paid", "completed"].includes(p.status)
  );
  const totalEarnings = approvedVerifications.reduce(
    (sum, p) => sum + Number(p.commission_amount) * 0.2,
    0
  );

  return {
    properties: properties.map(mapProperty),
    sector: sector ? {
      name: sector.name,
      district: sector.district,
    } : null,
    earnings: {
      total: totalEarnings,
      verifiedCount: approvedVerifications.length,
    },
    user: user ? { saved_property_ids: (user as any).saved_property_ids || [] } : null,
  };
}

export async function getClientDashboardData(clientId: number) {
  const [visits, payments, refunds, savedProperties, recommended, user] = await Promise.all([
    prisma.visitRequest.findMany({
      where: { client_id: clientId },
      include: { property: { include: { media: true } }, payment: true },
      orderBy: { created_at: "desc" },
    }),
    prisma.payment.findMany({
      where: { client_id: clientId },
      include: { property: { select: { title: true } }, refund: { select: { id: true, status: true } } },
      orderBy: { created_at: "desc" },
    }),
    prisma.refund.findMany({
      where: { client_id: clientId },
      orderBy: { created_at: "desc" },
    }),
    prisma.property.findMany({
      where: { status: "published" },
      include: { media: true },
      take: 3,
    }),
    prisma.property.findMany({
      where: { status: "published" },
      include: { media: true },
      take: 3,
    }),
    prisma.user.findUnique({
      where: { id: clientId },
      select: { saved_property_ids: true } as any,
    }),
  ]);

  return {
    visits: visits.map(v => ({
      id: String(v.id),
      propertyId: String(v.property_id),
      clientId: String(v.client_id),
      paymentId: v.payment_id ? String(v.payment_id) : undefined,
      status: v.status.charAt(0).toUpperCase() + v.status.slice(1),
      createdAt: v.created_at.toISOString(),
      property: {
        title: v.property.title,
      }
    })),
    payments: payments.map(p => ({
      id: String(p.id),
      propertyId: String(p.property_id),
      amount: Number(p.amount),
      finalDisplayPrice: Number(p.amount),
      status: p.status === "paid" ? "Paid" : "Refunded",
      provider: p.provider,
      providerReference: p.provider_reference,
      createdAt: p.created_at.toISOString(),
      propertyTitle: (p as any).property?.title || "Property",
      hasRefund: Boolean((p as any).refund),
      refundStatus: (p as any).refund?.status || null,
    })),
    refunds: refunds.map(r => ({
      id: String(r.id),
      paymentId: String(r.payment_id),
      amount: Number(r.amount),
      status: r.status === "requested" ? "Pending" : r.status === "approved" ? "Approved" : r.status === "rejected" ? "Rejected" : "Completed",
      reason: r.reason || "",
      createdAt: r.created_at.toISOString(),
      commissionKept: 0,
    })),
    saved: savedProperties.map(mapProperty),
    recommended: recommended.map(mapProperty),
    user: user ? { savedPropertyIds: user.saved_property_ids || [] } : null,
  };
}

export async function getPropertyDetails(propertyId: number, userId?: number) {
  const [property, verification, payment, commissionPayment, userSaved] = await Promise.all([
    prisma.property.findUnique({
      where: { id: propertyId, status: "published" },
      include: { media: true },
    }),
    prisma.verification.findFirst({
      where: { property_id: propertyId, status: "approved" },
    }),
    userId ? prisma.payment.findFirst({
      where: { property_id: propertyId, client_id: userId, status: "paid" },
    }) : Promise.resolve(null),
    userId ? prisma.payment.findFirst({
      where: {
        property_id: propertyId,
        client_id: userId,
        status: "paid",
        provider: "commission_unlock",
      },
    }) : Promise.resolve(null),
    userId ? prisma.user.findUnique({
      where: { id: userId },
      select: { saved_property_ids: true } as any,
    }) : Promise.resolve(null),
  ]);

  if (!property) return null;

  return {
    property: mapProperty(property),
    verification: verification ? {
      notes: verification.notes,
    } : null,
    hasPaid: Boolean(payment),
    hasUnlockedContact: Boolean(commissionPayment) || property.is_owner_verified,
    isSaved: userSaved ? (userSaved as any).saved_property_ids?.includes(String(propertyId)) : false,
  };
}

export async function getPublishedProperties(): Promise<Property[]> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is missing. Skipping database fetch during build.");
    return [];
  }

  try {
    const properties = await prisma.property.findMany({
      where: { status: PrismaStatus.published },
      include: {
        media: true,
      },
      orderBy: { created_at: "desc" },
    });

    return properties.map(mapProperty);
  } catch (error) {
    console.error("Failed to fetch published properties:", error);
    return [];
  }
}
