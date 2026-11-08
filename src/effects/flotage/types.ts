export type FlotageAxis = 'y' | 'x' | 'rotate'
export type FlotageTrigger = 'auto' | 'hover'
/**
 * `system` (default) honours `prefers-reduced-motion`: on a machine that asks for
 * less motion the float is pinned. `always` animates anyway — intended for demos
 * and the docs site, never for production content.
 */
export type FlotageMotionPreference = 'system' | 'always'

export interface FlotageProps {
  /** Which way the content drifts. `rotate` tilts instead of travelling, which reads best on stamps and badges. */
  axis?: FlotageAxis
  /**
   * Travel in px — degrees on the `rotate` axis. It scales the whole composite,
   * not just the travel: 16 (the default) also gets ±0.8deg of sway, a sub-1%
   * scale breath and ~2px of cross drift, so the motion reads as a float rather
   * than a straight line. Raise it when the item has to be seen from across a page.
   */
  amplitude?: number
  /** One full there-and-back, in seconds. Longer is calmer. */
  duration?: number
  /** Seconds to wait before the first movement, so several floating items never march in step. */
  delay?: number
  /** `auto` floats forever; `hover` holds still until the pointer — or keyboard focus — arrives. */
  trigger?: FlotageTrigger
  /** Pins the wrapper. This stops the effect only; it does not disable anything inside it. */
  disabled?: boolean
  /**
   * Whether the system's "reduce motion" preference wins. Keep the default in
   * product code; switch to `always` only when the float itself is the content
   * being demonstrated (docs, Storybook, a sales page for the effect).
   */
  motionPreference?: FlotageMotionPreference
  /** Element rendered as the wrapper. Block-level tags stay block-level. */
  as?: string
}
