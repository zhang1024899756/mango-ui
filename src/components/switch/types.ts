export type SwitchSize = 'sm' | 'md'
export type SwitchValue = boolean | string | number
/** Colour of the on-state track: the flat action colour, or the spectrum form. */
export type SwitchTone = 'accent' | 'spectrum'

export interface SwitchProps {
  /** Current value, compared against `activeValue` with `===`. */
  modelValue?: SwitchValue
  /** Value emitted when it turns on. */
  activeValue?: unknown
  /** Value emitted when it turns off. */
  inactiveValue?: unknown
  size?: SwitchSize
  disabled?: boolean
  loading?: boolean
  /** Text shown while on. Doubles as the switch's accessible name. */
  activeText?: string
  /** Text shown while off. Doubles as the switch's accessible name. */
  inactiveText?: string
  /** Sheared parallelogram instead of the pill. Additive: combine with any tone. */
  skew?: boolean
  /** What the on-state track claims: the action colour, or the gradient. */
  tone?: SwitchTone
}
