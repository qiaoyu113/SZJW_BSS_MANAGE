import { DirectiveOptions } from 'vue'

export const loadmore: DirectiveOptions = {
  inserted(el, binding) {
    const { value } = binding
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
    (SELECTWRAP_DOM as Element).addEventListener('scroll', function() {
      let that = (SELECTWRAP_DOM as Element)
      const CONDITION = that.scrollHeight - that.scrollTop <= that.clientHeight
      if (CONDITION) {
        binding.value()
      }
    })
  }
}
