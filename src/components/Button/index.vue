<template>
  <button
    :class="[
      'mo-button',
      type ? 'mo-button--' + type : '',
      buttonSize ? 'mo-button--' + buttonSize : '',
      {
        'disabled': buttonDisabled,
        'loading': loading
      }
    ]"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    @click="handleClick"
  >
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>

<script lang='ts'>
import { computed, defineComponent } from 'vue'

import type { PropType } from 'vue'

type IButtonType = PropType<'primary' | 'success' | 'warning' | 'danger' | 'default' | 'border-1'>
type IButtonSize = PropType<'hg'|'lg'|'sm'|'mini'>
type IButtonNativeType = PropType<'button' | 'submit' | 'reset'>
type EmitFn = (evt: Event) => void

// interface ButtonProps {
//   type: string;
//   size: string;
//   nativeType: string;
//   loading: boolean;
//   disabled: boolean;
//   autofocus: boolean;
// }
export default defineComponent({
  name: 'MoButton',
  props: {
    type: {
      type: String as IButtonType,
      default: 'default',
      validator: (val: string) => {
        return ['default', 'primary', 'success', 'warning', 'danger', 'border-1'].includes(val)
      }
    },
    size: {
      type: String as IButtonSize,
      validator: (val: string) => ['hg', 'lg', 'sm', 'mini'].includes(val)
    },
    nativeType: {
      type: String as IButtonNativeType,
      default: 'button',
      validator: (val: string) => {
        return ['button', 'submit', 'reset'].includes(val)
      }
    },
    loading: Boolean,
    disabled: Boolean,
    autofocus: Boolean
  },
  emits: ['click'],
  setup (props, ctx) {
    const buttonSize = computed(() => {
      return props.size
    })

    const buttonDisabled = computed(() => {
      return props.disabled
    })

    // methods
    const handleClick = (evt: any) => {
      ctx.emit('click', evt)
    }
    return { buttonSize, buttonDisabled, handleClick }
  }
})
</script>
