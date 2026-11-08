import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Link from './Link.vue'

describe('MyuiLink', () => {
  it('renders a native anchor with the href', () => {
    const wrapper = mount(Link, { props: { href: '/drops' }, slots: { default: '本周上新' } })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/drops')
    expect(wrapper.text()).toBe('本周上新')
  })

  it('keeps a relative href in the same tab and draws no arrow', () => {
    const wrapper = mount(Link, { props: { href: '/about' } })

    expect(wrapper.attributes('target')).toBeUndefined()
    expect(wrapper.attributes('rel')).toBeUndefined()
    expect(wrapper.find('.myui-link__arrow').exists()).toBe(false)
  })

  it('opens external links in a new tab with noreferrer noopener and an arrow', () => {
    const wrapper = mount(Link, { props: { href: '/out', external: true } })

    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.attributes('rel')).toBe('noreferrer noopener')
    expect(wrapper.find('.myui-link__arrow').exists()).toBe(true)
  })

  it('treats absolute urls as external without the flag', () => {
    const absolute = mount(Link, { props: { href: 'https://example.com/x' } })
    const protocolRelative = mount(Link, { props: { href: '//cdn.example.com/x' } })

    expect(absolute.attributes('target')).toBe('_blank')
    expect(absolute.attributes('rel')).toBe('noreferrer noopener')
    expect(protocolRelative.attributes('target')).toBe('_blank')
  })

  it('lets an explicit target and rel win over the defaults', () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com', target: '_self', rel: 'nofollow' },
    })

    expect(wrapper.attributes('target')).toBe('_self')
    expect(wrapper.attributes('rel')).toBe('nofollow')
  })

  it('maps tone and underline onto modifier classes', () => {
    const wrapper = mount(Link, { props: { href: '/x', tone: 'accent', underline: 'always' } })

    expect(wrapper.classes()).toContain('myui-link--tone-accent')
    expect(wrapper.classes()).toContain('myui-link--underline-always')
  })

  it('blocks navigation and click events while disabled', () => {
    const wrapper = mount(Link, { props: { href: '/drops', disabled: true } })

    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('-1')

    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    wrapper.element.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('emits click when it is active', async () => {
    const wrapper = mount(Link, { props: { href: '/drops' } })
    // jsdom has no navigation implementation — stop the default we are not testing.
    wrapper.element.addEventListener('click', (event: Event) => event.preventDefault())

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders the suffix slot next to the label', () => {
    const wrapper = mount(Link, {
      props: { href: '/drops' },
      slots: { default: '联名系列', suffix: '<span class="count">12</span>' },
    })

    expect(wrapper.find('.myui-link__label').text()).toBe('联名系列')
    expect(wrapper.find('.myui-link__suffix .count').text()).toBe('12')
  })
})
