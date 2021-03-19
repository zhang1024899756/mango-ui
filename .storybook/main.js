const path = require('path')
// packages 文件夹路径
const root = path.resolve(__dirname, '../')

module.exports = {
  "stories": [
    "../packages/**/*.stories.js"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: root
    })
    return config
  }
}