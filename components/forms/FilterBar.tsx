import { Search, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { rwandaLocation } from "@devrw/rwanda-location";
import type { PropertyPurpose } from "@/types/models";
import { cn } from "@/lib/utils";
export type FilterValues = {
  purpose: "" | PropertyPurpose;
  district: string;
  sector: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  query?: string;
};

interface FilterBarProps {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  isLandingPage?: boolean;
}

export function FilterBar({
  filters,
  onChange,
  isLandingPage = false
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState(filters.query || "");

  // derive sectors dynamically from rwanda-location
  const allDistricts = rwandaLocation.getDistricts();
  const sectors = (() => {
    if (!filters.district) return [];
    const found = allDistricts.find(d => d.name === filters.district);
    if (!found) return [];
    return rwandaLocation.getSectors(found.code).map((s: any) => s.name);
  })();

  const update = (patch: Partial<FilterValues>) => onChange({ ...filters, ...patch });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      onChange({ ...filters, query: "" });
      return;
    }
    onChange({ ...filters, query: searchQuery });
  };

  const priceRanges = [
    { label: "Price Range", value: "" },
    { label: "Under $500", value: "0-500" },
    { label: "$500 - $1,000", value: "500-1000" },
    { label: "$1,000 - $2,500", value: "1000-2500" },
    { label: "$2,500 - $5,000", value: "2500-5000" },
    { label: "$5,000+", value: "5000-999999" },
  ];

  const handlePriceRangeChange = (rangeValue: string) => {
    if (!rangeValue) {
      update({ minPrice: "", maxPrice: "" });
      return;
    }
    const [min, max] = rangeValue.split("-");
    update({ minPrice: min, maxPrice: max });
  };

  const currentPriceRangeValue = filters.minPrice || filters.maxPrice 
    ? `${filters.minPrice || "0"}-${filters.maxPrice || "999999"}`
    : "";

  if (isLandingPage) {
    return (
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6">
        <div className="glass-card shadow-2xl shadow-slate-900/40 border border-white/10 rounded-[2.5rem] p-3 flex flex-col gap-3 bg-main-bg/90 backdrop-blur-3xl ring-1 ring-white/10">
          
          {/* AI Natural Language Search Input */}
          <div className="relative group w-full">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gold/60 group-focus-within:text-gold transition-colors">
              <Sparkles className="size-5" />
            </div>
            <Input 
              placeholder="Search with AI: 'Luxury villa in Gasabo under $2000'..."
              className="h-16 pl-14 pr-32 bg-white/5 border-none rounded-[1.8rem] text-lg focus:ring-gold/20 placeholder:text-text-secondary/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Button 
                onClick={handleSearch}
                className="h-12 px-6 rounded-2xl bg-gold text-main-bg font-black text-sm transition-all hover:scale-105 active:scale-95"
              >
                Search
              </Button>
            </div>
          </div>

          <div className="h-px bg-white/5 mx-4" />

          <div className="flex flex-col lg:flex-row items-center gap-3">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full">
              <div className="group lg:col-span-1">
                  <Select 
                  value={filters.district} 
                  onChange={(event) => update({ district: event.target.value as FilterValues["district"], sector: "" })}
                  className="h-14 border-none bg-white/5 hover:bg-white/10 transition-all rounded-3xl text-sm px-6 focus:ring-gold/20"
                >
                  <option value="">Where in Kigali?</option>
                  {rwandaLocation.getDistricts(1).map((d: any) => (
                    <option key={d.code} value={d.name}>{d.name}</option>
                  ))}
                </Select>
              </div>

              <div className="group lg:col-span-1">
                <Select 
                  value={filters.propertyType} 
                  onChange={(event) => update({ propertyType: event.target.value })}
                  className="h-14 border-none bg-white/5 hover:bg-white/10 transition-all rounded-3xl text-sm px-6 focus:ring-gold/20"
                >
                  <option value="">Property Type</option>
                  {["Apartment", "House", "Villa", "Studio", "Commercial", "Office", "Shop", "Warehouse", "Garden", "Event Hall"].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
              </div>

              <div className="group lg:col-span-1">
                <Input 
                  type="number" 
                  placeholder="Min Price"
                  className="h-14 border-none bg-white/5 hover:bg-white/10 transition-all rounded-3xl text-sm px-6 focus:ring-gold/20 placeholder:text-text-secondary/40"
                  value={filters.minPrice}
                  onChange={(e) => update({ minPrice: e.target.value })}
                />
              </div>

              <div className="group lg:col-span-1">
                <Input 
                  type="number" 
                  placeholder="Max Price"
                  className="h-14 border-none bg-white/5 hover:bg-white/10 transition-all rounded-3xl text-sm px-6 focus:ring-gold/20 placeholder:text-text-secondary/40"
                  value={filters.maxPrice}
                  onChange={(e) => update({ maxPrice: e.target.value })}
                />
              </div>

              <div className="group lg:col-span-1">
                <Select 
                  value={filters.purpose} 
                  onChange={(event) => update({ purpose: event.target.value as FilterValues["purpose"] })}
                  className="h-14 border-none bg-white/5 hover:bg-white/10 transition-all rounded-3xl text-sm px-6 focus:ring-gold/20"
                >
                  <option value="">Rent or Sale?</option>
                  <option value="Rent">Rent</option>
                  <option value="Sale">Sale</option>
                </Select>
              </div>
            </div>

            <Button 
              className="h-14 lg:w-auto w-full px-10 bg-gold hover:bg-gold-light text-main-bg font-bold rounded-[1.8rem] transition-all hover:scale-[1.03] active:scale-95 shadow-xl shadow-gold/20 flex items-center justify-center gap-2"
              onClick={handleSearch} 
            >
              <Search className="size-5" />
              <span>Search</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card grid gap-4 rounded-2xl p-4 md:grid-cols-2 xl:grid-cols-6">
      <Select label="Listing" value={filters.purpose} onChange={(event) => update({ purpose: event.target.value as FilterValues["purpose"] })}>
        <option value="">Rent or Sale</option>
        <option value="Rent">Rent</option>
        <option value="Sale">Sale</option>
      </Select>
      <Select
        label="District"
        value={filters.district}
        onChange={(event) => update({ district: event.target.value as FilterValues["district"], sector: "" })}
      >
        <option value="">All districts</option>
        {rwandaLocation.getDistricts().map((d: any) => (
          <option key={d.code} value={d.name}>
            {d.name}
          </option>
        ))}
      </Select>
      <Select label="Sector" value={filters.sector} onChange={(event) => update({ sector: event.target.value })}>
        <option value="">All sectors</option>
        {sectors.map((sector) => (
          <option key={sector} value={sector}>
            {sector}
          </option>
        ))}
      </Select>
      <Select
        label="Property type"
        value={filters.propertyType}
        onChange={(event) => update({ propertyType: event.target.value })}
      >
        <option value="">All types</option>
        {["Apartment", "Bungalow", "Duplex", "House", "Studio", "Townhouse", "Villa"].map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>
      <label className="grid gap-2 text-sm text-text-secondary">
        Min price
        <Input
          type="number"
          min="0"
          value={filters.minPrice}
          onChange={(event) => update({ minPrice: event.target.value })}
          placeholder="500"
        />
      </label>
      <label className="grid gap-2 text-sm text-text-secondary">
        Max price
        <Input
          type="number"
          min="0"
          value={filters.maxPrice}
          onChange={(event) => update({ maxPrice: event.target.value })}
          placeholder="3000"
        />
      </label>
      <div className="flex items-end xl:col-span-6">
        <Button className="w-full" onClick={() => onChange({ purpose: "", district: "", sector: "", propertyType: "", minPrice: "", maxPrice: "" })}>
          <RotateCcw className="size-4 mr-2" />
          Reset filters
        </Button>
      </div>
    </div>
  );
}
