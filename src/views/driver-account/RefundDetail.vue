<template>
  <div class="RefundDetail">
    <div class="box">
      <div class="table-box">
        <self-form
          ref="RefundForm"
          :list-query="listQuery"
          :form-item="formItem"
          size="small"
          label-width="100px"
          class="p15 SuggestForm"
          :pc-col="13"
        >
          <template slot="scoped">
            <div class="right">
              <el-button
                @click="goList()"
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
          </template>x
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { refundDetail } from '@/api/driver-account.ts'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'refundDetail',
  components: {
    SelfForm
  }
})
export default class extends Vue {
    private listQuery:IState = {
      refundNumber: '',
      driverNumber: '',
      driverName: '',
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
      remark: '',
      auditstatus: ''
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
        type: 7,
        label: '退费编号:',
        key: 'refundNumber'
      },
      {
        type: 7,
        label: '司机编号:',
        key: 'driverNumber'
      },
      {
        type: 7,
        label: '司机姓名:',
        key: 'driverName'
      },
      {
        type: 7,
        label: '所在城市:',
        key: 'city'
      },
      {
        type: 7,
        label: '加盟经理:',
        key: 'gmId'
      },
      {
        type: 'scoped2',
        w: '0',
        slot: true,
        label: ''
      },
      {
        type: 7,
        label: '账户总金额:',
        key: 'sumAmount'
      },
      {
        type: 7,
        label: '可退金额:',
        key: 'withdrawalAmount'
      },
      {
        type: 'scoped3',
        w: '0',
        slot: true,
        label: ''
      },
      {
        type: 7,
        label: '申请退款金额:',
        key: 'refundAmount'
      },
      {
        type: 7,
        label: '退款原因:',
        key: 'reasonsRefund'
      },
      {
        type: 7,
        label: '退款方式:',
        key: 'refundmethod'
      },
      {
        type: 7,
        label: '退款银行卡号:',
        key: 'refundBankCardNumber'
      },
      {
        type: 7,
        label: '开户行:',
        key: 'bankDeposit'
      },
      {
        type: 7,
        label: '是否有收据:',
        key: 'receipt'
      },
      {
        type: 7,
        label: '收据是否回收:',
        key: 'takeBackReceipt'
      },
      {
        type: 7,
        label: '备注:',
        key: 'remark'
      },
      {
        type: 7,
        label: '审核状态:',
        key: 'auditstatus'
      }
    ]
    private goList(id: string | (string | null)[] | null | undefined) {
      this.$router.push({
        path: '/driveraccount/refundlist',
        query: { id: id }
      })
    }
    private id:string = ''
    private async getDetail(id:string) {
      try {
        let params = {
          refundId: id
        }
        let { data: res } = await refundDetail(params)
        if (!res.status) {
          this.$message(res.message)
          return
        }
        console.log(res)
        this.listQuery = res.data
        // this.formData = res.data.baseInfo
      } catch (err) {
        console.log(err)
      }
    }
    mounted() {
      this.getDetail(this.id)
    }
}
</script>

<style lang="scss" scoped>
.RefundDetail{
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
