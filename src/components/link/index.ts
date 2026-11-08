import './styles/link.scss'
import Link from './Link.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiLink = withInstall(Link, 'MyuiLink')

export type { LinkProps, LinkTone, LinkUnderline } from './types'

export default MyuiLink
