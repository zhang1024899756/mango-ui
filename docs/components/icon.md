---
title: Icon 图标
description: 24×24 手绘线性图标——只有描边、统一线宽，不用图标字体也不许塞 emoji。
---

# Icon 图标

图标是这套系统的手写体。全部画在 24×24 的格子里：只有描边，没有填充；端点和拐角都是圆的；线宽由一个 `strokeWidth` 统一决定。所以 28 个图标排成一行，重量是齐的。

没有图标字体，没有外部依赖。想要新图标，就往 `icons.ts` 里加一条路径——`IconName` 会自动带上它。

## 基础用法

::: demo
<div class="demo-row">
<MyuiIcon name="sparkle" />
<MyuiIcon name="star" />
<MyuiIcon name="heart" />
<MyuiIcon name="search" />
<MyuiIcon name="arrow-right" />
</div>
:::

```vue
<MyuiIcon name="sparkle" />
<MyuiIcon name="star" />
```

## 尺寸

三档，跟着控件走：`sm` 16 / `md` 20 / `lg` 24。

::: demo
<div class="demo-row">
<MyuiIcon name="plus" size="sm" />
<MyuiIcon name="plus" size="md" />
<MyuiIcon name="plus" size="lg" />
</div>
:::

```vue
<MyuiIcon name="plus" size="sm" />
<MyuiIcon name="plus" size="md" />
<MyuiIcon name="plus" size="lg" />
```

## 线宽

默认 1.75。小尺寸放大会显得细，可以把线宽提到 2 以上；图标集内部必须用同一个值，否则一行图标会一胖一瘦。

::: demo
<div class="demo-row" style="color: var(--myui-color-ink)">
<MyuiIcon name="settings" size="lg" :stroke-width="1.25" />
<MyuiIcon name="settings" size="lg" :stroke-width="1.75" />
<MyuiIcon name="settings" size="lg" :stroke-width="2.5" />
</div>
:::

```vue
<MyuiIcon name="settings" size="lg" :stroke-width="2.5" />
```

## 颜色

默认 `currentColor`，跟着父级文字色走。要单独上色就传 token 变量——不要写死十六进制。

::: demo
<div class="demo-row" style="color: var(--myui-color-ink)">
<MyuiIcon name="arrow-right" size="lg" />
<MyuiIcon name="arrow-right" size="lg" color="var(--myui-color-accent)" />
<MyuiIcon name="arrow-right" size="lg" color="var(--myui-color-ink-ghost)" />
</div>
:::

```vue
<MyuiIcon name="arrow-right" color="var(--myui-color-accent)" />
```

## 旋转

给加载态和"再刷新一次"用。`prefers-reduced-motion` 下会自动停住。

::: demo
<div class="demo-row">
<MyuiIcon name="settings" size="lg" spin />
<MyuiIcon name="sparkle" size="lg" spin />
</div>
:::

```vue
<MyuiIcon name="settings" spin />
```

## 全部图标

28 个。名字就是 `name` 的取值。

::: demo
<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(96px,1fr)); gap:var(--myui-space-3); width:100%">
<div v-for="name in ['arrow-right','arrow-left','arrow-up','arrow-down','chevron-down','chevron-up','chevron-left','chevron-right','close','check','plus','minus','search','menu','external-link','copy','trash','settings','user','mail','lock','info','warning','star','heart','play','pause','sparkle']" :key="name" style="display:flex; flex-direction:column; align-items:center; gap:var(--myui-space-1); padding:var(--myui-space-3) var(--myui-space-1); border:var(--myui-border-hair)">
<MyuiIcon :name="name" size="lg" />
<span style="font-size:var(--myui-text-xs); color:var(--myui-color-ink-ghost)">{{ name }}</span>
</div>
</div>
:::

## 自定义 SVG

没有 `name` 时，默认插槽说了算。插槽里的内容继承同一套描边属性，所以自绘图标不会显得格格不入。

::: demo
<div class="demo-row" style="color: var(--myui-color-ink)">
<MyuiIcon size="lg">
<rect x="4" y="4" width="16" height="16" />
<path d="M4 12h16M12 4v16" />
</MyuiIcon>
</div>
:::

```vue
<MyuiIcon size="lg">
  <rect x="4" y="4" width="16" height="16" />
  <path d="M4 12h16M12 4v16" />
</MyuiIcon>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `IconName` | `undefined` | 内置图标名；不传就用插槽 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 16 / 20 / 24 |
| `color` | `string` | `'currentColor'` | 任意 CSS 颜色，建议传 token 变量 |
| `spin` | `boolean` | `false` | 持续旋转 |
| `strokeWidth` | `number` | `1.75` | 24 格内的描边宽度 |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 没有 `name` 时渲染的任意 SVG 内容 |

## 可访问性

默认 `aria-hidden="true"`——图标挨着文字时不该被读两遍。当图标本身就是标签（只有图标没有文字），传 `aria-label`，它立刻变成 `role="img"` 的有名图形。

```vue
<MyuiIcon name="search" aria-label="搜索" />
```
