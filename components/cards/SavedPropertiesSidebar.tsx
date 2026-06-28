"use client";

import { X, Heart, Bed, Bath, Square, MapPin, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useKalohouse } from "@/components/providers/KalohouseProvider";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/models";

export function SavedPropertiesSidebar() {
  const { saved_property_ids, toggleSaveProperty, savedPropertiesData, showSavedPanel, closeSavedPanel } = useKalohouse();

  const savedProperties = saved_property_ids
    .map((id) => savedPropertiesData[id])
    .filter((p): p is Property => !!p);

  return (
    <AnimatePresence>
      {showSavedPanel && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            onClick={closeSavedPanel}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col border-l border-white/[0.06] bg-main-bg shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="size-5 text-gold" />
                <h2 className="text-lg font-bold text-white">
                  Saved Properties
                </h2>
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-semibold text-gold-light">
                  {savedProperties.length}
                </span>
              </div>
              <button
                onClick={closeSavedPanel}
                className="flex size-9 items-center justify-center rounded-xl border border-white/[0.06] text-text-secondary/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content */}
            {savedProperties.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-white/[0.04]">
                  <Heart className="size-7 text-text-secondary/30" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">No saved properties yet</p>
                  <p className="mt-1 text-sm text-text-secondary/60">
                    Tap the heart icon on any property to save it here.
                  </p>
                </div>
                <Link
                  href="/properties"
                  onClick={closeSavedPanel}
                  className="mt-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-navy-dark transition-colors hover:bg-gold-light"
                >
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-white/[0.04]">
                  {savedProperties.map((property) => (
                    <div key={property.id} className="group relative flex gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]">
                      <Link
                        href={`/properties/${property.id}`}
                        onClick={closeSavedPanel}
                        className="shrink-0"
                      >
                        <div className="relative aspect-[4/3] w-24 overflow-hidden rounded-xl bg-soft-bg">
                          {property.media.images[0] ? (
                            <img
                              src={property.media.images[0].url}
                              alt={property.title}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-text-secondary/20">
                              <Bed className="size-6" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <span
                            className={cn(
                              "absolute bottom-1.5 left-1.5 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                              property.purpose === "Rent"
                                ? "bg-gold/90 text-navy-dark"
                                : "bg-blue-600/90 text-white"
                            )}
                          >
                            {property.purpose === "Rent" ? "Rent" : "Sale"}
                          </span>
                        </div>
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <Link
                          href={`/properties/${property.id}`}
                          onClick={closeSavedPanel}
                          className="min-w-0"
                        >
                          <h3 className="truncate text-sm font-semibold text-white group-hover:text-gold transition-colors">
                            {property.title}
                          </h3>
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-text-secondary/50">
                            <MapPin className="size-3 shrink-0" />
                            <span className="truncate">{property.district}</span>
                          </div>
                        </Link>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-text-secondary/60">
                            <span className="flex items-center gap-1">
                              <Bed className="size-3 text-gold/50" />
                              {property.bedrooms}
                            </span>
                            <span className="flex items-center gap-1">
                              <Bath className="size-3 text-gold/50" />
                              {property.bathrooms}
                            </span>
                            {property.sizeSqM && (
                              <span className="flex items-center gap-1">
                                <Square className="size-3 text-gold/50" />
                                {property.sizeSqM}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-gold-light">
                            RWF {property.ownerPrice.toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleSaveProperty(property.id)}
                          className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-black/40 text-white/50 opacity-0 transition-all hover:bg-red-500/60 hover:text-white group-hover:opacity-100"
                        >
                          <Heart className="size-3.5 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            {savedProperties.length > 0 && (
              <div className="border-t border-white/[0.06] px-5 py-4">
                <Link
                  href="/properties"
                  onClick={closeSavedPanel}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-text-secondary/70 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  Browse More Properties
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
