import { Fragment } from "react";

type TitleLinesProps = {
  lines: readonly string[];
  /** Last line, in the accent color of the surface (bronze on ink). */
  accent?: string;
};

/**
 * Lines of a heading separated by <br>. Every title with line breaks goes through here so the
 * space before each break is never forgotten: readers that ignore <br> (textContent, some
 * crawlers) still get separate words instead of "diseñoy video".
 */
export function TitleLines({ lines, accent }: TitleLinesProps) {
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
