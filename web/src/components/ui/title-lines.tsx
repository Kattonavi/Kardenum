import { Fragment, type ReactNode } from "react";

type TitleLinesProps = {
  lines: readonly string[];
  /** Last line, in the accent color of the surface (bronze on ink). */
  accent?: string;
  /**
   * The same words in the lines the title takes next to a scene on a wide window (spec 013,
   * RF-21). Below that width the title breaks as `lines` and `accent` say.
   */
  beside?: readonly string[];
};

const wordsOf = (text: string) => text.split(" ").filter(Boolean);

/** After which word each line ends (the last line ends the title and is left out). */
function breaksOf(lines: readonly string[]): Set<number> {
  const breaks = new Set<number>();
  let count = 0;
  for (const line of lines.slice(0, -1)) {
    count += wordsOf(line).length;
    breaks.add(count);
  }
  return breaks;
}

/**
 * Lines of a heading separated by <br>. Every title with line breaks goes through here so the
 * space before each break is never forgotten: readers that ignore <br> (textContent, some
 * crawlers) still get separate words instead of "diseñoy video".
 *
 * With `beside` the title has two sets of breaks over the same words, one for each layout of the
 * first screen. A break that belongs to one layout only is a <br> hidden in the other one.
 */
export function TitleLines({ lines, accent, beside }: TitleLinesProps) {
  if (!beside) {
    return (
      <>
        {lines.map((line, index) => (
          <Fragment key={line}>
            {line}
            {index < lines.length - 1 || accent ? (
              <>
                {" "}
                <br />
              </>
            ) : null}
          </Fragment>
        ))}
        {accent ? <span className="text-(--accent-text)">{accent}</span> : null}
      </>
    );
  }

  const stacked = accent ? [...lines, accent] : lines;
  const words = stacked.flatMap(wordsOf);
  if (beside.flatMap(wordsOf).join(" ") !== words.join(" ")) throw new Error(`The title beside the scene must have the words of the title: "${beside.join(" / ")}"`);
  const narrow = breaksOf(stacked);
  const wide = breaksOf(beside);
  const accentStart = accent ? words.length - wordsOf(accent).length : words.length;

  /** The words from one index to another, with the breaks that fall inside or right after them. */
  const run = (from: number, to: number): ReactNode[] =>
    words.slice(from, to).map((word, offset) => {
      const position = from + offset + 1;
      const last = position === words.length;
      const breakClass = narrow.has(position) && wide.has(position) ? "" : narrow.has(position) ? "hero:hidden" : wide.has(position) ? "max-hero:hidden" : null;
      return (
        <Fragment key={position}>
          {word}
          {last ? null : " "}
          {breakClass === null ? null : <br className={breakClass || undefined} />}
        </Fragment>
      );
    });

  return (
    <>
      {run(0, accentStart)}
      {accent ? <span className="text-(--accent-text)">{run(accentStart, words.length)}</span> : null}
    </>
  );
}
