import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

import { query, queryOne } from "@/lib/db";

const SESSION_COOKIE_NAME = "edusphere_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Sessions are stored as a hash of the token, never the token itself, so that
 * a leaked database row cannot be replayed as a cookie.
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a session for a user and sets the session cookie.
 *
 * Callable only from a Server Action or Route Handler, because those are the
 * only places where cookies may be written.
 */
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  // Expired sessions of this user are of no further use.
  await query(
    `DELETE FROM sessions WHERE user_id = $1 AND expires_at <= now()`,
    [userId],
  );

  await query(
    `INSERT INTO sessions (token_hash, user_id, expires_at)
     VALUES ($1, $2, $3)`,
    [hashToken(token), userId, expiresAt],
  );

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/**
 * The stored state of the current session.
 *
 * `activeMembershipId` is the school context. It is only a pointer: whether it
 * still grants access is decided by the school context code on every request.
 */
export type CurrentSession = {
  userId: string;
  activeMembershipId: string | null;
};

/**
 * Returns the current session, or null when the request carries no valid one.
 */
export async function getCurrentSession(): Promise<CurrentSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await queryOne<{
    user_id: string;
    active_membership_id: string | null;
  }>(
    `SELECT user_id, active_membership_id
     FROM sessions
     WHERE token_hash = $1
       AND expires_at > now()`,
    [hashToken(token)],
  );

  if (!session) {
    return null;
  }

  return {
    userId: session.user_id,
    activeMembershipId: session.active_membership_id,
  };
}

/**
 * Returns the authenticated user identifier, or null when the request carries
 * no valid session. This is the accessor server side code should use.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getCurrentSession();

  return session?.userId ?? null;
}

/**
 * Records the active school membership on the current session.
 *
 * The membership must already have been validated against the authenticated
 * user: this function only writes what it is given.
 */
export async function setActiveMembership(membershipId: string): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return;
  }

  await query(
    `UPDATE sessions
     SET active_membership_id = $2
     WHERE token_hash = $1
       AND expires_at > now()`,
    [hashToken(token), membershipId],
  );
}

/**
 * Invalidates the active session and clears the cookie.
 *
 * Deleting the row is what makes the session unusable: clearing the cookie
 * alone would leave a copied token valid.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await query(`DELETE FROM sessions WHERE token_hash = $1`, [
      hashToken(token),
    ]);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
