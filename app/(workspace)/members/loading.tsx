import { getMessages } from "@/lib/i18n";

/** Shown while the member list is being loaded on the server. */
export default function MembersLoading() {
  const messages = getMessages();

  return (
    <p className="text-sm text-muted-foreground">
      {messages.school.members.loading}
    </p>
  );
}
