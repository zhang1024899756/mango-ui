import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MyuiImage } from './index'

/** An inline poster — the demo never depends on the network. */
const DEMO_SVG = [
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'>",
  "<rect width='800' height='600' fill='#ff4d1a'/>",
  "<rect x='48' y='48' width='704' height='504' fill='none' stroke='#101012' stroke-width='6'/>",
  "<g fill='#101012' font-family='Arial Black, Arial, sans-serif' font-weight='900' letter-spacing='-6'>",
  "<text x='80' y='290' font-size='132'>MANGO</text>",
  "<text x='82' y='420' font-size='132'>UI</text>",
  '</g>',
  "<rect x='80' y='470' width='300' height='16' fill='#101012'/>",
  "<circle cx='660' cy='480' r='48' fill='#101012'/>",
  '</svg>',
].join('')

const DEMO_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(DEMO_SVG)}`

/** A malformed payload: the only state worth demoing with a guaranteed failure. */
const BROKEN_IMAGE = 'data:image/png;base64,AAAA'

const meta = {
  title: 'Elements/Image',
  component: MyuiImage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A frame first, a photo second. The aspect ratio is on the container, so the shimmer, the ' +
          'photo and the error block occupy the same box — nothing on the page ever jumps while an ' +
          'image is loading.',
      },
    },
  },
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    ratio: { control: 'text' },
    fit: { control: 'inline-radio', options: ['cover', 'contain'] },
    radius: { control: 'inline-radio', options: ['none', 'pill'] },
    border: { control: 'boolean' },
    lazy: { control: 'boolean' },
    caption: { control: 'text' },
  },
  args: {
    src: DEMO_IMAGE,
    alt: 'Mango UI 海报',
    ratio: '4:3',
    fit: 'cover',
    radius: 'none',
    border: true,
    lazy: true,
  },
} satisfies Meta<typeof MyuiImage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { MyuiImage },
    setup: () => ({ args }),
    template: '<div style="width:320px"><myui-image v-bind="args" /></div>',
  }),
}

export const Ratios: Story = {
  render: (args) => ({
    components: { MyuiImage },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-4); align-items:flex-start">
        <div style="width:200px"><myui-image v-bind="args" ratio="16:9" /></div>
        <div style="width:160px"><myui-image v-bind="args" ratio="1:1" /></div>
        <div style="width:200px"><myui-image v-bind="args" ratio="4:3" /></div>
      </div>
    `,
  }),
}

export const Contain: Story = {
  args: { fit: 'contain' },
  render: Default.render,
}

export const NoBorder: Story = {
  args: { border: false },
  render: Default.render,
}

export const Pill: Story = {
  args: { radius: 'pill' },
  render: Default.render,
}

export const WithCaption: Story = {
  args: { caption: '2026 春夏 · 夜市海报系列' },
  render: Default.render,
}

export const Loading: Story = {
  args: { src: undefined },
  parameters: {
    docs: {
      description: {
        story:
          'No pixels yet — the frame still holds `4:3`, so the page around it will not reflow when the photo lands.',
      },
    },
  },
  render: Default.render,
}

export const Error: Story = {
  args: { src: BROKEN_IMAGE },
  parameters: {
    docs: {
      description: {
        story: 'A payload that cannot decode. The fallback is replaceable through the `#error` slot.',
      },
    },
  },
  render: Default.render,
}

export const ErrorSlot: Story = {
  name: 'Error (custom slot)',
  args: { src: BROKEN_IMAGE },
  render: (args) => ({
    components: { MyuiImage },
    setup: () => ({ args }),
    template: `
      <div style="width:320px">
        <myui-image v-bind="args">
          <template #error>
            <div style="display:flex; flex-direction:column; align-items:center; gap:var(--myui-space-2)">
              <strong style="font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-tight)">404</strong>
              <span style="font-size:var(--myui-text-xs); letter-spacing:var(--myui-tracking-wide); text-transform:uppercase">
                这张图走丢了
              </span>
            </div>
          </template>
        </myui-image>
      </div>
    `,
  }),
}
