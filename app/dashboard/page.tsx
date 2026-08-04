import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { logout } from "@/features/auth/actions";
import { requireSchoolContext } from "@/features/school/context";
import { listActiveMemberships } from "@/features/school/repository";
import { getMessages } from "@/lib/i18n";

/**
 * A school scoped page. The guard supplies the validated school context, so
 * access requires an authenticated user with an active membership.
 */
export default async function DashboardPage() {
  const context = await requireSchoolContext();

  const memberships = await listActiveMemberships(context.userId);
  const activeMembership = memberships.find(
    (membership) => membership.id === context.membershipId,
  );

  const messages = getMessages();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {messages.dashboard.title}
      </h1>
      <p className="text-sm text-muted-foreground">
        {messages.dashboard.signedInAs} {context.userId}
      </p>
      <p className="text-sm text-muted-foreground">
        {messages.school.activeSchool} {activeMembership?.school_name}
      </p>

      {memberships.length > 1 ? (
        <Link
          href="/select-school"
          className={buttonVariants({ variant: "link" })}
        >
          {messages.school.switch}
        </Link>
      ) : null}

      <form action={logout}>
        <Button type="submit" variant="outline" size="lg">
          {messages.auth.logout.submit}
        </Button>
      </form>
    </main>
  );
}
