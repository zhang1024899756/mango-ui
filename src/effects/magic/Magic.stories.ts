import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MyuiButton } from '../../components/button'
import { MyuiMagic } from './index'

/**
 * Inline poster asset for the `<img>` demo. It is a picture, not UI chrome, so it
 * carries the palette as literal paint rather than as tokens.
 */
const posterImage =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160">' +
      '<rect width="240" height="160" fill="#f4f1ea"/>' +
      '<rect x="8" y="8" width="224" height="144" fill="none" stroke="#101012" stroke-width="4"/>' +
      '<text x="20" y="90" font-family="Arial Black, sans-serif" font-size="42" fill="#101012">MANGO</text>' +
      '<text x="20" y="136" font-family="Arial Black, sans-serif" font-size="42" fill="#ff4d1a">UI</text>' +
      '</svg>',
  )

const meta = {
  title: 'Effects/Magic',
  component: MyuiMagic,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An effect that wraps anything: a text node, a <MyuiButton>, an <img>, a whole card. ' +
          'Wrapper mode animates transform and filter on the wrapper, so the content keeps its DOM, ' +
          'its listeners and its layout; text mode is the only mode that duplicates glyphs, through ' +
          '::before / ::after + attr(data-text). Everything is scaled by `intensity` and falls ' +
          'completely still under prefers-reduced-motion.',
      },
    },
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['glitch', 'scan', 'flicker'] },
    speed: { control: 'inline-radio', options: ['slow', 'normal', 'fast'] },
    active: { control: 'boolean' },
    intensity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    colorA: { control: 'color' },
    colorB: { control: 'color' },
    text: { control: 'text' },
    as: { control: 'text' },
  },
  args: {
    mode: 'glitch',
    speed: 'normal',
    active: true,
    intensity: 0.5,
    as: 'span',
  },
} satisfies Meta<typeof MyuiMagic>

export default meta
type Story = StoryObj<typeof meta>

export const Glitch: Story = {
  args: { text: 'MANGO UI' },
  render: (args) => ({
    components: { MyuiMagic },
    setup: () => ({ args }),
    template: '<myui-magic v-bind="args" />',
  }),
}

export const Scan: Story = {
  args: { mode: 'scan', text: 'MANGO UI' },
  render: Glitch.render,
}

export const Flicker: Story = {
  args: { mode: 'flicker', text: 'MANGO UI' },
  render: Glitch.render,
}

export const Speeds: Story = {
  render: (args) => ({
    components: { MyuiMagic },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-6); flex-wrap:wrap; align-items:center">
        <myui-magic v-bind="args" speed="slow" text="SLOW" />
        <myui-magic v-bind="args" speed="normal" text="NORMAL" />
        <myui-magic v-bind="args" speed="fast" text="FAST" />
      </div>
    `,
  }),
}

export const Intensity: Story = {
  render: (args) => ({
    components: { MyuiMagic },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-6); flex-wrap:wrap; align-items:center">
        <myui-magic v-bind="args" :intensity="0" text="0.0" />
        <myui-magic v-bind="args" :intensity="0.5" text="0.5" />
        <myui-magic v-bind="args" :intensity="1" text="1.0" />
      </div>
    `,
  }),
}

export const Inactive: Story = {
  args: { active: false, text: '已停用' },
  render: Glitch.render,
}

export const WrapsPlainText: Story = {
  name: 'Wraps plain text',
  render: (args) => ({
    components: { MyuiMagic },
    setup: () => ({ args }),
    template: '<myui-magic v-bind="args">DROP 01</myui-magic>',
  }),
}

export const WrapsAButton: Story = {
  name: 'Wraps a button',
  args: { intensity: 0.7 },
  render: (args) => ({
    components: { MyuiMagic, MyuiButton },
    setup: () => ({ args }),
    template: `
      <myui-magic v-bind="args">
        <myui-button size="lg">立即抢购</myui-button>
      </myui-magic>
    `,
  }),
}

export const WrapsAnImage: Story = {
  name: 'Wraps an image',
  args: { mode: 'scan', intensity: 0.8 },
  render: (args) => ({
    components: { MyuiMagic },
    setup: () => ({ args, poster: posterImage }),
    template: `
      <myui-magic v-bind="args">
        <img :src="poster" alt="MANGO UI poster" width="240" height="160" style="display:block" />
      </myui-magic>
    `,
  }),
}

export const WrapsACard: Story = {
  name: 'Wraps a card',
  args: { intensity: 0.6 },
  render: (args) => ({
    components: { MyuiMagic },
    setup: () => ({ args }),
    template: `
      <myui-magic v-bind="args">
        <div style="width:280px; padding:var(--myui-space-5); background-color:var(--myui-color-surface); border:var(--myui-border-width) solid var(--myui-color-line); box-shadow:var(--myui-shadow-glow)">
          <div style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-tight)">NIGHT MARKET</div>
          <p style="margin:var(--myui-space-2) 0 0; font-size:var(--myui-text-sm); color:var(--myui-color-text-soft)">整块卡片一起故障。</p>
        </div>
      </myui-magic>
    `,
  }),
}
