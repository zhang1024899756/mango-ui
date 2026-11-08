export type NumberTrend = 'up' | 'down' | 'flat' | 'auto'
export type NumberSize = 'sm' | 'md' | 'lg' | 'xl'
export type NumberTone = 'ink' | 'accent' | 'success' | 'danger'

export interface NumberProps {
  /** The number. Required — a display of nothing is a layout bug. */
  value: number
  /** Decimal places, always rendered (so `12.5` at precision 3 reads `12.500`). */
  precision?: number
  /** Group thousands: `1234567` reads `1,234,567`. */
  separator?: boolean
  prefix?: string
  suffix?: string
  /** `auto` derives the arrow from the previous value. Omit for no indicator at all. */
  trend?: NumberTrend
  /** Count up from zero on mount and slide to the next value on change. */
  animated?: boolean
  /** Count-up length in milliseconds. */
  duration?: number
  size?: NumberSize
  tone?: NumberTone
}
