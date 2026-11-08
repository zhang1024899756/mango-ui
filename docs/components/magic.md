---
title: Magic 已更名为 Neon
sidebar: false
outline: false
search: false
---

<script setup>
import { onMounted } from 'vue'
import { withBase } from 'vitepress'

// The component kept its job and lost its name. Old bookmarks and links land
// here instead of a 404, which is the least a rename should do.
onMounted(() => {
  window.location.replace(withBase('/components/neon'))
})
</script>

# Magic 已更名为 Neon

它一直做的是霓虹灯管，名字却叫故障。v2.1 起改名为 **Neon 霓虹特效**：
还是那个能包裹任意内容的壳，但按霓虹重做——静态就有辉光，动画只是叠加。

`glitch` 模式（RGB 分离副本）随重命名移除，现在是 `glow` / `flicker` / `scan`。

<a :href="withBase('/components/neon')" class="demo-toggle">前往 Neon 霓虹特效 →</a>
