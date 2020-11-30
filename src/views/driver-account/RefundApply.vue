<template>
  <div class="refundApply">
    <div class="box">
      <div class="table-box">
        <self-form
          ref="RefundForm"
          :list-query="listQuery"
          :form-item="createFrom"
          size="small"
          label-width="200px"
          class="p15 SuggestForm"
          :pc-col="13"
          :rules="rules"
          @onPass="handlePassClick"
        >
          <template slot="backBtn">
            <div class="right">
              <el-button @click="backToList">
                返回
              </el-button>
            </div>
            <p class="title-label">
              基础信息
            </p>
          </template>
          <template slot="driverId">
            <el-select
              v-model="listQuery.driverId"
              v-loadmore="loadmore"
              style="width: 100%"
              filterable
              clearable
              remote
              reserve-keyword
              :default-first-option="true"
              :remote-method="remoteMethod"
              :loading="driverLoading"
              placeholder="请输入"
              @change="driverSelect"
              @clear="handleClearQueryDriver"
            >
              <el-option
                v-for="(item, index) in driverOtions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <template slot="information">
            <el-form-item
              label="所在城市:"
              style="width: 100%"
            >
              <span>{{ driverCity.city }}</span>
            </el-form-item>
            <el-form-item
              label="加盟经理:"
              style="width: 100%"
            >
              <span>{{ driverCity.gmName }}</span>
            </el-form-item>
            <p class="title-label">
              账户信息
            </p>
            <el-form-item
              label="账户总金额:"
              style="width: 100%"
            >
              <span>{{ accountMoney.balance }} 元</span>
            </el-form-item>
            <el-form-item
              label="可提现金额:"
              style="width: 100%"
            >
              <span>{{ accountMoney.canRefund }} 元</span>
            </el-form-item>
            <p class="title-label">
              退款信息
            </p>
          </template>
          <!--收据 -->
          <template slot="hasReceipt">
            <el-radio-group
              v-model="listQuery.hasReceipt"
              @change="hasReceiptChange"
            >
              <el-radio :label="1">
                有
              </el-radio>
              <el-radio :label="0">
                没有
              </el-radio>
            </el-radio-group>
          </template>
          <template slot="recoveryReceipt">
            <el-radio-group v-model="listQuery.recoveryReceipt">
              <el-radio :label="1">
                有
              </el-radio>
              <el-radio :label="0">
                没有
              </el-radio>
            </el-radio-group>
          </template>
          <template slot="btn">
            <div class="sumbitBtn">
              <el-button
                style="float: center"
                @click="backToList"
              >
                取消
              </el-button>
              <el-button
                style="float: center"
                type="primary"
                @click="Submit"
              >
                提交
              </el-button>
            </div>
          </template>
        </self-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { options } from 'numeral'
import { getDriverNoAndNameList } from '@/api/driver'
import { lock } from '@/utils/index.ts'
import {
  haveRecordToBeApproved,
  getRefundEcho,
  createRefund
} from '@/api/driver-refund'
interface IState {
  [key: string]: any
}
interface listQuerys {
  bankCardNo: string // 银行卡号
  bankName: string // 开户行
  remarks: string // 备注
  money: number | undefined // 申请退款金额
  hasReceipt: number // 是否有收据
  recoveryReceipt?: number // 是否回收收据
  driverId: string // 司机ID
  reason: string // 退款原因
  payMethod: number // 退款方式
  payeeName: string
}
interface dirverGMC {
  city: string
  gmName: string
}
interface accountMoney{
  balance: number|undefined,
  canRefund: number|undefined
}
@Component({
  name: 'RefundApply',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  // 表单数据
  private listQuery: listQuerys = {
    driverId: '',
    bankCardNo: '',
    money: undefined,
    hasReceipt: 3,
    recoveryReceipt: 3,
    bankName: '',
    remarks: '',
    reason: '',
    payMethod: 6,
    payeeName: ''
  }
  private accountMoney:accountMoney = {
    balance: undefined,
    canRefund: undefined
  }
  private driverCity: dirverGMC = {
    city: '',
    gmName: ''
  }
  // selfFrom项
  private activeFrom: Array<any> = [
    {
      type: 'hasReceipt',
      label: '缴费时是否有收据:',
      key: 'hasReceipt',
      slot: true
    },
    {
      type: 'recoveryReceipt',
      label: '收据是否已提供给财务:',
      key: 'recoveryReceipt',
      slot: true
    }
  ]
  private createFrom: any[] = [
    {
      type: 'backBtn',
      w: '0',
      slot: true,
      col: 24,
      label: ''
    },
    {
      type: 'driverId',
      label: '司机姓名(司机编号/手机号):',
      key: 'driverId',
      slot: true
    }
  ]
  private formItem: any[] = [
    {
      type: 'information',
      w: '0',
      slot: true,
      label: ''
    },
    {
      type: 14,
      tagAttrs: {
        placeholder: '请输入',
        min: 0,
        max: 999999.99,
        step: 0.01,
        'controls-position': 'right',
        precision: 2
      },
      label: '申请退款金额:',
      key: 'money'
    },
    {
      type: 13,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true,
        maxlength: '300'
      },
      label: '退款原因:',
      key: 'reason'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        readonly: true
      },
      label: '退款方式:',
      key: 'payMethod',
      options: [
        {
          value: 6,
          label: '银行卡'
        }
      ]
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true,
        maxlength: '30'
      },
      label: '退款银行卡号:',
      key: 'bankCardNo'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true,
        maxlength: 10
      },
      label: '持卡人姓名',
      key: 'payeeName'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true,
        maxlength: '50'
      },
      label: '开户行:',
      key: 'bankName'
    },
    ...this.activeFromC,
    {
      type: 13,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true,
        maxlength: 300
      },
      label: '备注:',
      key: 'remarks'
    }
  ]
  private isKillSumbit: boolean = true // 校验是否有订单
  private isOneCreate: boolean = true // 是否第一次创建

  // 司机列表 搜索
  private driverLoading: Boolean = false
  private driverOver: Boolean = false

  private driverOtions: any[] = []
  private driverPage: any = {
    page: 1,
    limit: 20
  }
  private keyWord: string = ''
  hasReceiptChange(e: number) {
    const inx = this.createFrom.findIndex(
      (item: any) => item.key === 'hasReceipt'
    )
    const inxs = this.createFrom.findIndex(
      (item: any) => item.key === 'recoveryReceipt'
    )
    let splicInx: number
    splicInx = inxs !== -1 ? 2 : 1
    if (this.listQuery.hasReceipt === 1) {
      this.createFrom.splice(inx, splicInx, ...this.activeFromC)
      delete this.listQuery.recoveryReceipt
    } else if (this.listQuery.hasReceipt === 0) {
      this.createFrom.splice(inx, splicInx, ...this.activeFromC)
    }
  }
  private rules: any = {
    driverId: [
      { required: true, message: '请选择司机', trigger: 'change' }
    ],
    money: [
      { required: true, message: '请输入申请退款金额!', trigger: 'blur' },
      { validator: this.validateMaxMoney, trigger: 'blur' }
    ],
    reason: [{ required: true, message: '请输入退款原因！', trigger: 'blur' }],
    payMethod: [
      { required: true, message: '请选择的退款方式！', trigger: 'blur' }
    ],
    bankCardNo: [
      { required: true, message: '请输入退款银行卡号！', trigger: 'blur' },
      {
        pattern: /^[0-9]{1,30}$/,
        message: '银行卡号不可有特殊字符、空格，文字等',
        trigger: 'blur'
      }
    ],
    bankName: [
      { required: true, message: '请输入开户行！', trigger: 'blur' },
      {
        pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,50}$/,
        message: '开户行信息不可有特殊字符、空格',
        trigger: 'blur'
      }
    ],
    hasReceipt: [
      { required: true, message: '请选择是否有收据！', trigger: 'change' }
    ],
    recoveryReceipt: [
      { required: true, message: '请选择收据是否提供给财务', trigger: 'change' }
    ],
    payeeName: [
      { required: true, message: '请输入持卡人姓名！', trigger: 'blur' }
      // {
      //   pattern: /^[\u4e00-\u9fa5]{1,10}$/,
      //   message: '持卡人姓名不可超过10个字',
      //   trigger: 'blur'
      // }
    ]
  }
  // 校验函数
  private validateMaxMoney(rule: any, value: any, callback: any) {
    if (
      (this.accountMoney.canRefund as number) < (this.listQuery.money as number)
    ) {
      return callback(new Error('申请退款金额不可超过可提现金额，请确认！'))
    }
    if ((this.listQuery.money as number) <= 0) {
      return callback(new Error('申请退费金额要大于0！'))
    }
    callback()
  }
  // 校验规则
  private backToList() {
    this.$confirm('确认要放弃已填写内容返回上一页面？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.$router.push({
          path: '/driveraccount/refundlist'
        })
      })
      .catch(() => {})
  }
  // 司机列表收索
  private loadmore() {
    this.getDriverInfo(this.keyWord)
  }

  private handleClearQueryDriver() {
    this.createFrom.splice(2)
    this.isOneCreate = true
    this.driverOtions.splice(0)
    this.getDriverInfo() // 获取司机列表
    // 重置表单
    this.listQuery = {
      driverId: '',
      bankCardNo: '',
      money: undefined,
      hasReceipt: 3,
      recoveryReceipt: 3,
      bankName: '',
      remarks: '',
      reason: '',
      payMethod: 6,
      payeeName: ''
    }
  }
  private remoteMethod(query: any) {
    this.keyWord = query
    this.driverLoading = true
    this.driverPage.page = 0
    this.driverOver = false
    this.driverOtions.splice(0, this.driverOtions.length)
    this.getDriverInfo(this.keyWord)
    this.driverLoading = false
  }
  // 给加盟经理赋值
  private putDriverCity(e: string) {
    console.log('1231313')
    if (e.length === 0) return
    const inx = this.driverOtions.findIndex(item => item.value === e)
    this.driverCity.city = this.driverOtions[inx].workCityName
    this.driverCity.gmName = this.driverOtions[inx].gmName
  }
  // 触发表单校验
  private Submit(this: any) {
    this.$refs.RefundForm.submitForm()
  }
  // 表单检验通过
  private handlePassClick(valid: any) {
    try {
      if (!this.isKillSumbit) {
        return this.$message({
          type: 'error',
          message: '该司机当前有待退费记录，请处理完毕后在申请退费！'
        })
      }
      if ((this.listQuery.hasReceipt as number) === 0) {
        this.listQuery.recoveryReceipt = 0
      }
      this.createRefundSure(this.listQuery)
    } catch (error) {
      return error
    }
  }

  // 接口
  driverSelect(e: string) {
    this.haveRecordToBeApprovedSure(e)
    // 判断是否有已经退费的订单
    if (e.length !== 0) {
      this.putDriverCity(e)
      let check = this.getRefundEchoSure(e)
    } else {
      this.driverPage.page = 1
      this.driverOver = false
    }

    this.listQuery = {
      driverId: '',
      bankCardNo: '',
      money: undefined,
      hasReceipt: 3,
      recoveryReceipt: 3,
      bankName: '',
      remarks: '',
      reason: '',
      payMethod: 6,
      payeeName: ''
    }
    this.listQuery.driverId = e
    // 是否有存在的记录
    // 获取用户账户信息
    if (this.isOneCreate) {
      this.createFrom.push(...this.formItem)
      this.isOneCreate = false
    }
  }
  async haveRecordToBeApprovedSure(driverId: string) {
    try {
      const { data } = await haveRecordToBeApproved({ driverId })
      if (!data.success) return
      this.isKillSumbit = !data.data
      if (data.data) {
        this.$confirm(
          '该司机当前有待退费记录，请处理完毕后在申请退费！',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            // this.handleClearQueryDriver()
          })
          .catch(err => {
            return err
          })
      }
    } catch (error) {
      return error
    }
  }
  async getRefundEchoSure(driverId: string) {
    try {
      const { data: res } = await getRefundEcho({ driverId })
      if (!res.success) {
        this.$message({
          type: 'error',
          message: res.errorMsg
        })
        return false
      }
      const { data } = res
      this.listQuery.bankCardNo = data.bankCardNo || ''
      this.listQuery.bankName = data.bankName || ''
      this.accountMoney.balance = data.balance || 0
      this.accountMoney.canRefund = data.canRefund || 0
    } catch (error) {
      return error
    }
  }
  @lock
  async createRefundSure(params: object) {
    try {
      const { data } = await createRefund(params)
      if (!data.success) {
        return this.$message({
          type: 'error',
          message: data.errorMsg
        })
      }
      this.$message({
        type: 'success',
        message: '提交成功'
      })
      this.$router.push({
        path: '/driveraccount/refundlist'
      })
    } catch (error) {
      return error
    } finally {
      console.log('')
    }
  }
  async getDriverInfo(keyWord: string = '') {
    try {
      this.keyWord = keyWord
      let params = {
        key: ''
      }
      keyWord !== '' && (params.key = keyWord)
      params = { ...params, ...this.driverPage }
      if (this.driverOver) {
        return
      }
      let { data: res } = await getDriverNoAndNameList(params, {
        url: '/v2/wt-driver-account/refund/queryDriverList'
      })
      if (res.success) {
        if (
          res.data.length &&
          res.data.length > 0 &&
          res.data.length === this.driverPage.limit
        ) {
          this.driverPage.page++
        } else {
          this.driverOver = true
        }
        let driverInfos = res.data.map(function(item: any) {
          return {
            label: `${item.name}/${item.phone}`,
            value: item.driverId,
            workCityName: item.workCityName,
            gmName: item.gmName
          }
        })
        this.driverOtions.push(...driverInfos)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      return err
    }
  }
  // 计算属性
  get activeFromC() {
    if (this.listQuery.hasReceipt === 0) {
      return [this.activeFrom[0]]
    }
    return this.activeFrom
  }
  created() {
    this.getDriverInfo(this.keyWord)
  }
}
</script>

<style lang="scss" scoped>
.refundApply {
  width: 100%;
  height: 100%;
  padding: 0;
}
.box {
  box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
  overflow: hidden;
  transform: translateZ(0);
  padding: 20px;
}
.table-box {
  background: #ffffff;
  padding: 20px 20px 5px 60px;
}
.right {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.title-label {
  width: 100%;
  // margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1.5px;
}
.sumbitBtn {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>

<style scoped>
.refundApply /deep/.el-input-number__increase {
  display: none;
}
.refundApply /deep/.el-input-number__decrease {
  display: none;
}
.refundApply /deep/.el-input__inner {
  padding-left: 15px !important;
  text-align: left !important;
}
.refundApply /deep/.el-form-item__content {
  flex-wrap: wrap !important;
}
</style>
