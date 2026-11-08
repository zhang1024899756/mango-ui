---
title: Text 文字
description: 排印原语——同一段字在展示体、HUD 微标签、正文、等宽之间切换，字距行高字重全部是显式 props。
---

# Text 文字

排印系统本身，不是「会发光的 div」。

`Text` 把一套赛博排印的决定收进 props：**嗓音**（display / eyebrow / body / mono）给出全套默认，`size / weight / leading / tracking / transform` 任何一项显式传入都覆盖默认。消费方不需要写内联 style，也不需要为「这段字该多紧」再做一次设计。

一句话记：**display 收，eyebrow 放，body 舒服，mono 后退一格。**

## 四种嗓音

同一句文案，四种嗓音各说一遍。

::: demo
<div class="demo-stack">
<MyuiText variant="eyebrow" tone="faint">01 / display</MyuiText>
<MyuiText variant="display" size="2xl">NIGHT MARKET</MyuiText>
<MyuiText variant="eyebrow" tone="faint">02 / eyebrow</MyuiText>
<MyuiText variant="eyebrow" tone="accent">LIMITED DROP · 24H</MyuiText>
<MyuiText variant="eyebrow" tone="faint">03 / body</MyuiText>
<MyuiText as="p" variant="body" style="max-width:44ch">这是一段正文。行高 1.5、字距 0，中文和 English 混排也不会挤在一起，读起来是给人看的，不是给仪表盘看的。</MyuiText>
<MyuiText variant="eyebrow" tone="faint">04 / mono</MyuiText>
<MyuiText variant="mono">SYS/0x1A2B · LATENCY 12ms · OK</MyuiText>
</div>
:::

```vue
<MyuiText variant="display" size="2xl">NIGHT MARKET</MyuiText>
<MyuiText variant="eyebrow" tone="accent">LIMITED DROP · 24H</MyuiText>
<MyuiText as="p" variant="body">这是一段正文。</MyuiText>
<MyuiText variant="mono">SYS/0x1A2B · LATENCY 12ms · OK</MyuiText>
```

### 嗓音对照表

| 嗓音 | 字体 | 默认字阶 | 字重 | 行高 | 字距 | 大写 | 用在哪 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `display` | `--myui-font-display`（Chakra Petch） | `2xl` | `black` | `tight` 1.05 | `tight` -0.01em | 否 | 主标题、价格、巨型数字 |
| `eyebrow` | `--myui-font-mono` | `xs` | `bold` | `snug` 1.25 | `wide` 0.16em | **是** | HUD 微标签、分类、状态戳 |
| `body` | `--myui-font-body`（Inter + 中文黑体） | `md` | `regular` | `normal` 1.5 | `normal` 0 | 否 | 正文、说明、长文案 |
| `mono` | `--myui-font-mono` | `sm` | `medium` | `snug` 1.25 | `wide` 0.16em | 否 | 编号、参数、日志、状态串 |

默认字阶跟着嗓音走，**显式传 `size` 就按 `size`**：`<MyuiText variant="eyebrow" size="lg">` 就是 19px 的微标签，字距仍然开着。

## 字距与行高：为什么 display 收、eyebrow 放

字距不是审美偏好，是光学修正：

- **display 要收**。字越大，笔画之间的留白越多，看上去就越散。大标题的字距收到 `-0.01em`，字才有被「压成一块」的整体感。行高同时收到 `1.05` —— 标题是一块形状，不是几行字。
- **eyebrow 要放**。12px 的大写微标签如果按正文间距排，会糊成一串。拉到 `0.16em`，每个字母站住，才读得出是标签。它永远只有一行，所以行高收到 `1.25` 就够。
- **body 不动**。正文任何额外的字距都是负担，行高才是可读性旋钮：`normal` 1.5 起步，长段落用 `relaxed` 1.65。
- **mono 略放**。等宽字有天然的字符宽度，再拉开一点正好把编号读成一串刻度。

字距有三档：`tight` / `normal` / `wide`，行高有四档：`tight` / `snug` / `normal` / `relaxed`。都来自 `tokens.scss`，没有第五档。

::: demo
<div class="demo-stack">
<MyuiText variant="eyebrow" tone="faint">tracking · tight</MyuiText>
<MyuiText variant="mono" tracking="tight">DROP 07 / NIGHT MARKET</MyuiText>
<MyuiText variant="eyebrow" tone="faint">tracking · normal</MyuiText>
<MyuiText variant="mono" tracking="normal">DROP 07 / NIGHT MARKET</MyuiText>
<MyuiText variant="eyebrow" tone="faint">tracking · wide</MyuiText>
<MyuiText variant="mono" tracking="wide">DROP 07 / NIGHT MARKET</MyuiText>
<MyuiText variant="eyebrow" tone="faint">leading · tight / normal / relaxed</MyuiText>
<div class="demo-row" style="align-items:flex-start">
<MyuiText as="p" variant="body" leading="tight" style="max-width:18ch">行高 1.05 的正文会挤成一团，只适合一句话的标题。</MyuiText>
<MyuiText as="p" variant="body" leading="normal" style="max-width:18ch">行高 1.5 的正文可以读，这是大多数段落的默认值。</MyuiText>
<MyuiText as="p" variant="body" leading="relaxed" style="max-width:18ch">行高 1.65 适合长段落，视线回到下一行时不容易串行。</MyuiText>
</div>
</div>
:::

## 字阶

七档，全部来自 `--myui-text-*`，没有第八档。

::: demo
<div class="demo-stack">
<div class="demo-row" style="align-items:baseline">
<MyuiText variant="mono" tone="faint">3xl</MyuiText>
<MyuiText variant="display" size="3xl">街区夜市</MyuiText>
</div>
<div class="demo-row" style="align-items:baseline">
<MyuiText variant="mono" tone="faint">2xl</MyuiText>
<MyuiText variant="display" size="2xl">街区夜市</MyuiText>
</div>
<div class="demo-row" style="align-items:baseline">
<MyuiText variant="mono" tone="faint">xl</MyuiText>
<MyuiText variant="display" size="xl">街区夜市</MyuiText>
</div>
<div class="demo-row" style="align-items:baseline">
<MyuiText variant="mono" tone="faint">lg</MyuiText>
<MyuiText variant="display" size="lg">街区夜市</MyuiText>
</div>
<div class="demo-row" style="align-items:baseline">
<MyuiText variant="mono" tone="faint">md</MyuiText>
<MyuiText variant="display" size="md">街区夜市</MyuiText>
</div>
<div class="demo-row" style="align-items:baseline">
<MyuiText variant="mono" tone="faint">sm</MyuiText>
<MyuiText variant="display" size="sm">街区夜市</MyuiText>
</div>
<div class="demo-row" style="align-items:baseline">
<MyuiText variant="mono" tone="faint">xs</MyuiText>
<MyuiText variant="display" size="xs">街区夜市</MyuiText>
</div>
</div>
:::

## 语义标签

`as` 决定标签。视觉可以改版，文档结构不该跟着塌：标题还是 `h2`，段落还是 `p`，表单标签还是 `label`。

::: demo
<div class="demo-stack">
<MyuiText as="h2" variant="display" size="xl">DROP 07 · 街区夜市</MyuiText>
<MyuiText as="p" variant="body" style="max-width:52ch">用 as 决定标签——读屏软件和搜索引擎看到的结构不会因为视觉改版而丢。</MyuiText>
<MyuiText as="label" variant="eyebrow" tone="accent">邮箱</MyuiText>
<MyuiText as="code" variant="mono" tone="soft">npm i mango-ui</MyuiText>
</div>
:::

```vue
<MyuiText as="h2" variant="display" size="xl">DROP 07 · 街区夜市</MyuiText>
<MyuiText as="p" variant="body">用 as 决定标签…</MyuiText>
<MyuiText as="label" variant="eyebrow" tone="accent">邮箱</MyuiText>
<MyuiText as="code" variant="mono" tone="soft">npm i mango-ui</MyuiText>
```

## 实战 · 中英混排

中文用 `body` 的字体栈兜住，英文和数字落进同一个基线。不要为了「更赛博」把整段中文塞进 display —— 那只会变成一块贴纸。

::: demo
<div class="demo-stack">
<MyuiText variant="eyebrow" tone="faint">bilingual paragraph</MyuiText>
<MyuiText as="p" variant="body" style="max-width:46ch">NIGHT MARKET 07 是今年最后一次线下发售，库存 240 件，00:00 开闸，售完即止。现场只收现金，No refunds。</MyuiText>
<MyuiText variant="eyebrow" tone="signal">SOLD OUT SOON · 即将售罄</MyuiText>
</div>
:::

## 实战 · 数字与单位

数字用 `display` 立住，单位走 `#suffix` 插槽：它自动降到 `xs`（`2xl` / `3xl` 时是 `sm`），只占位置不抢戏。

::: demo
<div class="demo-row" style="align-items:baseline; gap: var(--myui-space-6)">
<MyuiText variant="display" size="3xl">128<template #suffix>TB</template></MyuiText>
<MyuiText variant="display" size="2xl" tone="accent">¥1,299<template #suffix>起</template></MyuiText>
<MyuiText variant="display" size="xl" tone="signal">03<template #suffix>件</template></MyuiText>
</div>
:::

```vue
<MyuiText variant="display" size="3xl">128<template #suffix>TB</template></MyuiText>
<MyuiText variant="display" size="2xl" tone="accent">¥1,299<template #suffix>起</template></MyuiText>
```

## 实战 · 长文截断

`truncate` 是个行数：

- `1` 行用 `nowrap + ellipsis`，行内后缀还好端端待在同一行；
- `2` 行及以上用 `-webkit-line-clamp`，省略号出现在最后一行的末尾。

两个都是**视觉省略**：DOM 里的文字一个字都没少，读屏会读全文。所以别把关键信息藏在被截断的部分。

::: demo
<div class="demo-stack">
<MyuiText variant="eyebrow" tone="faint">truncate = 1</MyuiText>
<MyuiText :truncate="1" style="max-width:30ch">深夜市场只开三小时，过时不候，队尾的人自己认命，摊主从不解释规则。</MyuiText>
<MyuiText variant="eyebrow" tone="faint">truncate = 3</MyuiText>
<MyuiText :truncate="3" style="max-width:30ch">深夜市场只开三小时，过时不候。摊主把最后一盏灯留在最里面，谁先闻到机油味谁就找得到。这里的规矩简单：不许拍照，不许问价，不许空手出门。</MyuiText>
</div>
:::

```vue
<MyuiText :truncate="1" style="max-width: 30ch">深夜市场只开三小时…</MyuiText>
<MyuiText :truncate="3" style="max-width: 30ch">深夜市场只开三小时…</MyuiText>
```

## 霓虹灯管：glow

`glow` 是**静态**的：一串 `text-shadow`（自己的颜色做灯管芯，中间一层有色晕，最外面一层几乎看不见的雾），不跑动画，所以 `prefers-reduced-motion` 没有东西可关。半径用 `em`，字号一变整管灯跟着缩放。

它是重点，不是默认。一页里发光的字超过两处，就一个都不发光了。

::: demo
<div class="demo-stack">
<MyuiText variant="display" size="3xl" glow>OPEN 24H</MyuiText>
<MyuiText variant="display" size="2xl" tone="signal" glow>LAST 3 LEFT</MyuiText>
<MyuiText variant="mono" tone="accent" glow>SYS/LINK · ONLINE</MyuiText>
<MyuiText variant="display" size="2xl">OPEN 24H（glow 关闭，对比一眼）</MyuiText>
</div>
:::

```vue
<MyuiText variant="display" size="3xl" glow>OPEN 24H</MyuiText>
<MyuiText variant="display" size="2xl" tone="signal" glow>LAST 3 LEFT</MyuiText>
```

## 色调

九档语义色。深空底上最低的一档 `faint` 也有 5.2:1，正文级全部 AA；`accent` / `signal` 用的是 `-text` 变体，因为元素色是给填充用的，直接当文字会掉到 AA 以下。

::: demo
<div class="demo-stack">
<MyuiText size="lg" tone="default">default — 主文字，冰白</MyuiText>
<MyuiText size="lg" tone="soft">soft — 次级说明</MyuiText>
<MyuiText size="lg" tone="faint">faint — 次要信息，别拿来做正文</MyuiText>
<MyuiText size="lg" tone="accent">accent — 唯一行动色，电光青</MyuiText>
<MyuiText size="lg" tone="signal">signal — 警示 / NEW</MyuiText>
<MyuiText size="lg" tone="success">success — 已同步</MyuiText>
<MyuiText size="lg" tone="warning">warning — 额度将尽</MyuiText>
<MyuiText size="lg" tone="danger">danger — 链路断开</MyuiText>
<MyuiText size="lg" tone="info">info — 中立提示</MyuiText>
</div>
:::

## 组合起来

一块 hero，三行字、三种嗓音、一个发光标题——都是 `Text`，没有一行内联字号。

::: demo
<div class="demo-stack" style="gap: var(--myui-space-3)">
<MyuiText variant="eyebrow" tone="accent">DROP 07 / 2026.11.08 00:00</MyuiText>
<MyuiText as="h2" variant="display" size="3xl" glow>NIGHT<br />MARKET</MyuiText>
<MyuiText as="p" variant="body" tone="soft" style="max-width:40ch">最后一次线下发售。240 件，售完即止，不接受预订。</MyuiText>
<MyuiText variant="mono" tone="faint">SYS/READY · STOCK 240 · CASH ONLY</MyuiText>
</div>
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `as` | `string` | `'span'` | 渲染的标签：`p`、`h2`、`label`、`code`… |
| `variant` | `'display' \| 'eyebrow' \| 'body' \| 'mono'` | `'body'` | 嗓音，决定字重/行高/字距/大写的默认 |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl'` | 随 `variant`（`body` 为 `'md'`） | 字阶 |
| `weight` | `'regular' \| 'medium' \| 'bold' \| 'black'` | 随 `variant` | 字重 |
| `tone` | `'default' \| 'soft' \| 'faint' \| 'accent' \| 'signal' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | 语义色 |
| `leading` | `'tight' \| 'snug' \| 'normal' \| 'relaxed'` | 随 `variant` | 行高 |
| `tracking` | `'tight' \| 'normal' \| 'wide'` | 随 `variant` | 字距 |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | 对齐 |
| `transform` | `'none' \| 'uppercase'` | 随 `variant`（`eyebrow` 为 `'uppercase'`） | 大小写 |
| `truncate` | `number` | — | 大于 0 时最多 N 行，超出省略号 |
| `glow` | `boolean` | `false` | 霓虹灯管字，静态可见 |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 文字内容，原样渲染 |
| `suffix` | 行内后缀，如计数、单位、货币符号；自动降一档字号 |

## 可访问性

- **语义来自 `as`**：`Text` 不写死 `span`，也不加任何 `role`。标题用 `as="h2"`，表单标签用 `as="label"`，代码用 `as="code"` —— 视觉和结构各管各的。
- **对比度**：深空底上九档色调最低 5.2:1（`faint`），其余 6:1 起；`display` 这类大字同样达标。浅色主题下再翻转一次，最低仍是 4.5:1。
- **`faint` 不是正文色**：它是给时间戳、序号、提示语用的。正文用 `default` 或 `soft`。
- **截断不删内容**：`truncate` 只做视觉省略，读屏会读到全文；因此不要把唯一的关键信息放在会被截断的部分。
- **发光不影响可读性**：`glow` 只在文字周围叠光，不改变墨色，也不跑动画，开关 reduced-motion 都不会让内容消失或闪烁。
