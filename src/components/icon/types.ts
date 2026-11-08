import type { IconName } from './icons'

export type IconSize = 'sm' | 'md' | 'lg'

export interface IconProps {
  /** A built-in glyph. Omit it and use the default slot for custom SVG. */
  name?: IconName
  size?: IconSize
  /** Any CSS colour. `currentColor` makes the icon inherit its context. */
  color?: string
  /** Continuous rotation — loading and refresh affordances. */
  spin?: boolean
  /** Stroke weight in the 24×24 view box. Every glyph keeps this value. */
  strokeWidth?: number
}

export type { IconName }
