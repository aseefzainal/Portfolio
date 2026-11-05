import { createHash, randomBytes } from "node:crypto";

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export function createResetToken() {
  return randomBytes(32).toString("hex");
}

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function resetExpiryIso(from = Date.now()) {
  return new Date(from + RESET_TOKEN_TTL_MS).toISOString();
}
