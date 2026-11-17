"use client";

import { type FocusEvent, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, useEffect, useId, useRef, useState } from "react";
import { AppLink } from "@/components/ui/app-link";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/ui/icons";
import { usePathname } from "@/i18n/navigation";
import { useHydrated } from "@/lib/use-hydrated";
import type { NavLine } from "./nav-data";

type ServicesMenuProps = {
  label: string;
  lines: NavLine[];
  allServicesLabel: string;
  unsureLabel: string;
};

/**
 * "Servicios" in the desktop menu: a disclosure (button + panel), not an ARIA menu.
 * It comes from the server as a link to the services page and its script turns it into the
 * button of the panel: if the script is late or never loads, the click still leads there.
 * Tab moves through the links in order, Escape closes and returns focus to the button,
 * and it closes when focus or a click lands outside. The links of the panel are drawn when it
 * opens (spec 012, decision 20: closed, they weighed on every page); without script the same
 * links are in the footer, and this control leads to the services page.
 */
export function ServicesMenu({ label, lines, allServicesLabel, unsureLabel }: ServicesMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const panelId = useId();
  const hydrated = useHydrated();
  // Underlined, as in the mockups, while the visitor is anywhere inside the services section.
  const inSection = usePathname().startsWith("/servicios");

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    // Focus moved somewhere outside the button and the panel: close.
    if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }

  const close = () => setOpen(false);
  const toggle = () => setOpen((value) => !value);

  function onTriggerClick(event: ReactMouseEvent<HTMLAnchorElement>) {
    // With a modifier key it stays a link: open the services page in a new tab or window.
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    toggle();
  }
  // A button also answers to the space bar; a link does not.
  function onTriggerKeyDown(event: ReactKeyboardEvent<HTMLAnchorElement>) {
    if (event.key !== " ") return;
    event.preventDefault();
    toggle();
  }

  return (
    <div ref={rootRef} onBlur={onBlur}>
      <AppLink
        ref={buttonRef}
        href="/servicios"
        role={hydrated ? "button" : undefined}
        aria-expanded={hydrated ? open : undefined}
        aria-controls={hydrated ? panelId : undefined}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeyDown}
        className={`nav-trigger ${
          open || inSection ? "border-bronze" : "border-transparent"
        }`}
      >
        {label}
        <ChevronDownIcon size={14} className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </AppLink>

      {/* The panel is always there (the trigger names it), but what is inside is rendered only while
          it is open: closed, it was 3 KB of every document that nobody could see. */}
      <div id={panelId} hidden={!open} className="nav-panel">
        {open ? (
        <>
        <ul className="grid grid-cols-5">
          {lines.map((line) => (
            <li key={line.href} className="flex flex-col gap-2.5 border-r border-mist p-6 last:border-r-0">
              <span className="font-mono text-[0.6875rem] tracking-[0.1em] text-(--muted-text)">{line.numeral}</span>
              <AppLink
                href={line.href}
                onClick={close}
                className="flex min-h-11 items-center text-sm leading-[1.3] tracking-[0.1em] type-display transition-colors duration-150 hover:text-(--accent-text)"
              >
                {line.name}
              </AppLink>
              <p className="text-sm leading-normal text-(--muted-text)">{line.summary}</p>
              {line.subpages.length > 0 ? (
                <ul className="flex flex-col">
                  {line.subpages.map((subpage) => (
                    <li key={subpage.href}>
                      <AppLink
                        href={subpage.href}
                        onClick={close}
                        className="flex min-h-11 items-center text-sm transition-colors duration-150 hover:text-(--accent-text)"
                      >
                        {subpage.label}
                      </AppLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-ink px-6 py-2">
          <AppLink
            href="/servicios"
            onClick={close}
            className="inline-flex min-h-11 items-center gap-2.5 text-xs tracking-[0.14em] type-display transition-colors duration-150 hover:text-(--accent-text)"
          >
            {allServicesLabel}
            <ArrowRightIcon size={16} />
          </AppLink>
          <AppLink
            href="/contacto"
            onClick={close}
            className="inline-flex min-h-11 items-center text-[0.9375rem] transition-colors duration-150 hover:text-(--accent-text)"
          >
            {unsureLabel}
          </AppLink>
        </div>
        </>
        ) : null}
      </div>
    </div>
  );
}
