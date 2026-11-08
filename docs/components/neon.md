---
title: Neon 霓虹特效
description: 一个能套住任何东西的灯管壳——文字、按钮、图片、整块卡片，通电就亮，静止时也亮着。
---

# Neon 霓虹特效

`Neon` 不是一段会动的文字，是一根**灯管**。里面放纯文本、放 `<MyuiButton>`、放 `<img>`、放一整块卡片，它就把这件东西通电。

它由原来的 `Magic` 更名而来。旧版的 `glitch` 模式（双色通道 + 切片抖动 + 复制字形）**已随重命名移除**——它一直以来的实际观感就是霓虹，名字却叫故障。现在是霓虹语义的三种模式：`glow` / `flicker` / `scan`。

两种渲染策略，各管一种内容：

- **文本模式**（传 `text`）—— 它拥有这串字，所以可以直接给**字形本身**叠 `text-shadow`。灯管是字的颜色，光晕是字的影子，**不再复制任何字形副本**。
- **包裹模式**（用插槽）—— 它**不碰里面的 DOM**，只在壳上挂 `filter: drop-shadow()`。投影跟的是「画出来的轮廓」，所以同一条规则能照亮文字、按钮、图片和卡片，而不用知道手里是哪一种。

## 最重要的一条：静止态就是霓虹

大部分特效组件的缺陷在这里：光晕只写在 `@keyframes` 里，于是动画一停（reduced-motion、截图、打印、动画被暂停），画面就退回普通内容——「部分地方特效没有出现」就是这么来的。

这里的做法反过来：**基础光晕写在普通规则里**，`intensity` 缩放它的三层半径；动画只负责「加成」，它乘的那个系数 `--myui-neon-breath` 静止值就是 `1`。

下面左边通电，右边 `active="false"` 关灯——**关掉之后只剩冰白色的字，没有一圈光**。差别就是这个组件存在的理由。

::: demo
<div class="demo-row" style="gap:var(--myui-space-8)">
<MyuiNeon text="ON AIR" style="font-family:var(--myui-font-display); font-size:var(--myui-text-2xl); letter-spacing:var(--myui-tracking-wide)" />
<MyuiNeon :active="false" text="OFF AIR" style="font-family:var(--myui-font-display); font-size:var(--myui-text-2xl); letter-spacing:var(--myui-tracking-wide)" />
</div>
:::

```vue
<MyuiNeon text="ON AIR" />
<MyuiNeon text="OFF AIR" :active="false" />
```

想自己验证：在系统里打开「减少动态效果」，或者直接给页面加 `* { animation: none !important }`——字还是亮的。

## 三种模式

模式只决定**动画怎么叠上去**，不影响静止态的光。

| 模式 | 画面上发生什么 |
| --- | --- |
| `glow` | 灯管常亮，气体缓缓起伏（呼吸） |
| `flicker` | 接触不良：硬切掉电，闪几下又亮回来，但从不全黑 |
| `scan` | 一条光带横向扫过，像有人举着灯管读了一遍 |

::: demo
<div class="demo-row" style="gap:var(--myui-space-8)">
<MyuiNeon text="GLOW" style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-wide)" />
<MyuiNeon mode="flicker" text="FLICKER" style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-wide)" />
<MyuiNeon mode="scan" text="SCAN" style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-wide)" />
</div>
:::

```vue
<MyuiNeon text="GLOW" />
<MyuiNeon mode="flicker" text="FLICKER" />
<MyuiNeon mode="scan" text="SCAN" />
```

## 包裹四类内容

同一根灯管，四种东西都亮得起来。插槽内容原样保留：焦点、点击、无障碍语义一个都不动。

**纯文字**——投影顺着字形走，所以它看起来是一圈围绕文字的光。

::: demo
<div class="demo-row">
<MyuiNeon style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide); color:var(--myui-color-text)">DROP 01 · 限量</MyuiNeon>
</div>
:::

```vue
<MyuiNeon>
  <span style="font-size:var(--myui-text-lg)">DROP 01 · 限量</span>
</MyuiNeon>
```

**按钮**——`MyuiButton` 的实心块被整个描了一圈光，按钮还是那颗按钮。

::: demo
<div class="demo-row">
<MyuiNeon>
<MyuiButton size="lg">立即抢购</MyuiButton>
</MyuiNeon>
<MyuiNeon mode="scan" :intensity="0.8">
<MyuiButton variant="outline" size="lg">扫描一下</MyuiButton>
</MyuiNeon>
</div>
:::

```vue
<MyuiNeon>
  <MyuiButton size="lg">立即抢购</MyuiButton>
</MyuiNeon>
```

**图片 / 内联 SVG**——光绕的是图画本身的轮廓，透明边也一样成立。

::: demo
<div class="demo-row">
<MyuiNeon :intensity="0.8">
<svg width="160" height="96" viewBox="0 0 160 96" role="img" aria-label="示例海报" style="display:block">
<rect width="160" height="96" style="fill:var(--myui-color-surface-deep)" />
<rect x="5" y="5" width="150" height="86" fill="none" style="stroke:var(--myui-color-line-strong)" stroke-width="1" />
<circle cx="40" cy="48" r="22" style="fill:var(--myui-color-accent)" />
<rect x="76" y="30" width="60" height="10" style="fill:var(--myui-color-text)" />
<rect x="76" y="52" width="40" height="10" style="fill:var(--myui-color-text-soft)" />
</svg>
</MyuiNeon>
<MyuiNeon mode="flicker" :intensity="0.7">
<svg width="160" height="96" viewBox="0 0 160 96" role="img" aria-label="示例海报二" style="display:block">
<rect width="160" height="96" style="fill:var(--myui-color-surface-deep)" />
<rect x="5" y="5" width="150" height="86" fill="none" style="stroke:var(--myui-color-line-strong)" stroke-width="1" />
<path d="M30 68 L60 28 L90 68 Z" style="fill:var(--myui-color-signal)" />
<rect x="104" y="30" width="32" height="38" style="fill:var(--myui-color-text)" />
</svg>
</MyuiNeon>
</div>
:::

```vue
<MyuiNeon :intensity="0.8">
  <img src="poster.png" alt="海报" />
</MyuiNeon>
```

**整块卡片**——`as="div"` 让它回到块级流，卡片该多宽还是多宽，只是外面多了一圈光。

::: demo
<div class="demo-row" style="align-items:flex-start">
<MyuiNeon as="div" :intensity="0.6">
<div style="width:280px; padding:var(--myui-space-5); background-color:var(--myui-color-surface); border:var(--myui-border-width) solid var(--myui-color-line)">
<div style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-tight); color:var(--myui-color-text)">NIGHT MARKET</div>
<p style="margin:var(--myui-space-2) 0 0; font-size:var(--myui-text-sm); color:var(--myui-color-text-soft)">整块卡片通电，布局不动。</p>
</div>
</MyuiNeon>
<MyuiNeon as="div" mode="scan" :intensity="0.9">
<div style="width:280px; padding:var(--myui-space-5); background-color:var(--myui-color-surface); border:var(--myui-border-width) solid var(--myui-color-line-strong)">
<div style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-tight); color:var(--myui-color-text)">OPEN LATE</div>
<p style="margin:var(--myui-space-2) 0 0; font-size:var(--myui-text-sm); color:var(--myui-color-text-soft)">光带扫过整块面板。</p>
</div>
</MyuiNeon>
</div>
:::

```vue
<MyuiNeon as="div" :intensity="0.6">
  <div style="width:280px; border:1px solid var(--myui-color-line)">…</div>
</MyuiNeon>
```

## 强度与速度

`intensity` 是唯一的刻度旋钮：它缩放三层光晕的半径。**`0` 是真的没有光晕**（半径归零，不是「暗一圈」）——字本身仍是灯管色，只是不再散光；要连颜色一起收掉用 `active="false"`。`speed` 决定一个循环多长，只影响动画节奏，不影响静止态。

::: demo
<div class="demo-stack">
<div class="demo-row" style="gap:var(--myui-space-8)">
<MyuiNeon :intensity="0" text="0.0" style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide)" />
<MyuiNeon :intensity="0.35" text="0.35" style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide)" />
<MyuiNeon :intensity="0.7" text="0.7" style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide)" />
<MyuiNeon :intensity="1" text="1.0" style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide)" />
</div>
<div class="demo-row" style="gap:var(--myui-space-8)">
<MyuiNeon speed="slow" text="SLOW" style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide)" />
<MyuiNeon speed="normal" text="NORMAL" style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide)" />
<MyuiNeon speed="fast" text="FAST" style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide)" />
</div>
</div>
:::

```vue
<MyuiNeon :intensity="1" text="1.0" />
<MyuiNeon speed="fast" text="FAST" />
```

`intensity` 小于 0 按 0，大于 1 按 1，传 `NaN` 回到默认的 `0.5`——非法值进不了 CSS。

## 换灯管颜色

`colorA` 是灯管本身（字色 / 主光），`colorB` 是外圈雾。默认取品牌给的强调色和 info 色；接受任何 CSS 颜色值。

::: demo
<div class="demo-row" style="gap:var(--myui-space-8)">
<MyuiNeon text="SIGNAL" color-a="var(--myui-color-signal)" color-b="var(--myui-color-accent)" style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-wide)" />
<MyuiNeon text="SUCCESS" color-a="var(--myui-color-success)" color-b="var(--myui-color-warning)" style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-wide)" />
</div>
:::

```vue
<MyuiNeon text="SIGNAL" color-a="var(--myui-color-signal)" color-b="var(--myui-color-accent)" />
```

## 关灯

`active="false"` 只关灯管，不动内容：没有光、没有动画、连扫描光带都不渲染。内容该怎样还是怎样。

::: demo
<div class="demo-row" style="gap:var(--myui-space-8)">
<MyuiNeon text="营业中" style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-wide)" />
<MyuiNeon :active="false" text="已打烊" style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-wide)" />
</div>
:::

```vue
<MyuiNeon text="已打烊" :active="false" />
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `mode` | `'glow' \| 'flicker' \| 'scan'` | `'glow'` | 叠加在静止光晕之上的动画模式 |
| `speed` | `'slow' \| 'normal' \| 'fast'` | `'normal'` | 循环速度 |
| `active` | `boolean` | `true` | 是否通电 |
| `intensity` | `number` | `0.5` | 强度，0 到 1；0 时没有光晕（字仍是灯管色） |
| `colorA` | `string` | `'var(--myui-color-accent)'` | 灯管主色 |
| `colorB` | `string` | `'var(--myui-color-info)'` | 外圈雾色 |
| `text` | `string` | — | 文本模式：点亮这段字，优先于插槽 |
| `as` | `string` | `'span'` | 壳用哪个标签，块级标签自动回到块级流 |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 任意内容，原样渲染、不复制。传了 `text` 时被忽略。 |

## 可访问性

特效是纯装饰：不添加角色，不改语义，不接管键盘。文本模式只渲染一份字形（旧的 `::before` 复制副本随 `glitch` 一起删掉了），读屏不会读第二遍；扫描光带是空的 `aria-hidden` 元素、`pointer-events: none`，点击照样穿透到里面的按钮。

**`prefers-reduced-motion: reduce` 时保留静态光晕，只停动画**——这是对旧版的修正：旧版会把特效整个关掉，于是「关掉动画 = 什么都没有」。静止的霓虹招牌仍然是霓虹招牌，所以这里留下光、只收走运动；唯一被藏起来的是那条扫光，因为它停在半路会像渲染错误。

两个需要知道的边界：

- 光晕挂在 `filter` 上，所以壳会成为 `position: fixed` 子元素的包含块，也会形成一个层叠上下文。里面不要塞 portal / 全屏遮罩的宿主。
- `scan` 运行时壳会被设成 `position: relative`（光带要贴着它走），绝对定位的子元素会以壳为参照物。`glow` 和 `flicker` 没有这个问题。
- 大面积内容 + `glow` 的组合会持续重绘滤镜，卡片级别没问题，整屏级别请降 `intensity` 或改用 `scan`。
