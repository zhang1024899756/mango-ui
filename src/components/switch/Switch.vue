<script setup lang="ts">
import { computed, useId } from 'vue'
import type { SwitchProps, SwitchValue } from './types'

defineOptions({
  name: 'MyuiSwitch',
})

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  size: 'md',
  disabled: false,
  loading: false,
  activeText: '',
  inactiveText: '',
  skew: false,
  tone: 'accent',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: SwitchValue): void
  (e: 'change', value: SwitchValue): void
}>()

const labelId = `${useId()}-label`

// `activeValue` / `inactiveValue` are `unknown`, which `withDefaults` cannot
// infer a default for — resolve the documented true / false pair here instead.
const resolvedActiveValue = computed<unknown>(() =>
  props.activeValue === undefined ? true : props.activeValue,
)
const resolvedInactiveValue = computed<unknown>(() =>
  props.inactiveValue === undefined ? false : props.inactiveValue,
)

const isActive = computed(() => (props.modelValue as unknown) === resolvedActiveValue.value)
const inactive = computed(() => props.disabled || props.loading)
const hasText = computed(() => Boolean(props.activeText || props.inactiveText))
const currentText = computed(() => (isActive.value ? props.activeText : props.inactiveText))

const classes = computed(() => [
  'myui-switch',
  `myui-switch--${props.size}`,
  `myui-switch--tone-${props.tone}`,
  {
    'myui-switch--checked': isActive.value,
    'myui-switch--disabled': props.disabled,
    'myui-switch--loading': props.loading,
    'myui-switch--with-text': hasText.value,
    'myui-switch--skew': props.skew,
  },
])

function toggle() {
  if (inactive.value) return
  const next = (
    isActive.value ? resolvedInactiveValue.value : resolvedActiveValue.value
  ) as SwitchValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <button
    type="button"
    :class="classes"
    role="switch"
    :aria-checked="isActive ? 'true' : 'false'"
    :aria-labelledby="hasText ? labelId : undefined"
    :aria-disabled="inactive ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :disabled="inactive"
    @click="toggle"
    @keydown.space.prevent="toggle"
    @keydown.enter.prevent="toggle"
  >
    <span class="myui-switch__track" aria-hidden="true">
      <span class="myui-switch__thumb">
        <span v-if="loading" class="myui-switch__spinner" />
      </span>
    </span>
    <span v-if="hasText" :id="labelId" class="myui-switch__label">{{ currentText }}</span>
  </button>
</template>
