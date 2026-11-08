export type ProgressType = 'line' | 'circle'
/**
 * `spectrum` paints the indicator with --myui-gradient-spectrum. On the bar it is
 * the fill; on the ring it is a real SVG <linearGradient> (a CSS gradient cannot
 * be clipped to a stroke), which is why the ring keeps its geometry when skewed.
 */
export type ProgressTone = 'accent' | 'ink' | 'success' | 'warning' | 'danger' | 'spectrum'
export type ProgressSize = 'sm' | 'md' | 'lg'

export interface ProgressProps {
  /** Completion 0–100. Out-of-range and NaN are clamped, never rendered raw. */
  percent?: number
  /** Bar or ring. The ring is drawn with SVG stroke-dasharray. */
  type?: ProgressType
  tone?: ProgressTone
  size?: ProgressSize
  /** Percentage label next to (or inside) the indicator. */
  showText?: boolean
  /** Unknown-duration progress: sweeping stripe instead of a fixed fill. */
  indeterminate?: boolean
  /** Accessible name for the progressbar. */
  label?: string
  /**
   * Diagonal form. The bar shears; the ring ignores it on purpose — a sheared
   * SVG stroke turns into a wobbling ellipse, and a percentage ring is a
   * measuring device before it is a poster.
   */
  skew?: boolean
}
