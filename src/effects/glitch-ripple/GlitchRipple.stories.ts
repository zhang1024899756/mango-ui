import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MyuiButton } from '../../components/button'
import { MyuiTag } from '../../components/tag'
import { MyuiGlitchRipple } from './index'

const meta = {
  title: 'Effects/GlitchRipple',
  component: MyuiGlitchRipple,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A failing transmission, drawn by moving the content itself. An inline SVG filter builds an anisotropic ' +
          'fractal-noise field (feTurbulence), re-centres it on 0.5 (feComponentTransfer — the rasteriser noise ' +
          'averages ~0.73, and feDisplacementMap displaces by channel − 0.5, so without this stage the whole box ' +
          'would slide instead of tear), slides it once per frame (feOffset) and displaces every pixel of the slot ' +
          'through it (feDisplacementMap) — that is the ripple. Two stepped CSS layers ride on top: a 0.5–1.2px ' +
          'tremble and two or three hard opacity dips per cycle, which is what makes it read as a weak signal rather ' +
          'than a warped picture. All three are gated on `is-animating`, so `active="false"`, an untouched ' +
          '`trigger="hover"` and a reduced-motion freeze stop them together.',
      },
    },
  },
  argTypes: {
    intensity: { control: 'inline-radio', options: ['subtle', 'normal', 'intense'] },
    speed: { control: 'inline-radio', options: ['slow', 'normal', 'fast'] },
    trigger: { control: 'inline-radio', options: ['auto', 'hover'] },
    active: { control: 'boolean' },
    motionPreference: { control: 'inline-radio', options: ['system', 'always'] },
    text: { control: 'text' },
    as: { control: 'text' },
  },
  args: {
    intensity: 'normal',
    speed: 'normal',
    trigger: 'auto',
    active: true,
    // Storybook is a demo surface: a machine with "animation effects" switched
    // off would otherwise show a still frame and look broken.
    motionPreference: 'always',
    as: 'span',
  },
} satisfies Meta<typeof MyuiGlitchRipple>

export default meta
type Story = StoryObj<typeof meta>

const displayText =
  'font-family:var(--myui-font-display); font-size:var(--myui-text-2xl); ' +
  'letter-spacing:var(--myui-tracking-wide); color:var(--myui-color-text)'

export const Basic: Story = {
  args: { text: 'SIGNAL LOST' },
  render: (args) => ({
    components: { MyuiGlitchRipple },
    setup: () => ({ args, displayText }),
    template: '<myui-glitch-ripple v-bind="args" :style="displayText" />',
  }),
}

export const Intensities: Story = {
  render: (args) => ({
    components: { MyuiGlitchRipple },
    setup: () => ({ args, displayText }),
    template: `
      <div style="display:flex; gap:var(--myui-space-8); flex-wrap:wrap; align-items:center">
        <myui-glitch-ripple v-bind="args" intensity="subtle" text="SUBTLE" :style="displayText" />
        <myui-glitch-ripple v-bind="args" intensity="normal" text="NORMAL" :style="displayText" />
        <myui-glitch-ripple v-bind="args" intensity="intense" text="INTENSE" :style="displayText" />
      </div>
    `,
  }),
}

export const Speeds: Story = {
  render: (args) => ({
    components: { MyuiGlitchRipple },
    setup: () => ({ args, displayText }),
    template: `
      <div style="display:flex; gap:var(--myui-space-8); flex-wrap:wrap; align-items:center">
        <myui-glitch-ripple v-bind="args" speed="slow" text="SLOW" :style="displayText" />
        <myui-glitch-ripple v-bind="args" speed="normal" text="NORMAL" :style="displayText" />
        <myui-glitch-ripple v-bind="args" speed="fast" text="FAST" :style="displayText" />
      </div>
    `,
  }),
}

export const HoverTrigger: Story = {
  name: 'Hover trigger',
  args: { trigger: 'hover' },
  render: (args) => ({
    components: { MyuiGlitchRipple, MyuiButton },
    setup: () => ({ args }),
    template: `
      <myui-glitch-ripple v-bind="args">
        <myui-button size="lg">把指针放上来</myui-button>
      </myui-glitch-ripple>
    `,
  }),
}

export const Inactive: Story = {
  args: { active: false, text: 'OFFLINE' },
  render: Basic.render,
}

/**
 * What a visitor whose OS has "animation effects" off actually sees: the filter
 * sits at its frozen values, so the content is a still-warped frame — visibly
 * unstable, just not moving.
 */
export const SystemPreference: Story = {
  name: 'Frozen frame (system preference)',
  args: { motionPreference: 'system', text: 'NO MOTION' },
  render: Basic.render,
}

export const WrapsAButton: Story = {
  name: 'Wraps a button',
  args: { intensity: 'intense' },
  render: (args) => ({
    components: { MyuiGlitchRipple, MyuiButton },
    setup: () => ({ args }),
    template: `
      <myui-glitch-ripple v-bind="args">
        <myui-button size="lg">重新连接</myui-button>
      </myui-glitch-ripple>
    `,
  }),
}

export const WrapsATag: Story = {
  name: 'Wraps a tag',
  args: { intensity: 'subtle' },
  render: (args) => ({
    components: { MyuiGlitchRipple, MyuiTag },
    setup: () => ({ args }),
    template: `
      <myui-glitch-ripple v-bind="args">
        <myui-tag tone="danger" variant="outline">信号弱</myui-tag>
      </myui-glitch-ripple>
    `,
  }),
}

export const WrapsACard: Story = {
  name: 'Wraps a card',
  args: { as: 'div' },
  render: (args) => ({
    components: { MyuiGlitchRipple },
    setup: () => ({ args }),
    template: `
      <myui-glitch-ripple v-bind="args">
        <div style="width:280px; padding:var(--myui-space-5); background-color:var(--myui-color-surface); border:var(--myui-border-width) solid var(--myui-color-line); box-shadow:var(--myui-shadow-inset)">
          <div style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-tight)">NIGHT MARKET</div>
          <p style="margin:var(--myui-space-2) 0 0; font-size:var(--myui-text-sm); color:var(--myui-color-text-soft)">整块面板在丢包。</p>
        </div>
      </myui-glitch-ripple>
    `,
  }),
}

/**
 * Inline poster for the `<img>` demo. It is a picture, not UI chrome, so it
 * carries the palette as literal paint rather than as tokens.
 */
const posterImage =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160">' +
      '<rect width="240" height="160" fill="#05070d"/>' +
      '<rect x="8" y="8" width="224" height="144" fill="none" stroke="#19e0ff" stroke-width="2"/>' +
      '<text x="20" y="92" font-family="Arial Black, sans-serif" font-size="42" fill="#dbe9f4">MANGO</text>' +
      '<text x="20" y="136" font-family="Arial Black, sans-serif" font-size="42" fill="#ff2e88">SIGNAL</text>' +
      '</svg>',
  )

export const WrapsAnImage: Story = {
  name: 'Wraps an image',
  args: { intensity: 'intense' },
  render: (args) => ({
    components: { MyuiGlitchRipple },
    setup: () => ({ args, poster: posterImage }),
    template: `
      <myui-glitch-ripple v-bind="args">
        <img :src="poster" alt="MANGO SIGNAL poster" width="240" height="160" style="display:block" />
      </myui-glitch-ripple>
    `,
  }),
}
