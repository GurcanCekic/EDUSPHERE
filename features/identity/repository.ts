import "server-only";

import { query, queryOne } from "@/lib/db";
import { hashPassword } from "@/features/identity/password";
import {
  createSchoolUserSchema,
  schoolInputSchema,
  schoolMembershipInputSchema,
  userInputSchema,
  type CreateSchoolUser,
  type MembershipStatus,
  type SchoolInput,
  type SchoolMembershipInput,
  type SchoolRoleKey,
  type UserInput,
} from "@/features/identity/validation";

export type School = {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
};

/** Public user shape. The password hash is deliberately never selected. */
export type User = {
  id: string;
  email: string | null;
  created_at: Date;
  updated_at: Date;
};

export type SchoolMembership = {
  id: string;
  school_id: string;
  user_id: string;
  role_key: SchoolRoleKey;
  username: string | null;
  status: MembershipStatus;
  created_at: Date;
  updated_at: Date;
};

export async function createSchool(input: SchoolInput): Promise<School> {
  const { name, slug } = schoolInputSchema.parse(input);

  const school = await queryOne<School>(
    `INSERT INTO schools (name, slug)
     VALUES ($1, $2)
     RETURNING id, name, slug, created_at, updated_at`,
    [name, slug],
  );

  // INSERT ... RETURNING always yields a row when it does not throw.
  return school as School;
}

export async function createUser(input: UserInput = {}): Promise<User> {
  const { email, password } = userInputSchema.parse(input);
  const passwordHash = password ? await hashPassword(password) : null;

  const user = await queryOne<User>(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING id, email, created_at, updated_at`,
    [email, passwordHash],
  );

  return user as User;
}

export async function createSchoolMembership(
  input: SchoolMembershipInput,
): Promise<SchoolMembership> {
  const { schoolId, userId, roleKey, username, status } =
    schoolMembershipInputSchema.parse(input);

  const membership = await queryOne<SchoolMembership>(
    `INSERT INTO school_memberships (school_id, user_id, role_key, username, status)
     VALUES ($1, $2, $3, $4, COALESCE($5, 'ACTIVE'))
     RETURNING id, school_id, user_id, role_key, username, status, created_at, updated_at`,
    [schoolId, userId, roleKey, username, status ?? null],
  );

  return membership as SchoolMembership;
}

/** The identifiers written when a school user is created. */
export type CreatedSchoolUser = {
  user_id: string;
  membership_id: string;
};

/**
 * Creates a global user and its membership in one school.
 *
 * The two rows are written by a single statement so that a user can never be
 * left behind without the membership it was created for. The school identifier
 * is a separate argument and always comes from the validated school context,
 * never from the submitted form.
 *
 * Only the password hash is written; the plain text value stays in this
 * function and is never returned or logged.
 */
export async function createSchoolUser(
  schoolId: string,
  input: CreateSchoolUser,
): Promise<CreatedSchoolUser> {
  const { username, email, password, roleKey } =
    createSchoolUserSchema.parse(input);
  const passwordHash = await hashPassword(password);

  const created = await queryOne<CreatedSchoolUser>(
    `WITH new_user AS (
       INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id
     )
     INSERT INTO school_memberships (school_id, user_id, role_key, username, status)
     SELECT $3, new_user.id, $4, $5, 'ACTIVE'
     FROM new_user
     RETURNING user_id, id AS membership_id`,
    [email, passwordHash, schoolId, roleKey, username],
  );

  return created as CreatedSchoolUser;
}

/**
 * A user identifier paired with its stored password hash.
 *
 * This type never leaves the server: only authentication code may read it, and
 * the hash must never be returned to a client, rendered, or logged.
 */
type UserCredentials = {
  id: string;
  password_hash: string | null;
};

/** Looks up credentials by email. Returns null when no such user exists. */
export async function findCredentialsByEmail(
  email: string,
): Promise<UserCredentials | null> {
  return queryOne<UserCredentials>(
    `SELECT id, password_hash
     FROM users
     WHERE email = $1`,
    [email],
  );
}

/**
 * Looks up credentials by school slug and school specific username.
 *
 * The username is only ever resolved inside the supplied school, and inactive
 * memberships are excluded, so a suspended member cannot sign in.
 */
export async function findCredentialsBySchoolUsername(
  schoolSlug: string,
  username: string,
): Promise<UserCredentials | null> {
  return queryOne<UserCredentials>(
    `SELECT users.id, users.password_hash
     FROM users
     JOIN school_memberships ON school_memberships.user_id = users.id
     JOIN schools ON schools.id = school_memberships.school_id
     WHERE schools.slug = $1
       AND school_memberships.username = $2
       AND school_memberships.status = 'ACTIVE'`,
    [schoolSlug, username],
  );
}

/** Returns the school role keys defined in the database. */
export async function listSchoolRoleKeys(): Promise<SchoolRoleKey[]> {
  const rows = await query<{ key: SchoolRoleKey }>(
    `SELECT key FROM school_roles ORDER BY key`,
  );

  return rows.map((row) => row.key);
}
