import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  staticDirs: ['../docs/public'],
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-links'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
}

export default config
