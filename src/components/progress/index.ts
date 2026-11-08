import './styles/progress.scss'
import Progress from './Progress.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiProgress = withInstall(Progress, 'MyuiProgress')

export type { ProgressProps, ProgressType, ProgressTone, ProgressSize } from './types'

export default MyuiProgress
