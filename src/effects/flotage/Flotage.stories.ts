import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MyuiButton } from '../../components/button'
import { MyuiFlotage } from './index'

const meta = {
  title: 'Effects/Flotage',
  component: MyuiFlotage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A wrapper that drifts, so a sticker, a badge, a button or a whole card never quite sits still. ' +
          'The motion is composite — travel plus a slow sway and a sub-1% scale breath, off-axis half-cycles — ' +
          'so it reads as a float rather than a straight line. Transform only: it never reflows the page around ' +
          'it. `trigger="hover"` keeps it pinned until the pointer or keyboard focus arrives, and ' +
          'prefers-reduced-motion pins it for good.',
      },
    },
  },
  argTypes: {
    axis: { control: 'inline-radio', options: ['y', 'x', 'rotate'] },
    amplitude: { control: { type: 'range', min: 0, max: 40, step: 1 } },
    duration: { control: { type: 'range', min: 1, max: 12, step: 0.5 } },
    delay: { control: { type: 'range', min: 0, max: 4, step: 0.25 } },
    trigger: { control: 'inline-radio', options: ['auto', 'hover'] },
    disabled: { control: 'boolean' },
    as: { control: 'text' },
  },
  args: {
    axis: 'y',
    amplitude: 16,
    duration: 4,
    delay: 0,
    trigger: 'auto',
    disabled: false,
    as: 'span',
  },
} satisfies Meta<typeof MyuiFlotage>

export default meta
type Story = StoryObj<typeof meta>

export const Float: Story = {
  render: (args) => ({
    components: { MyuiFlotage },
    setup: () => ({ args }),
    template: '<myui-flotage v-bind="args">限量 03</myui-flotage>',
  }),
}

export const DriftX: Story = {
  name: 'Drift (x)',
  args: { axis: 'x', amplitude: 12 },
  render: Float.render,
}

export const Rotate: Story = {
  args: { axis: 'rotate', amplitude: 6, duration: 6 },
  render: Float.render,
}

export const Axes: Story = {
  render: (args) => ({
    components: { MyuiFlotage },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-6); flex-wrap:wrap; align-items:center">
        <myui-flotage v-bind="args" axis="y">Y · 上下</myui-flotage>
        <myui-flotage v-bind="args" axis="x">X · 左右</myui-flotage>
        <myui-flotage v-bind="args" axis="rotate">ROTATE · 倾斜</myui-flotage>
      </div>
    `,
  }),
}

export const Amplitude: Story = {
  render: (args) => ({
    components: { MyuiFlotage },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-6); flex-wrap:wrap; align-items:center">
        <myui-flotage v-bind="args" :amplitude="4">4px</myui-flotage>
        <myui-flotage v-bind="args" :amplitude="16">16px</myui-flotage>
        <myui-flotage v-bind="args" :amplitude="32">32px</myui-flotage>
      </div>
    `,
  }),
}

export const Delayed: Story = {
  name: 'Staggered delays',
  render: (args) => ({
    components: { MyuiFlotage },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-4); flex-wrap:wrap; align-items:center">
        <myui-flotage v-bind="args" :delay="0">00</myui-flotage>
        <myui-flotage v-bind="args" :delay="0.3">03</myui-flotage>
        <myui-flotage v-bind="args" :delay="0.6">06</myui-flotage>
        <myui-flotage v-bind="args" :delay="0.9">09</myui-flotage>
      </div>
    `,
  }),
}

export const HoverTrigger: Story = {
  name: 'Hover trigger',
  args: { trigger: 'hover', amplitude: 12 },
  render: (args) => ({
    components: { MyuiFlotage },
    setup: () => ({ args }),
    template: `
      <myui-flotage v-bind="args">
        <myui-button tone="ink" shadow>把指针放上来</myui-button>
      </myui-flotage>
    `,
  }),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: Float.render,
}

export const WrapsAButton: Story = {
  name: 'Wraps a button',
  args: { amplitude: 10, duration: 5 },
  render: (args) => ({
    components: { MyuiFlotage, MyuiButton },
    setup: () => ({ args }),
    template: `
      <myui-flotage v-bind="args">
        <myui-button size="lg">立即抢购</myui-button>
      </myui-flotage>
    `,
  }),
}

export const WrapsACard: Story = {
  name: 'Wraps a card',
  args: { amplitude: 14, duration: 7 },
  render: (args) => ({
    components: { MyuiFlotage },
    setup: () => ({ args }),
    template: `
      <myui-flotage v-bind="args">
        <div style="width:280px; padding:var(--myui-space-5); background-color:var(--myui-color-surface); border:var(--myui-border-width) solid var(--myui-color-line); box-shadow:var(--myui-shadow-glow)">
          <div style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-tight)">NIGHT MARKET</div>
          <p style="margin:var(--myui-space-2) 0 0; font-size:var(--myui-text-sm); color:var(--myui-color-text-soft)">整块卡片一起漂浮。</p>
        </div>
      </myui-flotage>
    `,
  }),
}
