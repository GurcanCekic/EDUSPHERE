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
  addExistingUserAction,
  type AddExistingUserState,
} from "@/features/school/actions";
import type { Messages } from "@/lib/i18n";

// A "use server" module may only export functions, so the initial state lives
// with the form that uses it.
const initialState: AddExistingUserState = { added: false, error: null };

/**
 * The form that adds an existing platform user to the active school.
 *
 * Rendering it is a convenience for roles that may administer school access.
 * The server action repeats the role check and resolves the school itself, so
 * nothing is granted by this form being on screen.
 */
export function AddExistingUserForm({
  messages,
  roleLabels,
}: {
  messages: Messages["school"]["members"]["addExisting"];
  roleLabels: Messages["school"]["roles"];
}) {
  const [state, formAction, pending] = useActionState(
    addExistingUserAction,
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
            <Label htmlFor="existingEmail">{messages.email}</Label>
            <Input
              id="existingEmail"
              name="email"
              type="email"
              required
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              {messages.emailHint}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="existingUsername">{messages.username}</Label>
            <Input
              id="existingUsername"
              name="username"
              type="text"
              maxLength={SCHOOL_USERNAME_MAX_LENGTH}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              {messages.usernameHint}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="existingRoleKey">{messages.role}</Label>
            <select
              id="existingRoleKey"
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

        {state.added ? (
          <p role="status" className="text-sm text-muted-foreground">
            {messages.added}
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
