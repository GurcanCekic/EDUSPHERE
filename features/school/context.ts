import "server-only";

import { redirect } from "next/navigation";

import {
  getCurrentSession,
  setActiveMembership,
  type CurrentSession,
} from "@/features/auth/session";
import type { SchoolRoleKey } from "@/features/identity/validation";
import {
  findActiveMembership,
  listActiveMemberships,
  type ActiveMembership,
} from "@/features/school/repository";

/** The validated school context of the current request. */
export type SchoolContext = {
  userId: string;
  schoolId: string;
  membershipId: string;
  roleKey: SchoolRoleKey;
};

function toContext(
  userId: string,
  membership: ActiveMembership,
): SchoolContext {
  return {
    userId,
    schoolId: membership.school_id,
    membershipId: membership.id,
    roleKey: membership.role_key,
  };
}

/**
 * Resolves the school context of a session.
 *
 * The membership stored on the session is re-checked on every request, so a
 * membership that has been deactivated stops granting access immediately.
 *
 * A user with exactly one active membership enters that school automatically,
 * which is what makes the selection page unnecessary for them.
 */
async function resolveContext(
  session: CurrentSession,
): Promise<SchoolContext | null> {
  if (session.activeMembershipId) {
    const membership = await findActiveMembership(
      session.userId,
      session.activeMembershipId,
    );

    if (membership) {
      return toContext(session.userId, membership);
    }
  }

  const memberships = await listActiveMemberships(session.userId);

  if (memberships.length !== 1) {
    return null;
  }

  await setActiveMembership(memberships[0].id);

  return toContext(session.userId, memberships[0]);
}

/** Returns the active school context, or null when there is none. */
export async function getSchoolContext(): Promise<SchoolContext | null> {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return resolveContext(session);
}

/**
 * The guard every school scoped page and action must use.
 *
 * It returns the validated context, so server side code never has to derive
 * the school from client supplied data.
 */
export async function requireSchoolContext(): Promise<SchoolContext> {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const context = await resolveContext(session);

  if (!context) {
    redirect("/select-school");
  }

  return context;
}
