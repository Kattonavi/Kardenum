"use client";

import { type FormEvent, useId, useState, useSyncExternalStore } from "react";
import { buttonClass } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { QUOTE_LIMITS, type QuoteLabels, buildQuoteMessage, buildWhatsAppUrl, cleanDescription, cleanName, parseLineParam } from "@/lib/quote";

export type QuoteLine = { id: string; name: string; projectTypes: string[] };

type QuoteFormProps = {
  lines: QuoteLine[];
  deadlines: string[];
  defaultDeadline: string;
  /** "Todavía no lo tengo claro": last option of every line and the default. */
  unsure: string;
  /** International WhatsApp number, or null while it is pending in site.config.ts. */
  whatsappNumber: string | null;
  messageLabels: QuoteLabels;
  labels: {
    line: string;
    type: string;
    idea: string;
    ideaPlaceholder: string;
    deadline: string;
    name: string;
    namePlaceholder: string;
    submit: string;
    submitNote: string;
    pendingNote: string;
    previewRegion: string;
    previewLabel: string;
    previewName: string;
    previewIdea: string;
    previewNote: string;
  };
};

const fieldClass = "w-full min-h-12 rounded-none border border-graphite bg-white px-3.5 text-base text-ink";
const labelClass = "text-[13px] leading-[1.4] tracking-[0.1em] type-display";

// The address never changes while the form is on screen: nothing to subscribe to.
const subscribeToNothing = () => () => {};

/**
 * WhatsApp quote form (docs/specs/002-cotizador-whatsapp.md). It only builds a message and
 * opens the chat: nothing typed here is stored or sent anywhere else.
 */
export function QuoteForm({ lines, deadlines, defaultDeadline, unsure, whatsappNumber, messageLabels, labels }: QuoteFormProps) {
  const ids = { line: useId(), type: useId(), idea: useId(), deadline: useId(), name: useId(), note: useId() };

  // RF-8: `?linea=<id>` preselects a line. Read in the browser so the page stays static;
  // the server render uses the first line.
  const search = useSyncExternalStore(subscribeToNothing, () => window.location.search, () => "");
  const fromAddress = parseLineParam(
    new URLSearchParams(search).get("linea"),
    lines.map((line) => line.id),
  );

  const [chosenLine, setChosenLine] = useState<string | null>(null);
  const [chosenType, setChosenType] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(defaultDeadline);
  const [name, setName] = useState("");

  const line = lines.find((candidate) => candidate.id === (chosenLine ?? fromAddress)) ?? lines[0];
  if (!line) return null;
  const projectType = chosenType !== null && line.projectTypes.includes(chosenType) ? chosenType : unsure;

  // RF-2: the type belongs to a line, so choosing a line always goes back to "not sure yet".
  function chooseLine(id: string) {
    setChosenLine(id);
    setChosenType(null);
  }

  const cleanedName = cleanName(name);
  const cleanedDescription = cleanDescription(description);
  const message = buildQuoteMessage({ name, line: line.name, projectType, deadline, description }, messageLabels);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (whatsappNumber === null) return;
    window.open(buildWhatsAppUrl(whatsappNumber, message), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-wrap items-start gap-x-16 gap-y-12 border-t border-(--rule) pt-10">
      <form onSubmit={onSubmit} className="flex min-w-0 flex-[3_1_30rem] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor={ids.line} className={labelClass}>
            1 · {labels.line}
          </label>
          <select id={ids.line} name="linea" value={line.id} onChange={(event) => chooseLine(event.target.value)} className={fieldClass}>
            {lines.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={ids.type} className={labelClass}>
            2 · {labels.type}
          </label>
          <select
            id={ids.type}
            name="tipo"
            value={projectType}
            onChange={(event) => setChosenType(event.target.value)}
            className={fieldClass}
          >
            {[...line.projectTypes, unsure].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={ids.idea} className={labelClass}>
            3 · {labels.idea}
          </label>
          <textarea
            id={ids.idea}
            name="descripcion"
            rows={5}
            maxLength={QUOTE_LIMITS.description}
            placeholder={labels.ideaPlaceholder}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={`${fieldClass} min-h-35 resize-y py-3 leading-normal placeholder:text-graphite`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={ids.deadline} className={labelClass}>
            4 · {labels.deadline}
          </label>
          <select id={ids.deadline} name="plazo" value={deadline} onChange={(event) => setDeadline(event.target.value)} className={fieldClass}>
            {deadlines.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={ids.name} className={labelClass}>
            5 · {labels.name}
          </label>
          <input
            id={ids.name}
            name="nombre"
            type="text"
            autoComplete="name"
            maxLength={QUOTE_LIMITS.name}
            placeholder={labels.namePlaceholder}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={`${fieldClass} placeholder:text-graphite`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
          <button
            type="submit"
            aria-disabled={whatsappNumber === null ? "true" : undefined}
            aria-describedby={ids.note}
            className={`${buttonClass.dark} gap-2.5 ${whatsappNumber === null ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {labels.submit}
            <ArrowRightIcon size={16} />
          </button>
          <p id={ids.note} className="max-w-[22rem] text-sm leading-normal text-(--muted-text)">
            {labels.submitNote}
            {whatsappNumber === null ? <span className="mt-1 block type-label">[{labels.pendingNote}]</span> : null}
          </p>
        </div>
      </form>

      <aside aria-label={labels.previewRegion} className="flex min-w-0 flex-[2_1_20rem] flex-col gap-3">
        <p className="type-label text-(--muted-text)">{labels.previewLabel}</p>
        <div className="flex flex-col gap-2.5 p-7 font-mono text-[13px] leading-[1.7] surface-ink">
          <span>
            {messageLabels.greeting} {messageLabels.introduction.replace("{name}", cleanedName || `[${labels.previewName}]`)}
          </span>
          <span>
            <span className="text-(--muted-text)">{messageLabels.line}:</span> {line.name}
          </span>
          <span>
            <span className="text-(--muted-text)">{messageLabels.project}:</span> {projectType}
          </span>
          <span>
            <span className="text-(--muted-text)">{messageLabels.deadline}:</span> {deadline}
          </span>
          <span className={`border-t border-line pt-2 break-words whitespace-pre-wrap ${cleanedDescription ? "" : "text-(--muted-text)"}`}>
            {cleanedDescription || `[${labels.previewIdea}]`}
          </span>
        </div>
        <p className="text-[15px] leading-normal text-(--muted-text)">{labels.previewNote}</p>
      </aside>
    </div>
  );
}
