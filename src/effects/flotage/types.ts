export type FlotageAxis = 'y' | 'x' | 'rotate'
export type FlotageTrigger = 'auto' | 'hover'

export interface FlotageProps {
  /** Which way the content drifts. `rotate` tilts instead of travelling, which reads best on stamps and badges. */
  axis?: FlotageAxis
  /** Travel in px — degrees on the `rotate` axis. Scales with the content, so 8 suits a tag and 24 a card. */
  amplitude?: number
  /** One full there-and-back, in seconds. Longer is calmer. */
  duration?: number
  /** Seconds to wait before the first movement, so several floating items never march in step. */
  delay?: number
  /** `auto` floats forever; `hover` holds still until the pointer — or keyboard focus — arrives. */
  trigger?: FlotageTrigger
  /** Pins the wrapper. This stops the effect only; it does not disable anything inside it. */
  disabled?: boolean
  /** Element rendered as the wrapper. Block-level tags stay block-level. */
  as?: string
}
