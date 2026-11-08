export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'text'
/**
 * `spectrum` is the multi-colour form: the fill becomes --myui-gradient-spectrum
 * and the label turns to accent-ink, which clears AA on every stop in both
 * themes. It is a form, not a semantic state — never use it for danger.
 */
export type ButtonTone = 'accent' | 'ink' | 'neutral' | 'danger' | 'spectrum'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonShape = 'rect' | 'pill'
export type ButtonHtmlType = 'button' | 'submit' | 'reset'

export interface ButtonProps {
  /** Visual weight. `solid` is the call-to-action, `outline` the equal-weight alternative. */
  variant?: ButtonVariant
  /** Which colour the button claims. `accent` is the one hot colour of the system. */
  tone?: ButtonTone
  size?: ButtonSize
  /** Square (default, poster-like) or pill. */
  shape?: ButtonShape
  /**
   * Diagonal form: the whole control shears by --myui-skew-angle. The label
   * leans with it — the shape is the point here, not a frame around upright
   * text; `myui-shear-upright` exists for callers that want the other trade.
   */
  skew?: boolean
  /** Which element renders. `a` is implied whenever `href` is present. */
  tag?: 'button' | 'a'
  /** Renders an anchor instead of a button. */
  href?: string
  target?: string
  rel?: string
  htmlType?: ButtonHtmlType
  /** Fill the parent width. */
  block?: boolean
  /** The hard offset shadow — the signature of this system. Off for inline use. */
  shadow?: boolean
  disabled?: boolean
  loading?: boolean
  /** Equal width and height, for icon-only buttons. */
  iconOnly?: boolean
}
