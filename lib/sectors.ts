import prisma from "./prisma";

/** Resolve FK for properties — creates sector row if missing (any Rwanda district/sector). */
export async function getOrCreateSectorId(
  district: string,
  sectorName: string
): Promise<number> {
  const districtName = district.trim();
  const name = sectorName.trim();

  const existing = await prisma.sector.findFirst({
    where: {
      district: { equals: districtName, mode: "insensitive" },
      name: { equals: name, mode: "insensitive" },
    },
  });

  if (existing) return existing.id;

  const created = await prisma.sector.create({
    data: { district: districtName, name },
  });

  return created.id;
}
