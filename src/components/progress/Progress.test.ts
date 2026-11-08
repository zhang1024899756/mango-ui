import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Progress from './Progress.vue'

describe('MyuiProgress', () => {
  it('exposes a progressbar with its value', () => {
    const wrapper = mount(Progress, { props: { percent: 42, label: 'Loading' } })
    const bar = wrapper.find('[role="progressbar"]')

    expect(bar.exists()).toBe(true)
    expect(bar.attributes('aria-valuenow')).toBe('42')
    expect(bar.attributes('aria-valuemin')).toBe('0')
    expect(bar.attributes('aria-valuemax')).toBe('100')
    expect(bar.attributes('aria-label')).toBe('Loading')
    expect(bar.attributes('aria-valuetext')).toBe('42%')
  })

  it('renders the fill width as a percentage', () => {
    const wrapper = mount(Progress, { props: { percent: 62 } })
    const fill = wrapper.find('.myui-progress__fill')

    expect(fill.attributes('style')).toContain('width: 62%')
  })

  it('clamps values above and below the valid range', () => {
    expect(
      mount(Progress, { props: { percent: 140 } }).find('[role="progressbar"]').attributes('aria-valuenow'),
    ).toBe('100')

    expect(
      mount(Progress, { props: { percent: -20 } }).find('[role="progressbar"]').attributes('aria-valuenow'),
    ).toBe('0')
  })

  it('treats NaN as zero instead of rendering garbage', () => {
    const wrapper = mount(Progress, { props: { percent: Number.NaN } })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')
    expect(wrapper.find('.myui-progress__fill').attributes('style')).toContain('width: 0%')
  })

  it('omits aria-valuenow while indeterminate', () => {
    const wrapper = mount(Progress, { props: { indeterminate: true } })
    const bar = wrapper.find('[role="progressbar"]')

    expect(bar.attributes('aria-valuenow')).toBeUndefined()
    expect(wrapper.find('.myui-progress__sweep').exists()).toBe(true)
    expect(wrapper.find('.myui-progress__fill').exists()).toBe(false)
  })

  it('draws the circle variant with a track and a fill ring', () => {
    const wrapper = mount(Progress, { props: { type: 'circle', percent: 50 } })

    expect(wrapper.find('.myui-progress__ring').exists()).toBe(true)
    expect(wrapper.find('.myui-progress__ring-track').exists()).toBe(true)
    expect(wrapper.find('.myui-progress__ring-fill').exists()).toBe(true)
    expect(wrapper.find('.myui-progress__ring-text').text()).toBe('50%')
  })

  it('hides the label when showText is false', () => {
    const line = mount(Progress, { props: { showText: false } })
    const circle = mount(Progress, { props: { type: 'circle', showText: false } })

    expect(line.find('.myui-progress__text').exists()).toBe(false)
    expect(circle.find('.myui-progress__ring-text').exists()).toBe(false)
  })

  it('maps tone and size onto modifier classes', () => {
    const wrapper = mount(Progress, { props: { tone: 'danger', size: 'lg' } })
    const classes = wrapper.classes()

    expect(classes).toContain('myui-progress--tone-danger')
    expect(classes).toContain('myui-progress--lg')
    expect(classes).toContain('myui-progress--line')
  })
})
