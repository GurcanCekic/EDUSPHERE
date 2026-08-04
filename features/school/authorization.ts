import type { SchoolRoleKey } from "@/features/identity/validation";

/** The roles allowed to change the school itself. */
const SCHOOL_MANAGER_ROLES: readonly SchoolRoleKey[] = ["OWNER", "ADMIN"];

/**
 * Decides whether a role may manage the school.
 *
 * The result may be used to hide controls, but hiding is never the protection:
 * every action that changes a school has to call this itself.
 */
export function canManageSchool(roleKey: SchoolRoleKey): boolean {
  return SCHOOL_MANAGER_ROLES.includes(roleKey);
}

/** The roles allowed to administer who has access to the school. */
const SCHOOL_ACCESS_MANAGER_ROLES: readonly SchoolRoleKey[] = [
  "OWNER",
  "ADMIN",
];

/**
 * Decides whether a role may read the school's memberships.
 *
 * Kept separate from `canManageSchool` even though the two sets currently
 * match: access administration and school profile editing are different
 * permissions and may diverge.
 */
export function canManageSchoolAccess(roleKey: SchoolRoleKey): boolean {
  return SCHOOL_ACCESS_MANAGER_ROLES.includes(roleKey);
}
