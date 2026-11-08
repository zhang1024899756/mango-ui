export type ImageFit = 'cover' | 'contain'
export type ImageRadius = 'none' | 'pill'

export interface ImageProps {
  /** Image URL. Without it the frame stays on the loading skeleton. */
  src?: string
  /** Empty means decorative — the same rule as a native `<img>`. */
  alt?: string
  /** Any `w:h` pair, e.g. `'16:9'`, `'1:1'`, `'4:3'`. The frame holds it while loading, so nothing jumps. */
  ratio?: string
  fit?: ImageFit
  radius?: ImageRadius
  /** The system's 2px ink rule around the frame. */
  border?: boolean
  /** `loading="lazy"` on the native image. */
  lazy?: boolean
  /** A line of copy under the frame, marked with an accent rule. */
  caption?: string
}
