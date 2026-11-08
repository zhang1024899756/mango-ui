import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Slider from './Slider.vue'

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

/** jsdom has no layout: give the rail a geometry so pointer maths is testable. */
function stubRect(element: HTMLElement, rect: Rect): void {
  element.getBoundingClientRect = () =>
    ({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height,
      x: rect.left,
      y: rect.top,
      toJSON: () => ({}),
    }) as DOMRect
}

function pointer(element: HTMLElement, type: string, clientX: number, clientY = 0): MouseEvent {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX, clientY })
  element.dispatchEvent(event)
  return event
}

function railOf(wrapper: ReturnType<typeof mount>): HTMLElement {
  return wrapper.find('.myui-slider__rail').element as HTMLElement
}

describe('MyuiSlider', () => {
  it('renders one labelled handle with the full aria value set', () => {
    const wrapper = mount(Slider, { props: { modelValue: 40 } })
    const thumbs = wrapper.findAll('[role="slider"]')

    expect(thumbs).toHaveLength(1)
    expect(thumbs[0]?.attributes('aria-valuemin')).toBe('0')
    expect(thumbs[0]?.attributes('aria-valuemax')).toBe('100')
    expect(thumbs[0]?.attributes('aria-valuenow')).toBe('40')
    expect(thumbs[0]?.attributes('aria-valuetext')).toBe('40')
    expect(thumbs[0]?.attributes('aria-label')).toBe('Value')
    expect(thumbs[0]?.attributes('disabled')).toBeUndefined()
  })

  it('turns into two handles for a [lower, upper] pair', () => {
    const wrapper = mount(Slider, { props: { modelValue: [20, 60] } })
    const thumbs = wrapper.findAll('[role="slider"]')

    expect(thumbs).toHaveLength(2)
    expect(thumbs[0]?.attributes('aria-label')).toBe('Lower bound')
    expect(thumbs[1]?.attributes('aria-label')).toBe('Upper bound')
    expect(thumbs[0]?.attributes('aria-valuenow')).toBe('20')
    expect(thumbs[1]?.attributes('aria-valuenow')).toBe('60')
  })

  it('normalises a crossed pair instead of rendering inverted handles', () => {
    const wrapper = mount(Slider, { props: { modelValue: [80, 20] } })
    const thumbs = wrapper.findAll('[role="slider"]')

    expect(thumbs[0]?.attributes('aria-valuenow')).toBe('20')
    expect(thumbs[1]?.attributes('aria-valuenow')).toBe('80')
  })

  it('steps with the arrow keys and fires update + change', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50 } })
    const thumb = wrapper.find('[role="slider"]')

    await thumb.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toEqual([[51]])
    expect(wrapper.emitted('change')).toEqual([[51]])

    await thumb.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([49])
  })

  it('jumps with Home / End and strides with PageUp / PageDown', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, step: 5 } })
    const thumb = wrapper.find('[role="slider"]')

    await thumb.trigger('keydown', { key: 'PageUp' })
    await thumb.trigger('keydown', { key: 'PageDown' })
    await thumb.trigger('keydown', { key: 'Home' })
    await thumb.trigger('keydown', { key: 'End' })

    expect(wrapper.emitted('update:modelValue')).toEqual([[100], [0], [0], [100]])
  })

  it('ignores unrelated keys and cancels the default of handled ones', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50 } })
    const thumb = wrapper.find('[role="slider"]')

    await thumb.trigger('keydown', { key: 'a' })
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })
    thumb.element.dispatchEvent(event)

    expect(wrapper.emitted('update:modelValue')).toEqual([[51]])
    expect(event.defaultPrevented).toBe(true)
  })

  it('never lets the two handles cross', async () => {
    const wrapper = mount(Slider, { props: { modelValue: [20, 30], step: 10 } })
    const thumbs = wrapper.findAll('[role="slider"]')

    await thumbs[0]?.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[30, 30]])

    await thumbs[1]?.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[20, 20]])
  })

  it('turns a click on the track into a value for the nearest handle', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 0 } })
    stubRect(railOf(wrapper), { left: 0, top: 0, width: 200, height: 40 })

    pointer(railOf(wrapper), 'pointerdown', 150)

    expect(wrapper.emitted('update:modelValue')).toEqual([[75]])
  })

  it('drags a handle and only emits change on release', () => {
    const wrapper = mount(Slider, { props: { modelValue: 50 } })
    stubRect(railOf(wrapper), { left: 0, top: 0, width: 200, height: 40 })
    const thumb = wrapper.find('[role="slider"]').element as HTMLElement

    pointer(thumb, 'pointerdown', 100)
    expect(wrapper.emitted('change')).toBeUndefined()

    pointer(wrapper.element as HTMLElement, 'pointermove', 160)
    expect(wrapper.emitted('update:modelValue')).toEqual([[50], [80]])

    pointer(wrapper.element as HTMLElement, 'pointerup', 160)
    expect(wrapper.emitted('change')).toEqual([[80]])
  })

  it('survives a degenerate range without NaN', () => {
    const wrapper = mount(Slider, { props: { modelValue: 5, min: 10, max: 10 } })
    const thumb = wrapper.find('[role="slider"]')
    const style = thumb.attributes('style') ?? ''

    expect(thumb.attributes('aria-valuemin')).toBe('10')
    expect(thumb.attributes('aria-valuemax')).toBe('10')
    expect(thumb.attributes('aria-valuenow')).toBe('10')
    expect(style).not.toContain('NaN')
  })

  it('clamps out-of-range values into the track', () => {
    const wrapper = mount(Slider, { props: { modelValue: 500, min: 0, max: 100 } })
    const thumb = wrapper.find('[role="slider"]')
    const style = thumb.attributes('style') ?? ''

    expect(thumb.attributes('aria-valuenow')).toBe('100')
    expect(style).toContain('left: 100%')
  })

  it('is inert while disabled', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, disabled: true } })
    stubRect(railOf(wrapper), { left: 0, top: 0, width: 200, height: 40 })
    const thumb = wrapper.find('[role="slider"]')

    await thumb.trigger('keydown', { key: 'ArrowRight' })
    pointer(railOf(wrapper), 'pointerdown', 20)

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(thumb.attributes('aria-disabled')).toBe('true')
    expect(thumb.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('myui-slider--disabled')
  })

  it('renders marks and uses their label as aria-valuetext', () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 50, marks: { 0: '冷', 50: '温', 100: '烫' } },
    })

    expect(wrapper.findAll('.myui-slider__mark')).toHaveLength(3)
    expect(wrapper.find('[role="slider"]').attributes('aria-valuetext')).toBe('温')
    expect(wrapper.classes()).toContain('myui-slider--with-marks')
  })

  it('shows the tooltip by default and drops it on request', () => {
    const withTooltip = mount(Slider, { props: { modelValue: 42 } })
    expect(withTooltip.find('.myui-slider__tooltip').text()).toBe('42')

    const without = mount(Slider, { props: { modelValue: 42, showTooltip: false } })
    expect(without.find('.myui-slider__tooltip').exists()).toBe(false)
  })

  it('moves the fill and the handle on the vertical axis', () => {
    const wrapper = mount(Slider, { props: { modelValue: 25, vertical: true } })
    const thumb = wrapper.find('[role="slider"]')

    expect(wrapper.classes()).toContain('myui-slider--vertical')
    expect(thumb.attributes('aria-orientation')).toBe('vertical')
    expect(thumb.attributes('style')).toContain('bottom: 25%')
    expect(wrapper.find('.myui-slider__fill').attributes('style')).toContain('bottom: 0%; height: 25%')
  })

  it('fills a single handle from the start of the track to the value', () => {
    const wrapper = mount(Slider, { props: { modelValue: 30 } })

    expect(wrapper.find('.myui-slider__fill').attributes('style')).toContain('left: 0%; width: 30%')
  })

  it('maps tone onto the root modifier', () => {
    expect(mount(Slider, { props: { tone: 'ink' } }).classes()).toContain('myui-slider--tone-ink')
    expect(mount(Slider).classes()).toContain('myui-slider--tone-accent')
  })
})
