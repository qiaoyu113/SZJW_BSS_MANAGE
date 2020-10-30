<template>
  <div
    class="refundList"
  >
    <div class="box">
      <self-form
        :list-query="listQuery"
        :form-item="formItem"
        size="small"
        label-width="80px"
        class="p15 SuggestForm"
        :pc-col="8"
      >
        <template slot="checkStatus">
          <el-badge
            v-for="item in btns"
            :key="item.text"
          >
            <el-button
              size="mini"
              type="primary"
              margin-right="20px"
              :plain="item.name !== listQuery.checkStatus"
              @click="listQuery.checkStatus =item.name"
            >
              {{ item.text }}
            </el-button>
          </el-badge>
        </template>
        <!-- 插槽 -->
        <div
          slot="mulBtn"
          class="btnPc"
        >
          <el-button
            size="small"
            type="primary"
            @click="handleFilterClick"
          >
            查询
          </el-button>
          <el-button
            size="small"
            @click="handleResetClick"
          >
            重置
          </el-button>
        </div>
        <template>
          <div
            slot="mulBtns"
            class="btnPc1"
          >
            <el-button
              size="small"
              type="primary"
              @click="handleSelect"
            >
              批量下载
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleReturn"
            >
              批量退费
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="goDetail()"
            >
              申请退费
            </el-button>
          </div>
        </template>
      </self-form>
      <div class="table_box">
        <div class="middle" />
        <self-table
          ref="freighForm"
          :indexes="true"
          :index="true"
          :height="tableHeight"
          :is-p30="false"
          :operation-list="[]"
          :table-data="tableData"
          :columns="columns"
          row-key="id"
          :page="page"
          @onPageSize="handlePageSize"
          @selection-change="handleSelectionChange"
        >
          <template slot="op">
            <el-button
              type="text"
              size="small"
              @click="handleClick()"
            >
              详情
            </el-button>
            <el-button
              type="text"
              size="small"
            >
              审核
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="handle1Select"
            >
              下载
            </el-button>
          </template>
        </self-table>
      </div>
    </div>
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
import { refundList } from '@/api/driver-account.ts'
import TableHeader from '@/components/TableHeader/index.vue'
interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SelfTable,
    SelfForm
  }
})
export default class extends Vue {
  private listLoading:boolean = false;
  private tableData:any[] = [];
  private listQuery:IState = {
    refundNumber: '',
    driverNumber: '',
    driverName: '',
    city: '',
    gmId: '',
    createDate: '',
    checkStatus: ''
  }
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true
      },
      w: '100px',
      label: '退费编号:',
      key: 'refundNumber'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true
      },
      w: '100px',
      label: '司机编号:',
      key: 'driverNumber'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true
      },
      w: '100px',
      label: '司机姓名:',
      key: 'driverName'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true
      },
      w: '100px',
      label: '所属城市:',
      key: 'city',
      options: [
        {
          value: 1,
          label: '北京'
        },
        {
          value: 2,
          label: '上海'
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true
      },
      w: '100px',
      label: '加盟经理:',
      key: 'gmId'
    },
    {
      type: 3,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true
      },
      w: '100px',
      label: '创建日期:',
      col: 12,
      key: 'createDate'
    },
    {
      type: 'mulBtn',
      col: 12,
      slot: true,
      w: '0px'
    },
    {
      col: 12,
      label: '审核状态:',
      type: 'checkStatus',
      slot: true
    },
    {
      type: 'mulBtns',
      col: 12,
      slot: true,
      w: '0px'
    },
    {
      type: 'fileUrl',
      slot: true,
      w: '0px'
    }
  ]
    private btns:any[] = [
      {
        name: '',
        text: '全部'
      },
      {
        name: '0',
        text: '待审核'
      },
      {
        name: '1',
        text: '审核通过'
      },
      {
        name: '2',
        text: '审核未通过'
      },
      {
        name: '3',
        text: '已退款'
      }
    ]
    private columns:any[] = [
      {
        key: 'refundNumber',
        label: '退费编号',
        'min-width': '140px'
      },
      {
        key: 'driverNumber',
        label: '司机编号',
        'min-width': '140px'
      },
      {
        key: 'driverName',
        label: '司机姓名',
        'min-width': '140px'
      },
      {
        key: 'city',
        label: '所在城市',
        'min-width': '140px'
      },
      {
        key: 'sumAmount',
        label: '账户总金额',
        'min-width': '140px'
      },
      {
        key: 'withdrawalAmount',
        label: '可提现金额',
        'min-width': '140px'
      },
      {
        key: 'refundAmount',
        label: '申请退款金额',
        'width': '120px'
      },
      {
        key: 'refundmethod',
        label: '退款方式',
        'min-width': '140px'
      },
      {
        key: 'refundBankCardNumber',
        label: '退款银行卡号',
        'min-width': '140px'
      },
      {
        key: 'bankDeposit',
        label: '开户行',
        'min-width': '140px'
      },
      {
        key: 'reasonsRefund',
        label: '退款原因',
        'min-width': '140px'
      },
      {
        key: 'gmId',
        label: '加盟经理',
        slot: true,
        'min-width': '140px'
      },
      {
        key: 'receipt',
        label: '是否有收据',
        'min-width': '160px'
      },
      {
        key: 'takeBackReceipt',
        label: '收据是否回收',
        'min-width': '120px'
      },
      {
        key: 'checkStatus',
        label: '审核状态',
        'min-width': '120px'
      },
      {
        key: 'creator',
        label: '创建人',
        'min-width': '120px'
      },
      {
        key: 'createDate',
        label: '创建日期',
        'min-width': '120px'
      },
      {
        key: 'op',
        label: '操作',
        slot: true,
        'width': '160px'
      }
    ];
    // 查询
    handleFilterClick() {
      this.page.page = 1
      this.getLists()
    }
    // 重置
    handleResetClick() {
      this.listQuery = {
        city: [],
        busiType: '',
        gmId: '',
        driverCode: '',
        driverName: '',
        time: []
      }
    }
    private page :PageObj= {
      page: 1,
      limit: 30,
      total: 0
    }
    // 分页
    handlePageSize(page:PageObj) {
      this.page.page = page.page
      this.page.limit = page.limit
      this.getLists()
    }
    // 获取列表
    private async getLists() {
      try {
        let params:IState = {
          page: this.page.page,
          limit: this.page.limit
        }
        let { data: res } = await refundList(params)
        if (res) {
          this.tableData = res.data
          this.page.total = res.page.total
        } else {
          this.$message.error(res.errorMsg)
        }
      } catch (err) {
        console.log(`get list fail:${err}`)
      } finally {
        this.listLoading = false
      }
    }
    get tableHeight() {
      let otherHeight = 440
      return document.body.offsetHeight - otherHeight || document.documentElement.offsetHeight - otherHeight
    }
    private goDetail(id: string | (string | null)[] | null | undefined) {
      this.$router.push({
        path: '/driveraccount/refundapply',
        query: { id: id }
      })
    }
    private handleClick(id: string | (string | null)[] | null | undefined) {
    // this.$router.push({ name: 'accountManageDetail', query: { id: id } })
      this.$router.push({
        path: '/driveraccount/refundapply',
        query: { id: id }
      })
    }
      private multipleSelection: any[] = []
      handleSelectionChange(val:any) {
        this.multipleSelection = val
      }
      // 批量下载
      private handleSelect() {
        if (this.multipleSelection.length === 0) {
          this.$message.error('请先选择')
        } else if (this.multipleSelection.length > 0) {
          this.$message.success('下载成功')
        }
      }
      // 下载
      private handle1Select() {
        if (this.multipleSelection.length === 0) {
          this.$message.success('下载成功')
        }
        // this.getLists()
        console.log(this.multipleSelection)
      }
      // 批量退费
      private handleReturn() {
        if (this.multipleSelection.length === 0) {
          this.$message.error('请先选择')
        } else if (this.multipleSelection.length > 0) {
          this.$message.success('已退费')
        }
      }
      mounted() {
        this.getLists()
      }
}
//  // 判断是否是PC
//   get isPC() {
//     return SettingsModule.isPC
//   }
//   // 打开禁用确认框
//   openDisableUser(row:any) {
//     this.$confirm(`您确定要禁用${row.nickName}吗?`, '提示', {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning'
//     }).then(() => {
//       this.enableOrDisableUser(row)
//     }).catch(() => {
//       this.$message({
//         type: 'info',
//         message: '已取消操作'
//       })
//     })
//   }
//   // 更多操作
//   handleCommandChange(key:string|number, row:any) {
//     if (key === 'edit') { // 编辑
//       this.$router.push({
//         path: '/system/modifyUser',
//         query: {
//           userId: row.id
//         }
//       })
//     } else if (key === 'resetPwd') { // 重置密码
//       this.openResetPassword(row)
//     } else if (key === 'status') { // 重置密码
//       if (row.status === 1) { // 启用
//         this.openDisableUser(row)
//       } else {
//         this.enableOrDisableUser(row)
//       }
//     } else if (key === 'crm') {
//       this.openSendCrmData(row)
//       console.log('crm')
//     }
//   }
//   // 同步crm弹框
//   openSendCrmData(row:any) {
//     this.$confirm(`确定要同步生成${row.nickName}用户的CR账户吗?(注意:确认生成后需要前往激活方可生效)`, '提示', {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning'
//     }).then(() => {
//       this.pushUserToCRM(row)
//     }).catch(() => {
//       this.$message({
//         type: 'info',
//         message: '已取消操作'
//       })
//     })
//   }
//   // 同步用户到crm
//   async pushUserToCRM(row:any) {
//     try {
//       let params = {
//         userId: row.id
//       }
//       let { data: res } = await pushUserToCRM(params)
//       if (res.success) {
//         this.$message.success(`同步CRM账号成功！`)
//         this.getLists()
//       } else {
//         // this.$message.error(`同步CRM账号失败！请重新激活或联系统管理员！`)
//         this.$message.error(res.errorMsg)
//       }
//     } catch (err) {
//       console.log(`push userto crm fail:${err}`)
//     }
//   }
//   // 删除顶部表单的选项
//   // 重置表单
//   handleResetClick() {
//     this.listQuery = {
//       status: '',
//       mobile: '',
//       nickName: ''
//     }
//     this.tags = []
//     // this.getLists()
//   }
//   handleFilterClick() {
//     let blackLists = ['status']
//     this.tags = []
//     for (let key in this.listQuery) {
//       if (this.listQuery[key] !== '' && (this.tags.findIndex(item => item.key === key) === -1) && !blackLists.includes(key)) {
//         let name = getLabel(this.formItem, this.listQuery, key)
//         if (name) {
//           this.tags.push({
//             type: 'info',
//             name: name,
//             key: key
//           })
//         }
//       }
//     }
//     this.getLists()
//   }
//   // 打开重置密码的弹框
//   openResetPassword(row:any) {
//     this.$confirm(`确定要将密码重置为手机号吗？`, '提示', {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning'
//     }).then(() => {
//       this.resetPassword(row)
//     }).catch(() => {
//       this.$message({
//         type: 'info',
//         message: '已取消操作'
//       })
//     })
//   }
//   // 重置密码
//   async resetPassword(row:any) {
//     try {
//       let params = {
//         id: row.id
//       }
//       let { data: res } = await resetPassword(params)
//       if (res.success) {
//         this.$message.success('操作成功')
//       } else {
//         this.$message.error(res.errorMsg)
//       }
//     } catch (err) {
//       console.log(`reset password fail:${err}`)
//     }
//   }
// }
</script>
<style lang="scss" scoped>
  .refundList {
    .box{
      width: 100%;
      padding: 20px;
    }
    .btnPc{
       width: 100%;
       padding: 0 40px;
       display: flex;
       flex-flow: row nowrap;
       justify-content: flex-start;
    }
    .btnPc1{
       width: 100%;
       padding: 0 40px;
       display: flex;
       flex-flow: row nowrap;
       justify-content: flex-end;
    }
//flex布局   row横向排列
    .mobile {
      width:100%;
      text-align: center;
      .btnMobile {
        margin-left: 0;
        margin-top: 10px;
        width:80%;
      }
    }
    .middle {
      margin: 10px 0px;
      .count {
        font-size:14px;
        color:#666;
      }
    }
    .SuggestForm {
      width: 100%;
      background: #fff;
      margin-bottom: 10px;
      margin-left:0px!important;
      margin-right:0px!important;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    }
    .el-button{
      margin-right: 10px;
    }
    .table_box {
      padding: 0px 20px 20px 20px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
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
