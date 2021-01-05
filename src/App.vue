<template>
  <div class="demo-wrap">
    <!-- <h4>按钮组件</h4>
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
    </div> -->
    <h4>输入框/文本域</h4>
    <div class="demo-p">
      <mo-input type="text" placeholder="请输入信息1" v-model="input" @clear="handleClear" clearable>
        <!-- <template v-slot:suffix>dd</template> -->
      </mo-input>
      <mo-input type="text" placeholder="请输入信息" size="large"></mo-input>
      <mo-input type="text" placeholder="请输入信息" size="small"></mo-input>
    </div>
    <div class="demo-p">
      <mo-input type="textarea" placeholder="请输入信息"></mo-input>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import MoButton from './components/Button/index.vue'
import MoIcon from './components/Icon/index.vue'
import MoInput from './components/Input/index.vue'

@Options({
  components: {
    MoButton, MoIcon, MoInput
  },
  data () {
    return {
      input: ''
    }
  },
  methods: {
    handleClear () {
      console.log('handleClear')
      this.input = ''
    }
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
