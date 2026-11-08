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
行动 = 青，信号 = 品红。第三种**强调色**是这套系统最先崩的地方。
霓虹色阶与渐变是表达层，不是第三种强调色——用法见下一节，一次只让一个元素表达。
:::

## 霓虹调色板与渐变

上一节的两个颜色负责「该点哪里」；这一节负责「它会发光」。六个霓虹色相、五支渐变、一个斜切角，
构成了系统的表达层：光谱色调、渐变字形、特效组件都从这里取色。

它**不参与语义判断**：成功还是 `success`，危险还是 `danger`，霓虹色阶永远不替代它们。

### 六个色相

每个色相有两个档：中间那档用于填充、边线、渐变停靠点；`-text` 档是唯一允许变成字形的档。

| 色相 | 填充令牌 | 暗色值 | 文字令牌 | `-text` 值（暗色） |
| --- | --- | --- | --- | --- |
| 青 cyan | `--myui-color-neon-cyan` | `#19e0ff` | `--myui-color-neon-cyan-text` | `#6cf0ff` |
| 品红 magenta | `--myui-color-neon-magenta` | `#ff2e88` | `--myui-color-neon-magenta-text` | `#ff7ab6` |
| 紫 violet | `--myui-color-neon-violet` | `#a970ff` | `--myui-color-neon-violet-text` | `#c9a8ff` |
| 蓝 blue | `--myui-color-neon-blue` | `#4d7cff` | `--myui-color-neon-blue-text` | `#9db8ff` |
| 青柠 lime | `--myui-color-neon-lime` | `#b6ff3b` | `--myui-color-neon-lime-text` | `#d3ff8a` |
| 琥珀 amber | `--myui-color-neon-amber` | `#ffc24b` | `--myui-color-neon-amber-text` | `#ffd37a` |

方块是该色相本体，右下角的 `Aa` 是它作为文字时的 `-text` 档——两者不要混用。

<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(132px, 1fr)); gap:var(--myui-space-3); margin:var(--myui-space-4) 0">
<div style="border:1px solid var(--myui-color-line)"><div style="height:52px; background-color:var(--myui-color-neon-cyan)"></div><div style="display:flex; justify-content:space-between; align-items:center; gap:var(--myui-space-2); padding:var(--myui-space-2)"><span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs); letter-spacing:var(--myui-tracking-wide); text-transform:uppercase; color:var(--myui-color-text-soft)">cyan</span><span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-sm); color:var(--myui-color-neon-cyan-text)">Aa</span></div></div>
<div style="border:1px solid var(--myui-color-line)"><div style="height:52px; background-color:var(--myui-color-neon-magenta)"></div><div style="display:flex; justify-content:space-between; align-items:center; gap:var(--myui-space-2); padding:var(--myui-space-2)"><span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs); letter-spacing:var(--myui-tracking-wide); text-transform:uppercase; color:var(--myui-color-text-soft)">magenta</span><span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-sm); color:var(--myui-color-neon-magenta-text)">Aa</span></div></div>
<div style="border:1px solid var(--myui-color-line)"><div style="height:52px; background-color:var(--myui-color-neon-violet)"></div><div style="display:flex; justify-content:space-between; align-items:center; gap:var(--myui-space-2); padding:var(--myui-space-2)"><span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs); letter-spacing:var(--myui-tracking-wide); text-transform:uppercase; color:var(--myui-color-text-soft)">violet</span><span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-sm); color:var(--myui-color-neon-violet-text)">Aa</span></div></div>
<div style="border:1px solid var(--myui-color-line)"><div style="height:52px; background-color:var(--myui-color-neon-blue)"></div><div style="display:flex; justify-content:space-between; align-items:center; gap:var(--myui-space-2); padding:var(--myui-space-2)"><span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs); letter-spacing:var(--myui-tracking-wide); text-transform:uppercase; color:var(--myui-color-text-soft)">blue</span><span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-sm); color:var(--myui-color-neon-blue-text)">Aa</span></div></div>
<div style="border:1px solid var(--myui-color-line)"><div style="height:52px; background-color:var(--myui-color-neon-lime)"></div><div style="display:flex; justify-content:space-between; align-items:center; gap:var(--myui-space-2); padding:var(--myui-space-2)"><span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs); letter-spacing:var(--myui-tracking-wide); text-transform:uppercase; color:var(--myui-color-text-soft)">lime</span><span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-sm); color:var(--myui-color-neon-lime-text)">Aa</span></div></div>
<div style="border:1px solid var(--myui-color-line)"><div style="height:52px; background-color:var(--myui-color-neon-amber)"></div><div style="display:flex; justify-content:space-between; align-items:center; gap:var(--myui-space-2); padding:var(--myui-space-2)"><span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs); letter-spacing:var(--myui-tracking-wide); text-transform:uppercase; color:var(--myui-color-text-soft)">amber</span><span style="font-family:var(--myui-font-mono); font-size:var(--myui-text-sm); color:var(--myui-color-neon-amber-text)">Aa</span></div></div>
</div>

白昼主题下这六个色相自动换成**颜料深度**（例如青变成 `#00739c`），文字档同步压深——
"霓虹"在白纸上意味着饱和的墨，而不是发光。

### 五支渐变

| 令牌 | 走向 | 用在哪 |
| --- | --- | --- |
| `--myui-gradient-spectrum` | 青 0% → 蓝 28% → 紫 62% → 品红 100%，100deg | 光谱形态的默认：斜的就对了，横向彩虹像 2010 年的进度条 |
| `--myui-gradient-spectrum-vertical` | 同四个停点，180deg | 竖向容器、竖排文字 |
| `--myui-gradient-acid` | 青柠 → 青，100deg | 酸性促销、抢购 |
| `--myui-gradient-heat` | 琥珀 → 信号品红，100deg | 热度、倒计时、涨幅 |
| `--myui-gradient-deep` | 蓝 → 紫，100deg | 深空底、面板背景 |

签名渐变用**四个**停点而不是两个：只有青和品红时，中间那段会被读成两色之间的过渡，
加进蓝和紫之后，「多色」才真的看得出是多色。

`-spectrum-vertical` 是同一组停点的 180deg 版本，给竖条和竖排文字用。
`-acid`、`-heat`、`-deep` 是另外三支预设，走的是同一个变量：

```css
:root {
  --myui-gradient-spectrum: var(--myui-gradient-acid);
}
```

覆盖一个 CSS 变量就能整段替换渐变，不需要新 API，也不需要新组件参数。

<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:var(--myui-space-3); margin:var(--myui-space-4) 0">
<div><div style="height:56px; background-image:var(--myui-gradient-spectrum)"></div><div style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs); color:var(--myui-color-text-faint); padding-top:var(--myui-space-1)">spectrum</div></div>
<div><div style="height:56px; background-image:var(--myui-gradient-spectrum-vertical)"></div><div style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs); color:var(--myui-color-text-faint); padding-top:var(--myui-space-1)">spectrum-vertical</div></div>
<div><div style="height:56px; background-image:var(--myui-gradient-acid)"></div><div style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs); color:var(--myui-color-text-faint); padding-top:var(--myui-space-1)">acid</div></div>
<div><div style="height:56px; background-image:var(--myui-gradient-heat)"></div><div style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs); color:var(--myui-color-text-faint); padding-top:var(--myui-space-1)">heat</div></div>
<div><div style="height:56px; background-image:var(--myui-gradient-deep)"></div><div style="font-family:var(--myui-font-mono); font-size:var(--myui-text-xs); color:var(--myui-color-text-faint); padding-top:var(--myui-space-1)">deep</div></div>
</div>

用它们刷字时走 mixin，不要手写 `-webkit-text-fill-color`：

```scss
@include myui-spectrum-text;  // 字形：@supports 回退到实心霓虹青
@include myui-spectrum-fill;  // 面：先给实心底色，再叠渐变
```

### 斜切角

全库只有一个斜切角：

```css
:root {
  --myui-skew-angle: -12deg;
}
```

组件**不写 `skewX()`**，而是把它塞进 `--myui-shear`，再由根节点的 `transform: var(--myui-shear)` 兑现：

```css
.myui-link--skew {
  --myui-shear: skewX(var(--myui-skew-angle));
}
```

这样悬停时新增的 `transform: var(--myui-shear) translateY(-1px)` 仍然成立，斜切不会被覆盖。
配套三个 mixin：

| mixin | 作用 |
| --- | --- |
| `myui-shear-slot` | 在根节点声明 `--myui-shear`（恒等斜切），让上面的 transform 永远有效 |
| `myui-shear-on` | 在 `--skew` 修饰类里打开斜切 |
| `myui-shear-upright` | 只给**斜切面板内部**需要保持水平的标签用；纯文字组件（Link / Number）不要用 |

### 表达层的四条纪律

1. **一次只让一个元素表达。** 一屏里一个渐变字 + 一个光谱数字已经够响；第三个就开始吵。
2. **色阶不替代语义 token。** 成功用 `--myui-color-success`，不要用"看起来像绿灯"的青柠。
3. **只有 `-text` 变体允许变成字形。** 中间档是给填充、边线和渐变停靠点用的；直接当文字会掉到 AA 以下。
4. **渐变上的文字用 `--myui-color-accent-ink`。** 它在暗色主题是近黑、白昼主题是白。
   实测对比度：暗色主题在四个停点上分别是青 11.9:1、蓝 5.1:1、紫 5.8:1、品红 5.4:1；
   白昼主题是白字，四个停点 5.3–8.6:1。两组都过 AA——这是渐变能承载文字的前提。

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
  css: ['@zhang1024899756/mango-ui/style.css'],
})
```

## 字体

库不带字体。默认栈是 `Chakra Petch`（显示体）+ `Inter`（正文）+ `JetBrains Mono`（微标签），
并回退到 `PingFang SC` / `Microsoft YaHei` / `system-ui`。
想要设计稿里的技术感，自行加载 Chakra Petch；中文会自动回落到系统黑体。
