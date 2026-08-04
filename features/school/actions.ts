"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { revalidatePath } from "next/cache";

import {
  getCurrentSession,
  setActiveMembership,
} from "@/features/auth/session";
import { schoolInputSchema } from "@/features/identity/validation";
import { canManageSchool } from "@/features/school/authorization";
import { requireSchoolContext } from "@/features/school/context";
import {
  findActiveMembership,
  updateSchool,
} from "@/features/school/repository";

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

/**
 * The outcome of a school profile update.
 *
 * Only one error is reported at a time, which keeps the form state small and
 * the message unambiguous. The codes are translated by the form, so no
 * user-facing text originates on the server.
 */
export type SchoolProfileState = {
  saved: boolean;
  error: "forbidden" | "invalidName" | "invalidSlug" | "duplicateSlug" | null;
};

/** The Postgres error code for a violated unique constraint. */
const UNIQUE_VIOLATION = "23505";

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === UNIQUE_VIOLATION
  );
}

/**
 * Updates the profile of the active school.
 *
 * The school is taken from the validated context and the role is checked on
 * every call, so neither the target school nor the permission to change it can
 * be influenced by the submitted form.
 */
export async function updateSchoolProfile(
  _previousState: SchoolProfileState,
  formData: FormData,
): Promise<SchoolProfileState> {
  const context = await requireSchoolContext();

  if (!canManageSchool(context.roleKey)) {
    return { saved: false, error: "forbidden" };
  }

  const parsed = schoolInputSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
  });

  if (!parsed.success) {
    const failedField = parsed.error.issues[0]?.path[0];

    return {
      saved: false,
      error: failedField === "name" ? "invalidName" : "invalidSlug",
    };
  }

  try {
    await updateSchool(context.schoolId, parsed.data);
  } catch (error) {
    // Slugs are unique across all schools. Letting the database decide keeps
    // the check and the write in one step, so two schools cannot claim the
    // same slug at the same time.
    if (isUniqueViolation(error)) {
      return { saved: false, error: "duplicateSlug" };
    }

    throw error;
  }

  // The workspace header renders the school name, so the layout has to be
  // rebuilt as well as the page.
  revalidatePath("/", "layout");

  return { saved: true, error: null };
}
