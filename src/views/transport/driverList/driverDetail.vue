<template>
  <div class="driverDetail">
    <el-card
      class="baseInfo"
      :style="{
        margin: isPC ? '15px' :'0px'
      }"
      shadow="never"
    >
      <self-form
        class="base"
        :list-query="listQuery"
        :form-item="formItem"
        label-width="80px"
      />
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
import FollowItem from './components/followItem.vue'
import BaseInfo from './components/baseInfo.vue'
import OrderInfo from './components/orderInfo.vue'
import TransportInfo from './components/transportInfo.vue'
import bidInfo from './components/bidInfo.vue'
import AccountInfo from './components/accountInfo.vue'
import { GetDriverDetail, DriverFollowFormation, driverDetailToCarrierInfo, driverDetailToOrderInfo } from '@/api/driver'
import { SettingsModule } from '@/store/modules/settings'

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
    AccountInfo
  }
})
export default class extends Vue {
  private driverId:string | number = ''
  private listQuery:IState = {
    name: '',
    driverId: '',
    phone: '',
    workCityName: '',
    busiTypeName: '',
    gmTeam: '',
    gmIdName: ''
  } // 司机信息

  private formItem:any[] = [
    {
      type: 7,
      key: 'name',
      label: '姓名:',
      col: 24,
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
      label: '司机编号:',
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
      label: '手机号:'
    },
    {
      type: 7,
      key: 'workCityName',
      label: '工作城市:'
    },
    {
      type: 7,
      key: 'busiTypeName',
      label: '业务线:'
    },
    {
      type: 7,
      key: 'gmTeam',
      label: '加盟小组:'
    },
    {
      type: 7,
      key: 'gmIdName',
      label: '加盟经理:'
    }

  ]

  private activeName:string = 'f1'

  private orderLists = []

  private transportLists = []
  private bidLists = []

  private accountObj = {}

  private baseObj = {}

  private followLists:any[] = []

  mounted() {
    this.driverId = (this.$route as any).query.id
    this.getDriverDetail()
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
        this.baseObj = res.data.driverClueInterViewInfoVOList[0]
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
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>
<style lang="scss" scoped>

</style>

<style scoped>
  .baseInfo >>> .el-form-item {
    margin-bottom: 0px;
  }

  .baseInfo >>> .el-form-item__label {
    color: #303133;
    font-size:14px;
  }

  @media screen and (max-width: 700px){
    .baseInfo >>> .el-card__body {
      padding: 0px;
    }
  }
</style>
