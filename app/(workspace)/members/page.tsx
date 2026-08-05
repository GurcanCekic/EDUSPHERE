import { AddExistingUserForm } from "./add-existing-user-form";
import { CreateSchoolUserForm } from "./create-school-user-form";
import { MembersFilters } from "./members-filters";
import { membershipFilterSchema } from "@/features/identity/validation";
import { canManageSchoolAccess } from "@/features/school/authorization";
import { requireSchoolContext } from "@/features/school/context";
import {
  listSchoolMemberships,
  type SchoolMembershipListItem,
} from "@/features/school/repository";
import { getMessages } from "@/lib/i18n";

/**
 * The name a membership is listed under.
 *
 * There is no stored display name yet, so the school username is used and the
 * email serves as a fallback. Both are already shown in their own columns,
 * which keeps the derived value honest rather than inventing a name.
 */
function displayName(
  membership: SchoolMembershipListItem,
  unnamed: string,
): string {
  return membership.username ?? membership.email ?? unnamed;
}

/**
 * The members of the active school.
 *
 * The guard runs here rather than in the workspace layout, because a layout is
 * not re-executed on a client side navigation. Unauthorized roles are answered
 * with a message and no query is made at all, so membership data never leaves
 * the database for them.
 *
 * Authorized roles may also create a school user here, or add a user who
 * already exists on the platform. Existing memberships stay read only: there is
 * still no way to change one.
 */
export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const context = await requireSchoolContext();

  const messages = getMessages();
  const memberMessages = messages.school.members;

  if (!canManageSchoolAccess(context.roleKey)) {
    return (
      <section className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {memberMessages.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {memberMessages.unauthorized}
        </p>
      </section>
    );
  }

  const filter = membershipFilterSchema.parse(await searchParams);

  // The school identifier comes from the validated context, never from the
  // request, so the list cannot be pointed at another school.
  const memberships = await listSchoolMemberships(context.schoolId, filter);

  const isFiltered = filter.search.length > 0 || filter.status !== "ALL";

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {memberMessages.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {memberMessages.description}
        </p>
      </div>

      <CreateSchoolUserForm
        messages={memberMessages.create}
        roleLabels={messages.school.roles}
      />

      <AddExistingUserForm
        messages={memberMessages.addExisting}
        roleLabels={messages.school.roles}
      />

      <MembersFilters filter={filter} messages={memberMessages} />

      {memberships.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {isFiltered ? memberMessages.noResults : memberMessages.empty}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  {memberMessages.columns.displayName}
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  {memberMessages.columns.username}
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  {memberMessages.columns.email}
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  {memberMessages.columns.role}
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  {memberMessages.columns.status}
                </th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((membership) => (
                <tr key={membership.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3">
                    {displayName(membership, memberMessages.unnamed)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {membership.username ?? memberMessages.none}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {membership.email ?? memberMessages.none}
                  </td>
                  <td className="px-4 py-3">
                    {messages.school.roles[membership.role_key]}
                  </td>
                  <td className="px-4 py-3">
                    {memberMessages.statuses[membership.status]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
