<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ICONS } from '../icon/icons'
import type { NumberProps } from './types'

defineOptions({
  name: 'MyuiNumber',
})

const props = withDefaults(defineProps<NumberProps>(), {
  precision: 0,
  separator: true,
  prefix: '',
  suffix: '',
  animated: false,
  duration: 600,
  size: 'md',
  tone: 'ink',
  skew: false,
})

/** Reading it from globalThis keeps the check testable and SSR-safe. */
function prefersReducedMotion(): boolean {
  const scope = globalThis as { matchMedia?: (query: string) => MediaQueryList }
  if (typeof scope.matchMedia !== 'function') return false
  return scope.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const duration = computed(() => Math.max(0, props.duration))
const canAnimate = computed(
  () => props.animated && duration.value > 0 && !prefersReducedMotion(),
)

/** What is on screen right now: equal to `value` unless a count-up is running. */
const shown = ref(canAnimate.value ? 0 : props.value)
const previous = ref(props.value)
let frame = 0

function cancelFrame(): void {
  if (frame !== 0) {
    cancelAnimationFrame(frame)
    frame = 0
  }
}

function animateTo(target: number): void {
  cancelFrame()

  if (!canAnimate.value || !Number.isFinite(target)) {
    shown.value = target
    return
  }

  const from = shown.value
  const startedAt = performance.now()

  const tick = (now: number): void => {
    const progress = Math.min(1, (now - startedAt) / duration.value)
    const eased = 1 - (1 - progress) ** 3
    shown.value = from + (target - from) * eased

    if (progress < 1) {
      frame = requestAnimationFrame(tick)
    } else {
      shown.value = target
      frame = 0
    }
  }

  frame = requestAnimationFrame(tick)
}

watch(
  () => props.value,
  (next, old) => {
    previous.value = old
    animateTo(next)
  },
)

onMounted(() => {
  animateTo(props.value)
})

onBeforeUnmount(cancelFrame)

const decimals = computed(() => Math.min(20, Math.max(0, Math.trunc(props.precision))))

/** Fixed decimals, optional thousands grouping, never `-0`. */
function format(input: number): string {
  if (!Number.isFinite(input)) return '—'

  const rounded = Number(input.toFixed(decimals.value))
  const body = props.separator
    ? Math.abs(rounded).toLocaleString('en-US', {
        minimumFractionDigits: decimals.value,
        maximumFractionDigits: decimals.value,
      })
    : Math.abs(rounded).toFixed(decimals.value)

  return `${rounded < 0 ? '-' : ''}${body}`
}

const finalText = computed(() => `${props.prefix}${format(props.value)}${props.suffix}`)
const shownText = computed(() => format(shown.value))

const trendDirection = computed<'up' | 'down' | 'flat'>(() => {
  switch (props.trend) {
    case 'up':
    case 'down':
    case 'flat':
      return props.trend
    case 'auto':
      if (props.value > previous.value) return 'up'
      if (props.value < previous.value) return 'down'
      return 'flat'
    default:
      return 'flat'
  }
})

const showTrend = computed(() => props.trend !== undefined)

const trendGlyph = computed<readonly string[]>(() => {
  if (trendDirection.value === 'up') return ICONS['arrow-up']
  if (trendDirection.value === 'down') return ICONS['arrow-down']
  return ICONS.minus
})

const classes = computed(() => [
  'myui-number',
  `myui-number--${props.size}`,
  `myui-number--tone-${props.tone}`,
  { 'myui-number--skew': props.skew },
])
</script>

<template>
  <span
    :class="classes"
    :aria-label="finalText"
    :data-trend="showTrend ? trendDirection : undefined"
  >
    <span v-if="prefix" class="myui-number__affix">{{ prefix }}</span>
    <span class="myui-number__digits">{{ shownText }}</span>
    <span v-if="suffix" class="myui-number__affix">{{ suffix }}</span>
    <svg
      v-if="showTrend"
      class="myui-number__trend"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path v-for="(d, index) in trendGlyph" :key="index" :d="d" />
    </svg>
  </span>
</template>
