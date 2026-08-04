import "server-only";

import { query, queryOne } from "@/lib/db";
import type { SchoolRoleKey } from "@/features/identity/validation";

/** An active membership of a user, together with the school it belongs to. */
export type ActiveMembership = {
  id: string;
  school_id: string;
  school_name: string;
  role_key: SchoolRoleKey;
};

/**
 * Lists the active memberships of one user.
 *
 * Every query in this module is scoped by `user_id`, so a caller can never see
 * a membership that does not belong to the authenticated user.
 */
export async function listActiveMemberships(
  userId: string,
): Promise<ActiveMembership[]> {
  return query<ActiveMembership>(
    `SELECT school_memberships.id,
            school_memberships.school_id,
            schools.name AS school_name,
            school_memberships.role_key
     FROM school_memberships
     JOIN schools ON schools.id = school_memberships.school_id
     WHERE school_memberships.user_id = $1
       AND school_memberships.status = 'ACTIVE'
     ORDER BY schools.name`,
    [userId],
  );
}

/**
 * Resolves one membership of a user, or null when it does not exist, belongs
 * to somebody else, or is no longer active.
 *
 * This is the check that turns a client supplied membership identifier into a
 * trusted school context.
 */
export async function findActiveMembership(
  userId: string,
  membershipId: string,
): Promise<ActiveMembership | null> {
  return queryOne<ActiveMembership>(
    `SELECT school_memberships.id,
            school_memberships.school_id,
            schools.name AS school_name,
            school_memberships.role_key
     FROM school_memberships
     JOIN schools ON schools.id = school_memberships.school_id
     WHERE school_memberships.id = $1
       AND school_memberships.user_id = $2
       AND school_memberships.status = 'ACTIVE'`,
    [membershipId, userId],
  );
}
