<template>
  <section
    :class="isPC ? 'AppMain' : 'AppMain-m'"
    class="app-main"
  >
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TagsViewModule } from '@/store/modules/tags-view'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'AppMain'
})
export default class extends Vue {
  get cachedViews() {
    return TagsViewModule.cachedViews
  }

  get key() {
    return this.$route.path
  }

  get isPC() {
    return SettingsModule.isPC
  }

  set isPC(value) {
    SettingsModule.ChangeIsPC({ key: 'isPC', value })
  }

  get tableHeight() {
    return SettingsModule.tableHeight
  }
  set tableHeight(value) {
    SettingsModule.ChangeIsPC({ key: 'tableHeight', value })
  }

  created() {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.isPC = false
    } else {
      this.isPC = true
    }
    let otherHeight = 340 // 计算后的高度
    if (this.isPC) {
      otherHeight = 340
    } else {
      otherHeight = 300 // 移动端计算后的高度
    }
    this.tableHeight = document.body.offsetHeight - otherHeight || document.documentElement.offsetHeight - otherHeight;
    /**
     * 处理iOS 微信客户端6.7.4 键盘收起页面未下移bug
     */
    (/iphone|ipod|ipad/i.test(navigator.appVersion)) && document.addEventListener('blur', (e:any) => {
    // 这里加了个类型判断，因为a等元素也会触发blur事件
      ['input', 'textarea'].includes(e.target.localName) && document.body.scrollIntoView(false)
    }, true)
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #f8f9fa;
}

.fixed-header+.app-main {
  padding-top: 50px;
  height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>
<style lang="scss">
.AppMain{
  .el-form-item__label{
    color: #9e9e9e !important;
    font-weight: 400;
  }
}
.AppMain-m{
  .el-form-item__label {
    color: #4a4a4a!important;
    font-weight: 400;
  }
}
</style>
