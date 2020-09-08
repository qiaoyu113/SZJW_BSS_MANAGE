<template>
  <div class="driverDetail">
    <el-card
      class="baseInfo"
      :class="{
        p15: isPC
      }"
      shadow="never"
    >
      <SectionContainer
        title="司机信息"
        :md="true"
      >
        <self-form
          class="base"
          :list-query="listQuery"
          :form-item="formItem"
          label-width="80px"
          :m-block="true"
          :pc-block="true"
        />
      </SectionContainer>

      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="基本信息"
          name="f1"
        >
          <base-info
            :busi-type-name="listQuery.busiTypeName"
            :obj="baseObj"
          />
        </el-tab-pane>
        <el-tab-pane
          label="订单信息"
          name="f2"
        >
          <order-info :lists="orderLists" />
        </el-tab-pane>
        <el-tab-pane
          label="运力信息"
          name="f3"
        >
          <transport-info :lists="transportLists" />
        </el-tab-pane>
        <el-tab-pane
          label="标书信息"
          name="f4"
        >
          <bid-info :lists="bidLists" />
        </el-tab-pane>
        <el-tab-pane
          label="账号信息"
          name="f5"
        >
          <account-info :list-query="accountObj" />
        </el-tab-pane>
        <el-tab-pane
          label="跟进信息"
          name="f6"
        >
          <follow-item :lists="followLists" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import FollowItem from './components/FollowItem.vue'
import BaseInfo from './components/BaseInfo.vue'
import OrderInfo from './components/OrderInfo.vue'
import TransportInfo from './components/TransportInfo.vue'
import bidInfo from './components/BidInfo.vue'
import AccountInfo from './components/AccountInfo.vue'
import { GetDriverDetail, DriverFollowFormation, driverDetailToCarrierInfo, driverDetailToOrderInfo } from '@/api/driver'
import { SettingsModule } from '@/store/modules/settings'
import SectionContainer from '@/components/SectionContainer/index.vue'
interface IState {
    [key: string]: any;
}
@Component({
  name: 'DriverDetail',
  components: {
    SelfForm,
    FollowItem,
    BaseInfo,
    OrderInfo,
    TransportInfo,
    bidInfo,
    AccountInfo,
    SectionContainer
  }
})
export default class extends Vue {
  private driverId:string | number = '' // 司机id

  // 司机信息对象
  private listQuery:IState = {
    name: '',
    driverId: '',
    phone: '',
    workCityName: '',
    busiTypeName: '',
    gmTeam: '',
    gmIdName: ''
  }
  // 司机信息表单数组
  private formItem:any[] = [
    {
      type: 7,
      key: 'name',
      label: '姓名',
      tagAttrs: {
        style: {
          fontWeight: 'bold',
          fontSize: '16px'
        }
      }
    },
    {
      type: 7,
      key: 'driverId',
      label: '司机编号',
      tagAttrs: {
        style: {
          color: '#3DA1FF',
          fontWeight: 'bold'
        }
      }
    },
    {
      type: 7,
      key: 'phone',
      label: '手机号'
    },
    {
      type: 7,
      key: 'workCityName',
      label: '工作城市'
    },
    {
      type: 7,
      key: 'busiTypeName',
      label: '业务线'
    },
    {
      type: 7,
      key: 'gmTeam',
      label: '加盟小组'
    },
    {
      type: 7,
      key: 'gmIdName',
      label: '加盟经理'
    }

  ]
  // 当前激活的状态tab
  private activeName:string = 'f1'
  // 订单信息
  private orderLists = []
  // 运力信息
  private transportLists = []
  // 标书信息
  private bidLists = []
  // 账户信息
  private accountObj = {}
  // 基础信息
  private baseObj = {}
  // 跟进信息
  private followLists:any[] = []

  // 区分设备
  get isPC() {
    return SettingsModule.isPC
  }
  /**
   *获取司机详情
   */
  async getDriverDetail() {
    try {
      let params = {
        driverId: this.driverId
      }
      let { data: res } = await GetDriverDetail(params)
      if (res.success) {
        this.listQuery = res.data.driverInfoFormationVOList[0]
        this.baseObj = res.data.driverClueInterViewInfoVOList && res.data.driverClueInterViewInfoVOList[0]
      }
    } catch (err) {
      console.log('get driver detail fail:', err)
    }
  }

  /**
   *tab切换
   */
  handleClick(tab:any) {
    this.activeName = tab.name
    if (this.activeName === 'f1') {
      // 基本信息
    } else if (this.activeName === 'f2') {
      this.orderInfo()
    } else if (this.activeName === 'f3') {
      this.transportInfo()
    } else if (this.activeName === 'f4') {
      // 标书信息
    } else if (this.activeName === 'f5') {
      // 账号信息
    } else if (this.activeName === 'f6') {
      this.followFormation()
    }
  }
  /**
   * 跟进信息
   */
  async followFormation() {
    try {
      let params = {
        driverId: this.driverId
      }
      let { data: res } = await DriverFollowFormation(params)
      if (res.success) {
        this.followLists = res.data.driverFollowFormationVOList || []
      }
    } catch (err) {
      console.log(`follow formation fail:${err}`)
    }
  }
  /**
   * 运力信息
   */
  async transportInfo() {
    try {
      let params = {
        driverId: this.driverId
      }
      let { data: res } = await driverDetailToCarrierInfo(params)
      if (res.success) {
        this.transportLists = res.data || []
      }
    } catch (err) {
      console.log(`transport info fail:${err}`)
    }
  }
  /**
   * 获取订单信息
   */
  async orderInfo() {
    try {
      let params = {
        driverId: this.driverId
      }
      let { data: res } = await driverDetailToOrderInfo(params)
      if (res.success) {
        this.orderLists = res.data || []
      }
    } catch (err) {
      console.log(`orderInfo info fail:${err}`)
    }
  }

  mounted() {
    this.driverId = (this.$route as any).query.id
    this.getDriverDetail()
  }
}
</script>

<style scoped>
  .driverDetail >>> .el-card {
    padding-bottom: 20px;
    background: #f8f9fa;
    border: none;
  }
  .baseInfo >>> .el-card__body {
      padding: 0px;
  }
  .baseInfo >>> .el-form-item {
    margin-bottom: 0px;
  }

  .baseInfo >>> .el-form-item__label {
    color: #303133;
    font-size:14px;
  }

   @media screen and (max-width:700px) {
    .base >>> .el-form-item {
      width: 100%;
      padding: 10px 14px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-bottom: 1px solid #F8F9FA;
    }
    .base >>> .el-form-item__label {
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
    .base >>> .el-form-item__content {
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: #252525;
      line-height: 16px;
    }
    .base >>> dl {
      margin: 0px;
    }
    .base >>> dt {
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
 }

  @media screen and (min-width: 700px){
    .base >>> .el-form-item__label {
      font-size: 13px!important;
      color: #9e9e9e!important;
      font-weight: 400;
      padding-right: 16px;
    }
    .base >>> .el-form-item__content span {
      font-size: 14px;
      color: #333;
      font-weight: 700;
      overflow-wrap: break-word;
    }
    .driverDetail >>> .el-tabs__header{
      padding: 0 10px;
      box-sizing: border-box;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      background: #fff;
      margin-bottom: 5px;
    }
    .driverDetail >>> .el-tabs__content{
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      background: #fff;
    }
    .driverDetail >>> .title_left_border{
      margin-left: 15px;
    }
    .driverDetail >>> .context_d{
      padding: 0 30px;
    }
  }
</style>
