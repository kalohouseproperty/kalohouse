"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import { useKalohouse } from "@/components/providers/KalohouseProvider";
import { getDashboardPath } from "@/lib/access";
import type { UserRole } from "@/types/models";

interface LandingNavbarProps {
  currentUser?: { role: UserRole; name?: string; email?: string } | null;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/map", label: "Map" },
  { href: "/about", label: "About" },
];

export function LandingNavbar({ currentUser }: LandingNavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = !!currentUser;
  const { saved_property_ids, openSavedPanel } = useKalohouse();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 border-b border-white/[0.04] bg-main-bg/60 backdrop-blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative size-9 overflow-hidden rounded-xl border border-gold/40 shadow-lg shadow-gold/10 transition-all duration-300 group-hover:shadow-gold/25 group-hover:border-gold/60 group-hover:scale-105">
            <Image src="/kalohouse.png" alt="Kalohouse Logo" fill className="object-cover" />
          </div>
          <span className="hidden sm:block font-serif text-lg tracking-tight text-white/90 group-hover:text-white transition-colors">
            Kalohouse
          </span>
        </Link>

        {/* Center - Nav Links + Search */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-white bg-white/[0.06]"
                      : "text-text-secondary/60 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-px left-1/2 -translate-x-1/2 h-px w-6 bg-gold rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <button
            onClick={openSavedPanel}
            className="relative flex size-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-text-secondary/60 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <ShoppingBag className="size-4" />
            {saved_property_ids.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-navy-dark">
                {saved_property_ids.length > 9 ? "9+" : saved_property_ids.length}
              </span>
            )}
          </button>
          {isAuthenticated ? (
            <>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="hidden lg:inline-flex h-9 rounded-lg border border-white/[0.06] bg-white/[0.04] px-4 text-xs font-semibold text-text-secondary/70 hover:bg-white/[0.08] hover:text-white"
              >
                <Link href={getDashboardPath(currentUser.role)}>Dashboard</Link>
              </Button>
              <ProfileDropdown />
            </>
          ) : (
            <>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="hidden sm:inline-flex h-9 rounded-lg border border-white/[0.06] bg-white/[0.04] px-4 text-xs font-semibold text-text-secondary/70 hover:bg-white/[0.08] hover:text-white hover:scale-105 active:scale-95 transition-all"
              >
                <Link href="/auth">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="h-9 rounded-lg px-5 bg-gold hover:bg-gold-light text-navy-dark font-semibold text-xs shadow-lg shadow-gold/20 transition-all hover:scale-105 active:scale-95"
              >
                <Link href="/auth">Create Account</Link>
              </Button>
            </>
          )}
          <button
            type="button"
            className="md:hidden p-1.5 rounded-lg hover:bg-white/5 text-text-secondary/60 hover:text-white transition-colors"
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="relative border-t border-white/[0.04] bg-main-bg/95 backdrop-blur-2xl md:hidden">
          <div className="space-y-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white bg-white/[0.06]"
                      : "text-text-secondary/70 hover:bg-white/[0.04] hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-white/[0.04]">
              {isAuthenticated ? (
                <Link
                  href={getDashboardPath(currentUser.role)}
                  className="flex items-center justify-center rounded-xl bg-white/[0.06] px-3 py-2.5 text-sm font-semibold text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="flex items-center justify-center rounded-xl bg-gold px-3 py-2.5 text-sm font-semibold text-navy-dark"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/auth"
                    className="flex items-center justify-center rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary/70 hover:text-white transition-colors mt-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
            <div className="pt-2 px-1">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
