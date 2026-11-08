<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { ICONS } from './icons'
import type { IconProps } from './types'

defineOptions({
  name: 'MyuiIcon',
})

const props = withDefaults(defineProps<IconProps>(), {
  size: 'md',
  color: 'currentColor',
  spin: false,
  strokeWidth: 1.75,
})

const attrs = useAttrs()

/**
 * Decorative by default. An icon that sits next to a label must not be read
 * twice, so it is hidden from assistive tech unless the caller names it —
 * passing `aria-label` (or `aria-labelledby`) turns it into a named image.
 */
const labelled = computed(() => Boolean(attrs['aria-label'] || attrs['aria-labelledby']))

const glyph = computed<readonly string[]>(() => (props.name ? ICONS[props.name] : []))

const classes = computed(() => [
  'myui-icon',
  `myui-icon--${props.size}`,
  { 'myui-icon--spin': props.spin },
])
</script>

<template>
  <svg
    :class="classes"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :style="{ color }"
    :role="labelled ? 'img' : undefined"
    :aria-hidden="labelled ? undefined : 'true'"
    focusable="false"
  >
    <slot v-if="!name" />
    <template v-else>
      <path v-for="(d, index) in glyph" :key="index" :d="d" />
    </template>
  </svg>
</template>
