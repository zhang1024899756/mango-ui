import './styles/dialog.scss'
import Dialog from './Dialog.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiDialog = withInstall(Dialog, 'MyuiDialog')

export type { DialogProps } from './types'

export default MyuiDialog
