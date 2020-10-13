<template>
  <div
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
      label-width="80px"
      class="p15 SuggestForm"
      :pc-col="8"
    >
      <template slot="driverCode">
        <el-select
          v-model="listQuery.driverCode"
          :disabled="listQuery.gmId!== '' ? false :true"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in driverOptions"
            :key="item.value"
            :label="`${item.label}/${item.value}` "
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
          @change="getDriverLists"
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
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          @click="handleExportClick"
        >
          导出
        </el-button>
      </div>
    </self-form>
    <div class="table_box">
      <div class="middle">
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="small"
          @click="handleOpenClick"
        >
          手动添加流水
        </el-button>
      </div>
      <!-- 表格 -->
      <self-table
        v-loading="listLoading"
        :index="false"
        :height="tableHeight"
        :is-p30="false"
        :operation-list="[]"
        :table-data="tableData"
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
          {{ scope.row.inFlowDate | parseTime('{y}-{m}-{d}') }}
        </template>
        <template v-slot:driverCode="scope">
          <router-link to="#">
            {{ scope.row.driverCode }}
          </router-link>
        </template>
        <template v-slot:busiDate="scope">
          {{ scope.row.busiDate | parseTime('{y}-{m}-{d}') }}
        </template>
      </self-table>
    </div>

    <SelfDialog
      :visible.sync="dialogTableVisible"
      title="手动添加流水"
      width="50%"
      :before-close="beforeClose"
      :cancel="beforeClose"
      :confirm="handleConfirmClick"
      append-to-body
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
      </self-form>
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { HandlePages } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { getFlowList, exportFlowList, saveFlowData, getOrderListByDriverId, getOrderDetailByDriverId, getDriverListByGmId, getListAll } from '@/api/driver-account'
import { GetDriverListByKerWord } from '@/api/driver'
import { getOfficeByType, getOfficeByTypeAndOfficeId, GetDutyListByLevel, GetSpecifiedRoleList } from '@/api/common'
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
    SelfForm,
    SelfDialog
  }
})
export default class extends Vue {
  private orderListOptions:IState[] = [];// 已终止订单列表
  private dutyListOptions:IState[] = [];// 业务线列表
  private gmIdOptions:IState[] = [];// 所属加盟经理列表
  private driverOptions:IState[] = [];// 司机列表
  private billOptons:IState[] = [];// 获取计费类型列表
  private listLoading:boolean = false;
  private dialogTableVisible:boolean = false;
  private tableData:any[] = [];
  private columns:any[] = [
    {
      key: 'financialFlowCode',
      label: '财务流水编号',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'inFlowDate',
      label: '进流水时间',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'inFlowMoney',
      label: '进流水金额',
      'min-width': '140px'
    },
    {
      key: 'driverCode',
      label: '司机编号',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'driverName',
      label: '司机姓名',
      'min-width': '140px'
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
      'min-width': '140px'
    },
    {
      key: 'busiDate',
      label: '业务发生时间',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'busiMoney',
      label: '业务发生金额',
      'min-width': '140px'
    },
    {
      key: 'busiWay',
      label: '业务进流水方式',
      'min-width': '160px'
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
        props: {
          lazy: true,
          lazyLoad: this.showWork
        }
      },
      label: '所属城市:',
      w: '100px',
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
      w: '100px',
      label: '业务线:',
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
      label: '所属加盟经理:',
      w: '100px',
      key: 'gmId',
      type: 'gmId'
    },
    {
      type: 'driverCode',
      slot: true,
      label: '司机姓名:'
    },
    {
      type: 3,
      col: 10,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      label: '业务发生时间:',
      w: '120px',
      key: 'time'
    },
    {
      type: 'mulBtn',
      col: 14,
      slot: true,
      w: '0px'
    }
  ]
  @Watch('listQuery', { deep: true })
  onChange(newVal:IState, oldVal:IState) {
    if (newVal.city.length > 0 && this.listQuery.busiType !== '') {
      this.getGmLists()
    }
  }
  private addForm:IState = {
    driverCode: '',
    driverName: '',
    orderCode: '',
    orderStatus: '',
    billingType: '',
    amount: '',
    reason: ''
  }
  private addFormItem:any[] = [
    {
      type: 1,
      label: '司机编号:',
      key: 'driverCode',
      listeners: {
        'change': this.driverCodeChange
      }
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
        clearable: true,
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
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '计费类型:',
      key: 'billingType',
      options: this.billOptons
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
      { required: true, message: '请输入司机编号', trigger: 'blur' },
      { min: 14, max: 14, message: '司机编号必须是14个字符', trigger: 'blur' }
    ],
    orderCode: [
      { required: true, message: '请选择选择订单', trigger: 'blur' }
    ],
    billingType: [
      { required: true, message: '请输入计费类型', trigger: 'blur' }
    ],
    amount: [
      { required: true, message: '请输入申请调流水金额', trigger: 'blur' }
    ]
  }
  // 分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  get tableHeight() {
    let otherHeight = 440
    return document.body.offsetHeight - otherHeight || document.documentElement.offsetHeight - otherHeight
  }
  // 重置加盟经理
  resetGmId() {
    if (this.listQuery.gmId) {
      this.listQuery.gmId = ''
    }
    this.resetDriver()
  }
  // 重置司机
  resetDriver() {
    this.listQuery.driverCode = ''
    this.listQuery.driverName = ''
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
  }
  // 导出
  async handleExportClick() {
    try {
      let params:IState = {}
      if (this.listQuery.city && this.listQuery.city.length > 1) {
        params.city = this.listQuery.city[1]
      }
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)
      this.listQuery.driverCode !== '' && (params.driverCode = this.listQuery.driverCode)
      // this.listQuery.driverName !== '' && (params.driverName = this.listQuery.driverName)

      if (this.listQuery.time && this.listQuery.time.length > 0) {
        let startDate = new Date(this.listQuery.time[0])
        let endDate = new Date(this.listQuery.time[1])
        params.startDate = startDate.setHours(0, 0, 0)
        params.endDate = endDate.setHours(23, 59, 59)
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
      this.listQuery.driverCode !== '' && (params.driverCode = this.listQuery.driverCode)
      // this.listQuery.driverName !== '' && (params.driverName = this.listQuery.driverName)

      if (this.listQuery.time && this.listQuery.time.length > 0) {
        let startDate = new Date(this.listQuery.time[0])
        let endDate = new Date(this.listQuery.time[1])
        params.startDate = startDate.setHours(0, 0, 0)
        params.endDate = endDate.setHours(23, 59, 59)
      }

      let { data: res } = await getFlowList(params)
      if (res.success) {
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
  // 弹框关闭
  beforeClose() {
    this.dialogTableVisible = false
  }
  // 司机编号发生变化
  async driverCodeChange(val:string) {
    if (val.length === 14) {
      let data:IState[] = await this.getDriverByKeyWord(val)
      if (data.length > 0) {
        this.addForm.driverName = data[0].name
        this.getOrderListByDriverId()
      } else {
        this.addForm.driverName = ''
      }
      let len:number = this.orderListOptions.length
      if (len > 0) {
        this.orderListOptions.splice(0, len)
      }
    }
  }
  // 通过关键字搜索司机
  async getDriverByKeyWord(keyword:string) {
    try {
      let params:IState = {
        page: 1,
        limit: 9999
      }
      keyword && (params.key = keyword)
      let { data: res } = await GetDriverListByKerWord(params)
      if (res.success) {
        return res.data
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get driver fail:${err}`)
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
  }
  // 提交弹框表单
  async saveData() {
    try {
      let params = {
        driverCode: this.addForm.driverCode,
        driverName: this.addForm.driverName,
        orderCode: this.addForm.orderCode,
        orderStatus: this.addForm.orderStatus,
        billingType: this.addForm.billingType,
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
        operateFlag: 'list'
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
        operateFlag: 'detail',
        orderId: this.addForm.orderCode
      }
      let { data: res } = await getOrderDetailByDriverId(params)
      if (res.success) {
        this.addForm.orderStatus = res.data.statusName
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
        roleType: 1
      }
      this.listQuery.busiType !== '' && (params.productLine = this.listQuery.busiTyp)
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
  // 通过加盟经理获取司机列表
  async getDriverLists() {
    try {
      this.resetDriver()
      let len = this.driverOptions.length
      if (len > 0) {
        this.driverOptions.splice(1, len)
      }
      let params = {
        gmId: this.listQuery.gmId
      }
      let { data: res } = await getDriverListByGmId(params)
      if (res.success) {
        let options = res.data.map((item:any) => ({
          label: item.name,
          value: item.driverId
        }))
        this.driverOptions.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get driver lists fail:${err}`)
    }
  }
  // 获取计费类型列表
  async getBillListAll() {
    try {
      let len = this.billOptons.length
      if (len > 0) {
        this.billOptons.splice(0, len)
      }
      let { data: res } = await getListAll()
      if (res.success) {
        let options = res.data.map((item:any) => ({
          label: item.sopDesc,
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
  mounted() {
    this.getLists()
    this.getDutyListByLevel()
    this.getBillListAll()
    this.getGmLists()
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
    .middle {
      margin: 10px 0px;
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
