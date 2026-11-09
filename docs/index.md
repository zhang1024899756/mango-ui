---
layout: page
title: 赛博朋克 · 数字穿越的 Vue 3 组件库
---

<div class="poster">
  <div class="poster__kicker">MANGO UI / V2 — CYBERPUNK EDITION</div>

  <!--
    包的是 h1 本体（as="h1"），不是 h1 里再套一层 span：组件默认 inline-block，
    套在内部会把两行收进一个行内块，h1 的行盒和位置都会变；包在外层时 h1 仍是块级、
    __content 也还原成块级，行盒 / 字号 / 外边距一个字没动（1440px 与 390px 实测矩形完全一致）。
    motion-preference="always" 与下面三张特效卡一致：这一页的效果本身就是内容。
  -->
  <MyuiGlitchRipple
    as="h1"
    class="poster__title"
    intensity="normal"
    speed="normal"
    motion-preference="always"
  >
    赛博芒果<br />
    穿越<em>未来</em>
  </MyuiGlitchRipple>

  <p class="poster__lead">
    两套装备：能<strong>包裹任何东西</strong>的特效组件——霓虹灯管、失重漂浮、光带扫过；
    和自带霓虹界面的元素组件，从排印到控件都是同一套深空语言。为赛博朋克门户、数字艺术站、
    未来科技产品而生，而不是后台管理系统。
  </p>

  <div class="poster__actions">
    <MyuiButton size="lg" :href="withBase('/guide/getting-started')">开始使用</MyuiButton>
    <MyuiButton variant="outline" size="lg" tone="ink" :href="withBase('/guide/design-principles')">设计原则</MyuiButton>
  </div>

  <div class="poster__band">
    <a class="poster__card" :href="withBase('/components/neon')">
      <div class="poster__card-title">特效组件</div>
      <div class="poster__card-desc">
        <code>Neon</code> 霓虹灯管、<code>Flotage</code> 失重漂浮、<code>GlitchRipple</code> 故障波纹。
        套在按钮、图片、整块卡片外面就能生效。
      </div>
    </a>
    <a class="poster__card" :href="withBase('/components/text')">
      <div class="poster__card-title">元素组件</div>
      <div class="poster__card-desc">
        文字、按钮、图标、链接、图片、数值、标签、输入框、开关、滑动条、对话框、进度条。
      </div>
    </a>
    <a class="poster__card" :href="withBase('/guide/theming')">
      <div class="poster__card-title">CSS 变量主题</div>
      <div class="poster__card-desc">
        深空底色、霓虹发丝线、辉光与间距全是 CSS 变量。换一组值就换一个站点人格。
      </div>
    </a>
    <a class="poster__card" :href="withBase('/guide/getting-started')">
      <div class="poster__card-title">零运行时依赖</div>
      <div class="poster__card-desc">
        Vue 是唯一的 peer 依赖。没有 lodash，没有 CSS-in-JS，没有图标字体。
      </div>
    </a>
  </div>

  <div class="poster__section">
    <h2 class="poster__section-title">特效 · 实机</h2>
    <div class="poster__band">
      <div class="poster__card">
        <div class="poster__card-title">Neon</div>
        <div class="poster__fx">
          <MyuiNeon :intensity="0.7" motion-preference="always">
            <span class="poster__fx-word">NEON</span>
          </MyuiNeon>
        </div>
        <div class="poster__card-desc">灯管辉光 + 呼吸。`glow` / `flicker` / `scan`。</div>
      </div>
      <div class="poster__card">
        <div class="poster__card-title">Flotage</div>
        <div class="poster__fx">
          <MyuiFlotage :amplitude="20" :duration="5" motion-preference="always">
            <MyuiTag variant="solid" tone="accent" size="md">SS26 LOOKBOOK</MyuiTag>
          </MyuiFlotage>
        </div>
        <div class="poster__card-desc">持续失重，可轴向、可 hover 触发、可关闭。</div>
      </div>
      <div class="poster__card">
        <div class="poster__card-title">GlitchRipple</div>
        <div class="poster__fx">
          <MyuiGlitchRipple intensity="normal" motion-preference="always">
            <span class="poster__fx-word">SIGNAL</span>
          </MyuiGlitchRipple>
        </div>
        <div class="poster__card-desc">信号守不住的波纹：噪声场把内容逐像素位移，水平条带缓缓流过。</div>
      </div>
      <div class="poster__card">
        <div class="poster__card-title">组合</div>
        <div class="poster__fx">
          <MyuiFlotage :amplitude="12" :duration="3.2" motion-preference="always">
            <MyuiNeon mode="flicker" :intensity="0.55" motion-preference="always">
              <MyuiButton size="lg">限量发售</MyuiButton>
            </MyuiNeon>
          </MyuiFlotage>
        </div>
        <div class="poster__card-desc">特效可以互相嵌套，也可以包住别的组件。</div>
      </div>
    </div>
  </div>

  <div class="poster__section">
    <h2 class="poster__section-title">元素 · 实机</h2>
    <div class="poster__stage">
      <div class="poster__stage-row">
        <MyuiText variant="display" size="2xl" weight="black">CYBER</MyuiText>
        <MyuiText variant="eyebrow" tone="accent">SS26 / NIGHT MARKET</MyuiText>
        <MyuiText variant="mono" tone="soft">LOT 0042</MyuiText>
        <MyuiText variant="display" size="lg" glow>穿越未来</MyuiText>
      </div>
      <div class="poster__stage-row">
        <MyuiButton>立即抢购</MyuiButton>
        <MyuiButton variant="outline" tone="ink">
          加入收藏
          <template #suffix><MyuiIcon name="heart" /></template>
        </MyuiButton>
        <MyuiButton variant="ghost" tone="accent">GHOST</MyuiButton>
        <MyuiButton variant="text">TEXT LINK</MyuiButton>
      </div>
      <div class="poster__stage-row">
        <MyuiButton skew>斜切按钮</MyuiButton>
        <MyuiButton tone="spectrum" skew>斜切 + 渐变</MyuiButton>
        <MyuiTag tone="spectrum" variant="solid" skew>SPECTRUM</MyuiTag>
        <MyuiTag tone="spectrum">GRADIENT</MyuiTag>
        <MyuiProgress :percent="58" tone="spectrum" skew label="渐变进度" style="max-width: 220px" />
      </div>
      <div class="poster__stage-row">
        <MyuiTag variant="solid" tone="accent">NEW DROP</MyuiTag>
        <MyuiTag variant="outline" tone="success">已上架</MyuiTag>
        <MyuiTag variant="ghost" tone="info" closable>联名</MyuiTag>
        <MyuiTag active>全部</MyuiTag>
      </div>
      <div class="poster__stage-row">
        <MyuiNumber :value="128400" prefix="¥" suffix="+" trend="up" animated />
        <MyuiNumber :value="62" suffix="%" size="lg" tone="accent" />
        <MyuiProgress :percent="72" label="进度" style="max-width: 260px" />
      </div>
      <div class="poster__stage-row">
        <MyuiSwitch v-model="switched" active-text="ON" inactive-text="OFF" />
        <MyuiSlider v-model="volume" :min="0" :max="100" style="width: 200px" />
        <MyuiInput v-model="email" placeholder="订阅发售提醒" clearable style="max-width: 240px" />
        <MyuiIcon name="sparkle" size="lg" />
        <MyuiIcon name="star" size="lg" spin />
      </div>
      <div class="poster__stage-row">
        <MyuiButton @click="dialog = true">打开对话框</MyuiButton>
        <MyuiLink href="https://github.com/zhang1024899756/mango-ui" external>GitHub 仓库</MyuiLink>
        <MyuiImage
          src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='200'%3E%3Crect width='160' height='200' fill='%230a0f18'/%3E%3Crect x='12' y='12' width='136' height='176' fill='none' stroke='%2319e0ff' stroke-width='2'/%3E%3Ctext x='80' y='106' fill='%23dbe9f4' font-family='sans-serif' font-size='14' font-weight='bold' text-anchor='middle'%3ESS26%3C/text%3E%3C/svg%3E"
          ratio="4:5"
          caption="SS26 LOOKBOOK"
          style="width: 120px"
        />
      </div>
    </div>
    <MyuiDialog v-model="dialog" title="加入俱乐部" :show-footer="true" ok-text="确认加入" cancel-text="再想想">
      <p>限量联名即将发售。加入俱乐部可以提前 24 小时进入排队，名额有限且不会追加。</p>
    </MyuiDialog>
  </div>

  <div class="poster__section">
    <h2 class="poster__section-title">组件清单</h2>
    <div class="poster__grid">
      <a :href="withBase('/components/neon')">Neon 霓虹特效<span>effect</span></a>
      <a :href="withBase('/components/flotage')">Flotage 漂浮特效<span>effect</span></a>
      <a :href="withBase('/components/button')">Button 按钮<span>element</span></a>
      <a :href="withBase('/components/icon')">Icon 图标<span>element</span></a>
      <a :href="withBase('/components/link')">Link 链接<span>element</span></a>
      <a :href="withBase('/components/image')">Image 图片<span>element</span></a>
      <a :href="withBase('/components/number')">Number 数值<span>element</span></a>
      <a :href="withBase('/components/text')">Text 文字<span>element</span></a>
      <a :href="withBase('/components/tag')">Tag 标签<span>element</span></a>
      <a :href="withBase('/components/input')">Input 输入框<span>element</span></a>
      <a :href="withBase('/components/switch')">Switch 开关<span>element</span></a>
      <a :href="withBase('/components/slider')">Slider 滑动条<span>element</span></a>
      <a :href="withBase('/components/dialog')">Dialog 对话框<span>element</span></a>
      <a :href="withBase('/components/progress')">Progress 进度条<span>element</span></a>
    </div>
  </div>

  <div class="poster__section">
    <h2 class="poster__section-title">视觉协议</h2>
    <p class="poster__lead">
      深空近黑打底、1px 霓虹发丝线、<strong>只有一个</strong>电光青作为行动色，
      品红只做信号。辉光即层级、圆角为零、动效短促不发弹。
      彩色是<strong>形体</strong>而不是底色：<code>tone="spectrum"</code> 与 <code>skew</code>
      是可选的表达层，一次只让一个元素说话。
      所有数值都是 CSS 变量；系统开了「减弱动态效果」时动画会停下，
      但霓虹的静态辉光留着 —— 特效不会变成一片普通内容。
    </p>
  </div>
</div>

<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'

const switched = ref(true)
const volume = ref(64)
const email = ref('')
const dialog = ref(false)
</script>
