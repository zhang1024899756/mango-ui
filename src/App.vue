<template>
  <div>
    <h4>按钮组件</h4>
    <div class="demo-p">
      <Button>默认按钮</Button>
      <Button type='primary'>主题按钮</Button>
      <Button type='success'>成功按钮</Button>
      <Button type='warning'>警告按钮</Button>
      <Button type='danger'>危险按钮</Button>
      <Button type='default'>默认按钮</Button>
      <Button disabled size="hg">大型按钮</Button>
      <Button size="lg">中型按钮</Button>
      <Button size="sm">小型按钮</Button>
      <Button size="mini">迷你按钮</Button>
      <Button disabled type='primary'>禁用按钮</Button>
      <Button loading type='primary'>加载按钮</Button>
    </div>
    <div class="demo-p">
      <Button type='border-1'>线框按钮1</Button>
      <Button type='border-2'>线框按钮2</Button>
      <Button type='border-3'>线框按钮3</Button>
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
