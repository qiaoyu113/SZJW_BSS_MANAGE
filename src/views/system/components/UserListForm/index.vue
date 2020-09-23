<template>
  <div class="SuggestForm">
    <div class-name="sub-navbar">
      <div class="filter-container">
        <div :class="isPC ? 'menuBox' : 'menuBox-m'">
          <el-row>
            <el-form
              ref="ruleForm"
              :model="listQuery"
              :label-width="isPC ? '120px' : '28%'"
            >
              <el-col :span="isPC ? 6 : 24">
                <el-form-item
                  label="姓名"
                  prop="nickName"
                >
                  <el-input
                    v-model="listQuery.nickName"
                    placeholder="请输入姓名"
                    clearable
                    name="usermanage_chooseName_input"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item
                  label="电话"
                  prop="mobile"
                >
                  <el-input
                    v-model="listQuery.mobile"
                    placeholder="请输入电话"
                    clearable
                    name="usermanage_choosePhone_input"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item
                  label="角色"
                  prop="roleId"
                >
                  <el-select
                    v-model="listQuery.roleId"
                    placeholder="请选择"
                    clearable
                    name="usermanage_chooseRoleId_select"
                  >
                    <el-option
                      v-for="item in optionsRoles"
                      :key="item.id"
                      :label="item.nick"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item
                  label="组织机构"
                  prop="officeId"
                >
                  <el-cascader
                    ref="cascaderOff"
                    v-model="officeList"
                    :options="optionsOffice"
                    :show-all-levels="false"
                    :props="{
                      label: 'name',
                      value: 'id',
                      children: 'officeVOs',
                      checkStrictly: true
                    }"
                    clearable
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item
                  label="状态"
                  prop="city"
                >
                  <el-select
                    v-model="listQuery.status"
                    placeholder="请选择"
                    clearable
                    name="usermanage_chooseStatus_select"
                  >
                    <el-option
                      v-for="(item, index) in optionsStatus"
                      :key="index"
                      :label="item.code"
                      :value="item.codeVal"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :span="isPC ? 18 : 24"
                class="btn-box"
              >
                <el-button
                  size="small"
                  :class="isPC ? 'filter-item' : 'filter-item-m'"
                  name="usermanage_reset_btn"
                  @click="resetForm('ruleForm')"
                >
                  重置
                </el-button>
                <el-button
                  size="small"
                  :class="isPC ? 'filter-item' : 'filter-item-m'"
                  type="primary"
                  name="usermanage_query_btn"
                  @click="searchForm"
                >
                  筛选
                </el-button>
              </el-col>
            </el-form>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { PermissionModule } from '@/store/modules/permission'
import { SettingsModule } from '@/store/modules/settings'
import { roleList, getOfficeByCurrentUser } from '@/api/system'

import '@/styles/common.scss'

@Component({
  name: 'SuggestForm',
  components: {}
})
export default class extends Vue {
  @Prop({ default: {} }) private listQuery: any;
  @Prop({ default: () => [] }) private DateValue!: any[];
  private optionsCity: any[] = []; // 字典查询定义(命名规则为options + 类型名称)
  private DateValueChild: any[] = []; // DateValue的赋值项
  private QUERY_KEY_LIST: any[] = ['page', 'limit']; // 添加过滤listQuery中key的名称
  private optionsRoles: any[] = []
  private optionsOffice: any[] = []
  private officeList: any[] = []
  private optionsStatus: any[] = [
    {
      codeVal: 1,
      code: '启用'
    },
    {
      codeVal: 2,
      code: '禁用'
    }
  ]
  // listQuery同步tags公共方法
  @Watch('listQuery', { deep: true })
  private onListQueryChange(value: any) {
    let tags: any = []
    for (var key in value) {
      if (this.QUERY_KEY_LIST.indexOf(key) < 0) {
        if (value[key]) {
          tags.unshift({
            name: this.matchName(key, value[key]),
            type: '',
            key: key
          })
        }
      }
    }
    if (!value.officeId) {
      this.officeList = []
    }
    this.$emit('handle-tags', tags)
  }

  get isPC() {
    return SettingsModule.isPC
  }

  // 匹配创建tags标签
  private matchName(key: any, value: any) {
    let vodeName = ''
    const offList = (this.$refs.cascaderOff as any).getCheckedNodes()// 获取选中的组织
    switch (key) {
      // 根据listQuery中的key来判断
      case 'mobile':
      case 'nickName':
        vodeName = value
        break
      case 'status':
        vodeName = this.optionsStatus.find((item) => item.codeVal === value)['code']
        break
      case 'roleId':
        vodeName = this.optionsRoles.find((item) => item.id === value)['nick']
        break
      case 'officeId':
        vodeName = offList && offList[0] ? offList[0].label : ''
        break
      default:
        vodeName = ''
        break
    }
    return vodeName
  }

  private handleChange(value:any) {
    this.listQuery.officeId = value.slice().pop() || ''
  }
  // 重置
  private resetForm(name: string) {
    this.officeList = []
    for (const key in this.listQuery) {
      if (!this.QUERY_KEY_LIST.includes(key)) {
        this.listQuery[key] = ''
      }
    }
    // QUERY_KEY_LIST
  }
  // 查询
  private searchForm() {
    this.$emit('handle-query')
  }
  // 获取角色
  private async getRoleList() {
    const { data } = await roleList()
    if (data.success) {
      this.optionsRoles = data.data
    } else {
      this.$message.error(data)
    }
  }
  // 获取组织管理列表
  private async getOfficeByCurrentUser() {
    const { data } = await getOfficeByCurrentUser()
    if (data.success) {
      this.optionsOffice = this.traverseTree(data.data)
    } else {
      this.$message.error(data)
    }
  }
  private traverseTree(data:any) {
    var setChecked = (list: any) => {
      for (var i in list) {
        if (list[i].officeVOs && list[i].officeVOs.length > 0) {
          setChecked(list[i].officeVOs)
        } else {
          delete list[i].officeVOs
        }
      }
    }
    setChecked(data)
    return data
  }
  private fetchData() {
    this.getRoleList()
    this.getOfficeByCurrentUser()
  }
  created() {
    this.fetchData()
  }
}
</script>

<style lang="scss">
.SuggestForm {
  width: 100%;
  .filter-container {
    padding: 0;
  }
  .menuBox-m {
    padding: 20px 10px;
    box-sizing: border-box;
    .el-date-m {
      width: 79%;
    }
    .btn-box {
      text-align: center;
      .filter-item {
        float: right;
        margin-left: 30px;
      }
      .filter-item-m {
        width: 80%;
        margin: 0 auto 10px;
      }
    }
    .el-select,
    .el-cascader{
      width: 100%;
    }
    .el-input {
      width: 78%;
    }
  }
  .menuBox {
    padding: 20px 30px 0 0;
    box-sizing: border-box;
    position: absolute;
    z-index: 1000;
    background: #fff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.85);
    right: 15px;
    left: 15px;
    .btn-box {
      text-align: center;
      .filter-item {
        float: right;
        margin-left: 30px;
      }
      .filter-item-m {
        width: 80%;
        margin: 0 auto 10px;
      }
    }
    .el-select {
      display: block;
    }
    .el-input {
      width: 75%;
    }
  }
}
</style>

<style lang="scss" scope>
.el-collapse-item__content {
  padding-bottom: 0;
}
.el-form-item__label {
  color: #999999;
}
</style>
