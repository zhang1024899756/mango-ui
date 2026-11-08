<script setup lang="ts">
import { computed, ref, useAttrs, useId } from 'vue'
import type { InputProps } from './types'

defineOptions({
  name: 'MyuiInput',
  // Anything not declared as a prop (`id`, `aria-label`, `autofocus` …) belongs
  // on the native <input>, not on the wrapper — labels and AT hooks live there.
  inheritAttrs: false,
})

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  size: 'md',
  variant: 'box',
  disabled: false,
  readonly: false,
  clearable: false,
  showCount: false,
  invalid: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'clear'): void
  (e: 'enter', event: KeyboardEvent): void
}>()

const errorId = `${useId()}-error`

const attrs = useAttrs()

/** `class` / `style` must style the component shell, as with any other component. */
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))

/** Everything else (id, aria-*, name, autofocus …) belongs on the native field. */
const fieldAttrs = computed(() => {
  const rest: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (key !== 'class' && key !== 'style') rest[key] = value
  }
  return rest
})

const fieldEl = ref<HTMLInputElement | null>(null)
const focused = ref(false)

const length = computed(() => props.modelValue.length)
const hasValue = computed(() => length.value > 0)
const showClear = computed(
  () => props.clearable && hasValue.value && !props.disabled && !props.readonly,
)
const showCounter = computed(() => props.showCount && !props.disabled)
const isInvalid = computed(() => props.invalid || Boolean(props.error))
const describedBy = computed(() => (props.error ? errorId : undefined))
const countText = computed(() =>
  props.maxlength == null ? String(length.value) : `${length.value} / ${props.maxlength}`,
)

const classes = computed(() => [
  'myui-input',
  `myui-input--${props.size}`,
  `myui-input--${props.variant}`,
  {
    'myui-input--disabled': props.disabled,
    'myui-input--readonly': props.readonly,
    'myui-input--invalid': isInvalid.value,
    'myui-input--focused': focused.value,
  },
])

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function onFocus(event: FocusEvent) {
  focused.value = true
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  focused.value = false
  emit('blur', event)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') emit('enter', event)
}

function clear() {
  if (props.disabled || props.readonly) return
  emit('update:modelValue', '')
  emit('clear')
  fieldEl.value?.focus()
}
</script>

<template>
  <div :class="classes" v-bind="rootAttrs">
    <div class="myui-input__shell">
      <span v-if="$slots.prefix" class="myui-input__affix myui-input__affix--prefix">
        <slot name="prefix" />
      </span>

      <input
        ref="fieldEl"
        v-bind="fieldAttrs"
        class="myui-input__field"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :name="name"
        :autocomplete="autocomplete"
        :aria-invalid="isInvalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />

      <span v-if="$slots.suffix" class="myui-input__affix myui-input__affix--suffix">
        <slot name="suffix" />
      </span>

      <button
        v-if="showClear"
        type="button"
        class="myui-input__clear"
        aria-label="Clear input"
        @click="clear"
      >
        <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true" focusable="false">
          <path
            d="M6 6l12 12M18 6L6 18"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>

    <div v-if="showCounter || error" class="myui-input__meta">
      <span v-if="error" :id="errorId" class="myui-input__error">{{ error }}</span>
      <span v-if="showCounter" class="myui-input__count" aria-live="polite">{{ countText }}</span>
    </div>
  </div>
</template>
