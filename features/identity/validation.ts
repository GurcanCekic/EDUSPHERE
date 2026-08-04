import { z } from "zod";

/** Stable, language independent role keys. Display labels are translated. */
export const SCHOOL_ROLE_KEYS = [
  "OWNER",
  "ADMIN",
  "TEACHER",
  "STUDENT",
  "PARENT",
] as const;

export const schoolRoleKeySchema = z.enum(SCHOOL_ROLE_KEYS);
export type SchoolRoleKey = z.infer<typeof schoolRoleKeySchema>;

export const MEMBERSHIP_STATUSES = ["ACTIVE", "INACTIVE"] as const;

export const membershipStatusSchema = z.enum(MEMBERSHIP_STATUSES);
export type MembershipStatus = z.infer<typeof membershipStatusSchema>;

/** Lowercases and collapses a value into a URL friendly slug. */
export function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Lowercases and trims an email. Blank values become null. */
export function normalizeEmail(
  value: string | null | undefined,
): string | null {
  const normalized = value?.trim().toLowerCase() ?? "";

  return normalized.length > 0 ? normalized : null;
}

/** Lowercases and trims a username. Blank values become null. */
export function normalizeUsername(
  value: string | null | undefined,
): string | null {
  const normalized = value?.trim().toLowerCase() ?? "";

  return normalized.length > 0 ? normalized : null;
}

export const schoolInputSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .transform(normalizeSlug)
    .refine((slug) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug), {
      message: "Slug must contain at least one letter or digit.",
    }),
});

export type SchoolInput = z.input<typeof schoolInputSchema>;

/**
 * Passwords are validated before hashing and are never stored or logged in
 * plain text.
 *
 * bcrypt only considers the first 72 bytes of a password, so longer values are
 * rejected instead of being silently truncated. The limit is measured in bytes
 * because non-ASCII characters cost more than one byte each.
 */
export const passwordSchema = z
  .string()
  .min(8)
  .refine((value) => new TextEncoder().encode(value).length <= 72, {
    message: "Password must be at most 72 bytes.",
  });

export const userInputSchema = z.object({
  email: z
    .union([z.string(), z.null()])
    .optional()
    .transform((value) => normalizeEmail(value))
    .refine((email) => email === null || z.email().safeParse(email).success, {
      message: "Email must be a valid address.",
    }),
  password: passwordSchema.optional(),
});

export type UserInput = z.input<typeof userInputSchema>;

export const schoolMembershipInputSchema = z.object({
  schoolId: z.uuid(),
  userId: z.uuid(),
  roleKey: schoolRoleKeySchema,
  username: z
    .union([z.string(), z.null()])
    .optional()
    .transform((value) => normalizeUsername(value)),
  status: membershipStatusSchema.optional(),
});

export type SchoolMembershipInput = z.input<typeof schoolMembershipInputSchema>;
