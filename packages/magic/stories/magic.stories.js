import Magic from '../src/magic.vue'

export default {
  title: 'Magic',
  component: Magic
}

export const _Magic = _ => ({
  components: { Magic },
  template: `
    <div style="background: #000; padding: 80px;height:400px;">
      <magic content="有趣、好玩是一种力量"></magic>
    </div>
  `
})