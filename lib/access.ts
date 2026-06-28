import type { User, UserRole } from "@/types/models";

export const dashboardPathByRole: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  agent: "/dashboard/agent",
  owner: "/dashboard/owner",
  client: "/dashboard/client",
};

export function getDashboardPath(role: UserRole): string {
  return dashboardPathByRole[role];
}

export function getAuthorizedRedirect(user: User | null): string {
  return user ? getDashboardPath(user.role) : "/auth";
}
