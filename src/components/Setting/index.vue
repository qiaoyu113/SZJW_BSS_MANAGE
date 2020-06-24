<template>
  <div id="setting">
    <svg-icon
      class="el-icon-setting"
      name="set"
      @click="click"
    />
    <right-panel
      v-if="showSettings"
      ref="rightPanel"
    >
      <settings />
    </right-panel>
  </div>
</template>

<script lang="ts">
import screenfull from 'screenfull'
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import RightPanel from '@/components/RightPanel/index.vue'
import Settings from '../../layout/components/Settings/index.vue'

@Component({
  name: 'Setting',
  components: {
    RightPanel,
    Settings
  }
})
export default class extends Vue {
  private show = false

  get showSettings() {
    return SettingsModule.showSettings
  }

  private change() {
    this.show = !this.show
  }

  private click() {
    this.change()
    const ref: any = this.$refs['rightPanel']
    ref.show = true
  }
}
</script>

<style lang="scss">
#setting{
    i{
        font-weight: bold;
        font-size: 18px;
    }
}
</style>
