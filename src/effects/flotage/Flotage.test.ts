import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Flotage from './Flotage.vue'

function styleOf(wrapper: { element: unknown }): CSSStyleDeclaration {
  return (wrapper.element as HTMLElement).style
}

describe('MyuiFlotage', () => {
  it('renders a span wrapper that floats on the y axis by default', () => {
    const wrapper = mount(Flotage, { slots: { default: '限量' } })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toContain('myui-flotage')
    expect(wrapper.classes()).toContain('myui-flotage--axis-y')
    expect(wrapper.classes()).not.toContain('myui-flotage--hover')
    expect(wrapper.classes()).not.toContain('is-disabled')
    expect(wrapper.text()).toBe('限量')
  })

  it('floats at a visible amplitude out of the box', () => {
    const wrapper = mount(Flotage, { slots: { default: '限量' } })

    // 8px was a breath, not a float — the default has to be seen.
    expect(styleOf(wrapper).getPropertyValue('--myui-flotage-amplitude')).toBe('16')
  })

  it('maps every axis onto a modifier class and a data attribute', () => {
    const x = mount(Flotage, { props: { axis: 'x' } })
    const rotate = mount(Flotage, { props: { axis: 'rotate' } })

    expect(x.classes()).toContain('myui-flotage--axis-x')
    expect(x.attributes('data-axis')).toBe('x')
    expect(rotate.classes()).toContain('myui-flotage--axis-rotate')
    expect(rotate.attributes('data-axis')).toBe('rotate')
  })

  it('publishes amplitude, duration and delay as CSS custom properties', () => {
    const wrapper = mount(Flotage, {
      props: { amplitude: 24, duration: 6.5, delay: 1.5 },
    })
    const style = styleOf(wrapper)

    expect(style.getPropertyValue('--myui-flotage-amplitude')).toBe('24')
    expect(style.getPropertyValue('--myui-flotage-duration')).toBe('6.5s')
    expect(style.getPropertyValue('--myui-flotage-delay')).toBe('1.5s')
  })

  it('marks the hover trigger, which keeps the wrapper still until pointed at', () => {
    const wrapper = mount(Flotage, { props: { trigger: 'hover' } })

    expect(wrapper.classes()).toContain('myui-flotage--hover')
    expect(wrapper.attributes('data-trigger')).toBe('hover')
  })

  it('pins the wrapper when disabled, without disabling its content', () => {
    const wrapper = mount(Flotage, {
      props: { disabled: true },
      slots: { default: '<button class="inner" type="button">BUY</button>' },
    })

    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.attributes('data-disabled')).toBe('true')
    expect(wrapper.find('.inner').attributes('disabled')).toBeUndefined()
  })

  it('renders the element named by `as`', () => {
    const wrapper = mount(Flotage, { props: { as: 'div' }, slots: { default: 'card' } })

    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('wraps arbitrary content without cloning it', () => {
    const wrapper = mount(Flotage, {
      slots: { default: '<a class="inner" href="/drops">drops</a>' },
    })

    expect(wrapper.findAll('.inner')).toHaveLength(1)
    expect(wrapper.find('.inner').attributes('href')).toBe('/drops')
  })

  it('sanitises numbers instead of writing them into CSS', () => {
    const wrapper = mount(Flotage, {
      props: { amplitude: -12, duration: 0, delay: Number.NaN },
    })
    const style = styleOf(wrapper)

    expect(style.getPropertyValue('--myui-flotage-amplitude')).toBe('0')
    expect(style.getPropertyValue('--myui-flotage-duration')).toBe('0.1s')
    expect(style.getPropertyValue('--myui-flotage-delay')).toBe('0s')
  })

  it('keeps the CSS variables in sync when the props change', async () => {
    const wrapper = mount(Flotage, { props: { amplitude: 8 } })

    await wrapper.setProps({ amplitude: 32, duration: 2 })

    expect(styleOf(wrapper).getPropertyValue('--myui-flotage-amplitude')).toBe('32')
    expect(styleOf(wrapper).getPropertyValue('--myui-flotage-duration')).toBe('2s')
  })

  it('respects the system motion preference by default', () => {
    const wrapper = mount(Flotage)

    expect(wrapper.attributes('data-motion-preference')).toBe('system')
    expect(wrapper.classes()).not.toContain('myui-flotage--force-motion')
  })

  it('opts out of the reduced-motion pin when asked to always animate', () => {
    const forced = mount(Flotage, { props: { motionPreference: 'always' } })

    expect(forced.attributes('data-motion-preference')).toBe('always')
    expect(forced.classes()).toContain('myui-flotage--force-motion')
  })
})
