<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import type { NeonProps } from './types'

defineOptions({
  name: 'MyuiNeon',
})

const props = withDefaults(defineProps<NeonProps>(), {
  mode: 'glow',
  speed: 'normal',
  active: true,
  intensity: 0.5,
  colorA: 'var(--myui-color-accent)',
  colorB: 'var(--myui-color-info)',
  as: 'span',
})

/**
 * Text mode owns the string, so it can light the glyphs themselves with stacked
 * text shadows. Wrapper mode never touches the DOM inside: it hangs the glow on
 * the wrapper through `filter: drop-shadow()`, which traces the silhouette of
 * whatever it was handed — a text node, a button, an image, a whole card.
 */
const isText = computed(() => props.text !== undefined)

const classes = computed(() => [
  'myui-neon',
  `myui-neon--${props.mode}`,
  `myui-neon--${props.speed}`,
  {
    'myui-neon--text': isText.value,
    'is-active': props.active,
  },
])

/** 0 → no glow at all, 1 → full bloom. NaN and out-of-range values are clamped. */
const intensity = computed(() => {
  const value = Number.isFinite(props.intensity) ? props.intensity : 0.5
  return Math.min(1, Math.max(0, value))
})

const styleVars = computed<CSSProperties>(() => ({
  '--myui-neon-intensity': String(intensity.value),
  '--myui-neon-color-a': props.colorA,
  '--myui-neon-color-b': props.colorB,
}))

/** The beam is decoration for `scan` only; it never exists while the tube is off. */
const showBeam = computed(() => props.mode === 'scan' && props.active)
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :style="styleVars"
    :data-mode="mode"
    :data-active="active ? 'true' : 'false'"
  >
    <span v-if="isText" class="myui-neon__text">{{ text }}</span>
    <slot v-else />
    <span v-if="showBeam" class="myui-neon__beam" aria-hidden="true" />
  </component>
</template>
