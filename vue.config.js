import {
  join
} from 'path'

function resolve (dir) {
  return join(__dirname, dir)
}

module.exports = {
  chainWebpack: config => {
    // @路径别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('styles', resolve('src/styles'))
      .set('components', resolve('src/components'))
  }
}
