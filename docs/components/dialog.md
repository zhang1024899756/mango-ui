---
title: Dialog 对话框
description: 悬浮在深空中的终端面板——平涂遮罩、发丝线、霓虹辉光，不含毛玻璃。
---

# Dialog 对话框

对话框是组件库里最容易露出"后台管理系统"底色的地方：毛玻璃遮罩、圆角卡片、
柔光投影，一套下来就变成 SaaS 后台了。

这里的做法是一块**悬浮在深空中的终端面板**：平涂遮罩（带网点纹理）、
1px 霓虹发丝线、40px 级辉光、零圆角。

行为上它必须是一个真正的模态对话框：焦点被锁在里面，关闭后回到触发元素，
body 滚动被冻结，Esc 关闭。

## 基础用法

<ClientOnly>
<MyuiButton @click="visible = true">打开对话框</MyuiButton>

<MyuiDialog v-model="visible" title="加入俱乐部" width="520">
  <p>限量联名即将发售。加入俱乐部可以提前 24 小时进入排队。</p>
  <p>名额有限，且不会追加。</p>
</MyuiDialog>
</ClientOnly>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <MyuiButton @click="visible = true">打开对话框</MyuiButton>

  <MyuiDialog v-model="visible" title="加入俱乐部">
    <p>限量联名即将发售。</p>
  </MyuiDialog>
</template>
```

## 带页脚

`showFooter` 会渲染默认的取消 / 确认按钮，并发出 `cancel` / `confirm` 事件。

<ClientOnly>
<MyuiButton variant="outline" tone="ink" @click="footerVisible = true">带页脚</MyuiButton>

<MyuiDialog v-model="footerVisible" title="确认提交" :show-footer="true" ok-text="提交" cancel-text="再想想">
  <p>提交后将进入审核队列，无法撤销。</p>
</MyuiDialog>
</ClientOnly>

```vue
<MyuiDialog v-model="visible" title="确认提交" :show-footer="true" ok-text="提交" />
```

## 自定义页脚

通过 `#footer` 插槽完全接管操作区。

<ClientOnly>
<MyuiButton variant="ghost" tone="danger" @click="customVisible = true">自定义页脚</MyuiButton>

<MyuiDialog v-model="customVisible" title="自定义页脚">
  <p>页脚可以放任意内容，包括危险操作。</p>
  <template #footer>
    <MyuiButton variant="text" tone="danger">删除</MyuiButton>
    <MyuiButton variant="outline" tone="ink" @click="customVisible = false">关闭</MyuiButton>
  </template>
</MyuiDialog>
</ClientOnly>

## 不可关闭

`closable={false}` + `maskClosable={false}` + `closeOnEsc={false}`：
只能通过页脚按钮关闭，适用于必须做出选择的场景。

<ClientOnly>
<MyuiButton tone="danger" @click="strictVisible = true">必须做出选择</MyuiButton>

<MyuiDialog
  v-model="strictVisible"
  title="请先处理待办"
  :closable="false"
  :mask-closable="false"
  :close-on-esc="false"
  :show-footer="true"
  ok-text="我已完成"
>
  <p>当前有 3 项待办未处理，遮罩点击与 Esc 已被禁用。</p>
</MyuiDialog>
</ClientOnly>

## 半宽

`width` 传数字按键像素处理，传字符串原样使用。

<ClientOnly>
<MyuiButton variant="outline" @click="narrowVisible = true">窄对话框</MyuiButton>

<MyuiDialog v-model="narrowVisible" title="确认删除" :width="380" :show-footer="true" ok-text="删除">
  <p>删除后不可恢复。</p>
</MyuiDialog>
</ClientOnly>

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 是否显示（v-model） |
| `title` | `string` | `''` | 标题，同时作为无障碍名称 |
| `width` | `string \| number` | `520` | 面板宽度，数字按 px |
| `closable` | `boolean` | `true` | 显示右上角关闭按钮 |
| `maskClosable` | `boolean` | `true` | 点击遮罩关闭 |
| `closeOnEsc` | `boolean` | `true` | Esc 关闭 |
| `showFooter` | `boolean` | `false` | 渲染默认页脚 |
| `okText` | `string` | `'确认'` | 确认按钮文案 |
| `cancelText` | `string` | `'取消'` | 取消按钮文案 |
| `appendToBody` | `boolean` | `true` | 传送到 body |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 正文 |
| `title` | 自定义标题（优先于 `title` 属性） |
| `footer` | 自定义页脚（优先于默认按钮） |

## 事件

| 事件 | 说明 |
| --- | --- |
| `update:modelValue` | 可见性变化 |
| `open` | 打开 |
| `close` | 关闭 |
| `confirm` | 点击默认确认按钮 |
| `cancel` | 点击默认取消按钮 |

## 可访问性

`role="dialog"` 与 `aria-modal="true"`，`aria-labelledby` 指向标题节点；
打开时焦点移入面板、Tab / Shift+Tab 在面板内循环，关闭后焦点回到触发元素；
body 滚动被冻结并在关闭时恢复。所有过渡动画在 `prefers-reduced-motion` 下退化为瞬时。

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const footerVisible = ref(false)
const customVisible = ref(false)
const strictVisible = ref(false)
const narrowVisible = ref(false)
</script>
