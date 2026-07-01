"use client";

import { Search, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { rwandaLocation, type District, type Sector } from "@devrw/rwanda-location";
export function NavbarSearch() {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  // Search State
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [purpose, setPurpose] = useState("");

  const allDistricts = rwandaLocation.getDistricts();
  const sectors = (() => {
    if (!district) return [];
    const found = allDistricts.find((d: District) => d.name === district);
    if (!found) return [];
    return rwandaLocation.getSectors(found.code).map((s: Sector) => s.name);
  })();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (district) params.set("district", district);
    if (sector) params.set("sector", sector);
    if (propertyType) params.set("propertyType", propertyType);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (purpose) params.set("purpose", purpose);
    
    router.push(`/properties?${params.toString()}`);
    setIsFocused(false);
  };

  const handleQuickSearch = () => {
    if (!query.trim()) return;
    const params = new URLSearchParams();
    params.set("query", query);
    if (district) params.set("district", district);
    if (sector) params.set("sector", sector);
    if (propertyType) params.set("propertyType", propertyType);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (purpose) params.set("purpose", purpose);
    router.push(`/properties?${params.toString()}`);
    setIsFocused(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target?.closest('[data-select-portal="true"]')) return;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isFocused && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "flex items-center transition-all duration-300 z-50",
        isFocused ? "w-full flex-1 px-0 sm:px-6" : "w-full md:max-w-60"
      )} ref={searchRef}>
        <div className="relative w-full">
          <div className="relative flex items-center group">
            <Search className={cn(
              "absolute left-3 size-3.5 transition-colors duration-200 z-10",
              isFocused ? "text-gold" : "text-muted-text group-hover:text-text-secondary"
            )} />
            <Input 
              className={cn(
                "pl-9 pr-10 h-9 w-full border-none transition-all duration-300 text-sm rounded-full",
                isFocused 
                  ? "bg-soft-bg shadow-2xl ring-1 ring-gold/40 ring-inset scale-[1.01]" 
                  : "bg-white/5 hover:bg-white/10"
              )} 
              placeholder={isFocused ? "Search properties, areas, or ask AI..." : "Search..."} 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {isFocused && (
              <button 
                type="button"
                onClick={() => { setIsFocused(false); setQuery(""); }}
                className="absolute right-3 p-1 rounded-md hover:bg-white/5 text-muted-text hover:text-white transition-colors"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div> 

          {/* Solid Full-Feature Dropdown */}
          <AnimatePresence>
            {isFocused && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="fixed left-3 right-3 top-24 max-h-[calc(100vh-7rem)] overflow-y-auto bg-card-bg border border-white/15 rounded-2xl p-4 z-50 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col gap-5 sm:absolute sm:left-0 sm:right-auto sm:top-[calc(100%+8px)] sm:w-[min(90vw,600px)] sm:p-6"
              >
                {/* 1. Main Query with AI Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex-1 relative">
                        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gold/60" />
                        <Input 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask AI: 'Luxury villa in Gasabo under $2000'..."
                            className="h-12 pl-10 bg-white/5 border-white/10 rounded-xl text-sm"
                        />
                    </div>
                    <Button 
                        onClick={handleQuickSearch}
                        className="h-12 px-6 bg-gold hover:bg-gold-light text-black font-black rounded-xl whitespace-nowrap"
                    >
                        Search
                    </Button>
                </div>

                <div className="h-px bg-white/10" />

                {/* 2. Location & Property Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-text px-1">District</p>
                        <Select 
                            value={district} 
                            onChange={(e) => { setDistrict(e.target.value); setSector(""); }}
                            className="h-11 bg-white/5 border-white/10"
                        >
                            <option value="">All Districts</option>
                            {allDistricts.map((d: District) => (
                                <option key={d.code} value={d.name}>{d.name}</option>
                            ))}
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-text px-1">Sector / Location</p>
                        <Select 
                            value={sector} 
                            onChange={(e) => setSector(e.target.value)}
                            className="h-11 bg-white/5 border-white/10"
                            disabled={!district}
                        >
                            <option value="">All Locations</option>
                            {sectors.map((s: string) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-text px-1">Property Type</p>
                        <Select 
                            value={propertyType} 
                            onChange={(e) => setPropertyType(e.target.value)}
                            className="h-11 bg-white/5 border-white/10"
                        >
                            <option value="">All Types</option>
                            {["Apartment", "House", "Villa", "Studio", "Commercial", "Office", "Shop", "Warehouse", "Garden", "Event Hall"].map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* 3. Price & Purpose */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-text px-1">Min Price</p>
                        <Input 
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="500"
                            className="h-11 bg-white/5 border-white/10"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-text px-1">Max Price</p>
                        <Input 
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="3000"
                            className="h-11 bg-white/5 border-white/10"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-text px-1">Rent or Sale?</p>
                        <Select 
                            value={purpose} 
                            onChange={(e) => setPurpose(e.target.value)}
                            className="h-11 bg-white/5 border-white/10"
                        >
                            <option value="">Both</option>
                            <option value="Rent">Rent</option>
                            <option value="Sale">Sale</option>
                        </Select>
                    </div>
                </div>

                {/* 4. Action Buttons */}
                <div className="mt-2 flex gap-3">
                    <Button 
                        variant="secondary"
                        onClick={() => {
                            setQuery(""); setDistrict(""); setSector(""); setPropertyType(""); 
                            setMinPrice(""); setMaxPrice(""); setPurpose("");
                        }}
                        className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white"
                    >
                        Reset All
                    </Button>
                    <Button 
                        onClick={handleSearch}
                        className="flex-2 h-12 bg-gold hover:bg-gold-light text-white font-black rounded-xl transition-all shadow-xl shadow-gold/10 active:scale-95"
                    >
                        Apply Filters & Search
                    </Button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
