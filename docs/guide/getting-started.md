# 快速上手

> Vue 3.5 + TypeScript + Vite lib 模式。零运行时依赖，唯一 peer 是 Vue 本体。

## 安装

```bash
pnpm add @zhang1024899756/mango-ui
```

::: tip 为什么是作用域包
npm 上 `mango-ui` 早在 2018 年就被别人注册了，无法同名发布；本库因此以 `@zhang1024899756/mango-ui` 发布，是公开包，不需要额外的 registry 配置。
:::

## 全量引入

```ts
import { createApp } from 'vue'
import MangoUI from '@zhang1024899756/mango-ui'
import '@zhang1024899756/mango-ui/style.css'
import App from './App.vue'

createApp(App).use(MangoUI).mount('#app')
```

`use(MangoUI)` 会注册全部组件，之后可以直接用 `<MyuiButton>`、`<MyuiNeon>`、`<MyuiText>` 等标签。

## 按需引入

每个组件都是独立入口，打包器可以摇掉没用到的部分：

```vue
<script setup lang="ts">
import { MyuiButton, MyuiTag } from '@zhang1024899756/mango-ui'
</script>

<template>
  <MyuiButton variant="outline">收藏</MyuiButton>
  <MyuiTag tone="accent">NEW DROP</MyuiTag>
</template>
```

::: tip 样式只有一份
`@zhang1024899756/mango-ui/style.css` 里包含设计令牌、可选的基础重置，以及全部组件样式。
按需引入 JS 不会让样式消失——样式是整体加载的，这是刻意的：
CSS 变量主题需要一个统一的令牌来源。
:::

## 主题：浅色 / 暗色

组件默认跟随令牌里的浅色值。给任意祖先节点加 `data-myui-theme="dark"` 就会切换到夜刊配色：

```html
<!-- 整个应用 -->
<html data-myui-theme="dark">

<!-- 只切换一块区域 -->
<div data-myui-theme="dark">
  <MyuiButton>夜间模式的按钮</MyuiButton>
</div>
```

和系统主题联动：

```ts
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
document.documentElement.dataset.myuiTheme = prefersDark ? 'dark' : 'light'
```

## 字体

库本身**不加载任何网络字体**——消费者的字体由消费者决定。默认栈是
`Archivo Black` (显示体) 与 `Inter` (正文)，都回退到
`PingFang SC` / `Microsoft YaHei` / `system-ui`。想拿到设计稿里的效果，把这两个字体
自行加载（我们的文档站用的就是自托管的 woff2）。

## 浏览器支持

现代常青浏览器：Chrome / Edge / Firefox / Safari 最近两个版本。
用到的特性有 CSS 自定义属性、`:where()`、`aspect-ratio`、`color-scheme`。
不支持 IE —— 2026 年了。

## TypeScript

类型随包发布，`exports.types` 指向 `dist/types/index.d.ts`：

```ts
import type { ButtonProps, ButtonVariant } from '@zhang1024899756/mango-ui'
```

`props` 的联合类型全部导出，写封装组件时可以直接复用。

## 本地开发这套库

```bash
pnpm install
pnpm dev            # Storybook 6006，开发与验收
pnpm docs:dev       # 文档站
pnpm test           # vitest
pnpm type-check     # vue-tsc
pnpm build          # vite lib 模式 + d.ts 产物
```

新增组件的流程见仓库根目录的 `CONTRIBUTING.md`。
