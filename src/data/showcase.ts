/** Built-in showcase routes. Visibility is controlled in admin via D1. */
export const showcaseSlugs = ["merge-pdf", "split-pdf"] as const;

export type ShowcaseSlug = (typeof showcaseSlugs)[number];

export function isShowcaseSlug(value: string): value is ShowcaseSlug {
  return (showcaseSlugs as readonly string[]).includes(value);
}
