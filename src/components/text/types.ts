/** The four typographic voices. A voice fixes family, size, weight, leading,
 * tracking and case — it is a complete setting of the type axis, not a colour. */
export type TextVariant = 'display' | 'eyebrow' | 'body' | 'mono'

/** Every step of the type scale in `tokens.scss`. */
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

export type TextWeight = 'regular' | 'medium' | 'bold' | 'black'

export type TextTone =
  | 'default'
  | 'soft'
  | 'faint'
  | 'accent'
  | 'signal'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

export type TextLeading = 'tight' | 'snug' | 'normal' | 'relaxed'

export type TextTracking = 'tight' | 'normal' | 'wide'

export type TextAlign = 'start' | 'center' | 'end'

export type TextTransform = 'none' | 'uppercase'

export interface TextProps {
  /** Which tag renders. `span` by default — pass `p`, `h2`, `label`, `code`… */
  as?: string
  /** The voice. `body` is the default: running copy, comfort first. */
  variant?: TextVariant
  /** A step of the type scale. Omitted, the variant's own step is used (`body` → `md`). */
  size?: TextSize
  /** Overrides the variant's weight. */
  weight?: TextWeight
  /** Semantic colour. `faint` is for secondary information only — never body copy. */
  tone?: TextTone
  /** Overrides the variant's leading. */
  leading?: TextLeading
  /** Overrides the variant's tracking. */
  tracking?: TextTracking
  align?: TextAlign
  /** Overrides the variant's case. `eyebrow` defaults to `uppercase`. */
  transform?: TextTransform
  /** Greater than zero: keep at most N lines, then ellipsis. */
  truncate?: number
  /** Neon tube: a static glow, visible without animation. */
  glow?: boolean
}
