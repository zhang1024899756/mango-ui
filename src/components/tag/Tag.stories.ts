import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MyuiTag } from './index'

const meta = {
  title: 'Elements/Tag',
  component: MyuiTag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A HUD stamp: uppercase micro-caps on a mono grid, 1px hairline, zero radius by default. ' +
          'Use solid for a claim, outline for a category, ghost for metadata that should not shout. ' +
          'The closable affordance is a real button with an accessible name.',
      },
    },
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info', 'ink'],
    },
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    shape: { control: 'inline-radio', options: ['rect', 'pill'] },
    closable: { control: 'boolean' },
    active: { control: 'boolean' },
  },
  args: {
    tone: 'neutral',
    variant: 'outline',
    size: 'sm',
    shape: 'rect',
    closable: false,
    active: false,
  },
} satisfies Meta<typeof MyuiTag>

export default meta
type Story = StoryObj<typeof meta>

export const Outline: Story = {
  render: (args) => ({
    components: { MyuiTag },
    setup: () => ({ args }),
    template: '<myui-tag v-bind="args">NEW DROP</myui-tag>',
  }),
}

export const Solid: Story = {
  args: { variant: 'solid', tone: 'accent' },
  render: Outline.render,
}

export const Ghost: Story = {
  args: { variant: 'ghost', tone: 'accent' },
  render: Outline.render,
}

export const Tones: Story = {
  render: (args) => ({
    components: { MyuiTag },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-2); flex-wrap:wrap; align-items:center">
        <myui-tag v-bind="args" tone="neutral">neutral</myui-tag>
        <myui-tag v-bind="args" tone="accent">accent</myui-tag>
        <myui-tag v-bind="args" tone="success">success</myui-tag>
        <myui-tag v-bind="args" tone="warning">warning</myui-tag>
        <myui-tag v-bind="args" tone="danger">danger</myui-tag>
        <myui-tag v-bind="args" tone="info">info</myui-tag>
        <myui-tag v-bind="args" tone="ink">ink</myui-tag>
      </div>
    `,
  }),
}

export const SolidTones: Story = {
  args: { variant: 'solid' },
  render: Tones.render,
}

export const Closable: Story = {
  args: { closable: true, variant: 'solid', tone: 'ink' },
  render: (args) => ({
    components: { MyuiTag },
    setup: () => ({ args }),
    template: '<myui-tag v-bind="args">限时 · 24H</myui-tag>',
  }),
}

export const Pill: Story = {
  args: { shape: 'pill', variant: 'solid', tone: 'accent' },
  render: Outline.render,
}

export const Active: Story = {
  render: (args) => ({
    components: { MyuiTag },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-2); flex-wrap:wrap; align-items:center">
        <myui-tag v-bind="args" active>全部</myui-tag>
        <myui-tag v-bind="args">球鞋</myui-tag>
        <myui-tag v-bind="args">户外</myui-tag>
        <myui-tag v-bind="args">联名</myui-tag>
      </div>
    `,
  }),
}
