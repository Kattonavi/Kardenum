"use client";

import { type FocusEvent, useEffect, useId, useRef, useState } from "react";
import { AppLink } from "@/components/ui/app-link";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/ui/icons";
import type { NavLine } from "./nav-data";

type ServicesMenuProps = {
  label: string;
  lines: NavLine[];
  allServicesLabel: string;
  unsureLabel: string;
};

/**
 * "Servicios" in the desktop menu: a disclosure (button + panel), not an ARIA menu.
 * Tab moves through the links in order, Escape closes and returns focus to the button,
 * and it closes when focus or a click lands outside. The panel is in the HTML even when
 * closed, so its links are there without JavaScript-rendered content.
 */
export function ServicesMenu({ label, lines, allServicesLabel, unsureLabel }: ServicesMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

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

  return (
    <div ref={rootRef} onBlur={onBlur}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex min-h-11 cursor-pointer items-center gap-2 border-b-2 text-[15px] transition-colors duration-150 hover:text-(--accent-text) ${
          open ? "border-bronze" : "border-transparent"
        }`}
      >
        {label}
        <ChevronDownIcon size={14} className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      <div id={panelId} hidden={!open} className="absolute inset-x-0 top-full z-40 border border-ink surface-stone">
        <ul className="grid grid-cols-5">
          {lines.map((line) => (
            <li key={line.href} className="flex flex-col gap-2.5 border-r border-mist p-6 last:border-r-0">
              <span className="font-mono text-[11px] tracking-[0.1em] text-(--muted-text)">{line.numeral}</span>
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
            className="inline-flex min-h-11 items-center text-[15px] transition-colors duration-150 hover:text-(--accent-text)"
          >
            {unsureLabel}
          </AppLink>
        </div>
      </div>
    </div>
  );
}
