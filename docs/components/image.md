---
title: Image 图片
description: 先有框，再有像素。比例写在容器上，加载时页面不会跳。
---

# Image 图片

先有框，再有像素。比例挂在容器上，所以骨架、图片、错误块占的是同一个盒子——图什么时候到，页面都不会抖一下。

两个状态都给了设计：加载时是硬边斜纹加一条扫过的强调色带，失败时是一块带 `IMAGE LOST` 的占位（`#error` 插槽可以整个换掉）。

<script setup>
const poster = `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20800%20600'%3E%3Crect%20width%3D'800'%20height%3D'600'%20fill%3D'%23ff4d1a'%2F%3E%3Crect%20x%3D'48'%20y%3D'48'%20width%3D'704'%20height%3D'504'%20fill%3D'none'%20stroke%3D'%23101012'%20stroke-width%3D'6'%2F%3E%3Cg%20fill%3D'%23101012'%20font-family%3D'Arial%20Black%2C%20Arial%2C%20sans-serif'%20font-weight%3D'900'%20letter-spacing%3D'-6'%3E%3Ctext%20x%3D'80'%20y%3D'290'%20font-size%3D'132'%3EMANGO%3C%2Ftext%3E%3Ctext%20x%3D'82'%20y%3D'420'%20font-size%3D'132'%3EUI%3C%2Ftext%3E%3C%2Fg%3E%3Crect%20x%3D'80'%20y%3D'470'%20width%3D'300'%20height%3D'16'%20fill%3D'%23101012'%2F%3E%3Ccircle%20cx%3D'660'%20cy%3D'480'%20r%3D'48'%20fill%3D'%23101012'%2F%3E%3C%2Fsvg%3E`
const broken = 'data:image/png;base64,AAAA'
</script>

## 基础用法

::: demo
<div style="width:340px">
<MyuiImage :src="poster" alt="Mango UI 海报" />
</div>
:::

```vue
<MyuiImage src="/poster.png" alt="Mango UI 海报" />
```

## 比例

`ratio` 收任意 `宽:高`。文档里的图是一张内联 SVG，不联网也能看见。

::: demo
<div style="display:flex; gap:var(--myui-space-4); align-items:flex-start; width:100%">
<div style="width:220px"><MyuiImage :src="poster" alt="16:9" ratio="16:9" /></div>
<div style="width:160px"><MyuiImage :src="poster" alt="1:1" ratio="1:1" /></div>
<div style="width:200px"><MyuiImage :src="poster" alt="4:3" ratio="4:3" /></div>
</div>
:::

```vue
<MyuiImage src="/poster.png" ratio="16:9" alt="16:9" />
<MyuiImage src="/poster.png" ratio="1:1" alt="1:1" />
```

## 填充方式

`cover` 是默认，`contain` 用来看整张图。

::: demo
<div style="display:flex; gap:var(--myui-space-4); align-items:flex-start; width:100%">
<div style="width:220px"><MyuiImage :src="poster" alt="cover" fit="cover" /></div>
<div style="width:220px"><MyuiImage :src="poster" alt="contain" fit="contain" /></div>
</div>
:::

```vue
<MyuiImage src="/poster.png" alt="contain" fit="contain" />
```

## 边框与圆角

边框是系统的 2px 墨线，默认开着；圆角只提供 `none` 和 `pill` 两档。

::: demo
<div style="display:flex; gap:var(--myui-space-4); align-items:flex-start; width:100%">
<div style="width:200px"><MyuiImage :src="poster" alt="无边框" :border="false" /></div>
<div style="width:200px"><MyuiImage :src="poster" alt="胶囊" radius="pill" /></div>
</div>
:::

```vue
<MyuiImage src="/poster.png" alt="胶囊" radius="pill" />
```

## 加载中

还没拿到 `src` 时保持骨架：比例已经占好，图到了不会把下面的内容顶开。

::: demo
<div style="width:320px">
<MyuiImage alt="等待一张图" />
</div>
:::

```vue
<MyuiImage alt="等待一张图" />
```

## 加载失败

解码失败才会进错误态。默认占位可以整个替换。

::: demo
<div style="display:flex; gap:var(--myui-space-4); align-items:flex-start; width:100%">
<div style="width:240px"><MyuiImage :src="broken" alt="坏图" /></div>
<div style="width:240px">
<MyuiImage :src="broken" alt="坏图">
<template #error>
<div style="display:flex; flex-direction:column; align-items:center; gap:var(--myui-space-2)">
<strong style="font-size:var(--myui-text-xl); letter-spacing:var(--myui-tracking-tight)">404</strong>
<span style="font-size:var(--myui-text-xs); letter-spacing:var(--myui-tracking-wide); text-transform:uppercase">这张图走丢了</span>
</div>
</template>
</MyuiImage>
</div>
</div>
:::

```vue
<MyuiImage src="/broken.png" alt="坏图">
  <template #error>
    <strong>404</strong>
  </template>
</MyuiImage>
```

## 图注

`caption` 是框下面一行小字，左边压一条强调色竖线。

::: demo
<div style="width:340px">
<MyuiImage :src="poster" alt="霓虹海报" caption="2026 春夏 · 霓虹海报系列" />
</div>
:::

```vue
<MyuiImage src="/poster.png" alt="霓虹海报" caption="2026 春夏 · 霓虹海报系列" />
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `src` | `string` | `undefined` | 图片地址；为空时停在骨架态 |
| `alt` | `string` | `''` | 替代文本，空字符串表示装饰图 |
| `ratio` | `string` | `'4:3'` | 任意 `宽:高`，例如 `'16:9'` |
| `fit` | `'cover' \| 'contain'` | `'cover'` | 图片填充方式 |
| `radius` | `'none' \| 'pill'` | `'none'` | 圆角 |
| `border` | `boolean` | `true` | 2px 墨线边框 |
| `lazy` | `boolean` | `true` | 原生 `loading="lazy"` |
| `caption` | `string` | `undefined` | 框下方图注 |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `error` | 替换默认的错误占位 |

## 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `load` | `Event` | 图片加载完成 |
| `error` | `Event` | 图片加载失败 |

## 可访问性

结构是 `figure > img + figcaption`，读屏会把图注和图连起来。`alt` 传空字符串时按装饰图处理——这是原生 `<img>` 的规则，不是这套库发明的。错误占位里的文字是纯视觉补充，图片本身失败时 `alt` 仍然在。
