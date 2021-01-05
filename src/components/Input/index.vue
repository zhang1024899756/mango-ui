<template>
  <div :class="[
    type === 'textarea' ? 'mo-textarea' : 'mo-input',
    inputSize ? 'mo-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'mo-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword
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
        <!-- 后置内容 -->
      <span v-if="getSuffixVisible()" class="mo-input__suffix">
        <span class="mo-input__suffix-inner">
          <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
            <slot name="suffix"></slot>
            <font-awesome-icon v-if="suffixIcon" class="mo-input__icon" :icon="suffixIcon" :spin="suffixIcon === 'spinner'" />
          </template>
          <font-awesome-icon v-if="showClear" class="mo-input__icon mo-input__clear" icon="times-circle" @mousedown.prevent @click="clear" />
        </span>
      </span>
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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
  components: { FontAwesomeIcon },
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
    },
    suffixIcon: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'input', 'change', 'focus', 'blur', 'clear',
    'mouseleave', 'mouseenter', 'keydown'],
  setup (props, ctx) {
    // 注册响应式
    const hovering = ref(false)
    const input = ref(null)
    const textarea = ref(null)
    const focused = ref(false)

    const attrs = useAttrs(true)

    const inputOrTextarea = computed(() => input.value || textarea.value)

    const onMouseEnter = e => {
      hovering.value = true
      ctx.emit('mouseenter', e)
    }

    const onMouseLeave = e => {
      hovering.value = false
      ctx.emit('mouseleave', e)
    }

    const inputDisabled = computed(() => props.disabled)

    const inputSize = computed(() => props.size)

    const nativeInputValue = computed(() => {
      return (props.modelValue === null || props.modelValue === undefined) ? '' : String(props.modelValue)
    })

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

    const handleInput = event => {
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

    const handleChange = event => {
      ctx.emit('change', event.target.value)
    }

    const handleFocus = event => {
      focused.value = true
      ctx.emit('focus', event)
    }

    const handleBlur = event => {
      focused.value = false
      ctx.emit('blur', event)
      if (props.validateEvent) {
        // elFormItem.formItemMitt?.emit('el.form.blur', [props.modelValue])
      }
    }

    const handleKeydown = e => {
      ctx.emit('keydown', e)
    }

    const handleCompositionStart = () => {
      isComposing.value = true
    }

    const handleCompositionUpdate = event => {
      // const text = event.target.value
      // const lastCharacter = text[text.length - 1] || ''
      // isComposing.value = !isKorean(lastCharacter)
    }

    const handleCompositionEnd = event => {
      if (isComposing.value) {
        isComposing.value = false
        handleInput(event)
      }
    }

    const clear = () => {
      ctx.emit('update:modelValue', '')
      ctx.emit('change', '')
      ctx.emit('clear')
    }

    const showPwdVisible = computed(() => {
      return props.showPassword &&
        !inputDisabled.value &&
        !props.readonly &&
        (!!nativeInputValue.value || focused.value)
    })

    const isWordLimitVisible = computed(() => {
      return props.showWordLimit &&
        ctx.attrs.maxlength &&
        (props.type === 'text' || props.type === 'textarea') &&
        !inputDisabled.value &&
        !props.readonly &&
        !props.showPassword
    })

    const showClear = computed(() => {
      return props.clearable &&
        !inputDisabled.value &&
        !props.readonly &&
        nativeInputValue.value &&
        (focused.value || hovering.value)
    })

    const getSuffixVisible = () => {
      return ctx.slots.suffix ||
        props.suffixIcon ||
        showClear.value ||
        props.showPassword ||
        isWordLimitVisible.value
        // || (validateState.value && needStatusIcon.value)
    }

    return {
      input,
      textarea,
      clear,
      showClear,
      showPwdVisible,
      isWordLimitVisible,
      getSuffixVisible,
      onMouseEnter,
      onMouseLeave,
      attrs,
      inputDisabled,
      inputSize,
      textareaStyle,
      handleInput,
      handleChange,
      handleFocus,
      handleBlur,
      handleKeydown,
      handleCompositionStart,
      handleCompositionUpdate,
      handleCompositionEnd
    }
  }
})
</script>
<style lang='scss' scoped>
</style>
