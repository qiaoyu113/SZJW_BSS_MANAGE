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
              :value="OwnerDetail.wayBillInfoVO.lineName + '/' + OwnerDetail.wayBillInfoVO.lineId"
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

      <!-- <SectionContainer
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
      </SectionContainer> -->

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

      <SectionContainer
        title="运费信息"
        :md="true"
      >
        <el-col :span="isPC ? 24 : 24">
          <DetailItem
            name="运费金额"
            :value="OwnerDetail.wayBillFee"
          />
          <!--table表单-->
          <div
            class="table_center"
            style="margin-top:20px;"
          >
            <el-table
              :data="logLists"
              :row-style="{height: '20px'}"
              :cell-style="{padding: '5px 0'}"
              size="mini"
              fit
              :border="isPC"
              stripe
              highlight-current-row
              style="width: 100%"
            >
              <el-table-column
                label="序号"
                type="index"
                width="80"
                align="left"
              />
              <el-table-column
                align="left"
                label="变动类型"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.changeType }}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="变更前"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.beforeStateName }}</span>
                </template>
              </el-table-column>

              <el-table-column
                align="left"
                label="变更后"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.afterStateName }}</span>
                </template>
              </el-table-column>

              <el-table-column
                align="left"
                label="变更记录"
              >
                <template slot-scope="{row}">
                  {{ row.changeLog }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </SectionContainer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { freightDetail, freightDetailLog } from '@/api/freight'
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
    private logLists: any[] = []
    private id: any = ''
    private tabVal: any = '1'
    private showReachPhone: any = true
    private OwnerDetail:any = {
      'driverBusiInfoVO': {
        'bankCardNo': '',
        'busiType': '',
        'busiTypeName': '',
        'carNo': '',
        'carType': '',
        'carTypeName': '',
        'corpUserId': '',
        'createDate': '',
        'createId': '',
        'createName': '',
        'createPhone': '',
        'email': '',
        'exterUserId': '',
        'gmId': '',
        'gmName': '',
        'gmPhone': '',
        'idNo': '',
        'name': '',
        'phone': '',
        'sourceChannel': '',
        'sourceChannelName': '',
        'status': '',
        'statusName': '',
        'updateDate': '',
        'updateId': '',
        'updateName': '',
        'workCity': '',
        'workCityName': ''
      },
      'lineInfoVO': {
        'busiType': '',
        'busiTypeName': '',
        'carType': '',
        'carTypeName': '',
        'cargoNum': '',
        'cargoType': '',
        'cargoTypeName': '',
        'carry': '',
        'city': '',
        'cityArea': '',
        'cityAreaName': '',
        'countyArea': '',
        'countyAreaName': '',
        'createDate': '',
        'createId': '',
        'customerId': '',
        'customerName': '',
        'dayNum': '',
        'deliveryEndDate': '',
        'deliveryNum': '',
        'deliveryStartDate': '',
        'deliveryWeekCycle': '',
        'distance': '',
        'driverWorkTime': '',
        'dutyManagerId': '',
        'dutyManagerIdName': '',
        'dutyRemark': '',
        'everyTripGuaranteed': '',
        'everyUnitPrice': '',
        'goodsWeight': '',
        'id': '',
        'inLine': '',
        'incomeSettlementMethod': '',
        'incomeSettlementMethodName': '',
        'limitRemark': '',
        'lineAdapter': '',
        'lineAdapterName': '',
        'lineArea': '',
        'lineBalance': '',
        'lineCategory': '',
        'lineCloudCustomerDetailVO': {
          'address': '',
          'areaCity': '',
          'areaCityName': '',
          'areaCountyName': '',
          'areaProvince': '',
          'areaProvinceName': '',
          'businessLicenseUrl': '',
          'bussinessCard': '',
          'bussinessName': '',
          'bussinessPhone': '',
          'bussinessPosition': '',
          'city': '',
          'cityName': '',
          'classification': '',
          'classificationName': '',
          'contractEnd': '',
          'createDate': '',
          'createId': '',
          'createName': '',
          'customerChannels': '',
          'customerChannelsName': '',
          'customerCompanyMain': '',
          'customerCompanyName': '',
          'customerId': '',
          'customerIntention': '',
          'customerIntentionName': '',
          'customerSize': '',
          'customerState': '',
          'customerStateName': '',
          'customerType': '',
          'customerTypeName': '',
          'remark': '',
          'reviewState': '',
          'reviewStateName': '',
          'updateDate': '',
          'updateId': ''
        },
        'lineCloudProjectVO': {
          'auditState': '',
          'bussinessName': '',
          'bussinessPhone': '',
          'carType': '',
          'carTypeName': '',
          'cargoNum': '',
          'cargoType': '',
          'cargoTypeName': '',
          'carry': '',
          'city': '',
          'cityName': '',
          'clueId': '',
          'clueName': '',
          'createDate': '',
          'createId': '',
          'customerId': '',
          'customerName': '',
          'deliveryNum': '',
          'distance': '',
          'dutyManagerId': '',
          'dutyManagerName': '',
          'dutyRemark': '',
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

    // 请求列表
    private async getList(value: any) {
      const { data } = await freightDetailLog({ wayBillId: value })
      if (data.success) {
        this.logLists = data.data
      } else {
        this.$message.error(data)
      }
    }

    // 生命周期
    created() {
      this.id = this.$route.query.id
      this.fetchData(this.id)
      this.getList(this.id)
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
