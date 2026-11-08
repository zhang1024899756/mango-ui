import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MyuiButton } from '../../components/button'
import { MyuiNeon } from './index'

/**
 * Inline poster asset for the `<img>` demo. It is a picture, not UI chrome, so it
 * carries the palette as literal paint rather than as tokens — the same three
 * values the token file uses.
 */
const posterImage =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160">' +
      '<rect width="240" height="160" fill="#05070d"/>' +
      '<rect x="8" y="8" width="224" height="144" fill="none" stroke="#19e0ff" stroke-width="2"/>' +
      '<text x="20" y="92" font-family="Arial Black, sans-serif" font-size="42" fill="#dbe9f4">MANGO</text>' +
      '<text x="20" y="136" font-family="Arial Black, sans-serif" font-size="42" fill="#19e0ff">NEON</text>' +
      '</svg>',
  )

const meta = {
  title: 'Effects/Neon',
  component: MyuiNeon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A neon tube that wraps anything: a text node, a <MyuiButton>, an <img>, a whole card. ' +
          'The glow is a plain rule — `filter: drop-shadow()` stacked three deep on the painted ' +
          'silhouette — so the element still reads as neon with every animation switched off; the ' +
          'three modes only modulate it. Text mode lights the glyphs themselves with stacked text ' +
          'shadows instead. Nothing is duplicated, nothing is positioned absolutely, and reduced ' +
          'motion keeps the light while stopping the movement.',
      },
    },
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['glow', 'flicker', 'scan'] },
    speed: { control: 'inline-radio', options: ['slow', 'normal', 'fast'] },
    active: { control: 'boolean' },
    intensity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    colorA: { control: 'color' },
    colorB: { control: 'color' },
    text: { control: 'text' },
    as: { control: 'text' },
  },
  args: {
    mode: 'glow',
    speed: 'normal',
    active: true,
    intensity: 0.5,
    as: 'span',
  },
} satisfies Meta<typeof MyuiNeon>

export default meta
type Story = StoryObj<typeof meta>

export const Glow: Story = {
  args: { text: 'MANGO UI' },
  render: (args) => ({
    components: { MyuiNeon },
    setup: () => ({ args }),
    template: '<myui-neon v-bind="args" />',
  }),
}

export const Flicker: Story = {
  args: { mode: 'flicker', text: 'MANGO UI' },
  render: Glow.render,
}

export const Scan: Story = {
  args: { mode: 'scan', text: 'MANGO UI' },
  render: Glow.render,
}

export const Speeds: Story = {
  render: (args) => ({
    components: { MyuiNeon },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-6); flex-wrap:wrap; align-items:center">
        <myui-neon v-bind="args" speed="slow" text="SLOW" />
        <myui-neon v-bind="args" speed="normal" text="NORMAL" />
        <myui-neon v-bind="args" speed="fast" text="FAST" />
      </div>
    `,
  }),
}

export const Intensity: Story = {
  render: (args) => ({
    components: { MyuiNeon },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-6); flex-wrap:wrap; align-items:center">
        <myui-neon v-bind="args" :intensity="0" text="0.0" />
        <myui-neon v-bind="args" :intensity="0.35" text="0.35" />
        <myui-neon v-bind="args" :intensity="1" text="1.0" />
      </div>
    `,
  }),
}

export const Inactive: Story = {
  args: { active: false, text: '已关灯' },
  render: Glow.render,
}

export const WrapsPlainText: Story = {
  name: 'Wraps plain text',
  render: (args) => ({
    components: { MyuiNeon },
    setup: () => ({ args }),
    template: `
      <myui-neon v-bind="args" style="font-family:var(--myui-font-display); font-size:var(--myui-text-2xl); letter-spacing:var(--myui-tracking-wide); color:var(--myui-color-text)">
        DROP 01
      </myui-neon>
    `,
  }),
}

export const WrapsAButton: Story = {
  name: 'Wraps a button',
  args: { mode: 'scan', intensity: 0.7 },
  render: (args) => ({
    components: { MyuiNeon, MyuiButton },
    setup: () => ({ args }),
    template: `
      <myui-neon v-bind="args">
        <myui-button size="lg">立即抢购</myui-button>
      </myui-neon>
    `,
  }),
}

export const WrapsAnImage: Story = {
  name: 'Wraps an image',
  args: { intensity: 0.8 },
  render: (args) => ({
    components: { MyuiNeon },
    setup: () => ({ args, poster: posterImage }),
    template: `
      <myui-neon v-bind="args">
        <img :src="poster" alt="MANGO NEON poster" width="240" height="160" style="display:block" />
      </myui-neon>
    `,
  }),
}

export const WrapsACard: Story = {
  name: 'Wraps a card',
  args: { as: 'div', mode: 'flicker', intensity: 0.6 },
  render: (args) => ({
    components: { MyuiNeon },
    setup: () => ({ args }),
    template: `
      <myui-neon v-bind="args">
        <div style="width:280px; padding:var(--myui-space-5); background-color:var(--myui-color-surface); border:var(--myui-border-width) solid var(--myui-color-line); box-shadow:var(--myui-shadow-inset)">
          <div style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-tight)">NIGHT MARKET</div>
          <p style="margin:var(--myui-space-2) 0 0; font-size:var(--myui-text-sm); color:var(--myui-color-text-soft)">整块卡片一起亮起来。</p>
        </div>
      </myui-neon>
    `,
  }),
}
