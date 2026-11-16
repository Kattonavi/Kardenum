import type { MDXComponents } from "mdx/types";
import type { StaticImageData } from "next/image";
import { PlainImage } from "@/components/ui/plain-image";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * What the body of a guide can use (maqueta B-Guia-plantilla, spec 006, RF-3), besides
 * paragraphs, lists, links and emphasis:
 *   <Section n={1}>…</Section>      a numbered section; its title comes from meta.ts
 *   <Needs>- …</Needs>               "Qué necesitas", a list
 *   <Screenshot src={shot} caption="…" />   an image imported in the .mdx file, with its description
 *   ```lang … ```                    a code block
 *   <Note>…</Note>                   a short tip or warning
 *   | a | b |                        a table (remark-gfm), aligned per column
 * Nothing here writes an inline style (the content policy is style-src 'self'). A long code
 * block or a wide table scrolls inside its own box, which can be focused and says what it is.
 */

export type GuideTexts = {
  readonly sectionId: string;
  readonly needs: string;
  readonly note: string;
  readonly code: string;
  readonly table: string;
};

type GuideComponentsOptions = {
  /** Titles of the sections in the language of the page, from meta.ts. */
  readonly sections: readonly string[];
  readonly texts: GuideTexts;
};

const labelClass = "font-mono text-[0.6875rem] tracking-[0.14em] uppercase";

/** id of a section ("paso-1"), the target of its link in "En esta guía". */
export function sectionAnchor(sectionId: string, n: number): string {
  return `${sectionId}-${n}`;
}

export function sectionNumber(n: number): string {
  return String(n).padStart(2, "0");
}

const ALIGN_CLASS: Readonly<Record<string, string>> = { left: "text-left", center: "text-center", right: "text-right" };

/** The alignment of a column (remark-gfm writes it as `align`, see next.config.ts) as a class; the obsolete attribute is not written. */
function alignClass(align: unknown): string {
  return typeof align === "string" ? (ALIGN_CLASS[align] ?? "text-left") : "text-left";
}

export function guideComponents({ sections, texts }: GuideComponentsOptions): MDXComponents {
  function Section({ n, children }: { n: number; children: ReactNode }) {
    const title = sections[n];
    if (title === undefined) throw new Error(`<Section n={${n}}> has no title in meta.ts (it has ${sections.length} sections).`);
    const id = sectionAnchor(texts.sectionId, n);
    return (
      <section
        aria-labelledby={id}
        className="flex scroll-mt-6 flex-col gap-5 [&>ol]:flex [&>ol]:list-decimal [&>ol]:flex-col [&>ol]:gap-2 [&>ol]:pl-5 [&>ol]:text-[1.0625rem] [&>ol]:leading-[1.7] [&>p+p]:text-(--muted-text) [&>ul]:flex [&>ul]:list-[square] [&>ul]:flex-col [&>ul]:gap-2 [&>ul]:pl-5 [&>ul]:text-[1.0625rem] [&>ul]:leading-[1.7] [&>ul]:marker:text-bronze"
      >
        <h2 id={id} className="text-[clamp(1.25rem,2.2vw,1.625rem)] leading-[1.25] tracking-[0.02em] type-display">
          <span className="font-mono text-[0.75em] tracking-[0.1em] text-(--muted-text)">{sectionNumber(n)} · </span>
          {title}
        </h2>
        {children}
      </section>
    );
  }

  function Needs({ children }: { children: ReactNode }) {
    return (
      <div className="flex flex-col gap-3.5 border border-ink p-6 [&_li]:flex [&_li]:items-baseline [&_li]:gap-3.5 [&_li]:leading-normal [&_li]:before:size-2 [&_li]:before:shrink-0 [&_li]:before:bg-bronze [&_li]:before:content-[''] [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2.5">
        <span className={labelClass}>{texts.needs}</span>
        {children}
      </div>
    );
  }

  function Screenshot({ src, caption }: { src: StaticImageData; caption: string }) {
    return (
      <figure className="flex flex-col gap-2.5">
        <PlainImage src={src} alt={caption} sizes="(min-width: 75rem) 46rem, 100vw" className="h-auto w-full border border-mist" />
        <figcaption className="text-sm leading-normal text-(--muted-text)">{caption}</figcaption>
      </figure>
    );
  }

  function Note({ children }: { children: ReactNode }) {
    return (
      <div className="flex flex-col gap-2 border border-mist bg-white px-6 py-5 [&_p]:text-base [&_p]:leading-[1.6] [&_p]:text-(--muted-text)">
        <span className={labelClass}>{texts.note}</span>
        {children}
      </div>
    );
  }

  return {
    Section,
    Needs,
    Screenshot,
    Note,
    p: (props: ComponentPropsWithoutRef<"p">) => <p className="text-[1.0625rem] leading-[1.7]" {...props} />,
    h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
      <h3 className="text-lg leading-[1.3] type-wide" {...props}>
        {children}
      </h3>
    ),
    // The padding grows the area that answers to a tap (44 px) without changing the line.
    a: ({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) => (
      <a
        href={href}
        {...(href.startsWith("http") ? { rel: "noopener noreferrer" } : {})}
        className="py-3.5 underline decoration-1 underline-offset-[0.2em] transition-colors duration-150 hover:text-(--accent-text)"
        {...props}
      >
        {children}
      </a>
    ),
    code: (props: ComponentPropsWithoutRef<"code">) => <code className="bg-[#e4e3dd] px-1 font-mono text-[0.9em] [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-[1em]" {...props} />,
    pre: (props: ComponentPropsWithoutRef<"pre">) => (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a box that scrolls must be reachable with the keyboard (WCAG 2.1.1)
      <pre role="group" tabIndex={0} aria-label={texts.code} className="overflow-x-auto bg-ink p-6 font-mono text-[0.8125rem] leading-[1.7] text-stone" {...props} />
    ),
    table: (props: ComponentPropsWithoutRef<"table">) => (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a box that scrolls must be reachable with the keyboard (WCAG 2.1.1)
      <div role="group" tabIndex={0} aria-label={texts.table} className="overflow-x-auto">
        <table className="w-full border-collapse border-t border-ink text-[0.9375rem] leading-normal" {...props} />
      </div>
    ),
    th: ({ align, ...props }: ComponentPropsWithoutRef<"th">) => (
      <th className={`border-b border-ink py-3 pr-6 align-bottom font-mono text-[0.6875rem] font-medium tracking-[0.14em] whitespace-nowrap uppercase last:pr-0 ${alignClass(align)}`} {...props} />
    ),
    td: ({ align, ...props }: ComponentPropsWithoutRef<"td">) => <td className={`border-b border-mist py-3 pr-6 align-top last:pr-0 ${alignClass(align)}`} {...props} />,
    img: () => {
      throw new Error("A guide shows its images with <Screenshot src={…} caption=\"…\" />: an imported image has its width and height.");
    },
  };
}
