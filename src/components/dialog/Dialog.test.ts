import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import Dialog from './Dialog.vue'

const mounted: VueWrapper[] = []

function mountDialog(
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
): VueWrapper {
  const wrapper = mount(Dialog, {
    props: { modelValue: true, appendToBody: false, ...props },
    slots,
    attachTo: document.body,
  })
  mounted.push(wrapper)
  return wrapper
}

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount()
  document.body.style.overflow = ''
})

describe('MyuiDialog', () => {
  it('renders nothing while closed', () => {
    const wrapper = mountDialog({ modelValue: false, title: 'Hidden' })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('renders a modal dialog labelled by its title', () => {
    const wrapper = mountDialog({ title: '加入俱乐部' })
    const dialog = wrapper.find('[role="dialog"]')
    const labelId = dialog.attributes('aria-labelledby')

    expect(dialog.exists()).toBe(true)
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(labelId).toBeTruthy()
    expect(wrapper.find(`#${labelId}`).text()).toBe('加入俱乐部')
  })

  it('supports a title slot without a title prop', () => {
    const wrapper = mountDialog({}, { title: '<span class="custom-title">自定义标题</span>' })

    expect(wrapper.find('.custom-title').exists()).toBe(true)
  })

  it('emits update:modelValue=false and close from the close button', async () => {
    const wrapper = mountDialog({ title: 'Close me' })

    await wrapper.find('.myui-dialog__close').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('closes on Escape when closeOnEsc is on', async () => {
    const wrapper = mountDialog({ title: 'Esc' })

    await wrapper.find('.myui-dialog').trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('ignores Escape when closeOnEsc is off', async () => {
    const wrapper = mountDialog({ title: 'Esc', closeOnEsc: false })

    await wrapper.find('.myui-dialog').trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('closes on scrim click only when maskClosable', async () => {
    const dismissable = mountDialog({ title: 'Scrim' })
    await dismissable.find('.myui-dialog__scrim').trigger('click')
    expect(dismissable.emitted('update:modelValue')?.[0]).toEqual([false])

    const locked = mountDialog({ title: 'Scrim', maskClosable: false })
    await locked.find('.myui-dialog__scrim').trigger('click')
    expect(locked.emitted('update:modelValue')).toBeUndefined()
  })

  it('locks body scroll while open and restores it on close', async () => {
    const wrapper = mountDialog({ title: 'Scroll' })

    expect(document.body.style.overflow).toBe('hidden')

    await wrapper.setProps({ modelValue: false })

    expect(document.body.style.overflow).toBe('')
  })

  it('moves focus into the panel when opened', async () => {
    const wrapper = mountDialog({ modelValue: false, title: 'Focus' })
    await wrapper.setProps({ modelValue: true })
    await new Promise((resolve) => setTimeout(resolve, 0))

    const panel = wrapper.find('[role="dialog"]').element
    expect(panel.contains(document.activeElement)).toBe(true)
  })

  it('emits confirm and renders the default footer', async () => {
    const wrapper = mountDialog({ title: 'Footer', showFooter: true })
    const buttons = wrapper.findAll('.myui-dialog__footer button')

    expect(buttons).toHaveLength(2)

    await buttons[1]?.trigger('click')

    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  it('emits cancel and closes from the default cancel action', async () => {
    const wrapper = mountDialog({ title: 'Footer', showFooter: true })
    const buttons = wrapper.findAll('.myui-dialog__footer button')

    await buttons[0]?.trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('accepts a numeric width as px and a string verbatim', () => {
    const numeric = mountDialog({ title: 'W', width: 320 })
    expect(numeric.find('.myui-dialog__panel').attributes('style')).toContain('width: 320px')

    const custom = mountDialog({ title: 'W', width: '60vw' })
    expect(custom.find('.myui-dialog__panel').attributes('style')).toContain('width: 60vw')
  })

  it('hides the close button when not closable', () => {
    const wrapper = mountDialog({ title: 'No close', closable: false })

    expect(wrapper.find('.myui-dialog__close').exists()).toBe(false)
  })
})
