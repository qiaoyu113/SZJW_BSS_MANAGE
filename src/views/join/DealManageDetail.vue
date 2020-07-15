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
            :value="ContractDetail.driverInfoBusiVO.name"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="城市"
            :value="ContractDetail.driverInfoBusiVO.name"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="加盟小组"
            value="武汉市黄陂区前川街人信城"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="加盟经理"
            value="四川省成都市青白江区祥福镇宇培分拨中心"
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
            value="刘德华123123"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="商品分类"
            value="15071362991"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="合租模式"
            value="武汉市黄陂区前川街人信城"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="合作期限"
            value="四川省成都市青白江区祥福镇宇培分拨中心"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="订单金额"
            value="四川省成都市青白江区祥福镇宇培分拨中心"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="订单成交时间"
            value="四川省成都市青白江区祥福镇宇培分拨中心"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="供应商"
            value="四川省成都市青白江区祥福镇宇培分拨中心"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="购买车型"
            value="四川省成都市青白江区祥福镇宇培分拨中心"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="车辆信息"
            value="四川省成都市青白江区祥福镇宇培分拨中心"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="无税报价"
            value="四川省成都市青白江区祥福镇宇培分拨中心"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="车牌号"
            value="四川省成都市青白江区祥福镇宇培分拨中心"
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
            value="刘德华123123"
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
            value="刘德华123123"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="发动机号"
            value="刘德华123123"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="发动机发票号"
            value="刘德华123123"
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
              :data="list"
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
                label="价格/项目"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.name | DataIsNull }}</span>
                </template>
              </el-table-column>

              <el-table-column
                align="left"
                label="底盘(元)"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.a | DataIsNull }} </span>
                </template>
              </el-table-column>

              <el-table-column
                class-name="status-col"
                label="车厢(元)"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.a1 | DataIsNull }}</span>
                </template>
              </el-table-column>

              <el-table-column
                class-name="status-col"
                label="GPS(元)"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.a2 | DataIsNull }}</span>
                </template>
              </el-table-column>

              <el-table-column
                class-name="status-col"
                label="尾板(元)"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.a3 | DataIsNull }}</span>
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
            name="金融返利"
            value="刘德华123123"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="保险返利"
            value="刘德华123123"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="上牌返利"
            value="刘德华123123"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="其他返利"
            value="刘德华123123"
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
            value="刘德华123123"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="设备ID号"
            value="刘德华123123"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="SIM号"
            value="刘德华123123"
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
            value="刘德华123123"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="交付完成时间"
            value="刘德华123123"
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
      'cooperationModel': true,
      'dealId': 0,
      'dealTime': '2020-07-15T03:12:48.618Z',
      'deliveryTime': '2020-07-15T03:12:48.618Z',
      'engineInvoiceNo': 'string',
      'engineNo': 'string',
      'financialRebate': 0,
      'gpsDeviceNo': 'string',
      'gpsSimNo': 'string',
      'gpsSupplier': 0,
      'id': 0,
      'insuranceRebate': 0,
      'operationId': 0,
      'orderDeliverRebateFORMs': [
        {
          'chassis': 0,
          'createDate': '2020-07-15T03:12:48.618Z',
          'createId': 0,
          'delFlag': true,
          'gps': 0,
          'id': 0,
          'orderId': 'string',
          'priceType': 0,
          'tailgate': 0,
          'updateDate': '2020-07-15T03:12:48.618Z',
          'updateId': 0,
          'vehicle': 0
        }
      ],
      'orderDeliverRebateVOs': [
        {
          'chassis': 0,
          'createDate': '2020-07-15T03:12:48.618Z',
          'createId': 0,
          'delFlag': true,
          'gps': 0,
          'id': 0,
          'orderId': 'string',
          'priceType': 0,
          'tailgate': 0,
          'updateDate': '2020-07-15T03:12:48.618Z',
          'updateId': 0,
          'vehicle': 0
        }
      ],
      'orderId': 'string',
      'orderInfoVO': {
        'busiType': 0,
        'busiTypeName': 0,
        'buyCarCompany': 0,
        'capacityQuota': 0,
        'carPrice': 0,
        'city': 0,
        'confirmId': 0,
        'confirmTime': '2020-07-15T03:12:48.619Z',
        'cooperationCar': 0,
        'cooperationCarName': 'string',
        'cooperationModel': 0,
        'cooperationTime': 0,
        'createDate': '2020-07-15T03:12:48.619Z',
        'createId': 0,
        'createSource': 0,
        'deliverDate': '2020-07-15T03:12:48.619Z',
        'driverId': 'string',
        'driverInfoVO': {
          'address': 'string',
          'bankCardNo': 'string',
          'busiType': 0,
          'busiTypeName': 'string',
          'carType': 0,
          'carTypeName': 'string',
          'clueId': 'string',
          'corpUserId': 'string',
          'createDate': '2020-07-15T03:12:48.619Z',
          'createId': 0,
          'createName': 'string',
          'delFlag': true,
          'driverId': 'string',
          'email': 'string',
          'exterUserId': 'string',
          'gmId': 0,
          'gmName': 'string',
          'idNo': 'string',
          'name': 'string',
          'phone': 0,
          'sourceChannel': 0,
          'sourceChannelName': 'string',
          'status': 0,
          'statusName': 'string',
          'updateDate': '2020-07-15T03:12:48.619Z',
          'updateId': 0,
          'updateName': 'string',
          'workCity': 0,
          'workCityName': 'string'
        },
        'goodsAmount': 0,
        'id': 0,
        'incomeGuarantee': 0,
        'inspectionTime': '2020-07-15T03:12:48.619Z',
        'insuranceTime': '2020-07-15T03:12:48.619Z',
        'isDeliver': 0,
        'isPay': 0,
        'isRefund': 0,
        'leaseCarCompany': 0,
        'notPassId': 0,
        'notPassTime': '2020-07-15T03:12:48.619Z',
        'operateFlag': 'string',
        'orderId': 'string',
        'orderPayRecordInfoVOList': [
          {
            'createDate': '2020-07-15T03:12:48.619Z',
            'money': 0,
            'operateType': 0,
            'outTradeNo': 'string',
            'payDate': '2020-07-15T03:12:48.619Z',
            'payImageUrl': 'string',
            'payType': 0,
            'prepayId': 'string',
            'remarks': 'string',
            'serviceFee': 0,
            'status': 0,
            'transactionId': 'string',
            'updateDate': '2020-07-15T03:12:48.619Z'
          }
        ],
        'passId': 0,
        'passTime': '2020-07-15T03:12:48.619Z',
        'payCompleteTime': '2020-07-15T03:12:48.619Z',
        'payType': 0,
        'plateNo': 'string',
        'rake': 0,
        'refundTime': '2020-07-15T03:12:48.619Z',
        'remarks': 'string',
        'status': 0,
        'updateDate': '2020-07-15T03:12:48.619Z',
        'updateId': 0
      },
      'otherRebate': 0,
      'plateNoRebate': 0,
      'status': 0
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
