import "server-only";

import bcrypt from "bcrypt";

import { passwordSchema } from "@/features/identity/validation";

const SALT_ROUNDS = 12;

/**
 * Validates and hashes a plain text password.
 *
 * The plain text value is never persisted or logged: only the returned hash
 * may be stored, and hashes must stay on the server.
 */
export async function hashPassword(password: string): Promise<string> {
  const parsed = passwordSchema.parse(password);

  return bcrypt.hash(parsed, SALT_ROUNDS);
}

/** Verifies a plain text password against a stored hash. */
export async function verifyPassword(
  password: string,
  passwordHash: string | null,
): Promise<boolean> {
  // Users without a password can never be verified by password.
  if (!passwordHash) {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
}
