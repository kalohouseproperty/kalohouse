"use client";

import dynamic from "next/dynamic";
import { useKalohouse } from "@/components/providers/KalohouseProvider";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

export default function PropertyMap() {
  const { state } = useKalohouse();

  return (
    <div className="h-screen w-full">
      <LeafletMap properties={state.properties as any} />
    </div>
  );
}
