import type { ReactNode } from "react";

import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceNav } from "./workspace-nav";
import { canManageSchoolAccess } from "@/features/school/authorization";
import { requireSchoolContext } from "@/features/school/context";
import { listActiveMemberships } from "@/features/school/repository";
import { getMessages } from "@/lib/i18n";

/**
 * The shared layout of the school workspace.
 *
 * The guard here protects the layout's own data and chrome. It does not
 * protect the pages below: a layout is not re-executed on a client side
 * navigation between pages inside it, so every workspace page has to call
 * `requireSchoolContext` itself.
 */
export default async function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const context = await requireSchoolContext();

  const memberships = await listActiveMemberships(context.userId);
  const activeMembership = memberships.find(
    (membership) => membership.id === context.membershipId,
  );

  const messages = getMessages();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <WorkspaceHeader
        schoolName={activeMembership?.school_name ?? ""}
        roleKey={context.roleKey}
        activeMembershipId={context.membershipId}
        memberships={memberships}
        messages={messages}
      />
      <WorkspaceNav
        label={messages.workspace.navigation}
        items={[
          { href: "/dashboard", label: messages.dashboard.title },
          { href: "/school", label: messages.school.profile.title },
          ...(canManageSchoolAccess(context.roleKey)
            ? [{ href: "/members", label: messages.school.members.title }]
            : []),
        ]}
      />
      <main className="flex flex-1 flex-col gap-6 p-6">{children}</main>
    </div>
  );
}
