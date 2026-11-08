---
title: Flotage 漂浮特效
description: 让贴纸、徽章、按钮、卡片永远差一点点才停下来——纯 transform，不挤动周围任何东西。
---

# Flotage 漂浮特效

`Flotage` 是一个**漂浮的壳**。里面放什么，什么就慢慢飘起来。

它只动 `transform`：不占新空间、不触发重排，所以能把一整块卡片套进去而不用管外面。三条轴共用一个距离变量，`amplitude` 一改，上下、左右、倾斜一起变。

## 基础用法

默认沿 y 轴上下漂，4 秒一个来回，幅度 8px。

::: demo
<div class="demo-row">
<MyuiFlotage>限量 03</MyuiFlotage>
<MyuiFlotage :amplitude="14">NEW DROP</MyuiFlotage>
</div>
:::

```vue
<MyuiFlotage>限量 03</MyuiFlotage>
<MyuiFlotage :amplitude="14">NEW DROP</MyuiFlotage>
```

## 三条轴

`y` 上下、`x` 左右、`rotate` 轻微倾斜。`rotate` 下 `amplitude` 按角度算（8 就是 8°），适合盖在贴纸和徽章上。

::: demo
<div class="demo-row">
<MyuiFlotage axis="y">Y · 上下</MyuiFlotage>
<MyuiFlotage axis="x" :amplitude="12">X · 左右</MyuiFlotage>
<MyuiFlotage axis="rotate" :amplitude="6" :duration="6">ROTATE · 倾斜</MyuiFlotage>
</div>
:::

```vue
<MyuiFlotage axis="y">Y · 上下</MyuiFlotage>
<MyuiFlotage axis="x" :amplitude="12">X · 左右</MyuiFlotage>
<MyuiFlotage axis="rotate" :amplitude="6" :duration="6">ROTATE · 倾斜</MyuiFlotage>
```

| 轴 | 动的是什么 | `amplitude` 的单位 |
| --- | --- | --- |
| `y` | `translate3d` 的 y | px |
| `x` | `translate3d` 的 x | px |
| `rotate` | 整块的旋转角 | 度（deg） |

## 幅度、时长、延迟

`duration` 是一个完整来回的秒数，越长越平静；`delay` 让同一排元素错开起跑，不至于像广播体操。

::: demo
<div class="demo-row">
<MyuiFlotage :amplitude="2">2px</MyuiFlotage>
<MyuiFlotage :amplitude="8">8px</MyuiFlotage>
<MyuiFlotage :amplitude="24">24px</MyuiFlotage>
</div>
<div class="demo-row" style="margin-top:var(--myui-space-5)">
<MyuiFlotage :delay="0">00</MyuiFlotage>
<MyuiFlotage :delay="0.3">03</MyuiFlotage>
<MyuiFlotage :delay="0.6">06</MyuiFlotage>
<MyuiFlotage :delay="0.9">09</MyuiFlotage>
</div>
:::

```vue
<MyuiFlotage :amplitude="24">24px</MyuiFlotage>
<MyuiFlotage :delay="0.3">03</MyuiFlotage>
```

数字非法时不写进 CSS：负幅度按 0，`duration` 低于 0.1 秒按 0.1 秒，`delay` 负数按 0，`NaN` 回落到默认值。

## hover 触发

`trigger="hover"` 先按住不动，指针进来才飘——**键盘焦点进来也算**，所以它不是只有鼠标能用。

::: demo
<div class="demo-row">
<MyuiFlotage trigger="hover" :amplitude="12">
<MyuiButton tone="ink">把指针放上来</MyuiButton>
</MyuiFlotage>
<MyuiFlotage trigger="hover" axis="rotate" :amplitude="5" :duration="3">
<MyuiButton variant="outline" tone="ink">焦点也可以</MyuiButton>
</MyuiFlotage>
</div>
:::

```vue
<MyuiFlotage trigger="hover" :amplitude="12">
  <MyuiButton tone="ink">把指针放上来</MyuiButton>
</MyuiFlotage>
```

## 包裹按钮和整块卡片

块级内容用 `as="div"`，它自动回到块级流，卡片该多宽还是多宽。

::: demo
<div class="demo-row" style="align-items:flex-start">
<MyuiFlotage :amplitude="10" :duration="5">
<MyuiButton size="lg">立即抢购</MyuiButton>
</MyuiFlotage>
<MyuiFlotage as="div" :amplitude="14" :duration="7">
<div style="width:260px; padding:var(--myui-space-5); background-color:var(--myui-color-surface); border:var(--myui-border-width) solid var(--myui-color-line); box-shadow:var(--myui-shadow-hard)">
<div style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-tight)">NIGHT MARKET</div>
<p style="margin:var(--myui-space-2) 0 0; font-size:var(--myui-text-sm); color:var(--myui-color-ink-soft)">整块卡片一起漂浮，布局不动。</p>
</div>
</MyuiFlotage>
</div>
:::

```vue
<MyuiFlotage :amplitude="10" :duration="5">
  <MyuiButton size="lg">立即抢购</MyuiButton>
</MyuiFlotage>
```

## 停用

`disabled` 只是把这个壳钉住，**不会**禁用里面的按钮或链接。

::: demo
<div class="demo-row">
<MyuiFlotage>在飘</MyuiFlotage>
<MyuiFlotage disabled>已钉住</MyuiFlotage>
<MyuiFlotage disabled>
<MyuiButton variant="outline" tone="ink">钉住了也能点</MyuiButton>
</MyuiFlotage>
</div>
:::

```vue
<MyuiFlotage disabled>已钉住</MyuiFlotage>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `axis` | `'y' \| 'x' \| 'rotate'` | `'y'` | 漂移方向 |
| `amplitude` | `number` | `8` | 幅度，px（`rotate` 轴按角度算） |
| `duration` | `number` | `4` | 一个来回的秒数 |
| `delay` | `number` | `0` | 起跑前等待的秒数 |
| `trigger` | `'auto' \| 'hover'` | `'auto'` | 自动循环，或悬停才动 |
| `disabled` | `boolean` | `false` | 钉住这个壳（不影响里面的内容） |
| `as` | `string` | `'span'` | 壳用哪个标签，块级标签自动回到块级流 |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 任意内容，原样渲染、不复制 |

## 可访问性

纯装饰的位移不改语义、不改焦点顺序、不接管键盘。`trigger="hover"` 同时响应 `:focus-within`，键盘用户同样能看到它飘起来。

`prefers-reduced-motion: reduce` 时彻底静止，内容原位保留。

一个需要知道的边界：动起来的 `transform` 会让这个壳成为 `position: fixed` 子元素的包含块。嵌套 portal / 全屏遮罩的宿主不要塞进 `Flotage`。
