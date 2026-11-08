import './styles/glitch-ripple.scss'
import GlitchRipple from './GlitchRipple.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiGlitchRipple = withInstall(GlitchRipple, 'MyuiGlitchRipple')

export type {
  GlitchRippleProps,
  GlitchRippleIntensity,
  GlitchRippleSpeed,
  GlitchRippleTrigger,
  GlitchRippleMotionPreference,
} from './types'

export default MyuiGlitchRipple
