<template>
  <div class="driverDetail">
    <el-card class="baseInfo">
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
          <base-info />
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
import SelfForm from '@/components/base/SelfForm.vue'
import FollowItem from './components/followItem.vue'
import BaseInfo from './components/baseInfo.vue'
import OrderInfo from './components/orderInfo.vue'
import TransportInfo from './components/transportInfo.vue'
import bidInfo from './components/bidInfo.vue'
import AccountInfo from './components/accountInfo.vue'
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
  private listQuery:IState = {
    name: '穆家祥',
    code: 'SHS121313131',
    phone: '15021578502',
    city: '北京市',
    line: '共享',
    group: '共享一组',
    manager: '王利'
  }

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
      key: 'code',
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
      key: 'city',
      label: '工作城市:'
    },
    {
      type: 7,
      key: 'line',
      label: '业务线:'
    },
    {
      type: 7,
      key: 'group',
      label: '加盟小组:'
    },
    {
      type: 7,
      key: 'manager',
      label: '加盟经理:'
    }

  ]

  private activeName:string = 'f1'

  private orderLists = [
    {
      code: '1231313',
      a: '梧桐共享',
      b: '带车',
      c: '4.2米厢货',
      d: 3,
      e: 4000,
      f: 6.5,
      g: Date.now()
    },
    {
      code: '1231313qqwq',
      a: '梧桐共享',
      b: '带车',
      c: '4.2米厢货',
      d: 3,
      e: 4000,
      f: 6.5,
      g: Date.now()
    }
  ]

  private transportLists = [
    {
      code: 'YY1231313',
      a: '穆家祥',
      b: '15021578502',
      c: '杭州市',
      d: '京A B1556',
      e: '4.2米厢货',
      f: '待上岗',
      g: Date.now()
    },
    {
      code: 'YYY1231313qqwq',
      a: '穆家祥',
      b: '15021578502',
      c: '杭州市',
      d: '京A B1556',
      e: '4.2米厢货',
      f: '待上岗',
      g: Date.now()
    }
  ]
  private bidLists = [
    {
      code: '202007091001',
      a: '穆家祥',
      b: '吴江体育用品',
      c: Date.now(),
      d: '202007091001',
      e: '吴江体育用品'
    },
    {
      code: '202007091002',
      a: '穆家祥',
      b: '吴江体育用品',
      c: Date.now(),
      d: '202007091002',
      e: '吴江体育用品'
    }
  ]

  private accountObj = {
    name: '穆家祥',
    a: '20200709313331',
    b: '15021578502',
    c: '北京市',
    d: '4.2米厢货',
    e: '共享一组、专车二组',
    f: 100000,
    g: 100,
    h: 200000
  }

  private followLists:any[] = [
    {
      tag: '征信通过情况',
      desc: '征信已通过',
      name: '穆家祥',
      time: Date.now()
    },
    {
      tag: '成交意向',
      desc: '有较高成交意向',
      name: '穆家祥',
      time: Date.now()
    }
  ]

  /**
   *tab切换
   */
  handleClick() {

  }
}
</script>
<style lang="scss" scoped>
  .baseInfo {
    margin: 20px;
  }
</style>

<style scoped>
  .baseInfo >>> .el-form-item {
    margin-bottom: 0px;
  }

  .baseInfo >>> .el-form-item__label {
    color: #303133;
    font-size:14px;
    font-weight: 400;
  }
</style>
