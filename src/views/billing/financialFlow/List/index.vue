<template>
  <div
    v-loading="listLoading"
    class="financialFlowContainer"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      label-width="140px"
      class="p15 SuggestForm"
      :pc-col="8"
    >
      <template slot="driverCode">
        <el-select
          v-model.trim="listQuery.driverCode"
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
            :label="`${item.label}(${item.value})` "
            :value="item.value"
          />
        </el-select>
      </template>
      <template slot="gmId">
        <el-select
          v-model="listQuery.gmId"
          placeholder="请选择"
          clearable
          filterable
          @change="handleGmIdChange"
        >
          <el-option
            v-for="item in gmIdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <div
        slot="mulBtn"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          type="primary"
          @click="handleFilterClick"
        >
          查询
        </el-button>
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          @click="handleResetClick"
        >
          重置
        </el-button>

        <el-button
          v-permission="['/v2/wt-driver-account/flow/export']"
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          @click="handleExportClick"
        >
          导出
        </el-button>
        <el-button
          v-permission="['/v2/wt-driver-account/flow/manual/create']"
          type="primary"
          size="small"
          @click="handleOpenClick"
        >
          手动添加流水
        </el-button>
      </div>
    </self-form>
    <div
      class="table_box"
      style="padding-top:30px;"
    >
      <!-- 表格 -->
      <self-table
        :index="false"
        :is-p30="false"
        :operation-list="[]"
        :table-data="tableData"
        :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
        :columns="columns"
        :page="page"
        @onPageSize="handlePageSize"
      >
        <template v-slot:financialFlowCode="scope">
          <router-link to="#">
            {{ scope.row.financialFlowCode }}
          </router-link>
        </template>
        <template v-slot:inFlowDate="scope">
          {{ scope.row.inFlowDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
        <template v-slot:driverCode="scope">
          <router-link to="#">
            {{ scope.row.driverCode }}
          </router-link>
        </template>
        <template v-slot:busiDate="scope">
          {{ scope.row.busiDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
        <template v-slot:busiMoney="scope">
          <template v-if="scope.row.busiMoney>0">
            +{{ scope.row.busiMoney.toFixed(2) }}
          </template>
          <template v-else>
            {{ scope.row.busiMoney.toFixed(2) }}
          </template>
        </template>
        <template v-slot:inFlowMoney="scope">
          <template v-if="scope.row.inFlowMoney>0">
            +{{ scope.row.inFlowMoney.toFixed(2) }}
          </template>
          <template v-else>
            {{ scope.row.inFlowMoney.toFixed(2) }}
          </template>
        </template>
      </self-table>
    </div>

    <SelfDialog
      :visible.sync="dialogTableVisible"
      title="手动添加流水"
      width="50%"
      :before-close="beforeClose"
      append-to-body
      :confirm="handleConfirmClick"
      :sumbit-again="submitLoading"
      @cancel="beforeClose"
      @closed="handleClosed"
    >
      <self-form
        ref="addFlow"
        :list-query="addForm"
        :form-item="addFormItem"
        label-width="140px"
        class="p15"
        :pc-col="20"
        :rules="rules"
        @onPass="handlePassClick"
      >
        <template slot="amount">
          <el-input
            v-model.trim="addForm.amount"
            v-only-number="{min: 0, max: 99999999.99, precision: 2}"
            placeholder="请输入"
            maxlength="10"
            clearable
          />
        </template>
        <template slot="billingId">
          <el-select
            v-model="addForm.billingId"
            filterable
            :disabled="addForm.orderStatus ? false :true"
            placeholder="请选择"
            @change="changeBillingId"
          >
            <el-option
              v-for="item in billOptons"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </template>
        <template
          slot="driverCode"
        >
          <template v-if="$route.query.id && listQuery.driverCode">
            {{ addForm.driverCode }}
          </template>
          <template v-else>
            <el-select
              v-model.trim="addForm.driverCode"
              v-loadmore="loadDialogDriverByKeyword"
              placeholder="请选择"
              reserve-keyword
              :default-first-option="true"
              filterable
              remote
              :remote-method="dialogSearchByKeyword"
              @change="driverCodeChange"
              @clear="handleClearDialogDriver"
            >
              <el-option
                v-for="item in dialogDriverOptions"
                :key="item.value"
                :label="`${item.label}(${item.value})` "
                :value="item.value"
              />
            </el-select>
          </template>
        </template>
      </self-form>
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { HandlePages, lock } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { getFlowList, exportFlowList, saveFlowData, getOrderListByDriverId, getOrderDetailByDriverId, getDriverListByGmId, getListAll, GetChargeAmountByChargeId } from '@/api/driver-account'
import { getDriverNoAndNameList, getDriverNameByNo } from '@/api/driver'
import { getOfficeByType, getOfficeByTypeAndOfficeId, GetDutyListByLevel, GetSpecifiedRoleList } from '@/api/common'

interface PageObj {
  page:number,
  limit:number,
  total?:number
}

interface IState {
  [key: string]: any;
}

@Component({
  components: {
    SelfTable,
    SelfForm,
    SelfDialog
  }
})
export default class extends Vue {
  private searchKeyword:string = '';
  private dialogKeyword:string = '';
  private queryDriverLoading:boolean = false // 查询区下拉司机搜索框的loading
  private dialogDriverLoading:boolean = false // 弹框下拉司机搜索框的loading
  private dialogDriverOptions:IState[] = [] // 弹框下拉司机列表
  private orderStatus=''
  private orderListOptions:IState[] = [];// 已终止订单列表
  private dutyListOptions:IState[] = [];// 业务线列表
  private gmIdOptions:IState[] = [];// 所属加盟经理列表
  private driverOptions:IState[] = [];// 司机列表
  private billOptons:IState[] = [];// 获取计费类型列表
  private listLoading:boolean = false;
  private dialogTableVisible:boolean = false;
  private submitLoading:boolean = false;
  private isSubmit:boolean = true
  private tableData:any[] = [];
  private columns:any[] = [
    {
      key: 'financialFlowCode',
      label: '财务流水编号',
      slot: true,
      'width': '160px'
    },
    {
      key: 'inFlowDate',
      label: '进流水时间',
      slot: true,
      'width': '150px'
    },
    {
      key: 'inFlowMoney',
      label: '进流水金额',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'driverCode',
      label: '司机编号',
      slot: true,
      'width': '150px'
    },
    {
      key: 'driverName',
      label: '司机姓名',
      'width': '140px'
    },
    {
      key: 'city',
      label: '所属城市',
      'min-width': '140px'
    },
    {
      key: 'busiTypeName',
      label: '业务线',
      'width': '120px'
    },
    {
      key: 'gmName',
      label: '所属加盟经理',
      'min-width': '140px'
    },
    {
      key: 'busiName',
      label: '业务名称',
      'min-width': '140px'
    },
    {
      key: 'busiCode',
      label: '业务流水编号',
      'width': '150px'
    },
    {
      key: 'busiDate',
      label: '业务发生时间',
      slot: true,
      'width': '160px'
    },
    {
      key: 'busiMoney',
      label: '业务发生金额',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'busiWay',
      label: '业务进流水方式',
      'width': '160px'
    },
    {
      key: 'opName',
      label: '操作人',
      'min-width': '120px'
    }
  ];
  private listQuery:IState = {
    city: [],
    busiType: '',
    gmId: '',
    driverCode: '',
    time: []
  }

  private formItem:any[] = [
    {
      type: 8,
      tagAttrs: {
        placeholder: '请选择',
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'city',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: this.showWork
        }
      },
      label: '所属城市',
      key: 'city',
      listeners: {
        'change': this.resetGmId
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
        'change': this.resetGmId
      }
    },
    {
      slot: true,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '所属加盟经理',
      key: 'gmId',
      type: 'gmId'
    },
    {
      type: 'driverCode',
      slot: true,
      label: '司机姓名(司机编号)'
    },
    {
      type: 3,
      col: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      label: '业务发生时间',
      key: 'time'
    },
    {
      type: 'mulBtn',
      col: 24,
      slot: true,
      w: '0px'
    }
  ]

  @Watch('dialogTableVisible')
  onDialogTableVisibleChange(newVal:boolean) {
    if (newVal) {
      if (this.$route.query.id && this.listQuery.driverCode) {
        this.addForm.driverCode = this.listQuery.driverCode
        this.driverCodeChange(this.addForm.driverCode)
      }
    }
  }
  private addForm:IState = {
    driverCode: '',
    driverName: '',
    orderCode: '',
    orderStatus: '',
    billingId: '',
    amount: '',
    reason: ''
  }
  private addFormItem:any[] = [
    {
      type: 'driverCode',
      label: '司机编号:',
      key: 'driverCode',
      slot: true
    },
    {
      type: 7,
      label: '司机姓名:',
      key: 'driverName'
    },
    {
      type: 2,
      label: '选择订单:',
      key: 'orderCode',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true
      },
      options: this.orderListOptions,
      listeners: {
        'change': this.getOrderDetailByDriverIdAndOrderId
      }
    },
    {
      type: 7,
      label: '订单状态:',
      key: 'orderStatus'
    },
    {
      type: 'billingId',
      slot: true,
      label: '计费类型:',
      key: 'billingId'
    },
    {
      type: 'amount',
      label: '申请调流水金额:',
      slot: true,
      key: 'amount'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 50,
        type: 'textarea',
        'show-word-limit': true,
        rows: '5'
      },
      label: '申请调流水原因:',
      key: 'reason'
    }
  ]
  private rules:IState = {
    driverCode: [
      { required: true, message: '请输入司机编号', trigger: ['blur', 'change'] }
    ],
    orderCode: [
      { required: true, message: '请选择订单', trigger: ['blur', 'change'] }
    ],
    billingType: [
      { required: true, message: '请输入计费类型', trigger: ['blur', 'change'] }
    ],
    amount: [
      { required: true, message: '请输入申请调流水金额', trigger: ['blur', 'change'] }
      // { validator: this.validateAmount, trigger: 'blur' }
    ],
    billingId: [
      { required: false, trigger: ['blur', 'change'] }
    ]
  }
  validateAmount(rule:any, value:any, callback:any) {
    if (+value <= 0) {
      return callback(new Error('流水金额不能小于0'))
    } else {
      callback()
    }
  }
  // 表格分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }

  // 查询分页
  private queryPage:PageObj = {
    page: 0,
    limit: 10
  }
  // 弹框分页
  private dialogPage:PageObj = {
    page: 0,
    limit: 10
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 重置加盟经理
  resetGmId() {
    if (this.listQuery.gmId) {
      this.listQuery.gmId = ''
    }
    this.resetDriver()
    this.getGmLists()
    this.loadQueryDriverByKeyword()
  }
  // 加盟经理id发生变化
  handleGmIdChange() {
    this.resetDriver()
    this.queryPage.page = 0
    this.loadQueryDriverByKeyword()
  }
  // 重置司机
  resetDriver() {
    this.listQuery.driverCode = ''
    this.searchKeyword = ''
    let len:number = this.driverOptions.length
    if (len > 0) {
      this.queryPage.page = 0
      this.driverOptions.splice(0, len)
    }
  }
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
    this.resetGmId()
    this.loadQueryDriverByKeyword()
  }
  // 导出
  @lock
  async handleExportClick() {
    try {
      let params:IState = {}
      if (this.listQuery.city && this.listQuery.city.length > 1) {
        params.city = this.listQuery.city[1]
      }
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)

      if (this.listQuery.driverCode) {
        params.driverCode = this.listQuery.driverCode
      }

      if (this.listQuery.time && this.listQuery.time.length > 0) {
        let startDate = new Date(this.listQuery.time[0])
        let endDate = new Date(this.listQuery.time[1])
        params.startDate = startDate.setHours(0, 0, 0)
        params.endDate = endDate.setHours(23, 59, 59)
      } else {
        this.$message.error('请选择业务发生时间')
        return false
      }
      let { data: res } = await exportFlowList(params)
      if (res.success) {
        this.$message.success('操作成功')
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`export excel fail:${err}`)
    }
  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 获取列表
  async getLists() {
    try {
      this.listLoading = true
      let params:IState = {
        page: this.page.page,
        limit: this.page.limit
      }
      if (this.listQuery.city && this.listQuery.city.length > 1) {
        params.city = this.listQuery.city[1]
      }
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)

      if (this.listQuery.time && this.listQuery.time.length > 0) {
        let startDate = new Date(this.listQuery.time[0])
        let endDate = new Date(this.listQuery.time[1])
        params.startDate = startDate.setHours(0, 0, 0)
        params.endDate = endDate.setHours(23, 59, 59)
      }
      if (this.listQuery.driverCode) {
        params.driverCode = this.listQuery.driverCode
      }

      let { data: res } = await getFlowList(params)
      if (res.success) {
        this.tableData = res.data || []
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
  // 弹框关闭
  beforeClose() {
    this.dialogTableVisible = false
  }
  // 司机编号发生变化查司机姓名
  async driverCodeChange(val:string) {
    this.getDriverNameByNo()
    this.resetDialogOrderList()
    this.getOrderListByDriverId()
  }
  // 通过司机id获取司机名字
  async getDriverNameByNo() {
    try {
      if (!this.addForm.driverCode) {
        this.addForm.driverName = ''
        return false
      }
      let params = {
        driverId: this.addForm.driverCode
      }
      let { data: res } = await getDriverNameByNo(params)
      if (res.success) {
        this.addForm.driverName = res.data
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get driver name fail:${err}`)
    }
  }

  // 弹框确认
  handleConfirmClick() {
    ((this.$refs.addFlow) as any).submitForm()
  }
  // 表单验证通过
  handlePassClick(valid:boolean) {
    this.saveData()
  }
  // 关闭弹框
  handleClosed() {
    this.addForm = {
      driverCode: '',
      driverName: '',
      orderCode: '',
      orderStatus: '',
      billingType: '',
      amount: '',
      reason: ''
    }
    this.billOptons = []
    this.resetDialogDriverList()
    this.resetDialogOrderList()
    this.resetDialogbillingId();
    ((this.$refs.addFlow) as any).resetForm()
    this.dialogKeyword = ''
  }
  // 清除订单列表
  resetDialogOrderList() {
    let len:number = this.orderListOptions.length
    if (len > 0) {
      this.orderListOptions.splice(0, len)
    }
    this.addForm.orderCode = ''
    this.addForm.orderStatus = ''
  }
  // 清除计费类型:列表
  resetDialogbillingId() {
    let len:number = this.billOptons.length
    if (len > 0) {
      this.billOptons.splice(0, len)
    }
    this.addForm.billingType = ''
  }
  // 提交弹框表单
  @lock
  async saveData() {
    try {
      this.submitLoading = true
      let params = {
        driverCode: this.addForm.driverCode,
        driverName: this.addForm.driverName,
        orderCode: this.addForm.orderCode,
        orderStatus: this.orderStatus,
        billingId: this.addForm.billingId,
        amount: this.addForm.amount,
        reason: this.addForm.reason
      }
      let { data: res } = await saveFlowData(params)
      if (res.success) {
        this.dialogTableVisible = false
        this.$message.success('操作成功')
        this.getLists()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`save data fail:${err}`)
    } finally {
      setTimeout(() => {
        this.submitLoading = false
      }, 1000)
    }
  }
  // 打开弹框
  handleOpenClick() {
    this.dialogTableVisible = true
  }
  // 根据司机id获取已终止订单列表
  async getOrderListByDriverId() {
    try {
      let params = {
        driverId: this.addForm.driverCode,
        operateFlag: 'abort_deal'
      }
      let { data: res } = await getOrderListByDriverId(params)
      if (res.success) {
        let orderList = res.data.map((item:any) => ({
          label: item.orderId,
          value: item.orderId
        }))
        this.orderListOptions.push(...orderList)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get order list fail:${err}`)
    }
  }
  // 通过司机id和订单id获取订单状态
  async getOrderDetailByDriverIdAndOrderId() {
    try {
      let params:IState = {
        driverId: this.addForm.driverCode,
        operateFlag: 'detial',
        orderId: this.addForm.orderCode
      }
      let { data: res } = await getOrderDetailByDriverId(params)
      if (res.success) {
        this.addForm.orderStatus = res.data.statusName
        this.orderStatus = res.data.status
        this.getBillListAll(res.data.busiType)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get order detail fail:${err}`)
    }
  }

  // 获取客户城市
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
  // 获取大区列表
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
  // 根据大区获取城市列表
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
  async getGmLists() {
    try {
      let len:number = this.gmIdOptions.length
      if (len > 0) {
        this.gmIdOptions.splice(0, len)
      }
      let params:IState = {
        roleTypes: [1],
        uri: '/v2/wt-driver-account/flow/queryGM'
      }
      this.listQuery.busiType !== '' && (params.productLine = this.listQuery.busiType)
      if (this.listQuery.city && this.listQuery.city.length > 1) {
        params.cityCode = this.listQuery.city[1]
      }
      let { data: res } = await GetSpecifiedRoleList(params)
      if (res.success) {
        let options = res.data.map((item:any) => ({
          label: item.name,
          value: item.id
        }))
        this.gmIdOptions.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get gm list fail:${err}`)
    }
  }

  // 获取计费类型列表
  async getBillListAll(busiType:number) {
    try {
      let len = this.billOptons.length
      if (len > 0) {
        this.billOptons.splice(0, len)
      }
      let params:IState = {
        busiType
      }
      let { data: res } = await getListAll(params)
      if (res.success) {
        let options = res.data.map((item:any) => ({
          label: item.sopTypeDesc,
          value: item.id
        }))
        this.billOptons.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get bill list fail:${err}`)
    }
  }
  // 计费类型发生变化获取申请调流水金额
  async changeBillingId() {
    try {
      let params:IState = {
        chargeId: this.addForm.billingId,
        orderId: this.addForm.orderCode
      }
      let { data: res } = await GetChargeAmountByChargeId(params)
      if (res.success) {
        this.addForm.amount = res.data
        this.isSubmit = true
      } else {
        this.$message.error(res.errorMsg)
        this.isSubmit = false
      }
    } catch (err) {
      console.log(`get money fail:${err}`)
    }
  }
  // 顶部司机关键字搜索
  querySearchByKeyword(val:string) {
    this.queryPage.page = 0
    this.resetDriver()
    this.searchKeyword = val
    this.loadQueryDriverByKeyword(val)
  }
  // 顶部查询司机列表
  async loadQueryDriverByKeyword(val?:string) {
    val = this.searchKeyword
    this.queryPage.page++
    let params:IState = {
      page: this.queryPage.page,
      limit: this.queryPage.limit
    }
    val !== '' && (params.key = val)
    this.queryDriverLoading = true
    try {
      let result:IState[] = await this.loadDriverByKeyword(params)
      this.driverOptions.push(...result)
    } finally {
      this.queryDriverLoading = false
    }
  }
  // 弹框司机关键字搜索
  dialogSearchByKeyword(val:string) {
    this.dialogPage.page = 0
    this.resetDialogDriverList()
    this.dialogKeyword = val
    this.loadDialogDriverByKeyword(val)
  }
  // 弹框查询司机列表
  async loadDialogDriverByKeyword(val?:string) {
    val = this.dialogKeyword
    this.dialogPage.page++
    let params:IState = {
      page: this.dialogPage.page,
      limit: this.dialogPage.limit
    }
    val !== '' && (params.key = val)
    this.dialogDriverLoading = true
    try {
      let result:IState[] = await this.loadDriverByKeyword(params)
      this.dialogDriverOptions.push(...result)
    } finally {
      this.dialogDriverLoading = false
    }
  }
  // 重置弹框的司机列表
  resetDialogDriverList() {
    let len:number = this.dialogDriverOptions.length
    if (len > 0) {
      this.dialogDriverOptions.splice(0, len)
    }
    this.dialogPage.page = 0
  }
  // 根据关键字查司机id
  async loadDriverByKeyword(params:IState) {
    try {
      if (this.listQuery.city && this.listQuery.city.length > 0) {
        params.workCity = this.listQuery.city[1]
      }
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)
      let { data: res } = await getDriverNoAndNameList(params, {
        url: '/v2/wt-driver-account/flow/queryDriverList'
      })
      let result:any[] = res.data.map((item:any) => ({
        label: item.name,
        value: item.driverId
      }))
      return result
    } catch (err) {
      console.log(`get driver list fail:${err}`)
      return []
    }
  }
  // 删除查询区选中的司机
  handleClearQueryDriver() {
    this.searchKeyword = ''
    this.resetDriver()
    this.loadQueryDriverByKeyword()
  }
  // 删除弹框选中的司机
  handleClearDialogDriver() {
    this.resetDialogDriverList()
    this.loadDialogDriverByKeyword()
    this.dialogKeyword = ''
  }
  init() {
    if (this.$route.query.id) {
      this.listQuery.driverCode = this.$route.query.id
    }
    this.getLists()
    this.getDutyListByLevel()
    this.getGmLists()
    this.loadQueryDriverByKeyword()
  }
  mounted() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
  .financialFlowContainer {
    .btnPc {
       width: 100%;
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
    .SuggestForm {
      width: 100%;
      background: #fff;
      margin-bottom: 10px;
      margin-left:0px!important;
      margin-right:0px!important;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    }
    .table_box {
      padding: 0px 30px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
  }
</style>
