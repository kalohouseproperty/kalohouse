"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { getDashboardPath } from "@/lib/access";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Filter, Globe, LockKeyhole, Map as MapIcon, X, Menu } from "lucide-react";
import Link from "next/link";
import type { Property, User } from "@/types/models";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { checkMapAccess, startMapAccessMtnPayment } from "@/app/actions/visits";
import { MAP_ACCESS_PRICE_RWF } from "@/lib/pricing";

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
  const [phone, setPhone] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative h-screen w-full bg-main-bg">
      {/* Mobile Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-[1001] flex items-center justify-between p-3 sm:p-4 lg:hidden">
        <Button 
          variant="secondary" 
          asChild 
          className="rounded-xl bg-card-bg/90 px-4 py-5 text-[#f9fafb] shadow-2xl backdrop-blur-xl border border-white/5 hover:bg-card-bg hover:border-[#c9a646]/30 transition-all group"
        >
          <Link href={currentUser ? getDashboardPath(currentUser.role) : "/"}>
            <ArrowLeft className="mr-2 size-4 text-[#c9a646] group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em]">Back</span>
          </Link>
        </Button>
        <Button
          variant="secondary"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-xl bg-card-bg/90 px-4 py-5 text-[#f9fafb] shadow-2xl backdrop-blur-xl border border-white/5 hover:bg-card-bg hover:border-[#c9a646]/30 transition-all"
        >
          {sidebarOpen ? <X className="size-4 text-[#c9a646]" /> : <Menu className="size-4 text-[#c9a646]" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex absolute left-6 top-6 z-[1001] flex-col gap-5">
        <Button 
          variant="secondary" 
          asChild 
          className="w-fit rounded-2xl bg-card-bg/90 px-6 py-6 text-[#f9fafb] shadow-2xl backdrop-blur-xl border border-white/5 hover:bg-card-bg hover:border-[#c9a646]/30 transition-all group"
        >
          <Link href={currentUser ? getDashboardPath(currentUser.role) : "/"}>
            <ArrowLeft className="mr-3 size-5 text-[#c9a646] group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">{currentUser ? "Dashboard" : "Marketplace"}</span>
          </Link>
        </Button>

        <div className="flex w-[340px] flex-col gap-4 rounded-[2rem] bg-card-bg/90 p-6 shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl border border-white/5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-[#c9a646]/10 flex items-center justify-center text-[#c9a646]">
                <Globe className="size-3.5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64748b]">Language</span>
            </div>
            <LanguageSwitcher />
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
            <Input 
              placeholder="Search by neighborhood..." 
              className="h-12 rounded-xl border-white/5 bg-white/5 pl-10 text-sm font-medium text-[#f9fafb] placeholder:text-[#64748b] focus:ring-[#c9a646]/20 focus:border-[#c9a646]/40 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64748b]">Found</p>
              <p className="text-base font-serif font-bold text-[#f9fafb]">{filteredProperties.length} listings</p>
            </div>
            <Button variant="ghost" size="sm" className="h-9 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a646] hover:bg-[#c9a646]/10">
              <Filter className="mr-1.5 size-3.5" />
              Advanced
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="absolute inset-0 z-[1000] bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`absolute top-16 left-3 right-3 z-[1001] lg:hidden transition-all duration-300 ${sidebarOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col gap-4 rounded-2xl bg-card-bg/95 p-5 shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-[#c9a646]/10 flex items-center justify-center text-[#c9a646]">
                <Globe className="size-3.5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64748b]">Language</span>
            </div>
            <LanguageSwitcher />
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
            <Input 
              placeholder="Search by neighborhood..." 
              className="h-12 rounded-xl border-white/5 bg-white/5 pl-10 text-sm font-medium text-[#f9fafb] placeholder:text-[#64748b] focus:ring-[#c9a646]/20 focus:border-[#c9a646]/40 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64748b]">Found</p>
              <p className="text-base font-serif font-bold text-[#f9fafb]">{filteredProperties.length} listings</p>
            </div>
            <Button variant="ghost" size="sm" className="h-9 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a646] hover:bg-[#c9a646]/10">
              <Filter className="mr-1.5 size-3.5" />
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
          <div className="h-full w-full bg-main-bg flex items-center justify-center">
            <div className="max-w-sm sm:max-w-md mx-auto text-center px-6">
              <div className="size-16 sm:size-20 rounded-2xl sm:rounded-3xl bg-[#c9a646]/10 flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-[#c9a646]/20">
                <LockKeyhole className="size-8 sm:size-10 text-[#c9a646]" />
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#f9fafb] mb-3">Map Access Required</h2>
              <p className="text-[#64748b] text-sm leading-relaxed mb-6 sm:mb-8">
                Unlock the full interactive map to explore all available properties across Kigali. 
                Pay RWF {MAP_ACCESS_PRICE_RWF.toLocaleString("en-US")} once to view property locations.
              </p>
              {currentUser ? (
                <div className="space-y-4">
                  <label className="block text-left">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-[#64748b]">
                      MTN Mobile Money number
                    </span>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="+250 78..."
                      className="h-12 rounded-xl border-white/10 bg-white/5 text-[#f9fafb] placeholder:text-[#64748b]"
                    />
                  </label>
                  <Button
                    className="h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-[#c9a646] hover:bg-[#c9a646]/90 text-main-bg font-black text-base sm:text-lg shadow-xl shadow-[#c9a646]/20 transition-all active:scale-95 w-full"
                    disabled={pending}
                    onClick={() => {
                      startTransition(async () => {
                        const result = await startMapAccessMtnPayment(phone);
                        if ("error" in result) {
                          setPurchaseMessage(result.error as string);
                        } else {
                          setPurchaseMessage(result.message || "Payment request sent. Approve it on your phone.");

                          const interval = window.setInterval(async () => {
                            const status = await checkMapAccess();
                            if (status.paid) {
                              window.clearInterval(interval);
                              setPurchaseMessage("Payment confirmed. Unlocking map...");
                              window.location.reload();
                            }
                          }, 3000);

                          window.setTimeout(() => window.clearInterval(interval), 120000);
                        }
                      });
                    }}
                  >
                    <MapIcon className="size-5" />
                    {pending ? "Sending MTN prompt..." : `Pay with MTN - RWF ${MAP_ACCESS_PRICE_RWF.toLocaleString("en-US")}`}
                  </Button>
                  {purchaseMessage && (
                    <p className="text-sm text-[#c9a646] font-medium">{purchaseMessage}</p>
                  )}
                  <p className="text-[10px] text-[#64748b] font-medium uppercase tracking-widest">
                    One-time payment • Lifetime access
                  </p>
                </div>
              ) : (
                <Button asChild className="h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-[#c9a646] hover:bg-[#c9a646]/90 text-main-bg font-black text-base sm:text-lg shadow-xl shadow-[#c9a646]/20 transition-all active:scale-95 w-full">
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
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto z-[1001]">
          <div className="flex items-center gap-4 sm:gap-8 rounded-xl sm:rounded-2xl bg-main-bg/95 px-4 sm:px-8 py-4 sm:py-5 text-white shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl border border-[#c9a646]/20">
            <div className="flex items-center gap-3">
              <div className="size-9 sm:size-10 rounded-xl bg-[#c9a646]/10 flex items-center justify-center text-[#c9a646]">
                <Search className="size-4 sm:size-5" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#64748b]">Total</p>
                <p className="text-lg sm:text-xl font-serif font-bold tracking-tighter text-[#f9fafb]">{properties.length}</p>
              </div>
            </div>
            <div className="h-8 sm:h-10 w-px bg-white/5" />
            <div className="flex items-center gap-3">
              <div className="size-9 sm:size-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                <Filter className="size-4 sm:size-5" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#64748b]">Avg Price</p>
                <p className="text-lg sm:text-xl font-serif font-bold tracking-tighter text-[#e6c76e]">RWF 45.2M</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
