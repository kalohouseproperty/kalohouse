import { getSectorsByDistrict, getDistrictsByProvince } from "@/lib/locations";
import type { District, Sector } from "@/types/models";

const KIGALI_PROVINCE = "Kigali";

const _sectorsCache: Record<District, string[]> | null = null;

function getKigaliSectors(): Record<District, string[]> {
  const districts = getDistrictsByProvince(KIGALI_PROVINCE) as District[];
  const result: Record<string, string[]> = {};
  for (const d of districts) {
    result[d] = getSectorsByDistrict(KIGALI_PROVINCE, d);
  }
  return result as Record<District, string[]>;
}

export const kigaliSectorsByDistrict: Record<District, string[]> = getKigaliSectors();

export const kigaliSectors: Sector[] = Object.entries(kigaliSectorsByDistrict).flatMap(
  ([district, sectors]) =>
    sectors.map((name) => ({ district: district as District, name }))
);
