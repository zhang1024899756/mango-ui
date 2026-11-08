import './styles/image.scss'
import Image from './Image.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiImage = withInstall(Image, 'MyuiImage')

export type { ImageProps, ImageFit, ImageRadius } from './types'

export default MyuiImage
