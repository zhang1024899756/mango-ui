---
title: Slider 滑动条
description: 一条硬边横杠，拖着走。一个拇指是数值，两个拇指是区间，拇指不许交叉。
---

<script setup>
import { ref } from 'vue'

const volume = ref(40)
const priceRange = ref([20, 70])
const heat = ref(50)
const fine = ref(0.35)
const height = ref(35)
const locked = ref(65)
</script>

# Slider 滑动条

一条硬边横杠。填充部分吃系统的朱红（或纯墨），拇指是带墨线的纸盘，压在硬投影上。

一个拇指是数值，传 `[min, max]` 数组就变成双拇指区间。两个拇指永远不会交叉，`min === max` 也不会算出 `NaN`。

## 基础用法

`v-model` 绑数值。

::: demo
<div class="demo-stack" style="width:360px">
  <MyuiSlider v-model="volume" />
  <p style="margin:0; font-family:var(--myui-font-mono); font-size:var(--myui-text-xs)">volume = {{ volume }}</p>
</div>
:::

```vue
<script setup>
import { ref } from 'vue'
const volume = ref(40)
</script>

<MyuiSlider v-model="volume" />
```

## 区间

把 `modelValue` 换成 `[lower, upper]`，就是双拇指。`update:modelValue` 实时推送，`change` 在松手时触发一次。

::: demo
<div class="demo-stack" style="width:360px">
  <MyuiSlider v-model="priceRange" :min="0" :max="200" :step="10" />
  <p style="margin:0; font-family:var(--myui-font-mono); font-size:var(--myui-text-xs)">range = {{ priceRange[0] }} – {{ priceRange[1] }}</p>
</div>
:::

```vue
<MyuiSlider v-model="priceRange" :min="0" :max="200" :step="10" />
```

## 刻度

`marks` 是 `{ 值: 文案 }`。值刚好落在刻度上时，`aria-valuetext` 会读文案而不是数字。

::: demo
<div class="demo-stack" style="width:360px">
  <MyuiSlider v-model="heat" :step="10" :marks="{ 0: '冷', 50: '温', 100: '烫' }" />
</div>
:::

```vue
<MyuiSlider v-model="heat" :step="10" :marks="{ 0: '冷', 50: '温', 100: '烫' }" />
```

## 步长与浮点

`step` 支持小数，结果会按步长的小数位收口，不会出现 `0.30000000000000004`。

::: demo
<div class="demo-stack" style="width:360px">
  <MyuiSlider v-model="fine" :min="0" :max="1" :step="0.01" />
</div>
:::

```vue
<MyuiSlider v-model="fine" :min="0" :max="1" :step="0.01" />
```

## 垂直

`vertical` 让导轨竖起来，默认高度 `calc(--myui-space-8 * 3)`，要更高就自己给容器高度。方向键跟着转：上键加、下键减。

::: demo
<div class="demo-row" style="align-items:flex-end">
  <MyuiSlider v-model="height" vertical :marks="{ 0: 'MIN', 100: 'MAX' }" />
  <MyuiSlider v-model="height" vertical tone="ink" :show-tooltip="false" />
</div>
:::

```vue
<MyuiSlider v-model="height" vertical :marks="{ 0: 'MIN', 100: 'MAX' }" />
```

## 色调

`tone="ink"` 把填充换成墨黑——在一堆朱红之间需要喘口气的地方用它，别用它替代主操作。

::: demo
<div class="demo-stack" style="width:360px">
  <MyuiSlider v-model="volume" tone="ink" />
  <MyuiSlider v-model="volume" tone="accent" />
</div>
:::

```vue
<MyuiSlider v-model="volume" tone="ink" />
<MyuiSlider v-model="volume" tone="accent" />
```

## 禁用与值气泡

`showTooltip` 默认开，悬停、聚焦、拖动时出现；不想要就关掉。

::: demo
<div class="demo-stack" style="width:360px">
  <MyuiSlider v-model="locked" disabled />
  <MyuiSlider v-model="volume" :show-tooltip="false" />
</div>
:::

```vue
<MyuiSlider v-model="locked" disabled />
<MyuiSlider v-model="volume" :show-tooltip="false" />
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number \| [number, number]` | `0` | 单值，或双值区间 |
| `min` | `number` | `0` | 最小值 |
| `max` | `number` | `100` | 最大值 |
| `step` | `number` | `1` | 步长，可以是小数 |
| `disabled` | `boolean` | `false` | 禁用 |
| `vertical` | `boolean` | `false` | 垂直方向 |
| `showTooltip` | `boolean` | `true` | 悬停 / 聚焦 / 拖动时显示值气泡 |
| `marks` | `Record<number, string>` | — | 刻度位置与文案 |
| `tone` | `'accent' \| 'ink'` | `'accent'` | 填充色 |

## 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `number \| [number, number]` | 拖动、点击轨道、键盘调节时实时触发 |
| `change` | `number \| [number, number]` | 松手时触发；键盘调节立即触发 |

## 可访问性

每个拇指都是一个 `<button type="button" role="slider">`，双拇指就是两个 `role="slider"`，分别标注 `Lower bound` / `Upper bound`。`aria-valuemin` / `aria-valuemax` / `aria-valuenow` 齐全，`marks` 命中时 `aria-valuetext` 读文案。

键盘：`←` `→` `↑` `↓` 走一个步长，`PageUp` / `PageDown` 走十个，`Home` / `End` 直达两端，并且都调用 `preventDefault`，不会把页面滚走。

`vertical` 时补上 `aria-orientation="vertical"`。禁用状态下按钮原生 `disabled`，同时给 `aria-disabled`，指针与键盘都不再响应。
