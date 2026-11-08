<script setup lang="ts">
import { computed } from 'vue'
import { ICONS } from '../icon/icons'
import type { LinkProps } from './types'

defineOptions({
  name: 'MyuiLink',
})

const props = withDefaults(defineProps<LinkProps>(), {
  tone: 'ink',
  underline: 'hover',
  external: false,
  disabled: false,
  skew: false,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

/** An absolute URL leaves this document, so it always opens in a new tab. */
const isExternal = computed(
  () => props.external || /^(?:https?:)?\/\//i.test(props.href ?? ''),
)

const anchorTarget = computed(() => (isExternal.value ? (props.target ?? '_blank') : props.target))

const anchorRel = computed(() =>
  isExternal.value ? (props.rel ?? 'noreferrer noopener') : props.rel,
)

/**
 * The gradient is a *paint*, not a state: an inert link never wears one, so the
 * resolved flag is reported to CSS instead of leaving the cascade to guess.
 */
const paintsSpectrum = computed(() => props.tone === 'spectrum' && !props.disabled)

const classes = computed(() => [
  'myui-link',
  `myui-link--tone-${props.tone}`,
  `myui-link--underline-${props.underline}`,
  {
    'is-disabled': props.disabled,
    'myui-link--external': isExternal.value,
    'myui-link--skew': props.skew,
  },
])

function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}
</script>

<template>
  <a
    :class="classes"
    :href="disabled ? undefined : href"
    :target="anchorTarget"
    :rel="anchorRel"
    :tabindex="disabled ? -1 : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    :data-spectrum="paintsSpectrum ? 'true' : undefined"
    @click="onClick"
  >
    <span class="myui-link__label"><slot /></span>
    <span v-if="$slots.suffix" class="myui-link__suffix"><slot name="suffix" /></span>
    <svg
      v-if="isExternal"
      class="myui-link__arrow"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path v-for="(d, index) in ICONS['external-link']" :key="index" :d="d" />
    </svg>
  </a>
</template>
