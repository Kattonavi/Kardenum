import type { MDXComponents } from "mdx/types";

// Required by @next/mdx. The components of a guide depend on its language and its sections, so
// the guide page passes them to the body (src/components/guides/guide-mdx.tsx); none is global.
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
