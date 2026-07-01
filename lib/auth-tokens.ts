import { createHash, randomBytes } from "crypto";

export function createAuthToken() {
  const token = randomBytes(32).toString("hex");
  return {
    token,
    tokenHash: hashAuthToken(token),
  };
}

export function hashAuthToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}
