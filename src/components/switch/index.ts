import './styles/switch.scss'
import Switch from './Switch.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiSwitch = withInstall(Switch, 'MyuiSwitch')

export type { SwitchProps, SwitchSize, SwitchValue } from './types'

export default MyuiSwitch
