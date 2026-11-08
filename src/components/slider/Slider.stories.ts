import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { MyuiSlider } from './index'
import type { SliderValue } from './types'

const meta = {
  title: 'Elements/Slider',
  component: MyuiSlider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A hard rule you drag along. One handle for a number, two for a `[lower, upper]` range. ' +
          'The filled part claims the neon accent; the handles are glowing discs on a dark ' +
          'shadow. Pointer, track click and arrow keys all work, and the handles refuse to cross.',
      },
    },
  },
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    vertical: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    disabled: { control: 'boolean' },
    tone: { control: 'inline-radio', options: ['accent', 'ink'] },
  },
  args: {
    modelValue: 40,
    min: 0,
    max: 100,
    step: 1,
    vertical: false,
    showTooltip: true,
    disabled: false,
    tone: 'accent',
  },
} satisfies Meta<typeof MyuiSlider>

export default meta
type Story = StoryObj<typeof meta>

const renderSlider: Story['render'] = (args) => ({
  components: { MyuiSlider },
  setup() {
    const value = ref<SliderValue>(args.modelValue ?? 40)
    return { args, value }
  },
  template: '<div style="width:320px"><myui-slider v-bind="args" v-model="value" /></div>',
})

export const Default: Story = { render: renderSlider }

export const Range: Story = {
  render: (args) => ({
    components: { MyuiSlider },
    setup() {
      const value = ref<SliderValue>([20, 70])
      return { args, value }
    },
    template: '<div style="width:320px"><myui-slider v-bind="args" v-model="value" /></div>',
  }),
}

export const Steps: Story = {
  args: { step: 10 },
  render: renderSlider,
}

export const Marks: Story = {
  args: {
    modelValue: 50,
    step: 10,
    marks: { 0: '冷', 50: '温', 100: '烫' },
  },
  render: renderSlider,
}

export const Vertical: Story = {
  args: { modelValue: 35, vertical: true, marks: { 0: 'MIN', 100: 'MAX' } },
  render: (args) => ({
    components: { MyuiSlider },
    setup() {
      const value = ref<SliderValue>(args.modelValue ?? 35)
      return { args, value }
    },
    template: `
      <div style="display:flex; align-items:center; gap:var(--myui-space-5)">
        <myui-slider v-bind="args" v-model="value" />
        <span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs)">{{ value }}</span>
      </div>
    `,
  }),
}

export const ToneInk: Story = {
  name: 'Tone: ink',
  args: { tone: 'ink' },
  render: renderSlider,
}

export const Disabled: Story = {
  args: { modelValue: 65, disabled: true },
  render: renderSlider,
}

export const NoTooltip: Story = {
  name: 'No tooltip',
  args: { modelValue: 25, showTooltip: false },
  render: renderSlider,
}

export const FineGrained: Story = {
  name: 'Fine-grained range',
  args: { modelValue: 0.35, min: 0, max: 1, step: 0.01 },
  render: renderSlider,
}
