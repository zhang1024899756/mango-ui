export type SliderTone = 'accent' | 'ink' | 'spectrum'
/** A single value, or a `[lower, upper]` pair for a two-thumb range. */
export type SliderValue = number | [number, number]

export interface SliderProps {
  /** Single number, or `[lower, upper]` to turn the slider into a range. */
  modelValue?: SliderValue
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  /** Vertical orientation. Give the component a height yourself. */
  vertical?: boolean
  /** Value bubble above the thumb. */
  showTooltip?: boolean
  /** Ticks and labels keyed by value, e.g. `{ 0: '冷', 100: '烫' }`. */
  marks?: Record<number, string>
  /** Which colour the filled part claims. */
  tone?: SliderTone
  /** Sheared square handles. The track deliberately stays horizontal. */
  skew?: boolean
}
