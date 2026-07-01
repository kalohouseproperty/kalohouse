"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, ShieldCheck, Users,
  Banknote, Map, Settings, LogOut, ChevronLeft, ChevronRight, Home, FileText, FolderKanban, CreditCard, ClipboardCheck, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useKalohouse } from "@/components/providers/KalohouseProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LanguageSwitcher } from "./LanguageSwitcher";

const navItemsByRole = {
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: FileText },
    { href: "/dashboard/admin/properties", label: "Properties", icon: Building2 },
    { href: "/dashboard/admin/verifications", label: "Verifications", icon: ShieldCheck },
    { href: "/dashboard/admin/agents", label: "Agents", icon: Users },
    { href: "/dashboard/admin/payments", label: "Payments", icon: Banknote },
    { href: "/map", label: "Operation Map", icon: Map },
    { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/profile", label: "My Profile", icon: FileText },
    { href: "/", label: "Marketplace", icon: Home },
  ],
  agent: [
    { href: "/dashboard/agent", label: "Sector Queue", icon: ClipboardCheck },
    { href: "/dashboard/profile", label: "My Profile", icon: FileText },
    { href: "/map", label: "Marketplace Map", icon: Map },
    { href: "/", label: "Marketplace", icon: Home },
  ],
  owner: [
    { href: "/dashboard/owner", label: "My Properties", icon: FolderKanban },
    { href: "/dashboard/client", label: "My Purchases", icon: LayoutDashboard },
    { href: "/properties", label: "Browse Homes", icon: Building2 },
    { href: "/map", label: "Marketplace Map", icon: Map },
    { href: "/dashboard/client#payments", label: "Payments", icon: CreditCard },
    { href: "/dashboard/profile", label: "My Profile", icon: FileText },
    { href: "/", label: "Marketplace", icon: Home },
  ],
  client: [
    { href: "/dashboard/client", label: "My Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "My Profile", icon: FileText },
    { href: "/", label: "Marketplace", icon: Home },
    { href: "/properties", label: "Browse Homes", icon: Building2 },
    { href: "/map", label: "Marketplace Map", icon: Map },
    { href: "/dashboard/client#payments", label: "Payments", icon: CreditCard },
  ],
};

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const { currentUser, logout } = useKalohouse();
  const navItems = currentUser ? navItemsByRole[currentUser.role] : [];

  const sidebarContent = (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center justify-between mb-8">
        <AnimatePresence>
          {isExpanded && <span className="font-serif text-xl text-white">Kalohouse</span>}
        </AnimatePresence>
        <div className="flex items-center gap-2">
          <button onClick={onMobileClose} className="p-1 rounded-lg hover:bg-white/5 lg:hidden">
            <X className="size-5 text-gold" />
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className="hidden lg:block p-1 rounded-lg hover:bg-white/5">
            {isExpanded ? <ChevronLeft className="size-5 text-gold" /> : <ChevronRight className="size-5 text-gold" />}
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const itemPath = item.href.split("#")[0];
            const isActive = pathname === itemPath;
            const content = (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "relative flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group",
                  isActive ? "bg-gold/10" : "hover:bg-white/5"
                )}
              >
                {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-gold rounded-r-full" />}
                <item.icon className={cn("size-5 shrink-0 transition-colors", isActive ? "text-gold" : "text-muted-text group-hover:text-white")} />
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn("text-sm font-medium", isActive ? "text-white" : "text-muted-text")}
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );

            return isExpanded ? content : (
              <Tooltip key={`${item.href}-${item.label}`}>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent side="right" className="bg-navy-primary text-white border-white/10">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      <div className="lg:hidden space-y-2 mb-4">
        <div className="px-3 py-2">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="mt-auto space-y-4">
        {isExpanded && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-gold/20 to-transparent border border-gold/20">
            <p className="text-[10px] text-gold font-bold uppercase">Trust Ops</p>
            <p className="text-[10px] text-white">System Verified</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-4 p-3 w-full rounded-xl hover:bg-danger/10 text-danger transition"
        >
          <LogOut className="size-5 shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-[260px] bg-main-bg border-r border-white/10 lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: isExpanded ? 240 : 80 }}
        className="hidden lg:flex fixed inset-y-0 left-0 z-40 bg-main-bg border-r border-white/10 flex-col transition-all duration-300"
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
