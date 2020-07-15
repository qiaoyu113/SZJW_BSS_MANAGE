<template>
  <div class="OrganizationManagement">
    <SectionContainer
      v-loading="loading"
      title="组织管理"
    >
      <RoleTree
        :data="data"
        :props="defaultProps"
      >
        <template slot-scope="{node,data}">
          <svg-icon
            class="tree-icon"
            :name="'type_'+data.type"
          />
          <span
            class="mr10"
          >{{ node.label }}</span>
          <el-badge
            type="warning"
            :value="data.userCount"
            class="mr10"
          />
          <div class="right-btn">
            <el-button
              v-if="data.type !== 5"
              circle
              size="mini"
              icon="el-icon-circle-plus-outline"
              @click.stop="() => {
                appendOffice(node,data)
              }"
            />
            <el-button
              v-if="data.type !== 1"
              circle
              size="mini"
              class="delete"
              icon="el-icon-remove-outline"
              @click.stop="() => {
                deleteOffice(node,data)
              }"
            />
            <el-button
              v-if="data.type !== 1"
              circle
              size="mini"
              icon="el-icon-edit"
              @click.stop="() => {
                updateOffice(node,data)
              }"
            />
            <el-button
              v-if="data.type !== 1"
              circle
              size="mini"
              icon="el-icon-top"
              @click.stop="() => {
                upOffice(node,data)
              }"
            />
            <el-button
              v-if="data.type !== 1"
              circle
              size="mini"
              icon="el-icon-bottom"
              @click.stop="() => {
                downOffice(node,data)
              }"
            />
          </div>
        </template>
      </RoleTree>
    </SectionContainer>
    <Dialog
      :visible.sync="showDialog"
      :title="dialogTit"
      :confirm="confirm"
      @closed="resetDialog"
    >
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="dialogForm"
        label-width="80px"
      >
        <el-tabs
          v-if="addData.type === 3 && isAdd"
          v-model="activeName"
          class="dialog-tab"
        >
          <el-tab-pane
            label="卫星城"
            name="first"
          >
            <el-form-item
              v-if="activeName === 'first'"
              label="组织名称"
              prop="name"
            >
              <el-input
                v-model="dialogForm.name"
                placeholder="请输入2-10位中文"
                maxlength="10"
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="小组"
            name="second"
          >
            <el-form-item
              v-if="activeName === 'second'"
              label="组织名称"
              prop="name"
            >
              <el-input
                v-model="dialogForm.name"
                placeholder="请输入2-10位中文"
                maxlength="10"
              />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-form-item
          v-else
          label="组织名称"
          prop="name"
        >
          <el-input
            v-model="dialogForm.name"
            placeholder="请输入2-10位中文"
            maxlength="10"
          />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { RoleTree } from './components'
import Dialog from '@/components/Dialog/index.vue'
import { getOfficeList, createOffice, deleteOffice, sortOffice, updateOffice } from '@/api/system'

import '@/styles/common.scss'
import { off } from 'codemirror'

@Component({
  name: 'CreateRole',
  components: {
    SectionContainer,
    RoleTree,
    Dialog
  }
})
export default class extends Vue {
  private loading: boolean = false;
  private data: any = [];
  private defaultProps: any = {
    children: 'officeVOs',
    label: 'name'
  };
  private addNode: any = {};
  private addData: any = {};

  // 弹窗
  private showDialog: boolean = false;
  private activeName: string = 'first';
  private dialogTit: string = '新建组织'
  private dialogForm: any = {
    'name': '',
    'parentId': 0,
    'parentIds': '',
    'type': 0
  }
  private rules: any = {
    name: [
      { required: true, message: '请输入组织名称', trigger: 'blur' },
      { pattern: /^(?:[\u4e00-\u9fa5·]{2,10})$/, message: '请输入2-10个中文', trigger: 'blur' }
    ]
  }
  private isAdd: boolean = false;
  private disabled: boolean = false;
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  private appendOffice(node: any, data:any) {
    this.addNode = node
    this.addData = data
    this.dialogTit = '新建组织'
    this.isAdd = true
    this.showDialog = true
  }
  private updateOffice(node: any, data:any) {
    this.addNode = node
    this.addData = data
    this.dialogTit = '编辑组织'
    this.isAdd = false
    this.dialogForm.name = data.name
    this.showDialog = true
  }
  private async upOffice(node:any, item: any) {
    // 向上
    if (this.disabled) {
      return
    }
    const prev = node.previousSibling
    const parent = node.parent
    if (!prev) {
      this.$message.error(`处于顶端，不能继续上移`)
      return
    }
    this.disabled = true
    this.sortOffice({
      fromId: node.data.id,
      toId: prev.data.id
    }, () => {
      const children = parent.data.officeVOs || parent.data
      const index = children.findIndex((item: any) => {
        return prev.data.id === item.id
      })
      children.splice(index, 2, JSON.parse(JSON.stringify(node.data)), JSON.parse(JSON.stringify(prev.data)))
    })
  }
  private async downOffice(node:any, item: any) {
    // 向上
    if (this.disabled) {
      return
    }
    const next = node.nextSibling
    const parent = node.parent
    if (!next) {
      this.$message.error(`处于末端，不能继续下移`)
      return
    }
    this.disabled = true
    this.sortOffice({
      fromId: node.data.id,
      toId: next.data.id
    }, () => {
      const children = parent.data.officeVOs || parent.data
      const index = children.findIndex((item: any) => {
        return node.data.id === item.id
      })
      children.splice(index, 2, JSON.parse(JSON.stringify(next.data)), JSON.parse(JSON.stringify(node.data)))
    })
  }
  private async sortOffice(postData: any, callback:any) {
    const { data } = await sortOffice(postData)
    this.disabled = false
    if (data.success) {
      callback && callback()
    } else {
      this.$message.error(data)
    }
  }
  private async confirm(done: any) {
    ((this.$refs['dialogForm']) as any).validate(async(valid:boolean) => {
      if (valid) {
        this.dialogForm.parentId = this.addData.id
        this.dialogForm.parentIds = this.addData.parentIds
        if (this.addData.type === 3) {
          this.dialogForm.type = this.activeName === 'first' ? 4 : 5
        } else {
          this.dialogForm.type = this.addData.type + 1
        }
        if (this.isAdd) {
          // 添加
          const { data } = await createOffice({
            ...this.dialogForm
          })
          if (data.success) {
            this.$message.success(`创建成功`)
            this.append(data.data)
            this.showDialog = false
          }
        } else {
          // 编辑
          const { data } = await updateOffice({
            id: this.addData.id,
            name: this.dialogForm.name
          })
          if (data.success) {
            this.$message.success(`编辑成功`)
            this.update(this.dialogForm.name)
            this.showDialog = false
          }
        }
      }
    })
  }
  // 清楚dialog
  private resetDialog() {
    this.dialogForm.name = ''
    this.activeName = 'first'
    this.$nextTick(() => {
      (this.$refs.dialogForm as any).clearValidate()
    })
  }
  // 获取组织管理列表
  private async getOfficeList() {
    this.loading = true
    const { data } = await getOfficeList()
    this.loading = false
    if (data.success) {
      this.data = data.data
    } else {
      this.$message.error(data)
    }
  }
  // 删除
  private async deleteOffice(node:any, item: any) {
    this.$confirm(`您确定要删除“${item.name}”吗？`, '删除组织', {
      type: 'warning'
    }).then(async() => {
      const { data } = await deleteOffice({
        id: item.id
      })
      if (data.success) {
        this.$message.success(`删除成功`)
        this.remove(node, item)
      } else {
        this.$message.error(data)
      }
    }).catch(() => {
    })
  }
  // 删除tree 节点
  private remove(node: any, data: any) {
    const parent = node.parent
    const children = parent.data.officeVOs || parent.data
    const index = children.findIndex((d: any) => {
      return d.id === data.id
    })
    children.splice(index, 1)
  }
  // append tree节点
  private append(data: any) {
    const newChild = { ...data }
    if (!this.addData.officeVOs) {
      this.$set(this.addData, 'officeVOs', [])
    }
    this.addData.officeVOs.unshift(newChild)
  }
  // update tree节点
  private update(name: string) {
    this.$set(this.addNode.data, 'name', name)
  }
  mounted() {
    this.getOfficeList()
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
.tree-icon{
  font-size: 16px;
  color: $--color-text-regular;
  margin-right: 10px;
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
.OrganizationManagement .el-badge >>> sup{
  transform: translateY(6px)
}
</style>
