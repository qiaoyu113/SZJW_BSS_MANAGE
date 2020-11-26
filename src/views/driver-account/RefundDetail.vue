<template>
  <div class="RefundDetail">
    <div class="box">
      <div class="table-box">
        <SectionContainer
          title="基础信息"
          :md="true"
        >
          <self-form
            ref="RefundForm"
            label-position="top"
            :list-query="listQuery"
            :form-item="formItem"
            size="small"
            label-width="100px"
            class="p15 SuggestForm"
            :pc-col="6"
          />
        </SectionContainer>
        <SectionContainer
          title="账户信息"
          :md="true"
        >
          <self-form
            ref="RefundForm"
            label-position="top"
            :list-query="listQuery"
            :form-item="formItem1"
            size="small"
            label-width="100px"
            class="p15 SuggestForm"
            :pc-col="6"
          />
        </SectionContainer>
        <SectionContainer
          title="退款信息"
          :md="true"
        >
          <self-form
            ref="RefundForm"
            label-position="top"
            :list-query="listQuery"
            :form-item="formItem2"
            size="small"
            label-width="100px"
            class="p15 SuggestForm"
            :pc-col="6"
          >
            <div
              slot="refundBtn"
              class="refundBtn"
            >
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
          </self-form>
        </SectionContainer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { refundDetail, refundAudit } from '@/api/driver-account.ts'
import SectionContainer from '@/components/SectionContainer/index.vue'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'refundDetail',
  components: {
    SelfForm,
    SectionContainer
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
    private formItem:IState[] = [
      {
        type: 7,
        label: '退费编号',
        key: 'refundApplyId'
      },
      {
        type: 7,
        label: '司机编号',
        key: 'driverId'
      },
      {
        type: 7,
        label: '司机姓名',
        key: 'driverName'
      },
      {
        type: 7,
        label: '司机手机号',
        key: 'driverPhone'
      },
      {
        type: 7,
        label: '所属城市',
        key: 'workCity'
      },
      {
        type: 7,
        label: '所属加盟经理',
        key: 'gmId'
      }
    ]
    private formItem1:IState[] = [
      {
        type: 7,
        label: '账户总金额',
        key: 'accountBalance'
      },
      {
        type: 7,
        label: '可提现金额',
        key: 'canExtractMoney'
      }
    ]
    private formItem2:IState[] = [
      {
        type: 7,
        label: '申请退款金额',
        key: 'refundAmount'
      },
      {
        type: 7,
        label: '退费原因',
        key: 'reasonsRefund'
      },
      {
        type: 7,
        label: '退费方式',
        key: 'refundMethodName'
      },
      {
        type: 7,
        label: '持卡人姓名',
        key: 'payeeName'
      },
      {
        type: 7,
        label: '银行卡号',
        key: 'refundBankCardNumber'
      },
      {
        type: 7,
        label: '开户行',
        key: 'bankDeposit'
      },
      {
        type: 7,
        label: '缴费时是否有收据',
        key: 'receipt'
      },
      {
        type: 7,
        label: '收据是否已提供给财务',
        key: 'takeBackReceipt'
      },
      {
        type: 7,
        label: '备注',
        key: 'remark'
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
      // 审核
      if (this.$route.path === '/driveraccount/refundaudit') {
        this.formItem2.push({
          label: '',
          key: '',
          w: '0',
          slot: true,
          type: 'refundBtn',
          col: 24
        })
      } else { // 详情
        this.formItem2.push({
          type: 7,
          label: '审核状态',
          key: 'auditstatus'
        })
      }
    }
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
    private async getAudit(id:string) {
      try {
        let params = {
          refundId: id
        }
        let { data: res } = await refundAudit(params)
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

.right {
  width: 100%;
  display: flex;
  justify-content: flex-end
}
</style>

<style scoped>
  .table-box >>> .el-col-24 {
    margin-top:30px;
    display: flex;
    justify-content: center;
  }
</style>
