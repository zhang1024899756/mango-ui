import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MyuiText } from './index'

const meta = {
  title: 'Elements/Text',
  component: MyuiText,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The typographic primitive. The same run of text can speak in four voices — display, eyebrow, body, ' +
          'mono — and every typographic decision (size, weight, leading, tracking, case, tone, truncation, glow) ' +
          'is a prop, so a consumer never writes an inline style to make type behave. Display closes its leading ' +
          'and tightens its tracking; eyebrow opens both and speaks in caps; body stays comfortable; mono is the ' +
          'machine voice for ids, params and status strings.',
      },
    },
  },
  argTypes: {
    as: { control: 'text' },
    variant: { control: 'inline-radio', options: ['display', 'eyebrow', 'body', 'mono'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] },
    weight: { control: 'inline-radio', options: ['regular', 'medium', 'bold', 'black'] },
    tone: {
      control: 'inline-radio',
      options: [
        'default',
        'soft',
        'faint',
        'accent',
        'signal',
        'success',
        'warning',
        'danger',
        'info',
      ],
    },
    leading: { control: 'inline-radio', options: ['tight', 'snug', 'normal', 'relaxed'] },
    tracking: { control: 'inline-radio', options: ['tight', 'normal', 'wide'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    transform: { control: 'inline-radio', options: ['none', 'uppercase'] },
    truncate: { control: 'number' },
    glow: { control: 'boolean' },
  },
  args: {
    as: 'span',
    variant: 'display',
    size: '3xl',
    tone: 'default',
    align: 'start',
    glow: false,
  },
} satisfies Meta<typeof MyuiText>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { MyuiText },
    setup: () => ({ args }),
    template: '<myui-text v-bind="args">NIGHT MARKET</myui-text>',
  }),
}

/** The four voices side by side. Same copy, four completely different settings. */
export const Voices: Story = {
  render: () => ({
    components: { MyuiText },
    template: `
      <div style="display:flex; flex-direction:column; gap:var(--myui-space-3); align-items:flex-start">
        <myui-text variant="eyebrow" tone="faint">01 / display</myui-text>
        <myui-text variant="display" size="2xl">NIGHT MARKET</myui-text>

        <myui-text variant="eyebrow" tone="faint">02 / eyebrow</myui-text>
        <myui-text variant="eyebrow" tone="accent">LIMITED DROP · 24H</myui-text>

        <myui-text variant="eyebrow" tone="faint">03 / body</myui-text>
        <myui-text as="p" variant="body" style="max-width:38ch">
          这是一段正文。Body 嗓音把行高开到 1.5、字距留在 0，中文和 English 混排时都不会挤在一起。
        </myui-text>

        <myui-text variant="eyebrow" tone="faint">04 / mono</myui-text>
        <myui-text variant="mono">SYS/0x1A2B · LATENCY 12ms · OK</myui-text>
      </div>
    `,
  }),
}

/** Every step of the type scale, with the token name as its label. */
export const Sizes: Story = {
  render: () => ({
    components: { MyuiText },
    template: `
      <div style="display:flex; flex-direction:column; gap:var(--myui-space-3); align-items:flex-start">
        <div style="display:flex; align-items:baseline; gap:var(--myui-space-4)">
          <myui-text variant="mono" tone="faint" style="width:4ch">3xl</myui-text>
          <myui-text variant="display" size="3xl">街区夜市</myui-text>
        </div>
        <div style="display:flex; align-items:baseline; gap:var(--myui-space-4)">
          <myui-text variant="mono" tone="faint" style="width:4ch">2xl</myui-text>
          <myui-text variant="display" size="2xl">街区夜市</myui-text>
        </div>
        <div style="display:flex; align-items:baseline; gap:var(--myui-space-4)">
          <myui-text variant="mono" tone="faint" style="width:4ch">xl</myui-text>
          <myui-text variant="display" size="xl">街区夜市</myui-text>
        </div>
        <div style="display:flex; align-items:baseline; gap:var(--myui-space-4)">
          <myui-text variant="mono" tone="faint" style="width:4ch">lg</myui-text>
          <myui-text variant="display" size="lg">街区夜市</myui-text>
        </div>
        <div style="display:flex; align-items:baseline; gap:var(--myui-space-4)">
          <myui-text variant="mono" tone="faint" style="width:4ch">md</myui-text>
          <myui-text variant="display" size="md">街区夜市</myui-text>
        </div>
        <div style="display:flex; align-items:baseline; gap:var(--myui-space-4)">
          <myui-text variant="mono" tone="faint" style="width:4ch">sm</myui-text>
          <myui-text variant="display" size="sm">街区夜市</myui-text>
        </div>
        <div style="display:flex; align-items:baseline; gap:var(--myui-space-4)">
          <myui-text variant="mono" tone="faint" style="width:4ch">xs</myui-text>
          <myui-text variant="display" size="xs">街区夜市</myui-text>
        </div>
      </div>
    `,
  }),
}

/** The whole semantic ramp. Every step clears AA on the deep-space ground. */
export const Tones: Story = {
  render: () => ({
    components: { MyuiText },
    template: `
      <div style="display:flex; flex-direction:column; gap:var(--myui-space-2)">
        <myui-text size="lg" tone="default">default — 主文字，冰白</myui-text>
        <myui-text size="lg" tone="soft">soft — 次级说明</myui-text>
        <myui-text size="lg" tone="faint">faint — 次要信息，别拿来做正文</myui-text>
        <myui-text size="lg" tone="accent">accent — 唯一行动色，电光青</myui-text>
        <myui-text size="lg" tone="signal">signal — 警示 / NEW</myui-text>
        <myui-text size="lg" tone="success">success — 已同步</myui-text>
        <myui-text size="lg" tone="warning">warning — 额度将尽</myui-text>
        <myui-text size="lg" tone="danger">danger — 链路断开</myui-text>
        <myui-text size="lg" tone="info">info — 中立提示</myui-text>
      </div>
    `,
  }),
}

/** Opt-in only. The glow is static, visible without animation. */
export const Glow: Story = {
  render: () => ({
    components: { MyuiText },
    template: `
      <div style="display:flex; flex-direction:column; gap:var(--myui-space-5); align-items:flex-start">
        <myui-text variant="eyebrow" tone="faint">glow = true</myui-text>
        <myui-text variant="display" size="3xl" glow>OPEN 24H</myui-text>
        <myui-text variant="display" size="2xl" tone="signal" glow>LAST 3 LEFT</myui-text>
        <myui-text variant="mono" tone="accent" glow>SYS/LINK · ONLINE</myui-text>
        <myui-text variant="eyebrow" tone="faint">glow = false</myui-text>
        <myui-text variant="display" size="3xl">OPEN 24H</myui-text>
      </div>
    `,
  }),
}

/** One line and three lines, cut with an ellipsis. The box never changes size. */
export const Truncate: Story = {
  render: () => ({
    components: { MyuiText },
    template: `
      <div style="display:flex; flex-direction:column; gap:var(--myui-space-4); max-width:30ch">
        <myui-text variant="eyebrow" tone="faint">truncate = 1</myui-text>
        <myui-text :truncate="1" style="max-width:30ch">
          深夜市场只开三小时，过时不候，队尾的人自己认命，摊主从不解释规则。
        </myui-text>

        <myui-text variant="eyebrow" tone="faint">truncate = 3</myui-text>
        <myui-text :truncate="3" style="max-width:30ch">
          深夜市场只开三小时，过时不候。摊主把最后一盏灯留在最里面，谁先闻到机油味谁就找得到。
          这里的规矩简单：不许拍照，不许问价，不许空手出门。
        </myui-text>
      </div>
    `,
  }),
}

/** `as` turns the primitive into real headings, paragraphs, labels and code. */
export const Semantics: Story = {
  render: () => ({
    components: { MyuiText },
    template: `
      <div style="display:flex; flex-direction:column; gap:var(--myui-space-3); align-items:flex-start">
        <myui-text as="h2" variant="display" size="xl">DROP 07 · 街区夜市</myui-text>
        <myui-text as="p" variant="body" style="max-width:52ch">
          用 <code>as</code> 决定标签：标题仍是 h2，正文仍是 p，读屏软件和搜索引擎看到的结构不会因为视觉改版而丢。
        </myui-text>
        <myui-text as="label" for="demo-mail" variant="eyebrow" tone="accent">邮箱</myui-text>
        <myui-text as="code" variant="mono" tone="soft">npm i @arvinzxy/mango-ui</myui-text>
      </div>
    `,
  }),
}

/** 中英混排, figures and units — the everyday case of a Chinese product. */
export const Mixed: Story = {
  render: () => ({
    components: { MyuiText },
    template: `
      <div style="display:flex; flex-direction:column; gap:var(--myui-space-4); align-items:flex-start">
        <myui-text variant="display" size="3xl">128<template #suffix>TB</template></myui-text>
        <myui-text variant="display" size="xl" tone="accent">¥1,299<template #suffix>起</template></myui-text>
        <myui-text as="p" variant="body" style="max-width:46ch">
          NIGHT MARKET 07 是今年最后一次线下发售，库存 240 件，00:00 开闸，售完即止。
        </myui-text>
        <myui-text variant="mono" tone="soft">ORDER #A7F3 · 2 items · ￥2,598</myui-text>
      </div>
    `,
  }),
}
