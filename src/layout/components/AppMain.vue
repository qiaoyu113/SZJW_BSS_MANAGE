<template>
  <section class="app-main">
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

  created() {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.isPC = false
    } else {
      this.isPC = true
    }
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
