import './styles/slider.scss'
import Slider from './Slider.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiSlider = withInstall(Slider, 'MyuiSlider')

export type { SliderProps, SliderTone, SliderValue } from './types'

export default MyuiSlider
