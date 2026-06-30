"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Property } from "@/types/models";
import { formatMoney } from "@/lib/format";
import { BedDouble, Bath, Maximize, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PropertyMarkerProps {
  property: Property;
  isActive?: boolean;
}

export function PropertyMarker({ property, isActive }: PropertyMarkerProps) {
  const lat = Number(property.latitude);
  const lng = Number(property.longitude);

  if (!lat || !lng) return null;

  const priceLabel = formatMoney(Number(property.finalDisplayPrice));

  const customIcon = L.divIcon({
    className: "price-marker",
    html: renderToStaticMarkup(
      <div className={`price-pill ${property.purpose.toLowerCase()} ${isActive ? "active" : ""}`}>
        {priceLabel}
      </div>
    ),
    iconSize: [80, 32],
    iconAnchor: [40, 32],
  });

  const firstImage = property.media?.images?.[0]?.url || "/placeholder-property.jpg";

  return (
    <Marker position={[lat, lng]} icon={customIcon}>
      <Popup closeButton={false} minWidth={300}>
        <div className="group overflow-hidden rounded-3xl bg-card-bg transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
          {/* Image Header */}
          <div className="relative h-44 w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={firstImage}
              alt={property.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-transparent to-transparent opacity-60" />
            <div className="absolute left-4 top-4">
              <span className={`rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg backdrop-blur-md border border-white/10 ${
                property.purpose.toLowerCase() === 'rent' ? 'bg-blue-600/80' : 'bg-[#c9a646]/80'
              }`}>
                {property.purpose}
              </span>
            </div>
            <div className="absolute bottom-4 right-4 rounded-xl bg-main-bg/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#e6c76e] backdrop-blur-md border border-[#c9a646]/20">
              {property.propertyType}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="line-clamp-1 font-serif text-xl font-bold text-[#f9fafb]">
              {property.title}
            </h3>
            <p className="mt-1 text-xs font-medium text-[#64748b]">
              {property.district}, {property.sector}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                  <BedDouble className="size-4 text-[#c9a646]" />
                  <span className="text-[10px] font-black text-[#cbd5e1]">{property.bedrooms}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Bath className="size-4 text-[#c9a646]" />
                  <span className="text-[10px] font-black text-[#cbd5e1]">{property.bathrooms}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#64748b] mb-1">Guaranteed Price</p>
                <p className="text-xl font-black text-[#e6c76e] tracking-tighter">{priceLabel}</p>
              </div>
            </div>

            <Link
              href={`/properties/${property.id}`}
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#c9a646] py-4 text-xs font-black uppercase tracking-[0.2em] text-main-bg transition-all hover:bg-[#e6c76e] hover:shadow-[0_0_20px_rgba(201,166,70,0.3)] active:scale-[0.98]"
            >
              View Listing
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
