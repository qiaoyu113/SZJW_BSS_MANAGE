<template>
  <div class="TransportItem">
    <el-col
      v-if="isPC"
      :span="span"
    >
      <slot />
    </el-col>
    <el-col
      v-else
      :span="24"
    >
      <slot />
    </el-col>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
  @Component({
    name: 'TransportItem',
    components: {}
  })

export default class extends Vue {
  @Prop({ default: 8 }) private span?:number
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>
<style scoped>
.TransportItem >>>.el-form-item__content .el-input,.el-select{
  width: 100%!important;
}
</style>
