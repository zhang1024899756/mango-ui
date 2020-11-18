<template>
  <div>
    <h4>按钮组件</h4>
    <div class="demo-p">
      <Button>默认按钮</Button>
      <Button type='primary'>默认按钮</Button>
      <Button type='success'>默认按钮</Button>
      <Button type='warning'>默认按钮</Button>
      <Button type='danger'>默认按钮</Button>
      <Button type='default'>默认按钮</Button>
      <Button size="hg">大型按钮</Button>
      <Button size="lg">中型按钮</Button>
      <Button size="sm">小型按钮</Button>
      <Button size="mini">迷你按钮</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Button from './components/Button/index.vue'

@Options({
  components: {
    Button
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
.demo-p{
  padding: 10px;
  > * {
    margin-right: 10px;
  }
}
</style>
