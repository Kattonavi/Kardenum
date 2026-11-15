"use client";

import type { ReactNode } from "react";
import { AppLink } from "@/components/ui/app-link";
import { usePathname } from "@/i18n/navigation";
import type { AppPathname } from "@/routes";

type NavLinkProps = {
  href: AppPathname;
  /** Classes for both states. */
  className?: string;
  /** Classes when this is the page on screen: the bronze underline by default. */
  currentClassName?: string;
  /** Classes on every other page. */
  idleClassName?: string;
  children: ReactNode;
};

/** Link of the main menu. The page you are on is marked visually and with aria-current. */
export function NavLink({
  href,
  className = "",
  currentClassName = "border-b-2 border-bronze",
  idleClassName = "border-b-2 border-transparent",
  children,
}: NavLinkProps) {
  const current = usePathname() === href;

  return (
    <AppLink href={href} aria-current={current ? "page" : undefined} className={`${className} ${current ? currentClassName : idleClassName}`}>
      {children}
    </AppLink>
  );
}
