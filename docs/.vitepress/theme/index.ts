import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import MangoUI from '../../../src'
import './custom.css'

/**
 * VitePress toggles dark mode with a `.dark` class on <html>, while Mango UI
 * keys its tokens off [data-myui-theme]. Mirror one onto the other so the
 * components inside the docs follow the site toggle.
 */
function syncLibraryTheme(): void {
  const root = document.documentElement
  const apply = (): void => {
    root.dataset.myuiTheme = root.classList.contains('dark') ? 'dark' : 'light'
  }

  apply()
  new MutationObserver(apply).observe(root, {
    attributes: true,
    attributeFilter: ['class'],
  })
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Every component is globally registered, so docs pages can use
    // <MyuiButton /> directly with no imports.
    app.use(MangoUI)

    if (typeof window !== 'undefined') {
      syncLibraryTheme()
    }
  },
} satisfies Theme
