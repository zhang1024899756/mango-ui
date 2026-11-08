import './styles/button.scss'
import Button from './Button.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiButton = withInstall(Button, 'MyuiButton')

export type {
  ButtonProps,
  ButtonVariant,
  ButtonTone,
  ButtonSize,
  ButtonShape,
  ButtonHtmlType,
} from './types'

export default MyuiButton
