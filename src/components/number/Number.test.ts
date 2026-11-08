import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ICONS } from '../icon/icons'
import NumberText from './Number.vue'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('MyuiNumber', () => {
  it('groups thousands by default', () => {
    const wrapper = mount(NumberText, { props: { value: 1234567 } })

    expect(wrapper.find('.myui-number__digits').text()).toBe('1,234,567')
  })

  it('applies fixed precision, and can drop the separator', () => {
    const grouped = mount(NumberText, { props: { value: 1234.5678, precision: 2 } })
    const plain = mount(NumberText, {
      props: { value: 1234.5678, precision: 2, separator: false },
    })

    expect(grouped.text()).toBe('1,234.57')
    expect(plain.text()).toBe('1234.57')
  })

  it('keeps the trailing zeros a precision asks for', () => {
    const wrapper = mount(NumberText, { props: { value: 12.5, precision: 3 } })

    expect(wrapper.text()).toBe('12.500')
  })

  it('signs negative values once', () => {
    const wrapper = mount(NumberText, { props: { value: -1234.5, precision: 1 } })

    expect(wrapper.text()).toBe('-1,234.5')
  })

  it('renders affixes and folds them into the accessible name', () => {
    const wrapper = mount(NumberText, {
      props: { value: 88, prefix: '¥', suffix: '+%' },
    })

    expect(wrapper.find('.myui-number__digits').text()).toBe('88')
    expect(wrapper.findAll('.myui-number__affix')).toHaveLength(2)
    expect(wrapper.attributes('aria-label')).toBe('¥88+%')
  })

  it('maps size and tone onto modifier classes', () => {
    const wrapper = mount(NumberText, { props: { value: 1, size: 'xl', tone: 'accent' } })

    expect(wrapper.classes()).toContain('myui-number--xl')
    expect(wrapper.classes()).toContain('myui-number--tone-accent')
  })

  it('draws no trend indicator unless one is asked for', () => {
    const wrapper = mount(NumberText, { props: { value: 42 } })

    expect(wrapper.find('.myui-number__trend').exists()).toBe(false)
    expect(wrapper.attributes('data-trend')).toBeUndefined()
  })

  it('draws the direction it is told', () => {
    const up = mount(NumberText, { props: { value: 42, trend: 'up' } })
    const down = mount(NumberText, { props: { value: 42, trend: 'down' } })

    expect(up.attributes('data-trend')).toBe('up')
    expect(up.find('.myui-number__trend path').attributes('d')).toBe(ICONS['arrow-up'][0])
    expect(down.attributes('data-trend')).toBe('down')
  })

  it('derives the auto trend from the previous value', async () => {
    const wrapper = mount(NumberText, { props: { value: 100, trend: 'auto' } })

    expect(wrapper.attributes('data-trend')).toBe('flat')

    await wrapper.setProps({ value: 140 })
    expect(wrapper.attributes('data-trend')).toBe('up')

    await wrapper.setProps({ value: 90 })
    expect(wrapper.attributes('data-trend')).toBe('down')
  })

  it('counts up through requestAnimationFrame and cancels on unmount', () => {
    const raf = vi.fn(() => 7)
    const cancel = vi.fn()
    vi.stubGlobal('requestAnimationFrame', raf)
    vi.stubGlobal('cancelAnimationFrame', cancel)

    const wrapper = mount(NumberText, { props: { value: 2400, animated: true } })

    expect(raf).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.myui-number__digits').text()).toBe('0')
    expect(wrapper.attributes('aria-label')).toBe('2,400')

    wrapper.unmount()

    expect(cancel).toHaveBeenCalledWith(7)
  })

  it('does not schedule a frame when animation is off', () => {
    const raf = vi.fn(() => 1)
    vi.stubGlobal('requestAnimationFrame', raf)

    const wrapper = mount(NumberText, { props: { value: 12 } })

    expect(raf).not.toHaveBeenCalled()
    expect(wrapper.find('.myui-number__digits').text()).toBe('12')
  })

  it('snaps to the final value under prefers-reduced-motion', () => {
    const raf = vi.fn(() => 1)
    vi.stubGlobal('requestAnimationFrame', raf)
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query }))

    const wrapper = mount(NumberText, { props: { value: 4200, animated: true } })

    expect(raf).not.toHaveBeenCalled()
    expect(wrapper.find('.myui-number__digits').text()).toBe('4,200')
  })

  it('shears on demand, and only as a class', () => {
    const straight = mount(NumberText, { props: { value: 128 } })
    const sheared = mount(NumberText, { props: { value: 128, skew: true } })

    expect(straight.classes()).not.toContain('myui-number--skew')
    expect(sheared.classes()).toContain('myui-number--skew')
  })

  it('leaves the shear to the stylesheet instead of an inline transform', () => {
    const wrapper = mount(NumberText, { props: { value: 128, skew: true } })

    // --myui-shear carries the angle so the root keeps one transform to compose
    // with; an inline transform here would be the bug this test catches.
    expect(wrapper.attributes('style')).toBeUndefined()
  })

  it('keeps ink by default and adds no spectrum tone', () => {
    const wrapper = mount(NumberText, { props: { value: 128 } })

    expect(wrapper.classes()).toContain('myui-number--tone-ink')
    expect(wrapper.classes()).not.toContain('myui-number--tone-spectrum')
  })

  it('maps the spectrum tone onto its class without hiding the digits', () => {
    const wrapper = mount(NumberText, { props: { value: 128600, tone: 'spectrum' } })

    expect(wrapper.classes()).toContain('myui-number--tone-spectrum')
    expect(wrapper.find('.myui-number__digits').text()).toBe('128,600')
  })

  it('keeps the trend arrow and its direction under spectrum', () => {
    const wrapper = mount(NumberText, { props: { value: 128, tone: 'spectrum', trend: 'up' } })

    // The arrow keeps its own shape — colour is never the only channel, and the
    // direction glyph must not be flipped into a mirrored arrow.
    expect(wrapper.attributes('data-trend')).toBe('up')
    expect(wrapper.find('.myui-number__trend path').attributes('d')).toBe(ICONS['arrow-up'][0])
    expect(wrapper.find('.myui-number__trend').attributes('aria-hidden')).toBe('true')
  })

  it('keeps affixes solid and in the accessible name under spectrum', () => {
    const wrapper = mount(NumberText, {
      props: { value: 499, prefix: '¥', suffix: '+12%', tone: 'spectrum' },
    })

    expect(wrapper.findAll('.myui-number__affix')).toHaveLength(2)
    expect(wrapper.attributes('aria-label')).toBe('¥499+12%')
  })
})
