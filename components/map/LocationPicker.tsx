"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const LocationPickerMap = dynamic(() => import("./LocationPickerMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-50 animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>
});

interface LocationPickerProps {
  latitude?: string;
  longitude?: string;
  onLocationSelect: (lat: string, lng: string) => void;
  disabled?: boolean;
}

export function LocationPicker({ latitude, longitude, onLocationSelect, disabled }: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#c9a646]/80">
          Geographic Location
        </label>
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          className="w-full h-14 bg-white border border-gray-100 text-[#1a1a1a] hover:bg-gray-50 rounded-2xl flex items-center justify-between px-4 shadow-sm group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-[#c9a646]/10 flex items-center justify-center text-[#c9a646]">
              <MapPin className="size-4" />
            </div>
            <span className="text-sm font-semibold">
              {latitude && longitude ? `${latitude}, ${longitude}` : "Pin location on map"}
            </span>
          </div>
          {latitude && longitude ? (
            <div className="size-6 rounded-full bg-green-500 flex items-center justify-center text-white">
              <Check className="size-3" />
            </div>
          ) : (
            <span className="text-xs text-[#c9a646] font-bold">Open Map</span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1a1a1a]/40 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl h-[70vh] rounded-[32px] overflow-hidden border border-white/20 shadow-2xl bg-white">
        {/* Header */}
        <div className="absolute top-6 left-6 right-6 z-[1001] flex items-center justify-between">
          <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-gray-100">
            <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">Select Location</h3>
            <p className="text-xs text-gray-500 font-medium">Click anywhere on the map to drop a pin</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="size-12 bg-white/90 backdrop-blur-md hover:bg-white text-[#1a1a1a] flex items-center justify-center rounded-2xl shadow-xl border border-gray-100 transition-all"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Map */}
        <LocationPickerMap 
          latitude={latitude} 
          longitude={longitude} 
          onLocationSelect={onLocationSelect} 
        />

        {/* Footer Overlay */}
        <div className="absolute bottom-6 left-6 right-6 z-[1001] flex items-center justify-between">
          <div className="bg-[#1a1a1a]/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/10 text-white min-w-[240px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Selected Coordinates</p>
            <p className="font-serif text-lg font-bold mt-1">
              {latitude && longitude ? `${latitude}, ${longitude}` : "No location selected"}
            </p>
          </div>
          
          {latitude && longitude && (
            <Button
              onClick={() => setIsOpen(false)}
              className="h-14 px-10 bg-[#c9a646] hover:bg-[#b3933d] text-white font-bold rounded-2xl shadow-xl border-none transition-all"
            >
              Confirm Location
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
