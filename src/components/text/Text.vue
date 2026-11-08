<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import type {
  TextLeading,
  TextProps,
  TextSize,
  TextTracking,
  TextTransform,
  TextVariant,
  TextWeight,
} from './types'

defineOptions({
  name: 'MyuiText',
})

const props = withDefaults(defineProps<TextProps>(), {
  as: 'span',
  variant: 'body',
  tone: 'default',
  align: 'start',
  glow: false,
})

interface TextVoice {
  size: TextSize
  weight: TextWeight
  leading: TextLeading
  tracking: TextTracking
  transform: TextTransform
}

/**
 * The four voices in one table — this, not the stylesheet, is the typographic
 * system. Each voice is a default on *every* axis, so an explicit prop wins by
 * replacing that default before the class list exists. Nothing has to fight the
 * cascade afterwards: no `!important`, no `:where()` bookkeeping.
 */
const VOICES: Record<TextVariant, TextVoice> = {
  /** Poster headline. Heavy, tight, and it owns the page it sits on. */
  display: {
    size: '2xl',
    weight: 'black',
    leading: 'tight',
    tracking: 'tight',
    transform: 'none',
  },
  /** HUD micro-label — the stamped tag above a figure or a block. */
  eyebrow: {
    size: 'xs',
    weight: 'bold',
    leading: 'snug',
    tracking: 'wide',
    transform: 'uppercase',
  },
  /** Running copy. Comfort first: normal leading, normal tracking. */
  body: {
    size: 'md',
    weight: 'regular',
    leading: 'normal',
    tracking: 'normal',
    transform: 'none',
  },
  /** Machine voice: ids, params, status strings. One step down, tracked out. */
  mono: {
    size: 'sm',
    weight: 'medium',
    leading: 'snug',
    tracking: 'wide',
    transform: 'none',
  },
}

const voice = computed(() => VOICES[props.variant])

const size = computed(() => props.size ?? voice.value.size)
const weight = computed(() => props.weight ?? voice.value.weight)
const leading = computed(() => props.leading ?? voice.value.leading)
const tracking = computed(() => props.tracking ?? voice.value.tracking)
const transform = computed(() => props.transform ?? voice.value.transform)

/** `truncate` counts lines: fractions and negatives are not lines. */
const lines = computed(() => {
  const value = Number(props.truncate)
  return Number.isFinite(value) && value >= 1 ? Math.floor(value) : 0
})

/**
 * One line is cut with `nowrap` + ellipsis, which keeps an inline suffix in the
 * same line; two or more lines need `-webkit-line-clamp`, whose box model
 * blockifies children (so it is text-only by nature).
 */
const style = computed<CSSProperties | undefined>(() =>
  lines.value > 1 ? { '--myui-text-clamp': String(lines.value) } : undefined,
)

const classes = computed(() => [
  'myui-text',
  `myui-text--${props.variant}`,
  `myui-text--size-${size.value}`,
  `myui-text--weight-${weight.value}`,
  `myui-text--tone-${props.tone}`,
  `myui-text--leading-${leading.value}`,
  `myui-text--tracking-${tracking.value}`,
  `myui-text--align-${props.align}`,
  {
    'myui-text--uppercase': transform.value === 'uppercase',
    'myui-text--truncate': lines.value === 1,
    'myui-text--clamp': lines.value > 1,
    'myui-text--glow': props.glow,
  },
])
</script>

<template>
  <component :is="as" :class="classes" :style="style">
    <slot /><span v-if="$slots.suffix" class="myui-text__part"><slot name="suffix" /></span>
  </component>
</template>
