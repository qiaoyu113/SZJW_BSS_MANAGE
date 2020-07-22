<template>
  <div class="RoleTree">
    <el-row>
      <el-col
        :span="24"
        class="tree"
      >
        <el-tree
          ref="roleTree"
          :default-expand-all="defaultExpandAll"
          :show-checkbox="showCheckbox"
          :data="data"
          :node-key="nodeKey"
          :expand-on-click-node="true"
          v-bind="$attrs"
          v-on="$listeners"
        >
          <template slot-scope="{node, data}">
            <div :class="'custom-tree-node ' + `tree-leave-${node.level}`">
              <slot
                :node="node"
                :data="data"
              />
            </div>
          </template>
        </el-tree>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'RoleTree',
  components: {}
})
export default class extends Vue {
  @Prop({ required: true }) private data: any; // 展示数据
  @Prop({ default: 'id' }) private nodeKey!: string;
  @Prop({ default: false }) private showCheckbox!: boolean;
  @Prop({ default: true }) private defaultExpandAll!: boolean;
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>

<style lang="scss" scoped>
.RoleTree {
  padding-bottom: 20px;
  .tree {
    overflow-x: auto;
    overflow-y: hidden;
  }
  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }
}

.custom-tree-node {
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
  >span{
    display: block;
  }
  span {
    margin-right: 20px;
  }
}
</style>
<style scoped>
.RoleTree >>> .el-tree-node__content {
  height: 32px;
}
</style>
