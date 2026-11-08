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
})
