import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MyuiIcon } from './index'
import { ICON_NAMES } from './icons'

const meta = {
  title: 'Elements/Icon',
  component: MyuiIcon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The drawn language of the library: 24×24, one stroke weight, round caps, no fills and no icon font. ' +
          'Decorative by default — give it an aria-label only when the glyph is the whole label.',
      },
    },
  },
  argTypes: {
    name: { control: 'select', options: ICON_NAMES },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    color: { control: 'color' },
    spin: { control: 'boolean' },
    strokeWidth: { control: { type: 'range', min: 1, max: 3, step: 0.25 } },
  },
  args: {
    name: 'sparkle',
    size: 'md',
    color: 'currentColor',
    spin: false,
    strokeWidth: 1.75,
  },
} satisfies Meta<typeof MyuiIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { MyuiIcon },
    setup: () => ({ args }),
    template: '<myui-icon v-bind="args" />',
  }),
}

export const Sizes: Story = {
  render: (args) => ({
    components: { MyuiIcon },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-4); align-items:center; color:var(--myui-color-text)">
        <myui-icon v-bind="args" size="sm" />
        <myui-icon v-bind="args" size="md" />
        <myui-icon v-bind="args" size="lg" />
      </div>
    `,
  }),
}

export const StrokeWeight: Story = {
  render: (args) => ({
    components: { MyuiIcon },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-4); align-items:center; color:var(--myui-color-text)">
        <myui-icon v-bind="args" :stroke-width="1.25" size="lg" />
        <myui-icon v-bind="args" :stroke-width="1.75" size="lg" />
        <myui-icon v-bind="args" :stroke-width="2.5" size="lg" />
      </div>
    `,
  }),
}

export const Spin: Story = {
  args: { name: 'settings', spin: true },
  render: Default.render,
}

export const AccentColour: Story = {
  args: { name: 'heart', color: 'var(--myui-color-accent)', size: 'lg' },
  render: Default.render,
}

export const Gallery: Story = {
  name: 'Every glyph',
  parameters: { layout: 'padded' },
  render: () => ({
    components: { MyuiIcon },
    setup: () => ({ names: ICON_NAMES }),
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(92px,1fr)); gap:var(--myui-space-3)">
        <div
          v-for="name in names"
          :key="name"
          style="display:flex; flex-direction:column; align-items:center; gap:var(--myui-space-1);
                 padding:var(--myui-space-3) var(--myui-space-1); border:var(--myui-border-hair);
                 color:var(--myui-color-text)"
        >
          <myui-icon :name="name" size="lg" />
          <span style="font-size:var(--myui-text-xs); color:var(--myui-color-text-faint)">{{ name }}</span>
        </div>
      </div>
    `,
  }),
}

export const CustomSvgSlot: Story = {
  name: 'Custom SVG (slot)',
  render: () => ({
    components: { MyuiIcon },
    template: `
      <div style="color:var(--myui-color-text)">
        <myui-icon size="lg">
          <rect x="4" y="4" width="16" height="16" rx="0" />
          <path d="M4 12h16M12 4v16" />
        </myui-icon>
      </div>
    `,
  }),
}

export const Labelled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'An icon that carries meaning on its own gets a name — it stops being decorative.',
      },
    },
  },
  render: () => ({
    components: { MyuiIcon },
    template: `
      <div style="display:flex; gap:var(--myui-space-4); color:var(--myui-color-text)">
        <myui-icon name="search" aria-label="搜索" />
        <myui-icon name="trash" aria-label="删除" />
        <myui-icon name="lock" aria-label="已锁定" />
      </div>
    `,
  }),
}
