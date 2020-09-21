<template>
  <div
    v-loading="loading"
    :class="isPC ? 'DutyManage' : 'DutyManage-m'"
  >
    <SectionContainer title="职责管理">
      <RoleTree
        class="treeLine"
        :data="data"
        :props="defaultProps"
        :indent="0"
      >
        <template slot-scope="{node, data}">
          <span class="mr10">{{ node.label }}</span>
          <div class="right-btn">
            <el-button
              v-if="data.dutyLevel !== 2"
              v-permission="['/v2/base/duty/create']"
              circle
              size="mini"
              icon="el-icon-circle-plus-outline"
              name="DutyManage_appendAuth_btn"
              @click.stop="
                () => {
                  appendDuty(node, data);
                }
              "
            />
            <el-button
              v-if="node.level !== 1"
              v-permission="['/v2/base/duty/update']"
              circle
              size="mini"
              class="delete"
              icon="el-icon-remove-outline"
              name="DutyManage_deleteAuth_btn"
              @click.stop="
                () => {
                  deleteDuty(node, data);
                }
              "
            />
            <el-button
              v-if="node.level !== 1"
              v-permission="['/v2/base/duty/delete']"
              circle
              size="mini"
              icon="el-icon-edit"
              name="DutyManage_updateAuth_btn"
              @click.stop="
                () => {
                  updateDuty(node, data);
                }
              "
            />
          </div>
        </template>
      </RoleTree>
    </SectionContainer>
    <SelfDialog
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
        <el-form-item
          label="职责名称"
          prop="dutyName"
        >
          <el-input
            v-model="dialogForm.dutyName"
            placeholder="请输入职责名称"
            maxlength="10"
            clearable
            name="dutymanage_chooseDutyName1_input"
          />
        </el-form-item>
        <el-form-item
          label="上级节点"
          prop="parentDutyName"
        >
          <el-input
            v-model="dialogForm.parentDutyName"
            disabled
            name="dutymanage_chooseDutyName2_input"
          />
        </el-form-item>
      </el-form>
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { RoleTree } from './components'
import SelfDialog from '@/components/SelfDialog/index.vue'
import '@/styles/common.scss'
import '@/styles/tree-line.scss'
import {
  dutyList,
  createDuty,
  updateDuty,
  deleteDuty
} from '@/api/system'
@Component({
  name: 'DutyManage',
  components: {
    SectionContainer,
    RoleTree,
    SelfDialog
  }
})

export default class extends Vue {
  private loading: boolean = false;
  private data: any = [];
  private defaultProps: any = {
    children: 'childDuty',
    label: 'dutyName'
  };
  private addNode: any = {};
  private addData: any = {};
  // 弹窗
  private showDialog: boolean = false;
  private dialogTit: string = '新建职责';
  private dialogForm: any = {
    dutyLevel: 2,
    dutyName: '',
    parentId: 0,
    parentsId: 0, // 默认根节点为0
    parentDutyName: ''
  };
  private rules: any = {
    dutyName: [
      { required: true, message: '请输入职责名称', trigger: 'blur' }
    ],
    parentDutyName: [
      { required: true, message: '请输入上级节点', trigger: 'blur' }
    ]
  };
  private isAdd: boolean = false;
  private disabled: boolean = false;

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 弹窗提交
  private confirm(done: any) {
    (this.$refs['dialogForm'] as any).validate(async(valid: boolean) => {
      if (valid) {
        const postData = {
          ...this.dialogForm
        }
        delete postData.parentDutyName
        const submitForm = this.isAdd ? createDuty : updateDuty
        const success = this.isAdd ? '创建成功' : '编辑成功'
        const { data } = await submitForm(postData)
        if (data.success) {
          this.$message.success(success)
          if (this.isAdd) {
            this.append(data.data)
          } else {
            this.update(postData, this.dialogForm.childDuty)
          }
          this.showDialog = false
        } else {
          this.$message.error(data)
        }
      }
    })
  }
  // 添加职责
  private async appendDuty(node: any, data: any) {
    this.addNode = node
    this.addData = data
    this.dialogForm.parentDutyName = data.dutyName
    this.dialogForm.parentId = data.id
    this.dialogForm.parentsId = [this.dialogForm.parentsId, data.id].join(',')
    this.dialogTit = '新建职责'
    this.isAdd = true
    this.showDialog = true
  }
  // 编辑职责
  private updateDuty(node: any, data: any) {
    this.addNode = node
    this.addData = data
    this.dialogTit = '编辑职责'
    this.dialogForm.dutyName = data.dutyName
    this.dialogForm.id = data.id
    this.dialogForm.parentId = node.parent.data.id
    this.dialogForm.parentsId = [this.dialogForm.parentsId, node.parent.data.id].join(',')
    this.dialogForm.parentDutyName = node.parent.label
    this.isAdd = false
    this.showDialog = true
  }
  // 删除职责
  private async deleteDuty(node: any, item: any) {
    const { dutyLevel, id } = item
    this.$confirm(`您确定要删除“${item.dutyName}”吗？`, '删除职责', {
      type: 'warning'
    })
      .then(async() => {
        const { data } = await deleteDuty({
          dutyLevel,
          id
        })
        if (data.success) {
          this.$message.success(`删除成功`)
          this.remove(node, item)
        } else {
          this.$message.error(data)
        }
      })
      .catch(() => {})
  }
  // 获取列表
  private async getDutyList() {
    this.loading = true
    const { data } = await dutyList()
    this.loading = false
    if (data.success) {
      this.data = data.data
    } else {
      this.$message.error(data)
    }
  }
  // 删除tree 节点
  private remove(node: any, data: any) {
    const parent = node.parent
    const children = parent.data.childDuty || parent.data
    const index = children.findIndex((d: any) => {
      return d.id === data.id
    })
    children.splice(index, 1)
  }
  // append tree节点
  private append(data: any) {
    const newChild = { ...data }
    if (!this.addData.childDuty) {
      this.$set(this.addData, 'childDuty', [])
    }
    this.addData.childDuty.push(newChild)
  }
  // update tree节点
  private update(data: any, childDuty: any) {
    this.addData.dutyName = data.dutyName
  }
  // 清楚dialog
  private resetDialog() {
    this.dialogForm.dutyName = ''
    this.dialogForm.parentsId = 0
    delete this.dialogForm.id
    this.$nextTick(() => {
      (this.$refs.dialogForm as any).clearValidate()
    })
  }
  private fetchData() {
    this.getDutyList()
  }
  mounted() {
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped>
.DutyManage{
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.DutyManage,
.DutyManage-m {
  .mr10 {
    margin-right: 10px;
  }
  .ml10 {
    margin-left: 10px;
  }
  .right-btn {
    display: inline-block;
    .el-button {
      padding: 0;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background: rgba(0, 0, 0, 0);
      font-size: 20px;
      border-color: rgba(0, 0, 0, 0);
      &.delete {
        &:hover {
          color: $--color-danger;
        }
      }
    }
  }
}
</style>
<style scoped>
.DutyManage .el-badge >>> sup,
.DutyManage-m .el-badge >>> sup {
  transform: translateY(6px);
}
</style>
