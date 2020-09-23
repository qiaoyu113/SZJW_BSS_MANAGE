<template>
  <div :class="isPC ? 'CreateRole' : 'CreateRole-m'">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="isPC ? '120px' : '80px'"
    >
      <SectionContainer title="基本信息">
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="角色中文名称"
              prop="nick"
            >
              <el-input
                v-model="ruleForm.nick"
                maxlength="10"
                placeholder="请输入角色中文名称"
                clearable
                name="createrole_chooseNick_input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="角色英文名称"
              prop="name"
            >
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入角色英文名称"
                maxlength="20"
                clearable
                name="createrole_chooseName_input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="角色描述"
              prop="description"
            >
              <el-input
                v-model="ruleForm.description"
                placeholder="请输入角色描述"
                maxlength="50"
                clearable
                name="createrole_chooseDescription_input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="职责"
              :prop="isEdit ? 'dutyId' : ''"
            >
              <el-cascader
                ref="dutyTree"
                v-model="ruleForm.dutyId"
                :disabled="isEdit"
                :options="dutyList"
                :props="{
                  label: 'dutyName',
                  value: 'id',
                  children: 'childDuty'
                }"
                placeholder="请选择职责"
                clearable
                @change="handleChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="是否同步CRM账号"
              :prop="isEdit ? 'syncCRMAbility' : ''"
              class="lineHeight"
            >
              <el-select
                v-model="ruleForm.syncCRMAbility"
                placeholder="请选择"
                :disabled="isEdit"
                clearable
                filterable
              >
                <el-option
                  label="是"
                  :value="0"
                />
                <el-option
                  label="否"
                  :value="1"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>
      <SectionContainer title="角色授权">
        <RoleTree
          ref="tree"
          class="treeLine"
          :data="data"
          :props="defaultProps"
          node-key="id"
          :show-checkbox="true"
          :indent="0"
          :check-strictly="true"
          @check-change="changeCheck"
        >
          <template slot-scope="{node, data}">
            <span>{{ node.label }}</span>
            <el-radio-group
              v-show="
                node.checked &&
                  ((node.level !== 1 && data.controlType) || node.level === 3)
              "
              v-model="data.checked"
              class="ml10"
              size="mini"
              @click.stop.native
            >
              <el-radio-button
                v-for="(item, index) in scopeList"
                :key="index"
                :label="item.dictValue"
              >
                {{ item.dictLabel }}
              </el-radio-button>
            </el-radio-group>
          </template>
        </RoleTree>
      </SectionContainer>
      <div class="btn_box">
        <el-button
          type="primary"
          name="createrole_formsave_btn"
          @click="submitForm('ruleForm')"
        >
          提交
        </el-button>
        <el-button
          name="createrole_formreset_btn"
          @click="resetForm('ruleForm')"
        >
          重置
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { TagsViewModule } from '@/store/modules/tags-view'
import { RoleTree } from './components'
// import { GetDictionaryList } from '@/api/common'
import {
  authorityList,
  createRole,
  getRoleDetail,
  updateRole,
  dutyList
} from '@/api/system'

import '@/styles/common.scss'
import '@/styles/tree-line.scss'

@Component({
  name: 'CreateRole',
  components: {
    SectionContainer,
    RoleTree
  }
})
export default class extends Vue {
  private isEdit: boolean = false; // 是否是编辑页面
  private id: any = '';
  private ruleForm: any = {
    name: '',
    nick: '',
    productLine: '',
    description: '',
    syncCRMAbility: ''
  };
  private defaultProps: any = {
    children: 'childAuth',
    label: 'authName'
  };
  private authorityList: any = [];
  private data: any = [];
  private dutyList: any = [];
  private productList: any = [];
  private scopeList: any = [
    {
      dictValue: 4,
      dictLabel: '个人数据'
    },
    {
      dictValue: 3,
      dictLabel: '小组数据'
    },
    {
      dictValue: 5,
      dictLabel: '业务线数据'
    },
    {
      dictValue: 2,
      dictLabel: '城市数据'
    },
    {
      dictValue: 1,
      dictLabel: '大区数据'
    },
    {
      dictValue: 0,
      dictLabel: '全部数据'
    }
  ];
  private rules: any = {
    nick: [
      { required: true, message: '请输入角色中文名称', trigger: 'blur' },
      {
        pattern: /^(?:[\u4e00-\u9fa5·]{2,10})$/,
        message: '请输入2-10个中文',
        trigger: 'blur'
      }
    ],
    name: [
      { required: true, message: '请输入角色英文名称', trigger: 'blur' },
      { pattern: /^[a-z]+$/i, message: '请输入2-20位英文名称', trigger: 'blur' }
    ],
    productLine: [
      { required: true, message: '请选择产品线', trigger: 'change' }
    ],
    description: [{ required: false, message: '请输入描述', trigger: 'blur' }],
    dutyId: [{ required: true, message: '请选择职责', trigger: 'change' }],
    syncCRMAbility: [{ required: true, message: '请选择是否同步CRM账号', trigger: 'change' }]
  };
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  // 获取职责列表
  private async getDutyList() {
    const { data } = await dutyList()
    if (data.success) {
      this.dutyList = this.getTreeData(data.data, 'childDuty')
    } else {
      this.$message.error(data)
    }
  }
  private async handleChange(value: any) {
    const item = (this.$refs['dutyTree'] as any).getCheckedNodes()[0]
    if (!item) return
    this.ruleForm.dutyName = item.label
    this.ruleForm.productLine = item.value
  }
  // 提交表单
  private submitForm(formName: any) {
    (this.$refs[formName] as any).validate(async(valid: boolean) => {
      if (valid) {
        if (this.isEdit) {
          this.submitEditForm()
          return
        }
        const postData = {
          ...this.ruleForm
        }
        postData.authorities = this.getCheckedNodes()
        postData.dutyId = postData.dutyId.slice(0).pop()
        const { data } = await createRole(postData)
        if (data.success) {
          this.$message.success(`创建成功`)
          setTimeout(() => {
            (TagsViewModule as any).delView(this.$route); // 关闭当前页面
            (TagsViewModule as any).delCachedView({
              // 删除指定页面缓存（进行刷新操作）
              name: 'RoleManage'
            })
            this.$nextTick(() => {
              this.$router.push({ name: 'RoleManage' })
            })
          }, 800)
        } else {
          this.$message.error(data)
        }
      }
    })
  }
  // 编辑角色提交
  private async submitEditForm() {
    const postData = {
      ...this.ruleForm
    }
    postData.roleId = postData.id
    postData.authorities = this.getCheckedNodes()
    delete postData.id
    delete postData.productLine
    const { data } = await updateRole(postData)
    if (data.success) {
      this.$message.success(`编辑成功`)
      setTimeout(() => {
        (TagsViewModule as any).delView(this.$route); // 关闭当前页面
        (TagsViewModule as any).delCachedView({
          // 删除指定页面缓存（进行刷新操作）
          name: 'RoleManage'
        })
        this.$nextTick(() => {
          this.$router.push({ name: 'RoleManage' })
        })
      }, 800)
    } else {
      this.$message.error(data)
    }
  }
  // 重置表单
  private resetForm(formName: any) {
    this.resetChecked();
    (this.$refs[formName] as any).resetFields()
  }
  private getCheckedNodes() {
    const list = (this.$refs['tree'] as any).$refs['roleTree'].getCheckedNodes()
    return list.map((item: any) => ({
      authorityId: item.id,
      dataScope: item.checked
    }))
  }
  private resetChecked() {
    (this.$refs['tree'] as any).$refs['roleTree'].setCheckedKeys([])
  }

  private async getAuth() {
    const { data } = await authorityList()
    if (data.success) {
      this.data = this.traverseTree(data.data)
      if (this.isEdit) {
        const checked = this.authorityList.map((item: any) => item.authorityId);
        (this.$refs['tree'] as any).$refs['roleTree'].setCheckedKeys(checked)
      }
    } else {
      this.$message.error(data)
    }
  }
  private async fetchData() {
    if (this.isEdit && this.id) {
      const { data } = await getRoleDetail(Number(this.id))
      if (data.success) {
        this.ruleForm = data.data
        this.authorityList = data.data.authorities || []
      } else {
        this.$message.error(data)
      }
    }
    this.getDutyList()
    // this.getDictionary() 取消请求产品线接口
    this.getAuth()
  }
  // 递归解决children 为空数组
  private getTreeData(data: any, key: string) {
    // 循环遍历json数据
    for (var i = 0; i < data.length; i++) {
      if (data[i][key].length < 1) {
        // children若为空数组，则将children设为undefined
        data[i][key] = undefined
      } else {
        // children若不为空数组，则继续 递归调用 本方法
        this.getTreeData(data[i][key], key)
      }
    }
    return data
  }
  private traverseTree(data: any) {
    var setChecked = (list: any) => {
      for (var i in list) {
        let checked = 4
        if (
          this.isEdit &&
          this.authorityList &&
          this.authorityList.length > 0
        ) {
          const item = this.authorityList.find(
            (d: any) => d.authorityId === list[i].id
          )
          if (item) {
            checked = item.dataScope
          }
        }
        if (list[i].controlType || list[i].authType === 3) {
          list[i].checked = checked
        }
        if (list[i].childAuth) {
          setChecked(list[i].childAuth)
        }
      }
    }
    setChecked(data)
    return data
  }
  // 选中事件
  private changeCheck(data: any, checked: any) {
    const id = data.id
    const nodes = (this.$refs['tree'] as any).$refs['roleTree'].store._getAllNodes()
    for (let i = 0; i < nodes.length; i++) {
      const listIds = nodes[i].data.parentsId
        .split(',')
        .map((p: any) => Number(p))
      if (listIds.includes(id)) {
        nodes[i].checked = checked
      }
    }
  }
  mounted() {
    this.id = this.$route.query.id
    this.isEdit = this.$route.name === 'EditRole'
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped>
.CreateRole {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .btn_box {
    padding-top: 20px;
    box-sizing: border-box;
  }
  ::v-deep{
    .lineHeight label{
      line-height: 1.3
    }
  }

}
.CreateRole-m {
  .btn_box {
    padding: 30px 20px 0 20px;
    box-sizing: border-box;
    .el-button {
      width: 100%;
    }
    .el-button {
      margin: 0 0 20px 0;
    }
  }
}
.CreateRole,
.CreateRole-m {
  .el-select,
  .el-date-editor {
    width: auto;
    display: block;
  }
  .wrap {
    flex-wrap: wrap;
  }
  .mb10 {
    margin-bottom: 10px;
  }
  .mr10 {
    margin-right: 10px;
  }
  .ml10 {
    margin-left: 10px;
  }
}
</style>
