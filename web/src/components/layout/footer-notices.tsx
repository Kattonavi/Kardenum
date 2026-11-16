"use client";

import { useParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import { type EntryNotices, type FooterNotice, noticesOnScreen } from "@/lib/notices";

/**
 * Trademark notices at the bottom of the footer, each on the pages of its line (spec 008). The
 * footer lives in the layout, which is not rendered again on a client-side navigation, so the
 * page on screen is read here. It is rendered at build time for each page: the notices are in
 * the server HTML, not added by JavaScript.
 */
export function FooterNotices({ texts, entries }: { texts: Record<FooterNotice, string>; entries: EntryNotices }) {
  const notices = noticesOnScreen(usePathname(), useParams(), entries);
  if (notices.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 font-mono text-[0.6875rem] leading-[1.6] tracking-[0.08em] text-(--muted-text) uppercase">
      {notices.map((notice) => (
        <p key={notice}>{texts[notice]}</p>
      ))}
    </div>
  );
}
