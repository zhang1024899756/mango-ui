<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import type { FlotageProps } from './types'

defineOptions({
  name: 'MyuiFlotage',
})

const props = withDefaults(defineProps<FlotageProps>(), {
  axis: 'y',
  amplitude: 8,
  duration: 4,
  delay: 0,
  trigger: 'auto',
  disabled: false,
  as: 'span',
})

/** One guard for every number: a bad value falls back instead of reaching CSS. */
function finite(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback
}

const amplitude = computed(() => Math.max(0, finite(props.amplitude, 8)))
const duration = computed(() => Math.max(0.1, finite(props.duration, 4)))
const delay = computed(() => Math.max(0, finite(props.delay, 0)))

const classes = computed(() => [
  'myui-flotage',
  `myui-flotage--axis-${props.axis}`,
  {
    'myui-flotage--hover': props.trigger === 'hover',
    'is-disabled': props.disabled,
  },
])

const styleVars = computed<CSSProperties>(() => ({
  '--myui-flotage-amplitude': String(amplitude.value),
  '--myui-flotage-duration': `${duration.value}s`,
  '--myui-flotage-delay': `${delay.value}s`,
}))
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :style="styleVars"
    :data-axis="axis"
    :data-trigger="trigger"
    :data-disabled="disabled ? 'true' : 'false'"
  >
    <slot />
  </component>
</template>
