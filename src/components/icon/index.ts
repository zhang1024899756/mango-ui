import './styles/icon.scss'
import Icon from './Icon.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiIcon = withInstall(Icon, 'MyuiIcon')

export { ICONS, ICON_NAMES } from './icons'
export type { IconProps, IconSize, IconName } from './types'

export default MyuiIcon
