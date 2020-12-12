<template>
  <div
    v-loading="listLoading"
    class="wtAcountList"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      label-width="160px"
      size="small"
      class="p15"
    >
      <template
        slot="driverId"
      >
        <div>
          <el-select
            v-model="listQuery.driverId"
            v-loadmore="loadmore"
            filterable
            clearable
            remote
            reserve-keyword
            :default-first-option="true"
            :remote-method="remoteMethod"
            :loading="driverLoading"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) in driverOtions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </template>
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
          查询
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
          v-permission="['/v2/wt-driver-account/management/export']"
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
    <div class="table_box">
      <div class="middle">
        <div
          class="count"
          v-text="`筛选结果（${page.total}条）`"
        />
      </div>
      <self-table
        ref="driverListTable"

        :height="tableHeight"
        :is-p30="false"
        :index="false"
        :operation-list="[]"
        :table-data="tableData"
        :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
        :columns="columns"
        :page="page"
        @onPageSize="handlePageSize"
      >
        <template v-slot:driverFinancialFlowInfo="scope">
          <span
            class="active"
            @click="goRouter(scope.row.driverId)"
          >查看司机财务流水</span>
        </template>
        <template v-slot:op="scope">
          <div>
            <el-button
              v-permission="['/v2/wt-driver-account/management/freeze']"
              type="text"
              :disabled="!(scope.row.haveDealNumber > 0 && scope.row.canExtractMoney > 0)"
              @click="isFreeze(scope.row,1)"
            >
              冻结
            </el-button>

            <el-button
              v-permission="['/v2/wt-driver-account/management/unfreeze']"
              :disabled="!(scope.row.haveAbortNumber > 0 && scope.row.freezingMoney > 0)"
              type="text"
              @click="isFreeze(scope.row,2)"
            >
              解冻
            </el-button>
          </div>
        </template>
      </self-table>
    </div>

    <!--金额操作弹窗-->
    <SelfDialog
      :visible.sync="showDialog.visible"
      :title="showDialog.title"
      :center="true"
      :confirm="confirm"
      :sumbit-again="sumbitAgain"
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
          <template
            v-if="showDialog.name === 1"
            slot="applyForAccountFrozen"
          >
            <div>
              <el-input
                v-model="freezeForm.applyForAccountFrozen"
                v-only-number="{min: 0, max: 99999999.99, precision: 2}"
                placeholder="请输入"
                clearable
              />
            </div>
          </template>
          <template slot="applyForAccountUnfrozen">
            <div>
              <el-input
                v-model="freezeForm.applyForAccountUnfrozen"
                v-only-number="{min: 0, max: 99999999.99, precision: 2}"
                placeholder="请输入"
                clearable
              />
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
import { getLabel, lock } from '@/utils/index.ts'
import { getAcountList, accountFreeze, accountUnfreeze, managementExport, orderList, orderDetail, countConfirmByDriver, orderMoney, orderCanExtractMoney } from '@/api/driver-account'
import { getDriverNoAndNameList } from '@/api/driver'
import { delayTime } from '@/settings.ts'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { HandlePages, phoneReg } from '@/utils/index'
import { GetOpenCityData, getOfficeByType, getOfficeByTypeAndOfficeId, GetDutyListByLevel, GetSpecifiedRoleList } from '@/api/common'
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
  private keyWord:String = ''
  private sumbitAgain:Boolean = false
  private fullscreenLoading:Boolean = false
  private driverLoading:Boolean = false
  private driverOver:Boolean = false
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
  private busiTypeOptions:any[] = []
  private keyOptions:any[] = []
  private driverOtions:any[] = []
  private orderOptions:any[] = []
  private getGmStatus:Boolean = true
  private getDriverStatus:Boolean = true
  private driverPage:any = {
    page: 1,
    limit: 20
  }
  // 表单对象
  private listQuery: IState = {
    workCity: [],
    driverId: '',
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
      // w: '80px',
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
      }
    },
    {
      type: 2,
      key: 'busiType',
      col: 8,
      label: '所属业务线',
      tagAttrs: {
        placeholder: '请选择所属业务线',
        name: 'driverList_busiType_select',
        clearable: true
      },
      options: this.busiTypeOptions
    },
    {
      type: 2,
      key: 'joinManagerId',
      col: 8,
      label: '所属加盟经理',
      tagAttrs: {
        placeholder: '请选择所属加盟经理',
        filterable: true,
        clearable: true
      },
      options: this.gmOptions
    },
    {
      type: 'driverId',
      label: '司机姓名(司机编号)',
      key: 'driverId',
      col: 8,
      slot: true
    },
    {
      type: 4,
      col: 12,
      key: 'balance',
      label: '账户余额低于500元',
      tagAttrs: {
        name: 'driverList_balance_radio'
      },
      options: this.balanceOptions
    },
    {
      type: 3,
      key: 'time',
      label: '司机创建日期',
      col: 12,
      tagAttrs: {
        clearable: true,
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
    reason: '',
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
      type: 'applyForAccountFrozen',
      label: '申请冻结金额：',
      key: 'applyForAccountFrozen',
      col: 24,
      slot: true
    },
    {
      type: 1,
      key: 'reason',
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
      type: 7,
      key: 'isconfirmOrder',
      label: '订单执行期间运费是否有未确认：',
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
      type: 'applyForAccountUnfrozen',
      key: 'applyForAccountUnfrozen',
      label: '申请解冻金额：',
      col: 24,
      slot: true
    },
    {
      type: 1,
      key: 'reason',
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
      { required: true, message: '请选择订单', trigger: ['blur', 'change'] }
    ],
    applyForAccountFrozen: [
      { required: true, message: '请填写申请冻结金额', trigger: ['blur', 'change'] },
      { validator: this.checkFrozen(1), trigger: ['blur', 'change'] }
    ],
    applyForAccountUnfrozen: [
      { required: true, message: '请填写申请解冻金额', trigger: ['blur', 'change'] },
      { validator: this.checkFrozen(2), trigger: ['blur', 'change'] }
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

  /**
   * 获取组织
   */
  async getOffices() {
    try {
      let params = {
        dutyLevel: 1
      }
      let { data: res } = await GetDutyListByLevel(params)
      if (res.success) {
        let options = res.data.map((item:any) => ({
          label: item.dutyName,
          value: item.id
        })).filter((ele:any) => {
          return (ele.label === '共享' || ele.label === '专车')
        })
        this.busiTypeOptions.push({ label: '全部', value: '' }, ...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get duty list fail:${err}`)
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
  private async getList() {
    try {
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
        this.tableData = res.data || []
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      this.listLoading = false
      console.log(`get lists fail:`, err)
    }
  }

  // 查询订单列表
  private async getOrderList(id:string, type:number) {
    try {
      let params = {
        driverId: id,
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
        if (type === 2) {
          this.orderOptions.push(...orderOptions)
        } else {
          orderOptions = orderOptions.filter((ele:any) => {
            return ele.state === 30
          })
          this.orderOptions.push(...orderOptions)
        }
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

  // 查询对应订单的冻结金额
  private async getMoney(orderId:string) {
    try {
      let params = { orderId: orderId }
      let { data: res } = await orderMoney(params)
      if (res.success) {
        this.freezeForm.freezingMoney = res.data
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`fail:${err}`)
    }
  }

  // 查询对应订单的可提现金额
  private async getCanExtractMoney(driverId:string) {
    try {
      let params = { driverId: driverId }
      let { data: res } = await orderCanExtractMoney(params)
      if (res.success) {
        this.freezeForm.canExtractMoney = res.data
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`fail:${err}`)
    }
  }

  // 查询对应订单详情
  private async getOrderDetail(orderId:string) {
    try {
      let params = {
        driverId: this.columnData.driverId,
        operateFlag: 'detial',
        orderId: orderId
      }
      let { data: res } = await orderDetail(params)
      if (res.success) {
        this.freezeForm.orderId = res.data.orderId
        this.freezeForm.orderStatus = res.data.status
        this.freezeForm.orderStatusName = res.data.statusName
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`fail:${err}`)
    }
  }

  // 开启弹窗 type === 1为冻结，2为解冻
  private async isFreeze(item:any, type:number) {
    let title:string = ''
    let name:number = 0
    this.columnData = item
    this.freezeForm = { ...this.freezeForm, ...this.columnData }
    this.freezeForm.freezingMoney = null
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
    await this.getOrderList(item.driverId, type)
    await this.getCanExtractMoney(item.driverId)
  }

  private async isSureCheck(id:string) {
    let { data: res } = await countConfirmByDriver({ orderId: id })
    if (res.success) {
      this.freezeForm.isconfirmOrder = (res.data ? '是' : '否')
    } else {
      this.$message.error(res.errorMsg)
    }
  }

  private closed() {
    this.sumbitAgain = false
    this.columnData = {};
    ((this.$refs.SelfForm) as any).resetForm()
    let len:number = this.orderOptions.length
    if (len > 0) {
      this.orderOptions.splice(0, len)
    }
  }
  // 确认弹窗
  private async confirm(done:any) {
    try {
      this.handleValidateForm()
      if (this.isPass) {
        this.sumbitAgain = true
        if (this.showDialog.name === 1) {
          await this.freezed()
        } else {
          await this.unfreezed()
        }
        setTimeout(() => {
          this.sumbitAgain = false
        }, 1500)
      }
    } catch (err) {
      console.log(`err:${err}`)
    } finally {
      done()
    }
  }
  /**
   * 冻结
   */
  @lock
  private async freezed() {
    let params = { ...this.freezeForm }
    delete params.applyForAccountUnfrozen
    delete params.isconfirmOrder
    delete params.reason
    this.freezeForm.reason && (params.reason = this.freezeForm.reason)
    params.freezeMeltMoney = params.applyForAccountFrozen
    let { data: res } = await accountFreeze(params)
    if (res.success) {
      this.$message.success('冻结成功')
      setTimeout(() => {
        this.getList()
      }, delayTime)
    } else {
      this.$message.error(res.errorMsg)
    }
  }
  /**
   * 解冻
   */
  @lock
  private async unfreezed() {
    let params = { ...this.freezeForm }
    delete params.applyForAccountFrozen
    delete params.reason
    params.freezeMeltMoney = params.applyForAccountUnfrozen
    this.freezeForm.reason && (params.reason = this.freezeForm.reason)
    let { data: res } = await accountUnfreeze(params)
    if (res.success) {
      this.$message.success('解冻成功')
      setTimeout(() => {
        this.getList()
      }, delayTime)
    } else {
      this.$message.error(res.errorMsg)
    }
  }
  private goRouter(id:string) {
    this.$router.push({ path: '/driveraccount/financialFlow', query: { id: id } })
  }

  private onPass(val:Boolean) {
    this.isPass = val
  }
  /**
   *校验表单
   */
  private handleValidateForm() {
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
      busiType: '',
      joinManagerId: '',
      balance: 0,
      time: []
    }
    this.tags = []
    // this.getList()
    this.driverPage.page = 1
    this.driverOver = false
    this.driverOtions.splice(0, this.driverOtions.length)
    this.getDriverInfo()
  }
  /**
   * 导出
   */
  @lock
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
      this.$message.error('请选择司机创建日期')
    }
  }

  // params处理
  private setData(params:any) {
    params.balance = this.listQuery.balance
    if (this.listQuery.workCity.length > 0) {
      this.listQuery.workCity && (params.workCity = Number(this.listQuery.workCity[1]))
    }
    this.listQuery.driverId && (params.driverCode = this.listQuery.driverId)
    this.listQuery.busiType !== '' &&
        (params.busiType = this.listQuery.busiType)
    this.listQuery.joinManagerId !== '' && (params.joinManagerId = this.listQuery.joinManagerId)

    if (this.listQuery.time.length > 1) {
      params.startDate = new Date(this.listQuery.time[0]).setHours(0, 0, 0)
      params.endDate = new Date(this.listQuery.time[1]).setHours(23, 59, 59)
    }
    return params
  }

  /**
   * 分页
   */
  private handlePageSize(page: any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }

  // 冻结金额,解冻金额效验 输入效验
  private checkFrozen(type:any) {
    let that = this
    return function(rule:any, value:any, callback:any) {
      if (type === 1) {
        if (Number(value) === 0) {
          return callback(new Error('申请冻结金额不能为0'))
        }
        if (Number(value) <= Number(that.freezeForm.canExtractMoney)) {
          return callback()
        } else {
          return callback(new Error('申请冻结金额大于可提现金额'))
        }
      } else {
        if (Number(value) === 0) {
          return callback(new Error('解冻金额不能为0'))
        }
        if (Number(value) <= Number(that.freezeForm.freezingMoney)) {
          return callback()
        } else {
          return callback(new Error('解冻金额大于订单的冻结金额'))
        }
      }
    }
  }

  async getGmOptions() {
    try {
      let params:any = {
        roleTypes: [1],
        uri: '/v2/wt-driver-account/management/queryGM'
      }
      this.listQuery.workCity[1] !== '' && (params.cityCode = this.listQuery.workCity[1])
      this.listQuery.busiType !== '' && (params.productLine = this.listQuery.busiType)
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

  async getDriverInfo(keyWord:any = '') {
    try {
      this.keyWord = keyWord
      let params = {
        workCity: this.listQuery.workCity[1] || '',
        busiType: this.listQuery.busiType,
        gmId: this.listQuery.joinManagerId || '',
        key: ''
      }
      keyWord !== '' && (params.key = keyWord)
      params = { ...params, ...this.driverPage }
      if (this.driverOver) {
        return
      }
      let { data: res } = await getDriverNoAndNameList(params, {
        url: '/v2/wt-driver-account/management/queryDriverList'
      })
      if (res.success) {
        if (res.data.length && res.data.length > 0 && res.data.length === this.driverPage.limit) {
          this.driverPage.page++
        } else {
          this.driverOver = true
        }
        let driverInfos = res.data.map(function(item: any) {
          return {
            label: `${item.name}(${item.driverId})`,
            value: item.driverId
          }
        })
        this.driverOtions.push(...driverInfos)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    }
  }

  private loadmore() {
    this.getDriverInfo(this.keyWord)
  }

  private async remoteMethod(query:any) {
    this.keyWord = query
    this.driverLoading = true
    this.driverPage.page = 1
    this.driverOver = false
    this.driverOtions.splice(0, this.driverOtions.length)
    await this.getDriverInfo(this.keyWord)
    this.driverLoading = false
  }

  private async fetchData() {
    this.getOpenCitys()
    this.getOffices()
    this.getGmOptions()
    await this.getDriverInfo()
    await this.getList()
  }

  @Watch('freezeForm.orderId', { deep: true })
  private changeOrderId(val:any) {
    if (val) {
      this.getOrderDetail(val)
      this.getMoney(val)
      if (this.showDialog.name === 2) {
        this.isSureCheck(val)
      }
    }
  }
  @Watch('listQuery.workCity', { deep: true })
  private changeWorkCity(val:any, oldVal:any) {
    if (val !== oldVal) {
      this.getGmOptions()
      this.driverPage.page = 1
      this.driverOver = false
      this.driverOtions.splice(0, this.driverOtions.length)
      this.getDriverInfo()
      this.listQuery.joinManagerId = ''
      this.listQuery.driverId = ''
    }
  }
  @Watch('listQuery.busiType', { deep: true })
  private changeBusiType(val:any, oldVal:any) {
    if (val !== oldVal) {
      this.getGmOptions()
      this.driverPage.page = 1
      this.driverOver = false
      this.driverOtions.splice(0, this.driverOtions.length)
      this.getDriverInfo()
      this.listQuery.joinManagerId = ''
      this.listQuery.driverId = ''
    }
  }
  @Watch('listQuery.joinManagerId', { deep: true })
  private changeJoinManagerId(val:any, oldVal:any) {
    if (val !== oldVal) {
      this.driverPage.page = 1
      this.driverOver = false
      this.driverOtions.splice(0, this.driverOtions.length)
      this.getDriverInfo()
      this.listQuery.driverId = ''
    }
  }

  get tableHeight() {
    let otherHeight = 440
    return document.body.offsetHeight - otherHeight || document.documentElement.offsetHeight - otherHeight
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  mounted() {
    this.fetchData()
  }
}
</script>
<style lang="scss" scoped>
.wtAcountList {
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
  .table_box {
      padding: 0px 30px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      .middle {
        margin: 10px 0px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .count {
          font-size:14px;
          color:#666;
        }
      }
    }
}
</style>

<style scoped>
.wtAcountList >>> .el-form-item__label {
  color: #999;
}
.wtAcountList >>> .selfForm{
    width: 100%;
    background: #fff;
    margin-bottom: 10px;
    margin-left: 0px !important;
    margin-right: 0px !important;
    /* box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5); */
}
.wtAcountList >>> .el-form-item__content div{
  width: 100%;
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
