"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, User, Settings } from "lucide-react";
import { useKalohouse } from "@/components/providers/KalohouseProvider";
import { getDashboardPath } from "@/lib/access";
import Link from "next/link";

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useKalohouse();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative z-[100]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-gold/30 p-1 pl-3 bg-black/20 hover:bg-black/40 transition"
      >
        <span className="text-sm text-white font-medium">{currentUser?.name || "User"}</span>
        <div className="size-8 rounded-full bg-gold/20 flex items-center justify-center font-bold text-gold text-xs">
          {currentUser?.name?.charAt(0) || "U"}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-main-bg border border-white/10 rounded-xl shadow-2xl p-2 z-[101]">
          <div className="px-3 py-2 border-b border-white/5 mb-1">
            <p className="text-white font-semibold text-sm">{currentUser?.name || "User"}</p>
            <p className="text-muted-text text-xs">{currentUser?.email || "No email"}</p>
          </div>
          <Link href={currentUser ? getDashboardPath(currentUser.role) : "/"} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition">
            <User className="size-4" /> Open Dashboard
          </Link>
          {currentUser?.role === "admin" ? (
            <Link href="/dashboard/admin/settings" className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition">
              <Settings className="size-4" /> Account Settings
            </Link>
          ) : null}
          <div className="h-px bg-white/5 my-1" />
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition"
          >
            <LogOut className="size-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
