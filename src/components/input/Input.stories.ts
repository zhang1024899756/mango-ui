import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { MyuiInput } from './index'

const meta = {
  title: 'Elements/Input',
  component: MyuiInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A hard-edged slab the text sits in. The house style applies: 2px ink border, zero radius, ' +
          'a cold rim glow that turns neon cyan when the field takes focus. Box for forms, line for ' +
          'editorial headers. Errors are announced, not just coloured red.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['box', 'line'] },
    clearable: { control: 'boolean' },
    showCount: { control: 'boolean' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    maxlength: { control: 'number' },
    error: { control: 'text' },
  },
  args: {
    modelValue: '',
    type: 'text',
    size: 'md',
    variant: 'box',
    placeholder: '搜索单品、系列、联名',
    clearable: false,
    showCount: false,
    invalid: false,
    disabled: false,
    readonly: false,
  },
} satisfies Meta<typeof MyuiInput>

export default meta
type Story = StoryObj<typeof meta>

const renderInput: Story['render'] = (args) => ({
  components: { MyuiInput },
  setup() {
    const value = ref(String(args.modelValue ?? ''))
    return { args, value }
  },
  template: '<div style="width:320px"><myui-input v-bind="args" v-model="value" /></div>',
})

export const Box: Story = { render: renderInput }

export const Line: Story = {
  args: { variant: 'line' },
  render: renderInput,
}

export const Sizes: Story = {
  render: (args) => ({
    components: { MyuiInput },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; flex-direction:column; gap:var(--myui-space-4); width:320px">
        <myui-input v-bind="args" size="sm" placeholder="SM" />
        <myui-input v-bind="args" size="md" placeholder="MD" />
        <myui-input v-bind="args" size="lg" placeholder="LG" />
      </div>
    `,
  }),
}

export const Clearable: Story = {
  args: { modelValue: '联名球鞋', clearable: true },
  render: renderInput,
}

export const CharacterCount: Story = {
  name: 'Character count',
  args: { modelValue: '限量 300 双', maxlength: 12, showCount: true },
  render: renderInput,
}

export const Error: Story = {
  args: {
    modelValue: 'not-an-email',
    type: 'email',
    error: '邮箱格式不对，再检查一下',
  },
  render: renderInput,
}

export const Disabled: Story = {
  args: { modelValue: '已售罄', disabled: true },
  render: renderInput,
}

export const Readonly: Story = {
  args: { modelValue: 'FX-2026-001', readonly: true },
  render: renderInput,
}

export const Affixes: Story = {
  name: 'Prefix / suffix slots',
  render: (args) => ({
    components: { MyuiInput },
    setup() {
      const value = ref('2980')
      return { args, value }
    },
    template: `
      <div style="width:320px">
        <myui-input v-bind="args" v-model="value" type="number">
          <template #prefix><span style="font-weight:var(--myui-weight-bold)">¥</span></template>
          <template #suffix><span>CNY</span></template>
        </myui-input>
      </div>
    `,
  }),
}

export const Password: Story = {
  args: { type: 'password', placeholder: '输入密码', modelValue: 'mango-ui' },
  render: renderInput,
}
