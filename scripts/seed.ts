/**
 * Core development seed data.
 *
 * Run with `npm run db:seed`. The command is for local development only and
 * refuses to run in production.
 *
 * Every step upserts on an existing unique key, so the command may be run any
 * number of times: it creates the dataset on a clean database and brings an
 * already seeded one back to the expected values.
 */
import { hashPassword } from "@/features/identity/password";
import {
  SCHOOL_ROLE_KEYS,
  type MembershipStatus,
  type SchoolRoleKey,
} from "@/features/identity/validation";
import { pool, query, queryOne } from "@/lib/db";

/**
 * The shared password of every seeded account.
 *
 * It is a well known development value, documented in the README. Only its
 * hash reaches the database, and it is never written to the output.
 */
const DEVELOPMENT_PASSWORD = "Password123!";

const SCHOOLS = [
  { name: "Riverside College", slug: "riverside" },
  { name: "Lakeside Academy", slug: "lakeside" },
] as const;

type SeedMembership = {
  schoolSlug: (typeof SCHOOLS)[number]["slug"];
  roleKey: SchoolRoleKey;
  username: string | null;
  status: MembershipStatus;
};

type SeedUser = {
  email: string;
  memberships: SeedMembership[];
};

/**
 * The dataset covers the flows that already exist: both login methods, a user
 * who belongs to two schools with a different role in each, and a membership
 * that is inactive while the same user stays active elsewhere.
 */
const USERS: SeedUser[] = [
  {
    email: "owner@edusphere.test",
    memberships: [
      {
        schoolSlug: "riverside",
        roleKey: "OWNER",
        username: null,
        status: "ACTIVE",
      },
    ],
  },
  {
    email: "admin@edusphere.test",
    memberships: [
      {
        schoolSlug: "riverside",
        roleKey: "ADMIN",
        username: null,
        status: "ACTIVE",
      },
    ],
  },
  {
    email: "teacher@edusphere.test",
    memberships: [
      {
        schoolSlug: "riverside",
        roleKey: "TEACHER",
        username: "teacher",
        status: "ACTIVE",
      },
      {
        schoolSlug: "lakeside",
        roleKey: "ADMIN",
        username: null,
        status: "ACTIVE",
      },
    ],
  },
  {
    email: "student@edusphere.test",
    memberships: [
      {
        schoolSlug: "riverside",
        roleKey: "STUDENT",
        username: "student",
        status: "ACTIVE",
      },
      {
        schoolSlug: "lakeside",
        roleKey: "STUDENT",
        username: null,
        status: "INACTIVE",
      },
    ],
  },
];

/** The roles are created by migration. Seeding them again is a safety net. */
async function seedRoles(): Promise<void> {
  await query(
    `INSERT INTO school_roles (key)
     SELECT unnest($1::text[])
     ON CONFLICT (key) DO NOTHING`,
    [[...SCHOOL_ROLE_KEYS]],
  );
}

/** Creates or updates one school, keyed by its globally unique slug. */
async function seedSchool(name: string, slug: string): Promise<string> {
  const school = await queryOne<{ id: string }>(
    `INSERT INTO schools (name, slug)
     VALUES ($1, $2)
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [name, slug],
  );

  return (school as { id: string }).id;
}

/** Creates or updates one user, keyed by their unique email. */
async function seedUser(email: string): Promise<string> {
  const passwordHash = await hashPassword(DEVELOPMENT_PASSWORD);

  const user = await queryOne<{ id: string }>(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
     RETURNING id`,
    [email, passwordHash],
  );

  return (user as { id: string }).id;
}

/**
 * Creates or updates one membership.
 *
 * A user belongs to a school at most once, so the school and user pair is what
 * the upsert keys on. Re-running the command therefore corrects a changed role,
 * username, or status instead of failing.
 */
async function seedMembership(
  schoolId: string,
  userId: string,
  membership: SeedMembership,
): Promise<void> {
  await query(
    `INSERT INTO school_memberships (school_id, user_id, role_key, username, status)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (school_id, user_id) DO UPDATE
       SET role_key = EXCLUDED.role_key,
           username = EXCLUDED.username,
           status = EXCLUDED.status`,
    [
      schoolId,
      userId,
      membership.roleKey,
      membership.username,
      membership.status,
    ],
  );
}

async function seed(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("The development seed must never run in production.");
  }

  await seedRoles();

  const schoolIds = new Map<string, string>();

  for (const school of SCHOOLS) {
    schoolIds.set(school.slug, await seedSchool(school.name, school.slug));
  }

  for (const user of USERS) {
    const userId = await seedUser(user.email);

    for (const membership of user.memberships) {
      const schoolId = schoolIds.get(membership.schoolSlug);

      // Unreachable while every membership names a seeded school, but a typo
      // must fail loudly rather than silently skip a membership.
      if (!schoolId) {
        throw new Error(`Unknown school slug: ${membership.schoolSlug}`);
      }

      await seedMembership(schoolId, userId, membership);
    }
  }

  console.log(
    `Seeded ${SCHOOLS.length} schools and ${USERS.length} users. ` +
      `See the README for the development credentials.`,
  );
}

// The package is CommonJS, so the entry point cannot use top level await.
seed()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
