---
title: Number 数值
description: 终端大屏上的数字，等宽排版，可选的滚动计数。
---

# Number 数值

数据也配得上大屏字号。字体用 display 那一支，数字走 `tabular-nums`——每一位占同样宽度，计数动起来时整行不会跟着呼吸。

滚动计数默认关着：表格里一跳一跳的数字没人受得了。要表演就打开 `animated`，`prefers-reduced-motion` 下它会自动一步到位。

## 基础用法

::: demo
<div class="demo-row">
<MyuiNumber :value="128600" />
<MyuiNumber :value="4912" />
</div>
:::

```vue
<MyuiNumber :value="128600" />
```

## 尺寸

四档：`sm` 19 / `md` 24 / `lg` 32 / `xl` 44。

::: demo
<div class="demo-row" style="align-items:baseline">
<MyuiNumber :value="128600" size="sm" />
<MyuiNumber :value="128600" size="md" />
<MyuiNumber :value="128600" size="lg" />
<MyuiNumber :value="128600" size="xl" />
</div>
:::

```vue
<MyuiNumber :value="128600" size="xl" />
```

## 语义色

`tone` 有语义四档，外加一个表达档 `spectrum`（渐变，见下面的「渐变形态」）。语义色只在语义真的成立时才用。

::: demo
<div class="demo-row" style="align-items:baseline">
<MyuiNumber :value="128600" tone="ink" />
<MyuiNumber :value="128600" tone="accent" />
<MyuiNumber :value="128600" tone="success" />
<MyuiNumber :value="128600" tone="danger" />
</div>
:::

```vue
<MyuiNumber :value="128600" tone="accent" />
```

## 斜切形态

`skew` 斜的是整块数字：字形、前后缀、趋势箭头一起走同一个 `--myui-skew-angle`（-12deg），因为它们本来就在同一行里。

箭头不会被翻转，也不会被压扁——方向一直由箭头本身的形状表达（没有用 `scaleX(-1)` 镜像），倾斜只是把整行一起推斜。

::: demo
<div class="demo-row" style="align-items:baseline">
<MyuiNumber :value="128600" size="lg" skew />
<MyuiNumber :value="128600" size="lg" skew trend="up" />
<MyuiNumber :value="499" prefix="¥" suffix="+12%" size="lg" skew />
</div>
:::

```vue
<MyuiNumber :value="128600" size="lg" skew />
<MyuiNumber :value="128600" size="lg" skew trend="up" />
```

## 渐变形态

`tone="spectrum"` 给**数字字形**刷上青 → 蓝 → 紫 → 品红的渐变，前后缀保持它们原本的次级实心色（前缀是符号，不是主角）。

趋势箭头在渐变下回到字色的实心档，不再用绿/红：六个 pigments 旁边再掺一个语义色，看起来像 bug。方向仍然由形状和 `data-trend` 表达，不依赖颜色。

::: demo
<div class="demo-row" style="align-items:baseline">
<MyuiNumber :value="48291" size="lg" tone="spectrum" />
<MyuiNumber :value="48291" size="lg" tone="spectrum" trend="down" />
<MyuiNumber :value="499" prefix="¥" suffix="+12%" size="lg" tone="spectrum" skew />
</div>
:::

```vue
<MyuiNumber :value="48291" size="lg" tone="spectrum" />
<MyuiNumber :value="499" prefix="¥" suffix="+12%" size="lg" tone="spectrum" skew />
```

## 精度与分隔符

`precision` 会补齐小数位（`12.5` 精度 3 → `12.500`）；`separator` 默认开，千位分组。

::: demo
<div class="demo-row" style="align-items:baseline">
<MyuiNumber :value="1234567.891" :precision="2" />
<MyuiNumber :value="1234567.891" :precision="2" :separator="false" />
<MyuiNumber :value="12.5" :precision="3" />
</div>
:::

```vue
<MyuiNumber :value="1234567.891" :precision="2" />
<MyuiNumber :value="1234567.891" :precision="2" :separator="false" />
```

## 前后缀

`prefix` 和 `suffix` 会比数字小一号、灰一点。它们也在无障碍名称里。

::: demo
<div class="demo-row" style="align-items:baseline">
<MyuiNumber :value="499" prefix="¥" size="lg" />
<MyuiNumber :value="128600" suffix="+12%" size="lg" tone="success" />
</div>
:::

```vue
<MyuiNumber :value="499" prefix="¥" size="lg" />
<MyuiNumber :value="128600" suffix="+12%" size="lg" />
```

## 趋势

`up` / `down` / `flat` 是写死的；`auto` 拿上一个值比出来。趋势箭头带形状差异，不只靠颜色区分。

::: demo
<div class="demo-row" style="align-items:baseline">
<MyuiNumber :value="128" trend="up" />
<MyuiNumber :value="128" trend="down" />
<MyuiNumber :value="128" trend="flat" />
</div>
:::

```vue
<MyuiNumber :value="128" trend="up" />
<MyuiNumber :value="128" trend="down" />
<MyuiNumber :value="128" trend="flat" />
```

## 滚动计数

打开 `animated`，从 0 数到目标值；值变了会滑过去。`duration` 是毫秒。

::: demo
<div class="demo-row" style="align-items:baseline">
<MyuiNumber :value="48291" animated />
</div>
:::

```vue
<MyuiNumber :value="48291" animated />
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `number` | — | 要显示的数值（必填） |
| `precision` | `number` | `0` | 小数位数，总是补满 |
| `separator` | `boolean` | `true` | 千位分隔符 |
| `prefix` | `string` | `''` | 数字前缀 |
| `suffix` | `string` | `''` | 数字后缀 |
| `trend` | `'up' \| 'down' \| 'flat' \| 'auto'` | `undefined` | 趋势指示；不传则不显示 |
| `animated` | `boolean` | `false` | 滚动计数 |
| `duration` | `number` | `600` | 计数时长（毫秒） |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 字号档位 |
| `tone` | `'ink' \| 'accent' \| 'success' \| 'danger' \| 'spectrum'` | `'ink'` | 语义色；`spectrum` 为渐变形态 |
| `skew` | `boolean` | `false` | 斜切整块数字（含前后缀与箭头），角度取 `--myui-skew-angle` |

## 可访问性

根节点带 `aria-label`，内容是**最终值**——读屏不会去念中间那些跳动的数字。趋势箭头是 `aria-hidden` 的装饰，方向同时由箭头形状和颜色表达，不是只靠颜色。`prefers-reduced-motion: reduce` 时计数被跳过，直接落到终值。

`requestAnimationFrame` 在组件卸载时取消，不会留下跑着没人看的动画。
