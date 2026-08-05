"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { revalidatePath } from "next/cache";

import {
  getCurrentSession,
  setActiveMembership,
} from "@/features/auth/session";
import { createSchoolUser } from "@/features/identity/repository";
import {
  createSchoolUserSchema,
  schoolInputSchema,
} from "@/features/identity/validation";
import {
  canManageSchool,
  canManageSchoolAccess,
} from "@/features/school/authorization";
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

/** Returns the violated unique constraint, or null for any other error. */
function uniqueViolationConstraint(error: unknown): string | null {
  if (!isUniqueViolation(error)) {
    return null;
  }

  const constraint = (error as { constraint?: unknown }).constraint;

  return typeof constraint === "string" ? constraint : null;
}

/**
 * The outcome of creating a school user.
 *
 * Only error codes cross this boundary; the form translates them. The
 * submitted password is never part of the state, so it cannot end up in a
 * response, a log, or the browser.
 */
export type CreateSchoolUserState = {
  created: boolean;
  error:
    | "forbidden"
    | "invalidUsername"
    | "invalidEmail"
    | "invalidPassword"
    | "invalidRole"
    | "duplicateUsername"
    | "duplicateEmail"
    | null;
};

/** Maps the first failing field to the error code the form displays. */
const FIELD_ERRORS: Record<string, CreateSchoolUserState["error"]> = {
  username: "invalidUsername",
  email: "invalidEmail",
  password: "invalidPassword",
  roleKey: "invalidRole",
};

/**
 * Creates a user and adds them to the active school.
 *
 * The school is taken from the validated context and the role of the caller is
 * checked on every call, so the form can neither choose the school nor grant
 * itself the permission. The new membership is therefore always, and only, in
 * the active school.
 */
export async function createSchoolUserAction(
  _previousState: CreateSchoolUserState,
  formData: FormData,
): Promise<CreateSchoolUserState> {
  const context = await requireSchoolContext();

  if (!canManageSchoolAccess(context.roleKey)) {
    return { created: false, error: "forbidden" };
  }

  const parsed = createSchoolUserSchema.safeParse({
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    roleKey: String(formData.get("roleKey") ?? ""),
  });

  if (!parsed.success) {
    const failedField = String(parsed.error.issues[0]?.path[0] ?? "");

    return {
      created: false,
      error: FIELD_ERRORS[failedField] ?? "invalidUsername",
    };
  }

  try {
    await createSchoolUser(context.schoolId, parsed.data);
  } catch (error) {
    // Both uniqueness rules are enforced by the database, so the check and the
    // write stay a single step and two administrators cannot claim the same
    // username or email at the same time.
    const constraint = uniqueViolationConstraint(error);

    if (constraint === "school_memberships_school_username_key") {
      return { created: false, error: "duplicateUsername" };
    }

    if (constraint === "users_email_key") {
      return { created: false, error: "duplicateEmail" };
    }

    throw error;
  }

  revalidatePath("/members");

  return { created: true, error: null };
}
