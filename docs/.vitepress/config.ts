import container from 'markdown-it-container'
import { defineConfig } from 'vitepress'

/**
 * The docs are published to GitHub Pages as a *project* site, so they live at
 * https://zhang1024899756.github.io/mango-ui/ instead of the domain root.
 * `base` therefore has to be the repo name, and every hand-written absolute
 * URL in the markdown/config must go through `withBase()` — VitePress only
 * rewrites the links it generates itself (nav, sidebar, assets), not the raw
 * HTML we author inside a page.
 *
 * Override with DOCS_BASE=/ when you want to serve from the root (e.g. a
 * custom domain, or a preview behind a different path).
 */
const base = (process.env.DOCS_BASE ?? '/mango-ui/').replace(/\/?$/, '/')

export default defineConfig({
  title: 'Mango UI',
  description:
    'Mango UI v2 — 一套赛博朋克 · 数字穿越风格的 Vue 3 组件库。特效组件可包裹任意内容，元素组件自带霓虹界面。',
  lang: 'zh-CN',
  base,
  appearance: 'dark',
  cleanUrls: true,
  sitemap: { hostname: 'https://zhang1024899756.github.io/mango-ui/' },
  head: [
    ['link', { rel: 'stylesheet', href: `${base}fonts.css` }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    // Matches --myui-color-bg so mobile browser chrome melts into the page.
    ['meta', { name: 'theme-color', content: '#05070d' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'Mango UI — 赛博朋克 · 数字穿越的 Vue 3 组件库' }],
    [
      'meta',
      {
        name: 'og:description',
        content: '特效组件可包裹任意内容，元素组件自带霓虹界面。为潮流门户而生，不是后台管理系统。',
      },
    ],
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: { silenceDeprecations: ['legacy-js-api', 'import'] },
      },
    },
  },
  markdown: {
    config(md) {
      // ::::
      // Custom live-demo container used by every component page.
      // VitePress only ships tip/info/warning/danger/details, so `demo` has to
      // be registered here; without it the fences render as literal text.
      md.use(container, 'demo', {
        render(tokens: { nesting: number }[], idx: number) {
          return tokens[idx]?.nesting === 1
            ? '<div class="custom-block demo"><span class="demo-tag" aria-hidden="true">DEMO</span>\n'
            : '</div>\n'
        },
      })
    },
    theme: { light: 'github-light', dark: 'github-dark' },
  },
  themeConfig: {
    logo: undefined,
    siteTitle: 'MANGO UI',
    // Local search: no external service, works offline and on Pages.
    search: { provider: 'local' },
    nav: [
      { text: '指南', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: '元素组件', link: '/components/button', activeMatch: '/components/' },
      { text: '特效组件', link: '/components/neon', activeMatch: '/components/(neon|flotage)' },
      {
        text: 'v2.1.0',
        items: [
          {
            text: '更新日志',
            link: 'https://github.com/zhang1024899756/mango-ui/releases',
          },
          { text: 'GitHub 仓库', link: 'https://github.com/zhang1024899756/mango-ui' },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '快速上手', link: '/guide/getting-started' },
            { text: '主题与令牌', link: '/guide/theming' },
            { text: '设计原则', link: '/guide/design-principles' },
          ],
        },
      ],
      '/components/': [
        {
          text: '元素组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Icon 图标', link: '/components/icon' },
            { text: 'Link 链接', link: '/components/link' },
            { text: 'Image 图片', link: '/components/image' },
            { text: 'Number 数值', link: '/components/number' },
            { text: 'Text 文字', link: '/components/text' },
            { text: 'Tag 标签', link: '/components/tag' },
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Switch 开关', link: '/components/switch' },
            { text: 'Slider 滑动条', link: '/components/slider' },
            { text: 'Dialog 对话框', link: '/components/dialog' },
            { text: 'Progress 进度条', link: '/components/progress' },
          ],
        },
        {
          text: '特效组件',
          items: [
            { text: 'Neon 霓虹特效', link: '/components/neon' },
            { text: 'Flotage 漂浮特效', link: '/components/flotage' },
          ],
        },
      ],
    },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/zhang1024899756/mango-ui' }],
    footer: {
      message: 'MIT Licensed · 为赛博朋克门户而生',
      copyright: 'Copyright © 2026 zhang1024899756',
    },
  },
})
