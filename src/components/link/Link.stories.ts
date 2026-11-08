import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MyuiLink } from './index'

const meta = {
  title: 'Elements/Link',
  component: MyuiLink,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Text that goes somewhere. Underlined with the same 2px rule as the rest of the system, ' +
          'and an external link leaves with target + rel already set — you cannot forget them.',
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['ink', 'accent', 'muted', 'spectrum'] },
    underline: { control: 'inline-radio', options: ['always', 'hover', 'none'] },
    external: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skew: { control: 'boolean' },
  },
  args: {
    href: '/drops',
    tone: 'ink',
    underline: 'hover',
    external: false,
    disabled: false,
    skew: false,
  },
} satisfies Meta<typeof MyuiLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { MyuiLink },
    setup: () => ({ args }),
    template: '<myui-link v-bind="args">本周上新</myui-link>',
  }),
}

export const Tones: Story = {
  name: 'All tones',
  render: (args) => ({
    components: { MyuiLink },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-5); flex-wrap:wrap">
        <myui-link v-bind="args" tone="ink">INK 正文链接</myui-link>
        <myui-link v-bind="args" tone="accent">ACCENT 强调链接</myui-link>
        <myui-link v-bind="args" tone="muted">MUTED 次级链接</myui-link>
        <myui-link v-bind="args" tone="spectrum">SPECTRUM 渐变链接</myui-link>
      </div>
    `,
  }),
}

export const Skew: Story = {
  name: 'Skewed glyphs',
  args: { skew: true },
  render: (args) => ({
    components: { MyuiLink },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-5); flex-wrap:wrap; align-items:baseline">
        <myui-link v-bind="args" href="/a">斜切文字链接</myui-link>
        <myui-link v-bind="args" href="https://example.com" external>外链一起斜</myui-link>
        <myui-link v-bind="args" href="/a" tone="spectrum">斜切 + 渐变</myui-link>
      </div>
    `,
  }),
}

export const Spectrum: Story = {
  name: 'Spectrum glyphs',
  args: { tone: 'spectrum' },
  render: (args) => ({
    components: { MyuiLink },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-5); flex-wrap:wrap; align-items:baseline">
        <myui-link v-bind="args" href="/a" underline="always">渐变字形</myui-link>
        <myui-link v-bind="args" href="/a" underline="always" skew>渐变 + 斜切</myui-link>
        <myui-link v-bind="args" href="/a" disabled>禁用态退回实心色</myui-link>
      </div>
    `,
  }),
}

export const Underlines: Story = {
  name: 'Underline modes',
  render: (args) => ({
    components: { MyuiLink },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-5); flex-wrap:wrap">
        <myui-link v-bind="args" underline="always">always</myui-link>
        <myui-link v-bind="args" underline="hover">hover</myui-link>
        <myui-link v-bind="args" underline="none">none</myui-link>
      </div>
    `,
  }),
}

export const External: Story = {
  args: { href: 'https://github.com/zhang1024899756/mango-ui', external: true },
  render: (args) => ({
    components: { MyuiLink },
    setup: () => ({ args }),
    template: '<myui-link v-bind="args">去 GitHub 看源码</myui-link>',
  }),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
}

export const WithSuffix: Story = {
  render: (args) => ({
    components: { MyuiLink },
    setup: () => ({ args }),
    template: `
      <myui-link v-bind="args">
        联名系列
        <template #suffix><span aria-hidden="true">↗ 12</span></template>
      </myui-link>
    `,
  }),
}

export const InProse: Story = {
  name: 'In a paragraph',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'In running text an ink link must still be visible before the pointer arrives — ' +
          'use `underline="always"` or the accent tone, never `ink` + `hover`.',
      },
    },
  },
  render: (args) => ({
    components: { MyuiLink },
    setup: () => ({ args }),
    template: `
      <p style="max-width:56ch; font-size:var(--myui-text-md); line-height:var(--myui-leading-relaxed);
                color:var(--myui-color-text-soft)">
        这一季的灵感来自
        <myui-link v-bind="args" href="/drops/2026" underline="always">凌晨三点的夜市</myui-link>
        ，配色取自
        <myui-link v-bind="args" href="https://example.com/neon" tone="accent" external>霓虹灯牌</myui-link>
        。所有表情符号都不允许出现在图标位。
      </p>
    `,
  }),
}
