<template>
  <div
    v-loading="loading"
    :class="isPC ? 'PermissionManage' : 'PermissionManage-m'"
  >
    <SectionContainer title="权限管理">
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
              v-if="data.authType !== 5 && data.authType !== 1"
              v-permission="['/v1/base/authority/create']"
              circle
              size="mini"
              icon="el-icon-circle-plus-outline"
              name="permissionmanage_appendAuth_btn"
              @click.stop="
                () => {
                  appendAuth(node, data);
                }
              "
            />
            <el-button
              v-if="node.level !== 1 && node.level !== 2"
              v-permission="['/v1/base/authority/deleteByAuthId']"
              circle
              size="mini"
              class="delete"
              icon="el-icon-remove-outline"
              name="permissionmanage_deleteAuth_btn"
              @click.stop="
                () => {
                  deleteAuth(node, data);
                }
              "
            />
            <el-button
              v-if="node.level !== 1 && node.level !== 2"
              v-permission="['/v1/base/authority/update']"
              circle
              size="mini"
              icon="el-icon-edit"
              name="permissionmanage_updateAuth_btn"
              @click.stop="
                () => {
                  updateAuth(node, data);
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
        <el-tabs
          v-model="activeName"
          class="dialog-tab"
        >
          <el-tab-pane
            v-if="activeName === '3'"
            label="分类"
            name="3"
          >
            <el-form-item
              label="权限名称"
              prop="authName"
            >
              <el-input
                v-model="dialogForm.authName"
                placeholder="请输入权限名称"
                maxlength="10"
                clearable
                name="permissionmanage_chooseAuthName1_input"
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            v-if="activeName === '4'"
            label="页面"
            name="4"
          >
            <el-form-item
              label="权限名称"
              prop="authName"
            >
              <el-input
                v-model="dialogForm.authName"
                placeholder="请输入权限名称"
                maxlength="10"
                name="permissionmanage_chooseAuthName2_input"
                clearable
              />
            </el-form-item>
            <el-form-item
              label="页面地址"
              prop="url"
            >
              <el-input
                v-model="dialogForm.url"
                maxlength="100"
                placeholder="请输入页面地址"
                clearable
                name="permissionmanage_url1_input"
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            v-if="activeName === '5'"
            label="功能"
            name="5"
          >
            <el-form-item
              label="权限名称"
              prop="authName"
            >
              <el-input
                v-model="dialogForm.authName"
                placeholder="请输入权限名称"
                maxlength="10"
                clearable
                name="permissionmanage_chooseAuthName3_input"
              />
            </el-form-item>
            <el-form-item
              label="数据权限"
              prop="controlType"
            >
              <el-radio-group v-model="dialogForm.controlType">
                <el-radio :label="1">
                  需要
                </el-radio>
                <el-radio :label="0">
                  不需要
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="dialogForm.controlType"
              label="页面地址"
              prop="url"
            >
              <el-input
                v-model="dialogForm.url"
                maxlength="100"
                placeholder="请输入页面地址"
                clearable
                name="permissionmanage_url2_input"
              />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { RoleTree } from './components'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { lock } from '@/utils/index'
import {
  authorityList,
  createAuthority,
  updateAuthority,
  deleteAuthority
} from '@/api/system'
import '@/styles/common.scss'
import '@/styles/tree-line.scss'

@Component({
  name: 'PermissionManage',
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
    children: 'childAuth',
    label: 'authName'
  };
  private addNode: any = {};
  private addData: any = {};
  // 弹窗
  private showDialog: boolean = false;
  private activeName: string = '2';
  private dialogTit: string = '新建权限';
  private dialogForm: any = {
    authName: '',
    authType: 0,
    controlType: '',
    parentId: 0,
    parentsId: '',
    url: ''
  };
  private rules: any = {
    authName: [
      { required: true, message: '请输入权限名称', trigger: 'blur' }
    ],
    url: [
      { required: true, message: '请输入页面地址', trigger: 'blur' },
      {
        pattern: /^\/([\w-]+\/?)+$/,
        message: '请输入正确页面地址',
        trigger: 'blur'
      }
    ],
    controlType: [
      {
        required: true,
        message: '请选择是否需要数据权限控制',
        trigger: 'change'
      }
    ]
  };
  private isAdd: boolean = false;
  private disabled: boolean = false;

  @Watch('dialogForm.controlType')
  private onval(value: any) {
    if (!value && this.addNode.level === 5) {
      this.dialogForm.url = ''
    }
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  private confirm(done: any) {
    (this.$refs['dialogForm'] as any).validate((valid: boolean) => {
      if (valid) {
        this.saveData()
      }
    })
  }
  @lock
  async saveData() {
    try {
      if (this.isAdd) {
        // 添加
        const postData = {
          ...this.dialogForm
        }
        const { id, parentsId } = this.addData
        postData.controlType = postData.controlType || 0
        postData.authType = Number(this.activeName)
        postData.parentId = id
        postData.parentsId =
            parentsId + (parentsId ? ',' : '') + `${this.addData.id}`
        delete postData.id
        delete postData.childAuth
        const { data } = await createAuthority(postData)
        if (data.success) {
          this.$message.success(`创建成功`)
          this.append(data.data)
          this.showDialog = false
        } else {
          this.$message.error(data)
        }
      } else {
        const postData = {
          ...this.dialogForm
        }
        postData.authType = Number(this.activeName)
        delete postData.childAuth
        const { data } = await updateAuthority(postData)
        if (data.success) {
          this.$message.success(`编辑成功`)
          this.update(postData, this.dialogForm.childAuth)
          this.showDialog = false
        } else {
          this.$message.error(data)
        }
      }
    } catch (err) {
      console.log(`submit fail:${err}`)
    } finally {
      console.log(`finally`)
    }
  }
  private async authorityList() {
    this.loading = true
    const { data } = await authorityList()
    this.loading = false
    if (data.success) {
      // console.log(data)
      this.data = data.data
    } else {
      this.$message.error(data)
    }
  }
  private fetchData() {
    this.authorityList()
  }
  private appendAuth(node: any, data: any) {
    this.addNode = node
    this.addData = data
    this.dialogTit = '新建权限'
    this.activeName = String(data.authType + 1)
    this.isAdd = true
    this.showDialog = true
  }
  private updateAuth(node: any, data: any) {
    this.addNode = node
    this.addData = data
    this.dialogTit = '编辑权限'
    this.dialogForm = Object.assign(this.dialogForm, data)
    this.activeName = String(data.authType)
    this.isAdd = false
    this.showDialog = true
  }
  // 删除
  private async deleteAuth(node: any, item: any) {
    this.$confirm(`您确定要删除“${item.authName}”吗？`, '删除权限', {
      type: 'warning'
    })
      .then(async() => {
        const { data } = await deleteAuthority(item.id)
        if (data.success) {
          this.$message.success(`删除成功`)
          this.remove(node, item)
        } else {
          this.$message.error(data)
        }
      })
      .catch(() => {})
  }
  // 删除tree 节点
  private remove(node: any, data: any) {
    const parent = node.parent
    const children = parent.data.childAuth || parent.data
    const index = children.findIndex((d: any) => {
      return d.id === data.id
    })
    children.splice(index, 1)
  }
  // append tree节点
  private append(data: any) {
    const newChild = { ...data }
    if (!this.addData.childAuth) {
      this.$set(this.addData, 'childAuth', [])
    }
    this.addData.childAuth.push(newChild)
  }
  // update tree节点
  private update(data: any, childAuth: any) {
    data.childAuth = childAuth
    this.$set(this.addNode, 'data', data)
  }
  // 清楚dialog
  private resetDialog() {
    this.dialogForm.authName = ''
    this.dialogForm.controlType = ''
    this.dialogForm.url = ''
    this.$nextTick(() => {
      (this.$refs.dialogForm as any).clearValidate()
    })
  }
  mounted() {
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped>
.PermissionManage{
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.PermissionManage,
.PermissionManage-m {
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
.PermissionManage .el-badge >>> sup,
.PermissionManage-m .el-badge >>> sup {
  transform: translateY(6px);
}
</style>
