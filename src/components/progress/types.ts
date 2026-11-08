export type ProgressType = 'line' | 'circle'
export type ProgressTone = 'accent' | 'ink' | 'success' | 'warning' | 'danger'
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
}
