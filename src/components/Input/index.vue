<template>
  <div :class="[
    type === 'textarea' ? 'mo-textarea' : 'mo-input',
    inputSize ? 'mo-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled
    },
    $attrs.class
  ]"
  :style="$attrs.style"
  @mouseenter="onMouseEnter"
  @mouseleave="onMouseLeave">
    <template v-if="type !== 'textarea'"></template>
    <textarea v-else
      ref="textarea"
      class="mo-textarea__inner"
      v-bind="attrs"
    ></textarea>
  </div>
</template>

<script lang='ts'>
import {
  defineComponent,
  // inject,
  // computed,
  // watch,
  // nextTick,
  // getCurrentInstance,
  // shallowRef,
  // onMounted,
  // onUpdated,
  ref
} from 'vue'
import type { PropType } from 'vue'
import useAttrs from '@/hooks/use-attrs'
export default defineComponent({
  name: 'MoInput',
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: 'text'
    },
    size: {
      type: String as PropType<'' | 'large' | 'medium' | 'small' | 'mini'>,
      validator: (val: string) => ['', 'large', 'medium', 'small', 'mini'].includes(val)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup (props, ctx) {
    const hovering = ref(false)
    const attrs = useAttrs(true)

    const onMouseEnter = (e: unknown) => {
      hovering.value = true
      ctx.emit('mouseenter', e)
    }

    const onMouseLeave = (e: unknown) => {
      hovering.value = false
      ctx.emit('mouseleave', e)
    }

    return { onMouseEnter, onMouseLeave, attrs }
  }
})
</script>
<style lang='scss' scoped>
</style>
