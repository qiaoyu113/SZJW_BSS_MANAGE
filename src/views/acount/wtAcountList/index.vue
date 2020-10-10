<template>
  <div
    class="wtAcountList"
    :class="{
      p15: isPC,
      m15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      label-width="80px"
      class="p15"
      height=""
    >
      <div
        slot="btn1"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
        <el-button
          type="primary"
          :class="isPC ? '' : 'btnMobile'"
          name="driverlist_query_btn"
          size="small"
          @click="handleQueryClick"
        >
          筛选
        </el-button>
        <el-button
          :class="isPC ? '' : 'btnMobile'"
          name="driverlist_reset_btn"
          size="small"
          @click="handleResetClick"
        >
          重置
        </el-button>
        <el-button
          :class="isPC ? '' : 'btnMobile'"
          name="driverlist_offout_btn"
          size="small"
          @click="handleExportClick"
        >
          导出
        </el-button>
      </div>
    </self-form>
    <!-- 表格 -->
    <self-table
      ref="driverListTable"
      v-loading="listLoading"
      height="calc(100vh - 450px)"
      :index="false"
      :operation-list="[]"
      :table-data="tableData"
      :columns="columns"
      :page="page"
      @onPageSize="handlePageSize"
    >
      <template v-slot:driverFinancialFlowInfo="scope">
        <span
          class="active"
          :a="scope"
          @click="goRouter('/driveraccount/financialFlow')"
        >查看司机财务流水</span>
      </template>
      <template v-slot:op="scope">
        <div>
          <el-button
            type="text"
            :disabled="scope.row.status !== 3 && scope.row.canExtractMoney > 0"
            @click="isFreeze(scope.row,1)"
          >
            冻结
          </el-button>
          <el-button
            :disabled="scope.row.status !== 5 && scope.row.canExtractMoney > 0"
            type="text"
            @click="isFreeze(scope.row,2)"
          >
            解冻
          </el-button>
        </div>
      </template>
    </self-table>

    <!--金额操作弹窗-->
    <SelfDialog
      :visible.sync="showDialog.visible"
      :title="showDialog.title"
      :center="true"
      :confirm="confirm"
      @closed="closed"
    >
      <div>
        <self-form
          ref="SelfForm"
          :list-query="freezeForm"
          :form-item="showDialog.name === 1 ? freezeItem : unfreezeItem"
          :rules="freezesRules"
          label-width="140px"
          @onPass="onPass"
        >
          <template slot="isconfirmOrder">
            <div>
              {{ freezeForm.isconfirmOrder === 0 ? '否' : '是' }}
            </div>
          </template>
        </self-form>
      </div>
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
import SelfTable from '@/components/Base/SelfTable.vue'
import { getLabel } from '@/utils/index.ts'
import { getAcountList, accountFreeze, accountUnfreeze, managementExport, orderList, orderDetail, countConfirmByDriver } from '@/api/driver-account'
import { delayTime } from '@/settings.ts'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { HandlePages, phoneReg } from '@/utils/index'
import { GetManagerLists, GetOpenCityData, getOfficeByType, getOfficeByTypeAndOfficeId } from '@/api/common'
interface IState {
  [key: string]: any;
}
interface PageObj {
  page: Number;
  limit: Number;
  total?: Number;
}

@Component({
  name: 'wtAcountList',
  components: {
    SelfForm,
    SelfTable,
    SelfDialog
  }
})
export default class extends Vue {
  private showDialog: any = {
    visible: false,
    title: '提示',
    name: ''
  };
  private listLoading: boolean = false; // loading
  private tags: any[] = []; // 回显label
  private type: string = ''; // 修改加盟经理or分配加盟经理
  private workCityOptions: any[] = []; // 工作城市列表
  private gmOptions: any[] = []; // 加盟经理列表
  private statusOptions: any[] = [];
  private balanceOptions: any[] = [
    { label: '全部', value: 0 },
    { label: '否', value: 2 },
    { label: '是', value: 1 }
  ];
  private busiTypeOptions:any[] = [
    { label: '共享', value: 1 },
    { label: '专车', value: 0 }
  ]
  private nameOptions:any[] = []
  private idOptions:any[] = []
  private orderOptions:any[] = []
  // 表单对象
  private listQuery: IState = {
    workCity: [],
    driverId: '',
    name: '',
    busiType: '',
    joinManagerId: '',
    balance: 0,
    time: []
  };
  // 表单数组
  private formItem: any[] = [
    {
      type: 8,
      key: 'workCity',
      col: 8,
      w: '150px',
      label: '所属城市',
      tagAttrs: {
        placeholder: '请选择所属城市',
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'workCity',
        props: {
          lazy: true,
          lazyLoad: this.showWork
        }
      }
    },
    {
      type: 2,
      key: 'busiType',
      col: 8,
      w: '150px',
      label: '所属业务线',
      tagAttrs: {
        placeholder: '请选择所属业务线',
        name: 'driverList_busiType_select'
      },
      options: this.busiTypeOptions
    },
    {
      type: 2,
      key: 'joinManagerId',
      col: 8,
      w: '150px',
      label: '所属加盟经理',
      tagAttrs: {
        placeholder: '请选择所属加盟经理',
        filterable: true,
        name: 'driverList_gmId_select'
      },
      options: this.gmOptions
    },
    {
      type: 2,
      key: 'name',
      label: '司机姓名',
      col: 8,
      w: '150px',
      tagAttrs: {
        placeholder: '请输入姓名',
        maxlength: 10,
        clearable: true,
        name: 'driverList_name_input'
      },
      options: this.nameOptions
    },
    {
      type: 2,
      key: 'driverId',
      label: '司机编号',
      col: 8,
      w: '150px',
      tagAttrs: {
        placeholder: '请输入司机编号',
        maxlength: 32,
        clearable: true,
        name: 'driverList_driverId_input'
      },
      options: this.idOptions
    },
    {
      type: 4,
      col: 8,
      w: '150px',
      key: 'balance',
      label: '账户余额低于500元',
      tagAttrs: {
        name: 'driverList_balance_radio'
      },
      options: this.balanceOptions
    },
    {
      type: 3,
      w: '150px',
      key: 'time',
      label: '司机创建日期',
      col: 12,
      tagAttrs: {
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '昨天',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
                picker.$emit('pick', [start, start])
              }
            },
            {
              text: '近7天',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '近30天',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        }
      }
    },
    {
      slot: true,
      col: 12,
      w: '0px',
      type: 'btn1'
    }
  ];
  // 表格
  private tableData: any[] = [];
  // 列数组
  private columns: any[] = [
    {
      key: 'driverId',
      label: '司机编号',
      width: '140px'
    },
    {
      key: 'name',
      label: '司机姓名'
    },
    {
      key: 'workCityName',
      label: '所属城市'
    },
    {
      key: 'gmName',
      label: '所属加盟经理'
    },
    {
      key: 'busiTypeName',
      label: '业务线'
    },
    {
      key: 'statusName',
      label: '司机状态'
    },
    {
      key: 'orderStatusName',
      label: '订单状态'
    },
    {
      key: 'driverFinancialFlowInfo',
      label: '司机财务流水信息',
      slot: true,
      width: '180px'
    },
    {
      key: 'freezingMoney',
      label: '冻结金额'
    },
    {
      key: 'canExtractMoney',
      label: '可提现金额'
    },
    {
      key: 'accountBalance',
      label: '账户总金额'
    },
    {
      key: 'cardName',
      label: '持卡人姓名'
    },
    {
      key: 'openingBank',
      label: '开户行',
      width: '120px'
    },
    {
      key: 'cardCode',
      label: '卡号',
      width: '120px'
    },
    {
      key: 'op',
      label: '操作',
      disabled: true,
      slot: true,
      fixed: 'right',
      width: this.isPC ? '150px' : '50px'
    }
  ];
  // columnData
  private columnData:any = {}
  private freezeForm:any = {
    driverId: '',
    name: '',
    orderId: '',
    orderStatus: '',
    orderStatusName: '',
    freezingMoney: '',
    canExtractMoney: '',
    applyForAccountFrozen: '', // 申请冻结金额
    frozenReason: '',
    unfrozenReason: '',
    applyForAccountUnfrozen: '',
    isconfirmOrder: ''
  }
  private freezeItem:any[] = [
    {
      type: 7,
      key: 'driverId',
      label: '司机编号：',
      col: 24
    },
    {
      type: 7,
      key: 'name',
      label: '司机姓名：',
      col: 24
    },
    {
      type: 2,
      key: 'orderId',
      col: 24,
      label: '选择订单：',
      tagAttrs: {
        placeholder: '请选择订单'
      },
      options: this.orderOptions
    },
    {
      type: 7,
      key: 'orderStatusName',
      label: '订单状态：',
      col: 24
    },
    {
      type: 7,
      key: 'freezingMoney',
      label: '冻结金额：',
      col: 24
    },
    {
      type: 7,
      key: 'canExtractMoney',
      label: '可提现金额：',
      col: 24
    },
    {
      type: 1,
      key: 'applyForAccountFrozen',
      col: 24,
      label: '申请冻结金额：',
      tagAttrs: {
        placeholder: '请输入申请冻结金额',
        maxlength: 10,
        'show-word-limit': true,
        clearable: true
      }
    },
    {
      type: 1,
      key: 'frozenReason',
      label: '冻结原因：',
      col: 24,
      tagAttrs: {
        placeholder: '请填写最多50个字',
        type: 'textarea',
        maxlength: 50,
        'show-word-limit': true,
        clearable: true,
        rows: '4'
      }
    }
  ]
  private unfreezeItem:any[] = [
    {
      type: 7,
      key: 'driverId',
      label: '司机编号：',
      col: 24
    },
    {
      type: 7,
      key: 'name',
      label: '司机姓名：',
      col: 24
    },
    {
      type: 2,
      key: 'orderId',
      col: 24,
      label: '选择订单：',
      tagAttrs: {
        placeholder: '请选择订单'
      },
      options: this.orderOptions
    },
    {
      type: 7,
      key: 'orderStatusName',
      label: '订单状态：',
      col: 24
    },
    {
      type: 'isconfirmOrder',
      label: '订单执行期间运费是否有未确认：',
      col: 24,
      slot: true
    },
    {
      type: 7,
      key: 'freezingMoney',
      label: '冻结金额：',
      col: 24
    },
    {
      type: 7,
      key: 'canExtractMoney',
      label: '可提现金额：',
      col: 24
    },
    {
      type: 1,
      key: 'applyForAccountUnfrozen',
      col: 24,
      label: '申请解冻金额：',
      tagAttrs: {
        placeholder: '请输入申请解冻金额',
        maxlength: 10,
        'show-word-limit': true,
        clearable: true
      }
    },
    {
      type: 1,
      key: 'unfrozenReason',
      label: '申请解冻原因：',
      col: 24,
      tagAttrs: {
        placeholder: '请填写最多50个字',
        type: 'textarea',
        maxlength: 50,
        'show-word-limit': true,
        clearable: true,
        rows: '4'
      }
    }
  ]
  private freezesRules:any = {
    orderId: [
      { required: true, message: '请选择司机', trigger: 'blur' }
    ],
    applyForAccountFrozen: [
      { required: true, message: '请填写申请冻结金额', trigger: 'blur' },
      { validator: this.checkFrozen(1), trigger: 'blur' }
    ],
    applyForAccountUnfrozen: [
      { required: true, message: '请填写申请解冻金额', trigger: 'blur' },
      { validator: this.checkFrozen(2), trigger: 'blur' }
    ]
  }
  private isPass:Boolean = false
  /**
   *分页对象
   */
  private page: PageObj = {
    page: 1,
    limit: 30,
    total: 0
  };

  /**
   *获取加盟经理列表
   */
  async getManagers() {
    try {
      let params = {
        uri: '/v1/driver/getDriverList'
      }
      let { data: res } = await GetManagerLists(params)
      if (res.success) {
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
      console.log(`get manager fail:${err}`)
    }
  }

  /**
   *获取开通城市
   */
  async getOpenCitys() {
    try {
      let { data: res } = await getOfficeByType({ type: 2 })
      if (res.success) {
        let workCity = res.data.map(function(item: any) {
          return {
            label: item.name,
            value: item.code
          }
        })
        this.workCityOptions.push(...workCity)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get `)
    }
  }

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
        if (node.level === 0) {
          for (let i = 0; i < nodes.length; i++) {
            if (Number(nodes[i].value) === -99) {
              nodes[i].leaf = true
            }
          }
        }
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
  /**
   *获取列表
   */
  async getList() {
    try {
      if (this.listQuery.phone && !phoneReg.test(this.listQuery.phone)) {
        return this.$message.error('请输入正确的手机号')
      }
      this.listLoading = true
      let params: any = {
        limit: this.page.limit,
        page: this.page.page
      }

      this.setData(params)
      let { data: res } = await getAcountList(params)
      this.listLoading = false
      if (res.success) {
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
        this.tableData = res.data
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      this.listLoading = false
      console.log(`get lists fail:`, err)
    }
  }

  // 查询订单列表
  async getOrderList(id:string, type:number) {
    try {
      let params = {
        driverId: id, //
        operateFlag: ''
      }
      if (type === 2) {
        params.operateFlag = 'abort'
      } else {
        params.operateFlag = 'list'
      }
      let { data: res } = await orderList(params)
      if (res.success) {
        let orderOptions = res.data.map((ele:any) => {
          return { label: ele.orderId, value: ele.orderId, state: ele.status }
        })
        this.orderOptions.splice(0, orderOptions.length)
        this.orderOptions.push(...orderOptions)
        if (this.orderOptions.length && this.orderOptions.length === 1) {
          this.freezeForm.orderId = this.orderOptions[0].value
        }
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`fail:${err}`)
    }
  }

  // 查询对应订单详情
  async getOrderDetail(orderId:string) {
    try {
      let params = {
        driverId: this.columnData.driverId,
        operateFlag: 'detial',
        orderId: orderId
      }
      let { data: res } = await orderDetail(params)
      this.freezeForm.orderId = res.data.orderId
      this.freezeForm.orderStatus = res.data.status
      this.freezeForm.orderStatusName = res.data.statusName
      this.freezeForm.freezingMoney = res.data.goodsAmount
    } catch (err) {
      console.log(`fail:${err}`)
    }
  }

  // 开启弹窗 type === 1为冻结，2为解冻
  private isFreeze(item:any, type:number) {
    let title:string = ''
    let name:number = 0
    this.columnData = item
    delete this.columnData.orderId
    delete this.columnData.orderStatus
    delete this.columnData.orderStatusName
    delete this.columnData.freezingMoney
    delete this.columnData.isconfirmOrder
    this.freezeForm = { ...this.freezeForm, ...this.columnData }
    if (type === 1) {
      title = '冻结'
      name = 1
    } else {
      title = '解冻'
      name = 2
    }
    this.showDialog = {
      visible: true,
      title: title,
      name: name
    }
    this.getOrderList(item.driverId, type)
    if (type === 2) {
      this.isSureCheck(item.driverId)
    }
  }

  private async isSureCheck(id:string) {
    let { data: res } = await countConfirmByDriver({ driverId: id })
    if (res.success) {
      this.freezeForm.isconfirmOrder = res.data
    } else {
      this.$message.error(res.errorMsg)
    }
  }

  private closed() {
    this.columnData = {};
    ((this.$refs.SelfForm) as any).resetForm()
  }
  // 确认弹窗
  private confirm(done:any) {
    this.handleValidateForm()
    if (this.isPass) {
      if (this.showDialog.name === 1) {
        this.freezed(done)
      } else {
        this.unfreezed(done)
      }
    }
  }
  /**
   * 冻结
   */
  private async freezed(done:any) {
    let params = { ...this.freezeForm }
    delete params.unfrozenReason
    delete params.applyForAccountUnfrozen
    delete params.isconfirmOrder
    let { data: res } = await accountFreeze(params)
    if (res.success) {
      this.$message.success('冻结成功')
      done()
    } else {
      this.$message.error(res.errorMsg)
    }
  }
  /**
   * 解冻
   */
  private async unfreezed(done:any) {
    let params = { ...this.freezeForm }
    delete params.frozenReason
    delete params.applyForAccountFrozen
    let { data: res } = await accountFreeze(params)
    console.log('unfreezed', res)
    if (res.success) {
      this.$message.success('解冻成功')
      done()
    } else {
      this.$message.error(res.errorMsg)
    }
  }
  private goRouter(url:string) {
    this.$router.push(url)
  }

  private onPass(val:Boolean) {
    console.log('freezeForm', this.freezeForm)
    this.isPass = val
  }
  /**
   *校验表单
   */
  handleValidateForm() {
    ((this.$refs.SelfForm) as any).submitForm()
  }
  /**
   * 查询
   */
  private handleQueryClick() {
    let blackLists = ['status']
    this.tags = []
    for (let key in this.listQuery) {
      if (
        this.listQuery[key] !== '' &&
        this.tags.findIndex((item) => item.key === key) === -1 &&
        !blackLists.includes(key)
      ) {
        let name = getLabel(this.formItem, this.listQuery, key)
        if (name) {
          this.tags.push({
            type: 'info',
            name,
            key: key
          })
        }
      }
    }
    this.getList()
  }
  /**
   *重置
   */
  private handleResetClick() {
    this.listQuery = {
      workCity: [],
      driverId: '',
      name: '',
      busiType: '',
      joinManagerId: '',
      balance: 0,
      time: []
    }
    this.tags = []
    this.getList()
  }
  /**
   * 导出
   */
  private async handleExportClick() {
    if (this.listQuery.time && this.listQuery.time.length === 2) {
      let params: any = {}
      this.setData(params)
      const { data } = await managementExport(params)
      if (data.success) {
        this.$message({
          type: 'success',
          message: '导出成功!'
        })
      } else {
        this.$message.error(data.errorMsg)
      }
    } else {
      this.$message.error('需要按时间段进行导出')
    }
  }

  // params处理
  private setData(params:any) {
    this.listQuery.balance && (params.balance = this.listQuery.balance)
    if (this.listQuery.workCity.length > 0) {
      this.listQuery.workCity && (params.workCity = Number(this.listQuery.workCity[1]))
    }
    this.listQuery.driverId && (params.driverId = this.listQuery.driverId)
    this.listQuery.name && (params.name = this.listQuery.name)
    this.listQuery.busiType !== '' &&
        (params.busiType = this.listQuery.busiType)
    this.listQuery.joinManagerId !== '' && (params.joinManagerId = this.listQuery.joinManagerId)

    if (this.listQuery.time.length > 1) {
      params.startDate = this.listQuery.time[0]
      params.endDate = this.listQuery.time[1] + 86399999
    }
    return params
  }

  /**
   * 分页
   */
  handlePageSize(page: any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }

  // 冻结金额,解冻金额效验 输入效验
  private checkFrozen(type:any) {
    let that = this
    return function(rule:any, value:any, callback:any) {
      if (Number(value) <= Number(that.freezeForm.canExtractMoney)) {
        return callback()
      } else {
        if (type === 1) {
          return callback(new Error('申请冻结金额大于可提现金额'))
        } else {
          return callback(new Error('解冻金额小于订单的冻结金额'))
        }
      }
    }
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  @Watch('listQuery', { deep: true })
  private changeList(val:any) {
    console.log(val)
  }

  @Watch('freezeForm.orderId', { deep: true })
  private changeOrderId(val:any) {
    if (val) {
      this.getOrderDetail(val)
    }
  }

  mounted() {
    this.getList()
    this.getManagers()
    this.getOpenCitys()
  }
}
</script>
<style lang="scss" scoped>
.m15 {
  margin: 15px;
}
.wtAcountList {
  background: #ffffff;
  border-radius: 8px;
  .tableTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px 30px 30px;
    box-sizing: border-box;
  }
  .btnPc {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .active{
    color: #649CEE;
    cursor: pointer;
    text-decoration:underline;
  }
  .mobile {
    width: 100%;
    text-align: center;
  }
  .btnMobile {
    margin-left: 0;
    margin-top: 10px;
    width: 80%;
  }
  .doItem{
    color: #649CEE;
    margin: 0 5px;
    cursor: pointer;
  }
}
</style>

<style scoped>
.wtAcountList >>> .el-form-item__label {
  color: #999;
}
@media screen and (min-width: 700px) {
  .wtAcountList >>> .el-collapse-item__wrap {
    position: absolute;
    z-index: 1000;
    background: #fff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.85);
    right: 15px;
    left: 15px;
  }
  .wtAcountList >>> .el-collapse-item__content {
    padding-bottom: 0px;
  }
}
</style>

<style>
@media screen and (max-width: 700px) {
  .el-message-box__wrapper {
    top: 0 !important;
    left: 5% !important;
    right: 5% !important;
  }
  .el-message-box {
    width: 100%;
  }
}
</style>
