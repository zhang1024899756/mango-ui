import './styles/magic.scss'
import Magic from './Magic.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiMagic = withInstall(Magic, 'MyuiMagic')

export type { MagicProps, MagicMode, MagicSpeed } from './types'

export default MyuiMagic
