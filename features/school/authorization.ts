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
