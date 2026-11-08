import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MyuiButton } from './index'

const meta = {
  title: 'Elements/Button',
  component: MyuiButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The primary action of the system. Solid fills claim the accent, outline competes with it, ' +
          'ghost and text step back. The glow is the house style: the button lights up and lifts 1px on ' +
          'hover and dims like a console key on active.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost', 'text'] },
    tone: { control: 'inline-radio', options: ['accent', 'ink', 'neutral', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['rect', 'pill'] },
    shadow: { control: 'boolean' },
    block: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
  },
  args: {
    variant: 'solid',
    tone: 'accent',
    size: 'md',
    shape: 'rect',
    shadow: true,
    block: false,
    disabled: false,
    loading: false,
    iconOnly: false,
  },
} satisfies Meta<typeof MyuiButton>

export default meta
type Story = StoryObj<typeof meta>

export const Solid: Story = {
  render: (args) => ({
    components: { MyuiButton },
    setup: () => ({ args }),
    template: '<myui-button v-bind="args">立即抢购</myui-button>',
  }),
}

export const Outline: Story = {
  args: { variant: 'outline' },
  render: Solid.render,
}

export const Ghost: Story = {
  args: { variant: 'ghost', shadow: false },
  render: Solid.render,
}

export const Text: Story = {
  args: { variant: 'text', shadow: false },
  render: Solid.render,
}

export const Tones: Story = {
  name: 'All tones',
  render: (args) => ({
    components: { MyuiButton },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-4); flex-wrap:wrap; align-items:center">
        <myui-button v-bind="args" tone="accent">Accent</myui-button>
        <myui-button v-bind="args" tone="ink">Ink</myui-button>
        <myui-button v-bind="args" tone="neutral">Neutral</myui-button>
        <myui-button v-bind="args" tone="danger">Danger</myui-button>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: (args) => ({
    components: { MyuiButton },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-4); flex-wrap:wrap; align-items:center">
        <myui-button v-bind="args" size="sm">Small</myui-button>
        <myui-button v-bind="args" size="md">Medium</myui-button>
        <myui-button v-bind="args" size="lg">Large</myui-button>
      </div>
    `,
  }),
}

export const Pill: Story = {
  args: { shape: 'pill' },
  render: Solid.render,
}

export const States: Story = {
  render: (args) => ({
    components: { MyuiButton },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-4); flex-wrap:wrap; align-items:center">
        <myui-button v-bind="args">默认</myui-button>
        <myui-button v-bind="args" loading>处理中</myui-button>
        <myui-button v-bind="args" disabled>不可用</myui-button>
      </div>
    `,
  }),
}

export const IconOnly: Story = {
  args: { iconOnly: true, tone: 'ink' },
  render: (args) => ({
    components: { MyuiButton },
    setup: () => ({ args }),
    template: `<myui-button v-bind="args"><span aria-hidden="true">+</span></myui-button>`,
  }),
}

export const AsLink: Story = {
  args: { href: 'https://github.com/zhang1024899756/mango-ui', target: '_blank' },
  render: Solid.render,
}
