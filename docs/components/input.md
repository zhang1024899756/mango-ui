---
title: Input 输入框
description: 一块硬边石板——文字落在上面。2px 墨线、零圆角，聚焦时阴影收回去。
---

<script setup>
import { ref } from 'vue'

const drop = ref('')
const email = ref('hello@mango')
const name = ref('')
const size = ref('')
const price = ref('2980')
const note = ref('限量 300 双')
</script>

# Input 输入框

一条嵌在暗面里的终端输入槽。1px 发丝线、零圆角、冷蓝微光；一聚焦，边缘换成电光青并亮起——和按钮悬停是同一个语言。

`box` 是表单里的石板，`line` 是只留一条底线、给编辑部标题用的形态。

## 基础用法

`v-model` 双向绑定，值永远是字符串。

::: demo
<div class="demo-stack" style="width:320px">
  <MyuiInput v-model="drop" placeholder="搜索单品、系列、联名" />
  <p style="margin:0; font-family:var(--myui-font-mono); font-size:var(--myui-text-xs)">v-model：{{ drop || '（空）' }}</p>
</div>
:::

```vue
<script setup>
import { ref } from 'vue'
const drop = ref('')
</script>

<MyuiInput v-model="drop" placeholder="搜索单品、系列、联名" />
```

## 线条形态

`variant="line"` 去掉石板，只留一条底线。聚焦时底线变成朱红。

::: demo
<div class="demo-stack" style="width:360px">
  <MyuiInput v-model="email" variant="line" type="email" placeholder="留下邮箱，上架第一时间通知" />
  <MyuiInput v-model="name" variant="line" placeholder="昵称" size="sm" />
</div>
:::

```vue
<MyuiInput v-model="email" variant="line" type="email" placeholder="留下邮箱，上架第一时间通知" />
```

## 尺寸

三档，来自 `--myui-control-sm / md / lg`，一行按钮和一行输入框永远对得上。

::: demo
<div class="demo-stack" style="width:320px">
  <MyuiInput v-model="size" size="sm" placeholder="SM · 32px" />
  <MyuiInput v-model="size" size="md" placeholder="MD · 40px" />
  <MyuiInput v-model="size" size="lg" placeholder="LG · 48px" />
</div>
:::

```vue
<MyuiInput size="sm" placeholder="SM · 32px" />
<MyuiInput size="md" placeholder="MD · 40px" />
<MyuiInput size="lg" placeholder="LG · 48px" />
```

## 前置与后置插槽

`prefix` / `suffix` 放单位、货币、图标。装饰性的图标记得自己加 `aria-hidden`。

::: demo
<div class="demo-stack" style="width:320px">
  <MyuiInput v-model="price" type="number">
    <template #prefix><span style="font-weight:var(--myui-weight-bold)">¥</span></template>
    <template #suffix><span>CNY</span></template>
  </MyuiInput>
</div>
:::

```vue
<MyuiInput v-model="price" type="number">
  <template #prefix><span>¥</span></template>
  <template #suffix><span>CNY</span></template>
</MyuiInput>
```

## 清空与字数

`clearable` 的清空键是真正的 `<button aria-label="Clear input">`，键盘可达。
`showCount` 的字数用 `aria-live="polite"` 播报，设了 `maxlength` 就显示 `已用 / 上限`。

::: demo
<div class="demo-stack" style="width:320px">
  <MyuiInput v-model="note" clearable placeholder="限量标语" />
  <MyuiInput v-model="note" clearable show-count :maxlength="12" />
</div>
:::

```vue
<MyuiInput v-model="note" clearable placeholder="限量标语" />
<MyuiInput v-model="note" clearable show-count :maxlength="12" />
```

## 错误态

给 `error` 就自动进入错误形态，并把提示接上 `aria-describedby`、把输入框标成 `aria-invalid="true"`——不是只换个红边。
只要红色、不要文案时，用 `invalid`。

::: demo
<div class="demo-stack" style="width:320px">
  <MyuiInput v-model="email" type="email" error="邮箱格式不对，再检查一下" />
  <MyuiInput v-model="name" invalid placeholder="只标红，不写文案" />
</div>
:::

```vue
<MyuiInput v-model="email" type="email" error="邮箱格式不对，再检查一下" />
<MyuiInput v-model="name" invalid placeholder="只标红，不写文案" />
```

## 禁用与只读

禁用用原生 `disabled`；只读保留可选中、可复制，但不接受输入。

::: demo
<div class="demo-stack" style="width:320px">
  <MyuiInput model-value="已售罄" disabled />
  <MyuiInput model-value="FX-2026-001" readonly />
</div>
:::

```vue
<MyuiInput model-value="已售罄" disabled />
<MyuiInput model-value="FX-2026-001" readonly />
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | v-model 的值。永远是字符串，`number` 也自己转换 |
| `type` | `'text' \| 'password' \| 'email' \| 'number' \| 'search' \| 'tel' \| 'url'` | `'text'` | 原生 input 类型 |
| `placeholder` | `string` | — | 占位文案 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `variant` | `'box' \| 'line'` | `'box'` | 石板或底线 |
| `disabled` | `boolean` | `false` | 禁用 |
| `readonly` | `boolean` | `false` | 只读 |
| `clearable` | `boolean` | `false` | 有内容时显示清空按钮 |
| `maxlength` | `number` | — | 最大长度，同时交给原生 input |
| `showCount` | `boolean` | `false` | 显示字数；有 `maxlength` 时显示 `已用 / 上限` |
| `invalid` | `boolean` | `false` | 错误形态 |
| `error` | `string` | — | 错误文案。会自动进入错误形态并接上 `aria-describedby` |
| `name` | `string` | — | 表单字段名 |
| `autocomplete` | `string` | — | 原生 autocomplete |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `prefix` | 输入框左侧，通常放货币或图标 |
| `suffix` | 输入框右侧，通常放单位 |

## 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 输入时触发 |
| `focus` | `FocusEvent` | 原生聚焦事件 |
| `blur` | `FocusEvent` | 原生失焦事件 |
| `clear` | — | 点清空按钮，先清值再触发 |
| `enter` | `KeyboardEvent` | 按下回车 |

## 可访问性

底色是你自己的 `<input>`：没有声明成 prop 的属性（`id`、`aria-label`、`aria-labelledby`、`autofocus`）会原样落到它身上，所以 `<label for>` 和原生表单行为都成立。

聚焦环画在石板上（`focus-within`），不是藏进输入框里；错误文案通过 `aria-describedby` 关联，同时置 `aria-invalid="true"`；字数用 `aria-live="polite"`，不会在每次按键时抢读。清空按钮是带 `aria-label` 的真实 `<button>`，焦点环和键盘操作都正常。
