import "server-only";

import { query, queryOne } from "@/lib/db";
import type {
  MembershipFilter,
  MembershipStatus,
  SchoolRoleKey,
} from "@/features/identity/validation";

/** The editable profile of a school. */
export type SchoolProfile = {
  id: string;
  name: string;
  slug: string;
};

/**
 * Reads one school by identifier.
 *
 * The identifier always comes from the validated school context, never from a
 * request, which is what keeps a member inside their own school.
 */
export async function findSchoolById(
  schoolId: string,
): Promise<SchoolProfile | null> {
  return queryOne<SchoolProfile>(
    `SELECT id, name, slug
     FROM schools
     WHERE id = $1`,
    [schoolId],
  );
}

/** Updates the profile of one school. */
export async function updateSchool(
  schoolId: string,
  input: { name: string; slug: string },
): Promise<SchoolProfile | null> {
  return queryOne<SchoolProfile>(
    `UPDATE schools
     SET name = $2, slug = $3
     WHERE id = $1
     RETURNING id, name, slug`,
    [schoolId, input.name, input.slug],
  );
}

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

/**
 * One membership of the active school, as shown to access administrators.
 *
 * It carries only what administering school access needs. The platform level
 * identity of the user stays out of it, and so does the password hash.
 */
export type SchoolMembershipListItem = {
  id: string;
  username: string | null;
  email: string | null;
  role_key: SchoolRoleKey;
  status: MembershipStatus;
};

/**
 * Escapes the characters `LIKE` treats as wildcards.
 *
 * Without this a typed `%` or `_` would silently match anything, so the search
 * box would not behave the way it reads. The backslash is escaped first, since
 * it is the escape character itself.
 */
function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

/**
 * Lists the memberships of one school.
 *
 * The school identifier comes from the validated school context and is a fixed
 * part of the query, so search and status can only ever narrow the result
 * inside that school. A membership of another school cannot be reached through
 * any combination of filters.
 */
export async function listSchoolMemberships(
  schoolId: string,
  filter: MembershipFilter,
): Promise<SchoolMembershipListItem[]> {
  const status = filter.status === "ALL" ? null : filter.status;
  const search =
    filter.search.length > 0 ? escapeLikePattern(filter.search) : null;

  return query<SchoolMembershipListItem>(
    `SELECT school_memberships.id,
            school_memberships.username,
            users.email,
            school_memberships.role_key,
            school_memberships.status
     FROM school_memberships
     JOIN users ON users.id = school_memberships.user_id
     WHERE school_memberships.school_id = $1
       AND ($2::text IS NULL OR school_memberships.status = $2)
       AND ($3::text IS NULL
            OR school_memberships.username ILIKE '%' || $3 || '%' ESCAPE '\\'
            OR users.email ILIKE '%' || $3 || '%' ESCAPE '\\')
     ORDER BY COALESCE(school_memberships.username, users.email, ''),
              school_memberships.id`,
    [schoolId, status, search],
  );
}
