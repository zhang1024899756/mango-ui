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
    <span v-if="!loading&&$slots.default"><slot></slot></span>
    <font-awesome-icon v-else icon="spinner" spin />
  </button>
</template>

<script lang='ts'>
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

type IButtonType = PropType<'primary' | 'success' | 'warning' | 'danger' | 'default' | 'line' | 'line-right-dwon' | 'line-around'>
type IButtonSize = PropType<'hg'|'lg'|'sm'|'mini'>
type IButtonNativeType = PropType<'button' | 'submit' | 'reset'>
type EmitFn = (evt: Event) => void

export default defineComponent({
  name: 'MoButton',
  components: { FontAwesomeIcon },
  props: {
    type: {
      type: String as IButtonType,
      default: 'default',
      validator: (val: string) => {
        return ['default', 'primary', 'success', 'warning', 'danger', 'line', 'line-right-dwon', 'line-around'].includes(val)
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
