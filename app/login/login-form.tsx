"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, type LoginState } from "@/features/auth/actions";
import {
  LOGIN_METHODS,
  type LoginMethod,
} from "@/features/identity/validation";
import type { Messages } from "@/lib/i18n";

// A "use server" module may only export functions, so the initial state lives
// with the form that uses it.
const initialLoginState: LoginState = { failed: false };

/**
 * The selected method only decides which fields are shown. Authorization is
 * decided entirely on the server from the submitted values.
 */
export function LoginForm({
  messages,
}: {
  messages: Messages["auth"]["login"];
}) {
  const [state, formAction, pending] = useActionState(login, initialLoginState);
  const [method, setMethod] = useState<LoginMethod>("email");

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {messages.title}
      </h1>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">
          {messages.methodLegend}
        </legend>
        {LOGIN_METHODS.map((value) => (
          <Label key={value} className="font-normal">
            <input
              type="radio"
              name="method"
              value={value}
              checked={method === value}
              onChange={() => setMethod(value)}
            />
            {value === "email" ? messages.methodEmail : messages.methodUsername}
          </Label>
        ))}
      </fieldset>

      {method === "email" ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{messages.email}</Label>
          <Input id="email" name="email" type="email" autoComplete="username" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="schoolSlug">{messages.schoolSlug}</Label>
            <Input id="schoolSlug" name="schoolSlug" type="text" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">{messages.username}</Label>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
            />
          </div>
        </>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{messages.password}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
        />
      </div>

      {state.failed ? (
        <p role="alert" className="text-sm text-destructive">
          {messages.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? messages.submitting : messages.submit}
      </Button>
    </form>
  );
}
