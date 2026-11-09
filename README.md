# Mango UI

**一套为赛博朋克门户而生的 Vue 3 组件库。**

**[📖 在线文档](https://zhang1024899756.github.io/mango-ui/)** · **[npm](https://www.npmjs.com/package/@arvinzxy/mango-ui)** · **[GitHub 仓库](https://github.com/zhang1024899756/mango-ui)** · **[更新日志](https://github.com/zhang1024899756/mango-ui/releases)**

深空近黑打底、1px 霓虹发丝线、只有一个电光青作为行动色，品红只做信号。
为数字穿越题材的门户站、数字艺术与未来科技产品而生，
以及一切不想长得像后台管理系统的前端。

```bash
pnpm add @arvinzxy/mango-ui
```

```vue
<script setup lang="ts">
import { ref } from 'vue'

const joined = ref(false)
</script>

<template>
  <MyuiNeon :intensity="0.6">
    <MyuiButton size="lg" @click="joined = true">限量发售 · JOIN</MyuiButton>
  </MyuiNeon>
</template>
```

---

## 两种武器

### 特效组件：可以包裹任何东西

特效组件不生产内容，只给已有内容加一层情绪。文本、按钮、图片、整块卡片都能套。

```vue
<MyuiNeon :intensity="0.6">
  <MyuiButton size="lg">限量发售</MyuiButton>
</MyuiNeon>

<MyuiFlotage :amplitude="20" :duration="5">
  <MyuiImage src="/lookbook/01.jpg" ratio="3:4" caption="SS26 LOOKBOOK" />
</MyuiFlotage>

<MyuiGlitchRipple intensity="intense" speed="slow">
  <MyuiButton size="lg">限量发售</MyuiButton>
</MyuiGlitchRipple>
```

- **Neon 霓虹特效** —— 静态就有灯管辉光，再叠呼吸/闪断/扫光，`glow` / `scan` / `flicker` 三种模式
- **Flotage 漂浮特效** —— 持续失重漂浮，可轴向、可 hover 触发、可关
- **GlitchRipple 故障波纹** —— 噪声场（`feTurbulence`）+ 逐像素位移（`feDisplacementMap`）把**内容本身**推向波纹：水平条带缓缓流过，像信号守不住；减弱动效时冻结成一帧轻微扭曲而不是消失

### 元素组件：自带海报气质

| 组件 | 标签 | 说明 |
| --- | --- | --- |
| Button | `<MyuiButton>` | 按钮 —— 按下时辉光熄灭并压入界面，不是弹跳 |
| Icon | `<MyuiIcon>` | 图标 —— 内置 24+ 手绘描边图标，无图标字体 |
| Link | `<MyuiLink>` | 链接 —— 外链自动加 `rel`，禁用态拦截跳转 |
| Image | `<MyuiImage>` | 图片 —— 固定比例占位、加载骨架、错误兜底 |
| Number | `<MyuiNumber>` | 数值 —— 千分位、精度、趋势、滚动计数 |
| Text | `<MyuiText>` | 文字 —— 展示体/HUD/正文/等宽四套嗓音，字距行高显式可控 |
| Tag | `<MyuiTag>` | 标签 —— 大写字距的微标，可关闭、可筛选 |
| Input | `<MyuiInput>` | 输入框 —— 真实 input、清除按钮、字数统计、错误态 |
| Switch | `<MyuiSwitch>` | 开关 —— `role="switch"`，空格/回车切换 |
| Slider | `<MyuiSlider>` | 滑动条 —— 单值/双柄、键盘、轨道点击 |
| Dialog | `<MyuiDialog>` | 对话框 —— 焦点陷阱、滚动锁定、Esc 关闭 |
### 形体：斜切与渐变

除了变体与语义色，元素组件还支持两种可选**形体**，可与任意变体、尺寸组合：

| 形体 | 写法 | 效果 |
| --- | --- | --- |
| 斜切 | `skew` | 整体按 `--myui-skew-angle`（默认 `-12deg`）倾斜：矩形变斜矩形、纯文字组件倾斜字形；开关是斜矩形轨道套斜方块滑块，滑动条只有手柄斜切、轨道保持水平 |
| 渐变 | `tone="spectrum"` | 填充 / 描边 / 字形换上 `--myui-gradient-spectrum`（青 → 蓝 → 紫 → 品红），字色切到 `--myui-color-accent-ink`，每个色标都过 AA |

```vue
<MyuiButton tone="spectrum" skew>进入传送门</MyuiButton>
<MyuiSwitch v-model="on" skew tone="spectrum" />
<MyuiProgress :percent="72" tone="spectrum" skew />
```

斜切靠 `--myui-shear` 变量承载，所以悬停上浮、按下回落、滑块缩放仍然能叠加在它上面；
渐变是**形体**而不是底色：错误仍是红、成功仍是绿，语义色不会因为它而改变含义。

---

## 安装与使用

```bash
pnpm add @arvinzxy/mango-ui
```

> npm 上 `mango-ui` 这个包名已被他人占用（2018 年的旧包），所以正式包名是作用域包 `@arvinzxy/mango-ui`。

```ts
import { createApp } from 'vue'
import MangoUI from '@arvinzxy/mango-ui'
import '@arvinzxy/mango-ui/style.css'
import App from './App.vue'

createApp(App).use(MangoUI).mount('#app')
```

按需引入（每个组件都有独立入口，可摇树）：

```ts
import { MyuiButton, MyuiTag } from '@arvinzxy/mango-ui'
```

类型随包发布：

```ts
import type { ButtonProps, ButtonVariant } from '@arvinzxy/mango-ui'
```

唯一的 peer 依赖是 `vue@^3.5.0`。没有 lodash、没有 CSS-in-JS、没有图标字体。

---

## 设计方向：赛博朋克 · 数字穿越

未来科技不是靠堆霓虹做出来的，而是靠**约束**。六条硬规则：

| 常见翻车 | Mango UI |
| --- | --- |
| 满屏发光 | 近黑底，霓虹只在一处亮 |
| 紫蓝渐变糊汤 | 单一电光青 + 品红信号，不用渐变 |
| 圆角玻璃卡片 | 零圆角 + 1px 发丝线 |
| 投影做层级 | 辉光做层级（8–40px，低透明度） |
| 弹跳动画 | 机械短促 120–420ms，可全部关闭 |
| 十几个灰阶 | 三级冰白 + 五级表面，单一色系 |

完整理由见 [设计原则](https://github.com/zhang1024899756/mango-ui/blob/main/docs/guide/design-principles.md)。

---

## 主题

所有可调的东西都是 CSS 自定义属性。换成酸性黄绿的巷战版，不需要构建工具：

```css
:root {
  --myui-color-accent: #c8ff2e;
  --myui-color-accent-hover: #dbff6a;
  --myui-color-accent-active: #a8e000;
  --myui-color-accent-text: #d8ff7a;
  --myui-color-accent-ink: #0a1000;
}
```

默认就是夜幕霓虹；白昼实验室版本只需一个属性：

```html
<html data-myui-theme="light">
```

所有基础重置都用 `:where()` 包裹（特异性为 0），所有组件类名都是单类名，
因此任何一条普通选择器都能覆盖库的样式，**不需要 `!important`**：

```css
.checkout .myui-button {
  letter-spacing: 0.06em;
}
```

完整令牌表见 [主题与令牌](https://github.com/zhang1024899756/mango-ui/blob/main/docs/guide/theming.md)。

---

## 本地开发

```bash
pnpm install

pnpm dev            # Storybook 6006 —— 开发与验收
pnpm docs:dev       # VitePress 文档站 → http://localhost:5173/mango-ui/
pnpm docs:build     # 产出 docs/.vitepress/dist（base 已内置 /mango-ui/）
pnpm docs:preview   # 按生产路径预览构建产物
pnpm test           # Vitest
pnpm type-check     # vue-tsc
pnpm build          # Vite lib 模式 + .d.ts
pnpm plop           # 生成新组件骨架（SFC / 类型 / 样式 / 故事 / 测试 / 文档）
```

### 目录结构

```
src/
├── components/          元素组件（button/ icon/ input/ …）
│   └── <name>/
│       ├── <Name>.vue           组件实现
│       ├── types.ts             props 与联合类型
│       ├── index.ts             导出 + 挂载样式
│       ├── styles/<name>.scss   只用令牌
│       ├── <Name>.stories.ts    Storybook
│       └── <Name>.test.ts       Vitest
├── effects/             特效组件（neon/ flotage/ glitch-ripple/），结构同上
├── styles/
│   ├── tokens.scss      设计令牌（公开的主题 API）
│   ├── mixins.scss      SCSS 编译期辅助
│   ├── reset.scss       :where() 零特异性重置
│   └── index.scss       全局样式入口
├── utils/with-install.ts  组件追加 install()
└── index.ts             库入口（全量注册 + 类型导出）
docs/                    VitePress 文档站
.storybook/              Storybook 10 配置
plop-template/           组件脚手架模板
```

新增组件请先读 [CONTRIBUTING.md](https://github.com/zhang1024899756/mango-ui/blob/main/CONTRIBUTING.md)。

---

## 文档站部署

文档站跑在 GitHub Pages 的**项目子路径**上：<https://zhang1024899756.github.io/mango-ui/>。

- `docs/.vitepress/config.ts` 的 `base` 默认就是 `/mango-ui/`，可用环境变量覆盖：`DOCS_BASE=/ pnpm docs:build`（换自定义域名时才需要）。
- **页面里手写的绝对链接必须走 `withBase()`**。VitePress 只会重写它自己生成的链接（导航、侧边栏、构建资源），裸 HTML 里写的 `href="/x"`、`src="/x"` 不会带上 base，上线后就是 404。字体样式 `docs/public/fonts.css` 同理，内部 `url()` 一律写成相对路径。
- `.github/workflows/deploy-docs.yml` 在 `main` 有新提交（或手动触发）时构建并发布；构建后带一道断言，检查首页没有漏掉 base 的根路径链接，防止再次静默上线坏链接。
- 首次启用：仓库 **Settings → Pages → Source** 选 **GitHub Actions**（本仓库已配置好）。

## 浏览器支持

现代常青浏览器（Chrome / Edge / Firefox / Safari 最近两个版本）。
用到的特性：CSS 自定义属性、`:where()`、`aspect-ratio`、`color-scheme`、`backdrop-filter`。
不支持 IE。

## License

[MIT](./LICENSE) © zhang1024899756
