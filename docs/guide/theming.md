# 主题与令牌

> 一切可调的东西都是 CSS 自定义属性。没有 SCSS 变量 API，没有主题对象，没有 Provider。
> 默认是**夜幕霓虹**（深空底 + 电光青）；`[data-myui-theme="light"]` 是白昼实验室版本。

## 三层结构

```
① 基础令牌     src/styles/tokens.scss     颜色 / 字号 / 间距 / 圆角 / 辉光 / 动效
② 组件内变量   styles/<name>.scss          --myui-progress-tone 这类局部开关
③ 你的覆盖     :root / 任意容器 / 子类      直接改 CSS 变量
```

Mango UI 只对外承诺第 ① 层和第 ② 层。

## 表面与文字

| 令牌 | 暗色（默认） | 用途 |
| --- | --- | --- |
| `--myui-color-bg` | `#05070d` | 页面底：深空近黑 |
| `--myui-color-surface` | `#0a0f18` | 抬起的面（卡片、面板） |
| `--myui-color-surface-raised` | `#101724` | 再上一层（悬浮、弹层） |
| `--myui-color-surface-deep` | `#02040a` | 凹陷/轨道/代码底 |
| `--myui-color-glass` | `rgba(16,23,36,.72)` | 顶栏等半透面 |
| `--myui-color-text` | `#dbe9f4` | 主文字（冰白） |
| `--myui-color-text-soft` | `#93a7bb` | 次要文字 |
| `--myui-color-text-faint` | `#6f8499` | 三级文字（仍满足 AA） |

## 结构线

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--myui-color-line` | `#1b2a3d` | 结构性发丝线（1px） |
| `--myui-color-line-soft` | `rgba(120,200,255,.14)` | 细分隔线 |
| `--myui-color-line-strong` | `rgba(120,200,255,.38)` | 可交互边线 |
| `--myui-color-grid` | `rgba(120,200,255,.055)` | 数据网格底纹 |
| `--myui-border-width` | `1px` | 全库唯一边框宽度 |

## 强调色与信号色

| 令牌 | 暗色 | 用途 |
| --- | --- | --- |
| `--myui-color-accent` | `#19e0ff` | **唯一的行动色**：电光青 |
| `--myui-color-accent-hover` | `#55ecff` | 悬停 |
| `--myui-color-accent-active` | `#00b8d4` | 按下 |
| `--myui-color-accent-ink` | `#01131a` | 青底上的文字 |
| `--myui-color-accent-text` | `#6cf0ff` | 青作为**文字**时的 AA 档 |
| `--myui-color-accent-wash` | `rgba(25,224,255,.12)` | 青的淡底 |
| `--myui-color-signal` | `#ff2e88` | 信号色：新品/告警/热标记 |
| `--myui-color-signal-text` | `#ff7ab6` | 品红作为文字时的 AA 档 |
| `--myui-color-scrim` | `rgba(2,4,10,.82)` | 遮罩 |

语义色：`success` `warning` `danger` `info`，各带一个 `-wash` 淡底版本。

::: tip 两个色就够
行动 = 青，信号 = 品红。其它颜色只允许出现在语义状态里。
第三种霓虹色是这套系统最先崩的地方。
:::

## 字号与行高

七级，比例约 1.25，不要再发明中间值：

| 令牌 | 值 |
| --- | --- |
| `--myui-text-xs` | 12px |
| `--myui-text-sm` | 13px |
| `--myui-text-md` | 15px（正文） |
| `--myui-text-lg` | 19px |
| `--myui-text-xl` | 24px |
| `--myui-text-2xl` | 32px |
| `--myui-text-3xl` | 44px |

字体三档：`--myui-font-display`（Chakra Petch）、`--myui-font-body`（Inter）、
`--myui-font-mono`（JetBrains Mono / Consolas）。微标签用 mono + 大写 + `0.16em` 字距。

## 间距

4px 网格，八级：
`--myui-space-1`(4) `-2`(8) `-3`(12) `-4`(16) `-5`(24) `-6`(32) `-7`(48) `-8`(64)。

## 形状与辉光

只有两个圆角：`--myui-radius-none`(0) 与 `--myui-radius-pill`(999px)。

层级不是投影，是光：

```css
--myui-shadow-glow-sm: 0 0 8px  rgba(25, 224, 255, 0.22);
--myui-shadow-glow:    0 0 18px rgba(25, 224, 255, 0.26);
--myui-shadow-glow-lg: 0 0 40px rgba(25, 224, 255, 0.3);
--myui-shadow-signal:  0 0 20px rgba(255, 46, 136, 0.28);
--myui-shadow-inset:   inset 0 0 0 1px var(--myui-color-line-soft); /* 屏幕内描边 */
```

## 白昼实验室

给任意祖先加 `data-myui-theme="light"`：

```html
<div data-myui-theme="light">
  <MyuiButton>白昼模式</MyuiButton>
</div>
```

白昼版不是"反相"：底变成冷灰白，青色压深到 `#00739c` 以保证白底上的对比度，
品红压深到 `#c9135f`。品牌语义不变，只是换了一个观测环境。

::: warning 只用一个开关
不要同时用 `data-myui-theme` 和自定义 class 两套暗色机制，
令牌选择器只有一个来源，混用必然打架。
:::

## 换肤：改一组变量

想换成"酸性黄绿"的巷战版？不需要构建工具：

```css
:root {
  --myui-color-accent: #c8ff2e;
  --myui-color-accent-hover: #dbff6a;
  --myui-color-accent-active: #a8e000;
  --myui-color-accent-text: #d8ff7a;
  --myui-color-accent-ink: #0a1000;
  --myui-color-accent-wash: rgba(200, 255, 46, 0.12);
}
```

局部换肤写在容器上：

```css
.magenta-zone {
  --myui-color-accent: #ff2e88;
  --myui-color-accent-text: #ff7ab6;
  --myui-color-accent-ink: #1a0010;
}
```

## 组件级变量

部分组件暴露自己的小开关，例如 `--myui-progress-tone`：

```css
.my-report .myui-progress {
  --myui-progress-tone: var(--myui-color-info);
}
```

## 覆盖组件样式

库里的类名都是**单类名**（`.myui-button`），并且基础重置全部用 `:where()`
包住（特异性为 0）。所以任何一条普通选择器都能盖过去，不需要 `!important`：

```css
/* 特异性 0,2,0 —— 稳定胜过 .myui-button */
.checkout .myui-button {
  letter-spacing: 0.06em;
}
```

类名约定：

| 形式 | 含义 |
| --- | --- |
| `.myui-button` | 组件根 |
| `.myui-button--solid` | 修饰符 |
| `.myui-button__label` | 内部元素 |
| `[data-active="true"]` | 状态钩子（供外部选择器使用） |

## Nuxt / SSR

库是纯 CSS + Vue 组件，没有 `window` 依赖（对话框的 DOM 操作都在 `watch`
与 `onMounted` 之后）。Nuxt 3 中把样式挂到 `nuxt.config` 的 `css` 数组即可：

```ts
export default defineNuxtConfig({
  css: ['mango-ui/style.css'],
})
```

## 字体

库不带字体。默认栈是 `Chakra Petch`（显示体）+ `Inter`（正文）+ `JetBrains Mono`（微标签），
并回退到 `PingFang SC` / `Microsoft YaHei` / `system-ui`。
想要设计稿里的技术感，自行加载 Chakra Petch；中文会自动回落到系统黑体。
