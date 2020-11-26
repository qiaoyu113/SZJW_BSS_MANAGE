x<template>
  <div class="refundApply">
    <div class="box">
      <div class="table-box">
        <self-form
          ref="RefundForm"
          :list-query="listQuery"
          :form-item="formItem"
          size="small"
          label-width="180px"
          class="p15 SuggestForm"
          :pc-col="13"
          :rules="rules"
          @onPass="handlePassClick"
        >
          <template slot="backBtn">
            <div class="right">
              <el-button @click="goDetail()">
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
              placeholder="请选择"
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
              <span>{{ driverCity.gmid }}</span>
            </el-form-item>
            <p class="title-label">
              账户信息
            </p>
            <el-form-item
              label="账户总金额:"
              style="width: 100%"
            >
              <span>{{ listQuery.balance }}</span>
            </el-form-item>
            <el-form-item
              label="可提现金额:"
              style="width: 100%"
            >
              <span>{{ listQuery.extracting }}</span>
            </el-form-item>
            <el-form-item
              label="可退费金额:"
              style="width: 100%"
            >
              <span>{{ listQuery.canRefund }}</span>
            </el-form-item>
            <p class="title-label">
              退款信息
            </p>
          </template>
          <!--收据 -->
          <template slot="hasReceipt">
            <el-radio-group
              v-model="listQuery.hasReceipt"
              @change="delItem"
            >
              <el-radio :label="1">
                有
              </el-radio>
              <el-radio :label="2">
                没有
              </el-radio>
            </el-radio-group>
          </template>
          <template slot="recoveryReceipt">
            <el-radio-group v-model="listQuery.recoveryReceipt">
              <el-radio :label="1">
                有
              </el-radio>
              <el-radio :label="2">
                没有
              </el-radio>
            </el-radio-group>
          </template>
          <template slot="btn">
            <div class="sumbitBtn">
              <el-button
                style="float: center"
                @click="goDetail()"
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
import { haveRecordToBeApproved, getRefundEcho, createRefund } from '@/api/driver-refund'
interface IState {
  [key: string]: any
}
interface listQuerys{
  bankCardNo: string // 银行卡号
  bankName: string // 开户行
  balance: number|undefined // 账户余额
  canRefund: number
  extracting: number
  remarks:string // 备注
  money:number // 申请退款金额
  hasReceipt:number // 是否有收据
  recoveryReceipt?:number // 是否回收收据
  driverId:string // 司机ID
  reason:string // 退款原因
  payMethod:number // 退款方式
  payeeName:string
}
@Component({
  name: 'RefundApply',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  private listQuery: listQuerys = {
    driverId: '',
    bankCardNo: '',
    balance: undefined,
    canRefund: 0,
    extracting: 0,
    money: 0,
    hasReceipt: 0,
    recoveryReceipt: 0,
    bankName: '',
    remarks: '',
    reason: '',
    payMethod: 0,
    payeeName: ''
  }
  private driverCity = {
    city: '',
    gmid: ''
  }
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
  get activeFromC() {
    if (this.listQuery.hasReceipt === 2) {
      return [this.activeFrom[0]]
    }
    return this.activeFrom
  }
  delItem(e: number) {
    const inx = this.formItem.findIndex((item: any) => item.key === 'hasReceipt')
    const inxs = this.formItem.findIndex(
      (item: any) => item.key === 'recoveryReceipt'
    )
    let splicInx: number
    splicInx = inxs !== -1 ? 2 : 1
    if (this.listQuery.hasReceipt === 2) {
      this.formItem.splice(inx, 2, ...this.activeFromC)
      delete this.listQuery.recoveryReceipt
    } else if (this.listQuery.hasReceipt === 1) {
      this.formItem.splice(inx, splicInx, ...this.activeFromC)
    }
  }
  private formItem: any[] = [
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
    },
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
          value: 1,
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
        filterable: true
      },
      label: '持卡人姓名',
      key: 'payeeName'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请选择',
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
  private validateMaxMoney(rule: any, value: any, callback: any) {
    console.log(value)
    if (this.listQuery.money > this.listQuery.canRefund) {
      return callback(new Error('申请退款金额不可超过可提现金额，请确认！'))
    }
    callback()
  }
  // 校验规则
  private rules: any = {
    driverId: [
      { required: true, message: '选择是姓名+（手机号）', trigger: 'blur' }
    ],
    money: [
      { required: true, message: '请输入申请退款金额!', trigger: 'blur' },
      { validator: this.validateMaxMoney, trigger: 'blur' }
    ],
    reason: [
      { required: true, message: '请输入退款原因！', trigger: 'blur' }
    ],
    payMethod: [
      { required: true, message: '请选择的退款方式！', trigger: 'blur' }
    ],
    bankCardNo: [
      { required: true, message: '请输入退款银行卡号！', trigger: 'blur' },
      { pattern: /^[0-9]{0,30}$/, message: '银行卡号不可有特殊字符、空格，文字等', trigger: 'blur' }
    ],
    bankName: [
      { required: true, message: '请选择开户行！', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,50}$/, message: '银行卡号不可有特殊字符、空格，文字等', trigger: 'blur' }
    ],
    hasReceipt: [
      { required: true, message: '请选择是否有收据！', trigger: 'change' }
    ],
    recoveryReceipt: [
      { required: true, message: '请选择收据是否收回', trigger: 'change' }
    ],
    payeeName: [
      { required: true, message: '请输入持卡人姓名！', trigger: 'blur' },
      { max: 10, message: '持卡人姓名不可超过10个字', trigger: 'blur' }
    ]
  }
  private goDetail(id: string | (string | null)[] | null | undefined) {
    // this.$router.push({ name: 'accountManageDetail', query: { id: id } })
    this.$confirm('text', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.$message({
          type: 'success',
          message: '成功!'
        })
        this.$router.push({
          path: '/driveraccount/refundlist',
          query: { id: id }
        })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
  }
  // 司机列表收索
  private driverLoading: Boolean = false
  private driverOtions: any[] = []
  private driverPage: any = {
    page: 1,
    limit: 20
  }
  private keyWord: string = ''
  private loadmore() {
    this.getDriverInfo(this.keyWord)
  }
  private driverOver: Boolean = false
  private async getDriverInfo(keyWord: string = '') {
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
        url: '/v2/wt-driver-account/flow/queryDriverList'
      })
      if (res.success) {
        if (res.data.length && res.data.length > 0 && res.data.length === this.driverPage.limit) {
          this.driverPage.page++
        } else {
          this.driverOver = true
        }
        let driverInfos = res.data.map(function(item: any) {
          return {
            label: `${item.name}/${item.phone}`,
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
  private handleClearQueryDriver() {
    this.getDriverInfo()
  }
  private async remoteMethod(query: any) {
    this.keyWord = query
    this.driverLoading = true
    this.driverPage.page = 0
    this.driverOver = false
    this.driverOtions.splice(0, this.driverOtions.length)
    await this.getDriverInfo(this.keyWord)
    this.driverLoading = false
  }
  // 去触发表单校验
  private Submit(this:any) {
    // (this.$refs.qianForm as any).submitForm()
    this.$refs.RefundForm.validateField()
    this.$refs.RefundForm.validate(async(valid:Boolean) => {
      if (!valid) return
      console.log(12321)
    }
    )
    console.log(1231)
  }
  // 表单检验通过
  private handlePassClick(valid: any) {
    console.log(this.listQuery)
  }
  changeDriver() {
    console.log('xxxxxxxxxxxxxxxxx')
    // this.listQuery.city = ''
    // this.listQuery.gmId = ''
  }
  async driverSelect(e:Event) {
    console.log(e)
    // 判断是否有已经退费的订单

    try {
      const { data } = await haveRecordToBeApproved({ driverId: e })
      console.log(data)
    } catch (error) {
      return error
    }
    try {
      const { data } = await getRefundEcho({ driverId: e })
      console.log(data, 1)
    } catch (error) {
      return error
    }
    // 获取用户账户信息
  }
  created() {
    this.getDriverInfo('')
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
