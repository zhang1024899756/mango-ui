export type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'
export type InputSize = 'sm' | 'md' | 'lg'
export type InputVariant = 'box' | 'line'

export interface InputProps {
  /** The value. Always a string — `type="number"` stays a string too, cast it yourself. */
  modelValue?: string
  type?: InputType
  placeholder?: string
  size?: InputSize
  /** `box` is a hard-edged slab on the page, `line` is a rule the text sits on. */
  variant?: InputVariant
  disabled?: boolean
  readonly?: boolean
  /** Renders a real clear `<button>` once there is something to clear. */
  clearable?: boolean
  maxlength?: number
  /** Live character counter. Shows `used / maxlength` when `maxlength` is set. */
  showCount?: boolean
  /** Invalid look. `error` implies it. */
  invalid?: boolean
  /** Error text under the field. Also sets the invalid look and `aria-describedby`. */
  error?: string
  name?: string
  autocomplete?: string
}
