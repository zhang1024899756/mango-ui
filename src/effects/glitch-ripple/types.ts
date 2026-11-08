export type GlitchRippleIntensity = 'subtle' | 'normal' | 'intense'
export type GlitchRippleSpeed = 'slow' | 'normal' | 'fast'
/**
 * `auto` ripples continuously; `hover` keeps the content clean until the pointer —
 * or keyboard focus — arrives in the wrapper.
 */
export type GlitchRippleTrigger = 'auto' | 'hover'
/**
 * `system` (default) honours `prefers-reduced-motion`: the field freezes into a
 * still-warped frame, so a screenshot (or a machine with animations off) still
 * reads as a broken signal instead of as plain content. `always` animates anyway —
 * demos, Storybook, the docs site.
 */
export type GlitchRippleMotionPreference = 'system' | 'always'

export interface GlitchRippleProps {
  /** How far the field displaces the pixels. Scales with the wrapper's own size. */
  intensity?: GlitchRippleIntensity
  /** How fast the band pattern travels. Separate from intensity: speed is rhythm, intensity is force. */
  speed?: GlitchRippleSpeed
  /** `auto` runs forever, `hover` waits for the pointer or keyboard focus. */
  trigger?: GlitchRippleTrigger
  /** Kill switch. `false` paints the content undistorted and stops the loop. */
  active?: boolean
  /**
   * Whether the system's "reduce motion" preference wins. Keep the default in
   * product code; switch to `always` only when the effect itself is the content
   * being demonstrated.
   */
  motionPreference?: GlitchRippleMotionPreference
  /** Text mode: renders this string instead of the default slot. */
  text?: string
  /** Element rendered as the wrapper. Block-level tags stay block-level. */
  as?: string
}
