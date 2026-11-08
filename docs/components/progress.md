---
title: Progress 进度条
description: 一条有刻度的墨线。硬边、平涂、零圆角，圆环用 SVG 描边。
---

# Progress 进度条

进度条是最容易做得廉价的组件——圆角、渐变、光晕一起上，立刻变成后台管理系统。
这里反过来：1px 发丝线、纯色平涂、方头描边，像一条正在充能的能量槽。

## 基础用法

`percent` 超出 `0–100` 会被夹紧，`NaN` 按 0 处理——调用方传错不该让用户看见乱码。

::: demo
<div class="demo-stack" style="width: 100%">
<MyuiProgress :percent="62" label="加载进度" />
<MyuiProgress :percent="100" tone="success" label="已完成" />
</div>
:::

```vue
<MyuiProgress :percent="62" label="加载进度" />
<MyuiProgress :percent="100" tone="success" label="已完成" />
```

## 语义色

::: demo
<div class="demo-stack" style="width: 100%">
<MyuiProgress :percent="82" tone="accent" label="accent" />
<MyuiProgress :percent="64" tone="ink" label="ink" />
<MyuiProgress :percent="45" tone="warning" label="warning" />
<MyuiProgress :percent="18" tone="danger" label="danger" />
</div>
:::

## 尺寸

::: demo
<div class="demo-stack" style="width: 100%">
<MyuiProgress :percent="40" size="sm" label="小" />
<MyuiProgress :percent="60" size="md" label="中" />
<MyuiProgress :percent="80" size="lg" label="大" />
</div>
:::

## 圆环

环形进度用 `stroke-dasharray` 绘制，`stroke-linecap: butt` 保持方头质感。

::: demo
<div class="demo-row">
<MyuiProgress type="circle" :percent="30" size="sm" label="小" />
<MyuiProgress type="circle" :percent="60" size="md" label="中" />
<MyuiProgress type="circle" :percent="90" size="lg" tone="success" label="大" />
</div>
:::

```vue
<MyuiProgress type="circle" :percent="60" label="任务进度" />
```

## 不确定进度

当耗时未知时用 `indeterminate`：此时**不输出** `aria-valuenow`——
进度条不该报告一个它并不知道的数字。

::: demo
<div style="width: 100%">
<MyuiProgress indeterminate label="正在加载" />
</div>
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `percent` | `number` | `0` | 0–100，越界夹紧 |
| `type` | `'line' \| 'circle'` | `'line'` | 条形或环形 |
| `tone` | `'accent' \| 'ink' \| 'success' \| 'warning' \| 'danger'` | `'accent'` | 语义色 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `showText` | `boolean` | `true` | 是否显示百分比 |
| `indeterminate` | `boolean` | `false` | 不确定进度 |
| `label` | `string` | `'Progress'` | 进度条的无障碍名称 |

## 可访问性

`role="progressbar"` 带 `aria-valuemin` / `aria-valuemax` / `aria-valuenow`，
未知进度时省略 `aria-valuenow`。条纹扫动动画在 `prefers-reduced-motion: reduce`
下停用，退化为半透明静态块。
