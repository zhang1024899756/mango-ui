export type NeonMode = 'glow' | 'flicker' | 'scan'
export type NeonSpeed = 'slow' | 'normal' | 'fast'

export interface NeonProps {
  /**
   * Which behaviour runs *on top of* the resting glow. `glow` keeps the tube lit
   * and lets it breathe, `flicker` drops it out on a bad contact, `scan` sweeps a
   * beam across it. The glow itself is not a mode — every mode has it.
   */
  mode?: NeonMode
  /** Cycle length. Pair `fast` with a high intensity only when the content really is an alarm. */
  speed?: NeonSpeed
  /** Turn the tube off without unmounting the wrapper — no glow, no animation, no beam. */
  active?: boolean
  /**
   * 0 → 1. Scales every glow radius, so `0` is a genuinely unlit tube rather than
   * a dim one. Clamped, `NaN` falls back to the default; never trusted raw.
   */
  intensity?: number
  /** Colour of the tube. Defaults to the system accent token. */
  colorA?: string
  /** Colour of the outer fog. Defaults to the info token. */
  colorB?: string
  /** Text mode: renders this string as a lit tube with stacked text shadows. `text` wins over the slot. */
  text?: string
  /** Element rendered as the wrapper. Block-level tags stay block-level. */
  as?: string
}
