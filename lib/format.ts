export function formatMoney(value: number, purpose?: "Rent" | "Sale") {
  // Use en-US locale to ensure consistent thousands separators (commas) between server and client
  const num = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(value);
  
  const formatted = `RWF ${num}`;

  return purpose === "Rent" ? `${formatted}/mo` : formatted;
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}
