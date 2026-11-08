<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, useSlots, watch } from 'vue'
import { MyuiButton } from '../button'
import type { DialogProps } from './types'

defineOptions({
  name: 'MyuiDialog',
})

const props = withDefaults(defineProps<DialogProps>(), {
  modelValue: false,
  title: '',
  width: 520,
  closable: true,
  maskClosable: true,
  closeOnEsc: true,
  showFooter: false,
  okText: '确认',
  cancelText: '取消',
  appendToBody: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'open'): void
  (e: 'close'): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const slots = useSlots()
const titleId = useId()
const panelRef = ref<HTMLElement | null>(null)

const hasTitle = computed(() => Boolean(props.title || slots.title))
const panelWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
)

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

/* --- scroll lock, shared by every dialog instance on the page -------------- */
let lockCount = 0
let savedOverflow = ''

function lockScroll(): void {
  if (lockCount === 0) {
    savedOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  lockCount += 1
}

function unlockScroll(): void {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow
  }
}

/* --- focus management ------------------------------------------------------ */
let restoreTarget: HTMLElement | null = null

function focusableNodes(): HTMLElement[] {
  const panel = panelRef.value
  if (!panel) return []
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (node) => node.getClientRects().length > 0,
  )
}

function focusInitial(): void {
  const target = focusableNodes()[0] ?? panelRef.value
  target?.focus({ preventScroll: true })
}

function close(): void {
  if (!props.modelValue) return
  emit('update:modelValue', false)
  emit('close')
}

function onScrimClick(): void {
  if (props.maskClosable) close()
}

function onCancelClick(): void {
  emit('cancel')
  close()
}

function onConfirmClick(): void {
  emit('confirm')
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.closeOnEsc) {
    event.stopPropagation()
    close()
    return
  }

  if (event.key !== 'Tab') return

  const panel = panelRef.value
  if (!panel) return

  const nodes = focusableNodes()
  if (nodes.length === 0) {
    event.preventDefault()
    panel.focus({ preventScroll: true })
    return
  }

  const first = nodes[0]
  const last = nodes[nodes.length - 1]
  const active = document.activeElement as HTMLElement | null
  const inside = active ? panel.contains(active) : false

  if (!event.shiftKey && (!inside || active === last)) {
    event.preventDefault()
    first?.focus()
  } else if (event.shiftKey && (!inside || active === first)) {
    event.preventDefault()
    last?.focus()
  }
}

let wasOpen = false

watch(
  () => props.modelValue,
  async (open) => {
    if (open === wasOpen) return
    wasOpen = open

    if (open) {
      restoreTarget =
        document.activeElement instanceof HTMLElement ? document.activeElement : null
      lockScroll()
      emit('open')
      await nextTick()
      focusInitial()
      return
    }

    unlockScroll()
    if (restoreTarget?.isConnected) {
      restoreTarget.focus({ preventScroll: true })
    }
    restoreTarget = null
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (props.modelValue) unlockScroll()
})

if (import.meta.env.DEV && !props.title && !slots.title) {
  console.warn(
    '[MangoUI] MyuiDialog: pass `title` or a #title slot so the dialog has an accessible name.',
  )
}
</script>

<template>
  <Teleport to="body" :disabled="!appendToBody">
    <Transition name="myui-dialog">
      <div v-if="modelValue" class="myui-dialog" @keydown="onKeydown">
        <div class="myui-dialog__scrim" @click="onScrimClick" />

        <div
          ref="panelRef"
          class="myui-dialog__panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="hasTitle ? titleId : undefined"
          :style="{ width: panelWidth }"
          tabindex="-1"
        >
          <header v-if="hasTitle || closable" class="myui-dialog__header">
            <h2 v-if="hasTitle" :id="titleId" class="myui-dialog__title">
              <slot name="title">{{ title }}</slot>
            </h2>
            <button
              v-if="closable"
              type="button"
              class="myui-dialog__close"
              aria-label="Close"
              @click="close"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </header>

          <div class="myui-dialog__body">
            <slot />
          </div>

          <footer v-if="showFooter || $slots.footer" class="myui-dialog__footer">
            <slot name="footer">
              <MyuiButton variant="ghost" tone="ink" @click="onCancelClick">
                {{ cancelText }}
              </MyuiButton>
              <MyuiButton @click="onConfirmClick">{{ okText }}</MyuiButton>
            </slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
