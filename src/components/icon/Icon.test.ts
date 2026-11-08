import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Icon from './Icon.vue'
import { ICONS, ICON_NAMES } from './icons'

describe('MyuiIcon', () => {
  it('draws every path of the named glyph on a 24 grid', () => {
    const wrapper = mount(Icon, { props: { name: 'star' } })

    expect(wrapper.element.tagName.toLowerCase()).toBe('svg')
    expect(wrapper.attributes('viewBox')).toBe('0 0 24 24')
    expect(wrapper.attributes('fill')).toBe('none')
    expect(wrapper.findAll('path')).toHaveLength(ICONS.star.length)
    expect(wrapper.find('path').attributes('d')).toBe(ICONS.star[0])
  })

  it('ships the full built-in set', () => {
    expect(ICON_NAMES.length).toBeGreaterThanOrEqual(24)
    expect(ICON_NAMES).toContain('external-link')
    expect(ICON_NAMES).toContain('sparkle')
  })

  it('is decorative unless it is given an accessible name', () => {
    const decorative = mount(Icon, { props: { name: 'check' } })

    expect(decorative.attributes('aria-hidden')).toBe('true')
    expect(decorative.attributes('role')).toBeUndefined()

    const named = mount(Icon, {
      props: { name: 'check' },
      attrs: { 'aria-label': '完成' },
    })

    expect(named.attributes('aria-hidden')).toBeUndefined()
    expect(named.attributes('role')).toBe('img')
    expect(named.attributes('aria-label')).toBe('完成')
  })

  it('maps size onto a modifier class', () => {
    const wrapper = mount(Icon, { props: { name: 'plus', size: 'lg' } })

    expect(wrapper.classes()).toContain('myui-icon--lg')
  })

  it('applies the colour and the shared stroke weight', () => {
    const wrapper = mount(Icon, {
      props: { name: 'plus', color: 'rgb(1, 2, 3)', strokeWidth: 2.25 },
    })

    expect(wrapper.element.style.color).toBe('rgb(1, 2, 3)')
    expect(wrapper.attributes('stroke-width')).toBe('2.25')
    expect(wrapper.attributes('stroke-linecap')).toBe('round')
    expect(wrapper.attributes('stroke-linejoin')).toBe('round')
  })

  it('spins only when asked', () => {
    const still = mount(Icon, { props: { name: 'settings' } })
    const spinning = mount(Icon, { props: { name: 'settings', spin: true } })

    expect(still.classes()).not.toContain('myui-icon--spin')
    expect(spinning.classes()).toContain('myui-icon--spin')
  })

  it('renders a custom svg through the default slot when no name is given', () => {
    const wrapper = mount(Icon, {
      slots: { default: '<circle class="custom" cx="12" cy="12" r="8" />' },
    })

    expect(wrapper.find('circle.custom').exists()).toBe(true)
    expect(wrapper.findAll('path')).toHaveLength(0)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })
})
