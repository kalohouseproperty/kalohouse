"use client";

import {
  Search, ShieldCheck, Star,
  ChevronRight, Sparkles, Navigation,
  Home, Building2, Store, Warehouse
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PropertyGrid } from "@/components/ui/property-grid";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { getDashboardPath } from "@/lib/access";
import type { Property, User } from "@/types/models";
import type { Translations } from "@/lib/i18n-server";
import { cn } from "@/lib/utils";

interface LandingPageContentV2Props {
  properties: Property[];
  currentUser: User | null;
  tData: Translations;
}

const quickCategories = [
  { id: "Apartment", label: "Apartments", icon: Building2 },
  { id: "Villa", label: "Villas", icon: Home },
  { id: "Shop", label: "Commercial", icon: Store },
  { id: "Office", label: "Offices", icon: Warehouse },
];

export function LandingPageContentV2({ properties, currentUser, tData }: LandingPageContentV2Props) {
  const t = (key: keyof Translations) => tData[key] || String(key);
  const [activeTab, setActiveTab] = useState<"all" | "Rent" | "Sale">("all");

  const filteredProperties = properties.filter(p => {
    if (activeTab === "all") return true;
    return p.purpose === activeTab;
  });

  return (
    <div className="min-h-screen bg-main-bg text-white">
      {/* 1. Minimal Glass Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 h-20 border-b border-white/5 bg-main-bg/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/v2" className="flex items-center gap-2 group">
             <div className="size-10 rounded-full border-2 border-gold/40 overflow-hidden relative">
                <Image src="/kalohouse.png" alt="Kalohouse" fill className="object-cover" />
             </div>
             <span className="font-serif text-xl text-white tracking-tight">Kalohouse</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/properties" className="text-sm font-medium text-muted-text hover:text-white transition-colors">{t("properties")}</Link>
            <Link href="/properties" className="text-sm font-medium text-muted-text hover:text-white transition-colors">{t("rent")}</Link>
            <Link href="/map" className="text-sm font-medium text-muted-text hover:text-white transition-colors">Map</Link>
            {currentUser ? (
              <Link href={getDashboardPath(currentUser.role)} className="text-sm font-medium text-gold hover:text-gold-light transition-colors">Dashboard</Link>
            ) : (
              <Link href="/auth" className="text-sm font-medium text-gold hover:text-gold-light transition-colors">{t("signin")}</Link>
            )}
            <LanguageSwitcher />
          </div>

          <Button asChild size="sm" className="bg-gold text-navy-dark font-black rounded-xl">
            <Link href="/properties">{t("browseHomes")}</Link>
          </Button>
        </div>
      </nav>

      {/* 2. Search-First Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Sparkles className="size-4 text-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-light">{t("kigaliPropertyVerified")}</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-8 leading-[1.1]">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base text-muted-text">{t("heroSubtitle")}</p>

          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="glass-card rounded-[2.5rem] p-2 border border-white/10 shadow-2xl flex items-center">
              <div className="flex-1 flex items-center px-6">
                <Search className="size-5 text-muted-text mr-3" />
                <input 
                  type="text" 
                  placeholder="Search by district, sector, or home type..." 
                  className="w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-muted-text/50"
                />
              </div>
              <Button size="lg" className="rounded-full px-8 bg-gold text-navy-dark font-black h-14">
                Explore
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mt-8">
               <div className="flex items-center gap-2 text-xs text-muted-text">
                  <ShieldCheck className="size-4 text-success" /> {t("agentVerified")}
               </div>
               <div className="flex items-center gap-2 text-xs text-muted-text">
                  <Star className="size-4 text-gold" /> Premium Listings
               </div>
               <div className="flex items-center gap-2 text-xs text-muted-text">
                  <Navigation className="size-4 text-info" /> Direct to Owner
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category & Discovery */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {quickCategories.map((cat) => (
              <button
                key={cat.id}
                className="group relative h-40 rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <cat.icon className="size-8 text-gold group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-white uppercase tracking-widest">{cat.label}</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-1 bg-gold/0 group-hover:bg-gold/50 transition-all" />
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-serif text-white mb-2">{t("featuredHomes")}</h2>
              <p className="text-muted-text">{t("featuredSubtitle")}</p>
            </div>

            <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
              {(["all", "Rent", "Sale"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                    activeTab === tab ? "bg-gold text-navy-dark" : "text-muted-text hover:text-white"
                  )}
                >
                  {tab === "all" ? t("viewAll") : t(tab === "Rent" ? "rent" : "sale")}
                </button>
              ))}
            </div>
          </div>

          <PropertyGrid 
            properties={filteredProperties} 
            limit={10}
            isUserVerified={currentUser?.isVerified}
          />

          <div className="mt-16 text-center">
            <Button variant="secondary" size="lg" asChild className="rounded-2xl px-10 h-14">
              <Link href="/properties">
                {t("viewAll")} <ChevronRight className="size-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. The Kalohouse Standard (Trust Section) */}
      <section className="py-24 border-y border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-serif text-white mb-8 leading-tight">
                {t("trustBuiltIn")}
              </h2>
              <p className="text-lg text-muted-text leading-relaxed mb-12">
                {t("heroSubtitle")}
              </p>

              <div className="space-y-6">
                {[
                  { title: "Physical Verification", desc: "An agent visits every home to ensure it exists and matches its photos." },
                  { title: "Owner KYC", desc: "We verify the identity of the landlord or seller before they can list." },
                  { title: "Secure Payouts", desc: "Your payment is held until you've successfully visited the property." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="size-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-1">
                      <div className="size-2 rounded-full bg-gold" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-text">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 relative bg-navy-dark">
                {/* Fallback color if image fails */}
                <Image 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000" 
                  alt="Verified Living" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent" />
                
                <div className="absolute bottom-10 left-10 right-10 p-8 glass-card rounded-3xl border border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-12 rounded-full bg-success/20 flex items-center justify-center">
                      <ShieldCheck className="size-6 text-success" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-success tracking-widest">Certified Trust</p>
                      <p className="text-lg font-serif text-white">Kalohouse Shield</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-text">
                    {t("refundProtectionCopy")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-4xl">
           <h2 className="text-5xl font-serif text-white mb-8">{t("saferWayToVisit")}</h2>
           <p className="text-lg text-muted-text mb-12">{t("heroSubtitle")}</p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-gold text-navy-dark font-black text-lg w-full sm:w-auto">
                Start Exploring
              </Button>
              <Button variant="secondary" size="lg" className="h-16 px-10 rounded-2xl border-white/10 text-white text-lg w-full sm:w-auto">
                How it works
              </Button>
           </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
             <div className="size-8 rounded-full border border-gold/40 relative">
                <Image src="/kalohouse.png" alt="Kalohouse" fill className="object-cover" />
             </div>
             <span className="font-serif text-lg text-white">Kalohouse</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-text">
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
            <Link href="#" className="hover:text-white">Support</Link>
          </div>
          <p className="text-sm text-muted-text">© 2026 Kalohouse Kigali. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
