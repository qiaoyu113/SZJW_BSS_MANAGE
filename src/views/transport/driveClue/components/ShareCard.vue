<template>
  <div class="shareCard">
    <self-form
      ref="form"
      :list-query="listQuery"
      :form-item="formItem"
      label-width="100px"
      :m-block="true"
      :pc-block="true"
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
import SelfForm from '@/components/Base/SelfForm.vue'
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

  // 表单对象
  private listQuery:IState = {
    interviewDate: '',
    interviewProvinceName: '',
    interviewCityName: '',
    interviewCountyName: '',
    interviewDistrict: '',
    age: '',
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
    workDuration: '',
    scatteredJobRate: '',
    isNewEnergy: ''
  }
  // 表单数组
  private formItem:any[] = [
    {
      type: 7,
      key: 'interviewDate',
      label: '面试日期'
    },
    {
      slot: true,
      type: 'interviewAddress',
      label: '面试地址'
    },
    {
      type: 7,
      key: 'interviewDistrict',
      label: '详细面试地址',
      w: '150px'
    },
    {
      type: 7,
      key: 'age',
      label: '司机年龄'
    },
    {
      type: 7,
      key: 'gmName',
      label: '加盟经理'
    },
    {
      type: 'home',
      slot: true,
      label: '现住址'
    },
    {
      type: 7,
      key: 'liveDistrict',
      label: '详细住址'
    },
    {
      type: 7,
      key: 'sourceChannelName',
      label: '邀约渠道'
    },
    {
      type: 7,
      key: 'drivingLicenceTypeName',
      label: '驾照类型'
    },
    {
      type: 'isLocalPlate',
      label: '是否工作地车牌',
      w: '130px',
      slot: true
    },
    {
      type: 7,
      key: 'originIncomeAvg',
      label: '原收入(去油)(元/月)',
      w: '160px'
    },
    {
      type: 7,
      key: 'expIncomeAvg',
      label: '期望收入(去油)(元/月)',
      w: '170px'
    },
    {
      type: 7,
      key: 'workDuration',
      label: '从业时间(月)',
      w: '130px'
    },
    {
      type: 7,
      key: 'scatteredJobRate',
      label: '零散活占比(%)',
      w: '130px'
    },
    {
      slot: true,
      type: 'isNewEnergy',
      label: '是否新能源'
    }
  ]

  @Watch('form', { deep: true })
  onChange(val:any) {
    this.listQuery = { ...this.listQuery, ...val }
  }
}
</script>

<style scoped>
  .shareCard >>> .el-form-item {
    margin-bottom:0px;
  }
  @media screen and (max-width: 700px){
    .shareCard >>> .el-form-item {
      width: 100%;
      padding: 10px 14px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-bottom: 1px solid #F8F9FA;
    }
    .shareCard >>> .el-form-item__label {
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
    .shareCard >>> .el-form-item__content span{
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: #252525;
      line-height: 16px;
    }
  }
  @media screen and (min-width: 700px){
   .shareCard >>> .el-form-item__label {
      font-size: 13px!important;
      color: #9e9e9e!important;
      font-weight: 400;
      padding-right: 16px;
    }
    .shareCard >>> .el-form-item__content span {
      font-size: 14px;
      color: #333;
      font-weight: 700;
      overflow-wrap: break-word;
    }
  }
</style>
