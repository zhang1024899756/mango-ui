import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Magic from './Magic.vue'

function styleOf(wrapper: ReturnType<typeof mount>): CSSStyleDeclaration {
  return (wrapper.element as HTMLElement).style
}

describe('MyuiMagic', () => {
  it('renders a span wrapper with the default glitch settings and keeps the slot visible', () => {
    const wrapper = mount(Magic, { slots: { default: 'DROP 01' } })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toContain('myui-magic')
    expect(wrapper.classes()).toContain('myui-magic--glitch')
    expect(wrapper.classes()).toContain('myui-magic--normal')
    expect(wrapper.classes()).toContain('is-active')
    expect(wrapper.text()).toBe('DROP 01')
  })

  it('maps mode and speed onto modifier classes and a data attribute', () => {
    const wrapper = mount(Magic, { props: { mode: 'scan', speed: 'fast' } })

    expect(wrapper.classes()).toContain('myui-magic--scan')
    expect(wrapper.classes()).toContain('myui-magic--fast')
    expect(wrapper.attributes('data-mode')).toBe('scan')
  })

  it('drops the active state without removing the wrapper when active is false', () => {
    const wrapper = mount(Magic, { props: { active: false }, slots: { default: 'X' } })

    expect(wrapper.classes()).not.toContain('is-active')
    expect(wrapper.attributes('data-active')).toBe('false')
    expect(wrapper.text()).toBe('X')
  })

  it('renders the scan beam only in scan mode while active', () => {
    const scan = mount(Magic, { props: { mode: 'scan' } })
    const glitch = mount(Magic, { props: { mode: 'glitch' } })
    const idle = mount(Magic, { props: { mode: 'scan', active: false } })

    expect(scan.find('.myui-magic__beam').exists()).toBe(true)
    expect(scan.find('.myui-magic__beam').attributes('aria-hidden')).toBe('true')
    expect(glitch.find('.myui-magic__beam').exists()).toBe(false)
    expect(idle.find('.myui-magic__beam').exists()).toBe(false)
  })

  it('renders `text` instead of the slot, carrying data-text for the split', () => {
    const wrapper = mount(Magic, {
      props: { text: 'GLITCH' },
      slots: { default: 'ignored' },
    })
    const text = wrapper.find('.myui-magic__text')

    expect(text.exists()).toBe(true)
    expect(text.text()).toBe('GLITCH')
    expect(text.attributes('data-text')).toBe('GLITCH')
    expect(wrapper.classes()).toContain('myui-magic--text')
    expect(wrapper.text()).toBe('GLITCH')
  })

  it('publishes channel colours and clamped intensity as CSS custom properties', () => {
    const wrapper = mount(Magic, {
      props: { intensity: 1.4, colorA: 'hotpink', colorB: 'cyan' },
    })
    const style = styleOf(wrapper)

    expect(style.getPropertyValue('--myui-magic-color-a')).toBe('hotpink')
    expect(style.getPropertyValue('--myui-magic-color-b')).toBe('cyan')
    expect(style.getPropertyValue('--myui-magic-intensity')).toBe('1')
  })

  it('falls back to the default intensity when handed a non-number', () => {
    const wrapper = mount(Magic, { props: { intensity: Number.NaN } })

    expect(styleOf(wrapper).getPropertyValue('--myui-magic-intensity')).toBe('0.5')
  })

  it('renders the element named by `as`', () => {
    const wrapper = mount(Magic, { props: { as: 'div' }, slots: { default: 'card' } })

    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('wraps arbitrary content without cloning it', () => {
    const wrapper = mount(Magic, {
      slots: { default: '<button class="inner" type="button">BUY</button>' },
    })

    expect(wrapper.findAll('.inner')).toHaveLength(1)
    expect(wrapper.find('.inner').element.tagName).toBe('BUTTON')
  })
})
