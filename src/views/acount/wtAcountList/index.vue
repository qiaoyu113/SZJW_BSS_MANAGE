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
      <template v-slot:driverId="scope">
        <span class="active">{{ scope.row.driverId }}</span>
      </template>
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
            :disabled="scope.row.orderStatus !== 1 && scope.row.cashMoney > 0"
            @click="isFreeze(scope.row)"
          >
            冻结
          </el-button>
          <el-button
            :disabled="scope.row.orderStatus !== 2 && scope.row.cashMoney > 0"
            type="text"
            @click="isFreeze(scope.row)"
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
        />
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
import { getAcountList, accountFreeze, accountUnfreeze } from '@/api/driver-account'
import { delayTime } from '@/settings.ts'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { HandlePages, phoneReg } from '@/utils/index'
import { GetManagerLists, GetOpenCityData } from '@/api/common'
import { deleteUser } from '@/api/users'
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
    { label: '是', value: 1 },
    { label: '否', value: 2 }
  ];
  private busiTypeOptions:any[] = [
    { label: '共享', value: 1 },
    { label: '专车', value: 0 }
  ]
  // 表单对象
  private listQuery: IState = {
    workCity: '',
    driverId: '',
    name: '',
    busiType: '',
    gmId: '',
    balance: '',
    time: []
  };
  // 表单数组
  private formItem: any[] = [
    {
      type: 2,
      key: 'workCity',
      col: 8,
      w: '150px',
      label: '所属城市',
      tagAttrs: {
        placeholder: '请选择所属管理区',
        filterable: true,
        name: 'driverList_workCity_select'
      },
      options: this.workCityOptions
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
      key: 'gmId',
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
      type: 1,
      key: 'name',
      label: '司机姓名',
      col: 8,
      w: '150px',
      tagAttrs: {
        placeholder: '请输入姓名',
        maxlength: 10,
        clearable: true,
        name: 'driverList_name_input'
      }
    },
    {
      type: 1,
      key: 'driverId',
      label: '司机编号',
      col: 8,
      w: '150px',
      tagAttrs: {
        placeholder: '请输入司机编号',
        maxlength: 32,
        clearable: true,
        name: 'driverList_driverId_input'
      }
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
      width: '140px',
      slot: true
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
      key: 'accountFrozen',
      label: '冻结金额'
    },
    {
      key: 'cashMoney',
      label: '可提现金额'
    },
    {
      key: 'allAcountMoney',
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
    accountFrozen: '',
    cashMoney: '',
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
      options: this.busiTypeOptions
    },
    {
      type: 7,
      key: 'orderStatusName',
      label: '订单状态：',
      col: 24
    },
    {
      type: 7,
      key: 'accountFrozen',
      label: '冻结金额：',
      col: 24
    },
    {
      type: 7,
      key: 'cashMoney',
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
        placeholder: '请填写最多100个字',
        type: 'textarea',
        maxlength: 100,
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
      options: this.busiTypeOptions
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
      key: 'accountFrozen',
      label: '冻结金额：',
      col: 24
    },
    {
      type: 7,
      key: 'cashMoney',
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
        placeholder: '请填写最多100个字',
        type: 'textarea',
        maxlength: 100,
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
      { required: true, message: '请选择是否开收据', trigger: 'blur' }
    ],
    applyForAccountUnfrozen: [
      { required: true, message: '请选择是否开收据', trigger: 'blur' }
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
      let { data: res } = await GetOpenCityData()
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

      this.listQuery.balance && (params.balance = this.listQuery.balance)
      this.listQuery.workCity && (params.workCity = this.listQuery.workCity)
      this.listQuery.driverId && (params.driverId = this.listQuery.driverId)
      this.listQuery.name && (params.name = this.listQuery.name)
      this.listQuery.busiType !== '' &&
        (params.busiType = this.listQuery.busiType)
      this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)

      if (this.listQuery.time.length > 1) {
        params.startDate = this.listQuery.time[0]
        params.endDate = this.listQuery.time[1] + 86399999
      }
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

  private isFreeze(item:any) {
    let title:string = ''
    let name:number = 0
    this.columnData = item
    this.freezeForm = { ...this.freezeForm, ...this.columnData }
    if (item.orderStatus === 1) {
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
  }
  private closed() {
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
    console.log('freezed', res)
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
      workCity: '',
      driverId: '',
      name: '',
      busiType: '',
      gmId: '',
      balance: '',
      time: []
    }
    this.tags = []
    this.getList()
  }

  /**
   * 分页
   */
  handlePageSize(page: any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
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
