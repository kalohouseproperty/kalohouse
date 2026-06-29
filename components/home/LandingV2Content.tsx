"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Building2,
  Home,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  X,
  Play,
} from "lucide-react";
import { rwandaLocation } from "@devrw/rwanda-location";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { useKalohouse } from "@/components/providers/KalohouseProvider";
import type { Property, User } from "@/types/models";
import type { Translations } from "@/lib/i18n-server";
import { cn } from "@/lib/utils";

const categories = [
  { icon: Building2, label: "Apartments", key: "Apartment" },
  { icon: Home, label: "Houses", key: "House" },
  { icon: Home, label: "Villas", key: "Villa" },
  { icon: Building2, label: "Studios", key: "Studio" },
  { icon: Home, label: "Townhouses", key: "Townhouse" },
  { icon: Home, label: "Bungalows", key: "Bungalow" },
  { icon: Home, label: "Duplexes", key: "Duplex" },
  { icon: Building2, label: "Commercial", key: "Commercial" },
  { icon: Building2, label: "Offices", key: "Office" },
  { icon: Building2, label: "Shops", key: "Shop" },
  { icon: Building2, label: "Warehouses", key: "Warehouse" },
  { icon: Home, label: "Gardens", key: "Garden" },
  { icon: Building2, label: "Event Halls", key: "Event Hall" },
  { icon: Home, label: "Land", key: "Land" },
];

const howItWorks = [
  {
    step: "01",
    icon: Search,
    titleKey: "browseCompare" as keyof Translations,
    descKey: "browseCompareDesc" as keyof Translations,
  },
  {
    step: "02",
    icon: ShieldCheck,
    titleKey: "bookViewing" as keyof Translations,
    descKey: "bookViewingDesc" as keyof Translations,
  },
  {
    step: "03",
    icon: Building2,
    titleKey: "visitConfidence" as keyof Translations,
    descKey: "visitConfidenceDesc" as keyof Translations,
  },
  {
    step: "04",
    icon: CheckCircle2,
    titleKey: "moveInOrRefunded" as keyof Translations,
    descKey: "moveInOrRefundedDesc" as keyof Translations,
  },
];

interface LandingV2ContentProps {
  properties: Property[];
  currentUser?: User | null;
  tData?: Translations;
}

export function LandingV2Content({ properties, currentUser, tData }: LandingV2ContentProps) {
  const { t: tKey } = useKalohouse();
  const t = (key: keyof Translations) => tData?.[key] || tKey(key);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    district: "",
    propertyType: "",
    purpose: "",
    minPrice: "",
    maxPrice: "",
    query: "",
  });

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

  const propertyTypes = [
    "Apartment", "House", "Villa", "Studio", "Townhouse",
    "Bungalow", "Duplex", "Commercial", "Office", "Shop",
    "Warehouse", "Garden", "Event Hall", "Land",
  ];

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

  const clearFilters = () => {
    setFilters({ district: "", propertyType: "", purpose: "", minPrice: "", maxPrice: "", query: "" });
  };

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const selectClass = "h-12 rounded-xl border-white/5 bg-white/[0.04] hover:bg-white/[0.08] hover:border-gold/25 text-sm";

  return (
    <main className="min-h-screen overflow-hidden">
      <LandingNavbar currentUser={currentUser} />

      {/* Hero Section - hidden on mobile */}
      <section className="relative min-h-[90vh] hidden sm:flex items-center pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gold/5 blur-[120px]" />
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[100px]" />
          <div className="absolute inset-0 premium-grid opacity-[0.15]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light mb-8">
              <Sparkles className="size-3.5" />
              {t("kigaliPropertyVerified")}
            </div>

            <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t("heroTitle")}
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary/80">
              {t("heroSubtitle")}
            </p>
          </div>

          {/* Search Box */}
          <div className="mx-auto mt-10 max-w-5xl">
            <div className="glass-card rounded-2xl p-2.5">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <div className="flex-1 min-w-0">
                  <Select
                    className={selectClass}
                    value={filters.district}
                    onChange={(e) => updateFilter("district", e.target.value)}
                  >
                    <option value="">{t("allRwanda")}</option>
                    {districtOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex-1 min-w-0">
                  <Select
                    className={selectClass}
                    value={filters.propertyType}
                    onChange={(e) => updateFilter("propertyType", e.target.value)}
                  >
                    <option value="">{t("allTypes")}</option>
                    {propertyTypes.map((pt) => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </Select>
                </div>
                <div className="flex-1 min-w-0">
                  <Select
                    className={selectClass}
                    value={filters.purpose}
                    onChange={(e) => updateFilter("purpose", e.target.value)}
                  >
                    <option value="">{t("rentOrBuy")}</option>
                    <option value="Rent">{t("forRent")}</option>
                    <option value="Sale">{t("forSale")}</option>
                  </Select>
                </div>
                <Button
                  asChild
                  className="h-12 rounded-xl px-6 bg-gold hover:bg-gold-light text-navy-dark font-bold shadow-xl shadow-gold/20 shrink-0"
                >
                  <Link href={hasFilters ? `/properties?${new URLSearchParams(
                    Object.entries(filters).filter(([, v]) => v).map(([k, v]) => [k, v])
                  ).toString()}` : "/properties"}>
                    <Search className="size-4 mr-2" />
                    {t("search")}
                  </Link>
                </Button>
              </div>
            </div>

            {hasFilters && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-text-secondary/60">
                <span>
                  {filteredProperties.length} {filteredProperties.length !== 1 ? t("propertiesFound") : t("propertyFound")}
                </span>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-gold hover:text-gold-light transition-colors"
                >
                  <X className="size-3" />
                  {t("clearFilters")}
                </button>
              </div>
            )}
          </div>

          {/* Trust Stats */}
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-8">
            {[
              { value: `${properties.length}+`, label: t("totalProperties") },
              { value: "98.7%", label: "Satisfaction Rate" },
              { value: "30+", label: "Sectors Covered" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-2xl font-bold text-white sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-text-secondary/50 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories - hidden on mobile */}
      <section className="relative px-4 sm:px-6 lg:px-8 -mt-8 hidden sm:block">
        <div className="mx-auto max-w-7xl">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const count = properties.filter((p) => p.propertyType === cat.key).length;
                return (
                  <button
                    key={cat.label}
                    onClick={() =>
                      updateFilter(
                        "propertyType",
                        filters.propertyType === cat.key ? "" : cat.key
                      )
                    }
                    className={cn(
                      "group flex shrink-0 items-center gap-2.5 rounded-xl border px-4 py-3 transition-all duration-200",
                      filters.propertyType === cat.key
                        ? "border-gold/30 bg-gold/10"
                        : "border-white/5 bg-white/[0.03] hover:border-gold/20 hover:bg-gold/5"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 transition-colors",
                        filters.propertyType === cat.key ? "text-gold" : "text-gold/70 group-hover:text-gold"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-medium whitespace-nowrap transition-colors",
                        filters.propertyType === cat.key ? "text-white" : "text-text-secondary/80 group-hover:text-white"
                      )}
                    >
                      {cat.label}
                    </span>
                    <span className="text-xs text-text-secondary/40">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Stories Strip - Instagram-style property stories */}
      <section className="relative px-4 pt-20 sm:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filteredProperties.slice(0, 12).map((property, idx) => (
            <button
              key={property.id}
              onClick={() => setStoryIndex(idx)}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <div className="relative size-16 overflow-hidden rounded-full border-2 border-gold/40 bg-card-bg p-0.5 shadow-lg shadow-gold/10">
                <div className="size-full overflow-hidden rounded-full">
                  {property.media.images[0] ? (
                    <img
                      src={property.media.images[0].url}
                      alt={property.title}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gold/10">
                      <Home className="size-6 text-gold/40" />
                    </div>
                  )}
                </div>
                {property.media.video && (
                  <div className="absolute bottom-0 right-0 rounded-full bg-gold p-1 shadow">
                    <Play className="size-2.5 text-navy-dark" fill="currentColor" />
                  </div>
                )}
              </div>
              <span className="max-w-[68px] truncate text-[10px] font-medium text-text-secondary text-center">
                {property.ownerFullName || t("owner")}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Story Viewer Overlay */}
      {storyIndex !== null && filteredProperties[storyIndex] && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black sm:hidden">
          {/* Top bar with progress */}
          <div className="flex gap-1 px-2 pt-2">
            {filteredProperties.slice(0, 12).map((_, i) => (
              <div key={i} className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
                <div className={cn("h-full rounded-full bg-white transition-all duration-500", i === storyIndex ? "w-full" : i < storyIndex ? "w-full" : "w-0")} />
              </div>
            ))}
          </div>

          {/* Close + property name */}
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="size-8 shrink-0 overflow-hidden rounded-full border border-white/30">
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

          {/* Media area - tap sides to navigate */}
          <div className="relative flex-1 flex items-center justify-center px-2">
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
              // eslint-disable-next-line @next/next/no-img-element
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

          {/* Bottom action */}
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

      {/* Featured Properties */}
      <section className="relative px-4 py-16 sm:py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                {hasFilters ? t("searchResults") : t("featuredProperties")}
              </p>
              <h2 className="font-serif text-3xl text-white sm:text-4xl lg:text-5xl">
                {hasFilters
                  ? `${filteredProperties.length} ${t("propertiesFoundCount")}`
                  : t("popularProperties")}
              </h2>
            </div>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="hidden sm:flex rounded-xl px-5 h-10 border-white/10 bg-white/5 hover:bg-white/10 text-sm"
            >
              <Link href="/properties">
                {t("viewAll")} <ArrowRight className="size-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Building2 className="size-16 text-white/10 mb-4" />
              <p className="text-lg font-medium text-white">{t("noPropertiesFound")}</p>
              <p className="mt-1 text-sm text-text-secondary/60">
                {t("tryAdjustingFilters")}
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-gold hover:text-gold-light transition-colors"
              >
                {t("clearAllFilters")}
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property as any} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="secondary" className="rounded-xl px-8 border-white/10 bg-white/5 hover:bg-white/10">
              <Link href="/properties">
                {t("viewAll")} <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-4 py-28 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.015] to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{t("simpleProcess")}</p>
            <h2 className="font-serif text-3xl text-white sm:text-4xl lg:text-5xl">
              {t("bookProperty4Steps")}
            </h2>
            <p className="mt-4 text-sm text-text-secondary/70">
              {t("streamlinedProcess")}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card-bg p-6 transition-all duration-300 hover:border-gold/20 hover:-translate-y-1"
                >
                  <span className="font-serif text-5xl font-bold text-white/[0.04] absolute top-3 right-4 select-none">
                    {step.step}
                  </span>
                  <div className="mb-5 inline-flex rounded-2xl bg-gold/10 p-3 ring-1 ring-gold/20">
                    <Icon className="size-6 text-gold" />
                  </div>
                  <h3 className="mb-2 font-bold text-white">{t(step.titleKey)}</h3>
                  <p className="text-sm leading-relaxed text-text-secondary/60">{t(step.descKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{t("trustBuiltIn")}</p>
              <h2 className="font-serif text-3xl text-white sm:text-4xl lg:text-5xl mb-6 leading-tight">
                {t("trustBuiltIn")}
              </h2>
              <p className="text-sm text-text-secondary/70 leading-relaxed mb-12 max-w-lg">
                {t("heroSubtitle")}
              </p>

              <div className="space-y-6">
                {[
                  {
                    titleKey: "physicalVerification" as keyof Translations,
                    descKey: "physicalVerificationDesc" as keyof Translations,
                  },
                  {
                    titleKey: "ownerKyc" as keyof Translations,
                    descKey: "ownerKycDesc" as keyof Translations,
                  },
                  {
                    titleKey: "secureBookings" as keyof Translations,
                    descKey: "secureBookingsDesc" as keyof Translations,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="size-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-1">
                      <div className="size-2 rounded-full bg-gold" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{t(item.titleKey)}</h4>
                      <p className="text-sm text-text-secondary/60">{t(item.descKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/[0.06] bg-card-bg relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
                <div className="flex h-full w-full items-center justify-center p-12">
                  <div className="glass-card rounded-2xl p-8 border border-white/10 max-w-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="size-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="size-6 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-emerald-400 tracking-widest">{t("certifiedTrust")}</p>
                        <p className="text-lg font-serif text-white">{t("kalohouseShield")}</p>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary/60 leading-relaxed">
                      {t("shieldDesc")}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs text-gold">
                      <ShieldCheck className="size-4" />
                      <span className="font-semibold">{t("verifiedListings")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="relative overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-gold/[0.08] to-gold/5" />
        <div className="absolute inset-0 premium-grid opacity-20" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl text-white sm:text-4xl lg:text-5xl">
            {t("readyFindHome")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm text-text-secondary/70">
            {t("joinHappyHomeowners")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-xl px-10 text-base bg-gold hover:bg-gold-light text-navy-dark font-bold shadow-2xl shadow-gold/25 transition-all hover:scale-105"
            >
              <Link href="/auth">
                {t("createFreeAccount")}
                <ArrowRight className="size-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="h-14 rounded-xl px-10 text-base border-white/10 bg-white/5 hover:bg-white/10"
            >
              <Link href="/properties">{t("browseWithoutSigningUp")}</Link>
            </Button>
          </div>
        </div>
      </section>


    </main>
  );
}
