/** Matches Prisma @db.Decimal(12, 2) on price fields */
export const MAX_OWNER_PRICE_RWF = 9_999_999_999.99;

/** Matches Prisma @db.Decimal(10, 2) on size_sq_m */
export const MAX_SIZE_SQM = 99_999_999.99;

export function validatePropertyNumericFields(
  ownerPriceStr: string,
  sizeSqMStr: string
): string | null {
  const price = Number(ownerPriceStr);
  const size = Number(sizeSqMStr);

  if (!Number.isFinite(price) || price <= 0) {
    return "Enter a valid price greater than 0 RWF.";
  }
  if (price > MAX_OWNER_PRICE_RWF) {
    return `Price cannot exceed ${MAX_OWNER_PRICE_RWF.toLocaleString("en-US")} RWF.`;
  }

  if (!Number.isFinite(size) || size <= 0) {
    return "Enter a valid size greater than 0 m².";
  }
  if (size > MAX_SIZE_SQM) {
    return `Size cannot exceed ${MAX_SIZE_SQM.toLocaleString("en-US")} m².`;
  }

  return null;
}

export function isPropertyPriceInRange(price: number): boolean {
  return Number.isFinite(price) && price > 0 && price <= MAX_OWNER_PRICE_RWF;
}

export function isPropertySizeInRange(size: number): boolean {
  return Number.isFinite(size) && size > 0 && size <= MAX_SIZE_SQM;
}
