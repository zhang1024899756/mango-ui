import './styles/tag.scss'
import Tag from './Tag.vue'
import { withInstall } from '../../utils/with-install'

export const MyuiTag = withInstall(Tag, 'MyuiTag')

export type { TagProps, TagTone, TagVariant, TagSize, TagShape } from './types'

export default MyuiTag
