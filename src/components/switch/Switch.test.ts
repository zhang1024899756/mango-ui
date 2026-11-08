import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Switch from './Switch.vue'

describe('MyuiSwitch', () => {
  it('renders a native button with role=switch', () => {
    const wrapper = mount(Switch)

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.attributes('role')).toBe('switch')
    expect(wrapper.attributes('aria-checked')).toBe('false')
  })

  it('reports aria-checked from the model and activeValue', () => {
    expect(mount(Switch, { props: { modelValue: true } }).attributes('aria-checked')).toBe('true')
    expect(mount(Switch, { props: { modelValue: false } }).attributes('aria-checked')).toBe('false')
    expect(
      mount(Switch, {
        props: { modelValue: 'on', activeValue: 'on', inactiveValue: 'off' },
      }).attributes('aria-checked'),
    ).toBe('true')
  })

  it('emits update:modelValue and change with the default true/false pair', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.emitted('change')).toEqual([[true]])
  })

  it('round-trips custom activeValue / inactiveValue', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: 'off', activeValue: 'on', inactiveValue: 'off' },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['on']])
    expect(wrapper.emitted('change')).toEqual([['on']])
  })

  it('toggles on Space and Enter, and cancels the native key default', () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })
    const element = wrapper.element as HTMLElement

    const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
    element.dispatchEvent(space)
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    element.dispatchEvent(enter)

    expect(space.defaultPrevented).toBe(true)
    expect(enter.defaultPrevented).toBe(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true], [true]])
  })

  it('ignores clicks while disabled and marks itself invisible to interaction', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false, disabled: true } })

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.classes()).toContain('myui-switch--disabled')
  })

  it('blocks interaction while loading and renders the spinner', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false, loading: true } })

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.myui-switch__spinner').exists()).toBe(true)
  })

  it('labels itself from activeText / inactiveText via aria-labelledby', () => {
    const wrapper = mount(Switch, {
      props: { modelValue: true, activeText: '已上架', inactiveText: '已下架' },
    })
    const label = wrapper.find('.myui-switch__label')

    expect(label.text()).toBe('已上架')
    expect(wrapper.attributes('aria-labelledby')).toBe(label.attributes('id'))
    expect(wrapper.classes()).toContain('myui-switch--with-text')
  })

  it('maps size and checked onto modifier classes', () => {
    const wrapper = mount(Switch, { props: { modelValue: true, size: 'sm' } })

    expect(wrapper.classes()).toContain('myui-switch--sm')
    expect(wrapper.classes()).toContain('myui-switch--checked')
  })

  it('lets an aria-label fall through to the button itself', () => {
    const wrapper = mount(Switch, { attrs: { 'aria-label': '夜览模式' } })

    expect(wrapper.attributes('aria-label')).toBe('夜览模式')
  })
})
