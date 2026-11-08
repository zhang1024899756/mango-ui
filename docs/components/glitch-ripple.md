---
title: GlitchRipple 故障波纹
description: 一个把内容本身的像素扭掉的特效壳——SVG 噪声场逐帧位移 + CSS 颤抖 + CSS 闪暗，叠出「信号闪弱不稳定」。
---

# GlitchRipple 故障波纹

`GlitchRipple` 不复制内容、也不盖装饰层。它动的是**内容自己的像素**：一个 SVG 滤镜把插槽里的每一个像素按一张噪声场推开，另外两层 CSS 动画在旁边补上「手抖」和「供电不稳」。

只讲位移，很容易让人以为它是一张**静态扭曲图**——所以下面先把三层拆开。

::: tip 它是动态的，以及你可能看到它不动的原因
本页所有 demo 都显式传了 `motion-preference="always"`，所以在任何系统偏好下波纹、颤抖、闪弱三层都在跑。

但组件**默认**尊重系统设置。Windows 关掉「动画效果」时（**设置 → 辅助功能 → 视觉效果 → 动画效果**；macOS：**辅助功能 → 显示 → 减弱动态效果**），浏览器会向网页报告 `prefers-reduced-motion: reduce`，组件会**冻结成一帧轻微但看得出的扭曲**——不是消失，但它确实不动了。这也正是「在我这儿看不出特效」的常见原因。

下面这个开关可以把整页 demo 切到「跟随系统」，亲眼看一下冻结帧：

<label class="demo-toggle">
<input type="checkbox" v-model="followSystem" />
<span>把本页 demo 切成「跟随系统」（看冻结帧）</span>
</label>
:::

## 效果由三层组成

| 层 | 技术 | 谁在驱动 | 一眼能看出的东西 |
| --- | --- | --- | --- |
| **波纹** | SVG `feTurbulence` → `feComponentTransfer` → `feOffset` → `feDisplacementMap` | JS 逐帧改两个属性（30fps 节流） | 内容被横向撕成流动的条带 |
| **颤抖** | CSS `@keyframes` + `steps(1, end)` | 浏览器 | 内容 0.5–1.2px 的不规则小幅抖动 |
| **闪弱** | CSS `@keyframes` + `steps(1, end)` | 浏览器 | 每个周期 2–3 次硬切透明度跌落（最低 0.55） |

三层是叠加关系，不是三选一：

- 只有**波纹**——画面在扭，像隔着水面看字；
- 加上**颤抖**——多了一层「手不稳」；
- 再加上**闪弱**——信号断续，「闪弱」才是那个味道。

实现路线参考：渡一教育《故障波纹动效》的 `feTurbulence` + `feDisplacementMap` 做法；「颤抖 + 闪弱」这层语义则来自抖音「颤抖」特效——它表达的不是故障本身，而是**信号弱、不稳定**。

### 为什么是水平条带，而不是雪花

`feTurbulence` 的 `baseFrequency="0.002 0.08"` 是**各向异性**的：

- x 方向 0.002 —— 噪声沿横向几乎不变，一条带子从头到尾是同一片噪声；
- y 方向 0.08 —— 大约每 12px 重复一次。

结果就是一条条横向的条带。如果两个方向取同一频率，得到的是一片均匀雪花——那是电视没信号，不是信号在抖。

### 为什么是「滑动」噪声场，而不是缩放它

`feOffset` 的 `dy` 随时间**单调累加**（不取模），所以噪声场一直在往上/下走，条带是**流动**的。

如果改成缩放噪声场，得到的是「呼吸」——一张图在涨缩，不会让人觉得信号在扫描。滑动才是扫描。

### 为什么要先零均值化

`feDisplacementMap` 的位移不是「按通道值推」，规范里算的是：

```
位移 = (通道值 − 0.5) × scale
```

也就是通道值 **0.5 才是原地不动**。而 Chrome/Skia 的 `feTurbulence` 输出的通道均值并不在 0.5 上：用本组件这套参数（`fractalNoise`、`seed 2`、`numOctaves 2`）实测 **R 通道均值 0.7295、G 通道 0.7291**（std 0.082 / 0.085）。换成 `baseFrequency` 0.002 0.16 或 0.006 0.08 重测，均值照旧——这是光栅器的系统性偏置，不是采样误差。

偏置的后果很具体：每个被包裹的盒子都被**恒定推走** `0.23 × scale` px，而真正读作「错位」的条带幅度只有 `std × scale`。小尺寸上整体位移比条带大得多，肉眼看到的就只剩「整块滑了一下」——**那是漂浮，不是故障**。这是这个效果最容易被做错的一步：噪声场位移必须是**割裂、错位**位移，而不能退化成整体平移。

所以 `feTurbulence` 和 `feOffset` 之间插了一层 `feComponentTransfer`，把每个通道的均值搬到 0.5，顺手把对比度放大一倍多：

| 通道 | slope | intercept | 出处 |
| --- | --- | --- | --- |
| R | 2.45 | −1.2873 | `0.5 − 2.45 × 0.7295` |
| G / B | 2.37 | −1.2280 | `0.5 − 2.37 × 0.7291` |

零均值之后，位移在 0 两侧对称：同一块内容有的地方被推开、有的地方被拉近——这才读作「被撕开」。同一 `scale` 下，光栅化后的像素变化比例大约是修正前的 2–4 倍。

这三个数是**测量值**，不是审美参数。改了 `baseFrequency`、`numOctaves`、`seed` 或湍流类型，就必须重新量一遍通道均值再算 intercept；测试里有断言守着 `intercept = 0.5 − slope × 均值` 这个关系，就是防这种回退。

### 三层为什么不会打架

`filter` 作用于像素，`transform` / `opacity` 作用于盒子：浏览器先算完滤镜，再做位移和透明度合成。所以波纹撕内容、颤抖抖盒子、闪弱压透明度，互不覆盖。

## 基础用法

传 `text` 就是一段丢包的标题；也可以直接把内容放进插槽，两者都会被同一张噪声场位移。

::: demo
<div class="demo-row" style="gap:var(--myui-space-8); min-height:120px; align-items:center">
<MyuiGlitchRipple :motion-preference="motion" text="NIGHT MARKET" style="font-family:var(--myui-font-display); font-size:var(--myui-text-2xl); letter-spacing:var(--myui-tracking-wide); color:var(--myui-color-text)" />
<MyuiGlitchRipple :motion-preference="motion" intensity="intense" text="DROP 0042" style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-wide); color:var(--myui-color-text)" />
</div>
:::

```vue
<MyuiGlitchRipple text="NIGHT MARKET" />
<MyuiGlitchRipple intensity="intense" text="DROP 0042" />
```

## 强度与速度

`intensity` 是**幅度**：同时缩放位移强度和颤抖距离（subtle 0.5px / normal 0.9px / intense 1.2px）。`speed` 是**节奏**：噪声场一个滑动周期 6200 / 3800 / 2200ms，闪弱周期 3400 / 2600 / 1900ms。

位移量会随容器尺寸自适应——22px 的 tag 和 280px 的卡片不会用同一个像素数。

::: demo
<div class="demo-stack">
<div class="demo-row" style="min-height:110px; align-items:center; gap:var(--myui-space-8)">
<MyuiGlitchRipple :motion-preference="motion" intensity="subtle" text="SUBTLE" style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide)" />
<MyuiGlitchRipple :motion-preference="motion" intensity="normal" text="NORMAL" style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide)" />
<MyuiGlitchRipple :motion-preference="motion" intensity="intense" text="INTENSE" style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide)" />
</div>
<div class="demo-row" style="min-height:110px; align-items:center; gap:var(--myui-space-8)">
<MyuiGlitchRipple :motion-preference="motion" speed="slow" text="SLOW" style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide)" />
<MyuiGlitchRipple :motion-preference="motion" speed="normal" text="NORMAL" style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide)" />
<MyuiGlitchRipple :motion-preference="motion" speed="fast" text="FAST" style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide)" />
</div>
</div>
:::

```vue
<MyuiGlitchRipple intensity="intense" text="INTENSE" />
<MyuiGlitchRipple speed="fast" text="FAST" />
```

## 包裹真正的组件

插槽内容一个 DOM 节点都不复制：滤镜挂在 `.myui-glitch-ripple__content` 上，那是一个包住插槽的盒子，按钮还是那颗按钮，点击、焦点、布局都不受影响。

::: demo
<div class="demo-row" style="min-height:120px; align-items:center; gap:var(--myui-space-8)">
<MyuiGlitchRipple :motion-preference="motion" intensity="intense">
<MyuiButton size="lg">重新连接</MyuiButton>
</MyuiGlitchRipple>
<MyuiGlitchRipple :motion-preference="motion" intensity="subtle">
<MyuiTag tone="danger" variant="outline">信号弱</MyuiTag>
</MyuiGlitchRipple>
</div>
:::

```vue
<MyuiGlitchRipple intensity="intense">
  <MyuiButton size="lg">重新连接</MyuiButton>
</MyuiGlitchRipple>

<MyuiGlitchRipple intensity="subtle">
  <MyuiTag tone="danger" variant="outline">信号弱</MyuiTag>
</MyuiGlitchRipple>
```

整块卡片用 `as="div"`：它回到块级流，卡片该多宽还是多宽，噪声场贴着它的外框走。

::: demo
<div class="demo-row" style="min-height:220px; align-items:flex-start; gap:var(--myui-space-8)">
<MyuiGlitchRipple :motion-preference="motion" as="div">
<div style="width:280px; padding:var(--myui-space-5); background-color:var(--myui-color-surface); border:var(--myui-border-width) solid var(--myui-color-line)">
<div style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-tight); color:var(--myui-color-text)">NIGHT MARKET</div>
<p style="margin:var(--myui-space-2) 0 0; font-size:var(--myui-text-sm); color:var(--myui-color-text-soft)">整块面板在丢包，布局不动。</p>
</div>
</MyuiGlitchRipple>
<MyuiGlitchRipple :motion-preference="motion" as="div" intensity="intense">
<div style="width:280px; padding:var(--myui-space-5); background-color:var(--myui-color-surface); border:var(--myui-border-width) solid var(--myui-color-line-strong)">
<div style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-tight); color:var(--myui-color-text)">OPEN LATE</div>
<p style="margin:var(--myui-space-2) 0 0; font-size:var(--myui-text-sm); color:var(--myui-color-text-soft)">位移更强，字也被撕得更开。</p>
</div>
</MyuiGlitchRipple>
</div>
:::

```vue
<MyuiGlitchRipple as="div">
  <div style="width:280px; border:1px solid var(--myui-color-line)">…</div>
</MyuiGlitchRipple>
```

## hover 触发

`trigger="hover"` 时内容先保持干净：波纹、颤抖、闪弱**一起**停，指针（或键盘焦点）进入才全部启动。

::: demo
<div class="demo-row" style="min-height:120px; align-items:center; gap:var(--myui-space-8)">
<MyuiGlitchRipple :motion-preference="motion" trigger="hover" text="HOVER ME" style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-wide)" />
<MyuiGlitchRipple :motion-preference="motion" trigger="hover">
<MyuiButton variant="outline">悬停才丢包</MyuiButton>
</MyuiGlitchRipple>
</div>
:::

```vue
<MyuiGlitchRipple trigger="hover" text="HOVER ME" />
```

## 关掉

`active="false"` 不加滤镜、不挂动画，内容回到干净状态。右边那颗就是**没有特效**的对照组，和左边比一眼就能看出三层在做什么。

::: demo
<div class="demo-row" style="min-height:120px; align-items:center; gap:var(--myui-space-8)">
<MyuiGlitchRipple :motion-preference="motion" intensity="intense" text="SIGNAL WEAK" style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-wide)" />
<MyuiGlitchRipple :active="false" intensity="intense" text="SIGNAL WEAK" style="font-family:var(--myui-font-display); font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-wide)" />
</div>
:::

```vue
<MyuiGlitchRipple :active="false" text="SIGNAL WEAK" />
```

## 系统减弱动效时是什么样

冻结帧不是「什么都不画」，而是滤镜停在一组固定的扭曲值上：内容被轻微推开、条带还在，只是不再流动。**看得出信号不稳，但它不动。**

左边写死 `motion-preference="system"`——在你系统开启「减弱动态效果」时它会停住；右边跟本页开关走。

::: demo
<div class="demo-row" style="gap:var(--myui-space-8); min-height:120px; align-items:center">
<MyuiGlitchRipple motion-preference="system" intensity="intense" text="跟随系统" style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide)" />
<MyuiGlitchRipple :motion-preference="motion" intensity="intense" text="强制动效" style="font-family:var(--myui-font-display); font-size:var(--myui-text-lg); letter-spacing:var(--myui-tracking-wide)" />
</div>
:::

```vue
<MyuiGlitchRipple motion-preference="system" intensity="intense" text="跟随系统" />
<MyuiGlitchRipple motion-preference="always" intensity="intense" text="强制动效" />
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `intensity` | `'subtle' \| 'normal' \| 'intense'` | `'normal'` | 幅度：位移强度与颤抖距离（0.5 / 0.9 / 1.2px），随容器尺寸自适应 |
| `speed` | `'slow' \| 'normal' \| 'fast'` | `'normal'` | 节奏：噪声场滑动 6200 / 3800 / 2200ms，闪弱 3400 / 2600 / 1900ms |
| `trigger` | `'auto' \| 'hover'` | `'auto'` | 自动循环，或指针 / 键盘焦点进入才启动 |
| `active` | `boolean` | `true` | 关掉：不加滤镜、停动画、停逐帧循环 |
| `motionPreference` | `'system' \| 'always'` | `'system'` | `system` 尊重系统减弱动态效果（冻结成静帧）；`always` 强制播放 |
| `text` | `string` | — | 文本模式：渲染这段字，优先于插槽 |
| `as` | `string` | `'span'` | 壳用哪个标签，块级标签自动回到块级流 |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 任意内容，原样渲染、不复制。传了 `text` 时被忽略。 |

## 无障碍与动效

三件事，按重要性排：

1. **默认尊重系统偏好。** `motion-preference="system"`（默认值）时，`prefers-reduced-motion: reduce` 会让三层一起停：逐帧循环不去申请下一帧，CSS 的两层动画也不挂。留下的是一帧轻微但看得出的扭曲——不是空画面。CSS 侧还有一道 `@include myui-motion-safe` 的 `animation: none !important`，所以即使脚本根本没跑（SSR、包没起来、截图服务），减弱动效的访客也不会看到动画。
2. **想强制预览就传 `motion-preference="always"`。** 本页 demo 和 Storybook 都这么用，因为「特效本身」就是被展示的内容。产品内容里请保持默认值：用户关掉动画是有原因的。
3. **系统开关在哪。** Windows：**设置 → 辅助功能 → 视觉效果 → 动画效果**；macOS：**辅助功能 → 显示 → 减弱动态效果**。关掉之后浏览器报告 `reduce`，本组件随即冻结。

另外两点：

- **闪弱节奏有红线**：每个周期 2–3 次硬切，按 1900ms / 2600ms / 3400ms 的周期折算，最快的 `fast` 也只有约 1.6 次/秒，低于每秒 3 次的通行标准；最低透明度 0.55，不会把文字压到不可读。
- **颤抖与闪弱是纯装饰**：它们挂在内容盒子上的 `transform` / `opacity`，不改语义、不改焦点顺序。位移和抖动也不会触发重排，外面布局不会跟着跳。

一个需要知道的边界：`filter` 会让内容盒子成为 `position: fixed` 后代的包含块，也会形成层叠上下文。里面不要塞 portal / 全屏遮罩的宿主。

<script setup lang="ts">
import { computed, ref } from 'vue'

// Every demo on this page passes `motion-preference="always"` so the ripple,
// the tremble and the flicker are visible whatever the reader's OS setting is.
// The checkbox flips the whole page to `system`, which is what a visitor with
// "animation effects" switched off actually gets.
const followSystem = ref(false)
const motion = computed(() => (followSystem.value ? 'system' : 'always'))
</script>
