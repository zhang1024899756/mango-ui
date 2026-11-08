import './styles/input.scss'
import Input from './Input.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiInput = withInstall(Input, 'MyuiInput')

export type { InputProps, InputType, InputSize, InputVariant } from './types'

export default MyuiInput
