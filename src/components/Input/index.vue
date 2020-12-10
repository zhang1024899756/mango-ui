<template>
  <div :class="[
    type === 'textarea' ? 'mo-textarea' : 'mo-input',
    inputSize ? 'mo-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'mo-input--suffix':  showPassword
    },
    $attrs.class
  ]"
  :style="$attrs.style"
  @mouseenter="onMouseEnter"
  @mouseleave="onMouseLeave">
    <template v-if="type !== 'textarea'">
      <!-- 前置元素slot -->
      <div v-if="$slots.prepend" class="mo-input-group__prepend">
        <slot name="prepend"></slot>
      </div>
      <!-- input -->
      <input
        v-if="type !== 'textarea'"
        ref="input"
        class="mo-input__inner"
        v-bind="attrs"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :aria-label="label"
        :type="showPassword ? (passwordVisible ? 'text': 'password') : type"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        @keydown="handleKeydown">
      <!-- 后置元素slot -->
      <div v-if="$slots.append" class="mo-input-group__append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      ref="textarea"
      class="mo-textarea__inner"
      v-bind="attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :style="textareaStyle"
      :aria-label="label"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    ></textarea>
  </div>
</template>

<script lang='ts'>
import {
  defineComponent,
  // inject,
  computed,
  // watch,
  nextTick,
  // getCurrentInstance,
  shallowRef,
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
    modelValue: {
      type: [String, Number],
      default: ''
    },
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
    },
    readonly: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off',
      validator: (val: string) => ['on', 'off'].includes(val)
    },
    resize: {
      type: String as PropType<'none' | 'both' | 'horizontal' | 'vertical'>,
      validator: (val: string) => ['none', 'both', 'horizontal', 'vertical'].includes(val)
    },
    label: {
      type: String,
      default: ''
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    showPassword: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'input', 'change', 'focus', 'blur', 'clear',
    'mouseleave', 'mouseenter', 'keydown'],
  setup (props, ctx) {
    // 注册响应式
    const hovering = ref(false)
    const input = ref({ value: '' })
    const textarea = ref({ value: '' })
    const focused = ref(false)

    const attrs = useAttrs(true)

    const inputOrTextarea = computed(() => input.value || textarea.value)

    const onMouseEnter = (e: unknown) => {
      hovering.value = true
      ctx.emit('mouseenter', e)
    }

    const onMouseLeave = (e: unknown) => {
      hovering.value = false
      ctx.emit('mouseleave', e)
    }

    const inputDisabled = computed(() => props.disabled)

    const inputSize = computed(() => props.size)

    const nativeInputValue = computed(() => (props.modelValue === null || props.modelValue === undefined) ? '' : String(props.modelValue))

    const _textareaCalcStyle = shallowRef({})

    const textareaStyle = computed(() => ({
      ..._textareaCalcStyle.value,
      resize: props.resize
    }))

    const setNativeInputValue = () => {
      const input = inputOrTextarea.value
      if (!input || input.value === nativeInputValue.value) return
      input.value = nativeInputValue.value
    }

    const isComposing = ref(false)

    const handleInput = (event: any) => {
      const { value } = event.target

      // should not emit input during composition
      if (isComposing.value) return
      // should remove the following line when we don't support IE
      if (value === nativeInputValue.value) return

      ctx.emit('update:modelValue', value)
      ctx.emit('input', value)

      // ensure native input value is controlled
      nextTick(setNativeInputValue)
    }

    const handleChange = (event: any) => {
      ctx.emit('change', event.target.value)
    }

    const handleFocus = (event: any) => {
      focused.value = true
      ctx.emit('focus', event)
    }

    const handleBlur = (event: any) => {
      focused.value = false
      ctx.emit('blur', event)
      if (props.validateEvent) {
        // elFormItem.formItemMitt?.emit('el.form.blur', [props.modelValue])
      }
    }

    const handleKeydown = (e: any) => {
      ctx.emit('keydown', e)
    }

    const handleCompositionStart = () => {
      isComposing.value = true
    }

    const handleCompositionUpdate = (event: any) => {
      // const text = event.target.value
      // const lastCharacter = text[text.length - 1] || ''
      // isComposing.value = !isKorean(lastCharacter)
    }

    const handleCompositionEnd = (event: any) => {
      if (isComposing.value) {
        isComposing.value = false
        handleInput(event)
      }
    }

    return { onMouseEnter, onMouseLeave, attrs, inputDisabled, inputSize, textareaStyle, handleInput, handleChange, handleFocus, handleBlur, handleKeydown, handleCompositionStart, handleCompositionUpdate, handleCompositionEnd }
  }
})
</script>
<style lang='scss' scoped>
</style>
