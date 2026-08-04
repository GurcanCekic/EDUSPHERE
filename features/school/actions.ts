"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  getCurrentSession,
  setActiveMembership,
} from "@/features/auth/session";
import { findActiveMembership } from "@/features/school/repository";

const membershipIdSchema = z.uuid();

/**
 * Selects or switches the active school.
 *
 * The submitted value is a membership identifier, and it is only accepted once
 * the server has confirmed that the membership belongs to the authenticated
 * user and is active. Any other value leaves the current context untouched.
 */
export async function selectSchool(formData: FormData): Promise<void> {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const parsed = membershipIdSchema.safeParse(formData.get("membershipId"));

  if (!parsed.success) {
    redirect("/select-school");
  }

  const membership = await findActiveMembership(session.userId, parsed.data);

  if (!membership) {
    redirect("/select-school");
  }

  await setActiveMembership(membership.id);

  redirect("/dashboard");
}
