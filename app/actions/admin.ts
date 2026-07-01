"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../lib/prisma";
import { authorizeRole } from "../../lib/auth-utils";
import { PropertyStatus, UserRole } from "@/prisma/generated/client";
import { Prisma } from "@/prisma/generated/client/client";
import { sendAgentInviteEmail } from "@/lib/email";

export async function updateCommissionRate(rate: number) {
  await authorizeRole([UserRole.admin]);

  const Decimal = Prisma.Decimal;

  await prisma.$transaction(async (tx) => {
    // Deactivate current active rates
    await tx.commissionSetting.updateMany({
      where: { is_active: true },
      data: { is_active: false },
    });

    // Create new rate
    await tx.commissionSetting.create({
      data: {
        rate: new Decimal(rate),
        is_active: true,
      },
    });
  });

  revalidatePath("/dashboard/admin");
  return { success: true };
}

export async function assignPropertyToAgent(propertyId: number, agentId: number) {
  await authorizeRole([UserRole.admin]);

  if (!agentId || agentId === 0) {
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        assigned_agent_id: null,
        status: PropertyStatus.pending_verification,
      },
    });
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/admin/verifications");
    return { success: true };
  }

  const agent = await prisma.user.findUnique({
    where: { id: agentId },
  });

  if (!agent || agent.role !== UserRole.agent) {
    throw new Error("Invalid agent");
  }

  await prisma.property.update({
    where: { id: propertyId },
    data: {
      assigned_agent_id: agentId,
      status: PropertyStatus.agent_assigned,
    },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/verifications");
  return { success: true };
}

export async function decideRefund(refundId: number, status: "approved" | "rejected") {
  await authorizeRole([UserRole.admin]);

  await prisma.refund.update({
    where: { id: refundId },
    data: { status: status === "approved" ? "approved" : "rejected" },
  });

  revalidatePath("/dashboard/admin");
  return { success: true };
}

export async function requestPayout(ownerId: number) {
  const owner = await authorizeRole([UserRole.owner, UserRole.admin]);
  if (!owner) throw new Error("Unauthorized");

  const pendingPayouts = await prisma.payout.findMany({
    where: { owner_id: ownerId, status: "pending" },
  });

  if (pendingPayouts.length === 0) {
    return { success: false, error: "No pending payouts to withdraw." };
  }

  await prisma.$transaction(
    pendingPayouts.map((payout) =>
      prisma.payout.update({
        where: { id: payout.id },
        data: { status: "completed" },
      })
    )
  );

  revalidatePath("/dashboard/owner");
  return { success: true, count: pendingPayouts.length };
}

export async function createAgentInvite(email: string, name: string, district: string, sectorName: string) {
  const admin = await authorizeRole([UserRole.admin]);
  if (!admin) throw new Error("Unauthorized");

  let sector = await prisma.sector.findFirst({
    where: { district, name: sectorName },
  });

  if (!sector) {
    sector = await prisma.sector.create({
      data: { district, name: sectorName },
    });
  }

  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const invite = await prisma.agentInvite.create({
    data: {
      email,
      name,
      token,
      sector_id: sector.id,
      created_by_id: admin.id,
      expires_at: expiresAt,
      status: "pending",
    },
  });

  try {
    await sendAgentInviteEmail(email, name, token, admin.full_name);
  } catch (emailError) {
    console.error("Failed to send invite email:", emailError);
  }

  revalidatePath("/dashboard/admin");
  return { success: true, token };
}
