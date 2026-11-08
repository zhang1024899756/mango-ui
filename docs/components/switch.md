---
title: Switch 开关
description: 两个状态的硬边胶囊。开才亮电光青，滑块是居中悬浮的深色圆片。
---

<script setup>
import { ref } from 'vue'

const nightMode = ref(false)
const onSale = ref(true)
const channel = ref('off')
const small = ref(true)
const large = ref(false)
</script>

# Switch 开关

开关就该像一枚物理拨片：一拨到底，没有中间态。

轨道是胶囊形——这是本系统里少数允许用 `--myui-radius-pill` 的地方之一。没开的时候轨道是深空底色，开了才亮起电光青；滑块是一枚带 1px 发丝线的深色圆片。

滑块的位置不靠写死的坐标，而是从三个尺寸推出来的：`--myui-switch-inset` 是 `(轨道高 − 2 × 边框 − 滑块直径) / 2`，`--myui-switch-travel` 是 `轨道宽 − 2 × 边框 − 滑块直径 − 2 × inset`。所以任意一档尺寸都严格居中，改轨道高也不会把滑块挤偏。

| 尺寸 | 轨道 | 滑块 | inset | travel |
| --- | --- | --- | --- | --- |
| `md` | 60 × 32 | 24 | 3px | 28px |
| `sm` | 44 × 24 | 16 | 3px | 20px |

`inset` 量的是轨道**内边距盒**（边框以内）到滑块的间距，所以滑块到轨道外沿的实际距离是 `边框 + inset` = 4px。开、关两端都是 4px，行程正好对称。

## 基础用法

`v-model` 绑布尔值。点击、空格、回车都能切换。

::: demo
<div class="demo-row">
  <MyuiSwitch v-model="nightMode" />
  <span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs)">{{ nightMode ? 'ON' : 'OFF' }}</span>
</div>
:::

```vue
<script setup>
import { ref } from 'vue'
const nightMode = ref(false)
</script>

<MyuiSwitch v-model="nightMode" />
```

## 尺寸

`sm` 和 `md` 两档。卡片里的小开关用 `sm`，表单里用 `md`。

::: demo
<div class="demo-row">
  <MyuiSwitch v-model="small" size="sm" />
  <MyuiSwitch v-model="large" size="md" />
</div>
:::

```vue
<MyuiSwitch v-model="small" size="sm" />
<MyuiSwitch v-model="large" size="md" />
```

## 状态文案

`activeText` / `inactiveText` 会随状态切换，并自动用 `aria-labelledby` 指向文案节点。

::: demo
<div class="demo-row">
  <MyuiSwitch v-model="onSale" active-text="ON SALE" inactive-text="OFF SALE" />
</div>
:::

```vue
<MyuiSwitch v-model="onSale" active-text="ON SALE" inactive-text="OFF SALE" />
```

## 自定义值

`activeValue` / `inactiveValue` 可以是字符串或数字：提交表单时不用再翻译一遍。

::: demo
<div class="demo-row">
  <MyuiSwitch v-model="channel" active-value="on" inactive-value="off" active-text="已上架" inactive-text="已下架" />
  <span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs)">channel = {{ channel }}</span>
</div>
:::

```vue
<MyuiSwitch v-model="channel" active-value="on" inactive-value="off" active-text="已上架" inactive-text="已下架" />
```

## 加载与禁用

`loading` 在滑块正中放一个转圈（直径取滑块的一半，`sm`/`md` 都留得住同样的余量），同时挡住点击；`disabled` 用原生 `disabled`，不是"变灰了但还能点"。

::: demo
<div class="demo-row">
  <MyuiSwitch loading />
  <MyuiSwitch disabled />
  <MyuiSwitch disabled :model-value="true" />
</div>
:::

```vue
<MyuiSwitch loading />
<MyuiSwitch disabled />
<MyuiSwitch disabled :model-value="true" />
```

## 斜切形态

`skew` 把胶囊换成平行四边形：轨道去掉圆角再整体剪切，滑块跟着轨道一起斜。滑块不需要（也不应该）再斜一次——它本来就在轨道内部，继承的是同一套坐标系，再写一次 `skewX` 会把 12° 叠成 24°。

行程也不用改：`--myui-switch-travel` 是在轨道的本地坐标里算出来的，而 `skewX` 只是把每一行横向平移，所以开、关两端仍旧贴齐内沿，3px 内边距也还是 3px。

::: demo
<div class="demo-row" style="gap:var(--myui-space-4)">
  <MyuiSwitch v-model="nightMode" skew />
  <MyuiSwitch v-model="onSale" skew />
  <MyuiSwitch v-model="large" skew size="sm" />
</div>
:::

```vue
<MyuiSwitch v-model="off" skew />
<MyuiSwitch v-model="on" skew />
<MyuiSwitch v-model="on" skew size="sm" />
```

剪切的代价是视觉宽度：宽 × 高剪切 12° 之后，包围盒会多出 `轨道高 × tan(12°)`（`md` 约 7px，左右各 3.4px）。布局盒没变，多出来的部分靠 `overflow: visible` 画出去；也因为这样，根节点不能裁切，否则滑块角上会被削掉。旁边的文字标签不受影响——剪切只发生在轨道上。

## 渐变形态

`tone="spectrum"` 只换**打开时**的轨道：关着的时候还是深空色槽。滑块永远保持 surface 色，它是载荷，不是信号。

禁用优先于色调：`disabled` 状态下渐变会被强制压成 muted 平色，禁用控件不该还在发亮。

::: demo
<div class="demo-row">
  <MyuiSwitch v-model="nightMode" tone="spectrum" />
  <MyuiSwitch v-model="onSale" tone="spectrum" />
  <MyuiSwitch :model-value="true" tone="spectrum" disabled />
</div>
:::

```vue
<MyuiSwitch v-model="on" tone="spectrum" />
<MyuiSwitch v-model="on" tone="spectrum" disabled />
```

两种形态互不干扰，可以直接叠：

::: demo
<div class="demo-row">
  <MyuiSwitch v-model="onSale" skew tone="spectrum" />
  <MyuiSwitch v-model="nightMode" skew tone="spectrum" active-text="ON" inactive-text="OFF" />
</div>
:::

```vue
<MyuiSwitch v-model="on" skew tone="spectrum" />
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean \| string \| number` | `false` | 当前值，与 `activeValue` 全等比较 |
| `activeValue` | `unknown` | `true` | 打开时发射的值 |
| `inactiveValue` | `unknown` | `false` | 关闭时发射的值 |
| `size` | `'sm' \| 'md'` | `'md'` | 尺寸 |
| `disabled` | `boolean` | `false` | 禁用 |
| `loading` | `boolean` | `false` | 加载中，同时挡住交互 |
| `activeText` | `string` | `''` | 打开时的文案，同时作为可访问名称 |
| `inactiveText` | `string` | `''` | 关闭时的文案，同时作为可访问名称 |
| `skew` | `boolean` | `false` | 斜切形态：平行四边形轨道与滑块 |
| `tone` | `'accent' \| 'spectrum'` | `'accent'` | 打开时轨道的颜色：动作色，或系统渐变 |

## 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean \| string \| number` | 值变化时触发 |
| `change` | `boolean \| string \| number` | 与 `update:modelValue` 同时触发 |

## 可访问性

本体是 `<button type="button" role="switch">`，`aria-checked` 跟值同步；空格和回车都会切换，并且调用 `preventDefault` 吃掉浏览器重复合成的 click，只切换一次。

有状态文案时用 `aria-labelledby` 指向它；没有文案时，未声明的属性会原样落到按钮上，直接写 `aria-label` 即可。加载中用 `aria-busy`，禁用同时给 `disabled` 和 `aria-disabled`。

滑块位移在 `prefers-reduced-motion: reduce` 下直接取消，转圈也停。
