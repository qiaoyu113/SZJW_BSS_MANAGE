<template>
  <div class="carInfo">
    <dl>
      <dt class="title">
        {{ busiTypeName }}信息
        <span class="border" />
      </dt>
      <dd>
        <self-form
          class="base"
          :list-query="listQuery"
          :form-item="formItem"
          :is-block="true"
          label-width="80px"
        >
          <template v-slot:intentCargoType="{row}">
            <span v-if="row.intentCargoType ===1">快递</span>
            <span v-else-if="row.intentCargoType ===2">商超</span>
            <span v-else-if="row.intentCargoType ===3">生鲜</span>
            <span v-else-if="row.intentCargoType ===4">家电服饰</span>
            <span v-else-if="row.intentCargoType ===5">其他</span>
          </template>
          <template v-slot:householdType="{row}">
            <span v-if="row.householdType ===1">农村</span>
            <span v-else>城镇</span>
          </template>
          <template v-slot:isLocalPlate="{row}">
            <span v-if="row.isLocalPlate ===1">是</span>
            <span v-else>否</span>
          </template>
          <template v-slot:isAdvancedIntention="{row}">
            <span v-if="row.isAdvancedIntention">是</span>
            <span v-else>否</span>
          </template>
          <template v-slot:interviewDate="{row}">
            {{ row.interviewDate | parseTime('{y}-{m}-{d}') }}
          </template>
          <template v-slot:live="{row}">
            {{ row.liveProvinceName }}{{ '-'+row.liveCityName }}{{ '-'+row.liveCountyName }}
          </template>
          <template v-slot:intentWork="{row}">
            {{ row.intentWorkProvinceName }}{{ '-'+row.intentWorkCityName }}{{ '-'+row.intentWorkCountyName }}
          </template>
          <template v-slot:household="{row}">
            {{ row.householdProvinceName }}{{ '-'+row.householdCityName }}{{ '-'+row.householdCountyName }}
          </template>
          <template v-slot:scatteredJobRate="{row}">
            {{ row.scatteredJobRate }}%
          </template>
          <template v-slot:isNewEnergy="{row}">
            {{ row.isNewEnergy === 0 ? '是':'否' }}
          </template>
          <template v-slot:experience="{row}">
            {{ row.experience }}月
          </template>
          <template v-slot:drivingAge="{row}">
            {{ row.drivingAge }}月
          </template>
          <template v-slot:livingAge="{row}">
            {{ row.livingAge }}月
          </template>
          <template v-slot:hasOwnCar="{row}">
            {{ row.hasOwnCar === 0 ? '无':'有' }}
          </template>
          <template v-slot:maxAdvancePayment="{row}">
            <span v-if="row.maxAdvancePayment ===1">3万以下</span>
            <span v-else-if="row.maxAdvancePayment ===2">3-5万</span>
            <span v-else-if="row.maxAdvancePayment ===3">5-8万</span>
            <span v-else-if="row.maxAdvancePayment ===4">8万以上</span>
            <span v-else-if="row.maxAdvancePayment ===5">全款</span>
          </template>
          <template v-slot:heavyLifting="{row}">
            <span v-if="row.heavyLifting ===0">是</span>
            <span v-else-if="row.heavyLifting ===1">否</span>
          </template>
          <template v-slot:providePersonalCredit="{row}">
            <span v-if="row.providePersonalCredit ===0">是</span>
            <span v-else-if="row.providePersonalCredit ===1">否</span>
          </template>
        </self-form>
      </dd>
      <!-- <dd>
        <span class="noData">暂无数据</span>
      </dd> -->
    </dl>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/base/SelfForm.vue'

@Component({
  name: 'CarInfo',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: '' }) busiTypeName!:string
  @Prop({ default: () => {} }) obj!:any

  private listQuery = {

  }

  private formItem = []

  private specialForm = {
    gmName: '',
    name: '',
    workCityName: '',
    sourceChannelName: '',
    whereKnow: '',
    heavyAgentName: '',
    phone: '',
    age: '',
    liveProvinceName: '',
    liveCityName: '',
    liveCountyName: '',
    intentDeliveryModeName: '',
    intentCargoType: '',
    intentWorkDurationName: '',
    originIncomeAvg: '',
    expIncomeAvg: '',
    householdType: '',
    householdProvinceName: '',
    householdCityName: '',
    householdCountyName: '',
    householdDistrict: '',
    intentWorkProvinceName: '',
    intentWorkCityName: '',
    intentWorkCountyName: '',
    childNum: '',
    experience: '',
    drivingAge: '',
    livingAge: '',
    drivingLicenceTypeName: '',
    intentDrivingCarTypeName: '',
    hasOwnCar: '',
    ownCarNum: '',
    maxAdvancePayment: '',
    heavyLifting: '',
    providePersonalCredit: '',
    strategyRightName: '',
    cooperateFocusPointName: '',
    cooperateKeyFactorName: '',
    isAdvancedIntention: '',
    remarks: ''
  }

  private specialItem = [
    {
      type: 7,
      label: '加盟经理:',
      key: 'gmName'
    },
    {
      type: 7,
      label: '司机姓名:',
      key: 'name'
    },
    {
      type: 7,
      label: '城市:',
      key: 'workCityName'
    },
    {
      type: 7,
      label: '来源渠道:',
      key: 'sourceChannelName'
    },

    {
      type: 7,
      label: '您是从哪里了解我们的加盟信息:',
      col: 24,
      w: '220px',
      key: 'whereKnow'
    },
    {
      type: 7,
      label: '重代理姓名:',
      w: '110px',
      key: 'heavyAgentName'
    },
    {
      type: 7,
      label: '司机手机号:',
      w: '110px',
      key: 'phone'
    },
    {
      type: 7,
      label: '年龄:',
      key: 'age'
    },
    {
      type: 'live',
      label: '居住地址:',
      slot: true
    },
    {
      type: 'intentWork',
      label: '意向工作区域:',
      w: '120px',
      col: 12,
      slot: true
    },
    {
      type: 7,
      label: '意向配送模式:',
      w: '130px',
      key: 'intentDeliveryModeName'
    },
    {
      label: '意向货物类型:',
      w: '130px',
      type: 'intentCargoType',
      slot: true
    },
    {
      type: 7,
      label: '意向工作时间段:',
      w: '130px',
      key: 'intentWorkDurationName'
    },
    {
      type: 7,
      label: '原职业月均收入:',
      w: '130px',
      key: 'originIncomeAvg'
    },
    {
      type: 7,
      label: '期望月均净收入:',
      w: '130px',
      key: 'expIncomeAvg'
    },
    {
      type: 'householdType',
      label: '户口性质:',
      slot: true
    },
    {
      type: 'household',
      label: '户籍地址:',
      col: 12,
      slot: true
    },
    {
      type: 7,
      label: '户籍地址具体区域:',
      w: '150px',
      key: 'householdDistrict'
    },
    {
      type: 7,
      label: '子女数:',
      key: 'childNum'
    },
    {
      type: 'experience',
      label: '货物运输经验:',
      w: '130px',
      slot: true
    },
    {
      type: 'drivingAge',
      label: '实际货车驾龄:',
      w: '130px',
      slot: true
    },
    {
      type: 'livingAge',
      label: '本城市居住时长:',
      w: '150px',
      slot: true
    },
    {
      type: 7,
      label: '驾照类型:',
      key: 'drivingLicenceTypeName'
    },
    {
      type: 7,
      label: '意向驾驶车型:',
      w: '130px',
      key: 'intentDrivingCarTypeName'
    },
    {
      type: 'hasOwnCar',
      label: '是否有自己的货车:',
      w: '150px',
      slot: true
    },
    {
      type: 7,
      label: '自己的货车数量:',
      key: 'ownCarNum',
      w: '150px'
    },
    {
      type: 'maxAdvancePayment',
      label: '最大可支付首付款:',
      w: '150px',
      slot: true
    },
    {
      type: 'heavyLifting',
      label: '是否能承担较重搬运:',
      w: '150px',
      slot: true
    },
    {
      type: 'providePersonalCredit',
      label: '能否提供个人征信:',
      w: '150px',
      slot: true
    },
    {
      type: 7,
      label: '投资决策权:',
      w: '110px',
      key: 'strategyRightName'
    },
    {
      type: 7,
      label: '如果有机会跟云鸟合作，你看中的是什么:',
      col: 24,
      key: 'cooperateFocusPointName',
      w: '290px'
    },
    {
      type: 7,
      label: '最终决定你是否与云鸟合作的关键因素是什么:',
      col: 24,
      key: 'cooperateKeyFactorName',
      w: '320px'
    },
    {
      label: '是否是高意向司机:',
      type: 'isAdvancedIntention',
      slot: true,
      w: '150px'
    },
    {
      type: 7,
      label: '备注:',
      key: 'remarks'
    }
  ]

  private shareForm = {
    interviewDate: '',
    interviewDistrict: '',
    workCityName: '',
    gmName: '',
    name: '',
    phone: '',
    age: '',
    intentDrivingCarTypeName: '',
    liveProvinceName: '',
    liveCityName: '',
    liveCountyName: '',
    sourceChannelName: '',
    drivingLicenceTypeName: '',
    isLocalPlate: '',
    originIncomeAvg: '',
    expIncomeAvg: '',
    workDuration: '',
    scatteredJobRate: '',
    isNewEnergy: ''
  }

  private shareItem = [
    {
      type: 'interviewDate',
      label: '面试日期:',
      slot: true
    },
    {
      type: 7,
      label: '面试地址:',
      key: 'interviewDistrict'
    },
    {
      type: 7,
      label: '司机年龄:',
      key: 'age'
    },
    {
      type: 7,
      label: '加盟经理:',
      key: 'gmName'
    },
    {
      type: 'live',
      label: '居住地址:',
      slot: true
    },
    {
      type: 7,
      label: '邀约渠道:',
      key: 'sourceChannelName'
    },
    {
      type: 7,
      label: '工作城市:',
      key: 'workCityName'
    },
    {
      type: 7,
      label: '驾照类型:',
      key: 'drivingLicenceTypeName'
    },
    {
      label: '是否工作地车牌:',
      w: '120px',
      type: 'isLocalPlate',
      slot: true
    },
    {
      type: 7,
      label: '原收入:',
      key: 'originIncomeAvg'
    },
    {
      type: 7,
      label: '期望月均净收入:',
      w: '120px',
      key: 'expIncomeAvg'
    },
    {
      type: 7,
      label: '从业时间:',
      key: 'workDuration'
    },
    {
      type: 'scatteredJobRate',
      label: '零散活占比（%):',
      w: '120px',
      slot: true
    },
    {
      type: 'isNewEnergy',
      label: '是否新能源:',
      w: '100px',
      slot: true
    },
    {
      type: 7,
      label: '司机姓名:',
      key: 'name'
    },
    {
      type: 7,
      label: '司机手机号:',
      w: '100px',
      key: 'phone'
    },
    {
      type: 7,
      label: '车型:',
      key: 'intentDrivingCarTypeName'
    }

  ]

  @Watch('busiTypeName')
  onBusiTypeNameChange(val:string) {
    if (val === '共享') {
      this.formItem = this.shareItem as any
      for (let key in this.shareForm) {
        this.$set(this.listQuery, key, this.obj[key])
      }
    } else if (val === '专车') {
      this.formItem = this.specialItem as any
      for (let key in this.specialForm) {
        this.$set(this.listQuery, key, this.obj[key])
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .carInfo {
    dl {
      dt {
       color:#303133;
       font-weight:bold;
       height:40px;
       border-bottom:1px solid #EBEBEB;
      }

      dd {
        margin-left: 0px;
        .noData {
          display: flex;
          justify-content: center;
          align-items: center;
          height:100px;
        }
      }
    }
  }
</style>

<style scoped>
 @media screen and (max-width:700px) {
    .carInfo >>> .selfForm {
      padding: 0px;
    }
    .carInfo >>> .el-form-item {
      width: 100%;
      padding: 10px 14px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-bottom: 1px solid #F8F9FA;
    }
    .carInfo >>> .el-form-item__label {
      width: 100%!important;
      font-size: 12px!important;
      line-height: 13px;
      color: #666;
      font-weight: 400;
      text-align: left;
      padding-right: 15px;
      padding-bottom: 10px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    .carInfo >>> .el-form-item__content {
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: #252525;
      line-height: 16px;
    }
    .carInfo >>> dl {
      margin: 0px;
    }
    .carInfo >>> dt {
      width: 100%;
      height: 45px!important;
      line-height: 40px;
      font-size: 15px;
      color: #4A4A4A;
      font-weight: 500;
      position: relative;
      padding: 0 20px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    .carInfo >>> .border {
      width: 4px;
      height: 14px;
      position: absolute;
      left: 10px;
      top: -1px;
      bottom: 0;
      margin: auto;
      background-image: -webkit-gradient(linear, right top, left top, from(#FF9600), to(#FFB400));
      background-image: linear-gradient(270deg, #FF9600 0%, #FFB400 100%);
      border-radius: 2.5px;
      border-radius: 2.5px;
      display: inline-block;
    }
 }
</style>
