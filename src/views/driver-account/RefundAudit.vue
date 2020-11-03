<template>
  <div class="RefundAudit">
    <div class="box">
      <div class="table-box">
        <self-form
          ref="qianForm"
          :list-query="listQuery"
          :form-item="formItem"
          size="small"
          label-width="110px"
          class="p15 SuggestForm"
          :pc-col="13"
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
        <div class="btn">
          <el-button
            @click="unAudit()"
          >
            审核未通过
          </el-button>
          <el-button
            type="primary"
            @click="audit"
          >
            审核通过
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
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
      refundNumber: 'TF20201101001',
      driverNumber: 'SJ00001',
      driverName: '小明',
      city: '北京市',
      gmId: '小王',
      sumAmount: '5000.00',
      withdrawalAmount: '1000.00',
      refundAmount: '1000.00',
      reasonsRefund: '合同到期',
      refundmethod: '银行卡',
      refundBankCardNumber: '12345678911',
      bankDeposit: '中国银行',
      receipt: '是',
      takeBackReceipt: '是',
      remark: '无'
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
        label: '退费编号：',
        key: 'refundNumber'
      },
      {
        type: 7,
        label: '司机编号：',
        key: 'driverNumber'
      },
      {
        type: 7,
        label: '司机姓名：',
        key: 'driverName'
      },
      {
        type: 7,
        label: '所在城市：',
        key: 'city'
      },
      {
        type: 7,
        label: '加盟经理：',
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
        label: '账户总金额：',
        key: 'sumAmount'
      },
      {
        type: 7,
        label: '可退金额：',
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
        label: '申请退款金额：',
        key: 'refundAmount'
      },
      {
        type: 7,
        label: '退款原因：',
        key: 'reasonsRefund'
      },
      {
        type: 7,
        label: '退款方式：',
        key: 'refundmethod'
      },
      {
        type: 7,
        label: '退款银行卡号：',
        key: 'refundBankCardNumber'
      },
      {
        type: 7,
        label: '开户行：',
        key: 'bankDeposit'
      },
      {
        type: 7,
        label: '是否有收据：',
        key: 'receipt'
      },
      {
        type: 7,
        label: '收据是否回收：',
        key: 'takeBackReceipt'
      },
      {
        type: 7,
        label: '备注：',
        key: 'remark'
      }
    ]
    // 审核通过
    private audit(id: string | (string | null)[] | null | undefined) {
      // this.$router.push({ name: 'accountManageDetail', query: { id: id } })
      this.$confirm('确定要审核通过此退款信息吗？', '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '返回',
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
    // 审核未通过
    private unAudit(id: string | (string | null)[] | null | undefined) {
      // this.$router.push({ name: 'accountManageDetail', query: { id: id } })
      this.$confirm('确定要审核未通过并驳回此退款信息吗？', '提示', {
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
}
</script>

<style lang="scss" scoped>
.RefundAudit{
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
.btn{
  display: flex;
  justify-content: center;
}
</style>
