<template>
  <div :class="isPC ? 'DealManageDetail' : 'DealManageDetail-m'">
    <SectionContainer
      title="详情信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="司机姓名"
            :value="ContractDetail.orderInfoVO.driverInfoVO.name"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="城市"
            :value="ContractDetail.orderInfoVO.driverInfoVO.workCityName"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="加盟小组"
            :value="ContractDetail.orderInfoVO.driverInfoVO.gmTeam"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="加盟经理"
            :value="ContractDetail.orderInfoVO.driverInfoVO.gmName"
          />
        </el-col>
      </el-row>
    </SectionContainer>

    <SectionContainer
      title="订单信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="订单单号"
            :value="ContractDetail.orderInfoVO.orderId"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="商品分类"
            :value="ContractDetail.busiTypeName"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="合租模式"
            :value="ContractDetail.cooperationModel === 1 ? '购车' : (ContractDetail.cooperationModel === 2 ? '租车' : ContractDetail.cooperationModel === 3 ? '带车' : '暂无数据')"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="合作期限"
            :value="ContractDetail.cooperationTime"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="订单金额(元)"
            :value="ContractDetail.orderInfoVO.goodsAmount"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="订单成交时间"
            :value="ContractDetail.orderInfoVO.deliverDate | Timestamp"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="供应商"
            :value="ContractDetail.orderInfoVO.deliverDate"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="购买车型"
            :value="ContractDetail.orderInfoVO.cooperationCarName"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="车辆信息"
            value="xxx"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="无税报价"
            :value="ContractDetail.carPrice"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="车牌号"
            :value="ContractDetail.plateNo"
          />
        </el-col>
      </el-row>
    </SectionContainer>

    <SectionContainer
      title="运营交付"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="运营经理"
            :value="ContractDetail.operationName"
          />
        </el-col>
      </el-row>
    </SectionContainer>

    <SectionContainer
      title="车辆交付"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="交车日期"
            :value="ContractDetail.deliveryTime | Timestamp"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="发动机号"
            :value="ContractDetail.engineNo"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="发动机发票号"
            :value="ContractDetail.engineInvoiceNo"
          />
        </el-col>
      </el-row>

      <div class="assist_title">
        <span>
          项目返利
        </span>
      </div>
      <el-row>
        <el-col :span="isPC ? 24 : 24">
          <div class="table_box">
            <el-table
              ref="multipleTable"
              :data="ContractDetail.orderDeliverRebateFORMs"
              :row-style="{height: '20px'}"
              :cell-style="{padding: '5px 0'}"
              size="mini"
              :height="'100%'"
              fit
              :border="isPC"
              stripe
              highlight-current-row
              style="width: 100%"
              row-key="customerNo"
            >
              <el-table-column
                align="left"
                fixed
                label="项目/价格"
              >
                <template slot-scope="scope">
                  <span v-if="scope.$index === 0">采购价</span>
                  <span v-if="scope.$index === 1">销售价</span>
                  <span v-if="scope.$index === 2">返利</span>
                </template>
              </el-table-column>

              <el-table-column
                align="left"
                label="底盘(元)"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.chassis | DataIsNull }} </span>
                </template>
              </el-table-column>

              <el-table-column
                class-name="status-col"
                label="车厢(元)"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.vehicle | DataIsNull }}</span>
                </template>
              </el-table-column>

              <el-table-column
                class-name="status-col"
                label="GPS(元)"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.gps | DataIsNull }}</span>
                </template>
              </el-table-column>

              <el-table-column
                class-name="status-col"
                label="尾板(元)"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.tailgate | DataIsNull }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <div class="assist_title">
          <span>
            整车返利
          </span>
        </div>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="金融返利(元)"
            :value="ContractDetail.financialRebate"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="保险返利(元)"
            :value="ContractDetail.insuranceRebate"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="上牌返利(元)"
            :value="ContractDetail.plateNoRebate"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="其他返利(元)"
            :value="ContractDetail.otherRebate"
          />
        </el-col>
      </el-row>
    </SectionContainer>

    <SectionContainer
      title="GPS交付"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="供应商"
            :value="ContractDetail.gpsSupplierName"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="设备ID号"
            :value="ContractDetail.gpsDeviceNo"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="SIM号"
            :value="ContractDetail.gpsSimNo"
          />
        </el-col>
      </el-row>
    </SectionContainer>

    <SectionContainer
      title="操作记录"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="订单成交时间"
            :value="ContractDetail.dealTime | Timestamp"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="交付完成时间"
            :value="ContractDetail.deliverDate | Timestamp"
          />
        </el-col>
      </el-row>
    </SectionContainer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { GetOrderDeliverDetail } from '@/api/join'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

    @Component({
      name: 'DealManageDetail',
      components: {
        DetailItem,
        SectionContainer
      }
    })

export default class extends Vue {
    private id: any = ''
    private tabVal: any = '1'
    private list: any = [{ name: '12', a: '2', a1: '3', a2: '4' }];
    private ContractDetail: any = {
      'cooperationModel': 1,
      'dealId': '',
      'dealTime': '',
      'deliveryTime': '',
      'engineInvoiceNo': '',
      'engineNo': '',
      'financialRebate': '',
      'gpsDeviceNo': '',
      'gpsSimNo': '',
      'gpsSupplier': '',
      'id': '',
      'insuranceRebate': '',
      'operationId': '',
      'orderDeliverRebateFORMs': [
        {
          'chassis': '',
          'createDate': '',
          'createId': '',
          'delFlag': '',
          'gps': '',
          'id': '',
          'orderId': '',
          'priceType': '',
          'tailgate': '',
          'updateDate': '',
          'updateId': '',
          'vehicle': ''
        }
      ],
      'orderDeliverRebateVOs': [
        {
          'chassis': '',
          'createDate': '',
          'createId': '',
          'delFlag': true,
          'gps': '',
          'id': '',
          'orderId': '',
          'priceType': '',
          'tailgate': '',
          'updateDate': '',
          'updateId': '',
          'vehicle': ''
        }
      ],
      'orderId': 'string',
      'orderInfoVO': {
        'busiType': '',
        'busiTypeName': '',
        'buyCarCompany': '',
        'capacityQuota': '',
        'carPrice': '',
        'city': '',
        'confirmId': '',
        'confirmTime': '',
        'cooperationCar': '',
        'cooperationCarName': '',
        'cooperationModel': '',
        'cooperationTime': '',
        'createDate': '',
        'createId': '',
        'createSource': '',
        'deliverDate': '',
        'driverId': '',
        'driverInfoVO': {
          'address': '',
          'bankCardNo': '',
          'busiType': 0,
          'busiTypeName': '',
          'carType': 0,
          'carTypeName': '',
          'clueId': '',
          'corpUserId': '',
          'createDate': '',
          'createId': '',
          'createName': '',
          'delFlag': true,
          'driverId': '',
          'email': '',
          'exterUserId': '',
          'gmId': '',
          'gmName': '',
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
        'goodsAmount': '',
        'id': '',
        'incomeGuarantee': '',
        'inspectionTime': '',
        'insuranceTime': '',
        'isDeliver': '',
        'isPay': '',
        'isRefund': '',
        'leaseCarCompany': '',
        'notPassId': '',
        'notPassTime': '',
        'operateFlag': '',
        'orderId': '',
        'orderPayRecordInfoVOList': [
          {
            'createDate': '',
            'money': '',
            'operateType': '',
            'outTradeNo': '',
            'payDate': '',
            'payImageUrl': '',
            'payType': '',
            'prepayId': '',
            'remarks': '',
            'serviceFee': '',
            'status': '',
            'transactionId': '',
            'updateDate': ''
          }
        ],
        'passId': '',
        'passTime': '',
        'payCompleteTime': '',
        'payType': '',
        'plateNo': '',
        'rake': '',
        'refundTime': '',
        'remarks': '',
        'status': '',
        'updateDate': '',
        'updateId': ''
      },
      'otherRebate': '',
      'plateNoRebate': '',
      'status': ''
    }
    private ruleForm:any = {
      name: '',
      region: '',
      date1: '',
      date2: '',
      delivery: false,
      type: [],
      resource: '',
      desc: ''
    }
    private rules:any = {
      name: [
        { required: true, message: '请输入活动名称', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      ],
      region: [
        { required: true, message: '请选择活动区域', trigger: 'change' }
      ],
      date1: [
        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
      ],
      date2: [
        { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
      ],
      type: [
        { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
      ],
      resource: [
        { required: true, message: '请选择活动资源', trigger: 'change' }
      ],
      desc: [
        { required: true, message: '请填写活动形式', trigger: 'blur' }
      ]
    }

    created() {
      this.id = this.$route.query.id
      this.getDetail(this.id)
    }

    mounted() {
    }

    activated() {
    }

    // 判断是否是PC
    get isPC() {
      return SettingsModule.isPC
    }

    private submitForm(formName:any) {
      (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    // 请求详情
    private async getDetail(value: any) {
      const { data } = await GetOrderDeliverDetail({ orderId: value })
      if (data.success) {
        let datas = data.data
        this.ContractDetail = datas
      } else {
        this.$message.error(data)
      }
    }

    private resetForm(formName:any) {
      (this.$refs[formName] as ElForm).resetFields()
    }

    private handleClick() {
      console.log(this.tabVal)
    }
}
</script>

<style lang="scss">
.DealManageDetail {
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
  .assist_title{
      width: 100%;
      span{
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
  .table_box{
      width: 100%;
      padding: 15px 15px 20px;
      box-sizing: border-box;
  }
}
</style>

<style lang="scss">
.DealManageDetail-m {
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
  .table_box{
      width: 100%;
      box-sizing: border-box;
  }
}
</style>

<style lang="scss" scope>
@media screen and (min-width: 701px) {
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
  .el-radio-group{
      margin-bottom: 20px !important;
  }
}

@media screen and (max-width: 700px) {
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
</style>
