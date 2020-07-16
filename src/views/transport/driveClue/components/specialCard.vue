<template>
  <div class="specialCard">
    <self-form
      ref="form"
      :list-query="listQuery"
      :form-item="formItem"
      label-width="100px"
      :pc-col="12"
    >
      <template v-slot:interviewAddress="{row}">
        <span>{{ row.interviewProvinceName }}
          {{ row.interviewCityName }}
          {{ row.interviewCountyName }}
        </span>
      </template>
      <template v-slot:intentAddress="{row}">
        <span>{{ row.intentWorkProvinceName }}
          {{ row.intentWorkCityName }}
          {{ row.intentWorkCountyName }}
        </span>
      </template>
      <template v-slot:houseAddress="{row}">
        <span>{{ row.householdProvinceName }}
          {{ row.householdCityName }}
          {{ row.householdCountyName }}
        </span>
      </template>
      <template v-slot:hasOwnCar="{row}">
        <span v-if="row.hasOwnCar">有</span>
        <span v-else>无</span>
      </template>
      <template v-slot:heavyLifting="{row}">
        <span v-if="row.heavyLifting">是</span>
        <span v-else>否</span>
      </template>
      <template v-slot:providePersonalCredit="{row}">
        <span v-if="row.providePersonalCredit">是</span>
        <span v-else>否</span>
      </template>
      <template v-slot:isAdvancedIntention="{row}">
        <span v-if="row.providePersonalCredit">是</span>
        <span v-else>否</span>
      </template>
      <template v-slot:householdType="{row}">
        <span v-if="row.householdType === 1">农村</span>
        <span v-else-if="row.householdType === 2">城镇</span>
      </template>
    </self-form>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/base/SelfForm.vue'
@Component({
  name: 'SpecialCard',
  components: {
    SelfForm
  }
})
export default class extends Vue {
    @Prop({ default: () => {} }) form!:any

    private listQuery = {
      gmName: '',
      inviteType: '',
      sourceChannelName: '',
      whereKnow: '',
      heavyAgentName: '',
      age: '',
      interviewProvinceName: '',
      interviewCityName: '',
      interviewCountyName: '',
      interviewDistrict: '',
      intentWorkProvinceName: '',
      intentWorkCityName: '',
      intentWorkCountyName: '',
      intentWorkDistrict: '',
      intentDeliveryModeName: '',
      intentCargoTypeName: '',
      intentWorkDurationName: '',
      originIncomeAvg: '',
      expIncomeAvg: '',
      householdType: '',
      householdProvinceName: '',
      householdCityName: '',
      householdCountyName: '',
      householdDistrict: '',
      childNum: '',
      experience: '',
      drivingAge: '',
      livingAge: '',
      drivingLicenceTypeName: '',
      hasOwnCar: '',
      ownCarNum: '',
      maxAdvancePaymentName: '',
      heavyLifting: '',
      providePersonalCredit: '',
      strategyRightName: '',
      cooperateFocusPointName: '',
      cooperateKeyFactorName: '',
      isAdvancedIntention: '',
      remarks: ''
    }

    private formItem = [
      {
        type: 7,
        key: 'gmName',
        label: '加盟经理:'
      },
      {
        type: 7,
        key: 'inviteType',
        label: '邀约方式:xx'
      },
      {
        type: 7,
        key: 'sourceChannelName',
        label: '来源渠道:'
      },
      {
        type: 7,
        key: 'whereKnow',
        label: '您是从哪里了解我们的加盟信息?',
        w: '230px'
      },
      {
        type: 7,
        key: 'heavyAgentName',
        label: '重代理姓名:'
      },
      {
        type: 7,
        key: 'age',
        label: '年龄:'
      },
      {
        slot: true,
        type: 'interviewAddress',
        label: '面试地址:'
      },
      {
        type: 7,
        key: 'interviewDistrict',
        label: '详细居住地址:',
        w: '150px'
      },
      {
        slot: true,
        type: 'intentAddress',
        label: '意向工作区域:',
        w: '130px'
      },
      {
        type: 7,
        key: 'intentWorkDistrict',
        label: '详细意向工作区域:',
        w: '150px'
      },
      {
        type: 7,
        key: 'intentDeliveryModeName',
        label: '意向配送模式',
        w: '130px'
      },
      {
        type: 7,
        key: 'intentCargoTypeName',
        label: '意向货物类型',
        w: '130px'
      },
      {
        type: 7,
        key: 'intentWorkDurationName',
        label: '意向工作时间段',
        w: '140px'
      },
      {
        type: 7,
        key: 'originIncomeAvg',
        label: '原职业月均收入（元/月）',
        w: '200px'
      },
      {
        type: 7,
        key: 'expIncomeAvg',
        label: '期望月均净收入，去油去电（元/月）',
        w: '260px'
      },
      {
        type: 'householdType',
        label: '户籍类型',
        slot: true
      },
      {
        type: 7,
        key: 'houseAddress',
        label: '户籍地址:'
      },
      {
        type: 7,
        key: 'householdDistrict',
        label: '详细户籍地址:',
        w: '150px'
      },
      {
        label: '子女数',
        key: 'childNum',
        type: 7
      },
      {
        type: 7,
        label: '货物运输经验（月)',
        key: 'experience',
        w: '150px'
      },
      {
        type: 7,
        key: 'drivingAge',
        label: '实际货车驾龄（月)',
        w: '150px'
      },
      {
        type: 7,
        key: 'livingAge',
        label: '本城市居住时长（月)',
        w: '160px'
      },
      {
        type: 7,
        key: 'drivingLicenceTypeName',
        label: '驾照类型'
      },
      {
        slot: true,
        type: 'hasOwnCar',
        label: '是否有自己的货车',
        w: '150px',
        col: 8
      },
      {
        type: 7, // 有几辆
        key: 'ownCarNum',
        w: '0px',
        col: 4
      },
      {
        type: 7,
        key: 'maxAdvancePaymentName',
        label: '最大可支付首付款',
        w: '150px'
      },
      {
        slot: true,
        type: 'heavyLifting',
        label: '是否能承担较重搬运',
        w: '150px'
      },
      {
        slot: true,
        type: 'providePersonalCredit',
        label: '能否提供个人征信',
        w: '150px'
      },
      {
        type: 7,
        key: 'strategyRightName',
        label: '投资决策权'
      },
      {
        type: 2,
        key: 'cooperateFocusPointName',
        label: '如果有机会跟云鸟合作，你看中的是什么',
        w: '280px'
      },
      {
        type: 7,
        label: '最终决定你是否与云鸟合作的关键因素是什么?',
        key: 'cooperateKeyFactorName',
        w: '330px'
      },
      {
        slot: true,
        type: 'isAdvancedIntention',
        label: '是否是高意向司机',
        w: '150px'
      },
      {
        type: 7,
        key: 'remarks',
        label: '备注 '
      }
    ]

    @Watch('form', { deep: true })
    onChange(val:any) {
      this.listQuery = { ...this.listQuery, ...val }
    }
}
</script>
<style lang="scss" scoped>
  .specialCard {

  }
</style>
