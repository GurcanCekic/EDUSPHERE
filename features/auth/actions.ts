"use server";

import { redirect } from "next/navigation";

import { verifyPassword } from "@/features/identity/password";
import {
  findCredentialsByEmail,
  findCredentialsBySchoolUsername,
} from "@/features/identity/repository";
import { loginSchema } from "@/features/identity/validation";
import { createSession, destroySession } from "@/features/auth/session";

/**
 * The login result carries no detail beyond success or failure, so that no
 * response can reveal whether an account exists.
 */
export type LoginState = { failed: boolean };

/**
 * A hash of an unguessable value. Verifying against it when no account matches
 * makes a missing account cost the same as a wrong password, so account
 * existence cannot be inferred from response timing either.
 */
const ABSENT_ACCOUNT_HASH =
  "$2b$12$Zx.XqAiIiFzWzXWOT9SlZexIrAl9K9tjYHxoOqAymlYVoV4PeW75O";

function readCredentials(formData: FormData): unknown {
  const method = formData.get("method");

  if (method === "username") {
    return {
      method: "username",
      schoolSlug: String(formData.get("schoolSlug") ?? ""),
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
  }

  return {
    method: "email",
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
}

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse(readCredentials(formData));

  // Malformed input is reported exactly like a wrong password: any difference
  // would be another signal about the submitted account.
  if (!parsed.success) {
    return { failed: true };
  }

  const credentials = parsed.data;

  const account =
    credentials.method === "email"
      ? await findCredentialsByEmail(credentials.email)
      : await findCredentialsBySchoolUsername(
          credentials.schoolSlug,
          credentials.username,
        );

  const passwordMatches = await verifyPassword(
    credentials.password,
    account?.password_hash ?? ABSENT_ACCOUNT_HASH,
  );

  if (!account || !passwordMatches) {
    return { failed: true };
  }

  await createSession(account.id);

  // `redirect` throws, so it must stay outside any try/catch.
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await destroySession();

  redirect("/login");
}
