import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MyuiNumber } from './index'

const meta = {
  title: 'Elements/Number',
  component: MyuiNumber,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figures set in the display face with tabular numerals, so the line never breathes while it ' +
          'counts. Optional thousands grouping, fixed decimals, an affix on either side and a trend arrow. ' +
          'Under `prefers-reduced-motion` the count-up is skipped entirely.',
      },
    },
  },
  argTypes: {
    value: { control: 'number' },
    precision: { control: { type: 'number', min: 0, max: 6, step: 1 } },
    separator: { control: 'boolean' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
    trend: { control: 'inline-radio', options: [undefined, 'up', 'down', 'flat', 'auto'] },
    animated: { control: 'boolean' },
    duration: { control: { type: 'number', min: 100, max: 3000, step: 100 } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    tone: { control: 'inline-radio', options: ['ink', 'accent', 'success', 'danger'] },
  },
  args: {
    value: 128600,
    precision: 0,
    separator: true,
    animated: false,
    duration: 600,
    size: 'md',
    tone: 'ink',
  },
} satisfies Meta<typeof MyuiNumber>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { MyuiNumber },
    setup: () => ({ args }),
    template: '<myui-number v-bind="args" />',
  }),
}

export const Animated: Story = {
  args: { animated: true, value: 48291 },
  render: Default.render,
}

export const Sizes: Story = {
  render: (args) => ({
    components: { MyuiNumber },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-5); align-items:baseline; flex-wrap:wrap">
        <myui-number v-bind="args" size="sm" />
        <myui-number v-bind="args" size="md" />
        <myui-number v-bind="args" size="lg" />
        <myui-number v-bind="args" size="xl" />
      </div>
    `,
  }),
}

export const Tones: Story = {
  name: 'All tones',
  render: (args) => ({
    components: { MyuiNumber },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-5); align-items:baseline; flex-wrap:wrap">
        <myui-number v-bind="args" tone="ink" />
        <myui-number v-bind="args" tone="accent" />
        <myui-number v-bind="args" tone="success" />
        <myui-number v-bind="args" tone="danger" />
      </div>
    `,
  }),
}

export const Precision: Story = {
  args: { value: 3.14159, precision: 2 },
  render: Default.render,
}

export const Affixes: Story = {
  args: { value: 499, prefix: '¥', suffix: '+12%', size: 'lg' },
  render: Default.render,
}

export const Trend: Story = {
  render: () => ({
    components: { MyuiNumber },
    setup: () => ({ directions: ['up', 'down', 'flat'] as const }),
    template: `
      <div style="display:flex; gap:var(--myui-space-5); align-items:baseline; flex-wrap:wrap">
        <myui-number v-for="d in directions" :key="d" :value="128" :trend="d" :tone="'ink'" />
      </div>
    `,
  }),
}

export const TrendAuto: Story = {
  name: 'Trend (auto)',
  render: () => ({
    components: { MyuiNumber },
    setup() {
      const value = ref(12840)
      return {
        value,
        bump: (delta: number) => {
          value.value = Math.max(0, value.value + delta)
        },
      }
    },
    template: `
      <div style="display:flex; gap:var(--myui-space-4); align-items:baseline">
        <myui-number :value="value" trend="auto" :separator="true" animated />
        <span style="display:flex; gap:var(--myui-space-2)">
          <button type="button" @click="bump(1260)">+1260</button>
          <button type="button" @click="bump(-830)">-830</button>
        </span>
      </div>
    `,
  }),
}
