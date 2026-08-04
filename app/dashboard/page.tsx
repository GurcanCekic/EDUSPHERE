import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/actions";
import { getCurrentUserId } from "@/features/auth/session";
import { getMessages } from "@/lib/i18n";

/**
 * The minimal authenticated page. Access requires a valid session only: school
 * role and permission checks are not part of this feature.
 */
export default async function DashboardPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const messages = getMessages();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {messages.dashboard.title}
      </h1>
      <p className="text-sm text-muted-foreground">
        {messages.dashboard.signedInAs} {userId}
      </p>
      <form action={logout}>
        <Button type="submit" variant="outline" size="lg">
          {messages.auth.logout.submit}
        </Button>
      </form>
    </main>
  );
}
