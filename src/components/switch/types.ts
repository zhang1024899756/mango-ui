export type SwitchSize = 'sm' | 'md'
export type SwitchValue = boolean | string | number

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
}
