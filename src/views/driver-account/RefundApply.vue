<template>
  <div class="refundApply">
    <div class="box">
      <div class="table-box">
        <self-form
          ref="qianForm"
          :list-query="listQuery"
          :form-item="formItem"
          size="small"
          label-width="80px"
          class="p15 SuggestForm"
          :pc-col="13"
          :rules="rules"
          @onPass="handlePassClick"
        >
          <template slot="scoped">
            <div class="right">
              <el-button
                @click="goDetail()"
              >
                返回
              </el-button>
            </div>
          </template>
          <template
            slot="scoped1"
            size="medium"
          >
            <p>基础信息</p>
          </template>
          <template
            slot="scoped2"
          >
            <p>账户信息</p>
          </template>
          <template
            slot="scoped3"
          >
            <p>退款信息</p>
          </template>
        </self-form>
        <el-button
          style="float: center;"
          @click="goDetail()"
        >
          取消
        </el-button>
        <el-button
          style="float: center;"
          type="primary"
          @click="Submit"
        >
          提交
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
// import { qianlei1 } from '@/api/qianlei'
import SelfForm from '@/components/Base/SelfForm.vue'
import { options } from 'numeral'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SelfForm
  }
})

export default class extends Vue {
    private listQuery:IState = {
      selectDriver: '',
      city: '',
      gmId: '',
      sumAmount: '',
      withdrawalAmount: '',
      refundAmount: '',
      reasonsRefund: '',
      refundmethod: '',
      refundBankCardNumber: '',
      bankDeposit: '',
      receipt: '',
      takeBackReceipt: '',
      remark: ''
    }
    private formItem:any[] = [
      {
        type: 'scoped',
        w: '0',
        slot: true,
        col: 24,
        label: ''
      },
      {
        type: 'scoped1',
        w: '0',
        slot: true,
        label: ''
      },
      {
        type: 2,
        tagAttrs: {
          placeholder: '请选择',
          clearable: true,
          filterable: true
        },
        w: '110px',
        label: '选择司机:',
        key: 'selectDriver',
        options: [
          {
            value: 1,
            label: '小北'
          },
          {
            value: 2,
            label: '小南'
          }
        ],
        listeners: {
          'change': this.changeDriver
        }
      },
      {
        type: 2,
        tagAttrs: {
          placeholder: '请选择',
          clearable: true,
          filterable: true
        },
        w: '110px',
        label: '所在城市:',
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
          placeholder: '请选择',
          clearable: true,
          filterable: true
        },
        w: '110px',
        label: '加盟经理:',
        key: 'gmId',
        options: [
          {
            value: 1,
            label: '小东'
          },
          {
            value: 2,
            label: '小西'
          }
        ]
      },
      {
        type: 'scoped2',
        w: '0',
        slot: true,
        label: ''
      },
      {
        type: 1,
        tagAttrs: {
          placeholder: '请输入',
          clearable: true,
          filterable: true
        },
        w: '110px',
        label: '账户总金额:',
        key: 'sumAmount'
      },
      {
        type: 1,
        tagAttrs: {
          placeholder: '请输入',
          clearable: true,
          filterable: true
        },
        w: '110px',
        label: '可提现金额:',
        key: 'withdrawalAmount'
      },
      {
        type: 'scoped3',
        w: '0',
        slot: true,
        label: ''
      },
      {
        type: 1,
        tagAttrs: {
          placeholder: '请输入',
          clearable: true,
          filterable: true
        },
        w: '110px',
        label: '申请退款金额:',
        key: 'refundAmount'
      },
      {
        type: 1,
        tagAttrs: {
          placeholder: '请输入',
          clearable: true,
          filterable: true
        },
        w: '110px',
        label: '退款原因:',
        key: 'reasonsRefund'
      },
      {
        type: 2,
        tagAttrs: {
          placeholder: '请选择',
          clearable: true,
          filterable: true
        },
        w: '110px',
        label: '退款方式:',
        key: 'refundmethod',
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
          filterable: true
        },
        w: '110px',
        label: '退款银行卡号:',
        key: 'refundBankCardNumber'
      },
      {
        type: 2,
        tagAttrs: {
          placeholder: '请选择',
          clearable: true,
          filterable: true
        },
        w: '110px',
        label: '开户行:',
        key: 'bankDeposit',
        options: [
          {
            value: 1,
            label: '北京'
          }
        ]
      },
      {
        type: 2,
        tagAttrs: {
          placeholder: '请选择',
          clearable: true,
          filterable: true
        },
        w: '110px',
        label: '是否有收据:',
        key: 'receipt',
        options: [
          {
            value: 1,
            label: '是'
          },
          {
            value: 2,
            label: '否'
          }
        ]
      },
      {
        type: 2,
        tagAttrs: {
          placeholder: '请选择',
          clearable: true,
          filterable: true
        },
        w: '110px',
        label: '收据是否回收:',
        key: 'takeBackReceipt',
        options: [
          {
            value: 1,
            label: '是'
          },
          {
            value: 2,
            label: '否'
          }
        ]
      },
      {
        type: 1,
        tagAttrs: {
          placeholder: '请输入',
          clearable: true,
          filterable: true
        },
        w: '110px',
        label: '备注:',
        key: 'remark'
      }
    ]
    private rules:any = {
      selectDriver: [
        { required: true, message: '选择是姓名+（手机号）', trigger: 'blur' }
      ],
      refundAmount: [
        { required: true, message: '（校验：申请退款金额不能超过可提现金额）', trigger: 'blur' }
      ],
      reasonsRefund: [
        { required: true, message: '请输入退款原因！', trigger: 'blur' }
      ],
      refundmethod: [
        { required: true, message: '请选择退款的方式！', trigger: 'change' }
      ],
      refundBankCardNumber: [
        { required: true, message: '请输入退款的银行卡号', trigger: 'blur' }
      ],
      bankDeposit: [
        { required: true, message: '请选择开户行', trigger: 'change' }
      ],
      receipt: [
        { required: true, message: '请选择是否有收据！', trigger: 'change' }
      ],
      takeBackReceipt: [
        { required: true, message: '（有收据时才展示本条）', trigger: 'change' }
      ],
      remark: [
        { required: true, message: '请输入备注', trigger: 'blur' }
      ]
    }
    private goDetail(id: string | (string | null)[] | null | undefined) {
      // this.$router.push({ name: 'accountManageDetail', query: { id: id } })
      this.$confirm('确定要放弃已填写的内容返回上一页吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '成功!'
        })
        this.$router.push({
          path: '/driveraccount/refundlist',
          query: { id: id }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
    // private goSubmit() {
    //   this.$router.push({
    //     path: '/refund/reviewDetails'
    //   })
    // }
    // async getgoSubmit() {
    //   let params = {
    //     roleId: '2'
    //   }
    //   let { data: res } = await qianlei1(params)
    //   console.log(res)
    //   this.goSubmit = res.data
    // }
    // created() {
    //   this.goSubmit()
    // }
    // 去触发表单校验
    private Submit() {
      ((this.$refs.qianForm) as any).submitForm()
    }
    // 表单检验通过
    private handlePassClick(valid: any) {
      console.log(this.listQuery)
    }
    changeDriver() {
      console.log('xxxxxxxxxxxxxxxxx')
      this.listQuery.city = ''
      this.listQuery.gmId = ''
    }
    created() {
      // this.listQuery.selectDriver = 1
      // this.listQuery.city = 2
      // this.listQuery.gmId = 2
      // this.listQuery.sumAmount = 1111
      // this.listQuery.withdrawalAmount = 123
      // this.listQuery.refundAmount = 12
      // this.listQuery.reasonsRefund = '無'
      // this.listQuery.refundmethod = '银行卡'
      // this.listQuery.refundBankCardNumber = 999999999999
      // this.listQuery.bankDeposit = 1
      // this.listQuery.receipt = 1
      // this.listQuery.takeBackReceipt = 2
      // this.listQuery.remark = 1
    }
}
</script>

<style lang="scss" scoped>
.refundApply{
  width: 100%;
  height: 100%;
  padding: 0;
}
.box{
  box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
  overflow: hidden;
  transform: translateZ(0);
  padding: 20px;
}
.table-box{
  background: #ffffff;
  padding: 20px 20px 5px 60px
}
.right {
  width: 100%;
  display: flex;
  justify-content: flex-end
}
</style>
