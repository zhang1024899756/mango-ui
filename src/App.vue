<template>
  <div class="demo-wrap">
    <h4>按钮组件</h4>
    <div class="demo-p">
      <mo-button>默认按钮</mo-button>
      <mo-button type='primary'>主题按钮</mo-button>
      <mo-button type='success'>成功按钮</mo-button>
      <mo-button type='warning'>警告按钮</mo-button>
      <mo-button type='danger'>危险按钮</mo-button>
      <mo-button type='default'>默认按钮</mo-button>
      <mo-button disabled size="hg">大型按钮</mo-button>
      <mo-button size="lg">中型按钮</mo-button>
      <mo-button size="sm">小型按钮</mo-button>
      <mo-button size="mini">迷你按钮</mo-button>
      <mo-button disabled type='primary'>禁用按钮</mo-button>
      <mo-button loading type='primary'>加载按钮</mo-button>
    </div>
    <div class="demo-p">
      <mo-button type='line'>线框按钮1</mo-button>
      <mo-button type='line-right-dwon'>线框按钮2</mo-button>
      <mo-button type='line-around'>线框按钮3</mo-button>
    </div>
    <h4>图标</h4>
    <div class="demo-p">
      <mo-icon icon="user-secret" size="3x" theme="success"  />
      <mo-icon icon="spinner" size="3x" spin />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import MoButton from './components/Button/index.vue'
import MoIcon from './components/Icon/index.vue'

@Options({
  components: {
    MoButton, MoIcon
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
.demo-wrap{
  padding: 10px;
  .demo-p{
  padding: 10px;
  > * {
    margin-right: 10px;
  }
}
}

</style>
