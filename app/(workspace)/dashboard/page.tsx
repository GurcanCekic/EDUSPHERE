import { requireSchoolContext } from "@/features/school/context";
import { getMessages } from "@/lib/i18n";

/**
 * The school dashboard.
 *
 * The guard runs here as well as in the workspace layout. A layout is not
 * re-executed on a client side navigation between pages inside it, so each
 * page has to enforce access itself.
 *
 * Dashboard content belongs to a later feature.
 */
export default async function DashboardPage() {
  await requireSchoolContext();

  const messages = getMessages();

  return (
    <h1 className="text-2xl font-semibold tracking-tight">
      {messages.dashboard.title}
    </h1>
  );
}
