"use client";

import { useMemo, useState } from "react";
import { Building2, Search, RotateCcw, SlidersHorizontal, ArrowRight, X, Home, Play } from "lucide-react";
import Link from "next/link";

import { PropertyGrid } from "@/components/ui/property-grid";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useKalohouse } from "@/components/providers/KalohouseProvider";
import { rwandaLocation } from "@devrw/rwanda-location";
import type { Property, User } from "@/types/models";
import { cn } from "@/lib/utils";

interface PropertiesContentProps {
  properties: Property[];
  currentUser: User | null;
}

const propertyTypes = [
  "Apartment", "House", "Villa", "Studio", "Townhouse",
  "Bungalow", "Duplex", "Commercial", "Office", "Shop",
  "Warehouse", "Garden", "Event Hall", "Land",
];

export function PropertiesContent({ properties, currentUser }: PropertiesContentProps) {
  const { t } = useKalohouse();
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    query: "",
    district: "",
    propertyType: "",
    purpose: "",
    minPrice: "",
    maxPrice: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const districtOptions = useMemo(() => {
    const options: { value: string; label: string; disabled: boolean }[] = [];
    const provinces = rwandaLocation.getProvinces();
    for (const province of provinces) {
      options.push({ value: province.name, label: province.name, disabled: true });
      const districts = rwandaLocation.getDistricts(province.code);
      for (const d of districts) {
        options.push({ value: d.name, label: d.name, disabled: false });
      }
    }
    return options;
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (filters.district && p.district !== filters.district) return false;
      if (filters.propertyType && p.propertyType !== filters.propertyType) return false;
      if (filters.purpose && p.purpose !== filters.purpose) return false;
      if (filters.minPrice && p.finalDisplayPrice < Number(filters.minPrice)) return false;
      if (filters.maxPrice && p.finalDisplayPrice > Number(filters.maxPrice)) return false;
      if (filters.query) {
        const q = filters.query.toLowerCase();
        const matches =
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sector.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [properties, filters]);

  const hasFilters = Object.values(filters).some((v) => v !== "");
  const isUserVerified = currentUser?.isVerified || false;

  const clearFilters = () => {
    setFilters({ query: "", district: "", propertyType: "", purpose: "", minPrice: "", maxPrice: "" });
  };

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <LandingNavbar currentUser={currentUser} />
      <main className="min-h-screen bg-main-bg pt-16">
        {/* Premium Header */}
        <section className="relative overflow-hidden border-b border-white/[0.04]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px]" />
            <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
                  <Building2 className="size-3.5" />
                  {t("verified")}
                </p>
                <h1 className="font-serif text-4xl text-white sm:text-5xl lg:text-6xl tracking-tight">
                  {t("browseHomes")}
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary/70">
                  {t("heroSubtitle")}
                </p>
              </div>
              <div className="glass-card shrink-0 rounded-xl border border-gold/20 bg-gold/5 px-5 py-3 sm:text-right">
                <p className="text-3xl font-bold text-gold-light tracking-tighter">{filteredProperties.length}</p>
                <p className="text-xs uppercase tracking-widest text-text-secondary font-semibold mt-0.5">
                  {filteredProperties.length === 1 ? t("properties") : t("properties")}
                </p>
              </div>
            </div>

            {/* Search + Filter Bar */}
            <div className="mt-10">
              <div className="glass-card rounded-2xl p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-secondary/40" />
                    <input
                      type="text"
                      placeholder={t("searchPlaceholder")}
                      value={filters.query}
                      onChange={(e) => updateFilter("query", e.target.value)}
                      className="h-12 w-full rounded-xl border border-white/[0.06] bg-white/[0.04] pl-11 pr-4 text-sm text-white/80 placeholder:text-text-secondary/30 outline-none transition-all duration-200 focus:border-gold/30 focus:bg-white/[0.06]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={filters.purpose}
                      onChange={(e) => updateFilter("purpose", e.target.value)}
                      className="h-12 rounded-xl border-white/[0.06] bg-white/[0.04] hover:bg-white/[0.08] text-sm"
                    >
                    <option value="">{t("rentOrBuy")}</option>
                    <option value="Rent">{t("forRent")}</option>
                    <option value="Sale">{t("forSale")}</option>
                    </Select>
                    <Button
                      variant="secondary"
                      onClick={() => setShowFilters(!showFilters)}
                      className={cn(
                        "h-12 rounded-xl px-4 border border-white/[0.06] transition-all",
                        showFilters ? "bg-gold/10 border-gold/30 text-gold" : "bg-white/[0.04] text-text-secondary/70 hover:bg-white/[0.08]"
                      )}
                    >
                      <SlidersHorizontal className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Expandable Filters */}
                {showFilters && (
                  <div className="mt-3 pt-3 border-t border-white/[0.04]">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <Select
                        value={filters.district}
                        onChange={(e) => updateFilter("district", e.target.value)}
                        className="h-11 rounded-xl border-white/[0.06] bg-white/[0.04] text-sm"
                      >
                        <option value="">{t("allRwanda")}</option>
                        {districtOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                            {opt.label}
                          </option>
                        ))}
                      </Select>
                      <Select
                        value={filters.propertyType}
                        onChange={(e) => updateFilter("propertyType", e.target.value)}
                        className="h-11 rounded-xl border-white/[0.06] bg-white/[0.04] text-sm"
                      >
                        <option value="">{t("allTypes")}</option>
                        {propertyTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </Select>
                      <input
                        type="number"
                        placeholder={t("minPrice")}
                        value={filters.minPrice}
                        onChange={(e) => updateFilter("minPrice", e.target.value)}
                        className="h-11 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 text-sm text-white/80 placeholder:text-text-secondary/30 outline-none focus:border-gold/30"
                      />
                      <input
                        type="number"
                        placeholder={t("maxPrice")}
                        value={filters.maxPrice}
                        onChange={(e) => updateFilter("maxPrice", e.target.value)}
                        className="h-11 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 text-sm text-white/80 placeholder:text-text-secondary/30 outline-none focus:border-gold/30"
                      />
                    </div>
                    {hasFilters && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-text-secondary/50">
                          {filteredProperties.length} {filteredProperties.length !== 1 ? t("propertiesFound") : t("propertyFound")}
                        </span>
                        <button
                          onClick={clearFilters}
                          className="flex items-center gap-1 text-xs text-gold hover:text-gold-light transition-colors"
                        >
                          <RotateCcw className="size-3" />
                          {t("clearAllFilters")}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stories Strip */}
        {filteredProperties.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pt-8 sm:hidden">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-gold-light/60">
              {t("featuredProperties")}
            </p>
            <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {filteredProperties.slice(0, 12).map((property, idx) => (
                <button
                  key={property.id}
                  onClick={() => setStoryIndex(idx)}
                  className="flex shrink-0 flex-col items-center gap-2"
                >
                  <div className="relative size-20 overflow-hidden rounded-full border-2 border-gold/40 bg-card-bg p-0.5 shadow-lg shadow-gold/10 transition-transform hover:scale-105">
                    <div className="size-full overflow-hidden rounded-full">
                      {property.media.images[0] ? (
                        <img
                          src={property.media.images[0].url}
                          alt={property.title}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-gold/10">
                          <Home className="size-7 text-gold/40" />
                        </div>
                      )}
                    </div>
                    {property.media.video && (
                      <div className="absolute bottom-0 right-0 rounded-full bg-gold p-1 shadow">
                        <Play className="size-3 text-navy-dark" fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <span className="max-w-[80px] truncate text-xs font-medium text-text-secondary text-center">
                    {property.ownerFullName || t("owner")}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Story Viewer Overlay */}
        {storyIndex !== null && filteredProperties[storyIndex] && (
          <div className="fixed inset-0 z-50 flex flex-col bg-black sm:hidden">
            <div className="flex gap-1 px-2 pt-2">
              {filteredProperties.slice(0, 12).map((_, i) => (
                <div key={i} className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
                  <div className={cn("h-full rounded-full bg-white transition-all duration-500", i === storyIndex ? "w-full" : i < storyIndex ? "w-full" : "w-0")} />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="size-10 shrink-0 overflow-hidden rounded-full border border-white/30">
                  {filteredProperties[storyIndex].media.images[0] && (
                    <img
                      src={filteredProperties[storyIndex].media.images[0].url}
                      alt=""
                      className="size-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {filteredProperties[storyIndex].ownerFullName || t("owner")}
                  </p>
                  <p className="truncate text-[10px] text-white/50">{filteredProperties[storyIndex].title}</p>
                </div>
              </div>
              <button onClick={() => setStoryIndex(null)} className="shrink-0">
                <X className="size-6 text-white/80" />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center px-2">
              <div className="absolute inset-0 flex">
                <button className="w-1/3 h-full" onClick={() => setStoryIndex(Math.max(0, storyIndex - 1))} />
                <button className="w-1/3 h-full" onClick={() => setStoryIndex(null)} />
                <button className="w-1/3 h-full" onClick={() => setStoryIndex(Math.min(filteredProperties.slice(0, 12).length - 1, storyIndex + 1))} />
              </div>

              {filteredProperties[storyIndex].media.video ? (
                <video
                  src={filteredProperties[storyIndex].media.video}
                  autoPlay
                  loop
                  playsInline
                  className="max-h-full w-full rounded-2xl object-contain"
                  controls={false}
                />
              ) : filteredProperties[storyIndex].media.images[0] ? (
                <img
                  src={filteredProperties[storyIndex].media.images[0].url}
                  alt={filteredProperties[storyIndex].title}
                  className="max-h-full w-full rounded-2xl object-contain"
                />
              ) : (
                <div className="flex items-center justify-center text-white/30">
                  <Home className="size-16" />
                </div>
              )}
            </div>

            <div className="px-4 pb-8 pt-4">
              <Link
                href={`/properties/${filteredProperties[storyIndex].id}`}
                onClick={() => setStoryIndex(null)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gold py-4 text-sm font-black text-navy-dark shadow-lg shadow-gold/20 active:scale-95 transition-transform"
              >
                {t("viewDetails")} <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {filteredProperties.length > 0 ? (
            <PropertyGrid
              properties={filteredProperties}
              totalItems={filteredProperties.length}
              isUserVerified={isUserVerified}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.04]">
                <Search className="size-8 text-text-secondary/40" />
              </div>
              <h3 className="font-serif text-2xl text-white">{t("noPropertiesFound")}</h3>
              <p className="mt-2 text-sm text-text-secondary/60">
                {t("tryAdjustingFilters")}
              </p>
              <Button
                variant="secondary"
                onClick={clearFilters}
                className="mt-6 rounded-xl border-white/[0.06] bg-white/[0.04] hover:bg-white/[0.08]"
              >
                <RotateCcw className="size-3.5 mr-2" />
                {t("clearAllFilters")}
              </Button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
