import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Neon from './Neon.vue'

function styleOf(wrapper: ReturnType<typeof mount>): CSSStyleDeclaration {
  return (wrapper.element as HTMLElement).style
}

describe('MyuiNeon', () => {
  it('renders a span wrapper that is already lit by default', () => {
    const wrapper = mount(Neon, { slots: { default: 'DROP 01' } })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toContain('myui-neon')
    expect(wrapper.classes()).toContain('myui-neon--glow')
    expect(wrapper.classes()).toContain('myui-neon--normal')
    expect(wrapper.classes()).toContain('is-active')
    expect(wrapper.text()).toBe('DROP 01')
  })

  it('maps mode and speed onto modifier classes and a data attribute', () => {
    const wrapper = mount(Neon, { props: { mode: 'scan', speed: 'fast' } })

    expect(wrapper.classes()).toContain('myui-neon--scan')
    expect(wrapper.classes()).toContain('myui-neon--fast')
    expect(wrapper.attributes('data-mode')).toBe('scan')
  })

  it('drops the active state without removing the wrapper when active is false', () => {
    const wrapper = mount(Neon, { props: { active: false }, slots: { default: 'X' } })

    expect(wrapper.classes()).not.toContain('is-active')
    expect(wrapper.attributes('data-active')).toBe('false')
    expect(wrapper.text()).toBe('X')
  })

  it('renders the scan beam only in scan mode while lit', () => {
    const scan = mount(Neon, { props: { mode: 'scan' } })
    const glow = mount(Neon, { props: { mode: 'glow' } })
    const idle = mount(Neon, { props: { mode: 'scan', active: false } })

    expect(scan.find('.myui-neon__beam').exists()).toBe(true)
    expect(scan.find('.myui-neon__beam').attributes('aria-hidden')).toBe('true')
    expect(glow.find('.myui-neon__beam').exists()).toBe(false)
    expect(idle.find('.myui-neon__beam').exists()).toBe(false)
  })

  it('renders `text` instead of the slot, without duplicating the glyphs', () => {
    const wrapper = mount(Neon, {
      props: { text: 'NEON' },
      slots: { default: 'ignored' },
    })
    const text = wrapper.find('.myui-neon__text')

    expect(text.exists()).toBe(true)
    expect(text.text()).toBe('NEON')
    expect(wrapper.classes()).toContain('myui-neon--text')
    // One copy, not three: the old glitch duplicated glyphs through ::before with
    // attr(data-text), and that whole mechanism is gone.
    expect(wrapper.text()).toBe('NEON')
    expect(text.attributes('data-text')).toBeUndefined()
  })

  it('publishes tube colours and clamped intensity as CSS custom properties', () => {
    const wrapper = mount(Neon, {
      props: { intensity: 1.4, colorA: 'hotpink', colorB: 'cyan' },
    })
    const style = styleOf(wrapper)

    expect(style.getPropertyValue('--myui-neon-color-a')).toBe('hotpink')
    expect(style.getPropertyValue('--myui-neon-color-b')).toBe('cyan')
    expect(style.getPropertyValue('--myui-neon-intensity')).toBe('1')
  })

  it('clamps intensity below zero and falls back when handed a non-number', () => {
    const negative = mount(Neon, { props: { intensity: -3 } })
    const broken = mount(Neon, { props: { intensity: Number.NaN } })

    expect(styleOf(negative).getPropertyValue('--myui-neon-intensity')).toBe('0')
    expect(styleOf(broken).getPropertyValue('--myui-neon-intensity')).toBe('0.5')
  })

  it('renders the element named by `as`', () => {
    const wrapper = mount(Neon, { props: { as: 'div' }, slots: { default: 'card' } })

    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('wraps arbitrary content without cloning it', () => {
    const wrapper = mount(Neon, {
      slots: { default: '<button class="inner" type="button">BUY</button>' },
    })

    expect(wrapper.findAll('.inner')).toHaveLength(1)
    expect(wrapper.find('.inner').element.tagName).toBe('BUTTON')
  })
})
