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
          title="退费信息"
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
                审核不通过
              </el-button>
              <el-button
                type="primary"
                @click="audit"
              >
                审核通过
              </el-button>
            </div>
            <template
              slot="reason"
              slot-scope="scope"
            >
              <el-popover
                placement="right-start"
                width="400"
                title="退费原因"
                trigger="hover"
                :content="scope.row.reason"
              >
                <p
                  slot="reference"
                  class="one-line"
                >
                  {{ scope.row.reason }}
                </p>
              </el-popover>
            </template>
            <template
              slot="remarks"
              slot-scope="scope"
            >
              <el-popover
                placement="right-start"
                width="400"
                title="备注"
                trigger="hover"
                :content="scope.row.remarks"
              >
                <p
                  slot="reference"
                  class="one-line"
                >
                  {{ scope.row.remarks }}
                </p>
              </el-popover>
            </template>
            <template
              slot="bankName"
              slot-scope="scope"
            >
              <el-popover
                placement="right-start"
                width="400"
                title="开户行"
                trigger="hover"
                :content="scope.row.bankName"
              >
                <p
                  slot="reference"
                  class="one-line"
                >
                  {{ scope.row.bankName }}
                </p>
              </el-popover>
            </template>
            <template
              slot="bankCardNo"
              slot-scope="scope"
            >
              <div
                slot="reference"
                style="width: 100%;word-break: break-word"
              >
                {{ scope.row.bankCardNo }}
              </div>
            </template>
          </self-form>
        </SectionContainer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { refundDetail, refundAudit } from '@/api/driver-refund.ts'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { lock } from '@/utils/index'
import { driverList } from '@/api/transport'
import RefundApplyVue from './RefundApply.vue'
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
      refundApplyId: '',
      driverId: '',
      name: '',
      driverPhone: '',
      cityName: '',
      gmName: '',
      balance: '',
      canRefund: '',
      money: '',
      reason: '',
      payMethodName: '',
      payeeName: '',
      bankCardNo: '',
      bankName: '',
      hasReceiptName: '',
      recoveryReceiptName: '',
      remarks: ''
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
        key: 'name'
      },
      {
        type: 7,
        label: '司机手机号',
        key: 'phone'
      },
      {
        type: 7,
        label: '所属城市',
        key: 'cityName'
      },
      {
        type: 7,
        label: '所属加盟经理',
        key: 'gmName'
      }
    ]
    private formItem1:IState[] = [
      {
        type: 7,
        label: '账户总金额(元)',
        key: 'balance'
      },
      {
        type: 7,
        label: '可提现金额(元)',
        key: 'canRefund'
      }
    ]
    private formItem2:IState[] = [
      {
        type: 7,
        label: '申请退费金额(元)',
        key: 'money'
      },
      {
        type: 'reason',
        slot: true,
        label: '退费原因',
        key: 'reason'
      },
      {
        type: 7,
        label: '退费方式',
        key: 'payMethodName'
      },
      {
        type: 7,
        label: '持卡人姓名',
        key: 'payeeName'
      },
      {
        type: 'bankCardNo',
        slot: true,
        label: '银行卡号',
        key: 'bankCardNo'
      },
      {
        type: 'bankName',
        slot: true,
        label: '开户行',
        key: 'bankName'
      },
      {
        type: 7,
        label: '缴费时是否有收据',
        key: 'hasReceiptName'
      },
      {
        type: 'remarks',
        slot: true,
        label: '备注',
        key: 'remarks'
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
          refundApplyId: id
        }
        let { data: res } = await refundDetail(params)
        if (res.success) {
          const isReport = {
            type: 7,
            label: '收据是否已提供给财务',
            key: 'recoveryReceiptName'
          }
          this.listQuery = { ...this.listQuery, ...res.data }
          if (this.listQuery.hasReceipt === 1) {
            this.formItem2.splice(7, 0, isReport)
          }
        } else {
          this.$message.warning(res.message)
        }
      } catch (err) {
        console.log(err)
      }
    }
    mounted() {
      this.id = (this.$route.query.id) as string
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
          label: '退费状态',
          key: 'statusName'
        })
      }
    }
    // 审核通过
    private audit(id: string | (string | null)[] | null | undefined) {
      this.$confirm('确定要审核通过此退款信息吗？', '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '返回',
        type: 'warning'
      }).then(() => {
        this.getAudit(this.id, 3)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
    // 审核不通过
    private unAudit(id: string | (string | null)[] | null | undefined) {
      this.$confirm('确定要审核不通过并驳回此退款信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getAudit(this.id, 2)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
    @lock
    private async getAudit(refundApplyId:string, type:number) {
      try {
        let params = {
          refundApplyId: refundApplyId,
          type: type
        }
        let { data: res } = await refundAudit(params)
        if (res.success) {
          this.$message({
            type: 'success',
            message: '成功!'
          })
          this.$router.push({
            path: '/driveraccount/refundlist'
          })
        } else {
          this.$message.warning(res.message)
        }
      } catch (err) {
        console.log(err)
      } finally {
        console.log('1')
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
.one-line{
  margin: 0;
  white-space: nowrap;
overflow: hidden;
width: 100%;
max-width: 150px;
text-overflow: ellipsis;
}
</style>

<style scoped>
  .table-box >>> .el-col-24 {
    margin-top:30px;
    display: flex;
    justify-content: center;
  }
</style>
