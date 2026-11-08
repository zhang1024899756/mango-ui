import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MyuiProgress } from './index'

const meta = {
  title: 'Elements/Progress',
  component: MyuiProgress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A measured strip of ink: 2px hard border, flat fill, zero radius. The percentage is ' +
          'exposed through role="progressbar" with aria-valuenow, and omitted entirely while ' +
          'indeterminate — a progress bar that reports a number it does not know is a lie.',
      },
    },
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['line', 'circle'] },
    tone: { control: 'inline-radio', options: ['accent', 'ink', 'success', 'warning', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    percent: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    showText: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  args: {
    percent: 62,
    type: 'line',
    tone: 'accent',
    size: 'md',
    showText: true,
    indeterminate: false,
    label: '加载进度',
  },
  render: (args) => ({
    components: { MyuiProgress },
    setup: () => ({ args }),
    template: '<div style="width: 420px"><myui-progress v-bind="args" /></div>',
  }),
} satisfies Meta<typeof MyuiProgress>

export default meta
type Story = StoryObj<typeof meta>

export const Line: Story = {}

export const Tones: Story = {
  render: (args) => ({
    components: { MyuiProgress },
    setup: () => ({ args }),
    template: `
      <div style="width: 420px; display: flex; flex-direction: column; gap: var(--myui-space-4)">
        <myui-progress v-bind="args" tone="accent" :percent="82" label="accent" />
        <myui-progress v-bind="args" tone="ink" :percent="64" label="ink" />
        <myui-progress v-bind="args" tone="success" :percent="100" label="success" />
        <myui-progress v-bind="args" tone="warning" :percent="45" label="warning" />
        <myui-progress v-bind="args" tone="danger" :percent="18" label="danger" />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: (args) => ({
    components: { MyuiProgress },
    setup: () => ({ args }),
    template: `
      <div style="width: 420px; display: flex; flex-direction: column; gap: var(--myui-space-4)">
        <myui-progress v-bind="args" size="sm" :percent="40" label="sm" />
        <myui-progress v-bind="args" size="md" :percent="60" label="md" />
        <myui-progress v-bind="args" size="lg" :percent="80" label="lg" />
      </div>
    `,
  }),
}

export const Circle: Story = {
  args: { type: 'circle', percent: 72 },
  render: (args) => ({
    components: { MyuiProgress },
    setup: () => ({ args }),
    template: '<myui-progress v-bind="args" />',
  }),
}

export const CircleSizes: Story = {
  args: { type: 'circle' },
  render: (args) => ({
    components: { MyuiProgress },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:var(--myui-space-5); align-items:center">
        <myui-progress v-bind="args" size="sm" :percent="30" label="small" />
        <myui-progress v-bind="args" size="md" :percent="60" label="medium" />
        <myui-progress v-bind="args" size="lg" :percent="90" tone="success" label="large" />
      </div>
    `,
  }),
}

export const Indeterminate: Story = {
  args: { indeterminate: true, percent: 0 },
}

export const EdgeCases: Story = {
  name: 'Edge cases (clamped)',
  render: (args) => ({
    components: { MyuiProgress },
    setup: () => ({ args }),
    template: `
      <div style="width: 420px; display: flex; flex-direction: column; gap: var(--myui-space-4)">
        <myui-progress v-bind="args" :percent="-20" label="below range" />
        <myui-progress v-bind="args" :percent="0" label="zero" />
        <myui-progress v-bind="args" :percent="140" label="above range" />
      </div>
    `,
  }),
}
