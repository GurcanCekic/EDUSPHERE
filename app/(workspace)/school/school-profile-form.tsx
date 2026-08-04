"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SCHOOL_NAME_MAX_LENGTH } from "@/features/identity/validation";
import {
  updateSchoolProfile,
  type SchoolProfileState,
} from "@/features/school/actions";
import type { SchoolProfile } from "@/features/school/repository";
import type { Messages } from "@/lib/i18n";

// A "use server" module may only export functions, so the initial state lives
// with the form that uses it.
const initialState: SchoolProfileState = { saved: false, error: null };

/**
 * The school profile editor.
 *
 * Rendering this form is a convenience for roles that may manage the school.
 * The server action repeats the role check, so nothing is granted by the form
 * being on screen.
 */
export function SchoolProfileForm({
  school,
  messages,
}: {
  school: SchoolProfile;
  messages: Messages["school"]["profile"];
}) {
  const [state, formAction, pending] = useActionState(
    updateSchoolProfile,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">{messages.name}</Label>
        <Input
          id="name"
          name="name"
          type="text"
          // Keeps the field within the length the schema accepts, so the
          // "enter a name" message is only ever shown for a blank name.
          maxLength={SCHOOL_NAME_MAX_LENGTH}
          defaultValue={school.name}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="slug">{messages.slug}</Label>
        <Input id="slug" name="slug" type="text" defaultValue={school.slug} />
        <p className="text-xs text-muted-foreground">{messages.slugHint}</p>
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {messages.errors[state.error]}
        </p>
      ) : null}

      {state.saved ? (
        <p role="status" className="text-sm text-muted-foreground">
          {messages.saved}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? messages.saving : messages.save}
      </Button>
    </form>
  );
}
