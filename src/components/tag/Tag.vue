<script setup lang="ts">
import { computed } from 'vue'
import type { TagProps } from './types'

defineOptions({
  name: 'MyuiTag',
})

const props = withDefaults(defineProps<TagProps>(), {
  tone: 'neutral',
  variant: 'outline',
  size: 'sm',
  shape: 'rect',
  skew: false,
  closable: false,
  active: false,
})

const emit = defineEmits<{
  (e: 'close', event: MouseEvent): void
}>()

const classes = computed(() => [
  'myui-tag',
  `myui-tag--${props.variant}`,
  `myui-tag--tone-${props.tone}`,
  `myui-tag--${props.size}`,
  `myui-tag--${props.shape}`,
  { 'myui-tag--closable': props.closable, 'myui-tag--skew': props.skew },
])

function onClose(event: MouseEvent) {
  emit('close', event)
}
</script>

<template>
  <span
    :class="classes"
    :data-active="active ? 'true' : undefined"
    :data-closable="closable ? 'true' : undefined"
  >
    <span class="myui-tag__label"><slot /></span>
    <button
      v-if="closable"
      type="button"
      class="myui-tag__close"
      aria-label="Remove"
      @click.stop="onClose"
    >
      <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true" focusable="false">
        <path
          d="M6 6l12 12M18 6L6 18"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </span>
</template>
