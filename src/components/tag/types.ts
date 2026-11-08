export type TagTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'ink'
export type TagVariant = 'solid' | 'outline' | 'ghost'
export type TagSize = 'sm' | 'md'
export type TagShape = 'rect' | 'pill'

export interface TagProps {
  /** Semantic colour. `accent` is reserved for "this is the hot thing". */
  tone?: TagTone
  /** Solid fills, outline competes, ghost sits quietly in a line of text. */
  variant?: TagVariant
  size?: TagSize
  shape?: TagShape
  /** Shows a remove button — a real button, never a clickable span. */
  closable?: boolean
  /** Selected/active state for filter tags. Exposed as data-active. */
  active?: boolean
}
