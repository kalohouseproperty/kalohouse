"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { PropertyMarker } from "./PropertyMarker";
import { Property } from "@/types/models";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Crosshair, Maximize2, RotateCcw } from "lucide-react";

interface LeafletMapProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
}

function MapContent({ properties, center }: { properties: Property[]; center?: [number, number] }) {
  const map = useMap();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (map.getPane("tilePane")) {
      setReady(true);
    }
  }, [map]);

  useEffect(() => {
    if (!ready) return;

    if (center) {
      map.setView(center, map.getZoom());
      return;
    }

    if (properties.length > 0) {
      const bounds = L.latLngBounds(
        properties
          .filter(p => p.latitude && p.longitude)
          .map(p => [Number(p.latitude), Number(p.longitude)] as [number, number])
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [properties, map, center, ready]);

  if (!ready) return null;

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="topright" />
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={50}
        showCoverageOnHover={false}
      >
        {properties.map((property) => (
          <PropertyMarker key={property.id} property={property} />
        ))}
      </MarkerClusterGroup>
    </>
  );
}

export default function LeafletMap({ properties, center, zoom = 13 }: LeafletMapProps) {
  const [mounted, setMounted] = useState(false);
  const defaultCenter: [number, number] = center || [-1.9441, 30.0619]; // Kigali

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-gray-100 animate-pulse" />;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
      >
        <MapContent properties={properties} center={center} />
      </MapContainer>

      {/* Modern Controls */}
      <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="size-12 rounded-xl bg-white text-[#1a1a1a] shadow-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-white"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((pos) => {
                // We'd need to pass this up or use a map ref
                // For now, let's keep it simple
              });
            }
          }}
          title="My Location"
        >
          <Crosshair className="size-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="size-12 rounded-xl bg-white text-[#1a1a1a] shadow-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-white"
          onClick={() => window.location.reload()}
          title="Reset View"
        >
          <RotateCcw className="size-5" />
        </Button>
      </div>
    </div>
  );
}
