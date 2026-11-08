import './styles/flotage.scss'
import Flotage from './Flotage.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiFlotage = withInstall(Flotage, 'MyuiFlotage')

export type {
  FlotageProps,
  FlotageAxis,
  FlotageTrigger,
  FlotageMotionPreference,
} from './types'

export default MyuiFlotage
