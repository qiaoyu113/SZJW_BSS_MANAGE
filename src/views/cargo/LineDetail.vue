<template>
  <div :class="isPC ? 'LineDetail' : 'LineDetail-m'">
    <SectionContainer
      title="基础信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="货主名称"
            :value="ruleForm.customerName"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="内部使用线路名称"
            :value="ruleForm.lineName"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="备注信息/线路描述"
            :value="ruleForm.remark"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="线路类型"
            :value="ruleForm.lineTypeName"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="可上车数"
            :value="ruleForm.deployNo"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="仓位置"
            :value="ruleForm.warehouse"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="上架有效期（天）"
            :value="waitDirveValidity(ruleForm.waitDirveValidity)"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="线路稳定性"
            :value="ruleForm.stabilityRateName"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <SectionContainer
      title="配送信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="选择车型"
            :value="ruleForm.carTypeName"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="配送区域"
            :value="ruleForm.lineArea"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="具体区域范围"
            :value="ruleForm.districtArea"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            v-if="ruleForm.returnWarehouse === 1"
            name="是否需要返仓"
            value="是"
          />
          <DetailItem
            v-if="ruleForm.returnWarehouse === 2"
            name="是否需要返仓"
            value="否"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            v-if="ruleForm.returnBill === 1"
            name="是否需要回单"
            value="是"
          />
          <DetailItem
            v-if="ruleForm.returnBill === 2"
            name="是否需要回单"
            value="否"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="预计每日平均配送点位数"
            :value="ruleForm.deliveryNo"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="预计每日平均总公里数（公里）"
            :value="ruleForm.distance"
          />
        </el-col>
      </el-row>
    </SectionContainer>

    <SectionContainer
      title="结算信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="每日配送趟数"
            :value="ruleForm.dayNo"
          />
        </el-col>
        <template v-if="ruleForm.dayNo">
          <el-col
            v-for="index in ruleForm.dayNo"
            :key="index"
            :span="isPC ? 6 : 24"
          >
            <DetailItem
              name="预计工作时间"
              :value="time(index)"
            />
          </el-col>
        </template>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="预计月出车天数"
            :value="ruleForm.monthNo"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="结算方式"
            :value="ruleForm.incomeSettlementMethodName"
          />
        </el-col>

        <el-col
          v-if="ruleForm.incomeSettlementMethod === 2"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="每趟保底（元）"
            :value="ruleForm.everyTripGuaranteed"
          />
        </el-col>
        <el-col
          v-if="ruleForm.incomeSettlementMethod === 2"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="每趟提成订单"
            :value="ruleForm.bussinessName"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="预计货主月报价"
            :value="ruleForm.shipperOffer"
          />
        </el-col>

        <el-col
          v-if="ruleForm.incomeSettlementMethod === 1"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="货主单趟报价"
            :value="ruleForm.everyTripGuaranteed"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="结算天数"
            :value="ruleForm.settlementDaysName"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="结算周期"
            :value="ruleForm.settlementCycleName"
          />
        </el-col>
        <el-col
          v-if="ruleForm.deliveryWeekCycle !== ''"
          :span="24"
          class="detail-group"
        >
          <template>
            <span class="detail-title">配送周期</span>
            <el-checkbox-group v-model="checkList">
              <el-checkbox
                label=""
                disabled
              >
                全选
              </el-checkbox>
              <el-checkbox
                :label="1"
                disabled
              >
                周一
              </el-checkbox>
              <el-checkbox
                :label="2"
                disabled
              >
                周二
              </el-checkbox>
              <el-checkbox
                :label=" 3"
                disabled
              >
                周三
              </el-checkbox>
              <el-checkbox
                :label="4"
                disabled
              >
                周四
              </el-checkbox>
              <el-checkbox
                :label="5"
                disabled
              >
                周五
              </el-checkbox>
              <el-checkbox
                :label="6"
                disabled
              >
                周六
              </el-checkbox>
              <el-checkbox
                :label="7"
                disabled
              >
                周日
              </el-checkbox>
            </el-checkbox-group>
          </template>
        </el-col>
      </el-row>
    </sectioncontainer>
    <SectionContainer
      title="线路角色"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="线路打分"
            :value="ruleForm.lineRank"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="线路角色"
            :value="ruleForm.busiTypeName"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <div
      v-if="pageStatus === 1"
      class="steps"
    >
      <el-steps
        :active="status"
        align-center
      >
        <el-step title="创建线路" />
        <el-step title="已审核" />
        <el-step title="标书可上岗" />
        <el-step title="售罄" />
      </el-steps>
      <!-- description="张明明  2020-09-10" -->
      <!-- description="张明明" -->
      <!-- description="张明明" -->
    </div>
    <div
      v-if="pageStatus === 2"
      class="btnBox"
    >
      <el-button
        type="primary"
        name="lineaudit-btn-creat"
        @click="pass"
      >
        审核通过
      </el-button>
      <el-button
        type="primary"
        name="lineaudit-btn-creat"
        @click="auditBack = true"
      >
        审核拒绝
      </el-button>
    </div>

    <SelfDialog
      :visible.sync="auditBack"
      :title="`驳回原因`"
      :center="true"
      :cancel="auditCancel"
      :confirm="auditConfirm"
    >
      <div>
        <div class="dioBox">
          <span>原因：</span>
          <el-input
            v-model="auditBackText"
            type="textarea"
            placeholder="请至少输入5个字符"
            minlength="5"
            maxlength="100"
            rows="5"
            show-word-limit
          />
        </div>
      </div>
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import SelfDialog from '@/components/SelfDialog/index.vue'
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { GetLineDetail, approvedLine, notApprovedLine } from '@/api/cargo'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { parseTime } from '@/utils/index.ts'
import '@/styles/common.scss'

@Component({
  name: 'LineDetail',
  components: {
    DetailItem,
    SectionContainer,
    SelfDialog
  }
})
export default class extends Vue {
  private status: number = 1;
  private auditBack: boolean = false;
  private auditBackText: string = '';
  private ruleForm: any = {
    customerName: '',
    bussinessName: '',
    carType: '',
    carTypeName: '',
    cargoType: '',
    carry: '',
    city: '',
    cityArea: '',
    cityAreaName: '',
    countyArea: '',
    countyAreaName: '',
    createDate: '',
    createId: '',
    customerId: '',
    dayNo: 0,
    deadlineVO: '',
    deliveryNo: '',
    deliveryWeekCycle: '',
    deployNo: '',
    distance: '',
    districtArea: '',
    everyTripGuaranteed: '',
    everyUnitPrice: '',
    goodsWeight: '',
    goodsWeightName: '',
    handlingDifficultyDegree: '',
    handlingDifficultyDegreeName: '',
    id: '',
    incomeSettlementMethod: '',
    incomeSettlementMethodName: '',
    lineDeliveryInfoFORMS: [],
    lineId: '',
    lineName: '',
    lineRank: '',
    lineSaleId: '',
    lineSaleName: '',
    lineType: '',
    lineTypeName: '',
    monthNo: '',
    provinceArea: '',
    provinceAreaName: '',
    remark: '',
    returnBill: '',
    returnWarehouse: '',
    settlementCycle: '',
    settlementCycleName: '',
    settlementDays: '',
    settlementDaysName: '',
    shelvesState: '',
    shelvesStateName: '',
    shipperOffer: '',
    stabilityRate: '',
    stabilityRateName: '',
    timeDiff: '',
    updateDate: '',
    updateId: '',
    waitDirveValidity: '',
    warehouse: '',
    warehouseCity: '',
    warehouseCityName: '',
    warehouseCounty: '',
    warehouseCountyName: '',
    warehouseDistrict: '',
    warehouseProvince: '',
    warehouseProvinceName: '',
    warehouseTown: '',
    warehouseTownName: ''
  };
  private pageStatus = 0;
  private lineId: string = '';

  private checkList: any[] = [];

  mounted() {
    let lineId = this.$route.query.id
    this.lineId = lineId as string
    if (lineId) {
      this.GetDetail()
    }
    let routeArr = this.$route.path.split('/')
    if (routeArr[2] === 'linedetail') {
      this.pageStatus = 1
    } else {
      this.pageStatus = 2
    }
  }

  waitDirveValidity(val: number) {
    return parseTime(val)
  }

  time(num: number) {
    let obj = this.ruleForm['lineDeliveryInfoFORMS'][0]
    return obj.workingTimeStart + '-' + obj.workingTimeEnd
  }
  /**
   *详情
   */
  private async GetDetail() {
    let { data: res } = await GetLineDetail({ lineId: this.lineId })
    if (res.success) {
      // if (res.data.auditState === 3) {
      //   this.status = 1
      // }
      this.ruleForm = { ...this.ruleForm, ...res.data }
      if (this.ruleForm.deliveryWeekCycle) {
        let checkList = this.ruleForm.deliveryWeekCycle.split(',')
        if (checkList.length === 7) {
          this.checkList.push('')
        } else {
          this.checkList = this.ruleForm.deliveryWeekCycle
            .split(',')
            .map(function(ele: any) {
              return +ele
            })
        }
      } else {
        this.checkList = []
      }
    } else {
      this.$message.error(res.errorMsg)
    }
  }
  private async auditConfirm(done: any) {
    if (
      (this.auditBackText as string).length < 5 &&
      !(this.auditBackText === '')
    ) {
      return this.$message.error('备注不得小于5个字符')
    } else {
      let params = {
        lineId: this.lineId,
        reason: this.auditBackText
      }
      let { data } = await notApprovedLine(params)
      if (data.success) {
        this.$message.success('审核拒绝完成')
        done(this.$router.go(-1))
      } else {
        this.$message.error(data.errorMsg || data)
      }
    }
  }
  private auditCancel(done: any) {
    this.auditBack = false
  }

  private async pass() {
    let params = {
      lineId: this.lineId,
      reason: ''
    }
    let { data } = await approvedLine(params)
    if (data.success) {
      this.$message.success('审核通过完成')
      this.$router.go(-1)
    } else {
      this.$message.error(data.errorMsg || data)
    }
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  private submitForm(formName: any) {
    (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        alert('submit!')
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  private resetForm(formName: any) {
    (this.$refs[formName] as ElForm).resetFields()
  }
}
</script>

<style lang="scss">
.LineDetail {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .el-form-item__label {
    color: #4a4a4a;
    font-weight: 400;
  }
  .detail-group {
    padding: 15px;
  }
  // .detail-title{

  //   font-size: 14px;
  //   color: #666;
  //   font-weight: 400;
  //   text-align: right;
  //   padding-right: 16px;
  //   box-sizing: border-box;
  // }
  .steps {
    margin: 60px 0 30px 0;
  }
  .detail-title {
    font-size: 13px;
    color: #9e9e9e;
    font-weight: 400;
    padding-right: 16px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-bottom: 6px;
  }
  .btnBox {
    text-align: right;
    padding-top: 20px;
  }
  .dioBox {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 20px;
    padding: 0 20px;
    .el-textarea {
      width: 60% !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.LineDetail-m {
  width: 100%;
  .el-form-item__label {
    color: #4a4a4a;
    font-weight: 400;
  }
  .detail-group {
    padding: 10px 14px;
  }

  .detail-title {
    font-size: 13px;
    color: #9e9e9e;
    font-weight: 400;
    padding-right: 16px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-bottom: 6px;
  }
  .steps {
    margin: 30px 0 20px 0;
  }
}
</style>
<style>
.steps >>> .el-step .el-step__title {
  font-size: 12px;
  line-height: 24px;
}
</style>
<style scope>
/* @media screen and (min-width: 701px) {
  .el-select {
    width: 100%;
  }
  .el-input{
    width: 75%;
  }
}

@media screen and (max-width: 700px) {
  .el-select {
    width: 100%;
  }
  .el-input{
    width: 90%;
  }
} */
</style>
