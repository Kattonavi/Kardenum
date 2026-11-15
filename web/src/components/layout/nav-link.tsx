"use client";

import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { AppLink } from "@/components/ui/app-link";
import { isAppLocale } from "@/i18n/locales";
import { usePathname } from "@/i18n/navigation";
import { type AppPathname, entryLinkKey } from "@/routes";

type NavLinkProps = {
  href: AppPathname;
  /** Classes for both states. */
  className?: string;
  /** Classes when this is the page on screen: the bronze underline by default. */
  currentClassName?: string;
  /** Classes on every other page. */
  idleClassName?: string;
  /** Entries inside this section ("es/kardenum"): on their pages the link is marked as the section on screen. */
  sectionEntries?: readonly string[];
  children: ReactNode;
};

/** Link of the main menu. The page you are on is marked visually and with aria-current. */
export function NavLink({
  href,
  className = "",
  currentClassName = "border-b-2 border-bronze",
  idleClassName = "border-b-2 border-transparent",
  sectionEntries = [],
  children,
}: NavLinkProps) {
  const current = usePathname() === href;
  const { locale, slug } = useParams();
  // On a case page the index is not the page on screen, but its section is (maqueta B-Caso).
  const inSection = typeof locale === "string" && isAppLocale(locale) && typeof slug === "string" && sectionEntries.includes(entryLinkKey(locale, slug));

  return (
    <AppLink
      href={href}
      aria-current={current ? "page" : inSection ? "true" : undefined}
      className={`${className} ${current || inSection ? currentClassName : idleClassName}`}
    >
      {children}
    </AppLink>
  );
}
