"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type WorkspaceNavItem = {
  href: string;
  label: string;
};

/**
 * The workspace navigation.
 *
 * Showing or hiding an entry is a presentation concern only. Every target page
 * still enforces its own access rules on the server.
 */
export function WorkspaceNav({
  label,
  items,
}: {
  label: string;
  items: WorkspaceNavItem[];
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="border-b px-6">
      <ul className="flex gap-1">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "-mb-px inline-block border-b-2 px-3 py-3 text-sm",
                  isActive
                    ? "border-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
