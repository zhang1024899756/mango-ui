---
title: Button 按钮
description: 系统里最亮的元素。霓虹辉光，悬停亮起并上浮 1px，按下时光熄灭。
---

# Button 按钮

一个页面上只该有一个主按钮。`solid` 抢强调色，`outline` 与它竞争，
`ghost` 与 `text` 退到背景里。

它的签名动作是那圈**辉光**：悬停时整体上浮 1px、光晕扩散到 18px，
按下时光熄灭并回落——像按下一枚控制台按键。

## 基础用法

::: demo
<div class="demo-row">
<MyuiButton>立即抢购</MyuiButton>
<MyuiButton variant="outline">加入收藏</MyuiButton>
</div>
:::

```vue
<MyuiButton>立即抢购</MyuiButton>
<MyuiButton variant="outline">加入收藏</MyuiButton>
```

## 变体

::: demo
<div class="demo-row">
<MyuiButton variant="solid">SOLID</MyuiButton>
<MyuiButton variant="outline">OUTLINE</MyuiButton>
<MyuiButton variant="ghost">GHOST</MyuiButton>
<MyuiButton variant="text">TEXT</MyuiButton>
</div>
:::

## 语义色

`tone` 决定按钮声明哪种颜色。`accent` 是系统里唯一的强调色，只给主操作。

::: demo
<div class="demo-row">
<MyuiButton tone="accent">ACCENT</MyuiButton>
<MyuiButton tone="ink">INK</MyuiButton>
<MyuiButton tone="neutral">NEUTRAL</MyuiButton>
<MyuiButton tone="danger">DANGER</MyuiButton>
</div>
:::

## 尺寸

::: demo
<div class="demo-row">
<MyuiButton size="sm">SMALL</MyuiButton>
<MyuiButton size="md">MEDIUM</MyuiButton>
<MyuiButton size="lg">LARGE</MyuiButton>
</div>
:::

## 胶囊与块级

::: demo
<div class="demo-stack" style="width: 100%">
<div class="demo-row">
<MyuiButton shape="pill">PILL</MyuiButton>
<MyuiButton shape="pill" variant="outline">PILL OUTLINE</MyuiButton>
</div>
<MyuiButton block>BLOCK · 占满一行</MyuiButton>
</div>
:::

## 图标

`#prefix` 与 `#suffix` 插槽放图标；`iconOnly` 用于方形图标按钮。

::: demo
<div class="demo-row">
<MyuiButton>
  <template #prefix><MyuiIcon name="sparkle" /></template>
  限量发售
</MyuiButton>
<MyuiButton variant="outline">
  查看详情
  <template #suffix><MyuiIcon name="arrow-right" /></template>
</MyuiButton>
<MyuiButton icon-only tone="ink" aria-label="添加"><MyuiIcon name="plus" /></MyuiButton>
</div>
:::

## 状态

::: demo
<div class="demo-row">
<MyuiButton>默认</MyuiButton>
<MyuiButton loading>处理中</MyuiButton>
<MyuiButton disabled>不可用</MyuiButton>
</div>
:::

## 作为链接

只要传了 `href`，组件就渲染成 `<a>`——长得像按钮的链接必须表现得像链接
（可右键、可新窗口打开、可被爬虫抓取）。`external` 场景自动补 `rel`：

::: demo
<div class="demo-row">
<MyuiButton href="https://github.com/zhang1024899756/mango-ui" target="_blank">GitHub</MyuiButton>
<MyuiButton variant="outline" href="https://github.com/zhang1024899756/mango-ui" target="_blank">在新窗口打开</MyuiButton>
</div>
:::

```vue
<MyuiButton href="/drops" target="_blank">GitHub</MyuiButton>
```

## 斜切形态

`skew` 是形体，不是状态：整枚按钮按 `--myui-skew-angle`（默认 `-12deg`）斜切，
标签随之倾斜——这里要的是几何，不是给正立的字套一个斜框。

它可以和所有变体、语义色、尺寸组合。剪切值存在 `--myui-shear` 变量里，所以悬停的
1px 上浮、按下的回落都还在，不会因为多了一个形状就失效。

::: demo
<div class="demo-row">
<MyuiButton skew>立即抢购</MyuiButton>
<MyuiButton skew variant="outline">加入收藏</MyuiButton>
<MyuiButton skew tone="ink">ENTER GRID</MyuiButton>
<MyuiButton skew variant="ghost" size="sm">SMALL</MyuiButton>
</div>
:::

```vue
<MyuiButton skew>立即抢购</MyuiButton>
<MyuiButton skew variant="outline">加入收藏</MyuiButton>
```

## 渐变形态

`tone="spectrum"` 是系统里唯一的多色形态：填充换成 `--myui-gradient-spectrum`
（青 → 蓝 → 紫 → 品红，100deg），字色切到 `--myui-color-accent-ink`。

这个字色是算出来的，不是挑出来的：深色墨在四个色标上分别是青 11.9:1、蓝 5.1:1、
紫 5.8:1、品红 5.4:1，全部过 AA；反过来浅色字在青色端只有 1.6:1。所以渐变按钮
永远不接浅色字。

它是表达层，不是语义层——错误按钮不会因为好看而变成渐变。

::: demo
<div class="demo-row">
<MyuiButton tone="spectrum">进入传送门</MyuiButton>
<MyuiButton tone="spectrum" variant="outline">OUTLINE</MyuiButton>
<MyuiButton tone="spectrum" variant="ghost">GHOST</MyuiButton>
<MyuiButton tone="spectrum" skew>斜切 + 渐变</MyuiButton>
</div>
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `'solid' \| 'outline' \| 'ghost' \| 'text'` | `'solid'` | 视觉权重 |
| `tone` | `'accent' \| 'ink' \| 'neutral' \| 'danger' \| 'spectrum'` | `'accent'` | 语义色；`spectrum` 是多色渐变形态 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸（32 / 40 / 48px 高） |
| `shape` | `'rect' \| 'pill'` | `'rect'` | 方角或胶囊 |
| `skew` | `boolean` | `false` | 斜切形态（整体按 `--myui-skew-angle` 倾斜） |
| `tag` | `'button' \| 'a'` | — | 渲染的元素；有 `href` 时自动为 `a` |
| `href` | `string` | — | 渲染为链接 |
| `target` | `string` | — | 链接目标 |
| `rel` | `string` | — | `target="_blank"` 时自动为 `noreferrer noopener` |
| `htmlType` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 button 类型 |
| `block` | `boolean` | `false` | 占满父宽度 |
| `shadow` | `boolean` | `true` | 霓虹辉光（仅 solid / outline） |
| `disabled` | `boolean` | `false` | 禁用 |
| `loading` | `boolean` | `false` | 加载中，拦截点击并设置 `aria-busy` |
| `iconOnly` | `boolean` | `false` | 等宽等高的图标按钮 |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 按钮文本 |
| `prefix` | 文本前的图标 |
| `suffix` | 文本后的图标 |

## 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `click` | `MouseEvent` | 禁用或加载中时不触发 |

## 可访问性

原生 `<button>` / `<a>` 语义；焦点环统一 3px 强调色，`outline-offset: 2px`；
加载中设置 `aria-busy="true"` 并阻止点击；禁用态使用原生 `disabled`（链接用
`aria-disabled` + `tabindex="-1"`），配色对比度在禁用态之上仍保持可辨识。
