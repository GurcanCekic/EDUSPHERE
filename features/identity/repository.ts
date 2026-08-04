import "server-only";

import { query, queryOne } from "@/lib/db";
import { hashPassword } from "@/features/identity/password";
import {
  schoolInputSchema,
  schoolMembershipInputSchema,
  userInputSchema,
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

/** Returns the school role keys defined in the database. */
export async function listSchoolRoleKeys(): Promise<SchoolRoleKey[]> {
  const rows = await query<{ key: SchoolRoleKey }>(
    `SELECT key FROM school_roles ORDER BY key`,
  );

  return rows.map((row) => row.key);
}
