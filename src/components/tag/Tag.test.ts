import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tag from './Tag.vue'

describe('MyuiTag', () => {
  it('renders its label', () => {
    const wrapper = mount(Tag, { slots: { default: 'NEW DROP' } })

    expect(wrapper.text()).toBe('NEW DROP')
    expect(wrapper.classes()).toContain('myui-tag')
  })

  it('maps tone, variant, size and shape onto modifier classes', () => {
    const wrapper = mount(Tag, {
      props: { tone: 'accent', variant: 'solid', size: 'md', shape: 'pill' },
    })
    const classes = wrapper.classes()

    expect(classes).toContain('myui-tag--solid')
    expect(classes).toContain('myui-tag--tone-accent')
    expect(classes).toContain('myui-tag--md')
    expect(classes).toContain('myui-tag--pill')
  })

  it('exposes the active state as a data attribute', () => {
    const active = mount(Tag, { props: { active: true } })
    const idle = mount(Tag)

    expect(active.attributes('data-active')).toBe('true')
    expect(idle.attributes('data-active')).toBeUndefined()
  })

  it('hides the close button unless closable', () => {
    expect(mount(Tag).find('.myui-tag__close').exists()).toBe(false)

    const wrapper = mount(Tag, { props: { closable: true } })
    expect(wrapper.find('.myui-tag__close').exists()).toBe(true)
  })

  it('gives the close button an accessible name', () => {
    const wrapper = mount(Tag, { props: { closable: true } })

    expect(wrapper.find('.myui-tag__close').attributes('aria-label')).toBe('Remove')
  })

  it('emits close with the mouse event and stops propagation', async () => {
    const wrapper = mount(Tag, {
      props: { closable: true },
      attrs: { onClick: () => undefined },
    })

    await wrapper.find('.myui-tag__close').trigger('click')

    const events = wrapper.emitted('close')
    expect(events).toHaveLength(1)
    expect(events?.[0]?.[0]).toBeInstanceOf(MouseEvent)
  })

  it('marks the root as closable for layout purposes', () => {
    const wrapper = mount(Tag, { props: { closable: true } })

    expect(wrapper.attributes('data-closable')).toBe('true')
    expect(wrapper.classes()).toContain('myui-tag--closable')
  })
})
