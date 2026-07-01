"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { authorizeRole } from "@/lib/auth-utils";
import { UserRole } from "@/prisma/generated/client";

export async function updateProfile(data: {
  fullName: string;
  image?: string;
}) {
  const user = await authorizeRole([UserRole.admin, UserRole.agent, UserRole.owner, UserRole.client]);
  if (!user) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      full_name: data.fullName,
      ...(data.image !== undefined && { image: data.image || null }),
    },
  });

  revalidatePath("/dashboard", "layout");
  return { success: true };
}
