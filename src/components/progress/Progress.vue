<script setup lang="ts">
import { computed } from 'vue'
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
  { 'myui-progress--indeterminate': props.indeterminate },
])

const fillStyle = computed(() => ({ width: `${clamped.value}%` }))

const ringStyle = computed(() => ({
  strokeDasharray: `${CIRCUMFERENCE} ${CIRCUMFERENCE}`,
  strokeDashoffset: `${CIRCUMFERENCE * (1 - clamped.value / 100)}`,
}))

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
          <circle class="myui-progress__ring-track" cx="50" cy="50" :r="RADIUS" />
          <circle
            v-if="!indeterminate"
            class="myui-progress__ring-fill"
            cx="50"
            cy="50"
            :r="RADIUS"
            :style="ringStyle"
          />
        </svg>
        <span v-if="showText" class="myui-progress__ring-text">{{ displayText }}</span>
      </div>
    </template>

    <span v-if="showText && type === 'line'" class="myui-progress__text">{{ displayText }}</span>
  </div>
</template>
