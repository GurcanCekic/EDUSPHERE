"use client";

import { Button } from "@/components/ui/button";
import { getMessages } from "@/lib/i18n";

/**
 * Shown when the member list cannot be loaded.
 *
 * The underlying error is deliberately not rendered: it may describe the
 * database and says nothing useful to a school administrator.
 */
export default function MembersError({ reset }: { reset: () => void }) {
  const messages = getMessages();

  return (
    <section className="flex flex-col items-start gap-4">
      <p className="text-sm text-muted-foreground">
        {messages.school.members.error}
      </p>
      <Button type="button" variant="outline" onClick={reset}>
        {messages.school.members.retry}
      </Button>
    </section>
  );
}
