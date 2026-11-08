---
title: Flotage 漂浮特效
description: 让贴纸、徽章、按钮、卡片永远差一点点才停下来——纯 transform，不挤动周围任何东西。
---

# Flotage 漂浮特效

`Flotage` 是一个**漂浮的壳**。里面放什么，什么就慢慢飘起来。

它只动 `transform`：不占新空间、不触发重排，所以能把一整块卡片套进去而不用管外面。

::: warning 如果你看到的是一排完全不动的东西
那不是组件坏了。系统设置里关掉「动画效果」时（Windows：**设置 → 辅助功能 → 视觉效果 → 动画效果**；macOS：**辅助功能 → 显示 → 减弱动态效果**），浏览器会向网页报告 `prefers-reduced-motion: reduce`，`Flotage` 会按无障碍规范**停在原位**——默认行为就是尊重这个偏好。

本页的 demo 默认同样跟随系统。想在这里看到动效，用下面这个开关临时覆盖（不影响你复制代码时的默认值）：

<label class="demo-toggle">
<input type="checkbox" v-model="forceMotion" />
<span>强制动效预览（忽略系统偏好）</span>
</label>

:::

## 漂的是复合运动，不是上下直线

这一版之前的问题很具体：只有一条 `0 → -8px → 0` 的直线，4 秒一个来回。数学上是「漂浮」，看上去只是「轻轻一动」——所以没人看出它在漂。

现在三条轴都是**复合运动**，全部由 `amplitude` 一个旋钮驱动：

- **位移**——主轴上下（或左右、或倾斜）；
- **侧向漂移**——垂直于主轴的那一点位移，让轨迹不是一条直线；
- **摆动 + 呼吸**——±0.8deg 左右的轻微摆动，和一个 1% 以内的 `scale` 起伏。

半周期刻意不对称（峰值在 46% 而不是 50%），所以它读起来像一阵不受控的气流，而不是节拍器。默认 `amplitude` 也从 8 提到了 **16**。

::: demo
<div class="demo-row" style="gap:var(--myui-space-8); min-height:96px; align-items:center">
<MyuiFlotage :motion-preference="motion" :amplitude="24" :duration="5">限量 03</MyuiFlotage>
<MyuiFlotage :motion-preference="motion" :amplitude="24" :duration="5" :delay="0.8">NEW DROP</MyuiFlotage>
<MyuiFlotage :motion-preference="motion" :amplitude="24" :duration="5" :delay="1.6">NIGHT MARKET</MyuiFlotage>
</div>
:::

```vue
<MyuiFlotage :amplitude="24">限量 03</MyuiFlotage>
<MyuiFlotage :amplitude="24" :delay="0.8">NEW DROP</MyuiFlotage>
```

## 三条轴

`y` 上下、`x` 左右、`rotate` 倾斜。`rotate` 下 `amplitude` 按角度算（16 就是 16°），倾斜本身就是位移。

::: demo
<div class="demo-row" style="gap:var(--myui-space-8); min-height:96px; align-items:center">
<MyuiFlotage :motion-preference="motion" axis="y" :amplitude="24">Y · 上下</MyuiFlotage>
<MyuiFlotage :motion-preference="motion" axis="x" :amplitude="24">X · 左右</MyuiFlotage>
<MyuiFlotage :motion-preference="motion" axis="rotate" :amplitude="8" :duration="6">ROTATE · 倾斜</MyuiFlotage>
</div>
:::

```vue
<MyuiFlotage axis="y" :amplitude="24">Y · 上下</MyuiFlotage>
<MyuiFlotage axis="rotate" :amplitude="8" :duration="6">ROTATE · 倾斜</MyuiFlotage>
```

| 轴 | 主轴动的是什么 | `amplitude` 的单位 |
| --- | --- | --- |
| `y` | `translate3d` 的 y（+ 侧向漂移 + 摆动 + 呼吸） | px |
| `x` | `translate3d` 的 x（+ 侧向漂移 + 摆动 + 呼吸） | px |
| `rotate` | 整块的旋转角（+ 一点真实位移 + 呼吸） | 度（deg） |

## 幅度、时长、延迟

`duration` 是一个完整来回的秒数，越长越平静；`delay` 让同一排元素错开起跑，不至于像广播体操。

::: demo
<div class="demo-row" style="gap:var(--myui-space-8); min-height:96px; align-items:center">
<MyuiFlotage :motion-preference="motion" :amplitude="6">6px · 几乎不动</MyuiFlotage>
<MyuiFlotage :motion-preference="motion" :amplitude="16">16px · 默认</MyuiFlotage>
<MyuiFlotage :motion-preference="motion" :amplitude="32">32px · 明显在漂</MyuiFlotage>
</div>
<div class="demo-row" style="margin-top:var(--myui-space-5); gap:var(--myui-space-4)">
<MyuiFlotage :motion-preference="motion" :amplitude="20" :delay="0">00</MyuiFlotage>
<MyuiFlotage :motion-preference="motion" :amplitude="20" :delay="0.3">03</MyuiFlotage>
<MyuiFlotage :motion-preference="motion" :amplitude="20" :delay="0.6">06</MyuiFlotage>
<MyuiFlotage :motion-preference="motion" :amplitude="20" :delay="0.9">09</MyuiFlotage>
</div>
:::

```vue
<MyuiFlotage :amplitude="32">32px · 明显在漂</MyuiFlotage>
<MyuiFlotage :amplitude="20" :delay="0.3">03</MyuiFlotage>
```

数字非法时不写进 CSS：负幅度按 0，`duration` 低于 0.1 秒按 0.1 秒，`delay` 负数按 0，`NaN` 回落到默认值（幅度 16、时长 4）。

## hover 触发

`trigger="hover"` 先按住不动，指针进来才飘——**键盘焦点进来也算**，所以它不是只有鼠标能用。

::: demo
<div class="demo-row" style="gap:var(--myui-space-8); min-height:96px; align-items:center">
<MyuiFlotage :motion-preference="motion" trigger="hover" :amplitude="20">
<MyuiButton>把指针放上来</MyuiButton>
</MyuiFlotage>
<MyuiFlotage :motion-preference="motion" trigger="hover" axis="rotate" :amplitude="6" :duration="3">
<MyuiButton variant="outline">焦点也可以</MyuiButton>
</MyuiFlotage>
</div>
:::

```vue
<MyuiFlotage trigger="hover" :amplitude="20">
  <MyuiButton>把指针放上来</MyuiButton>
</MyuiFlotage>
```

## 包裹按钮和整块卡片

块级内容用 `as="div"`，它自动回到块级流，卡片该多宽还是多宽。

::: demo
<div class="demo-row" style="align-items:flex-start; gap:var(--myui-space-8); min-height:200px">
<MyuiFlotage :motion-preference="motion" :amplitude="16" :duration="5" style="padding-top:var(--myui-space-3)">
<MyuiButton size="lg">立即抢购</MyuiButton>
</MyuiFlotage>
<MyuiFlotage :motion-preference="motion" as="div" :amplitude="20" :duration="7">
<div style="width:260px; padding:var(--myui-space-5); background-color:var(--myui-color-surface); border:var(--myui-border-width) solid var(--myui-color-line); box-shadow:var(--myui-shadow-inset)">
<div style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-tight); color:var(--myui-color-text)">NIGHT MARKET</div>
<p style="margin:var(--myui-space-2) 0 0; font-size:var(--myui-text-sm); color:var(--myui-color-text-soft)">整块卡片一起漂浮，布局不动。</p>
</div>
</MyuiFlotage>
</div>
:::

```vue
<MyuiFlotage :amplitude="16" :duration="5">
  <MyuiButton size="lg">立即抢购</MyuiButton>
</MyuiFlotage>
```

## 停用

`disabled` 只是把这个壳钉住，**不会**禁用里面的按钮或链接。

::: demo
<div class="demo-row" style="gap:var(--myui-space-8); min-height:96px; align-items:center">
<MyuiFlotage :motion-preference="motion" :amplitude="20">在飘</MyuiFlotage>
<MyuiFlotage :motion-preference="motion" :amplitude="20" disabled>已钉住</MyuiFlotage>
<MyuiFlotage :motion-preference="motion" disabled>
<MyuiButton variant="outline">钉住了也能点</MyuiButton>
</MyuiFlotage>
</div>
:::

```vue
<MyuiFlotage :amplitude="20" disabled>已钉住</MyuiFlotage>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `axis` | `'y' \| 'x' \| 'rotate'` | `'y'` | 漂移方向 |
| `amplitude` | `number` | `16` | 幅度，px（`rotate` 轴按角度算）；同时驱动摆动、呼吸与侧向漂移 |
| `duration` | `number` | `4` | 一个来回的秒数 |
| `delay` | `number` | `0` | 起跑前等待的秒数 |
| `trigger` | `'auto' \| 'hover'` | `'auto'` | 自动循环，或悬停才动 |
| `disabled` | `boolean` | `false` | 钉住这个壳（不影响里面的内容） |
| `motionPreference` | `'system' \| 'always'` | `'system'` | `system` 尊重系统的减弱动态效果；`always` 强制动画（演示用，别用在生产内容里） |
| `as` | `string` | `'span'` | 壳用哪个标签，块级标签自动回到块级流 |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 任意内容，原样渲染、不复制 |

## 可访问性

纯装饰的位移不改语义、不改焦点顺序、不接管键盘。`trigger="hover"` 同时响应 `:focus-within`，键盘用户同样能看到它飘起来。

`prefers-reduced-motion: reduce` 时静止：`transform` 被钉回 `none`，内容原位保留。这是默认行为，不是缺陷——但对一个**靠动效表达自己**的组件来说，"看不见"就等于"坏了"，所以提供 `motionPreference="always"` 作为显式出口：它只在你明确要求时忽略系统偏好，适合演示页、Storybook 和这次你正在看的文档站。

一个需要知道的边界：动起来的 `transform` 会让这个壳成为 `position: fixed` 子元素的包含块。嵌套 portal / 全屏遮罩的宿主不要塞进 `Flotage`。

<script setup lang="ts">
import { computed, ref } from 'vue'

// The demos follow the system by default; this only exists so a reader whose OS
// has "animation effects" off can still see what the component does.
const forceMotion = ref(false)
const motion = computed(() => (forceMotion.value ? 'always' : 'system'))
</script>
