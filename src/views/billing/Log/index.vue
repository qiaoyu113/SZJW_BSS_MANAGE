<template>
  <div
    class="logContainer"
    :class="{
      p15: isPC,
      m15: isPC
    }"
  >
    1
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import { SettingsModule } from '@/store/modules/settings'
@Component
export default class extends Vue {
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>
<style lang="scss" scoped>
  .m15 {
     margin: 15px;
  }
  .logContainer {
    background: #ffffff;
    border-radius: 8px;
  }
</style>
