import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Input from './Input.vue'

describe('MyuiInput', () => {
  it('renders a real input with type, placeholder and value', () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'hello', type: 'email', placeholder: 'you@example.com' },
    })
    const field = wrapper.find('input')

    expect(field.exists()).toBe(true)
    expect(field.attributes('type')).toBe('email')
    expect(field.attributes('placeholder')).toBe('you@example.com')
    expect((field.element as HTMLInputElement).value).toBe('hello')
  })

  it('emits update:modelValue with the typed string', async () => {
    const wrapper = mount(Input, { props: { modelValue: '' } })
    const field = wrapper.find('input')

    ;(field.element as HTMLInputElement).value = 'drops'
    await field.trigger('input')

    expect(wrapper.emitted('update:modelValue')).toEqual([['drops']])
  })

  it('maps size and variant onto modifier classes', () => {
    const wrapper = mount(Input, { props: { size: 'lg', variant: 'line' } })

    expect(wrapper.classes()).toContain('myui-input--lg')
    expect(wrapper.classes()).toContain('myui-input--line')
  })

  it('renders the clear button as a real labelled button and clears the value', async () => {
    const wrapper = mount(Input, { props: { modelValue: 'abc', clearable: true } })
    const clear = wrapper.find('button.myui-input__clear')

    expect(clear.exists()).toBe(true)
    expect(clear.element.tagName).toBe('BUTTON')
    expect(clear.attributes('type')).toBe('button')
    expect(clear.attributes('aria-label')).toBe('Clear input')

    await clear.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('hides the clear button when empty, disabled or readonly', () => {
    expect(mount(Input, { props: { modelValue: '', clearable: true } }).find('.myui-input__clear').exists()).toBe(false)
    expect(
      mount(Input, { props: { modelValue: 'abc', clearable: true, disabled: true } })
        .find('.myui-input__clear')
        .exists(),
    ).toBe(false)
    expect(
      mount(Input, { props: { modelValue: 'abc', clearable: true, readonly: true } })
        .find('.myui-input__clear')
        .exists(),
    ).toBe(false)
  })

  it('wires the error message through aria-describedby and aria-invalid', () => {
    const wrapper = mount(Input, { props: { modelValue: '', error: '必填' } })
    const field = wrapper.find('input')
    const error = wrapper.find('.myui-input__error')

    expect(field.attributes('aria-invalid')).toBe('true')
    expect(error.text()).toBe('必填')
    expect(field.attributes('aria-describedby')).toBe(error.attributes('id'))
    expect(wrapper.classes()).toContain('myui-input--invalid')
  })

  it('drops aria-invalid but keeps the wiring when only invalid is set', () => {
    const wrapper = mount(Input, { props: { modelValue: 'x', invalid: true } })

    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('input').attributes('aria-describedby')).toBeUndefined()
    expect(wrapper.find('.myui-input__error').exists()).toBe(false)
  })

  it('announces the character counter politely', () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'abc', maxlength: 10, showCount: true },
    })
    const count = wrapper.find('.myui-input__count')

    expect(count.attributes('aria-live')).toBe('polite')
    expect(count.text()).toBe('3 / 10')
    expect(wrapper.find('input').attributes('maxlength')).toBe('10')
  })

  it('emits enter only for the Enter key, and focus/blur with the native event', async () => {
    const wrapper = mount(Input)
    const field = wrapper.find('input')

    await field.trigger('keydown', { key: 'a' })
    await field.trigger('keydown', { key: 'Enter' })
    await field.trigger('focus')
    await field.trigger('blur')

    expect(wrapper.emitted('enter')).toHaveLength(1)
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(wrapper.classes()).not.toContain('myui-input--focused')
  })

  it('passes undeclared attributes straight through to the native input', () => {
    const wrapper = mount(Input, {
      attrs: { id: 'email', 'aria-label': 'Email address', autocomplete: 'email' },
    })
    const field = wrapper.find('input')

    expect(field.attributes('id')).toBe('email')
    expect(field.attributes('aria-label')).toBe('Email address')
    expect(field.attributes('autocomplete')).toBe('email')
    expect(wrapper.attributes('id')).toBeUndefined()
  })

  it('renders prefix and suffix slots around the field', () => {
    const wrapper = mount(Input, {
      slots: { prefix: '<i class="pre" />', suffix: '<i class="post" />' },
    })

    expect(wrapper.find('.myui-input__affix--prefix .pre').exists()).toBe(true)
    expect(wrapper.find('.myui-input__affix--suffix .post').exists()).toBe(true)
  })

  it('disables the native field and shows the disabled state', () => {
    const wrapper = mount(Input, { props: { disabled: true } })

    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('myui-input--disabled')
  })
})
