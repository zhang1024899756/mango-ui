import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import GlitchRipple from './GlitchRipple.vue'

/**
 * jsdom has no ResizeObserver and no real layout. The component guards on the
 * observer, so it has to be stubbed for the unmount assertion; `measure()` has a
 * font-size fallback, which is why nothing here asserts a positive unit size.
 */
class FakeResizeObserver {
  static instances: FakeResizeObserver[] = []

  observe = vi.fn()
  disconnect = vi.fn()

  constructor() {
    FakeResizeObserver.instances.push(this)
  }
}

function stubMatchMedia(matches: boolean): void {
  const list = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }
  vi.stubGlobal('matchMedia', vi.fn(() => list))
}

/**
 * The filter is written as an inline style attribute, so the assertion reads the
 * attribute rather than `element.style.filter`: what matters is what Vue put on
 * the element, not what this jsdom build happens to parse. jsdom re-serialises
 * `url(…)` with quotes (`url("#id")`), so quotes are normalised away first.
 */
function contentStyle(wrapper: ReturnType<typeof mount>): string {
  const raw = String(wrapper.find('.myui-glitch-ripple__content').attributes('style') ?? '')
  return raw.replace(/"/g, '')
}

/**
 * SVG attributes keep their camelCase names in the DOM; read them off the element
 * so the assertion does not depend on how the test-utils wrapper lists them, and
 * tolerate a lowercased attribute in an HTML-parsed build.
 */
function read(el: Element, name: string): string | null {
  return el.getAttribute(name) ?? el.getAttribute(name.toLowerCase())
}

let rafSpy: ReturnType<typeof vi.spyOn>
let cancelSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  FakeResizeObserver.instances = []
  vi.stubGlobal('ResizeObserver', FakeResizeObserver)
  stubMatchMedia(false)

  // Fake handles only: running the callback would schedule the next frame and the
  // loop would keep going after the test ended.
  let handle = 0
  rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => {
    handle += 1
    return handle
  })
  cancelSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('MyuiGlitchRipple', () => {
  it('renders a span wrapper with the default preset and the slot inside the content box', () => {
    const wrapper = mount(GlitchRipple, { slots: { default: 'SIGNAL LOST' } })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toContain('myui-glitch-ripple')
    expect(wrapper.classes()).toContain('myui-glitch-ripple--normal')
    expect(wrapper.classes()).toContain('myui-glitch-ripple--auto')
    expect(wrapper.classes()).toContain('is-active')
    expect(wrapper.classes()).toContain('is-distorting')
    // The payload lives inside __content: that is the box the filter paints.
    expect(wrapper.find('.myui-glitch-ripple__content').text()).toBe('SIGNAL LOST')
  })

  it('renders `text` instead of the slot, inside the same content box', () => {
    const wrapper = mount(GlitchRipple, {
      props: { text: 'NIGHT MARKET' },
      slots: { default: 'ignored' },
    })
    const content = wrapper.find('.myui-glitch-ripple__content')

    expect(content.text()).toBe('NIGHT MARKET')
    expect(wrapper.classes()).toContain('myui-glitch-ripple--text')
    expect(wrapper.text()).toBe('NIGHT MARKET')
  })

  it('publishes intensity, speed, trigger and active on the wrapper', () => {
    const wrapper = mount(GlitchRipple, {
      props: { intensity: 'intense', speed: 'fast', trigger: 'hover', active: false },
    })

    expect(wrapper.classes()).toContain('myui-glitch-ripple--intense')
    expect(wrapper.classes()).toContain('myui-glitch-ripple--fast')
    expect(wrapper.classes()).toContain('myui-glitch-ripple--hover')
    expect(wrapper.attributes('data-intensity')).toBe('intense')
    expect(wrapper.attributes('data-speed')).toBe('fast')
    expect(wrapper.attributes('data-trigger')).toBe('hover')
    expect(wrapper.attributes('data-active')).toBe('false')
    expect(wrapper.classes()).not.toContain('is-active')
  })

  it('renders the element named by `as` and keeps the payload inside it', () => {
    const wrapper = mount(GlitchRipple, { props: { as: 'div' }, slots: { default: 'card' } })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.find('.myui-glitch-ripple__content').text()).toBe('card')
  })

  it('wires the filter as turbulence → component transfer → offset → displacement', () => {
    const wrapper = mount(GlitchRipple)

    const turbulence = wrapper.find('feTurbulence').element
    const transfer = wrapper.find('feComponentTransfer').element
    const offset = wrapper.find('feOffset').element
    const map = wrapper.find('feDisplacementMap').element

    // The chain is the effect: each stage has to hand its result to the next one.
    expect(read(turbulence, 'result')).toBe('field')
    expect(read(transfer, 'in')).toBe('field')
    expect(read(transfer, 'result')).toBe('centered')
    expect(read(offset, 'in')).toBe('centered')
    expect(read(offset, 'result')).toBe('shifted')
    expect(read(map, 'in')).toBe('SourceGraphic')
    expect(read(map, 'in2')).toBe('shifted')

    // Anisotropic on purpose — the low x frequency is what turns this into
    // horizontal bands instead of pixel soup.
    expect(read(turbulence, 'baseFrequency')).toBe('0.002 0.08')
    expect(read(turbulence, 'type')).toBe('fractalNoise')
    expect(read(map, 'xChannelSelector')).toBe('R')
    expect(read(map, 'yChannelSelector')).toBe('G')
  })

  it('zero-means the noise field with the measured channel constants', () => {
    const wrapper = mount(GlitchRipple)
    const red = wrapper.find('feFuncR').element
    const green = wrapper.find('feFuncG').element
    const blue = wrapper.find('feFuncB').element

    // Hard numbers on purpose: these are measurements of this exact turbulence
    // config, not preferences. They are what stops feDisplacementMap (which
    // displaces by `channel − 0.5`) from sliding the whole box one way.
    expect(read(red, 'type')).toBe('linear')
    expect(read(red, 'slope')).toBe('2.45')
    expect(read(red, 'intercept')).toBe('-1.2873')
    expect(read(green, 'slope')).toBe('2.37')
    expect(read(green, 'intercept')).toBe('-1.2280')
    expect(read(blue, 'slope')).toBe('2.37')
    expect(read(blue, 'intercept')).toBe('-1.2280')

    // …and the derivation, so a future edit that changes a slope without
    // re-measuring the mean fails here instead of shipping a floating box.
    // intercept = 0.5 − slope × measured mean
    const meanRed = 0.7295
    const meanGreen = 0.7291
    expect(Number(read(red, 'intercept'))).toBeCloseTo(0.5 - 2.45 * meanRed, 4)
    expect(Number(read(green, 'intercept'))).toBeCloseTo(0.5 - 2.37 * meanGreen, 4)
    // The dimmer channel groups must stay in step with each other.
    expect(read(blue, 'intercept')).toBe(read(green, 'intercept'))

    // Alpha is not part of the displacement and must not be touched.
    expect(read(wrapper.find('feFuncA').element, 'type')).toBe('identity')
  })

  it('keeps the paint server zero-sized and hidden from assistive tech', () => {
    const wrapper = mount(GlitchRipple)
    const svg = wrapper.find('svg.myui-glitch-ripple__filter')

    expect(svg.exists()).toBe(true)
    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('width')).toBe('0')
    expect(svg.attributes('height')).toBe('0')
  })

  it('gives every instance its own filter id', () => {
    // Same app on purpose: useId() is per-app, so two separate mounts would both
    // start at the same seed and this assertion would prove nothing.
    const Pair = defineComponent({
      render: () => h('div', [h(GlitchRipple, { text: 'A' }), h(GlitchRipple, { text: 'B' })]),
    })
    const wrapper = mount(Pair)

    const ids = wrapper.findAll('filter').map((node) => node.attributes('id'))
    const refs = wrapper
      .findAll('.myui-glitch-ripple__content')
      .map((node) => String(node.attributes('style') ?? '').replace(/"/g, ''))

    expect(ids).toHaveLength(2)
    expect(ids[0]).toBeTruthy()
    expect(ids[0]).not.toBe(ids[1])
    // Each box points at its own id, not at a shared one.
    expect(refs[0]).toContain(`url(#${ids[0]})`)
    expect(refs[1]).toContain(`url(#${ids[1]})`)
  })

  it('paints the content undistorted when active is false and stops the loop', () => {
    const wrapper = mount(GlitchRipple, { props: { active: false }, slots: { default: 'X' } })

    expect(contentStyle(wrapper)).not.toContain('url(')
    expect(wrapper.classes()).not.toContain('is-distorting')
    expect(rafSpy).not.toHaveBeenCalled()
  })

  it('wires the filter to the content while it is live', () => {
    const wrapper = mount(GlitchRipple)

    expect(contentStyle(wrapper)).toMatch(/filter:\s*url\(#myui-glitch-ripple-/)
    expect(rafSpy).toHaveBeenCalled()
  })

  it('holds a hover trigger clean until the pointer enters the wrapper', async () => {
    const wrapper = mount(GlitchRipple, { props: { trigger: 'hover' } })

    expect(contentStyle(wrapper)).not.toContain('url(')
    expect(wrapper.classes()).not.toContain('is-distorting')
    expect(rafSpy).not.toHaveBeenCalled()

    await wrapper.trigger('mouseenter')

    expect(contentStyle(wrapper)).toContain('url(')
    expect(wrapper.classes()).toContain('is-distorting')
    expect(rafSpy).toHaveBeenCalled()

    await wrapper.trigger('mouseleave')

    expect(contentStyle(wrapper)).not.toContain('url(')
  })

  it('also opens the gate on keyboard focus', async () => {
    const wrapper = mount(GlitchRipple, { props: { trigger: 'hover' } })

    await wrapper.trigger('focusin')
    expect(contentStyle(wrapper)).toContain('url(')

    await wrapper.trigger('focusout')
    expect(contentStyle(wrapper)).not.toContain('url(')
  })

  it('freezes instead of animating when the system asks for reduced motion', async () => {
    stubMatchMedia(true)
    const wrapper = mount(GlitchRipple)
    // `reduced` is read in onMounted, so the class list only settles next tick.
    await nextTick()

    // No frame loop at all…
    expect(rafSpy).not.toHaveBeenCalled()
    // …but the filter is still on the content: a still-warped frame, not plain text.
    expect(contentStyle(wrapper)).toContain('url(')
    expect(wrapper.classes()).toContain('is-distorting')
    // The CSS layers (tremble + flicker) are switched off with it.
    expect(wrapper.classes()).not.toContain('is-animating')
  })

  it('animates anyway under reduced motion when motionPreference is always', () => {
    stubMatchMedia(true)
    const wrapper = mount(GlitchRipple, { props: { motionPreference: 'always' } })

    expect(wrapper.classes()).toContain('myui-glitch-ripple--force-motion')
    expect(rafSpy).toHaveBeenCalled()
    expect(contentStyle(wrapper)).toContain('url(')
  })

  it('marks the CSS layers as animating while the ripple is live', () => {
    // is-animating is the gate for the two keyframe layers — the tremble and the
    // flicker — so this class is what makes the content shiver at all.
    const wrapper = mount(GlitchRipple)

    expect(wrapper.classes()).toContain('is-animating')
    expect(wrapper.classes()).toContain('is-distorting')
  })

  it('drops the tremble and flicker layers when the effect is switched off', () => {
    const wrapper = mount(GlitchRipple, { props: { active: false } })

    expect(wrapper.classes()).not.toContain('is-animating')
    expect(wrapper.classes()).not.toContain('is-distorting')
  })

  it('gates the tremble and flicker layers on the same hover condition as the ripple', async () => {
    const wrapper = mount(GlitchRipple, { props: { trigger: 'hover' } })

    expect(wrapper.classes()).not.toContain('is-animating')

    await wrapper.trigger('mouseenter')
    expect(wrapper.classes()).toContain('is-animating')

    await wrapper.trigger('mouseleave')
    expect(wrapper.classes()).not.toContain('is-animating')
  })

  it('keeps the tremble and flicker layers running under reduced motion when forced', async () => {
    stubMatchMedia(true)
    const wrapper = mount(GlitchRipple, { props: { motionPreference: 'always' } })
    await nextTick()

    // `always` opts out of all three layers' freeze, not just the JS one.
    expect(wrapper.classes()).toContain('is-animating')
    expect(rafSpy).toHaveBeenCalled()
  })

  it('cancels the frame loop and drops the observer on unmount', () => {
    const wrapper = mount(GlitchRipple)
    const observer = FakeResizeObserver.instances[0]

    expect(rafSpy).toHaveBeenCalledTimes(1)
    expect(observer.observe).toHaveBeenCalled()

    wrapper.unmount()

    expect(cancelSpy).toHaveBeenCalledTimes(1)
    expect(observer.disconnect).toHaveBeenCalledTimes(1)
  })
})
