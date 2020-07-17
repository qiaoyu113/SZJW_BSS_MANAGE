<template>
  <div class="shareCard">
    <self-form
      ref="form"
      :list-query="listQuery"
      :form-item="formItem"
      label-width="100px"
      :pc-col="12"
    >
      <template v-slot:interviewAddress="{row}">
        <span>{{ row.interviewProvinceName }}{{ row.interviewCityName }}{{ row.interviewCountyName }}</span>
      </template>
      <template v-slot:home="{row}">
        <span>{{ row.liveProvinceName }}{{ row.liveCityName }}{{ row.liveCountyName }}</span>
      </template>
      <template v-slot:isLocalPlate="{row}">
        <span v-if="row.isLocalPlate">是</span>
        <span v-else>否</span>
      </template>
      <template v-slot:isNewEnergy="{row}">
        <span v-if="row.isNewEnergy">是</span>
        <span v-else>否</span>
      </template>
    </self-form>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/base/SelfForm.vue'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'ShareCard',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) form!:any
  private listQuery:IState = {
    interviewDate: '',
    interviewProvinceName: '',
    interviewCityName: '',
    interviewCountyName: '',
    interviewDistrict: '',
    gmName: '',
    liveProvinceName: '',
    liveCityName: '',
    liveCountyName: '',
    liveDistrict: '',
    sourceChannelName: '',
    drivingLicenceTypeName: '',
    isLocalPlate: '',
    originIncomeAvg: '',
    expIncomeAvg: '',
    intentWorkDurationName: '',
    scatteredJobRate: '',
    isNewEnergy: ''
  }
  private formItem:any[] = [
    {
      type: 7,
      key: 'interviewDate',
      label: '面试日期:'
    },
    {
      slot: true,
      type: 'interviewAddress',
      label: '面试地址:'
    },
    {
      type: 7,
      key: 'interviewDistrict',
      label: '详细面试地址:',
      w: '150px'
    },
    {
      type: 7,
      key: 'gmName',
      label: '加盟经理:'
    },
    {
      type: 'home',
      slot: true,
      label: '现住址:'
    },
    {
      type: 7,
      key: 'liveDistrict',
      label: '详细住址:'
    },
    {
      type: 7,
      key: 'sourceChannelName',
      label: '邀约渠道:'
    },
    {
      type: 7,
      key: 'drivingLicenceTypeName',
      label: '驾照类型:'
    },
    {
      type: 'isLocalPlate',
      label: '是否工作地车牌:',
      w: '130px',
      slot: true
    },
    {
      type: 7,
      key: 'originIncomeAvg',
      label: '原收入(去油)(元/月):',
      w: '160px'
    },
    {
      type: 7,
      key: 'expIncomeAvg',
      label: '期望收入(去油)(元/月):',
      w: '170px'
    },
    {
      type: 7,
      key: 'intentWorkDurationName',
      label: '意向工作时间段:',
      w: '130px'
    },
    {
      type: 7,
      key: 'scatteredJobRate',
      label: '零散活占比(%):',
      w: '130px'
    },
    {
      slot: true,
      type: 'isNewEnergy',
      label: '是否新能源:'
    }
  ]

  @Watch('form', { deep: true })
  onChange(val:any) {
    this.listQuery = { ...this.listQuery, ...val }
  }
}
</script>
<style lang="scss" scoped>
  .shareCard {

  }
</style>
