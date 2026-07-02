"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Bath, Bed, Home, MapPin, Play, ShieldCheck, Square, Volume2, VolumeX } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { Property } from "@/types/models";

interface VideoCardProps {
  property: Property;
}

export function VideoCard({ property }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      {/* Thumbnail */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#111]">
        <video
          ref={videoRef}
          src={property.media.video}
          poster={property.media.images[0]?.url}
          autoPlay
          loop
          playsInline
          muted
          preload="metadata"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
          <div className="flex size-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
            <Play className="size-5 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Mute/Unmute button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-2 left-2 z-10 flex size-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
        >
          {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
          Tour
        </div>

        {/* Purpose badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center gap-1 rounded bg-gold/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
            {property.purpose}
          </span>
        </div>

        {/* Verified badge */}
        {property.isOwnerVerified && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
              <ShieldCheck className="size-2.5" />
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 flex gap-3">
        {/* Owner avatar placeholder */}
        <div className="size-9 shrink-0 overflow-hidden rounded-full bg-gold/20 flex items-center justify-center">
          <span className="text-xs font-bold text-gold">
            {(property.ownerFullName || "K").charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-gold-light transition-colors">
            {property.title}
          </h3>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary/60">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">
              {property.district}
              {property.sector ? `, ${property.sector}` : ""}
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-3 text-[11px] text-text-secondary/50">
            <span className="flex items-center gap-1">
              <Bed className="size-3" />
              {property.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="size-3" />
              {property.bathrooms}
            </span>
            {property.sizeSqM && (
              <span className="flex items-center gap-1">
                <Square className="size-3" />
                {property.sizeSqM}m²
              </span>
            )}
          </div>

          <p className="mt-1.5 text-sm font-bold text-gold-light">
            {formatMoney(property.finalDisplayPrice, property.purpose)}
          </p>
        </div>
      </div>
    </Link>
  );
}

interface MobileVideoCardProps {
  property: Property;
  index: number;
  total: number;
}

export function MobileVideoCard({ property, index, total }: MobileVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <article className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/8 bg-[#0a0a0a] shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
      {/* Video - TikTok-style 9:16 centered */}
      <div className="relative aspect-[9/16] overflow-hidden bg-[#111]">
        <video
          ref={videoRef}
          src={property.media.video}
          poster={property.media.images[0]?.url}
          autoPlay
          loop
          playsInline
          muted
          preload="metadata"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#000]/95 via-[#000]/10 to-[#000]/30" />

        {/* Counter */}
        <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 pt-4">
          <div />
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#000]/60 px-3 py-1.5 text-[11px] font-bold text-white/80 backdrop-blur-md">
            <Play className="size-3 fill-current text-gold-light" />
            {index + 1} / {total}
          </div>
          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            className="flex size-8 items-center justify-center rounded-full bg-[#000]/60 backdrop-blur-md text-white hover:bg-[#000]/80 transition-colors"
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>

        {/* Badges */}
        <div className="absolute left-3 top-12 z-20 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#000]/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-light backdrop-blur-md">
            <Play className="size-2.5 fill-current" />
            {property.purpose}
          </span>
          {property.isOwnerVerified && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#000]/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              <ShieldCheck className="size-3 text-gold-light" />
              Verified
            </span>
          )}
        </div>

        {/* Bottom overlay content */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4">
          {/* Property info */}
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold/80">
            {property.propertyType}
          </p>
          <h2 className="mt-1 text-lg font-bold leading-snug text-white drop-shadow-lg line-clamp-2">
            {property.title}
          </h2>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-white/70">
            <MapPin className="size-3 shrink-0 text-gold/70" />
            <span className="truncate">
              {property.district}
              {property.sector ? `, ${property.sector}` : ""}
            </span>
          </div>

          {/* Stats */}
          <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-white/80">
            <span className="flex items-center gap-1">
              <Bed className="size-3 text-gold/60" />
              {property.bedrooms} bed
            </span>
            <span className="flex items-center gap-1">
              <Bath className="size-3 text-gold/60" />
              {property.bathrooms} bath
            </span>
            <span className="flex items-center gap-1">
              <Square className="size-3 text-gold/60" />
              {property.sizeSqM ? `${property.sizeSqM} m2` : property.propertyType}
            </span>
          </div>

          {/* Price */}
          <div className="mt-3 rounded-xl bg-[#000]/60 px-3 py-2.5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-secondary/50">
                  Price
                </p>
                <p className="text-lg font-black tracking-tight text-gold-light">
                  {formatMoney(property.finalDisplayPrice, property.purpose)}
                </p>
              </div>
              <Link
                href={`/properties/${property.id}`}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gold px-4 text-xs font-black text-black transition-colors active:scale-95"
              >
                Details
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
