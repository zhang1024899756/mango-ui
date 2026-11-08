import './styles/text.scss'
import Text from './Text.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiText = withInstall(Text, 'MyuiText')

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
} from './types'

export default MyuiText
