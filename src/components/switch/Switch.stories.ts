import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { MyuiSwitch } from './index'

const meta = {
  title: 'Elements/Switch',
  component: MyuiSwitch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Two states, one hard-edged pill. The track claims the accent only while it is on; the thumb ' +
          'is a glowing disc that slides and snaps on the track. A real <button role="switch">: Space and ' +
          'Enter both toggle it.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    activeText: { control: 'text' },
    inactiveText: { control: 'text' },
  },
  args: {
    modelValue: false,
    size: 'md',
    disabled: false,
    loading: false,
  },
} satisfies Meta<typeof MyuiSwitch>

export default meta
type Story = StoryObj<typeof meta>

const renderSwitch: Story['render'] = (args) => ({
  components: { MyuiSwitch },
  setup() {
    const value = ref(args.modelValue)
    return { args, value }
  },
  template: `
    <div style="display:flex; align-items:center; gap:var(--myui-space-3)">
      <myui-switch v-bind="args" v-model="value" />
      <span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs)">
        {{ value }}
      </span>
    </div>
  `,
})

export const Off: Story = { render: renderSwitch }

export const On: Story = {
  args: { modelValue: true },
  render: renderSwitch,
}

export const Sizes: Story = {
  render: (args) => ({
    components: { MyuiSwitch },
    setup() {
      const small = ref(true)
      const medium = ref(true)
      return { args, small, medium }
    },
    template: `
      <div style="display:flex; align-items:center; gap:var(--myui-space-5)">
        <myui-switch v-bind="args" v-model="small" size="sm" />
        <myui-switch v-bind="args" v-model="medium" size="md" />
      </div>
    `,
  }),
}

export const WithText: Story = {
  name: 'Active / inactive text',
  args: { modelValue: true, activeText: 'ON SALE', inactiveText: 'OFF SALE' },
  render: renderSwitch,
}

export const Loading: Story = {
  args: { modelValue: false, loading: true },
  render: renderSwitch,
}

export const Disabled: Story = {
  render: (args) => ({
    components: { MyuiSwitch },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; align-items:center; gap:var(--myui-space-5)">
        <myui-switch v-bind="args" disabled />
        <myui-switch v-bind="args" disabled :model-value="true" />
      </div>
    `,
  }),
}

export const CustomValues: Story = {
  name: 'String values',
  render: (args) => ({
    components: { MyuiSwitch },
    setup() {
      const value = ref('off')
      return { args, value }
    },
    template: `
      <div style="display:flex; align-items:center; gap:var(--myui-space-3)">
        <myui-switch
          v-bind="args"
          v-model="value"
          active-value="on"
          inactive-value="off"
          active-text="已上架"
          inactive-text="已下架"
        />
        <span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs)">{{ value }}</span>
      </div>
    `,
  }),
}
