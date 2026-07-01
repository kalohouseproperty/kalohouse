"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useKalohouse, useRequireRole } from "@/components/providers/KalohouseProvider";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserRole } from "@/types/models";

export function DashboardShell({ title, role, children }: { title: string; role: UserRole; children: React.ReactNode }) {
  const { currentUser, loading } = useRequireRole(role);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Presentation Bypass: Allow admins to see ANY dashboard
  const isAuthorized = currentUser && (currentUser.role === role || currentUser.role === "admin");

  if (loading || !currentUser || !isAuthorized) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="w-full max-w-4xl space-y-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar isMobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
      <Topbar title={title} onMenuToggle={() => setSidebarOpen((v) => !v)} />
      <main className="px-4 py-6 sm:px-6 lg:pl-80">
        <div className="mx-auto max-w-7xl space-y-6">{children}</div>
      </main>
    </div>
  );
}
