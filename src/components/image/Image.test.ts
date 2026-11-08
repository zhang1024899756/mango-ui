import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Image from './Image.vue'

const SRC = 'https://example.com/poster.png'

describe('MyuiImage', () => {
  it('renders a figure with a native image', () => {
    const wrapper = mount(Image, {
      props: { src: SRC, alt: '海报', lazy: false },
    })
    const img = wrapper.find('img')

    expect(wrapper.element.tagName).toBe('FIGURE')
    expect(img.attributes('src')).toBe(SRC)
    expect(img.attributes('alt')).toBe('海报')
    expect(img.attributes('loading')).toBe('eager')
    expect(img.attributes('decoding')).toBe('async')
  })

  it('lazy-loads by default', () => {
    const wrapper = mount(Image, { props: { src: SRC } })

    expect(wrapper.find('img').attributes('loading')).toBe('lazy')
  })

  it('puts the ratio on the container so the box never jumps', () => {
    const wrapper = mount(Image, { props: { src: SRC, ratio: '16:9' } })

    expect(wrapper.attributes('style')).toContain('--myui-image-ratio: 16 / 9')
  })

  it('falls back to 4 / 3 when the ratio is unparseable', () => {
    const wrapper = mount(Image, { props: { src: SRC, ratio: 'wide' } })

    expect(wrapper.attributes('style')).toContain('--myui-image-ratio: 4 / 3')
  })

  it('starts on the shimmer and reveals the photo after load', async () => {
    const wrapper = mount(Image, { props: { src: SRC } })

    expect(wrapper.find('.myui-image__shimmer').exists()).toBe(true)
    expect(wrapper.find('.myui-image__img').classes()).not.toContain('myui-image__img--ready')

    await wrapper.find('img').trigger('load')

    expect(wrapper.find('.myui-image__shimmer').exists()).toBe(false)
    expect(wrapper.find('.myui-image__img').classes()).toContain('myui-image__img--ready')
    expect(wrapper.emitted('load')).toHaveLength(1)
  })

  it('swaps to the error block when the image cannot decode', async () => {
    const wrapper = mount(Image, { props: { src: SRC } })

    await wrapper.find('img').trigger('error')

    expect(wrapper.find('.myui-image__error').exists()).toBe(true)
    expect(wrapper.find('.myui-image__shimmer').exists()).toBe(false)
    expect(wrapper.text()).toContain('Image lost')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('replaces the fallback with the error slot', async () => {
    const wrapper = mount(Image, {
      props: { src: SRC },
      slots: { error: '<span class="custom-error">404</span>' },
    })

    await wrapper.find('img').trigger('error')

    expect(wrapper.find('.custom-error').text()).toBe('404')
    expect(wrapper.text()).not.toContain('Image lost')
  })

  it('shows the skeleton when there is no source at all', () => {
    const wrapper = mount(Image)

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.myui-image__shimmer').exists()).toBe(true)
  })

  it('maps fit, radius and border onto modifier classes', () => {
    const wrapper = mount(Image, {
      props: { src: SRC, fit: 'contain', radius: 'pill', border: false },
    })

    expect(wrapper.classes()).toContain('myui-image--fit-contain')
    expect(wrapper.classes()).toContain('myui-image--radius-pill')
    expect(wrapper.classes()).not.toContain('myui-image--bordered')
  })

  it('renders the caption under the frame', () => {
    const wrapper = mount(Image, { props: { src: SRC, caption: '夜市海报系列' } })

    expect(wrapper.find('figcaption').text()).toBe('夜市海报系列')
  })

  it('returns to the shimmer when the source changes', async () => {
    const wrapper = mount(Image, { props: { src: SRC } })

    await wrapper.find('img').trigger('load')
    await wrapper.setProps({ src: 'https://example.com/next.png' })

    expect(wrapper.find('.myui-image__shimmer').exists()).toBe(true)
    expect(wrapper.find('.myui-image__img').classes()).not.toContain('myui-image__img--ready')
  })

  it('recovers the loaded state when the browser finished before hydration', async () => {
    const wrapper = mount(Image, { props: { src: SRC } })
    const img = wrapper.find('img').element as HTMLImageElement

    // A server-rendered <img> can complete before any load listener exists.
    Object.defineProperty(img, 'complete', { configurable: true, get: () => true })
    Object.defineProperty(img, 'naturalWidth', { configurable: true, get: () => 800 })

    await wrapper.setProps({ src: 'https://example.com/cached.png' })
    await flushPromises()

    expect(wrapper.find('.myui-image__shimmer').exists()).toBe(false)
    expect(wrapper.find('.myui-image__img').classes()).toContain('myui-image__img--ready')
  })

  it('shows the error block when the browser already failed before hydration', async () => {
    const wrapper = mount(Image, { props: { src: SRC } })
    const img = wrapper.find('img').element as HTMLImageElement

    Object.defineProperty(img, 'complete', { configurable: true, get: () => true })
    Object.defineProperty(img, 'naturalWidth', { configurable: true, get: () => 0 })

    await wrapper.setProps({ src: 'https://example.com/dead.png' })
    await flushPromises()

    expect(wrapper.find('.myui-image__error').exists()).toBe(true)
  })
})
