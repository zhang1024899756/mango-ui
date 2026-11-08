<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import type { MagicProps } from './types'

defineOptions({
  name: 'MyuiMagic',
})

const props = withDefaults(defineProps<MagicProps>(), {
  mode: 'glitch',
  speed: 'normal',
  active: true,
  intensity: 0.5,
  colorA: 'var(--myui-color-accent)',
  colorB: 'var(--myui-color-info)',
  as: 'span',
})

/**
 * Text mode is the only mode allowed to duplicate glyphs: it owns the string, so
 * `::before` / `::after` can copy it with `attr(data-text)`. Arbitrary slot
 * content is never cloned — the wrapper animates itself instead.
 */
const isText = computed(() => props.text !== undefined)

const classes = computed(() => [
  'myui-magic',
  `myui-magic--${props.mode}`,
  `myui-magic--${props.speed}`,
  {
    'myui-magic--text': isText.value,
    'is-active': props.active,
  },
])

/** 0 → 0px displacement, 1 → one grid step. NaN and out-of-range values are clamped. */
const intensity = computed(() => {
  const value = Number.isFinite(props.intensity) ? props.intensity : 0.5
  return Math.min(1, Math.max(0, value))
})

const styleVars = computed<CSSProperties>(() => ({
  '--myui-magic-intensity': String(intensity.value),
  '--myui-magic-color-a': props.colorA,
  '--myui-magic-color-b': props.colorB,
}))

/** The beam is decoration for `scan` only; it never exists while the effect is off. */
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
    <span v-if="isText" class="myui-magic__text" :data-text="text">{{ text }}</span>
    <slot v-else />
    <span v-if="showBeam" class="myui-magic__beam" aria-hidden="true" />
  </component>
</template>
