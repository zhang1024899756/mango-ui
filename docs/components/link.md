---
title: Link 链接
description: 一条 2px 的墨线，不是蓝色小字。外链自动带 target 和 rel。
---

# Link 链接

文字要去别处。下划线用的是全系统同一条 2px 墨线；外链自己带上 `target="_blank"` 和 `rel="noreferrer noopener"`，还会长出一支箭头——这两件事你不需要记，也忘不了。

## 基础用法

::: demo
<div class="demo-row">
<MyuiLink href="/drops">本周上新</MyuiLink>
<MyuiLink href="/drops/2026" underline="always">2026 春夏系列</MyuiLink>
</div>
:::

```vue
<MyuiLink href="/drops">本周上新</MyuiLink>
```

## 语义色

`ink` 是正文链接，`accent` 留给"真的要去外面"的那一个，`muted` 是次级信息。

::: demo
<div class="demo-row">
<MyuiLink href="/a" tone="ink">INK 正文</MyuiLink>
<MyuiLink href="/a" tone="accent">ACCENT 强调</MyuiLink>
<MyuiLink href="/a" tone="muted">MUTED 次级</MyuiLink>
</div>
:::

```vue
<MyuiLink href="/a" tone="accent">ACCENT 强调</MyuiLink>
```

## 下划线

`hover` 会先把下划线的位置占住，再把颜色打开——悬停时文字不会跳一行。

::: demo
<div class="demo-row">
<MyuiLink href="/a" underline="always">always</MyuiLink>
<MyuiLink href="/a" underline="hover">hover</MyuiLink>
<MyuiLink href="/a" underline="none">none</MyuiLink>
</div>
:::

```vue
<MyuiLink href="/a" underline="hover">hover</MyuiLink>
```

::: warning
正文里请用 `underline="always"` 或 `tone="accent"`。`ink` + `hover` 的链接在静止时和正文长得一样，鼠标没移上来之前，没人知道它能点。
:::

::: demo
<p style="max-width:56ch; margin:0; font-size:var(--myui-text-md); line-height:var(--myui-leading-relaxed); color:var(--myui-color-ink-soft)">
这一季的灵感来自
<MyuiLink href="/drops/2026" underline="always">凌晨三点的夜市</MyuiLink>
，配色取自
<MyuiLink href="https://example.com/neon" tone="accent" external>霓虹灯牌</MyuiLink>
。
</p>
:::

```vue
<MyuiLink href="/drops/2026" underline="always">凌晨三点的夜市</MyuiLink>
<MyuiLink href="https://example.com/neon" tone="accent" external>霓虹灯牌</MyuiLink>
```

## 外链

`external` 或者一个绝对 `http(s)` 地址都会触发：新标签页、安全的 `rel`、尾部箭头。

::: demo
<div class="demo-row">
<MyuiLink href="https://github.com/zhang1024899756/mango-ui" external>去 GitHub 看源码</MyuiLink>
<MyuiLink href="https://example.com/neon" tone="accent">绝对地址也会自动识别</MyuiLink>
</div>
:::

```vue
<MyuiLink href="https://github.com/zhang1024899756/mango-ui" external>去 GitHub 看源码</MyuiLink>
```

## 禁用

`disabled` 之后：`href` 被摘掉、`tabindex="-1"`、`aria-disabled="true"`，点击的默认行为被拦下，`click` 事件也不会发出。不是"变灰了但还能点"。

::: demo
<div class="demo-row">
<MyuiLink href="/a" disabled>这条链接已失效</MyuiLink>
<MyuiLink href="/a" disabled tone="accent">这条也是</MyuiLink>
</div>
:::

```vue
<MyuiLink href="/a" disabled>这条链接已失效</MyuiLink>
```

## 后缀插槽

数字、角标、小标签都往后缀里塞，不要拼进文案。

::: demo
<div class="demo-row">
<MyuiLink href="/drops">
联名系列
<template #suffix><span aria-hidden="true">↗ 12</span></template>
</MyuiLink>
</div>
:::

```vue
<MyuiLink href="/drops">
  联名系列
  <template #suffix><span aria-hidden="true">↗ 12</span></template>
</MyuiLink>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `href` | `string` | `undefined` | 目标地址 |
| `tone` | `'ink' \| 'accent' \| 'muted'` | `'ink'` | 文字颜色 |
| `underline` | `'always' \| 'hover' \| 'none'` | `'hover'` | 下划线出现的时机 |
| `external` | `boolean` | `false` | 外链：自动 `target` + `rel` + 箭头 |
| `disabled` | `boolean` | `false` | 拦截跳转与点击 |
| `target` | `string` | `undefined` | 覆盖自动的 `_blank` |
| `rel` | `string` | `undefined` | 覆盖自动的 `noreferrer noopener` |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 链接文字 |
| `suffix` | 文字后面的附加内容 |

## 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `click` | `MouseEvent` | 可点击时触发；禁用时不触发 |

## 可访问性

真 `<a>`，键盘可达，焦点环是统一的 3px 强调色。禁用态同时摘掉 `href` 和 `tabindex`，并把 `aria-disabled` 报给读屏——行为、语义、样式三件事一起变，而不是只把颜色调浅。
