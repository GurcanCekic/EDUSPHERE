import "server-only";

import { Pool } from "pg";

import { env } from "@/lib/env";

// Single shared connection pool.
// The pool is cached on `globalThis` so that development hot reloads reuse
// the existing connections instead of exhausting the database.
const globalForDb = globalThis as typeof globalThis & {
  edusphereDbPool?: Pool;
};

export const pool =
  globalForDb.edusphereDbPool ??
  new Pool({ connectionString: env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalForDb.edusphereDbPool = pool;
}

/** Runs a parameterised query. Values must always be passed as parameters. */
export async function query<T extends Record<string, unknown>>(
  text: string,
  values: readonly unknown[] = [],
): Promise<T[]> {
  const result = await pool.query<T>(text, values as unknown[]);

  return result.rows;
}

/** Runs a query that is expected to return at most one row. */
export async function queryOne<T extends Record<string, unknown>>(
  text: string,
  values: readonly unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, values);

  return rows[0] ?? null;
}
