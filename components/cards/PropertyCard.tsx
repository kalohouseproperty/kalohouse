"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bed, Bath, Square, MapPin, Heart, CheckCircle2, Building2, ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { PropertyImage } from "@/components/ui/property-image";
import { formatMoney } from "@/lib/format";
import { getMediaUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useKalohouse } from "@/components/providers/KalohouseProvider";
import type { Property } from "@/types/property";

export function PropertyCard({
  property,
  isUserVerified = false,
}: {
  property: Property;
  isUserVerified?: boolean;
}) {
  const displayPrice = isUserVerified
    ? property.finalDisplayPrice
    : property.ownerPrice;

  const imageCount = property.media?.images?.length ?? 0;
  const [cardImageIndex, setCardImageIndex] = useState(0);
  const { toggleSaveProperty, saved_property_ids } = useKalohouse();
  const isSaved = saved_property_ids.includes(property.id);

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCardImageIndex(prev => (prev - 1 + imageCount) % imageCount);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCardImageIndex(prev => (prev + 1) % imageCount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="h-full"
    >
<div
  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-card-bg transition-all duration-300 hover:border-gold/20 hover:shadow-xl hover:shadow-gold/5 touch-manipulation"
>
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden bg-soft-bg sm:aspect-[16/9]">
          <div className="absolute inset-0 bg-gradient-to-t from-card-bg/90 via-card-bg/10 to-transparent z-10" />

          {imageCount > 0 ? (
            <div className="relative size-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={cardImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Link href={`/properties/${property.id}`}>
<PropertyImage
  src={getMediaUrl(property.media.images[cardImageIndex].url)}
  alt={property.title}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
/>
                  </Link>
                </motion.div>
              </AnimatePresence>

              {imageCount > 1 && (
                <>
                  {/* Left arrow */}
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-sm hover:bg-black/80 hover:text-white"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  {/* Right arrow */}
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-sm hover:bg-black/80 hover:text-white"
                  >
                    <ChevronRightIcon className="size-5" />
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 flex items-center gap-1.5">
                    {property.media.images.slice(0, 5).map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCardImageIndex(i); }}
                        className={cn(
                          "size-1.5 rounded-full transition-all",
                          i === cardImageIndex
                            ? "w-4 bg-white"
                            : "bg-white/40 hover:bg-white/70"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Building2 className="size-20 text-white/10" />
            </div>
          )}

          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm",
                property.purpose === "Rent"
                  ? "bg-gold/90 text-navy-dark"
                  : "bg-blue-600/90 text-white"
              )}
            >
              {property.purpose === "Rent" ? "Rent" : "Sale"}
            </span>
            {property.isOwnerVerified && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="size-3.5" />
                Verified
              </span>
            )}
          </div>

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSaveProperty(property.id, property); }}
            className={cn(
              "absolute top-4 right-4 z-20 flex size-10 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
              isSaved
                ? "bg-red-500/80 text-white hover:bg-red-600"
                : "bg-black/50 text-white/60 hover:bg-red-500/80 hover:text-white"
            )}
          >
            <Heart className={cn("size-4", isSaved && "fill-current")} />
          </button>
        </div>

        {/* Body */}
        <Link href={`/properties/${property.id}`} className="flex flex-1 flex-col p-4 sm:p-5">
<div className="flex flex-col gap-1">
  <div className="flex items-start justify-between">
    <div className="min-w-0 flex-1">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold/50">
        {property.propertyType}
      </p>
      <h3 className="mt-1.5 text-base font-bold leading-snug text-white line-clamp-1 group-hover:text-gold transition-colors">
        {property.title}
      </h3>
    </div>
    <span className="shrink-0 text-right">
      <span className="block text-lg font-bold text-gold-light">
        RWF {displayPrice.toLocaleString()}
      </span>
      <span className="block text-[10px] text-text-secondary/40">
        /{property.purpose === "Rent" ? "month" : "sale"}
      </span>
    </span>
  </div>
</div>

<div className="mt-2.5 flex flex-col gap-1 text-sm text-text-secondary/50">
  <div className="flex items-center gap-1.5">
    <MapPin className="size-3.5 shrink-0" />
    <span className="truncate">
      {property.district}
      {property.sector ? `, ${property.sector}` : ""}
    </span>
  </div>
</div>

          {!isUserVerified && property.commissionAmount > 0 && (
            <div className="mt-2">
              <span className="rounded-md bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-400/80">
                +{formatMoney(property.commissionAmount)} commission
              </span>
            </div>
          )}

<div className="mt-auto pt-5">
  <div className="flex flex-col gap-3 rounded-xl bg-white/[0.03] px-4 py-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-sm text-text-secondary/60">
          <Bed className="size-4 text-gold/50" />
          <span className="font-semibold text-white/80">{property.bedrooms}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-text-secondary/60">
          <Bath className="size-4 text-gold/50" />
          <span className="font-semibold text-white/80">{property.bathrooms}</span>
        </div>
        {property.sizeSqM && (
          <div className="flex items-center gap-1.5 text-sm text-text-secondary/60">
            <Square className="size-4 text-gold/50" />
            <span className="font-semibold text-white/80">{property.sizeSqM} m&sup2;</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-sm font-semibold text-gold/60 group-hover:text-gold transition-colors">
        Details
        <ChevronRight className="size-4" />
      </div>
    </div>
  </div>
</div>
        </Link>
      </div>
    </motion.div>
  );
}
