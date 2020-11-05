<template>
  <div
    class="billingDetailContainer"
    :class="{
      p15: isPC,
      m15: isPC
    }"
  >
    <div class="top">
      <div class="btn">
        <el-button @click.stop="handleBackClick">
          返回
        </el-button>
      </div>
    </div>
    <SectionContainer
      title="SOP信息"
      :md="true"
    >
      <self-form
        label-position="top"
        :list-query="listQuery"
        :form-item="formItem"
        :m-block="true"
        label-width="80px"
      />
    </SectionContainer>
    <SectionContainer
      title="扣费标准"
      :md="true"
    >
      <self-form
        label-position="top"
        :list-query="listQuery"
        :form-item="formItem1"
        :m-block="true"
        label-width="90px"
      >
        <template slot="fixedAmount">
          <span>{{ listQuery.fixedAmount }}</span>
        </template>
        <template slot="serviceRate">
          <span>{{ listQuery.serviceRate }}%</span>
        </template>
        <template slot="freightRate">
          <span>{{ listQuery.freightRate }}%</span>
        </template>
      </self-form>
    </sectioncontainer>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SelfForm from '@/components/Base/SelfForm.vue'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { GetChargingDetail } from '@/api/driver-account'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SelfForm,
    SectionContainer
  }
})
export default class extends Vue {
  private listQuery:IState = {
    id: '',
    chargingCode: '',
    chargingTypeName: '',
    sopTypeName: '',
    busiTypeName: '',
    remark: '',
    deductionTypeName: '',
    deductionType: '',
    statusName: '',
    fixedAmount: '', // 固定金额
    serviceRate: '', // 服务费比列
    freightRate: ''// 运费比列
  }
  private formItem:any[] = [
    {
      type: 7,
      label: '计费编号',
      key: 'chargingCode'
    },
    {
      type: 7,
      label: '计费类型',
      key: 'chargingTypeName'
    },
    {
      type: 7,
      label: 'SOP类型',
      key: 'sopTypeName'
    },
    {
      type: 7,
      label: '业务线',
      key: 'busiTypeName'
    },
    {
      type: 7,
      label: '备注',
      key: 'remark',
      col: 24
    }
  ];
  private formItem1:any[] = [
    {
      type: 7,
      label: '扣款类型',
      key: 'deductionTypeName'
    }
  ]
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 返回
  handleBackClick() {
    this.$router.go(-1)
  }
  // 获取详情
  async getDetail() {
    try {
      let params:IState = {
        id: this.listQuery.id
      }
      let { data: res } = await GetChargingDetail(params)
      if (res.success) {
        let result = res.data
        this.listQuery = { ...this.listQuery,
          ...{
            chargingCode: result.chargingCode,
            chargingTypeName: result.chargingTypeName,
            sopTypeName: result.sopTypeName,
            busiTypeName: result.busiTypeName,
            remark: result.remark,
            deductionTypeName: result.deductionTypeName,
            deductionType: result.deductionType,
            statusName: result.statusName,
            fixedAmount: result.fixedAmount,
            serviceRate: result.serviceRate,
            freightRate: result.freightRate
          }
        }
        if (this.listQuery.deductionType === 1) {
          this.formItem1.push({
            type: 'fixedAmount',
            label: '固定金额',
            key: 'fixedAmount',
            slot: true
          })
        } else if (this.listQuery.deductionType === 2) {
          this.formItem1.push({
            type: 'serviceRate',
            label: '服务费比例',
            key: 'serviceRate',
            slot: true
          })
        } else if (this.listQuery.deductionType === 3) {
          this.formItem1.push({
            type: 'freightRate',
            label: '运费比例',
            key: 'freightRate',
            slot: true
          })
        }
        this.formItem1.push({
          type: 7,
          label: '计费状态',
          key: 'statusName'
        })
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get detail fail:${err}`)
    }
  }
  mounted() {
    if (this.$route.query.id) {
      this.listQuery.id = this.$route.query.id
    }
    this.getDetail()
  }
}
</script>
<style lang="scss" scoped>
  .m15 {
     margin: 15px;
  }
  .billingDetailContainer {
    background: #ffffff;
    border-radius: 8px;
    .top {
      margin-bottom: 10px;
      .btn {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
      }
    }
  }
</style>

<style scoped>
  @media screen and (max-width: 700px) {
    .billingDetailContainer >>> .el-form {
      padding: 0px 10px;
    }
  }
</style>
