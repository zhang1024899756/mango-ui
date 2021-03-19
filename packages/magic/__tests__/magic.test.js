import { shallowMount  } from '@vue/test-utils'
import Element from '../src/Magic.vue'

describe('Magic', () => {
    it('渲染magic组件', ()=> {
        const wrapper = shallowMount(Element)

        expect(wrapper).toBeDefined()
    })
})