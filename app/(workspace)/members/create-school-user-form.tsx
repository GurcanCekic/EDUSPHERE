"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SCHOOL_ROLE_KEYS,
  SCHOOL_USERNAME_MAX_LENGTH,
} from "@/features/identity/validation";
import {
  createSchoolUserAction,
  type CreateSchoolUserState,
} from "@/features/school/actions";
import type { Messages } from "@/lib/i18n";

// A "use server" module may only export functions, so the initial state lives
// with the form that uses it.
const initialState: CreateSchoolUserState = { created: false, error: null };

/**
 * The form that creates a user and adds them to the active school.
 *
 * Rendering it is a convenience for roles that may administer school access.
 * The server action repeats the role check and resolves the school itself, so
 * nothing is granted by this form being on screen.
 */
export function CreateSchoolUserForm({
  messages,
  roleLabels,
}: {
  messages: Messages["school"]["members"]["create"];
  roleLabels: Messages["school"]["roles"];
}) {
  const [state, formAction, pending] = useActionState(
    createSchoolUserAction,
    initialState,
  );

  return (
    <section className="flex flex-col gap-6 rounded-lg border p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">
          {messages.title}
        </h2>
        <p className="text-sm text-muted-foreground">{messages.description}</p>
      </div>

      <form action={formAction} className="flex flex-col gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">{messages.username}</Label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              maxLength={SCHOOL_USERNAME_MAX_LENGTH}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              {messages.usernameHint}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{messages.email}</Label>
            <Input id="email" name="email" type="email" autoComplete="off" />
            <p className="text-xs text-muted-foreground">
              {messages.emailHint}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">{messages.password}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              // The browser must not offer to remember a password that an
              // administrator types on behalf of somebody else.
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground">
              {messages.passwordHint}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="roleKey">{messages.role}</Label>
            <select
              id="roleKey"
              name="roleKey"
              defaultValue="STUDENT"
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              {SCHOOL_ROLE_KEYS.map((roleKey) => (
                <option key={roleKey} value={roleKey}>
                  {roleLabels[roleKey]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {state.error ? (
          <p role="alert" className="text-sm text-destructive">
            {messages.errors[state.error]}
          </p>
        ) : null}

        {state.created ? (
          <p role="status" className="text-sm text-muted-foreground">
            {messages.created}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="sm:self-start"
          disabled={pending}
        >
          {pending ? messages.submitting : messages.submit}
        </Button>
      </form>
    </section>
  );
}
