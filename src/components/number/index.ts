import './styles/number.scss'
import Number from './Number.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiNumber = withInstall(Number, 'MyuiNumber')

export type { NumberProps, NumberTrend, NumberSize, NumberTone } from './types'

export default MyuiNumber
