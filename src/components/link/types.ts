export type LinkTone = 'ink' | 'accent' | 'muted'
export type LinkUnderline = 'always' | 'hover' | 'none'

export interface LinkProps {
  /** Where the link goes. Without it the anchor is inert but still focusable-shaped. */
  href?: string
  /** Colour of the text. `accent` is reserved for links that leave the page. */
  tone?: LinkTone
  /** `hover` reserves the underline space so the line never shifts the layout. */
  underline?: LinkUnderline
  /**
   * Leaves the site: `target="_blank"` and `rel="noreferrer noopener"` are
   * applied automatically and a trailing arrow glyph is appended.
   * Absolute `http(s)://` and `//host` hrefs are treated as external too.
   */
  external?: boolean
  /** Blocks navigation and click events, and reports `aria-disabled`. */
  disabled?: boolean
  /** Overrides the automatic `_blank`. */
  target?: string
  /** Overrides the automatic `noreferrer noopener`. */
  rel?: string
}
