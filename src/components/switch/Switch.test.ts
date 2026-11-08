import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Switch from './Switch.vue'

/** The shape rules are pure CSS and jsdom ships no cascade, so a rule's *source*
 *  is the only way to pin "this declaration exists". Behaviour is asserted
 *  separately on the rendered component; these helpers only back it up. */
const scss = readFileSync(resolve(process.cwd(), 'src/components/switch/styles/switch.scss'), 'utf8')

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

describe('MyuiSwitch', () => {
  it('renders a native button with role=switch', () => {
    const wrapper = mount(Switch)

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.attributes('role')).toBe('switch')
    expect(wrapper.attributes('aria-checked')).toBe('false')
  })

  it('reports aria-checked from the model and activeValue', () => {
    expect(mount(Switch, { props: { modelValue: true } }).attributes('aria-checked')).toBe('true')
    expect(mount(Switch, { props: { modelValue: false } }).attributes('aria-checked')).toBe('false')
    expect(
      mount(Switch, {
        props: { modelValue: 'on', activeValue: 'on', inactiveValue: 'off' },
      }).attributes('aria-checked'),
    ).toBe('true')
  })

  it('emits update:modelValue and change with the default true/false pair', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.emitted('change')).toEqual([[true]])
  })

  it('round-trips custom activeValue / inactiveValue', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: 'off', activeValue: 'on', inactiveValue: 'off' },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['on']])
    expect(wrapper.emitted('change')).toEqual([['on']])
  })

  it('toggles on Space and Enter, and cancels the native key default', () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })
    const element = wrapper.element as HTMLElement

    const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
    element.dispatchEvent(space)
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    element.dispatchEvent(enter)

    expect(space.defaultPrevented).toBe(true)
    expect(enter.defaultPrevented).toBe(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true], [true]])
  })

  it('ignores clicks while disabled and marks itself invisible to interaction', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false, disabled: true } })

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.classes()).toContain('myui-switch--disabled')
  })

  it('blocks interaction while loading and renders the spinner', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false, loading: true } })

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.myui-switch__spinner').exists()).toBe(true)
  })

  it('labels itself from activeText / inactiveText via aria-labelledby', () => {
    const wrapper = mount(Switch, {
      props: { modelValue: true, activeText: '已上架', inactiveText: '已下架' },
    })
    const label = wrapper.find('.myui-switch__label')

    expect(label.text()).toBe('已上架')
    expect(wrapper.attributes('aria-labelledby')).toBe(label.attributes('id'))
    expect(wrapper.classes()).toContain('myui-switch--with-text')
  })

  it('maps size and checked onto modifier classes', () => {
    const wrapper = mount(Switch, { props: { modelValue: true, size: 'sm' } })

    expect(wrapper.classes()).toContain('myui-switch--sm')
    expect(wrapper.classes()).toContain('myui-switch--checked')
  })

  it('lets an aria-label fall through to the button itself', () => {
    const wrapper = mount(Switch, { attrs: { 'aria-label': '夜览模式' } })

    expect(wrapper.attributes('aria-label')).toBe('夜览模式')
  })

  it('maps skew and tone onto modifier classes, defaulting to the accent tone', () => {
    const plain = mount(Switch)
    expect(plain.classes()).toContain('myui-switch--tone-accent')
    expect(plain.classes()).not.toContain('myui-switch--skew')

    expect(mount(Switch, { props: { skew: true } }).classes()).toContain('myui-switch--skew')

    const spectrum = mount(Switch, { props: { tone: 'spectrum' } })
    expect(spectrum.classes()).toContain('myui-switch--tone-spectrum')
    expect(spectrum.classes()).not.toContain('myui-switch--tone-accent')
  })

  it('stacks both forms on one element, so the stylesheet has to resolve four states at once', () => {
    const wrapper = mount(Switch, {
      props: { skew: true, tone: 'spectrum', disabled: true, modelValue: true },
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'myui-switch--skew',
        'myui-switch--tone-spectrum',
        'myui-switch--disabled',
        'myui-switch--checked',
      ]),
    )
    // Disabled still blocks the interaction regardless of the shape classes.
    wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('keeps disabled ahead of the spectrum tone in the cascade', () => {
    const disabled = ruleBody('.myui-switch--disabled.myui-switch--checked .myui-switch__track')

    expect(disabled).toContain('background-color: var(--myui-color-surface-deep)')
    // Equal specificity to the spectrum rule, so source order settles it — and
    // the image needs switching off explicitly, the colour alone would not.
    expect(disabled).toContain('background-image: none')
    expect(scss.indexOf('.myui-switch--disabled.myui-switch--checked')).toBeGreaterThan(
      scss.indexOf('.myui-switch--tone-spectrum.myui-switch--checked'),
    )
  })

  it('shears the track and leaves the root and the label alone', () => {
    const wrapper = mount(Switch, { props: { skew: true, activeText: 'ON', inactiveText: 'OFF' } })

    // Behaviour: the root is untouched — no inline transform, and the label is a
    // sibling of the track rather than something inside the sheared box.
    expect((wrapper.element as HTMLElement).style.transform).toBe('')
    expect(wrapper.find('.myui-switch__label').element.parentElement).toBe(wrapper.element)

    const track = ruleBody('.myui-switch--skew .myui-switch__track')
    expect(track).toContain('@include myui-shear-on')
    expect(track).toContain('transform: var(--myui-shear)')
    expect(track).toContain('border-radius: var(--myui-radius-none)')
    // The shear widens the painted box past the layout box; clipping shaves corners.
    expect(track).toContain('overflow: visible')

    expect(scss).not.toMatch(/\.myui-switch--skew \.myui-switch__label/)
    expect(ruleBody('.myui-switch')).not.toContain('skew')
  })

  it('squares the thumb without shearing it a second time', () => {
    const wrapper = mount(Switch, { props: { skew: true, modelValue: true } })
    const track = wrapper.find('.myui-switch__track')

    // Behaviour: the thumb really is inside the track, which is what makes it
    // ride the track's shear for free.
    expect(track.find('.myui-switch__thumb').exists()).toBe(true)

    const thumb = ruleBody('.myui-switch--skew .myui-switch__thumb')
    expect(thumb).toContain('border-radius: var(--myui-radius-none)')
    // A child of the track is already painted in the sheared space; another
    // skewX here would stack 12 degrees into 24.
    expect(thumb).not.toContain('skew')
    expect(thumb).not.toContain('transform')
  })

  it('paints the on state with the spectrum and keeps the accent tone flat', () => {
    expect(mount(Switch, { props: { tone: 'spectrum', modelValue: true } }).classes()).toContain(
      'myui-switch--tone-spectrum',
    )

    expect(ruleBody('.myui-switch--tone-spectrum.myui-switch--checked .myui-switch__track')).toContain(
      '@include myui-spectrum-fill',
    )

    // The accent rule stays flat: no gradient leaks into the default tone.
    const accent = ruleBody('.myui-switch--checked .myui-switch__track')
    expect(accent).toContain('background-color: var(--myui-color-accent)')
    expect(accent).not.toContain('background-image')
  })
})
