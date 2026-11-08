export type MagicMode = 'glitch' | 'scan' | 'flicker'
export type MagicSpeed = 'slow' | 'normal' | 'fast'

export interface MagicProps {
  /** Which effect runs. `glitch` splits content into two colour channels, `scan` sweeps a beam across it, `flicker` pulses it like failing neon. */
  mode?: MagicMode
  /** Cycle length. Pair a fast cycle with a high intensity only when the content really is an alarm. */
  speed?: MagicSpeed
  /** Pause the effect without unmounting the wrapper — content falls back to its resting state. */
  active?: boolean
  /** 0 → 1. Scales channel split, jitter distance and beam strength. Clamped, never trusted raw. */
  intensity?: number
  /** Colour of the first (left/top) channel. Defaults to the system accent token. */
  colorA?: string
  /** Colour of the second (right/bottom) channel. Defaults to the info token. */
  colorB?: string
  /** Text mode: renders this string instead of the slot, which is the only way to duplicate glyphs for the split. `text` wins over the slot. */
  text?: string
  /** Element rendered as the wrapper. Block-level tags stay block-level. */
  as?: string
}
