"use client";

import { useEffect, useId, useRef, useState } from "react";
import { KardenumSymbol } from "@/components/brand/kardenum-symbol";
import { ChannelLink } from "@/components/contact/channel-link";
import { AppLink } from "@/components/ui/app-link";
import { buttonClass } from "@/components/ui/button";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/ui/icons";
import type { AppLocale } from "@/i18n/locales";
import type { ContactChannel } from "@/lib/contact";
import { LocaleSwitcher } from "./locale-switcher";
import type { NavLine } from "./nav-data";

type MobileMenuProps = {
  locale: AppLocale;
  lines: NavLine[];
  showPortfolio: boolean;
  /** `href` replaces the link of the channel itself (WhatsApp leads to the quote form). */
  channels: { channel: ContactChannel; label: string; href?: string }[];
  languageNames: Record<AppLocale, string>;
  labels: {
    open: string;
    close: string;
    menu: string;
    nav: string;
    home: string;
    services: string;
    allServices: string;
    portfolio: string;
    about: string;
    quote: string;
    language: string;
    channels: string;
  };
};

const channelClass = "inline-flex min-h-11 items-center font-mono text-xs tracking-[0.1em] text-(--muted-text) uppercase";

const itemClass =
  "flex min-h-14 w-full items-center justify-between border-b border-line text-lg tracking-[0.08em] type-display transition-colors duration-150 hover:text-(--accent-text)";

/**
 * Full-screen menu for phones (maqueta B-Movil-menu). A native modal <dialog> gives the
 * focus trap, Escape to close, an inert page behind and focus back on the button for free.
 */
export function MobileMenu({ locale, lines, showPortfolio, channels, languageNames, labels }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [servicesOpen, setServicesOpen] = useState(true);
  const servicesId = useId();

  function open() {
    dialogRef.current?.showModal();
    closeRef.current?.focus();
  }
  const close = () => dialogRef.current?.close();

  // The menu belongs to small screens: if the window grows to the desktop layout, close it.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onChange = () => {
      if (desktop.matches) dialogRef.current?.close();
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={labels.open}
        onClick={open}
        className="inline-flex size-11 cursor-pointer items-center justify-center border border-line transition-colors duration-150 hover:border-stone"
      >
        <MenuIcon size={22} />
      </button>

      <dialog
        ref={dialogRef}
        aria-label={labels.menu}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 p-0 surface-ink"
      >
        <div className="flex min-h-full flex-col px-5 pb-7">
          <div className="flex items-center justify-between border-b border-line py-4">
            <AppLink href="/" onClick={close} aria-label={labels.home} className="inline-flex min-h-11 items-center gap-2.5">
              <KardenumSymbol size={22} variant="negative" />
              <span className="text-[15px] tracking-[0.16em] type-display">Kardenum</span>
            </AppLink>
            <button
              ref={closeRef}
              type="button"
              aria-label={labels.close}
              onClick={close}
              className="inline-flex size-11 cursor-pointer items-center justify-center border border-line transition-colors duration-150 hover:border-stone"
            >
              <CloseIcon size={22} />
            </button>
          </div>

          <nav aria-label={labels.nav} className="pt-2">
            <ul>
              <li>
                <button
                  type="button"
                  aria-expanded={servicesOpen}
                  aria-controls={servicesId}
                  onClick={() => setServicesOpen((value) => !value)}
                  className={`${itemClass} cursor-pointer ${servicesOpen ? "border-b-0" : ""}`}
                >
                  {labels.services}
                  <ChevronDownIcon size={16} className={`transition-transform duration-150 ${servicesOpen ? "rotate-180" : ""}`} />
                </button>
                <div id={servicesId} hidden={!servicesOpen} className="border-b border-line pb-3">
                  <ul className="border-l-2 border-bronze">
                    {lines.map((line) => (
                      <li key={line.href}>
                        <AppLink
                          href={line.href}
                          onClick={close}
                          className="flex min-h-11 items-center justify-between pl-4 transition-colors duration-150 hover:text-(--accent-text)"
                        >
                          {line.name}
                          <span className="font-mono text-[11px] text-(--muted-text)">{line.numeral}</span>
                        </AppLink>
                      </li>
                    ))}
                    <li>
                      <AppLink
                        href="/servicios"
                        onClick={close}
                        className="flex min-h-11 items-center pl-4 font-mono text-xs tracking-[0.1em] text-(--muted-text) uppercase transition-colors duration-150 hover:text-(--accent-text)"
                      >
                        {labels.allServices}
                      </AppLink>
                    </li>
                  </ul>
                </div>
              </li>
              {showPortfolio ? (
                <li>
                  <AppLink href="/portafolio" onClick={close} className={itemClass}>
                    {labels.portfolio}
                  </AppLink>
                </li>
              ) : null}
              <li>
                <AppLink href="/nosotros" onClick={close} className={itemClass}>
                  {labels.about}
                </AppLink>
              </li>
            </ul>
          </nav>

          <div className="pt-6">
            <LocaleSwitcher locale={locale} label={labels.language} names={languageNames} variant="buttons" />
          </div>

          <div className="mt-auto flex flex-col gap-4 pt-10">
            <AppLink href="/contacto" onClick={close} className={`${buttonClass.primary} min-h-13 w-full`}>
              {labels.quote}
            </AppLink>
            <ul aria-label={labels.channels} className="flex justify-between gap-2">
              {channels.map(({ channel, label, href }) => (
                <li key={channel}>
                  {href ? (
                    <a href={href} onClick={close} className={`${channelClass} transition-colors duration-150 hover:text-(--accent-text)`}>
                      {label}
                    </a>
                  ) : (
                    <ChannelLink channel={channel} className={channelClass}>
                      {label}
                    </ChannelLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </dialog>
    </>
  );
}
