<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps } from './types'

defineOptions({
  name: 'MyuiButton',
})

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'solid',
  tone: 'accent',
  size: 'md',
  shape: 'rect',
  htmlType: 'button',
  block: false,
  shadow: true,
  disabled: false,
  loading: false,
  iconOnly: false,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

/** `href` always wins: a link that looks like a button must behave like a link. */
const isAnchor = computed(() => props.tag === 'a' || Boolean(props.href))
const inactive = computed(() => props.disabled || props.loading)

const classes = computed(() => [
  'myui-button',
  `myui-button--${props.variant}`,
  `myui-button--tone-${props.tone}`,
  `myui-button--${props.size}`,
  `myui-button--${props.shape}`,
  {
    'myui-button--block': props.block,
    'myui-button--shadow':
      props.shadow && (props.variant === 'solid' || props.variant === 'outline'),
    'myui-button--icon-only': props.iconOnly,
    'myui-button--loading': props.loading,
    'is-disabled': props.disabled,
  },
])

const anchorRel = computed(
  () => props.rel ?? (props.target === '_blank' ? 'noreferrer noopener' : undefined),
)

function onClick(event: MouseEvent) {
  if (inactive.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}
</script>

<template>
  <a
    v-if="isAnchor"
    :class="classes"
    :href="inactive ? undefined : href"
    :target="target"
    :rel="anchorRel"
    :tabindex="disabled ? -1 : undefined"
    :aria-disabled="inactive ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    @click="onClick"
  >
    <span v-if="loading" class="myui-button__spinner" aria-hidden="true" />
    <span v-if="$slots.prefix" class="myui-button__affix"><slot name="prefix" /></span>
    <span v-if="$slots.default" class="myui-button__label"><slot /></span>
    <span v-if="$slots.suffix" class="myui-button__affix"><slot name="suffix" /></span>
  </a>

  <button
    v-else
    :class="classes"
    :type="htmlType"
    :disabled="inactive"
    :aria-busy="loading ? 'true' : undefined"
    @click="onClick"
  >
    <span v-if="loading" class="myui-button__spinner" aria-hidden="true" />
    <span v-if="$slots.prefix" class="myui-button__affix"><slot name="prefix" /></span>
    <span v-if="$slots.default" class="myui-button__label"><slot /></span>
    <span v-if="$slots.suffix" class="myui-button__affix"><slot name="suffix" /></span>
  </button>
</template>
