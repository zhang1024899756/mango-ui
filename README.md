# Mango UI

**一套为赛博朋克门户而生的 Vue 3 组件库。**

**[📖 在线文档](https://zhang1024899756.github.io/mango-ui/)** · **[GitHub 仓库](https://github.com/zhang1024899756/mango-ui)** · **[更新日志](https://github.com/zhang1024899756/mango-ui/releases)**

深空近黑打底、1px 霓虹发丝线、只有一个电光青作为行动色，品红只做信号。
为数字穿越题材的门户站、数字艺术与未来科技产品而生，
以及一切不想长得像后台管理系统的前端。

```bash
pnpm add mango-ui
```

```vue
<script setup lang="ts">
import { ref } from 'vue'

const joined = ref(false)
</script>

<template>
  <MyuiMagic mode="glitch">
    <MyuiButton size="lg" @click="joined = true">限量发售 · JOIN</MyuiButton>
  </MyuiMagic>
</template>
```

---

## v2：完全重写

这个仓库原本是 Vue 2 时代的多包 monorepo（Lerna + Rollup），里面只有一个
CSS 故障字特效组件。v2 是一次彻底重写：

| | v1 | v2（当前） |
| --- | --- | --- |
| 框架 | Vue 2.6 | **Vue 3.5**（`<script setup>`） |
| 语言 | JavaScript | **TypeScript**（严格模式，导出 `.d.ts`） |
| 构建 | Lerna + Rollup（每包一份配置） | **Vite lib 模式** + `vue-tsc` |
| 形态 | `packages/*` 多包 | 单包，按组件分目录、可摇树 |
| 样式 | 组件内写死颜色与尺寸 | **SCSS → CSS 变量**，`.myui-` 前缀，`:where()` 重置 |
| 视觉方向 | 一个 CSS 故障字 | **赛博朋克 · 数字穿越 · 未来科技** |
| 开发验收 | Storybook 6 | **Storybook 10** |
| 官网 | 无 | **[VitePress 1.x 在线文档](https://zhang1024899756.github.io/mango-ui/)** |
| 组件数 | 1 | **13**（2 特效 + 11 元素） |
| 测试 | 1 个 `toBeDefined()` | Vitest，逐组件行为测试 |

---

## 两种武器

### 特效组件：可以包裹任何东西

特效组件不生产内容，只给已有内容加一层情绪。文本、按钮、图片、整块卡片都能套。

```vue
<MyuiMagic mode="glitch" :intensity="0.6">
  <MyuiButton size="lg">限量发售</MyuiButton>
</MyuiMagic>

<MyuiFlotage :amplitude="10" :duration="5">
  <MyuiImage src="/lookbook/01.jpg" ratio="3:4" caption="SS26 LOOKBOOK" />
</MyuiFlotage>
```

- **Magic 魔法特效** —— RGB 分离故障 + 扫描线，`glitch` / `scan` / `flicker` 三种模式
- **Flotage 漂浮特效** —— 持续漂浮，可轴向、可 hover 触发、可关

### 元素组件：自带海报气质

| 组件 | 标签 | 说明 |
| --- | --- | --- |
| Button | `<MyuiButton>` | 按钮 —— 硬偏移阴影，按下真的压进纸里 |
| Icon | `<MyuiIcon>` | 图标 —— 内置 24+ 手绘描边图标，无图标字体 |
| Link | `<MyuiLink>` | 链接 —— 外链自动加 `rel`，禁用态拦截跳转 |
| Image | `<MyuiImage>` | 图片 —— 固定比例占位、加载骨架、错误兜底 |
| Number | `<MyuiNumber>` | 数值 —— 千分位、精度、趋势、滚动计数 |
| Tag | `<MyuiTag>` | 标签 —— 大写字距的微标，可关闭、可筛选 |
| Input | `<MyuiInput>` | 输入框 —— 真实 input、清除按钮、字数统计、错误态 |
| Switch | `<MyuiSwitch>` | 开关 —— `role="switch"`，空格/回车切换 |
| Slider | `<MyuiSlider>` | 滑动条 —— 单值/双柄、键盘、轨道点击 |
| Dialog | `<MyuiDialog>` | 对话框 —— 焦点陷阱、滚动锁定、Esc 关闭 |
| Progress | `<MyuiProgress>` | 进度条 —— 条形/圆环/不确定态 |

---

## 安装与使用

```bash
pnpm add mango-ui
```

```ts
import { createApp } from 'vue'
import MangoUI from 'mango-ui'
import 'mango-ui/style.css'
import App from './App.vue'

createApp(App).use(MangoUI).mount('#app')
```

按需引入（每个组件都有独立入口，可摇树）：

```ts
import { MyuiButton, MyuiTag } from 'mango-ui'
```

类型随包发布：

```ts
import type { ButtonProps, ButtonVariant } from 'mango-ui'
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
├── effects/             特效组件（magic/ flotage/），结构同上
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

## 从 v1 迁移

1. **组件包路径没了**：`packages/magic` → 直接从 `mango-ui` 引入 `MyuiMagic`。
2. **`magic` 的 API 变了**：原来是 `content` 字符串 prop，现在是包裹型组件，
   仍然支持 `text` prop，但推荐用默认插槽包住任意内容。
3. **类名变了**：`.text-magic` → `.myui-magic`。
4. **Vue 2 的 `Vue.use()` 插件协议**换成了标准的 Vue 3 `app.use()`；视觉方向也从单个 CSS 故障字扩展为整套赛博朋克设计系统。
5. **Jest + `@vue/test-utils@1`** 换成了 Vitest + `@vue/test-utils@2`。

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
