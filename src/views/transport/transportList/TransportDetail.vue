<template>
  <div :class="isPC ? 'TransportDetail' : 'TransportDetail-m'">
    <template>
      <el-radio-group
        v-model="tabVal"
        class="radioGroup"
        style="margin-bottom: 30px;"
      >
        <el-radio-button label="1">
          基本信息
        </el-radio-button>
        <el-radio-button label="2">
          标书信息
        </el-radio-button>
      </el-radio-group>

      <div
        v-show="tabVal === '1'"
      >
        <SectionContainer
          :title="'订单编号'+detailQuery.orderId"
          :md="true"
        >
          <el-row>
            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="商品分类"
                :value="detailQuery.busiTypeName"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="合作模式"
                :value="detailQuery.cooperationModelName"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="合作车型"
                :value="detailQuery.cooperationCarName"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="合作期限"
                :value="detailQuery.cooperationTime"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="订单金额"
                :value="detailQuery.goodsAmount"
              />
            </el-col>

            <el-col
              v-if="detailQuery.orderId"
              :span="isPC ? 6 : 24"
            >
              <DetailItem
                name="支付方式"
                :value="detailQuery.payTypeName === '' ? detailQuery.orderPayRecordInfoVOList[0].payTypeName : detailQuery.payTypeName"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="支付时间"
                :value="detailQuery.payCompleteTime"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name=""
                value=""
              >
                <router-link
                  :to="{path: '/join/orderdetail',query: {id: detailQuery.orderId}}"
                  class="linkTo goDetail"
                >
                  详情>>
                </router-link>
              </DetailItem>
            </el-col>
          </el-row>
        </SectionContainer>
        <SectionContainer
          title="基本信息"
          :md="true"
        >
          <el-row>
            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="运力编号"
                :value="baseObj.carrierId"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="姓名"
                :value="baseObj.name"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="联系方式"
                :value="baseObj.phone"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="业务线"
                :value="baseObj.busiTypeName"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="工作城市"
                :value="baseObj.workCityName"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="意向车型"
                :value="baseObj.carTypeName"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="车牌号"
                :value="baseObj.plateNo"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="运力状态"
                :value="baseObj.statusName | DataIsNull"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="所属司机编号"
                value=""
              >
                <router-link
                  class="linkTo"
                  :to="{path: '/transport/driverDetail',query: {id: baseObj.driverId}}"
                >
                  {{ baseObj.driverId | DataIsNull }}
                </router-link>
              </DetailItem>
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="所属司机"
                :value="baseObj.driverName"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="所属司机手机号"
                :value="baseObj.driverPhone"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="运营经理"
                :value="baseObj.gmName"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="运营经理手机号"
                :value="baseObj.gmPhone"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="创建人"
                :value="baseObj.createName"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="创建人手机号"
                :value="baseObj.createPhone"
              />
            </el-col>
            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="创建时间"
                :value="baseObj.createDate"
              />
            </el-col>
          </el-row>
        </SectionContainer>
        <SectionContainer
          title="其他信息"
          :md="true"
        >
          <el-row>
            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="司机年龄"
                :value="otherObj.age| DataIsNull"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="户口类型姓名"
                :value="otherObj.householdTypeName| DataIsNull"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="货物运输经验（月）"
                :value="otherObj.workExperience| DataIsNull"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="家庭住址"
                :value="otherObj.addr| DataIsNull"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="配送货物类型"
                :value="otherObj.cargoTypeName| DataIsNull"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="期望月收入"
                :value="otherObj.expMonthlyIncomeName| DataIsNull"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="平均月收入"
                :value="otherObj.avgMonthlyIncome | DataIsNull"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="是否存在还贷款"
                :value="otherObj.isIndebtedName | DataIsNull"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="所属司机"
                :value="otherObj.driverName| DataIsNull"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="可接受一天工作时长"
                :value="otherObj.maxWorkTimeName| DataIsNull"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="运营经理"
                :value="otherObj.gmName| DataIsNull"
              />
            </el-col>

            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="备注"
                :value="otherObj.remarks| DataIsNull"
              />
            </el-col>
          </el-row>
        </SectionContainer>
      </div>
      <div
        v-show="tabVal === '2'"
      >
        <div class="bidBox">
          <bid-info
            :lists="bidLists"
            :form-item="bidForm"
          />
        </div>
      </div>
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
import BidInfo from '../driverList/components/BidInfo.vue'
import BaseInfo from './components/BaseInfo.vue'
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
        BidInfo,
        BaseInfo
      }
    })

export default class extends Vue {
  private tabVal: any = '1'
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
    // console.log(tab, event)
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

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
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
}
</script>

<style lang="scss">
.TransportDetail {
    width: 100%;
    padding: 20px;
    background-color: white;
    box-sizing: border-box;
    .goDetail{
      height: 40px;
      line-height: 40px;
    }
}
</style>

<style lang="scss" scoped>
.TransportDetail-m {
  width: 100%;
  background-color: white;
    .link {
        color: #649CEE;
        font-weight:bold;
      }
      .radioGroup{
          width: 100vw;
          text-align: center;
          margin-top: 20px;
          margin-bottom: 20px!important;
      }
}
</style>
<style lang="scss" scoped>
.TransportDetail{
  .link {
        color: #649CEE;
        font-weight:bold;
      }
}
</style>
<style scope>
.linkTo{
  color: #649CEE;
  font-weight: bold;
}
</style>
