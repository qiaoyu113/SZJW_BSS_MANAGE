<template>
  <div id="open-new">
    <svg-icon
      :name="openNew ? 'newTab' : 'onlyTab'"
      @click="click"
    />
  </div>
</template>

<script lang="ts">
import screenfull from 'screenfull'
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'OpenNew',
  components: {
  }
})
export default class extends Vue {
  private show = false

  get openNew() {
    return SettingsModule.openNew
  }

  set openNew(value) {
    SettingsModule.ChangeOpenNew({ key: 'openNew', value })
  }

  private change() {
    this.show = !this.show
  }

  private click() {
    this.openNew = !this.openNew
  }
}
</script>

<style lang="scss">
#open-new{
    i{
        font-weight: bold;
        font-size: 18px;
    }
}
</style>
