"use client";

import { Bell, Home, LogIn, Map as MapIcon, Menu, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useKalohouse } from "@/components/providers/KalohouseProvider";
import { getDashboardPath } from "@/lib/access";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ProfileDropdown } from "./ProfileDropdown";
import { NavbarSearch } from "./NavbarSearch";

export function Topbar({ title, onMenuToggle, fullWidth }: { title: string; onMenuToggle?: () => void; fullWidth?: boolean }) {
  const { currentUser, saved_property_ids, openSavedPanel } = useKalohouse();
  const isAuthenticated = !!currentUser;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    if (onMenuToggle) {
      onMenuToggle();
    } else {
      setIsMenuOpen((value) => !value);
    }
  };

  return (
    <header className={`sticky top-0 z-30 border-b border-white/8 bg-main-bg/86 px-3 py-3 backdrop-blur-xl sm:px-4 ${fullWidth ? "" : "lg:pl-72"}`}>
      <div className="flex items-center gap-4">
        {/* Logo Section - Left */}
        <div className="flex items-center gap-2 shrink-0 min-w-0">
          {onMenuToggle && (
            <button
              type="button"
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-muted-text hover:text-white transition-colors"
              aria-label="Toggle sidebar"
              onClick={handleMenuClick}
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          )}
          <div className="relative size-9 shrink-0 overflow-hidden rounded-full border border-gold/40">
            <Image src="/kalohouse.png" alt="Kalohouse Logo" fill className="object-cover" />
          </div>
          <div className="hidden sm:block truncate">
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold">Kalohouse</p>
            <h1 className="font-serif text-base text-white truncate">{title}</h1>
          </div>
        </div>

        {/* Search Bar - Center */}
        <div className="hidden sm:block flex-1 max-w-xl mx-auto">
          <NavbarSearch />
        </div>

        {/* Actions - Right */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <Button variant="secondary" size="icon" asChild className="hidden sm:inline-flex">
            <Link href="/map"><MapIcon className="size-5" /></Link>
          </Button>
          <Button variant="secondary" size="icon" className="hidden sm:inline-flex">
            <Bell className="size-5" />
          </Button>
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
              <Button variant="secondary" asChild className="hidden xl:inline-flex">
                <Link href={getDashboardPath(currentUser.role)}>My Dashboard</Link>
              </Button>
              <ProfileDropdown />
            </>
          ) : (
            <Button asChild className="hidden sm:flex">
              <Link href="/auth">Login / Sign Up</Link>
            </Button>
          )}
          {!onMenuToggle && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="sm:hidden"
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen((value) => !value)}
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          )}
        </div>
      </div>
      {!onMenuToggle && isMenuOpen && (
        <div className="mt-3 grid gap-2 rounded-2xl border border-white/10 bg-card-bg/95 p-3 shadow-2xl sm:hidden">
          <div className="sm:hidden">
            <NavbarSearch />
          </div>
          <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text-secondary hover:bg-white/5 hover:text-white" onClick={() => setIsMenuOpen(false)}>
            <Home className="size-4 text-gold" />
            Home
          </Link>
          <Link href="/map" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text-secondary hover:bg-white/5 hover:text-white" onClick={() => setIsMenuOpen(false)}>
            <MapIcon className="size-4 text-gold" />
            Map
          </Link>
          {isAuthenticated ? (
            <Link href={getDashboardPath(currentUser.role)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text-secondary hover:bg-white/5 hover:text-white" onClick={() => setIsMenuOpen(false)}>
              <LogIn className="size-4 text-gold" />
              My Dashboard
            </Link>
          ) : (
            <Link href="/auth" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text-secondary hover:bg-white/5 hover:text-white" onClick={() => setIsMenuOpen(false)}>
              <LogIn className="size-4 text-gold" />
              Login / Sign Up
            </Link>
          )}
          <div className="px-1 pt-1">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
