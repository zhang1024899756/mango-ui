<template>
<font-awesome-icon :class="[
  'mo-icon',
  theme? 'mo-icon-' + theme : ''
]" :icon="icon" :spin="spin" :size="size" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret)

type ThemeProps = PropType<'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark' | 'armygreen'>
type SizeProps = PropType<'lg' | 'xs' | 'sm' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x'>

export default defineComponent({
  name: 'MoIcon',
  components: { FontAwesomeIcon },
  props: {
    icon: {
      type: String,
      default: ''
    },
    size: {
      type: String as SizeProps,
      validator: (val: string) => ['lg', 'xs', 'sm', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x'].includes(val)
    },
    spin: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String as ThemeProps,
      validator: (val: string) => ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark', 'armygreen'].includes(val)
    }
  },
  setup (props, ctx) {
    const iconSize = computed(() => {
      return props.size
    })

    const iconTheme = computed(() => {
      return props.theme
    })

    return { iconSize, iconTheme }
  }
})
</script>
