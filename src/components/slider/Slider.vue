<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SliderProps, SliderValue } from './types'

defineOptions({
  name: 'MyuiSlider',
})

const props = withDefaults(defineProps<SliderProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  vertical: false,
  showTooltip: true,
  tone: 'accent',
  skew: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: SliderValue): void
  (e: 'change', value: SliderValue): void
}>()

const railEl = ref<HTMLElement | null>(null)
const dragging = ref(false)
const dragIndex = ref(0)
/** While a pointer is down the visual value follows the finger, not the — still
 *  one render behind — parent prop. */
const draft = ref<number[] | null>(null)

/* -------------------------------------------------------------------------- */
/* bounds                                                                      */
/* -------------------------------------------------------------------------- */

/** A degenerate range (min === max, min > max, NaN) must never produce NaN. */
const lowerBound = computed(() => (Number.isFinite(props.min) ? props.min : 0))
const upperBound = computed(() => {
  const top = Number.isFinite(props.max) ? props.max : 100
  return top > lowerBound.value ? top : lowerBound.value
})
const span = computed(() => upperBound.value - lowerBound.value)
const stepSize = computed(() => (Number.isFinite(props.step) && props.step > 0 ? props.step : 1))
const stepPrecision = computed(() => {
  const raw = String(stepSize.value)
  // Exponential notation (1e-7) has no fractional digits to count.
  if (raw.includes('e') || raw.includes('E')) return 8
  const dot = raw.indexOf('.')
  return dot === -1 ? 0 : raw.length - dot - 1
})

function roundTo(value: number, digits: number): number {
  const factor = 10 ** Math.min(digits, 12)
  return Math.round(value * factor) / factor
}

function clamp(value: number): number {
  if (!Number.isFinite(value)) return lowerBound.value
  return Math.min(upperBound.value, Math.max(lowerBound.value, value))
}

function snap(value: number): number {
  const step = stepSize.value
  const snapped = lowerBound.value + Math.round((value - lowerBound.value) / step) * step
  return roundTo(clamp(snapped), stepPrecision.value)
}

/* -------------------------------------------------------------------------- */
/* value <- prop                                                              */
/* -------------------------------------------------------------------------- */

const rawValues = computed<number[]>(() => {
  const value = props.modelValue
  if (Array.isArray(value)) {
    const lower = clamp(Number(value[0]))
    const upper = clamp(Number(value[1]))
    // Crossed input is legal: normalise instead of rendering inverted handles.
    return lower <= upper ? [lower, upper] : [upper, lower]
  }
  return [clamp(Number(value))]
})

const activeValues = computed(() => draft.value ?? rawValues.value)

function percentOf(value: number): number {
  return span.value <= 0 ? 0 : ((value - lowerBound.value) / span.value) * 100
}

const percents = computed(() => activeValues.value.map(percentOf))

/* -------------------------------------------------------------------------- */
/* geometry                                                                   */
/* -------------------------------------------------------------------------- */

function thumbStyle(index: number): Record<string, string> {
  const percent = `${percents.value[index]}%`
  return props.vertical ? { bottom: percent } : { left: percent }
}

const fillStyle = computed<Record<string, string>>(() => {
  const values = percents.value
  // One handle fills from the start of the track; two handles fill between.
  const start = values.length === 2 ? values[0] : 0
  const size = `${values[values.length - 1] - start}%`
  const style: Record<string, string> = {}

  if (props.vertical) {
    style.bottom = `${start}%`
    style.height = size
  } else {
    style.left = `${start}%`
    style.width = size
  }

  return style
})

function markStyle(percent: number): Record<string, string> {
  const value = `${percent}%`
  return props.vertical ? { bottom: value } : { left: value }
}

const markList = computed(() => {
  return Object.entries(props.marks ?? {})
    .map(([key, label]) => ({ value: Number(key), label }))
    .filter((mark) => Number.isFinite(mark.value))
    .map((mark) => {
      const value = clamp(mark.value)
      return { value, label: mark.label, percent: percentOf(value) }
    })
    .sort((a, b) => a.value - b.value)
})

/* -------------------------------------------------------------------------- */
/* accessibility                                                              */
/* -------------------------------------------------------------------------- */

function valueText(value: number): string {
  const mark = markList.value.find((entry) => entry.value === value)
  return mark ? mark.label : String(value)
}

function thumbLabel(index: number): string {
  if (activeValues.value.length < 2) return 'Value'
  return index === 0 ? 'Lower bound' : 'Upper bound'
}

const rootClasses = computed(() => [
  'myui-slider',
  `myui-slider--tone-${props.tone}`,
  {
    'myui-slider--vertical': props.vertical,
    'myui-slider--disabled': props.disabled,
    'myui-slider--dragging': dragging.value,
    'myui-slider--with-marks': markList.value.length > 0,
    'myui-slider--skew': props.skew,
  },
])

/* -------------------------------------------------------------------------- */
/* writing                                                                    */
/* -------------------------------------------------------------------------- */

function payloadOf(values: number[]): SliderValue {
  return values.length === 2 ? ([values[0], values[1]] as [number, number]) : values[0]
}

/**
 * Write one handle and emit `update:modelValue`.
 * Handles never cross: the lower handle is capped by the upper one and back.
 */
function commitThumb(index: number, value: number, keepDraft: boolean): SliderValue {
  const next = [...activeValues.value]
  const target = snap(value)

  if (next.length === 2) {
    if (index === 0) next[0] = Math.min(target, next[1])
    else next[1] = Math.max(target, next[0])
  } else {
    next[0] = target
  }

  if (keepDraft) draft.value = next

  const payload = payloadOf(next)
  emit('update:modelValue', payload)
  return payload
}

/* -------------------------------------------------------------------------- */
/* pointer                                                                    */
/* -------------------------------------------------------------------------- */

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function ratioFrom(clientX: number, clientY: number): number {
  const rail = railEl.value
  if (!rail) return 0
  const rect = rail.getBoundingClientRect()

  if (props.vertical) {
    if (rect.height <= 0) return 0
    return clamp01((rect.bottom - clientY) / rect.height)
  }

  if (rect.width <= 0) return 0
  return clamp01((clientX - rect.left) / rect.width)
}

function valueFrom(clientX: number, clientY: number): number {
  return snap(lowerBound.value + ratioFrom(clientX, clientY) * span.value)
}

function beginDrag(event: PointerEvent, index: number): void {
  if (props.disabled) return

  event.preventDefault()
  dragging.value = true
  dragIndex.value = index
  draft.value = [...rawValues.value]

  const target = event.currentTarget as HTMLElement | null
  if (
    target &&
    typeof target.setPointerCapture === 'function' &&
    typeof event.pointerId === 'number'
  ) {
    try {
      target.setPointerCapture(event.pointerId)
    } catch {
      // Detached node or a synthetic event: the move handlers on the root still
      // receive the stream, so drag keeps working without capture.
    }
  }

  commitThumb(index, valueFrom(event.clientX, event.clientY), true)
}

function onThumbPointerDown(event: PointerEvent, index: number): void {
  beginDrag(event, index)
}

function onRailPointerDown(event: PointerEvent): void {
  if (props.disabled) return

  const value = valueFrom(event.clientX, event.clientY)
  let index = 0
  if (activeValues.value.length === 2) {
    const [lower, upper] = activeValues.value
    index = Math.abs(value - lower) <= Math.abs(value - upper) ? 0 : 1
  }

  beginDrag(event, index)
}

function onPointerMove(event: PointerEvent): void {
  if (!dragging.value || props.disabled) return
  commitThumb(dragIndex.value, valueFrom(event.clientX, event.clientY), true)
}

function endDrag(): void {
  if (!dragging.value) return

  dragging.value = false
  const final = draft.value ?? rawValues.value
  emit('change', payloadOf(final))
  draft.value = null
}

/* -------------------------------------------------------------------------- */
/* keyboard                                                                   */
/* -------------------------------------------------------------------------- */

function onThumbKeydown(event: KeyboardEvent, index: number): void {
  if (props.disabled) return

  const current = activeValues.value[index]
  const step = stepSize.value
  let next: number

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      next = current + step
      break
    case 'ArrowLeft':
    case 'ArrowDown':
      next = current - step
      break
    case 'PageUp':
      next = current + step * 10
      break
    case 'PageDown':
      next = current - step * 10
      break
    case 'Home':
      next = lowerBound.value
      break
    case 'End':
      next = upperBound.value
      break
    default:
      return
  }

  event.preventDefault()
  emit('change', commitThumb(index, next, false))
}
</script>

<template>
  <div
    :class="rootClasses"
    @pointermove="onPointerMove"
    @pointerup="endDrag"
    @pointercancel="endDrag"
  >
    <div ref="railEl" class="myui-slider__rail" @pointerdown="onRailPointerDown">
      <span class="myui-slider__line" aria-hidden="true">
        <span class="myui-slider__fill" :style="fillStyle" />
      </span>

      <button
        v-for="(value, index) in activeValues"
        :key="index"
        type="button"
        role="slider"
        class="myui-slider__thumb"
        :class="{ 'is-active': dragging && dragIndex === index }"
        :style="thumbStyle(index)"
        :aria-valuemin="lowerBound"
        :aria-valuemax="upperBound"
        :aria-valuenow="value"
        :aria-valuetext="valueText(value)"
        :aria-orientation="vertical ? 'vertical' : 'horizontal'"
        :aria-label="thumbLabel(index)"
        :aria-disabled="disabled ? 'true' : undefined"
        :disabled="disabled"
        @keydown="onThumbKeydown($event, index)"
        @pointerdown.stop="onThumbPointerDown($event, index)"
      >
        <span v-if="showTooltip" class="myui-slider__tooltip" aria-hidden="true">
          {{ valueText(value) }}
        </span>
      </button>

      <div v-if="markList.length" class="myui-slider__marks" aria-hidden="true">
        <span
          v-for="mark in markList"
          :key="mark.value"
          class="myui-slider__mark"
          :style="markStyle(mark.percent)"
        >
          <span class="myui-slider__mark-dot" />
          <span class="myui-slider__mark-label">{{ mark.label }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
