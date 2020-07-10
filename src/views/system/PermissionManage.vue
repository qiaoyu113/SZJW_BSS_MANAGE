<template>
  <div class="PermissionManage">
    <SectionContainer title="权限管理">
      <RoleTree
        :data="data"
        :show-checkbox="true"
      >
        <template slot-scope="{node,data}">
          <span
            class="mr10"
            @click="c(node,data)"
          >{{ node.label }}</span>
          <el-badge
            type="warning"
            :value="1"
            class="mr10"
          />
          <div class="right-btn">
            <el-button
              circle
              size="mini"
              icon="el-icon-circle-plus-outline"
              @click.stop="() => {
                append(data)
              }"
            />
            <el-button
              v-if="node.level !== 1"
              circle
              size="mini"
              class="delete"
              icon="el-icon-remove-outline"
            />
            <el-button
              v-if="node.level !== 1"
              circle
              size="mini"
              icon="el-icon-edit"
            />
            <el-button
              v-if="node.level !== 1"
              circle
              size="mini"
              icon="el-icon-top"
            />
            <el-button
              v-if="node.level !== 1"
              circle
              size="mini"
              icon="el-icon-bottom"
            />
          </div>
        </template>
      </RoleTree>
    </SectionContainer>
    <Dialog
      :visible.sync="showDialog"
      :title="`新建组织`"
      :confirm="confirm"
    >
      <el-tabs
        v-model="activeName"
        class="dialog-tab"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="卫星城"
          name="first"
        >
          <el-input
            v-model="form.name1"
            placeholder="卫星城"
          />
        </el-tab-pane>
        <el-tab-pane
          label="小组"
          name="second"
        >
          <el-input
            v-model="form.name2"
            placeholder="小组"
          />
        </el-tab-pane>
      </el-tabs>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { RoleTree } from './components'
import Dialog from '@/components/Dialog/index.vue'

import '@/styles/common.scss'

@Component({
  name: 'CreateRole',
  components: {
    SectionContainer,
    RoleTree,
    Dialog
  }
})
export default class extends Vue {
  private data: any = [
    {
      id: 1,
      label: '一级 1',
      children: [
        {
          id: 4,
          label: '二级 1-1',
          children: [
            {
              id: 9,
              label: '三级 1-1-1'
            },
            {
              id: 10,
              label: '三级 1-1-2'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      label: '一级 2',
      children: [
        {
          id: 5,
          label: '二级 2-1'
        },
        {
          id: 6,
          label: '二级 2-2'
        }
      ]
    },
    {
      id: 3,
      label: '一级 3',
      children: [
        {
          id: 7,
          label: '二级 3-1'
        },
        {
          id: 8,
          label: '二级 3-2'
        }
      ]
    }
  ];
  // 弹窗
  private showDialog: boolean = false;
  private activeName: string = 'first';

  private form: any ={
    name1: '',
    name2: ''
  }
  // tree
  private newChild: any = {}
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  private append(data:any) {
    console.log(data)
    this.show()
  }
  private show() {
    this.showDialog = true
  }
  private confirm(done: any) {

  }
  // 选项卡
  handleClick(tab: any, event: any) {
    console.log(tab, event)
  }
}
</script>

<style lang="scss" scoped>
.mr10 {
  margin-right: 10px;
}
.ml10 {
  margin-left: 10px;
}
.right-btn{
  display: inline-block;
  .el-button{
    padding: 0;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: rgba(0, 0, 0,0);
    font-size: 20px;
    border-color: rgba(0,0,0,0);
    &.delete{
      &:hover {
        color: $--color-danger;
      }
    }
  }
}
</style>
<style scoped>
.PermissionManage .el-badge >>> sup{
  transform: translateY(6px)
}
</style>
