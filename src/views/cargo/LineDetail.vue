<template>
  <div :class="isPC ? 'LineDetail' : 'LineDetail-m'">
    <SectionContainer
      title="基础信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="货主姓名"
            :value="ruleForm.bussinessName"
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
            :value="ruleForm.warehouseDistrict"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="上架有效期（天）"
            :value="ruleForm.waitDirveValidity"
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
            value="字段待定"
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
        <el-col
          v-for="index in ruleForm.dayNo"
          :key="index"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="预计工作时间"
            :value="index.workingTimeStart +'-'+ index.workingTimeEnd"
          />
        </el-col>
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
          v-if="ruleForm.incomeSettlementMethodName === 2"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="每趟保底（元）"
            :value="ruleForm.everyTripGuaranteed"
          />
        </el-col>
        <el-col
          v-if="ruleForm.incomeSettlementMethodName === 2"
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
          v-if="ruleForm.incomeSettlementMethodName === 1"
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
          :span="24"
          class="detail-group"
        >
          <template>
            <span class="detail-title">配送周期</span>
            <el-checkbox-group v-model="checkList">
              <el-checkbox
                label="全选"
                disabled
              />
              <el-checkbox
                label="周一"
                disabled
              />
              <el-checkbox
                label="周二"
                disabled
              />
              <el-checkbox
                label="周三"
                disabled
              />
              <el-checkbox
                label="周四"
                disabled
              />
              <el-checkbox
                label="周五"
                disabled
              />
              <el-checkbox
                label="周六"
                disabled
              />
              <el-checkbox
                label="周日"
                disabled
              />
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
        :active="2"
        align-center
      >
        <el-step
          title="创建线路"
          description="张明明  2020-09-10"
        />
        <el-step
          title="外线BGL已审核"
          description="张明明"
        />
        <el-step
          title="标书可上岗"
          description="张明明"
        />
        <el-step
          title="售罄"
        />
      </el-steps>
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

    <Dialog
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
    </Dialog>
  </div>
</template>

<script lang="ts">
import Dialog from '@/components/Dialog/index.vue'
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { GetLineDetail, approvedLine, notApprovedLine } from '@/api/cargo'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

    @Component({
      name: 'LineDetail',
      components: {
        DetailItem,
        SectionContainer,
        Dialog
      }
    })

export default class extends Vue {
  private auditBack:boolean = false
  private auditBackText:string = ''
  private ruleForm:any = {
    bussinessName: undefined,
    carType: undefined,
    carTypeName: undefined,
    cargoType: undefined,
    carry: undefined,
    city: undefined,
    cityArea: undefined,
    cityAreaName: undefined,
    countyArea: undefined,
    countyAreaName: undefined,
    createDate: undefined,
    createId: undefined,
    customerId: undefined,
    dayNo: 0,
    deadlineVO: undefined,
    deliveryNo: undefined,
    deliveryWeekCycle: undefined,
    deployNo: undefined,
    distance: undefined,
    districtArea: undefined,
    everyTripGuaranteed: undefined,
    everyUnitPrice: undefined,
    goodsWeight: undefined,
    goodsWeightName: undefined,
    handlingDifficultyDegree: undefined,
    handlingDifficultyDegreeName: undefined,
    id: undefined,
    incomeSettlementMethod: undefined,
    incomeSettlementMethodName: undefined,
    lineDeliveryInfoFORMS: [],
    lineId: undefined,
    lineName: undefined,
    lineRank: undefined,
    lineSaleId: undefined,
    lineSaleName: undefined,
    lineType: undefined,
    lineTypeName: undefined,
    monthNo: undefined,
    provinceArea: undefined,
    provinceAreaName: undefined,
    remark: undefined,
    returnBill: undefined,
    returnWarehouse: undefined,
    settlementCycle: undefined,
    settlementCycleName: undefined,
    settlementDays: undefined,
    settlementDaysName: undefined,
    shelvesState: undefined,
    shelvesStateName: undefined,
    shipperOffer: undefined,
    stabilityRate: undefined,
    stabilityRateName: undefined,
    timeDiff: undefined,
    updateDate: undefined,
    updateId: undefined,
    waitDirveValidity: undefined,
    warehouse: undefined,
    warehouseCity: undefined,
    warehouseCityName: undefined,
    warehouseCounty: undefined,
    warehouseCountyName: undefined,
    warehouseDistrict: undefined,
    warehouseProvince: undefined,
    warehouseProvinceName: undefined,
    warehouseTown: undefined,
    warehouseTownName: undefined
  }
  private pageStatus = 0
  private lineId:string = ''

  private checkList:any[] = ['周一', '周末']

  private fetchData() {
    this.GetDetail()
  }

  private async GetDetail() {
    let { data } = await GetLineDetail({ lineId: 'XL202007100021' })
    if (data.success) {
      this.ruleForm = { ...this.ruleForm, ...data.data }
    } else {
      this.$message.error(data)
    }
  }
  private async auditConfirm(done: any) {
    if ((this.auditBackText as string).length < 5 && !(this.auditBackText === '')) {
      return this.$message.error('备注不得小于5个字符')
    } else {
      let params = {
        'lineId': this.lineId,
        'reason': this.auditBackText
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
  private auditCancel(done:any) {
    this.auditBack = false
  }

  private async pass() {
    let params = {
      'lineId': this.lineId,
      'reason': ''
    }
    let { data } = await approvedLine(params)
    if (data.success) {
      this.$message.success('审核通过完成')
      this.$router.go(-1)
    } else {
      this.$message.error(data.errorMsg || data)
    }
  }

  mounted() {
    let lineId = this.$route.query.id
    this.lineId = lineId as string
    if (lineId) {
      this.fetchData()
    }
    let routeArr = this.$route.path.split('/')
    if (routeArr[2] === 'linedetail') {
      this.pageStatus = 1
    } else {
      this.pageStatus = 2
    }
  }

  // activated() {
  //   let lineId = this.$route.query.lineId
  //   if (lineId) {
  //     this.fetchData()
  //   }
  // }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  private submitForm(formName:any) {
    (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        alert('submit!')
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  private resetForm(formName:any) {
    (this.$refs[formName] as ElForm).resetFields()
  }
}
</script>

<style lang="scss">
.LineDetail {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .el-form-item__label{
    color: #4a4a4a;
    font-weight: 400;
  }
  .detail-group{
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
    .steps{
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
  .btnBox{
    text-align: right;
    padding-top: 20px;
  }
  .dioBox{
      display: flex;
      align-items: flex-start;
      justify-content: center;
      margin-bottom: 20px;
      padding: 0 20px;
      .el-textarea{
        width: 60%!important;
      }
  }
}
</style>

<style lang="scss" scoped>
.LineDetail-m {
  width: 100%;
  .el-form-item__label{
    color: #4a4a4a;
    font-weight: 400;
  }
  .detail-group{
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
    .steps{
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
