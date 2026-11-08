<script setup lang="ts">
import { computed, useId } from 'vue'
import type { ProgressProps } from './types'

defineOptions({
  name: 'MyuiProgress',
})

const props = withDefaults(defineProps<ProgressProps>(), {
  percent: 0,
  type: 'line',
  tone: 'accent',
  size: 'md',
  showText: true,
  indeterminate: false,
  skew: false,
})

const RADIUS = 42
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** NaN and out-of-range values are the caller's bug, not the user's problem. */
const clamped = computed(() => {
  const value = Number(props.percent)
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, value))
})

const rounded = computed(() => Math.round(clamped.value))

const classes = computed(() => [
  'myui-progress',
  `myui-progress--${props.type}`,
  `myui-progress--${props.size}`,
  `myui-progress--tone-${props.tone}`,
  { 'myui-progress--indeterminate': props.indeterminate, 'myui-progress--skew': props.skew },
])

/**
 * A CSS gradient cannot paint an SVG stroke, so the spectrum ring needs a real
 * <linearGradient>. Its id has to be unique per instance or two rings on a page
 * would share the first one's definition.
 */
const gradientId = `myui-progress-spectrum-${useId().replace(/[^\w-]/g, '')}`

const isSpectrum = computed(() => props.tone === 'spectrum')
const hasRingGradient = computed(() => props.type === 'circle' && isSpectrum.value)

const fillStyle = computed(() => ({ width: `${clamped.value}%` }))

const ringStyle = computed(() => ({
  strokeDasharray: `${CIRCUMFERENCE} ${CIRCUMFERENCE}`,
  strokeDashoffset: `${CIRCUMFERENCE * (1 - clamped.value / 100)}`,
}))

/** The spectrum ring swaps the inline stroke for a paint server; the dash maths
 *  is unchanged, so the fill still reads the same percentage. */
const ringFillStyle = computed(() => {
  const style: Record<string, string> = { ...ringStyle.value }
  if (hasRingGradient.value) style.stroke = `url(#${gradientId})`
  return style
})

const displayText = computed(() => (props.indeterminate ? '—' : `${rounded.value}%`))
</script>

<template>
  <div :class="classes">
    <template v-if="type === 'line'">
      <div
        class="myui-progress__track"
        role="progressbar"
        :aria-label="label ?? 'Progress'"
        :aria-valuemin="0"
        :aria-valuemax="100"
        :aria-valuenow="indeterminate ? undefined : rounded"
        :aria-valuetext="indeterminate ? undefined : displayText"
      >
        <div
          v-if="!indeterminate"
          class="myui-progress__fill"
          :style="fillStyle"
        />
        <div v-else class="myui-progress__sweep" aria-hidden="true" />
      </div>
    </template>

    <template v-else>
      <div class="myui-progress__ring">
        <svg
          viewBox="0 0 100 100"
          role="progressbar"
          :aria-label="label ?? 'Progress'"
          :aria-valuemin="0"
          :aria-valuemax="100"
          :aria-valuenow="indeterminate ? undefined : rounded"
          :aria-valuetext="indeterminate ? undefined : displayText"
        >
          <defs v-if="hasRingGradient">
            <linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" style="stop-color: var(--myui-color-neon-cyan)" />
              <stop offset="52%" style="stop-color: var(--myui-color-neon-violet)" />
              <stop offset="100%" style="stop-color: var(--myui-color-neon-magenta)" />
            </linearGradient>
          </defs>
          <circle class="myui-progress__ring-track" cx="50" cy="50" :r="RADIUS" />
          <circle
            v-if="!indeterminate"
            class="myui-progress__ring-fill"
            cx="50"
            cy="50"
            :r="RADIUS"
            :style="ringFillStyle"
          />
        </svg>
        <span v-if="showText" class="myui-progress__ring-text">{{ displayText }}</span>
      </div>
    </template>

    <span v-if="showText && type === 'line'" class="myui-progress__text">{{ displayText }}</span>
  </div>
</template>
