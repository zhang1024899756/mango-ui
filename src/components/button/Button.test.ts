import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from './Button.vue'

describe('MyuiButton', () => {
  it('renders a native button by default', () => {
    const wrapper = mount(Button, { slots: { default: 'Click' } })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.text()).toBe('Click')
  })

  it('renders an anchor as soon as href is present', () => {
    const wrapper = mount(Button, { props: { href: '/drops' } })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/drops')
  })

  it('adds noreferrer noopener for target=_blank links', () => {
    const wrapper = mount(Button, {
      props: { href: 'https://example.com', target: '_blank' },
    })

    expect(wrapper.attributes('rel')).toBe('noreferrer noopener')
  })

  it('emits click when active', async () => {
    const wrapper = mount(Button)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('blocks click events while disabled', async () => {
    const wrapper = mount(Button, { props: { disabled: true } })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('flags aria-busy and blocks clicks while loading', async () => {
    const wrapper = mount(Button, { props: { loading: true } })

    await wrapper.trigger('click')

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.find('.myui-button__spinner').exists()).toBe(true)
  })

  it('maps variant, tone, size and shape onto modifier classes', () => {
    const wrapper = mount(Button, {
      props: { variant: 'outline', tone: 'danger', size: 'lg', shape: 'pill' },
    })
    const classes = wrapper.classes()

    expect(classes).toContain('myui-button--outline')
    expect(classes).toContain('myui-button--tone-danger')
    expect(classes).toContain('myui-button--lg')
    expect(classes).toContain('myui-button--pill')
  })

  it('only applies the hard shadow to solid and outline variants', () => {
    const solid = mount(Button, { props: { variant: 'solid' } })
    const ghost = mount(Button, { props: { variant: 'ghost' } })

    expect(solid.classes()).toContain('myui-button--shadow')
    expect(ghost.classes()).not.toContain('myui-button--shadow')
  })

  it('renders prefix, suffix and default slots together', () => {
    const wrapper = mount(Button, {
      slots: {
        prefix: '<i class="pre" />',
        default: 'Label',
        suffix: '<i class="post" />',
      },
    })

    expect(wrapper.find('.pre').exists()).toBe(true)
    expect(wrapper.find('.post').exists()).toBe(true)
    expect(wrapper.find('.myui-button__label').text()).toBe('Label')
  })

  it('adds the skew form class without disturbing the other modifiers', () => {
    const wrapper = mount(Button, { props: { skew: true, variant: 'outline', size: 'sm' } })
    const classes = wrapper.classes()

    expect(classes).toContain('myui-button--skew')
    expect(classes).toContain('myui-button--outline')
    expect(classes).toContain('myui-button--sm')
    expect(mount(Button).classes()).not.toContain('myui-button--skew')
  })

  it('accepts spectrum as a tone and does not become the default', () => {
    const spectrum = mount(Button, { props: { tone: 'spectrum' } })

    expect(spectrum.classes()).toContain('myui-button--tone-spectrum')
    expect(mount(Button).classes()).toContain('myui-button--tone-accent')
  })

  it('keeps the skew form on a disabled button', () => {
    // Disabled drops the glow, never the shape: the placeholder must still read
    // as the same control.
    const wrapper = mount(Button, { props: { skew: true, disabled: true } })

    expect(wrapper.classes()).toContain('myui-button--skew')
    expect(wrapper.classes()).toContain('is-disabled')
  })
})
