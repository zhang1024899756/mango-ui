import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Text from './Text.vue'

describe('MyuiText', () => {
  it('renders a span by default and keeps the slot text', () => {
    const wrapper = mount(Text, { slots: { default: 'NIGHT MARKET' } })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.text()).toBe('NIGHT MARKET')
    expect(wrapper.classes()).toContain('myui-text')
  })

  it('renders the tag given by `as`', () => {
    const heading = mount(Text, { props: { as: 'h2' }, slots: { default: 'Drop 07' } })
    const paragraph = mount(Text, { props: { as: 'p' }, slots: { default: 'copy' } })

    expect(heading.element.tagName).toBe('H2')
    expect(paragraph.element.tagName).toBe('P')
  })

  it('maps each voice onto its class', () => {
    for (const variant of ['display', 'eyebrow', 'body', 'mono'] as const) {
      const wrapper = mount(Text, { props: { variant } })

      expect(wrapper.classes()).toContain(`myui-text--${variant}`)
    }
  })

  it('ships one default setting per voice', () => {
    const display = mount(Text, { props: { variant: 'display' } })
    const eyebrow = mount(Text, { props: { variant: 'eyebrow' } })
    const body = mount(Text)
    const mono = mount(Text, { props: { variant: 'mono' } })

    // display: large, heavy, closed up
    expect(display.classes()).toContain('myui-text--size-2xl')
    expect(display.classes()).toContain('myui-text--weight-black')
    expect(display.classes()).toContain('myui-text--leading-tight')
    expect(display.classes()).toContain('myui-text--tracking-tight')
    expect(display.classes()).not.toContain('myui-text--uppercase')

    // eyebrow: the HUD stamp — small, bold, opened up, uppercase
    expect(eyebrow.classes()).toContain('myui-text--size-xs')
    expect(eyebrow.classes()).toContain('myui-text--weight-bold')
    expect(eyebrow.classes()).toContain('myui-text--tracking-wide')
    expect(eyebrow.classes()).toContain('myui-text--uppercase')

    // body: the documented default of md
    expect(body.classes()).toContain('myui-text--size-md')
    expect(body.classes()).toContain('myui-text--leading-normal')
    expect(body.classes()).toContain('myui-text--tracking-normal')

    // mono: one step down, tracked out, never uppercased
    expect(mono.classes()).toContain('myui-text--size-sm')
    expect(mono.classes()).toContain('myui-text--weight-medium')
    expect(mono.classes()).not.toContain('myui-text--uppercase')
  })

  it('lets every explicit typographic prop override the voice default', () => {
    const wrapper = mount(Text, {
      props: {
        variant: 'display',
        size: 'lg',
        weight: 'regular',
        leading: 'relaxed',
        tracking: 'wide',
        transform: 'uppercase',
      },
    })
    const classes = wrapper.classes()

    expect(classes).toContain('myui-text--size-lg')
    expect(classes).toContain('myui-text--weight-regular')
    expect(classes).toContain('myui-text--leading-relaxed')
    expect(classes).toContain('myui-text--tracking-wide')
    expect(classes).toContain('myui-text--uppercase')
    expect(classes).not.toContain('myui-text--weight-black')
    expect(classes).not.toContain('myui-text--tracking-tight')
  })

  it('can switch the uppercase of the eyebrow voice off', () => {
    const wrapper = mount(Text, { props: { variant: 'eyebrow', transform: 'none' } })

    expect(wrapper.classes()).not.toContain('myui-text--uppercase')
  })

  it('maps tone and align onto classes', () => {
    const wrapper = mount(Text, { props: { tone: 'danger', align: 'center' } })

    expect(wrapper.classes()).toContain('myui-text--tone-danger')
    expect(wrapper.classes()).toContain('myui-text--align-center')
  })

  it('clamps one line with nowrap truncation', () => {
    const wrapper = mount(Text, { props: { truncate: 1 } })

    expect(wrapper.classes()).toContain('myui-text--truncate')
    expect(wrapper.classes()).not.toContain('myui-text--clamp')
    expect(wrapper.element.style.getPropertyValue('--myui-text-clamp')).toBe('')
  })

  it('clamps several lines with the line count on the element', () => {
    const wrapper = mount(Text, { props: { truncate: 3 } })

    expect(wrapper.classes()).toContain('myui-text--clamp')
    expect(wrapper.classes()).not.toContain('myui-text--truncate')
    expect(wrapper.element.style.getPropertyValue('--myui-text-clamp')).toBe('3')
  })

  it('ignores a line count that cannot be a line count', () => {
    for (const truncate of [0, -2, Number.NaN]) {
      const wrapper = mount(Text, { props: { truncate } })

      expect(wrapper.classes()).not.toContain('myui-text--truncate')
      expect(wrapper.classes()).not.toContain('myui-text--clamp')
    }
  })

  it('toggles the neon glow', () => {
    const lit = mount(Text, { props: { glow: true } })
    const dark = mount(Text)

    expect(lit.classes()).toContain('myui-text--glow')
    expect(dark.classes()).not.toContain('myui-text--glow')
  })

  it('renders the inline suffix beside the default slot', () => {
    const wrapper = mount(Text, {
      slots: { default: '128', suffix: 'TB' },
    })

    expect(wrapper.find('.myui-text__part').exists()).toBe(true)
    expect(wrapper.find('.myui-text__part').text()).toBe('TB')
    expect(wrapper.text()).toBe('128TB')
  })

  it('leaves no suffix element when the slot is unused', () => {
    const wrapper = mount(Text, { slots: { default: 'No unit here' } })

    expect(wrapper.find('.myui-text__part').exists()).toBe(false)
  })
})
