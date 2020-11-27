<template>
  <div
    v-loading="listLoading"
    class="refundList"
    :class="{
      p15: isPC
    }"
  >
    <div class="box">
      <self-form
        :list-query="listQuery"
        :form-item="formItem"
        size="small"
        label-width="100px"
        class="p15 SuggestForm"
        :pc-col="8"
      >
        <template slot="status">
          <el-badge
            v-for="item in btns"
            :key="item.text"
          >
            <el-button
              type="primary"
              margin-right="20px"
              :plain="item.name !== listQuery.status"
              @click="() => {
                listQuery.status = item.name
                handleFilterClick()
              }"
            >
              {{ item.text }}
            </el-button>
          </el-badge>
        </template>
        <template slot="driverId">
          <el-select
            v-model.trim="listQuery.driverId"
            v-loadmore="loadQueryDriverByKeyword"
            placeholder="请选择"
            reserve-keyword
            :default-first-option="true"
            clearable
            filterable
            remote
            :remote-method="querySearchByKeyword"
            @clear="handleClearQueryDriver"
          >
            <el-option
              v-for="item in driverOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <!-- 插槽 -->
        <div
          slot="mulBtn"
          :class="isPC ? 'btnPc' : 'mobile'"
        >
          <el-button
            v-if="listQuery.status!=='3'"
            v-permission="['/v2/wt-driver-account/refund/create']"
            :class="isPC ? '' : 'btnMobile'"
            @click="goDetail"
          >
            申请退费
          </el-button>
          <template v-if="listQuery.status==='3'">
            <el-button
              v-permission="['/v2/wt-driver-account/refund/batch/reject']"
              :class="isPC ? '' : 'btnMobile'"
              @click="handleReject"
            >
              批量驳回
            </el-button>
            <el-button
              v-permission="['/v2/wt-driver-account/refund/batch/execute']"
              :class="isPC ? '' : 'btnMobile'"
              @click="handleReturn"
            >
              批量退费
            </el-button>
          </template>
          <el-button
            type="primary"
            :class="isPC ? '' : 'btnMobile'"
            @click="handleFilterClick"
          >
            查询
          </el-button>
          <el-button
            v-permission="['/v2/wt-driver-account/refund/export']"
            type="primary"
            :class="isPC ? '' : 'btnMobile'"
            @click="handleExportClick"
          >
            导出
          </el-button>
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            @click="handleResetClick"
          >
            重置
          </el-button>
        </div>
      </self-form>
      <div class="table_box">
        <div class="middle" />
        <self-table
          ref="RefundForm"
          :index="listQuery.status === '3'"
          :is-p30="false"
          :operation-list="[]"
          :table-data="tableData"
          :columns="columns"
          row-key="id"
          :page="page"
          @onPageSize="handlePageSize"
          @selection-change="handleSelectionChange"
        >
          <template v-slot:op="scope">
            <el-button
              type="text"
              size="small"
              @click="handleClick(scope.row)"
            >
              详情
            </el-button>
            <el-button
              v-permission="['/v2/wt-driver-account/refund/approve']"
              type="text"
              size="small"
              :disabled="+scope.row.status === 1 ? false :true"
              @click="handle1Click(scope.row)"
            >
              审核
            </el-button>
            <el-button
              v-permission="['/v2/wt-driver-account/refund/execute']"
              type="text"
              size="small"
              :disabled="+scope.row.status === 3 ? false :true"
              @click="handlerefundClick(scope.row)"
            >
              退费
            </el-button>
            <el-button
              v-permission="['/v2/wt-driver-account/refund/downTemplate']"
              type="text"
              size="small"
              @click="handleDownLoad(scope.row)"
            >
              下载报销模板
            </el-button>
          </template>
        </self-table>
      </div>
      <SelfDialog
        :class="'distributionDialog'"
        :visible.sync="showDialog"
        :confirm="confirm"
        :show-other-button="true"
        other-button-text="驳回"
        title="退费"
        width="500px"
        :destroy-on-close="true"
        :other="handleRejectClick"
        @closed="() => {
          row = {}
        }"
      >
        <p>请审核此条待退费数据,总计退费金额"{{ row.refundAmount }}元"。</p>
      </SelfDialog>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import { SettingsModule } from '@/store/modules/settings'
import { getUserManagerList, enableOrDisableUser, resetPassword, pushUserToCRM } from '@/api/system'
import SelfForm from '@/components/Base/SelfForm.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { HandlePages, lock } from '@/utils/index'
import { refundList, refundExport, refundExecute, refundRejection, batchRefundExecute, refundDownLod } from '@/api/driver-refund.ts'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { getDriverNoAndNameList, getDriverNameByNo } from '@/api/driver'
import { GetOpenCityData, getOfficeByType, getOfficeByTypeAndOfficeId,
  GetDutyListByLevel, GetSpecifiedRoleList } from '@/api/common'
import TableHeader from '@/components/TableHeader/index.vue'
import { options } from 'numeral'
import { identity } from 'lodash'
interface PageObj {
  page:number,
  limit:number,
  total?:number
}
interface IState {
  [key: string]: any;
}
@Component({
  name: 'RefundDetail',
  components: {
    SelfTable,
    SelfForm,
    SelfDialog
  }
})
export default class extends Vue {
  private listLoading:boolean = false;
  private tableData:any[] = [];
  private dutyListOptions:IState[] = [];// 业务线列表
  private gmOptions: any[] = []; // 加盟经理列表
  private multipleSelection: any[] = []
  private showDialog: boolean = false
  private time: any[] = []
  private endDate: any[] = []
  private createDate: any[] = []
  private driverOptions:IState[] = []
  private row:IState = {} // 表格操作传递中间变量
  private searchKeyword:string = ''
  private queryPage:PageObj = {
    page: 0,
    limit: 10
  }
  private listQuery:IState = {
    workCity: [],
    busiType: '',
    joinManagerId: '',
    driverId: '',
    refundApplyId: '',
    status: '',
    time: []
  }
  private formItem:any[] = [
    {
      type: 8,
      key: 'workCity',
      col: 8,
      w: '100px',
      label: '所属城市',
      tagAttrs: {
        placeholder: '请选择所属城市',
        clearable: true,
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'workCity',
        props: {
          lazy: true,
          lazyLoad: this.showWork
        }
      },
      listeners: {
        'change': () => {
          this.listQuery.joinManagerId = ''
          this.resetDriver()
          this.handleClearQueryDriver()
          this.getGmOptions()
        }
      }
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '业务线',
      key: 'busiType',
      options: this.dutyListOptions,
      listeners: {
        'change': () => {
          this.listQuery.joinManagerId = ''
          this.handleClearQueryDriver()
        }
      }
    },
    {
      type: 2,
      key: 'joinManagerId',
      col: 8,
      label: '所属加盟经理',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.gmOptions,
      listeners: {
        'change': this.handleClearQueryDriver
      }
    },
    {
      type: 'driverId',
      slot: true,
      w: '180px',
      label: '司机姓名/编号/手机号',
      key: 'driverId'
    },
    {
      type: 1,
      tagAttrs: {
        maxlength: '20',
        placeholder: '请输入',
        clearable: true,
        filterable: true
      },
      w: '100px',
      label: '退费编号',
      key: 'refundApplyId'
    },
    {
      type: 3,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true
      },
      w: '100px',
      label: '退费申请日期',
      col: 8,
      key: 'time'
    },
    {
      col: 14,
      label: '退费状态',
      type: 'status',
      slot: true
    },
    {
      type: 'mulBtn',
      col: 10,
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
      name: '1',
      text: '待审核'
    },
    {
      name: '3',
      text: '待退费'// 审核通过
    },
    {
      name: '4',
      text: '已退费'
    },
    {
      name: '2',
      text: '审核不通过'
    }
  ]
  private columns:any[] = [
    {
      key: 'refundApplyId',
      label: '退费编号',
      'width': '140px'
    },
    {
      key: 'driverId',
      label: '司机编号',
      'width': '140px'
    },
    {
      key: 'driverName',
      label: '司机姓名',
      'min-width': '140px'
    },
    {
      key: 'workCity',
      label: '所属城市',
      'min-width': '140px'
    },
    {
      key: 'gmName',
      label: '所属加盟经理',
      'min-width': '140px'
    },
    {
      key: 'busiTypeName',
      label: '业务线',
      'min-width': '140px'
    },
    {
      key: 'driverStatusName',
      label: '司机状态',
      'min-width': '140px'
    },
    {
      key: 'accountBalance',
      label: '账户总金额',
      'min-width': '140px'
    },
    {
      key: 'canExtractMoney',
      label: '可提现金额',
      'min-width': '140px'
    },
    {
      key: 'refundAmount',
      label: '申请退款金额',
      'width': '120px'
    },
    {
      key: 'refundMethodName',
      label: '退费方式',
      'min-width': '140px'
    },
    {
      key: 'payeeName',
      label: '持卡人姓名',
      'min-width': '140px'
    },
    {
      key: 'bankDeposit',
      label: '开户行',
      'min-width': '140px'
    },
    {
      key: 'refundBankCardNumber',
      label: '卡号',
      'width': '180px'
    },
    {
      key: 'reasonsRefund',
      label: '退费原因',
      attrs: {
        'show-overflow-tooltip': true
      },
      'min-width': '140px'
    },
    {
      key: 'createDate',
      label: '申请时间',
      'width': '150px'
    },
    {
      key: 'toExamineDate',
      label: '审核时间',
      'width': '150px'
    },
    {
      key: 'creator',
      label: '操作人',
      'min-width': '120px'
    },
    {
      key: 'checkStatus',
      label: '退费状态',
      'min-width': '120px'
    },
    {
      key: 'op',
      label: '操作',
      slot: true,
      'width': '250px',
      fixed: 'right'
    }
  ];
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  get getRefundApplyIds() {
    return this.multipleSelection.map((item:any) => item.refundApplyId)
  }
  // 查询
  handleFilterClick() {
    this.page.page = 1
    this.getLists()
  }
  // 重置
  handleResetClick() {
    this.listQuery = {
      workCity: [],
      busiType: '',
      joinManagerId: '',
      driverId: '',
      refundApplyId: '',
      status: '',
      time: []
    }
  }

  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 获取列表
  // @lock
  private async getLists(this:any) {
    try {
      this.listLoading = true
      let params:IState = {
        page: this.page.page,
        limit: this.page.limit
      }
      if (this.listQuery.time && this.listQuery.time.length > 1) {
        params.startDate = new Date(this.listQuery.time[0]).setHours(0, 0, 0)
        params.endDate = new Date(this.listQuery.time[1]).setHours(23, 59, 59)
      }
      if (this.listQuery.workCity && this.listQuery.workCity.length > 1) {
        params.workCity = this.listQuery.workCity[1]
      }
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.joinManagerId && (params.joinManagerId = this.listQuery.joinManagerId)
      this.listQuery.driverId && (params.key = this.listQuery.driverId)
      this.listQuery.refundApplyId && (params.refundApplyId = this.listQuery.refundApplyId)
      this.listQuery.status !== '' && (params.status = this.listQuery.status)

      let { data: res } = await refundList(params)
      if (res.success) {
        this.tableData = res.data || []
        this.$refs['RefundForm'].toggleRowSelection()
        res.page = await HandlePages(res.page)
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
  // 申请退费
  private goDetail() {
    this.$router.push({
      path: '/driveraccount/refundapply'
    })
  }
  // 详情
  private handleClick(row:IState) {
    console.log(row)
    this.$router.push({
      path: '/driveraccount/refunddetail',
      query: { id: row.refundApplyId }
    })
  }
  // 审核
  private handle1Click(row:IState) {
    this.$router.push({
      path: '/driveraccount/refundaudit',
      query: { id: row.refundApplyId }
    })
  }
  // 批量退费api
  // @lock
  private async handMulRefund() {
    try {
      let params = this.getRefundApplyIds
      const { data: res } = await batchRefundExecute(params)
      if (res.success) {
        this.getLists()
        this.$message({
          type: 'success',
          message: `${this.multipleSelection.length}条退费数据已退费成功`
        })
      } else {
        this.$message.error(res.errorMsg || res.message)
      }
    } catch (err) {
      console.log('退费失败')
    } finally {
      console.log('1')
    }
  }
  // 批量退费
  private handleReturn() {
    if (this.multipleSelection.length === 0) {
      this.$message.error('未勾选待退费数据')
    } else {
      let totalMoney = 0
      this.multipleSelection.forEach((item:any) => {
        totalMoney += item.refundAmount
      })
      this.$confirm(`是否确认将"${this.multipleSelection.length}"条待退费数据,总计退费金额"${totalMoney}",<span style="color:red;">批量退费成功</span>?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        // 此处写个方法调接口
        this.handMulRefund()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
  // 退费
  private async handlerefundClick(row:any) {
    this.row = row
    this.showDialog = true
  }
  // 确认---单条退费
  // @lock
  private async confirm(done: any) {
    try {
      let params = {
        refundApplyId: this.row.refundApplyId
      }
      const { data: res } = await refundExecute(params)
      if (res.success) {
        done()
        this.getLists()
      } else {
        this.$message.error(res.errorMsg || res.message)
      }
    } catch (err) {
      console.log(err)
    } finally {
      console.log('1')
    }
  }
  // 驳回
  private async handleRejectClick(done:any) {
    try {
      let params = [this.row.refundApplyId]
      const res = await refundRejection(params)

      if (res) {
        done()
        this.getLists()
      }
    } catch (err) {
      console.log(err)
    } finally {
      console.log('1')
    }
  }
  // 批量驳回
  private handleReject() {
    if (this.multipleSelection.length === 0) {
      this.$message.error('未勾选待退费数据')
    } else {
      this.$confirm(`是否确认将"${this.multipleSelection.length}"条待退费数据,<span style="color:red;">批量退费驳回</span>?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(async() => {
      // 此处写个方法调接口
        let params = this.getRefundApplyIds
        let res = await this.handleRefundReject(params)
        if (res) {
          setTimeout(() => {
            this.getLists()
          }, 2000)
          this.$message({
            type: 'success',
            message: `${this.multipleSelection.length}条退费数据已审核驳回`
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
  // 批量驳回 和驳回 api
  // @lock
  private async handleRefundReject(refundApplyIds: string[]) {
    try {
      const { data: res } = await refundRejection(refundApplyIds)
      if (res.success) {
        return true
      } else {
        this.$message.error(res.errorMsg || res.message)
      }
    } catch (err) {
      console.log(err)
    } finally {
      console.log('1')
    }
  }

  handleSelectionChange(val:any) {
    console.log(val)
    this.multipleSelection = val
  }

  // 导出
  @lock
  private async handleExportClick() {
    try {
      let params:IState = {}
      if (this.listQuery.time && this.listQuery.time.length > 1) {
        params.startDate = new Date(this.listQuery.time[0]).setHours(0, 0, 0)
        params.endDate = new Date(this.listQuery.time[1]).setHours(23, 59, 59)
      } else {
        return this.$message.error('需要按申请退费时间段进行导出')
      }
      if (this.listQuery.workCity && this.listQuery.workCity.length > 1) {
        params.workCity = this.listQuery.workCity[1]
      }
      this.listQuery.busiType && (params.busiType = this.listQuery.busiType)
      this.listQuery.joinManagerId && (params.joinManagerId = this.listQuery.joinManagerId)
      this.listQuery.driverId && (params.driverId = this.listQuery.driverId)
      this.listQuery.refundApplyId && (params.refundApplyId = this.listQuery.refundApplyId)
      this.listQuery.status !== '' && (params.status = this.listQuery.status)

      const { data } = await refundExport(params)
      if (data.success) {
        this.$message.success('导出成功')
      } else {
        this.$message.error(data.errorMsg || data.message)
      }
    } catch (err) {
      console.log(`export fail:${err}`)
    } finally {
      console.log(`export finish`)
    }
  }
  // 下载
  @lock
  private async handleDownLoad(row:any) {
    try {
      let params = { applyRefundId: row.refundApplyId }
      const { data: res } = await refundDownLod(params)
      if (res.success) {
        this.$message({
          type: 'success',
          message: `下载成功;`
        })
      } else {
        this.$message.error(res.errorMsg || res.message)
      }
    } catch (err) {
      console.log('下载失败', err)
    } finally {
      console.log('1')
    }
  }

  // 获取业务线
  private async getDutyListByLevel() {
    try {
      let params = {
        dutyLevel: 1
      }
      let { data: res } = await GetDutyListByLevel(params)
      if (res.success) {
        let options = res.data.map((item:any) => ({
          label: item.dutyName,
          value: item.id
        }))
        this.dutyListOptions.push({
          label: '全部',
          value: ''
        })
        this.dutyListOptions.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get duty list fail:${err}`)
    }
  }
  // 获取加盟经理列表
  async getGmOptions() {
    try {
      let params:any = {
        roleTypes: [1],
        uri: '/v2/wt-driver-account/refund/queryGM'
      }
      this.listQuery.workCity[1] !== '' && (params.cityCode = this.listQuery.workCity[1])
      let { data: res } = await GetSpecifiedRoleList(params)
      if (res.success) {
        this.gmOptions.splice(0, this.gmOptions.length)
        let gms = res.data.map(function(item: any) {
          return {
            label: item.name,
            value: item.id
          }
        })
        this.gmOptions.push(...gms)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    }
  }
  // 获取司机列表接口
  async loadDriverByKeyword(params:IState) {
    try {
      if (this.listQuery.workCity && this.listQuery.workCity.length > 0) {
        params.workCity = this.listQuery.workCity[1]
      }
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.joinManagerId !== '' && (params.gmId = this.listQuery.joinManagerId)
      let { data: res } = await getDriverNoAndNameList(params, {
        url: '/v2/wt-driver-account/refund/queryDriverList'
      })
      let result:any[] = res.data.map((item:any) => ({
        label: `${item.name}/${item.phone}`,
        value: item.driverId
      }))
      return result
    } catch (err) {
      console.log(`get driver list fail:${err}`)
      return []
    }
  }
  // 获取大区和城市
  private async showWork(node:any, resolve:any) {
    let query: any = {
      parentId: ''
    }
    if (node.level === 1) {
      query.parentId = node.value
    }
    try {
      if (node.level === 0) {
        let nodes = await this.areaAddress({ type: 2 })
        resolve(nodes)
      } else if (node.level === 1) {
        let nodes = await this.cityDetail(query)
        resolve(nodes)
      }
    } catch (err) {
      resolve([])
    }
  }
  private async areaAddress(params: any) {
    try {
      let { data: res } = await getOfficeByType(params)
      if (res.success) {
        const nodes = res.data.map(function(item: any) {
          return {
            value: item.id,
            label: item.name,
            leaf: false
          }
        })
        return nodes
      }
    } catch (err) {
      console.log(`load city by code fail:${err}`)
    }
  }

  private async cityDetail(params: any) {
    let { data: city } = await getOfficeByTypeAndOfficeId(params)
    if (city.success) {
      const nodes = city.data.map(function(item: any) {
        return {
          value: item.areaCode,
          label: item.name,
          leaf: true
        }
      })
      return nodes
    }
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 获取更多司机
  async loadQueryDriverByKeyword(val?:string) {
    val = this.searchKeyword
    this.queryPage.page++
    let params:IState = {
      page: this.queryPage.page,
      limit: this.queryPage.limit
    }
    val !== '' && (params.key = val)

    try {
      let result:IState[] = await this.loadDriverByKeyword(params)
      this.driverOptions.push(...result)
    } finally {
      console.log('finally')
    }
  }
  // 搜索司机
  querySearchByKeyword(val:string) {
    this.queryPage.page = 0
    this.resetDriver()
    this.searchKeyword = val
    this.loadQueryDriverByKeyword(val)
  }
  // 清除司机
  handleClearQueryDriver() {
    this.searchKeyword = ''
    this.resetDriver()
    this.loadQueryDriverByKeyword()
  }
  // 重置司机
  resetDriver() {
    this.listQuery.driverId = ''

    // this.listQuery.joinManagerId = ''
    this.searchKeyword = ''
    let len:number = this.driverOptions.length
    if (len > 0) {
      this.queryPage.page = 0
      this.driverOptions.splice(0, len)
    }
  }
  mounted() {
    this.getLists()
    this.getGmOptions()
    this.getDutyListByLevel()
    this.loadQueryDriverByKeyword()
  }
}
</script>
<style lang="scss" scoped>
  .refundList {
    min-width: 860px;
    .btnPc{
       width: 100%;
       padding: 0 10px;
       display: flex;
       flex-flow: row nowrap;
       justify-content: flex-end;
    }
    .btnPc1{
       width: 100%;
       padding: 0 10px;
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
      margin-right: 8px;
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
  .refundList .SuggestForm >>> .el-button + .el-button{
    margin-left: 0!important;
  }
</style>
