---
title: Tag 标签
description: HUD 式微标——等宽大写、字距拉开、1px 发丝线。分类、状态、筛选一次说清。
---

# Tag 标签

一枚盖在终端面板上的状态戳。字号小、字距开、边线细，用来标注分类、状态或筛选条件。

三种视觉权重：`solid` 是断言，`outline` 是分类，`ghost` 是"这条信息可以小声一点"。

## 基础用法

::: demo
<div class="demo-row">
<MyuiTag>NEW DROP</MyuiTag>
<MyuiTag tone="accent">限量</MyuiTag>
<MyuiTag tone="success">已上架</MyuiTag>
</div>
:::

```vue
<MyuiTag>NEW DROP</MyuiTag>
<MyuiTag tone="accent">限量</MyuiTag>
<MyuiTag tone="success">已上架</MyuiTag>
```

## 变体

::: demo
<div class="demo-row">
<MyuiTag variant="outline" tone="accent">OUTLINE</MyuiTag>
<MyuiTag variant="solid" tone="accent">SOLID</MyuiTag>
<MyuiTag variant="ghost" tone="accent">GHOST</MyuiTag>
</div>
:::

```vue
<MyuiTag variant="outline" tone="accent">OUTLINE</MyuiTag>
<MyuiTag variant="solid" tone="accent">SOLID</MyuiTag>
<MyuiTag variant="ghost" tone="accent">GHOST</MyuiTag>
```

## 语义色

七种语义，只用在该状态真的成立的地方。

::: demo
<div class="demo-row">
<MyuiTag v-for="t in ['neutral','accent','success','warning','danger','info','ink']" :key="t" :tone="t" variant="solid">{{ t }}</MyuiTag>
</div>
:::

```vue
<MyuiTag tone="neutral" variant="solid">neutral</MyuiTag>
<MyuiTag tone="accent" variant="solid">accent</MyuiTag>
<MyuiTag tone="success" variant="solid">success</MyuiTag>
<MyuiTag tone="warning" variant="solid">warning</MyuiTag>
<MyuiTag tone="danger" variant="solid">danger</MyuiTag>
<MyuiTag tone="info" variant="solid">info</MyuiTag>
<MyuiTag tone="ink" variant="solid">ink</MyuiTag>
```

## 尺寸与形状

::: demo
<div class="demo-row">
<MyuiTag size="sm" variant="solid" tone="ink">SM</MyuiTag>
<MyuiTag size="md" variant="solid" tone="ink">MD</MyuiTag>
<MyuiTag shape="pill" variant="solid" tone="accent">PILL</MyuiTag>
</div>
:::

## 可关闭

关闭按钮是真正的 `<button>`，带 `aria-label="Remove"`，键盘可达。

::: demo
<div class="demo-row">
<MyuiTag closable variant="solid" tone="ink">限时 · 24H</MyuiTag>
<MyuiTag closable variant="outline" tone="danger">已过期</MyuiTag>
</div>
:::

```vue
<MyuiTag closable variant="solid" tone="ink" @close="onClose">限时 · 24H</MyuiTag>
```

## 筛选态

`active` 用于筛选标签的选中状态，同时暴露 `data-active="true"` 方便外部选择器接管。

::: demo
<div class="demo-row">
<MyuiTag active>全部</MyuiTag>
<MyuiTag>球鞋</MyuiTag>
<MyuiTag>户外</MyuiTag>
<MyuiTag>联名</MyuiTag>
</div>
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `tone` | `'neutral' \| 'accent' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'ink'` | `'neutral'` | 语义色 |
| `variant` | `'solid' \| 'outline' \| 'ghost'` | `'outline'` | 视觉权重 |
| `size` | `'sm' \| 'md'` | `'sm'` | 尺寸 |
| `shape` | `'rect' \| 'pill'` | `'rect'` | 方角或胶囊 |
| `closable` | `boolean` | `false` | 显示关闭按钮 |
| `active` | `boolean` | `false` | 筛选选中态 |

## 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `close` | `MouseEvent` | 点击关闭按钮 |

## 可访问性

标签文本本身就是内容，不做 `aria-hidden`。关闭按钮是可聚焦的真实按钮，命中区 16×16 且通过 `opacity` 保留在视觉层次里；`active` 状态不依赖颜色单一通道（同时有背景与边框变化）。
