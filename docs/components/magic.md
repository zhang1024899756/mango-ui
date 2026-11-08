---
title: Magic 魔法特效
description: 一个能套住任何东西的特效壳——文字、按钮、图片、整块卡片，套上就开始故障。
---

# Magic 魔法特效

`Magic` 不是一段会动的文字，而是一个**壳**。里面放纯文本、放 `<MyuiButton>`、放 `<img>`、放一整块卡片，它都能跑。

两种渲染策略，各管一种内容：

- **文本模式**（传 `text`）—— 它拥有这串字，所以可以用 `::before` / `::after` + `attr(data-text)` 把字形复制成两个色通道。这是唯一会复制字形的模式。
- **包裹模式**（用插槽）—— 它**不复制任何 DOM**，只在壳上跑 `transform` 和 `filter`。按钮还是那颗按钮，事件、焦点、布局一个都不动。

## 基础用法

传 `text` 就是最经典的故障字：两行扫描切片左右错开。

::: demo
<div class="demo-row">
<MyuiMagic text="MANGO UI" />
<MyuiMagic mode="scan" text="MANGO UI" />
<MyuiMagic mode="flicker" text="MANGO UI" />
</div>
:::

```vue
<MyuiMagic text="MANGO UI" />
<MyuiMagic mode="scan" text="MANGO UI" />
<MyuiMagic mode="flicker" text="MANGO UI" />
```

三种模式：

| 模式 | 画面上发生什么 |
| --- | --- |
| `glitch` | 双通道色分离 + 微量抖动，切片跳帧 |
| `scan` | 一条强调色光带横向扫过，像复印机走过一页 |
| `flicker` | 整块忽亮忽暗，像接触不良的灯管 |

## 包裹真正的组件

插槽内容原样保留，焦点、点击、无障碍语义都不受影响。

::: demo
<div class="demo-row">
<MyuiMagic>
<MyuiButton size="lg">立即抢购</MyuiButton>
</MyuiMagic>
<MyuiMagic mode="scan" :intensity="0.8">
<MyuiButton variant="outline" size="lg" tone="ink">扫描一下</MyuiButton>
</MyuiMagic>
</div>
:::

```vue
<MyuiMagic>
  <MyuiButton size="lg">立即抢购</MyuiButton>
</MyuiMagic>

<MyuiMagic mode="scan" :intensity="0.8">
  <MyuiButton variant="outline" size="lg" tone="ink">扫描一下</MyuiButton>
</MyuiMagic>
```

整块卡片也一样。`as="div"` 让它回到块级流，卡片该多宽还是多宽。

::: demo
<MyuiMagic as="div" :intensity="0.6">
<div style="width:260px; padding:var(--myui-space-5); background-color:var(--myui-color-surface); border:var(--myui-border-width) solid var(--myui-color-line); box-shadow:var(--myui-shadow-hard)">
<div style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-tight)">NIGHT MARKET</div>
<p style="margin:var(--myui-space-2) 0 0; font-size:var(--myui-text-sm); color:var(--myui-color-ink-soft)">整块卡片一起故障，布局不动。</p>
</div>
</MyuiMagic>
:::

```vue
<MyuiMagic as="div" :intensity="0.6">
  <div style="width:260px; border:var(--myui-border-width) solid var(--myui-color-line)">…</div>
</MyuiMagic>
```

图片同理——`glitch` 的色差来自整个轮廓的投影，透明边也一样成立。

::: demo
<div class="demo-row">
<MyuiMagic>
<svg width="160" height="96" viewBox="0 0 160 96" role="img" aria-label="示例海报" style="display:block">
<rect width="160" height="96" style="fill:var(--myui-color-paper)" />
<rect x="5" y="5" width="150" height="86" fill="none" style="stroke:var(--myui-color-line)" stroke-width="3" />
<circle cx="40" cy="48" r="22" style="fill:var(--myui-color-accent)" />
<rect x="76" y="30" width="60" height="10" style="fill:var(--myui-color-ink)" />
<rect x="76" y="52" width="40" height="10" style="fill:var(--myui-color-ink)" />
</svg>
</MyuiMagic>
</div>
:::

## 速度与强度

`speed` 决定一个循环多长，`intensity` 是唯一的刻度旋钮：它缩放色差距离、抖动幅度和光带强度，`0` 就是不动，`1` 是极限。

::: demo
<div class="demo-stack">
<div class="demo-row">
<MyuiMagic text="SLOW" speed="slow" />
<MyuiMagic text="NORMAL" speed="normal" />
<MyuiMagic text="FAST" speed="fast" />
</div>
<div class="demo-row">
<MyuiMagic text="0.0" :intensity="0" />
<MyuiMagic text="0.5" :intensity="0.5" />
<MyuiMagic text="1.0" :intensity="1" />
</div>
</div>
:::

```vue
<MyuiMagic text="FAST" speed="fast" />
<MyuiMagic text="1.0" :intensity="1" />
```

`intensity` 小于 0 会按 0 处理，大于 1 按 1 处理，传 `NaN` 回到默认的 `0.5`——非法值进不了 CSS。

## 换通道颜色

两个通道默认取品牌给的强调色和 info 色。想换成别的，直接改 `colorA` / `colorB`，接受任何 CSS 颜色值。

::: demo
<div class="demo-row">
<MyuiMagic text="INK" color-a="var(--myui-color-ink)" color-b="var(--myui-color-accent)" />
<MyuiMagic text="MINT" color-a="var(--myui-color-success)" color-b="var(--myui-color-warning)" />
</div>
:::

```vue
<MyuiMagic text="INK" color-a="var(--myui-color-ink)" color-b="var(--myui-color-accent)" />
```

## 暂时停用

`active` 只关特效、不动内容。`false` 时它连扫描光带都不渲染。

::: demo
<div class="demo-row">
<MyuiMagic text="运行中" />
<MyuiMagic text="已停用" :active="false" />
</div>
:::

```vue
<MyuiMagic text="已停用" :active="false" />
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `mode` | `'glitch' \| 'scan' \| 'flicker'` | `'glitch'` | 特效模式 |
| `speed` | `'slow' \| 'normal' \| 'fast'` | `'normal'` | 循环速度 |
| `active` | `boolean` | `true` | 是否运行 |
| `intensity` | `number` | `0.5` | 强度，0 到 1 |
| `colorA` | `string` | `'var(--myui-color-accent)'` | 第一（左/上）通道颜色 |
| `colorB` | `string` | `'var(--myui-color-info)'` | 第二（右/下）通道颜色 |
| `text` | `string` | — | 文本模式：渲染这段字，优先于插槽 |
| `as` | `string` | `'span'` | 壳用哪个标签，块级标签自动回到块级流 |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 任意内容，原样渲染、不复制。传了 `text` 时被忽略。 |

## 可访问性

特效是纯装饰：不添加角色，不改语义，不接管键盘。文本模式复制出来的字形是伪元素，读屏不读第二遍；扫描光带是空的 `aria-hidden` 元素、`pointer-events: none`，点击照样穿透到里面的按钮。

`prefers-reduced-motion: reduce` 时全部静止：动画关掉，切片副本移除，光带不渲染——只留下内容本身。

一个边界：`scan` 运行时会把壳设成 `position: relative`（光带要贴着它走），所以如果壳里塞了绝对定位的子元素，它们的参照物会变成这个壳。`glitch` 和 `flicker` 没有这个问题。
