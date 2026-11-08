import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import Slider from './Slider.vue'

/** The shape rules are pure CSS and jsdom ships no cascade, so a rule's *source*
 *  is the only way to pin "this declaration exists". Behaviour is asserted
 *  separately on the rendered component; these helpers only back it up. */
const scss = readFileSync(resolve(process.cwd(), 'src/components/slider/styles/slider.scss'), 'utf8')

/** Collapse whitespace so the assertions survive reformatting. */
const flat = (source: string): string => source.replace(/\s+/g, ' ')

/** Declarations of the first rule whose selector matches, whitespace-flattened.
 *  The selector is matched literally, so `:where(...)` needs no escaping. */
function ruleBody(selector: string): string {
  const literal = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = new RegExp(`^\\s*${literal}\\s*\\{`, 'm').exec(scss)
  if (!match) throw new Error(`stylesheet has no rule for ${selector}`)
  const open = scss.indexOf('{', match.index)
  return flat(scss.slice(open + 1, scss.indexOf('}', open)))
}

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

  it('maps skew and the extended tone onto root modifiers, defaulting to accent', () => {
    const plain = mount(Slider)
    expect(plain.classes()).toContain('myui-slider--tone-accent')
    expect(plain.classes()).not.toContain('myui-slider--skew')

    expect(mount(Slider, { props: { skew: true } }).classes()).toContain('myui-slider--skew')
    expect(mount(Slider, { props: { tone: 'spectrum' } }).classes()).toContain(
      'myui-slider--tone-spectrum',
    )
    // The two new forms are independent, so they compose with each other and
    // with the existing orientation modifier.
    const both = mount(Slider, { props: { skew: true, tone: 'spectrum', vertical: true } })
    expect(both.classes()).toEqual(
      expect.arrayContaining([
        'myui-slider--skew',
        'myui-slider--tone-spectrum',
        'myui-slider--vertical',
      ]),
    )
  })

  it('composes the shear into every two-axis handle transform', () => {
    // base, hover, vertical, vertical hover and the two reduced-motion overrides
    const twoAxis = [...scss.matchAll(/transform\s*:\s*(translate\([^;]*?)\s*;/g)].map((m) => m[1])

    expect(twoAxis).toHaveLength(6)
    twoAxis.forEach((value) => expect(value).toContain('var(--myui-shear)'))

    const sheet = flat(scss)
    expect(sheet).toContain('transform: translate(-50%, -50%) var(--myui-shear);')
    expect(sheet).toContain('transform: translate(-50%, -50%) scale(1.08) var(--myui-shear);')
    expect(sheet).toContain('transform: translate(-50%, 50%) var(--myui-shear);')
    expect(sheet).toContain('transform: translate(-50%, 50%) scale(1.08) var(--myui-shear);')
  })

  it('keeps the shear through hover and the reduced-motion override', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, skew: true } })
    stubRect(railOf(wrapper), { left: 0, top: 0, width: 200, height: 40 })
    const thumb = wrapper.find('[role="slider"]')

    // Behaviour: dragging is what puts the handle into its active state, so the
    // hover/active rule really is reachable while the skew modifier is on.
    pointer(thumb.element as HTMLElement, 'pointerdown', 100)
    await nextTick()
    expect(thumb.classes()).toContain('is-active')
    expect(wrapper.classes()).toContain('myui-slider--skew')

    const motionSafe = scss.slice(scss.indexOf('@include myui-motion-safe'))
    expect(flat(motionSafe)).toContain('transform: translate(-50%, -50%) var(--myui-shear);')
    expect(flat(motionSafe)).toContain('transform: translate(-50%, 50%) var(--myui-shear);')
    // The scale is what gets dropped under reduced motion, not the shape.
    expect(motionSafe).not.toContain('scale(')
  })

  it('squares only the handle and leaves the track level', () => {
    const wrapper = mount(Slider, { props: { modelValue: 40, skew: true, tone: 'spectrum' } })

    // Behaviour: one handle, the fill is still a plain filled span, and nothing
    // but the thumb carries the skew modifier's shape.
    expect(wrapper.findAll('[role="slider"]')).toHaveLength(1)
    expect(wrapper.find('.myui-slider__fill').attributes('style')).toContain('width: 40%')

    const thumb = ruleBody('.myui-slider--skew .myui-slider__thumb')
    expect(thumb).toContain('border-radius: var(--myui-radius-none)')
    // The shear arrives through the inherited variable, so the rule itself
    // carries no transform.
    expect(thumb).not.toContain('transform')

    expect(scss).not.toMatch(/\.myui-slider--skew \.myui-slider__line/)
    expect(scss).not.toMatch(/\.myui-slider--skew \.myui-slider__fill/)
  })

  it('fills the spectrum along the drag axis and goes flat when disabled', () => {
    const flatFill = mount(Slider, { props: { modelValue: 40, tone: 'spectrum' } })
    expect(flatFill.classes()).toContain('myui-slider--tone-spectrum')

    const vertical = mount(Slider, { props: { modelValue: 40, tone: 'spectrum', vertical: true } })
    expect(vertical.classes()).toEqual(
      expect.arrayContaining(['myui-slider--tone-spectrum', 'myui-slider--vertical']),
    )

    const inert = mount(Slider, {
      props: { modelValue: 40, tone: 'spectrum', vertical: true, disabled: true },
    })
    expect(inert.classes()).toEqual(
      expect.arrayContaining(['myui-slider--tone-spectrum', 'myui-slider--vertical', 'myui-slider--disabled']),
    )

    expect(ruleBody('.myui-slider--tone-spectrum .myui-slider__fill')).toContain(
      '@include myui-spectrum-fill',
    )
    // A vertical bar takes the 180deg twin, not the 100deg diagonal.
    expect(
      ruleBody('.myui-slider--tone-spectrum:where(.myui-slider--vertical) .myui-slider__fill'),
    ).toContain('var(--myui-gradient-spectrum-vertical)')

    const disabled = ruleBody('.myui-slider--disabled .myui-slider__fill')
    expect(disabled).toContain('background-color: var(--myui-color-text-faint)')
    expect(disabled).toContain('background-image: none')
    // Lower specificity than the tone rules, so the state rules must come last.
    expect(scss.indexOf('.myui-slider--disabled .myui-slider__fill')).toBeGreaterThan(
      scss.indexOf('.myui-slider--tone-spectrum:where(.myui-slider--vertical)'),
    )
  })

  it('declares one shear slot on the root and leaves the value bubble out of it', () => {
    expect(ruleBody('.myui-slider')).toContain('@include myui-shear-slot')
    expect(ruleBody('.myui-slider--skew')).toContain('@include myui-shear-on')

    const wrapper = mount(Slider, { props: { modelValue: 42, skew: true } })
    expect(wrapper.find('.myui-slider__tooltip').text()).toBe('42')

    const tooltip = ruleBody('.myui-slider__tooltip')
    expect(tooltip).toContain('transform: translateX(-50%)')
    // Deliberate, measured in the browser: counter-skewing leaves the bubble
    // ~6.7px off the handle's centre, which reads worse than the shared lean.
    expect(tooltip).not.toContain('skew')
    expect(scss).not.toMatch(/@include\s+myui-shear-upright/)
  })

  it('stays inert with the new forms on when disabled', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 50, skew: true, tone: 'spectrum', vertical: true, disabled: true },
    })
    stubRect(railOf(wrapper), { left: 0, top: 0, width: 200, height: 40 })
    const thumb = wrapper.find('[role="slider"]')

    await thumb.trigger('keydown', { key: 'ArrowRight' })
    pointer(railOf(wrapper), 'pointerdown', 20)

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(thumb.attributes('aria-disabled')).toBe('true')
  })
})
