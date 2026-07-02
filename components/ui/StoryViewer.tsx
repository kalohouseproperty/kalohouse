"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { X, ArrowRight, Play, Pause, Volume2, VolumeX, MapPinned, Bed, Bath } from "lucide-react";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/models";

interface StoryViewerProps {
  properties: Property[];
  initialIndex: number;
  onClose: () => void;
  t: (key: any) => string;
}

export function StoryViewer({ properties, initialIndex, onClose, t }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const property = properties[currentIndex];
  const hasVideo = Boolean(property?.media.video);

  const goNext = useCallback(() => {
    if (currentIndex < properties.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsPaused(false);
    } else {
      onClose();
    }
  }, [currentIndex, properties.length, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsPaused(false);
    }
  }, [currentIndex]);

  const togglePause = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPaused(false);
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") onClose();
      else if (e.key === " ") {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, onClose, togglePause]);

  if (!property) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      {/* Progress bars */}
      <div className="flex gap-1 px-2 pt-3 safe-area-top">
        {properties.slice(0, 12).map((_, i) => (
          <div key={i} className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full bg-white transition-all duration-300",
                i < currentIndex ? "w-full" : i === currentIndex ? "w-full" : "w-0"
              )}
              style={i === currentIndex ? { transitionDuration: isPaused ? "0ms" : "5000ms" } : undefined}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 shrink-0 overflow-hidden rounded-full border-2 border-gold/50">
            {property.media.images[0] && (
              <img
                src={property.media.images[0].url}
                alt=""
                className="size-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {property.ownerFullName || t("owner")}
            </p>
            <p className="truncate text-[11px] text-white/50">{property.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasVideo && (
            <button
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="size-5 text-white/80" />
              ) : (
                <Volume2 className="size-5 text-white/80" />
              )}
            </button>
          )}
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="size-6 text-white/80" />
          </button>
        </div>
      </div>

      {/* Media area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Left tap zone - previous */}
        <button
          className="absolute left-0 top-0 bottom-0 w-1/4 z-20"
          onClick={goPrev}
          aria-label="Previous"
        />

        {/* Center tap zone - pause/play */}
        <button
          className="absolute left-1/4 right-1/4 top-0 bottom-0 z-20"
          onClick={togglePause}
          aria-label={isPaused ? "Play" : "Pause"}
        />

        {/* Right tap zone - next */}
        <button
          className="absolute right-0 top-0 bottom-0 w-1/4 z-20"
          onClick={goNext}
          aria-label="Next"
        />

        {/* Pause indicator */}
        {isPaused && hasVideo && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div className="flex size-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
              <Pause className="size-8 text-white" />
            </div>
          </div>
        )}

        {/* Media content */}
        {hasVideo ? (
          <video
            ref={videoRef}
            key={`story-${currentIndex}-${property.id}`}
            src={property.media.video}
            autoPlay
            loop
            playsInline
            muted={isMuted}
            className="h-full w-full object-cover"
            controls={false}
          />
        ) : property.media.images[0] ? (
          <img
            src={property.media.images[0].url}
            alt={property.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center text-white/30">
            <Play className="size-16" />
          </div>
        )}
      </div>

      {/* Bottom: Property info + CTA */}
      <div className="relative z-20 bg-gradient-to-t from-black via-black/95 to-transparent px-4 pb-8 pt-6 safe-area-bottom">
        <div className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold/80">
            {property.propertyType}
          </p>
          <h3 className="mt-1 text-lg font-bold text-white line-clamp-1">
            {property.title}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
            <MapPinned className="size-3" />
            <span className="truncate">{property.district}</span>
          </div>
          {/* Stats */}
          <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold text-white/80">
            <span className="flex items-center gap-1">
              <Bed className="size-3 text-gold/60" />
              {property.bedrooms} bed
            </span>
            <span className="flex items-center gap-1">
              <Bath className="size-3 text-gold/60" />
              {property.bathrooms} bath
            </span>
          </div>
          {/* Price */}
          <p className="mt-2 text-lg font-black text-gold-light">
            {formatMoney(property.finalDisplayPrice, property.purpose)}
          </p>
        </div>
        <Link
          href={`/properties/${property.id}`}
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gold py-4 text-sm font-black text-black shadow-lg shadow-gold/20 active:scale-95 transition-transform"
        >
          {t("viewDetails")} <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
