import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MEMBERSHIP_SEARCH_MAX_LENGTH,
  MEMBERSHIP_STATUS_FILTERS,
  type MembershipFilter,
} from "@/features/identity/validation";
import type { Messages } from "@/lib/i18n";

/**
 * The search and status filters of the member list.
 *
 * The filters travel in the query string and are re-validated and re-applied
 * on the server, so this form is a convenience only and never a security
 * boundary.
 */
export function MembersFilters({
  filter,
  messages,
}: {
  filter: MembershipFilter;
  messages: Messages["school"]["members"];
}) {
  return (
    <form className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="search">{messages.search}</Label>
        <Input
          id="search"
          name="search"
          type="search"
          className="w-64"
          maxLength={MEMBERSHIP_SEARCH_MAX_LENGTH}
          placeholder={messages.searchPlaceholder}
          defaultValue={filter.search}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="status">{messages.status}</Label>
        <select
          id="status"
          name="status"
          defaultValue={filter.status}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          {MEMBERSHIP_STATUS_FILTERS.map((status) => (
            <option key={status} value={status}>
              {messages.statuses[status]}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" size="lg">
        {messages.apply}
      </Button>

      {filter.search.length > 0 || filter.status !== "ALL" ? (
        <Link
          href="/members"
          className={buttonVariants({ variant: "ghost", size: "lg" })}
        >
          {messages.reset}
        </Link>
      ) : null}
    </form>
  );
}
