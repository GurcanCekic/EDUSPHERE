import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/features/auth/session";
import { getSchoolContext } from "@/features/school/context";
import { selectSchool } from "@/features/school/actions";
import { listActiveMemberships } from "@/features/school/repository";
import { getMessages } from "@/lib/i18n";

/**
 * School selection and switching.
 *
 * Only the active memberships of the authenticated user are listed, and the
 * chosen membership is validated again in the server action.
 */
export default async function SelectSchoolPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const memberships = await listActiveMemberships(userId);
  const context = await getSchoolContext();

  // A single membership resolves to a school automatically, so there is
  // nothing to choose.
  if (memberships.length === 1 && context) {
    redirect("/dashboard");
  }

  const messages = getMessages();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {messages.school.select.title}
      </h1>

      {memberships.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {messages.school.select.empty}
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {messages.school.select.description}
          </p>
          <ul className="flex w-full max-w-sm flex-col gap-3">
            {memberships.map((membership) => (
              <li key={membership.id}>
                <form action={selectSchool} className="flex flex-col gap-1">
                  <input
                    type="hidden"
                    name="membershipId"
                    value={membership.id}
                  />
                  <Button
                    type="submit"
                    variant={
                      membership.id === context?.membershipId
                        ? "default"
                        : "outline"
                    }
                    size="lg"
                    className="w-full"
                  >
                    {membership.school_name}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {messages.school.roles[membership.role_key]}
                  </span>
                </form>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
