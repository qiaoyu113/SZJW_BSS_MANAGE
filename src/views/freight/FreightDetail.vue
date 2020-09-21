<template>
  <div :class="isPC ? 'FreightDetail' : 'FreightDetail-m'">
    <div
      class="clueDetail"
    >
      <SectionContainer
        title="出车单信息"
        :md="true"
      >
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="出车单号"
              :value="OwnerDetail.wayBillInfoVO.wayBillId"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="出车日期"
              :value="OwnerDetail.wayBillInfoVO.departureDate"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="线路名称"
              :value="OwnerDetail.wayBillInfoVO.lineId + '/' + OwnerDetail.wayBillInfoVO.lineName"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="出车趟数(趟)"
              :value="OwnerDetail.wayBillInfoVO.deliverNum"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="仓位置"
              :value="OwnerDetail.wayBillInfoVO.warehouseLocation"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="仓名称"
              :value="OwnerDetail.wayBillInfoVO.warehouseName"
            />
          </el-col>
        </el-row>
      </SectionContainer>

      <SectionContainer
        title="司机信息"
        :md="true"
      >
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="司机姓名"
              :value="OwnerDetail.driverBusiInfoVO.name"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="司机电话"
              :value="OwnerDetail.driverBusiInfoVO.phone"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="工作城市"
              :value="OwnerDetail.driverBusiInfoVO.workCityName"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="车牌号"
              :value="OwnerDetail.driverBusiInfoVO.carNo"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="车型"
              :value="OwnerDetail.driverBusiInfoVO.carTypeName"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="加盟经理"
              :value="OwnerDetail.driverBusiInfoVO.gmName + '/' + OwnerDetail.driverBusiInfoVO.gmPhone"
            />
          </el-col>
        </el-row>
      </SectionContainer>

      <SectionContainer
        title="运费信息"
        :md="true"
      >
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="运费状态"
              :value="OwnerDetail.wayBillInfoVO.statusName"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="预估运费"
              :value="Number(OwnerDetail.wayBillInfoVO.preFee).toFixed(2)"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="加盟运费"
              :value="OwnerDetail.wayBillInfoVO.gmStatusCode === 2 ? '未出车' : OwnerDetail.wayBillInfoVO.gmFee"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="外线运费"
              :value="OwnerDetail.wayBillInfoVO.lineStatusCode === 2 ? '未出车' : OwnerDetail.wayBillInfoVO.lineFee"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="确认运费"
              :value="OwnerDetail.wayBillInfoVO.gmcIsNoCar ? '未出车' : OwnerDetail.wayBillInfoVO.confirmFee"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="二次确认运费"
              :value="OwnerDetail.wayBillInfoVO.againIsNoCar ? '未出车' : OwnerDetail.wayBillInfoVO.secondConfirmFee"
            />
          </el-col>
        </el-row>
      </SectionContainer>

      <SectionContainer
        title="客户信息"
        :md="true"
      >
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="客户名称"
              :value="OwnerDetail.lineInfoVO.customerName + '/' + OwnerDetail.lineInfoVO.customerId"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="项目名称"
              :value="OwnerDetail.lineInfoVO.projectName + '/' + OwnerDetail.lineInfoVO.projectId"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="上岗经理"
              :value="OwnerDetail.lineInfoVO.dutyManagerIdName + '/' + OwnerDetail.lineInfoVO.dutyManagerPhone"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="外线销售"
              :value="OwnerDetail.lineInfoVO.lineSaleName + '/' + OwnerDetail.lineInfoVO.lineSalePhone"
            />
          </el-col>
        </el-row>
      </SectionContainer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { freightDetail } from '@/api/freight'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

    @Component({
      name: 'FreightDetail',
      components: {
        DetailItem,
        SectionContainer
      }
    })

export default class extends Vue {
    private id: any = ''
    private tabVal: any = '1'
    private showReachPhone: any = true
    private OwnerDetail:any = {
      'driverBusiInfoVO': {
        'bankCardNo': 'sit aute dolor',
        'busiType': 87507824,
        'busiTypeName': 'sit laboris aliqua',
        'carNo': 'laborum nulla in',
        'carType': 47763475,
        'carTypeName': 'mollit amet Lorem exercitation deserunt',
        'corpUserId': 'eu dolor et proident',
        'createDate': '1942-06-15T16:04:46.349Z',
        'createId': -92969475,
        'createName': 'non',
        'createPhone': 'nulla labore oc',
        'email': 'enim dolor in',
        'exterUserId': 'eu',
        'gmId': -38153230,
        'gmName': 'elit eiusmod',
        'gmPhone': 'tempor proident',
        'idNo': 'sed in',
        'name': 'ad et tempor',
        'phone': 'reprehenderit',
        'sourceChannel': 41471003,
        'sourceChannelName': 'culpa fugiat minim nisi',
        'status': -41342125,
        'statusName': 'mollit in minim eiusmod officia',
        'updateDate': '1995-11-20T23:07:27.748Z',
        'updateId': 56961221,
        'updateName': 'aute culpa adipisicing',
        'workCity': 63792993,
        'workCityName': 'ipsum incididunt'
      },
      'lineInfoVO': {
        'busiType': 23264531,
        'busiTypeName': 'sed laboris culpa',
        'carType': 8957309,
        'carTypeName': 'exercitation Ut laboris nulla culpa',
        'cargoNum': 26254473,
        'cargoType': -60676927,
        'cargoTypeName': 'non dolor ullamco',
        'carry': 29920387,
        'city': -10438443,
        'cityArea': -3318189,
        'cityAreaName': 'esse voluptate amet irure',
        'countyArea': -28885768,
        'countyAreaName': 'pariatur sint eiusmod qu',
        'createDate': '2013-10-13T17:16:46.774Z',
        'createId': -46415657,
        'customerId': 'ipsum Ut',
        'customerName': 'mollit anim',
        'dayNum': 18635830,
        'deliveryEndDate': '1949-10-30T13:04:55.315Z',
        'deliveryNum': -33565522,
        'deliveryStartDate': '1968-06-04T01:26:04.883Z',
        'deliveryWeekCycle': 'aute incididunt Duis reprehenderit Ut',
        'distance': 17994757,
        'driverWorkTime': '1942-02-04T15:01:54.727Z',
        'dutyManagerId': -70989547,
        'dutyManagerIdName': 'exercitation ut in',
        'dutyRemark': 'sed mollit pariatur consectetur eu',
        'everyTripGuaranteed': -41301527.72207438,
        'everyUnitPrice': 46974581.23094171,
        'goodsWeight': 54375371.699932665,
        'id': -53179297,
        'inLine': -15279909,
        'incomeSettlementMethod': -86300938,
        'incomeSettlementMethodName': 'nulla eiusmod do sint dolore',
        'limitRemark': 'laborum adipisicing',
        'lineAdapter': -22622091,
        'lineAdapterName': 'in ex',
        'lineArea': 'adipisicing nulla in ut',
        'lineBalance': 71100749,
        'lineCategory': -80642679,
        'lineCloudCustomerDetailVO': {
          'address': 'ut sint reprehenderit occaecat cupidatat',
          'areaCity': -93457862,
          'areaCityName': 74372551,
          'areaCountyName': -17721878,
          'areaProvince': -5222939,
          'areaProvinceName': 88797385,
          'businessLicenseUrl': 'cillum consectetur in velit',
          'bussinessCard': 'deserunt aute',
          'bussinessName': 'culpa eu voluptate',
          'bussinessPhone': 'incididunt veniam',
          'bussinessPosition': 'eiusmod id cupidatat',
          'city': 59165693,
          'cityName': 'sed labore',
          'classification': -16041041,
          'classificationName': -60956102,
          'contractEnd': '1955-04-09T03:26:38.176Z',
          'createDate': '1988-07-16T06:11:45.521Z',
          'createId': 6681836,
          'createName': 'consectetur qui',
          'customerChannels': 93479179,
          'customerChannelsName': 28054768,
          'customerCompanyMain': 'sunt elit',
          'customerCompanyName': 'eu dolor ea id',
          'customerId': 'Excepte',
          'customerIntention': 87891178,
          'customerIntentionName': 'fugiat voluptate ',
          'customerSize': 'aliqua',
          'customerState': -13228197,
          'customerStateName': -27164536,
          'customerType': -82471123,
          'customerTypeName': 57464514,
          'remark': 'dolore pariatur',
          'reviewState': -50336295,
          'reviewStateName': -61557112,
          'updateDate': '1952-06-19T15:21:50.376Z',
          'updateId': 47790994
        },
        'lineCloudProjectVO': {
          'auditState': -91639820,
          'bussinessName': 'est nostrud',
          'bussinessPhone': 'minim',
          'carType': -73600033,
          'carTypeName': 'dolor ex nulla Excepteur',
          'cargoNum': 64679215,
          'cargoType': -68533240,
          'cargoTypeName': 'ut esse elit',
          'carry': -17624850,
          'city': -37396522,
          'cityName': 'velit laborum aute',
          'clueId': 'nisi dolore magna',
          'clueName': 'eu est cillum consequat',
          'createDate': '1950-05-13T01:34:07.218Z',
          'createId': 66753070,
          'customerId': 'Excepteur fugiat',
          'customerName': 'ipsum ex',
          'deliveryNum': -32579351,
          'distance': 73393244,
          'dutyManagerId': -72485155,
          'dutyManagerName': 'in dolor culpa',
          'dutyRemark': 'dolor proident non aliquip amet',
          'effectiveLineNum': '',
          'isDelivery': '',
          'limitRemark': '',
          'lineDeliveryInfoFORMS': [
            {
              'workingTimeEnd': '',
              'workingTimeStart': ''
            }
          ],
          'lineNum': '',
          'lineSaleId': '',
          'lineSaleName': '',
          'projectId': '',
          'projectName': '',
          'projectState': '',
          'receivingPoint': '',
          'returnBill': '',
          'runLineNum': '',
          'runSpeed': '',
          'timeDiff': '',
          'updateDate': '',
          'updateId': '',
          'warehouseCity': '',
          'warehouseCityName': '',
          'warehouseClose': '',
          'warehouseContactName': '',
          'warehouseContactPhone': '',
          'warehouseCounty': '',
          'warehouseCountyName': '',
          'warehouseDistrict': '',
          'warehouseName': '',
          'warehouseOpen': '',
          'warehouseProvince': '',
          'warehouseProvinceName': '',
          'warehouseRemark': ''
        },
        'lineDeliveryInfoFORMS': [
          {
            'workingTimeEnd': '',
            'workingTimeStart': ''
          }
        ],
        'lineId': '',
        'lineName': '',
        'linePictureRelatedVO': {
          'createDate': '',
          'id': '',
          'informationDescription': '',
          'lineId': '',
          'lineName': '',
          'loadingVideo': '',
          'otherPicture': '',
          'warehouseLoadingPicture': ''
        },
        'lineRank': '',
        'lineSaleId': '',
        'lineSaleName': '',
        'lineSalePhone': '',
        'lineState': '',
        'lineStateName': '',
        'lineType': '',
        'lineTypeName': '',
        'lineUrgent': '',
        'lineUrgentName': '',
        'monthNum': '',
        'projectId': '',
        'projectName': '',
        'provinceArea': '',
        'provinceAreaName': '',
        'returnBill': '',
        'runSpeed': '',
        'runTestState': '',
        'runTestStateName': '',
        'settlementCycle': '',
        'settlementCycleName': '',
        'settlementDays': '',
        'settlementDaysName': '',
        'shipperOffer': '',
        'stabilityRate': '',
        'stabilityRateName': '',
        'timeDiff': '',
        'updateDate': '',
        'updateId': '',
        'volume': '',
        'waitDirveValidity': ''
      },
      'wayBillInfoVO': {
        'confirmFee': '',
        'deliverNum': '',
        'departureDate': '',
        'gmFee': '',
        'lineFee': '',
        'lineId': '',
        'lineName': '',
        'preFee': '',
        'secondConfirmFee': '',
        'status': '',
        'statusName': '',
        'warehouseLocation': '',
        'warehouseName': '',
        'wayBillId': ''
      }
    }

    // 判断是否是PC
    get isPC() {
      return SettingsModule.isPC
    }

    // 请求详情
    private async fetchData(value: any) {
      const { data } = await freightDetail({ wayBillId: value })
      if (data.success) {
        this.OwnerDetail = data.data
      } else {
        this.$message.error(data.errorMsg)
      }
    }

    // 生命周期
    created() {
      this.id = this.$route.query.id
      this.fetchData(this.id)
    }
}
</script>

<style lang="scss" scope>
.FreightDetail {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .el-form-item__label{
    color: #4a4a4a;
    font-weight: 400;
  }
  .follow{
      width:100%;
      .follow_title{
          line-height: 35px;
          color:#666;
          font-size: 12px;
          background: $main-btn;
          display: inline;
          padding: 3px 10px;
          color:#fff;
          border-radius: 16px;
      }
  }
  .el-radio-group{
      margin-bottom: 20px !important;
  }
}
</style>

<style lang="scss" scope>
.FreightDetail-m {
  width: 100%;
  .el-form-item__label{
    color: #4a4a4a;
    font-weight: 400;
  }

  .follow{
      width:100%;
      p{
          width:100%;
          text-align: center;
        .follow_title{
            line-height: 35px;
            color:#666;
            font-size: 12px;
            background: $main-btn;
            display: inline;
            padding: 3px 10px;
            color:#fff;
            border-radius: 16px;
        }
      }
  }
}
</style>

<style lang="scss" scope>
@media screen and (min-width: 701px) {
  .FreightDetail {
    .el-select {
        width: 100%;
      }
      .el-input{
        width: 75%;
      }
    //   .el-radio-button__orig-radio:checked + .el-radio-button__inner{
    //       background: $assist-btn;
    //       -webkit-box-shadow: -1px 0 0 0 $assist-btn;
    //       box-shadow: -1px 0 0 0 $assist-btn;
    //       border-color: $assist-btn;
    //   }
    //   .el-radio-button__inner:hover{
    //       color: $assist-btn;
    //   }
  }
}

@media screen and (max-width: 700px) {
  .FreightDetail-m {
    .el-select {
      width: 100%;
    }
    .el-input{
      width: 90%;
    }
    .el-radio-group{
        width:100%;
        text-align: center;
        margin: auto;
    }
    .el-radio-group{
        margin-bottom: 10px !important;
        margin-top: 10px !important;
    }
    .el-radio-button__orig-radio + .el-radio-button__inner{
        font-size: 12px;
    }
  }
}
</style>
