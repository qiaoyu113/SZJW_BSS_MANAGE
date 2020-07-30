<template>
  <div :class="isPC ? 'TransportDetail' : 'TransportDetail-m'">
    <template>
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="基本信息"
          name="first"
        >
          <el-card>
            <div class="baseBox">
              <self-form
                class="base"
                :list-query="detailQuery"
                :form-item="formItem"
                label-width="80px"
              >
                <template slot="detail">
                  <router-link
                    :to="{path: '/join/orderdetail',query: {id: detailQuery.orderId}}"
                    class="link"
                  >
                    详情>>
                  </router-link>
                </template>

                <template v-slot:payTypeName="{row}">
                  {{ row.payTypeName === '' ? row.orderPayRecordInfoVOList[0].payTypeName : row.payTypeName }}
                </template>
                <template v-slot:payCompleteTime="{row}">
                  {{ row.payCompleteTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
                </template>
              </self-form>

              <base-info :item="baseObj" />
              <base-info :item="otherObj" />
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane
          label="标书信息"
          name="second"
        >
          <el-card>
            <div class="bidBox">
              <bid-info
                :lists="bidLists"
                :form-item="bidForm"
              />
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { carrierDetail } from '@/api/transport'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import SelfForm from '@/components/Base/SelfForm.vue'
import bidInfo from '../driverList/components/bidInfo.vue'
import baseInfo from './components/baseInfo.vue'
import '@/styles/common.scss'
interface IState {
    [key: string]: any;
}

    @Component({
      name: 'TransportDetail',
      components: {
        DetailItem,
        SectionContainer,
        SelfForm,
        bidInfo,
        baseInfo
      }
    })

export default class extends Vue {
  private activeName:string = 'first'
  private carrierId:string = ''

  private bidLists = [
    {
      code: '202007091001',
      a: '穆家祥',
      b: '吴江体育用品',
      c: Date.now(),
      d: '202007091001',
      e: '吴江体育用品'
    }
  ]

  private bidForm:any[] = [
    {
      type: 7,
      key: 'a',
      label: '运力姓名:'
    },
    {
      type: 7,
      key: 'b',
      label: '标书名称:'
    },
    {
      type: 'c',
      key: 'c',
      label: '创建时间:',
      slot: true
    },
    {
      key: 'd',
      type: 7,
      label: '线路编号:'
    },
    {
      key: 'e',
      type: 7,
      label: '线路名称:'
    },
    {
      slot: true,
      w: '10px',
      type: 'detail'
    }
  ]

  private detailQuery:IState = {
    orderId: '',
    busiTypeName: '',
    cooperationModelName: '',
    cooperationCarName: '',
    cooperationTime: '',
    goodsAmount: '',
    payTypeName: '',
    payCompleteTime: ''
  }

  private formItem:any[] = [
    {
      type: 7,
      key: 'orderId',
      label: '订单编号:',
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
      key: 'busiTypeName',
      label: '商品分类:'
    },
    {
      type: 7,
      key: 'cooperationModelName',
      label: '合作模式:'
    },
    {
      type: 7,
      key: 'cooperationCarName',
      label: '合作车型:'
    },
    {
      type: 7,
      key: 'cooperationTime',
      label: '合作期限:'
    },
    {
      type: 7,
      key: 'goodsAmount',
      label: '订单金额:'
    },
    {
      type: 'payTypeName',
      label: '支付方式:',
      slot: true
    },
    {
      type: 'payCompleteTime',
      label: '支付时间:',
      slot: true
    },
    {
      slot: true,
      key: 'driverId',
      w: '10px',
      type: 'detail'
    }
  ]

  private baseObj:any = {
    title: '基本信息',
    carrierId: '',
    name: '',
    phone: '',
    busiTypeName: '',
    workCityName: '',
    carTypeName: '',
    plateNo: '',
    statusName: '',
    driverId: '',
    driverName: '',
    driverPhone: '',
    gmIdName: '',
    gmPhone: '',
    createName: '',
    createPhone: '',
    createDate: ''
  }

  private otherObj:any = {
    title: '其他信息',
    age: '',
    householdTypeName: '',
    workExperience: '',
    addr: '',
    cargoTypeName: '',
    expMonthlyIncomeName: '',
    avgMonthlyIncome: '',
    isIndebtedName: '',
    maxWorkTimeName: '',
    remarks: ''
  }

  private handleClick(tab:any, event:any) {
    console.log(tab, event)
  }

  private async carrierDetail() {
    let { data } = await carrierDetail({ carrierId: this.carrierId })
    if (data.success) {
      this.detailQuery = { ...this.detailQuery, ...data.data.orderInfoVO }
      this.baseObj = { ...this.baseObj, ...data.data }
      this.baseObj.driverName = data.data.orderInfoVO.driverName
      this.otherObj = { ...this.otherObj, ...data.data }
    } else {
      this.$message.error(data)
    }
  }

  private fetchData() {
    this.carrierDetail()
  }
  created() {
    let carrierId = (this.$route.query.carrierId as string)
    if (carrierId) {
      this.carrierId = carrierId
    }
  }

  mounted() {
    this.fetchData()
  }

  activated() {
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>

<style lang="scss">
.TransportDetail {
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
}
</style>

<style lang="scss" scoped>
.TransportDetail-m {
  width: 100%;
}
</style>
<style lang="scss" scoped>
.TransportDetail{
  .link {
        color: #649CEE;
        font-weight:bold;
      }
  .bidBox,.baseBox{
    min-height: calc(100vh - 250px);
  }
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
