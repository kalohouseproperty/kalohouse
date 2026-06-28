"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { getDashboardPath } from "@/lib/access";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Filter, Globe, LockKeyhole, Map as MapIcon } from "lucide-react";
import Link from "next/link";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import type { Property, User } from "@/types/models";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { purchaseMapAccess } from "@/app/actions/visits";

// Lazy load the map to avoid SSR issues with Leaflet
const LeafletMap = dynamic(() => import("./LeafletMap"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center font-serif text-gray-400">Loading Map...</div>
});

interface MapViewProps {
  properties: Property[];
  currentUser: User | null;
  hasMapAccess?: boolean;
}

export default function MapView({ properties, currentUser, hasMapAccess }: MapViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
  
  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative h-screen w-full bg-[#0b1220]">
      {/* Sidebar/Overlay Controls */}
      <div className="absolute left-8 top-8 z-[1001] flex flex-col gap-6">
        <Button 
          variant="secondary" 
          asChild 
          className="w-fit rounded-2xl bg-[#111827]/90 px-8 py-7 text-[#f9fafb] shadow-2xl backdrop-blur-xl border border-white/5 hover:bg-[#111827] hover:border-[#c9a646]/30 transition-all group"
        >
          <Link href={currentUser ? getDashboardPath(currentUser.role) : "/"}>
            <ArrowLeft className="mr-3 size-5 text-[#c9a646] group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">{currentUser ? "Dashboard" : "Marketplace"}</span>
          </Link>
        </Button>

        <div className="flex w-[380px] flex-col gap-5 rounded-[2.5rem] bg-[#111827]/90 p-7 shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-[#c9a646]/10 flex items-center justify-center text-[#c9a646]">
                <Globe className="size-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64748b]">System Language</span>
            </div>
            <LanguageSwitcher />
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#64748b]" />
            <Input 
              placeholder="Search by neighborhood..." 
              className="h-14 rounded-2xl border-white/5 bg-white/5 pl-12 text-sm font-medium text-[#f9fafb] placeholder:text-[#64748b] focus:ring-[#c9a646]/20 focus:border-[#c9a646]/40 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between px-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64748b]">Found</p>
              <p className="text-lg font-serif font-bold text-[#f9fafb]">{filteredProperties.length} listings</p>
            </div>
            <Button variant="ghost" size="sm" className="h-10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a646] hover:bg-[#c9a646]/10">
              <Filter className="mr-2 size-4" />
              Advanced
            </Button>
          </div>
        </div>
      </div>

      {/* Main Map */}
      <div className="relative h-full w-full">
        {hasMapAccess ? (
          <LeafletMap properties={filteredProperties} />
        ) : (
          <div className="h-full w-full bg-[#0b1220] flex items-center justify-center">
            <div className="max-w-md mx-auto text-center px-8">
              <div className="size-20 rounded-3xl bg-[#c9a646]/10 flex items-center justify-center mx-auto mb-8 border border-[#c9a646]/20">
                <LockKeyhole className="size-10 text-[#c9a646]" />
              </div>
              <h2 className="font-serif text-4xl font-bold text-[#f9fafb] mb-3">Map Access Required</h2>
              <p className="text-[#64748b] text-sm leading-relaxed mb-8">
                Unlock the full interactive map to explore all available properties across Kigali. 
                One-time payment gives you permanent access.
              </p>
              {currentUser ? (
                <div className="space-y-4">
                  <Button
                    className="h-16 rounded-2xl bg-[#c9a646] hover:bg-[#c9a646]/90 text-navy-dark font-black text-lg shadow-xl shadow-[#c9a646]/20 transition-all active:scale-95 w-full"
                    disabled={pending}
                    onClick={() => {
                      startTransition(async () => {
                        const result = await purchaseMapAccess();
                        if ("error" in result) {
                          setPurchaseMessage(result.error as string);
                        } else {
                          setPurchaseMessage(result.message || "Success!");
                          setTimeout(() => window.location.reload(), 1500);
                        }
                      });
                    }}
                  >
                    <MapIcon className="size-5" />
                    {pending ? "Processing..." : "Unlock Map – RWF 5,000"}
                  </Button>
                  {purchaseMessage && (
                    <p className="text-sm text-[#c9a646] font-medium">{purchaseMessage}</p>
                  )}
                  <p className="text-[10px] text-[#64748b] font-medium uppercase tracking-widest">
                    One-time payment • Lifetime access
                  </p>
                </div>
              ) : (
                <Button asChild className="h-16 rounded-2xl bg-[#c9a646] hover:bg-[#c9a646]/90 text-navy-dark font-black text-lg shadow-xl shadow-[#c9a646]/20 transition-all active:scale-95 w-full">
                  <Link href="/auth?mode=signup&next=/map">
                    <MapIcon className="size-5" />
                    Create Account to Unlock Map
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats Overlay */}
      {hasMapAccess && (
        <div className="absolute bottom-10 left-10 z-[1001]">
          <div className="flex items-center gap-10 rounded-[2rem] bg-[#0b1220]/95 px-10 py-7 text-white shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl border border-[#c9a646]/20">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-[#c9a646]/10 flex items-center justify-center text-[#c9a646]">
                <Search className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64748b]">Total in View</p>
                <p className="font-serif text-3xl font-bold tracking-tighter text-[#f9fafb]">{properties.length}</p>
              </div>
            </div>
            <div className="h-14 w-px bg-white/5" />
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                <Filter className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64748b]">Avg. Market Price</p>
                <p className="font-serif text-3xl font-bold tracking-tighter text-[#e6c76e]">RWF 45.2M</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
