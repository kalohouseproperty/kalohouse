import {
  getProvinces,
  getDistricts,
  getSectors,
} from "rwanda-locations";

const PROVINCE_MAP: Record<string, string> = {
  kigali: "City Of Kigali",
};

function resolveProvince(province: string): string {
  return PROVINCE_MAP[province.toLowerCase()] || province;
}

export function getAllProvinces(): string[] {
  return getProvinces();
}

export function getDistrictsByProvince(province: string): string[] {
  return getDistricts(resolveProvince(province)) || [];
}

export function getSectorsByDistrict(province: string, district: string): string[] {
  return getSectors(resolveProvince(province), district) || [];
}
