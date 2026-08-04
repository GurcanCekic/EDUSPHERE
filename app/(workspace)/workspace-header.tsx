import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/actions";
import type { SchoolRoleKey } from "@/features/identity/validation";
import { selectSchool } from "@/features/school/actions";
import type { ActiveMembership } from "@/features/school/repository";
import type { Messages } from "@/lib/i18n";

/**
 * The workspace header: active school, school role, school switching and
 * logout.
 *
 * The school and role are rendered from the validated server side context, and
 * the switcher lists only the active memberships of the current user. The
 * chosen membership is validated again in `selectSchool`.
 */
export function WorkspaceHeader({
  schoolName,
  roleKey,
  activeMembershipId,
  memberships,
  messages,
}: {
  schoolName: string;
  roleKey: SchoolRoleKey;
  activeMembershipId: string;
  memberships: ActiveMembership[];
  messages: Messages;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4">
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">
          {messages.school.activeSchool}
        </span>
        <span className="text-base font-semibold tracking-tight">
          {schoolName}
        </span>
        <span className="text-sm text-muted-foreground">
          {messages.school.roles[roleKey]}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {memberships.length > 1 ? (
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-md border px-3 py-2 text-sm">
              {messages.school.switch}
            </summary>
            <ul className="absolute right-0 z-10 mt-1 flex w-56 flex-col gap-1 rounded-md border bg-background p-1 shadow-md">
              {memberships.map((membership) => (
                <li key={membership.id}>
                  <form action={selectSchool}>
                    <input
                      type="hidden"
                      name="membershipId"
                      value={membership.id}
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      className="w-full justify-start"
                      disabled={membership.id === activeMembershipId}
                    >
                      {membership.school_name}
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
          </details>
        ) : null}

        <form action={logout}>
          <Button type="submit" variant="outline">
            {messages.auth.logout.submit}
          </Button>
        </form>
      </div>
    </header>
  );
}
