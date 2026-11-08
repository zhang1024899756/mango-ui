import './styles/neon.scss'
import Neon from './Neon.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiNeon = withInstall(Neon, 'MyuiNeon')

export type { NeonProps, NeonMode, NeonSpeed } from './types'

export default MyuiNeon
