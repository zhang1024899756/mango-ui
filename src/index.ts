/* =============================================================================
 * Mango UI — public entry
 * -----------------------------------------------------------------------------
 * 1. Global CSS (tokens + reset) is imported exactly once, here.
 * 2. Every component is importable on its own for tree-shaken usage.
 * 3. `app.use(MangoUI)` registers the whole set.
 * ========================================================================== */
import type { App, Plugin } from 'vue'

import './styles/index.scss'

import { MyuiButton } from './components/button'
import { MyuiDialog } from './components/dialog'
import { MyuiIcon } from './components/icon'
import { MyuiImage } from './components/image'
import { MyuiInput } from './components/input'
import { MyuiLink } from './components/link'
import { MyuiNumber } from './components/number'
import { MyuiProgress } from './components/progress'
import { MyuiSlider } from './components/slider'
import { MyuiSwitch } from './components/switch'
import { MyuiTag } from './components/tag'
import { MyuiText } from './components/text'
import { MyuiFlotage } from './effects/flotage'
import { MyuiNeon } from './effects/neon'

export const version = '2.1.0'

const components: Plugin[] = [
  // effects — wrap anything, add attitude
  MyuiNeon,
  MyuiFlotage,
  // elements
  MyuiButton,
  MyuiIcon,
  MyuiLink,
  MyuiImage,
  MyuiNumber,
  MyuiText,
  MyuiTag,
  MyuiInput,
  MyuiSwitch,
  MyuiSlider,
  MyuiDialog,
  MyuiProgress,
]

export const MangoUI: Plugin = {
  install(app: App): void {
    for (const component of components) {
      app.use(component)
    }
  },
}

export {
  MyuiButton,
  MyuiDialog,
  MyuiIcon,
  MyuiImage,
  MyuiInput,
  MyuiLink,
  MyuiNumber,
  MyuiProgress,
  MyuiSlider,
  MyuiSwitch,
  MyuiTag,
  MyuiText,
  MyuiFlotage,
  MyuiNeon,
}

export { ICONS, ICON_NAMES } from './components/icon'

export type {
  ButtonProps,
  ButtonVariant,
  ButtonTone,
  ButtonSize,
  ButtonShape,
  ButtonHtmlType,
} from './components/button'

export type { DialogProps } from './components/dialog'

export type { IconProps, IconSize, IconName } from './components/icon'

export type { ImageProps, ImageFit, ImageRadius } from './components/image'

export type { InputProps, InputType, InputSize, InputVariant } from './components/input'

export type { LinkProps, LinkTone, LinkUnderline } from './components/link'

export type { NumberProps, NumberTrend, NumberSize, NumberTone } from './components/number'

export type { ProgressProps, ProgressType, ProgressTone, ProgressSize } from './components/progress'

export type { SliderProps, SliderTone, SliderValue } from './components/slider'

export type { SwitchProps, SwitchSize, SwitchValue } from './components/switch'

export type { TagProps, TagTone, TagVariant, TagSize, TagShape } from './components/tag'

export type {
  TextProps,
  TextVariant,
  TextSize,
  TextWeight,
  TextTone,
  TextLeading,
  TextTracking,
  TextAlign,
  TextTransform,
} from './components/text'

export type {
  FlotageProps,
  FlotageAxis,
  FlotageTrigger,
  FlotageMotionPreference,
} from './effects/flotage'

export type { NeonProps, NeonMode, NeonSpeed } from './effects/neon'

export default MangoUI
