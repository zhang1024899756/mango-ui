import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MyuiButton } from '../button'
import { MyuiDialog } from './index'

const meta = {
  title: 'Elements/Dialog',
  component: MyuiDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A terminal panel floating in deep space: flat scrim with a dither pattern, 1px hairline border, ' +
          '40px neon glow — no blur, no glass. Teleported to <body>, traps focus while ' +
          'open, restores focus to the trigger on close, locks body scroll, and closes on Escape.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    width: { control: 'text' },
    closable: { control: 'boolean' },
    maskClosable: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    showFooter: { control: 'boolean' },
    okText: { control: 'text' },
    cancelText: { control: 'text' },
  },
  args: {
    title: '加入俱乐部',
    width: 520,
    closable: true,
    maskClosable: true,
    closeOnEsc: true,
    showFooter: true,
    okText: '确认加入',
    cancelText: '再想想',
  },
} satisfies Meta<typeof MyuiDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: (args) => ({
    components: { MyuiDialog, MyuiButton },
    setup: () => ({ args, open: ref(false) }),
    template: `
      <div>
        <myui-button @click="open = true">打开对话框</myui-button>
        <myui-dialog v-bind="args" v-model="open">
          <p>限量联名即将发售。加入俱乐部可以提前 24 小时进入排队。</p>
          <p>名额有限，且不会追加。</p>
        </myui-dialog>
      </div>
    `,
  }),
}

export const CustomFooter: Story = {
  render: (args) => ({
    components: { MyuiDialog, MyuiButton },
    setup: () => ({ args, open: ref(false) }),
    template: `
      <div>
        <myui-button @click="open = true">自定义页脚</myui-button>
        <myui-dialog v-bind="args" v-model="open">
          <p>页脚可以完全自定义。</p>
          <template #footer>
            <myui-button variant="text" tone="danger">删除</myui-button>
            <myui-button variant="outline" tone="ink" @click="open = false">关闭</myui-button>
          </template>
        </myui-dialog>
      </div>
    `,
  }),
}

export const NotDismissable: Story = {
  name: 'Cannot be dismissed by scrim or Escape',
  args: { closable: false, maskClosable: false, closeOnEsc: false, showFooter: true },
  render: (args) => ({
    components: { MyuiDialog, MyuiButton },
    setup: () => ({ args, open: ref(false) }),
    template: `
      <div>
        <myui-button @click="open = true">必须做出选择</myui-button>
        <myui-dialog v-bind="args" v-model="open">
          <p>这个对话框只能通过页脚按钮关闭——遮罩点击和 Esc 都被禁用。</p>
        </myui-dialog>
      </div>
    `,
  }),
}

export const Narrow: Story = {
  args: { width: 380, title: '确认删除' },
  render: (args) => ({
    components: { MyuiDialog, MyuiButton },
    setup: () => ({ args, open: ref(false) }),
    template: `
      <div>
        <myui-button tone="danger" @click="open = true">删除</myui-button>
        <myui-dialog v-bind="args" v-model="open">
          <p>删除后不可恢复。</p>
        </myui-dialog>
      </div>
    `,
  }),
}
