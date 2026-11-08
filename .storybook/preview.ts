import type { Preview } from '@storybook/vue3-vite'
import '../src/styles/index.scss'
import '../docs/public/fonts.css'
import './storybook.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      expanded: true,
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    docs: { toc: true },
    a11y: { test: 'todo' },
    options: {
      storySort: {
        order: ['Intro', 'Elements', 'Effects', ['*']],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Mango UI theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light — paper' },
          { value: 'dark', title: 'Dark — night edition' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (_story, context) => ({
      setup: () => ({ theme: (context.globals.theme as string) ?? 'light' }),
      template: `<div class="sb-canvas" :data-myui-theme="theme"><div class="sb-canvas__inner"><story /></div></div>`,
    }),
  ],
}

export default preview
