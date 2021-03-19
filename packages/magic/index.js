import Magic from './src/magic.vue'

Magic.install = Vue => {
  Vue.component(Magic.name, Magic)
}

export default Magic