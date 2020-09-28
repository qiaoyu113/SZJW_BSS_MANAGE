<template>
  <div
    class="refundList"
    :class="{
      p15: isPC
    }"
  >
    <suggest-container
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.status"
      @handle-query="handleQuery"
    >
      <!-- 查询表单 -->
      <self-form
        :list-query="listQuery"
        :form-item="formItem"
        label-width="80px"
        class="p15"
      >
        <div
          slot="btn"
          :class="isPC ? 'btnPc' : 'mobile'"
        >
          <el-button
            size="small"
            type="warning"
            :class="isPC ? '' : 'btnMobile'"
            name="driverclue_reset_btn"
            @click="handleResetClick"
          >
            重置
          </el-button>
          <el-button
            size="small"
            :class="isPC ? '' : 'btnMobile'"
            type="primary"
            name="driverclue_filter_btn"
            @click="handleFilterClick"
          >
            筛选
          </el-button>
        </div>
      </self-form>
    </suggest-container>

    <table-header
      :tab="[
        {
          name: '用户管理',
          label: '用户管理'
        }
      ]"
      active-name="用户管理"
    >
      <div class="subTitle">
        <router-link :to="{path: '/system/addUser'}">
          <el-button
            v-permission="['/v2/base/user/create']"
            class="createUser"
            icon="el-icon-plus"
            type="primary"
            size="small"
          >
            新建用户
          </el-button>
        </router-link>
      </div>
    </table-header>
    <self-table
      v-loading="listLoading"
      :operation-list="[]"
      :index="false"
      :table-data="tableData"
      :columns="columns"
      :page="page"
      @onPageSize="handlePageSize"
    >
      <template v-slot:status="scope">
        <span v-if="scope.row.status ===1">启用</span>
        <span v-else>禁用</span>
      </template>
      <template v-slot:op="scope">
        <el-dropdown
          :trigger="isPC ? 'hover' : 'click'"
          name="driverclue_moreMenu_dropdown"
          @command="(e) => handleCommandChange(e,scope.row)"
        >
          <span
            v-if="isPC"
            class="el-dropdown-link"
          >
            更多操作<i
              v-if="isPC"
              class="el-icon-arrow-down el-icon--right"
            />
          </span>
          <span
            v-else
            style="font-size: 18px;"
            class="el-dropdown-link"
          >
            <i class="el-icon-setting el-icon--right" />
          </span>

          <el-dropdown-menu
            slot="dropdown"
          >
            <el-dropdown-item
              v-permission="['/v2/base/user/enableOrDisable']"
              command="status"
            >
              <template v-if="scope.row.status ===1">
                禁用
              </template>
              <template v-else>
                启用
              </template>
            </el-dropdown-item>
            <el-dropdown-item
              v-permission="['/v1/base/user/password/reset']"
              command="resetPwd"
            >
              重置密码
            </el-dropdown-item>
            <el-dropdown-item
              v-permission="['/v2/base/user/update']"
              command="edit"
            >
              编辑
            </el-dropdown-item>
            <el-dropdown-item
              v-if="scope.row.syncPermission"
              command="crm"
            >
              同步CRM账号
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </self-table>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import { SettingsModule } from '@/store/modules/settings'
import { getUserManagerList, enableOrDisableUser, resetPassword, pushUserToCRM } from '@/api/system'
import SelfForm from '@/components/Base/SelfForm.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { getLabel, phoneReg } from '@/utils/index.ts'
import { HandlePages } from '@/utils/index'
import TableHeader from '@/components/TableHeader/index.vue'
interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}

interface ColumnsObj {
  key: string;
  label: string;
  width?: string;
  'min-width'?:string;
  slot?:boolean;
  fixed?:string;
}

interface tableObj {
  nickName: string;
  roleName: string;
  officeName: string;
  mobile: string;
  status: number;
}

interface Tab {
  label:String,
  name:String,
  id:Number,
  num?:Number | undefined
}

interface FormObj {
  status:number|string;
  mobile:number|string;
  nickName:string;
}

interface IState {
  [key: string]: any;
}

@Component({
  components: {
    SelfTable,
    SelfForm,
    SuggestContainer,
    TableHeader
  }
})
export default class extends Vue {
  // 状态
  private tab:Tab[] = [
    {
      label: '全部',
      name: '',
      id: 0,
      num: 0
    },
    {
      label: '启用',
      name: '1',
      id: 1,
      num: 0
    },
    {
      label: '禁用',
      name: '2',
      id: 2,
      num: 0
    }
  ]
  private tags:any[] = []// 顶部查询按钮回显的数组
  private listLoading:boolean = false
  private tableData:tableObj[] = []
  private columns:ColumnsObj[] = [
    {
      key: 'nickName',
      label: '姓名',
      'min-width': '140px'
    },
    {
      key: 'roleName',
      label: '角色',
      'min-width': '140px'
    },
    {
      key: 'officeName',
      label: '组织架构',
      'min-width': '200px'
    },
    {
      key: 'mobile',
      label: '电话',
      'min-width': '140px'
    },
    {
      key: 'status',
      label: '状态',
      'min-width': '140px',
      slot: true
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      slot: true,
      'min-width': this.isPC ? '200px' : '50px'
    }
  ]
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  private listQuery:IState = {
    status: '',
    mobile: '',
    nickName: ''
  }
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 10,
        clearable: true
      },
      label: '姓名',
      key: 'nickName'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 11,
        clearable: true
      },
      label: '电话',
      key: 'mobile'
    }
  ]
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  mounted() {
    this.getLists()
  }
  // 获取用户列表
  async getLists() {
    try {
      this.listLoading = true
      interface Params {
        limit:number;
        page:number;
        nickName?:string;
        mobile?:string;
        status?:string|number
      }
      let params:Params = {
        limit: +this.page.limit,
        page: +this.page.page,
        status: this.listQuery.status
      }
      this.listQuery.nickName && (params.nickName = this.listQuery.nickName)
      this.listQuery.mobile && (params.mobile = this.listQuery.mobile)
      let { data: res } = await getUserManagerList(params)
      if (res.success) {
        res.page = await HandlePages(res.page)
        this.tableData = res.data
        this.page.total = res.page.total
        for (let i = 0; i < this.tab.length; i++) {
          let item:Tab = this.tab[i]
          if (item.name === '') {
            item.num = res.title.totalCount
          } else if (item.name === '1') {
            item.num = res.title.enableCount
          } else if (item.name === '2') {
            item.num = res.title.disableCount
          }
        }
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get lists fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 启用、禁用
  async enableOrDisableUser(row:any) {
    try {
      let params = {
        id: row.id,
        status: row.status === 1 ? 2 : 1
      }
      let { data: res } = await enableOrDisableUser(params)
      if (res.success) {
        if (row.syncStatus) {
          this.$message.success(`${row.status === 1 ? '禁用' : '启用'}状态同步CRM系统状态成功！`)
        } else {
          this.$message.success('操作成功')
        }
        this.getLists()
      } else {
        if (row.syncStatus) {
          this.$message.error(`${row.status === 1 ? '禁用' : '启用'}状态同步CRM系统状态失败！请联系系统管理员或在CRM中操作${row.status === 1 ? '禁用' : '启用'}`)
        } else {
          this.$message.error(res.errorMsg)
        }
      }
    } catch (err) {
      console.log(`enable or disable fail:${err}`)
    }
  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 打开禁用确认框
  openDisableUser(row:any) {
    this.$confirm(`您确定要禁用${row.nickName}吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.enableOrDisableUser(row)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消操作'
      })
    })
  }
  // 更多操作
  handleCommandChange(key:string|number, row:any) {
    if (key === 'edit') { // 编辑
      this.$router.push({
        path: '/system/modifyUser',
        query: {
          userId: row.id
        }
      })
    } else if (key === 'resetPwd') { // 重置密码
      this.openResetPassword(row)
    } else if (key === 'status') { // 重置密码
      if (row.status === 1) { // 启用
        this.openDisableUser(row)
      } else {
        this.enableOrDisableUser(row)
      }
    } else if (key === 'crm') {
      this.openSendCrmData(row)
      console.log('crm')
    }
  }
  // 同步crm弹框
  openSendCrmData(row:any) {
    this.$confirm(`确定要同步生成${row.nickName}用户的CR账户吗?(注意:确认生成后需要前往激活方可生效)`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.pushUserToCRM(row)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消操作'
      })
    })
  }
  // 同步用户到crm
  async pushUserToCRM(row:any) {
    try {
      let params = {
        userId: row.id
      }
      let { data: res } = await pushUserToCRM(params)
      if (res.success) {
        this.$message.success(`同步CRM账号成功！`)
        this.getLists()
      } else {
        // this.$message.error(`同步CRM账号失败！请重新激活或联系统管理员！`)
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`push userto crm fail:${err}`)
    }
  }
  // 删除顶部表单的选项
  handleQuery(value:any, key:keyof FormObj | 'state') {
    if (key === 'state') {
      this.page.page = 1
      this.listQuery.status = value
    } else {
      this.listQuery[key] = value
    }
    this.getLists()
  }
  // 重置表单
  handleResetClick() {
    this.listQuery = {
      status: '',
      mobile: '',
      nickName: ''
    }
    this.tags = []
    // this.getLists()
  }
  handleFilterClick() {
    let blackLists = ['status']
    this.tags = []
    for (let key in this.listQuery) {
      if (this.listQuery[key] !== '' && (this.tags.findIndex(item => item.key === key) === -1) && !blackLists.includes(key)) {
        let name = getLabel(this.formItem, this.listQuery, key)
        if (name) {
          this.tags.push({
            type: 'info',
            name: name,
            key: key
          })
        }
      }
    }
    this.getLists()
  }
  // 打开重置密码的弹框
  openResetPassword(row:any) {
    this.$confirm(`确定要将密码重置为手机号吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.resetPassword(row)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消操作'
      })
    })
  }
  // 重置密码
  async resetPassword(row:any) {
    try {
      let params = {
        id: row.id
      }
      let { data: res } = await resetPassword(params)
      if (res.success) {
        this.$message.success('操作成功')
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`reset password fail:${err}`)
    }
  }
}
</script>
<style lang="scss" scoped>
  .refundList {
    .subTitle {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-end;
      align-items: center;
      h4 {
        margin: 0px;
      }
      .createUser {
        margin-bottom:10px;
      }
    }
    .btnPc {
       display: flex;
       flex-flow: row nowrap;
       justify-content: flex-end;
     }
    .mobile {
      width:100%;
      text-align: center;
      .btnMobile {
        margin-left: 0;
        margin-top: 10px;
        width:80%;
      }
    }
  }
</style>

<style scoped>
  .refundList >>> .el-card {
    border:none;
  }
  .refundList >>> .el-card__header {
    border-bottom: none;
  }
</style>