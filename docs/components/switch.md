---
title: Switch 开关
description: 两个状态的硬边胶囊。开才用朱红，滑块是带墨线的纸盘。
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

轨道是胶囊形——这是本系统里少数允许用 `--myui-radius-pill` 的地方之一。没开的时候轨道是暖灰纸色，开了才吃朱红；滑块永远是一枚带 2px 墨线的纸盘。

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

`loading` 在滑块里放一个转圈，同时挡住点击；`disabled` 用原生 `disabled`，不是"变灰了但还能点"。

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

## 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean \| string \| number` | 值变化时触发 |
| `change` | `boolean \| string \| number` | 与 `update:modelValue` 同时触发 |

## 可访问性

本体是 `<button type="button" role="switch">`，`aria-checked` 跟值同步；空格和回车都会切换，并且调用 `preventDefault` 吃掉浏览器重复合成的 click，只切换一次。

有状态文案时用 `aria-labelledby` 指向它；没有文案时，未声明的属性会原样落到按钮上，直接写 `aria-label` 即可。加载中用 `aria-busy`，禁用同时给 `disabled` 和 `aria-disabled`。

滑块位移在 `prefers-reduced-motion: reduce` 下直接取消，转圈也停。
