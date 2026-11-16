import { getImageProps, type StaticImageData } from "next/image";

type PlainImageProps = {
  src: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
  /** The largest picture of the page: requested early. */
  preload?: boolean;
};

/**
 * An imported image, with the width and height Next reads from the file, without the inline
 * style next/image always writes (`style="color:transparent"`): the content policy of the site
 * is style-src 'self', and that attribute is reported as a violation in the browser.
 */
export function PlainImage({ src, alt, sizes, className, preload = false }: PlainImageProps) {
  const { props } = getImageProps({ src, alt, sizes, className, ...(preload ? { preload: true } : { loading: "lazy" as const }) });
  // eslint-disable-next-line @next/next/no-img-element -- the props come from next/image; only its inline style is dropped
  return <img {...props} alt={alt} style={undefined} />;
}
