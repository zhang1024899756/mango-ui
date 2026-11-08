<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { ImageProps } from './types'

defineOptions({
  name: 'MyuiImage',
})

const props = withDefaults(defineProps<ImageProps>(), {
  alt: '',
  ratio: '4:3',
  fit: 'cover',
  radius: 'none',
  border: true,
  lazy: true,
})

const emit = defineEmits<{
  (e: 'load', event: Event): void
  (e: 'error', event: Event): void
}>()

type ImageStatus = 'loading' | 'loaded' | 'error'

/**
 * Starts as a skeleton: until pixels arrive — or until the caller has a `src`
 * at all — the frame holds its ratio and shows the shimmer. Only a real failed
 * load becomes the error state.
 */
const status = ref<ImageStatus>('loading')

const imageEl = ref<HTMLImageElement | null>(null)

/**
 * Server-rendered markup starts fetching before hydration, so a fast image can
 * finish before any listener exists — the shimmer would never go away. Recover
 * the truth from the element itself. The events stay owned by the browser: this
 * only corrects the visual state, so nothing is emitted twice.
 */
function syncFromDom(): void {
  const el = imageEl.value
  if (!el || !el.complete) return

  if (el.naturalWidth > 0) {
    status.value = 'loaded'
  } else if (status.value !== 'error') {
    status.value = 'error'
  }
}

onMounted(syncFromDom)

/** A new source is a new load: back to the shimmer, not stuck on the old state. */
watch(
  () => props.src,
  async () => {
    status.value = 'loading'
    await nextTick()
    syncFromDom()
  },
)

/** `16:9` → `16 / 9`. Anything unparseable falls back to the default frame. */
const ratioStyle = computed(() => {
  const match = /^\s*(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)\s*$/.exec(props.ratio)
  const value = match ? `${match[1]} / ${match[2]}` : '4 / 3'
  return { '--myui-image-ratio': value }
})

const classes = computed(() => [
  'myui-image',
  `myui-image--fit-${props.fit}`,
  `myui-image--radius-${props.radius}`,
  { 'myui-image--bordered': props.border },
])

function onLoad(event: Event) {
  status.value = 'loaded'
  emit('load', event)
}

function onError(event: Event) {
  status.value = 'error'
  emit('error', event)
}
</script>

<template>
  <figure :class="classes" :style="ratioStyle">
    <div class="myui-image__frame">
      <img
        v-if="src"
        ref="imageEl"
        class="myui-image__img"
        :class="{ 'myui-image__img--ready': status === 'loaded' }"
        :src="src"
        :alt="alt"
        :loading="lazy ? 'lazy' : 'eager'"
        decoding="async"
        @load="onLoad"
        @error="onError"
      />

      <div v-if="status === 'loading'" class="myui-image__shimmer" aria-hidden="true" />

      <div v-else-if="status === 'error'" class="myui-image__error">
        <slot name="error">
          <svg
            class="myui-image__error-mark"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4 5.5h16q1.5 0 1.5 1.5v10q0 1.5-1.5 1.5H4q-1.5 0-1.5-1.5V7q0-1.5 1.5-1.5Z" />
            <path d="M3 16l5-4.8 4 3.4 3-2.4 6 4.8" />
            <path d="M4 4.5l16 15" />
          </svg>
          <span class="myui-image__error-text">Image lost</span>
        </slot>
      </div>
    </div>

    <figcaption v-if="caption" class="myui-image__caption">{{ caption }}</figcaption>
  </figure>
</template>
