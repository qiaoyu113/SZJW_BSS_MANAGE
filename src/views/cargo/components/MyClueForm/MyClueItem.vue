<template>
  <div class="MyClueItem">
    <template v-if="isPC">
      <slot />
    </template>
    <el-col
      v-else
      :span="24"
    >
      <slot />
    </el-col>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
@Component({
  name: 'MyClueItem'
})
export default class MyClueItem extends Vue {
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>

<style scoped>
.MyClueItem{
  width: 100%;
  display: inline-block;
}
.MyClueItem >>> .el-select{
  width: 178px;
}
.MyClueItem >>> .el-date-editor{
  width: 250px;
}
</style>
