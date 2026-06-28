import { auth } from "@/auth";
import { UserRole } from "@/prisma/generated/client";
import prisma from "./prisma";

export async function getAuthorizedUser() {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return null;
  }

  if (!user.is_active) {
    return null;
  }

  return user;
}

export async function authorizeRole(roles: UserRole[]) {
  const user = await getAuthorizedUser();
  if (!user || !roles.includes(user.role)) {
    return null; // Return null instead of throwing to allow caller to handle redirect
  }
  return user;
}

