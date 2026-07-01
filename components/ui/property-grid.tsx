"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

import { PropertyCard } from "@/components/cards/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property } from "@/types/models";

interface PropertyGridProps {
  properties?: Property[];
  totalItems?: number;
  isLoading?: boolean;
  onReset?: () => void;
  limit?: number;
  isUserVerified?: boolean;
}
export function PropertyGrid({ 
  properties, 
  totalItems = 0,
  isLoading = false, 
  onReset,
  limit,
  isUserVerified = false
}: PropertyGridProps) {
  const displayProperties = limit ? properties?.slice(0, limit) : properties;
  const isEmpty = !isLoading && (!displayProperties || displayProperties.length === 0);

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].slice(0, limit || 6).map((n) => (
          <div key={n} className="space-y-4">
            <Skeleton className="aspect-[3/2] w-full rounded-2xl" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!displayProperties || displayProperties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 shadow-inner border border-gold/10">
          <Search className="size-8 text-gold/60" />
        </div>
        <h3 className="text-xl font-serif text-text-secondary">
          No properties available
        </h3>
        <p className="text-sm text-text-secondary/60 mt-2">
          Check back soon for new verified listings.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      layout
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full"
    >
      {displayProperties.map((property) => (
        <motion.div 
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          key={property.id}
          className="h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-900/10"
        >
          <PropertyCard property={property} isUserVerified={isUserVerified} />
        </motion.div>
      ))}
    </motion.div>
  );
}
