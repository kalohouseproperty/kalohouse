"use client";

import Image from "next/image";
import { useState, useEffect, type ComponentProps } from "react";

import { getMediaUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

const FALLBACK_PROPERTY_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

type PropertyImageProps = Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
  alt: string;
  src?: string | null;
  fallbackSrc?: string;
};

export function PropertyImage({
  src,
  alt,
  fallbackSrc = FALLBACK_PROPERTY_IMAGE,
  onError,
  className,
  ...props
}: PropertyImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (src && src.trim()) {
      console.log('[PropertyImage] Loading:', { src, isLocalPath: src.startsWith('/uploads') });
      setCurrentSrc(src);
      setIsLoaded(false);
    } else {
      console.warn('[PropertyImage] No src provided, using fallback');
      setCurrentSrc(fallbackSrc);
    }
  }, [src, fallbackSrc]);

  return (
    <div className={cn("relative overflow-hidden bg-white/5", props.fill && "h-full w-full", className)}>
      <Image
        {...props}
        src={currentSrc}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          props.fill && "object-cover",
          className
        )}
        onError={(e) => {
          console.error('[PropertyImage] Failed to load:', currentSrc);
          if (currentSrc !== fallbackSrc && src?.startsWith('/uploads')) {
            // Only fallback if it was a local uploaded image and it failed
            console.log('[PropertyImage] Falling back to Unsplash');
            setCurrentSrc(fallbackSrc);
          }
          onError?.(e);
        }}
        onLoadingComplete={() => {
          setIsLoaded(true);
          console.log('[PropertyImage] Loaded successfully');
        }}
        unoptimized // Allow external Unsplash URLs without complex config
      />
    </div>
  );
}
