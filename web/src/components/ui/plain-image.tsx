import { getImageProps, type StaticImageData } from "next/image";
import { preload } from "react-dom";

/** An imported image carries its own width and height; an address needs them written. */
type Source = { src: StaticImageData } | { src: string; width: number; height: number };

type PlainImageProps = Source & {
  /** Required: what the picture shows ("" only for a picture that is pure decoration). */
  alt: string;
  /** How wide the picture is drawn at each window width: the browser picks the file from it. */
  sizes: string;
  className?: string;
  /** The main picture of the page (the one that decides the largest paint): fetched first, never lazy. */
  priority?: boolean;
};

/**
 * Every picture of the site goes through here. The props come from Next's optimizer
 * (`getImageProps`: AVIF or WebP by what the browser accepts, one file per width in `srcset`,
 * `width` and `height` so the page does not jump), and only one thing is dropped: the inline
 * `style="color:transparent"` that next/image always writes. The content policy of the site is
 * style-src 'self', and that attribute is a violation in the browser.
 *
 * Lazy by default; `priority` marks the one picture that must arrive first: it is preloaded from
 * the head, fetched with high priority and never lazy.
 */
export function PlainImage({ alt, sizes, className, priority = false, ...source }: PlainImageProps) {
  const { props } = getImageProps({ ...source, alt, sizes, className });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- dropped on purpose (see above)
  const { style, loading, fetchPriority, ...image } = props;
  // What next/image does for its `preload`: a <link rel="preload"> in the head, so the browser asks
  // for the main picture before it reaches the <img> in the body. getImageProps does not write it.
  if (priority) preload(image.src, { as: "image", imageSrcSet: image.srcSet, imageSizes: image.sizes, fetchPriority: "high" });
  return (
    // eslint-disable-next-line @next/next/no-img-element -- the props come from next/image; only its inline style is dropped
    <img {...image} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} />
  );
}
