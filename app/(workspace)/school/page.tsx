import { notFound } from "next/navigation";

import { SchoolProfileForm } from "./school-profile-form";
import { canManageSchool } from "@/features/school/authorization";
import { requireSchoolContext } from "@/features/school/context";
import { findSchoolById } from "@/features/school/repository";
import { getMessages } from "@/lib/i18n";

/**
 * The school profile.
 *
 * Every member of the school may read it. The editing form is only rendered
 * for the roles that may manage the school, and `updateSchoolProfile` checks
 * that role again before it writes.
 */
export default async function SchoolPage() {
  const context = await requireSchoolContext();

  const school = await findSchoolById(context.schoolId);

  if (!school) {
    notFound();
  }

  const messages = getMessages();

  return (
    <section className="flex w-full max-w-sm flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {messages.school.profile.title}
      </h1>

      {canManageSchool(context.roleKey) ? (
        <SchoolProfileForm school={school} messages={messages.school.profile} />
      ) : (
        <dl className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-medium">
              {messages.school.profile.name}
            </dt>
            <dd className="text-sm text-muted-foreground">{school.name}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-medium">
              {messages.school.profile.slug}
            </dt>
            <dd className="text-sm text-muted-foreground">{school.slug}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}
