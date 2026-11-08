/** `spectrum` is the multi-colour form: gradient fill, or gradient glyphs on the
 *  outline/ghost variants. It is a form, never a semantic state. */
export type TagTone =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'ink'
  | 'spectrum'
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
  /** Diagonal form: the stamp shears by --myui-skew-angle, glyphs included. */
  skew?: boolean
  /** Shows a remove button — a real button, never a clickable span. */
  closable?: boolean
  /** Selected/active state for filter tags. Exposed as data-active. */
  active?: boolean
}
