<template>
  <div :class="isPC ? 'DealForm' : 'DealForm-m'">
    <el-collapse>
      <el-collapse-item
        title="交付攻略"
        name="1"
      >
        <div>1、交付信息会根据订单信息，不同的配置，需要把必填项都填写完整后提交。</div>
        <div>2、合作模式：购车，需要填写车辆交付，如返利等，如有问题可以联系供应链同事。</div>
        <div>3、运营经理负责成交后的司机运营跟进。</div>
        <div>4、GPS绑定的编号，需要填写准确，对后期的设备状态和轨迹，会有影响。</div>
      </el-collapse-item>
    </el-collapse>
    <SectionContainer
      title="详情信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="司机姓名"
            value="ContractDetail."
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="城市"
            value="ContractDetail."
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
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="isPC ? '' : '80px'"
    >
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
        </el-row>
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="车牌号"
              prop="carNo"
            >
              <el-input v-model="ruleForm.carNo" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>

      <SectionContainer
        title="运营交付"
        :md="true"
      >
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="运营经理"
              prop="carNo"
            >
              <el-input v-model="ruleForm.carNo" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>

      <SectionContainer
        title="车辆交付"
        :md="true"
      >
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="发动机号"
              prop="carNo"
            >
              <el-input v-model="ruleForm.fadongjihao" />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="发动机发票号"
              prop="carNo"
            >
              <el-input v-model="ruleForm.fapiaohao" />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="交车日期"
              prop="carNo"
            >
              <el-date-picker
                v-model="ruleForm.jiaocheriqi"
                :class="isPC ? '' : 'el-date-m'"
                type="daterange"
                value-format="timestamp"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changData()"
              />
            </el-form-item>
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
                    <el-form-item
                      prop="carNo"
                    >
                      <el-input
                        v-model="scope.row.a"
                        size="mini"
                        class="edit-cell"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column
                  class-name="status-col"
                  label="车厢(元)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      prop="carNo"
                    >
                      <el-input
                        v-model="scope.row.a1"
                        size="mini"
                        class="edit-cell"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column
                  class-name="status-col"
                  label="GPS(元)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      prop="carNo"
                    >
                      <el-input
                        v-model="scope.row.a2"
                        size="mini"
                        class="edit-cell"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column
                  class-name="status-col"
                  label="尾板(元)"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      prop="carNo"
                    >
                      <el-input
                        v-model="scope.row.a3"
                        size="mini"
                        class="edit-cell"
                      />
                    </el-form-item>
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
            <el-form-item
              label="金融返利"
              prop="carNo"
            >
              <el-input v-model="ruleForm.fadongjihao" />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="保险返利"
              prop="carNo"
            >
              <el-input v-model="ruleForm.fadongjihao" />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="上牌返利"
              prop="carNo"
            >
              <el-input v-model="ruleForm.fadongjihao" />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="其他返利"
              prop="carNo"
            >
              <el-input v-model="ruleForm.fadongjihao" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>

      <SectionContainer
        title="GPS交付"
        :md="true"
      >
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="供应商"
              prop="carNo"
            >
              <el-input v-model="ruleForm.fadongjihao" />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="设备ID号"
              prop="carNo"
            >
              <el-input v-model="ruleForm.fadongjihao" />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="SIM号"
              prop="carNo"
            >
              <el-input v-model="ruleForm.fadongjihao" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>

      <SectionContainer
        title="操作记录"
        :md="true"
      >
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="订单成交时间"
              prop="carNo"
            >
              <el-date-picker
                v-model="ruleForm.jiaocheriqi"
                :class="isPC ? '' : 'el-date-m'"
                type="daterange"
                value-format="timestamp"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changData()"
              />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="交付完成时间"
              prop="carNo"
            >
              <el-date-picker
                v-model="ruleForm.jiaocheriqi"
                :class="isPC ? '' : 'el-date-m'"
                type="daterange"
                value-format="timestamp"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changData()"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>
      <div class="btn_box">
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >
          提交
        </el-button>
        <el-button @click="resetForm('ruleForm')">
          重置
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { SubmitOrderDeliver, GetOrderDeliverDetail } from '@/api/join'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

    @Component({
      name: 'DealForm',
      components: {
        DetailItem,
        SectionContainer
      }
    })

export default class extends Vue {
    private id: any = ''
    private tabVal: any = '1'
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
    private list: any = [
      { name: '采购价', a: '2', a1: '3', a2: '4' },
      { name: '销售价', a: '2', a1: '3', a2: '4' },
      { name: '返利', a: '2', a1: '3', a2: '4' }
    ];
    private ruleForm:any = {
      carNo: '',
      yunying: ''
    }
    private rules:any = {
      name: [
        { required: true, message: '请输入活动名称', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      ],
      carNo: [
        { required: true, message: '请输入车牌号', trigger: 'blur' }
      ],
      yunying: [
        { required: true, message: '请输入运营经理', trigger: 'blur' }
      ]
    }
    private multipleTableRules:any = {
      carNo: [
        { required: true, message: '请输入车牌号', trigger: 'blur' }
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

    private resetForm(formName:any) {
      (this.$refs[formName] as ElForm).resetFields()
    }

    private handleClick() {
      console.log(this.tabVal)
    }
}
</script>

<style lang="scss">
.DealForm {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .el-form-item__label{
    color: #4a4a4a;
    font-weight: 400;
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
  .el-collapse-item__header{
      padding:0 20px;
      box-sizing: border-box;
      font-size: 14px;
      border-bottom: 2px solid #F8F9FA;
  }
  .el-collapse{
      margin-bottom: 6px;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      border: none;
  }
  .el-collapse-item__content{
      padding: 10px 20px;
      box-sizing: border-box;
  }
  .el-form-item{
      padding: 0 15px;
      .el-form-item__label{
          font-size: 13px;
          color: #9e9e9e;
      }
  }
  .el-date-editor--daterange{
      width: 100%;
  }

  .btn_box{
    padding-top: 20px;
    box-sizing: border-box;
  }
}
</style>

<style lang="scss">
.DealForm-m {
  width: 100%;
  .el-form-item__label{
    color: #4a4a4a;
    font-weight: 400;
  }
  .table_box{
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 10px;
    .el-form-item__content{
        margin:0 !important;
    }
  }
  .el-row{
      padding-top:15px;
  }
  .assist_title{
      width: 100%;
      text-align: center;
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
  .el-date-m{
      width: 90% !important;
  }
  .btn_box{
      padding-bottom:20px;
      box-sizing: border-box;
      .el-button{
          width:90%;
          margin:10px 0;
      }
  }
  .el-collapse-item__header{
      padding:0 20px;
      box-sizing: border-box;
      font-size: 14px;
      border-bottom: 2px solid #F8F9FA;
  }
  .el-collapse-item__content{
      width: 100%;
      padding: 10px 20px;
      box-sizing: border-box;
  }
  .btn_box{
    padding: 30px 20px 0 20px;
    box-sizing: border-box;
    .el-button{
      width: 100%;
    }
    .el-button{
      margin: 0 0 20px 0;
    }
  }
}
</style>

<style lang="scss" scope>
@media screen and (min-width: 701px) {
  .el-select {
    width: 100%;
  }
  .el-input{
    width: 100%;
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
