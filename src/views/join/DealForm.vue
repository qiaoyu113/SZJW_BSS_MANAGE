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
            :value="ContractDetail.driverInfoVO.name"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="城市"
            :value="ContractDetail.driverInfoVO.workCityName"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="加盟小组"
            :value="ContractDetail.driverInfoVO.gmTeam"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="加盟经理"
            :value="ContractDetail.driverInfoVO.gmName"
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
              :value="ContractDetail.orderId"
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
              :value="ContractDetail.cooperationModel === '1' ? '购车' : (ContractDetail.cooperationModel === '2' ? '租车' : ContractDetail.cooperationModel === '3' ? '带车' : '暂无数据')"
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
              name="订单金额"
              :value="ContractDetail.goodsAmount"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="订单成交时间"
              :value="ContractDetail.deliverDate | Timestamp"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="供应商"
              :value="ContractDetail.deliverDate"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="购买车型"
              :value="ContractDetail.cooperationCarName"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="车辆信息"
              :value="ContractDetail.carMessage"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="无税报价"
              :value="ContractDetail.carPrice"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="车牌号"
              prop="plateNo"
            >
              <el-input v-model="ruleForm.plateNo" />
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
              prop="operationId"
            >
              <el-select
                v-model="ruleForm.operationId"
                :remote-method="remoteMethod"
                :loading="loading"
                filterable
                remote
                reserve-keyword
                placeholder="请输入司机姓名或手机号"
                @change="checkManage"
              >
                <el-option
                  v-for="item in managerList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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
              prop="engineNo"
            >
              <el-input v-model="ruleForm.engineNo" />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="发动机发票号"
              prop="engineInvoiceNo"
            >
              <el-input v-model="ruleForm.engineInvoiceNo" />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="交车日期"
              prop="deliveryTime"
            >
              <el-date-picker
                v-model="ruleForm.deliveryTime"
                :class="isPC ? '' : 'el-date-m'"
                type="date"
                value-format="timestamp"
                placeholder="选择日期"
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
                ref="ruleForm"
                :data="ruleForm.orderDeliverRebateFORMs"
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
                    <el-form-item
                      :prop="'orderDeliverRebateFORMs.' + scope.$index + '.chassis'"
                      :rules="rules.chassis"
                    >
                      <el-input
                        v-model="scope.row.chassis"
                        v-only-number="{min: 0, precision: 2}"
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
                      :prop="'orderDeliverRebateFORMs.' + scope.$index + '.vehicle'"
                      :rules="rules.vehicle"
                    >
                      <el-input
                        v-model="scope.row.vehicle"
                        v-only-number="{min: 0, precision: 2}"
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
                      :prop="'orderDeliverRebateFORMs.' + scope.$index + '.gps'"
                      :rules="rules.gps"
                    >
                      <el-input
                        v-model="scope.row.gps"
                        v-only-number="{min: 0, precision: 2}"
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
                      :prop="'orderDeliverRebateFORMs.' + scope.$index + '.tailgate'"
                      :rules="rules.tailgate"
                    >
                      <el-input
                        v-model="scope.row.tailgate"
                        v-only-number="{min: 0, precision: 2}"
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
              label="金融返利(元)"
              prop="financialRebate"
            >
              <el-input
                v-model="ruleForm.financialRebate"
                v-only-number="{min: 0, precision: 2}"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              v-only-number="{min: 0, precision: 2}"
              label="保险返利(元)"
              prop="insuranceRebate"
            >
              <el-input v-model="ruleForm.insuranceRebate" />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              v-only-number="{min: 0, precision: 2}"
              label="上牌返利(元)"
              prop="plateNoRebate"
            >
              <el-input v-model="ruleForm.plateNoRebate" />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              v-only-number="{min: 0, precision: 2}"
              label="其他返利(元)"
              prop="otherRebate"
            >
              <el-input v-model="ruleForm.otherRebate" />
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
              prop="cooperationCar"
            >
              <el-select
                v-model="ruleForm.gpsSupplier"
                placeholder="请选择供应商"
              >
                <el-option
                  v-for="item in gpsSupplier"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="设备ID号"
              prop="gpsDeviceNo"
            >
              <el-input v-model="ruleForm.gpsDeviceNo" />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="SIM号"
              prop="gpsSimNo"
            >
              <el-input v-model="ruleForm.gpsSimNo" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>

      <div class="btn_box">
        <el-button
          v-loading.fullscreen.lock="fullscreenLoading"
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
import { SubmitOrderDeliver, SelectOrderInfo, GetOperManagerListByUserId } from '@/api/join'
import { GetJoinManageList, GetDictionaryList } from '@/api/common'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { TagsViewModule } from '@/store/modules/tags-view'
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
    private fullscreenLoading: Boolean = false
    private tabVal: any = '1'
    private loading: any = false
    private managerList: any[] = []
    private gpsSupplier: any[] = []
    private ContractDetail: any = {
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
      'orderInfoVO': {
        'carMessage': ''
      },
      'driverInfoVO': {
        'address': '',
        'bankCardNo': '',
        'busiType': '',
        'busiTypeName': '',
        'carType': '',
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
        'gmTeam': '',
        'gmTeamId': '',
        'idNo': '',
        'name': '',
        'phone': '',
        'remark': '',
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
      'updateId': '',
      'updateName': ''
    }
    private ruleForm:any = {
      'plateNo': '',
      'driverId': '',
      'cooperationModel': '',
      'dealId': '',
      'engineInvoiceNo': '',
      'engineNo': '',
      'financialRebate': '',
      'gpsDeviceNo': '',
      'gpsSimNo': '',
      'gpsSupplier': '',
      'insuranceRebate': '',
      'operationId': '',
      'orderDeliverRebateFORMs': [
        {
          'chassis': '',
          'gps': '',
          'priceType': '',
          'tailgate': '',
          'vehicle': ''
        },
        {
          'chassis': '',
          'gps': '',
          'priceType': '',
          'tailgate': '',
          'vehicle': ''
        },
        {
          'chassis': '',
          'gps': '',
          'priceType': '',
          'tailgate': '',
          'vehicle': ''
        }
      ],
      'orderId': '',
      'otherRebate': '',
      'plateNoRebate': ''
    }
    private rules:any = {
      plateNo: [
        { required: true, message: '请输入车牌号', trigger: 'change' }
      ],
      operationId: [
        { required: true, message: '请输入运营经理', trigger: 'change' }
      ],
      engineNo: [
        { required: true, message: '请输入发动机号', trigger: 'change' }
      ],
      engineInvoiceNo: [
        { required: true, message: '请输入发动机号', trigger: 'change' }
      ],
      deliveryTime: [
        { required: true, message: '请选择交车日期', trigger: 'change' }
      ],
      chassis: [
        { required: true, message: '请输入底盘价', trigger: 'change' }
      ],
      vehicle: [
        { required: true, message: '请输入车厢价', trigger: 'change' }
      ],
      gps: [
        { required: true, message: '请输入GPS价', trigger: 'change' }
      ],
      tailgate: [
        { required: true, message: '请输入尾板价', trigger: 'change' }
      ],
      financialRebate: [
        { required: true, message: '请输入金融返利', trigger: 'change' }
      ],
      insuranceRebate: [
        { required: true, message: '请输入保险返利', trigger: 'change' }
      ],
      plateNoRebate: [
        { required: true, message: '请输入上牌返利', trigger: 'change' }
      ],
      otherRebate: [
        { required: true, message: '请输入其他返利', trigger: 'change' }
      ],
      gpsSupplier: [
        { required: true, message: '请输入供应商', trigger: 'change' }
      ],
      gpsDeviceNo: [
        { required: true, message: '请输入设备ID号', trigger: 'change' }
      ],
      gpsSimNo: [
        { required: true, message: '请输入gps', trigger: 'change' }
      ]
    }

    created() {
      this.id = this.$route.query.id
      this.getDetail(this.id)
      this.getDictionary()
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
      const { data } = await SelectOrderInfo({ orderId: value })
      if (data.success) {
        this.ContractDetail = Object.assign(this.ContractDetail, data.data)
        this.ruleForm.plateNo = this.ContractDetail.plateNo
      } else {
        this.$message.error(data)
      }
    }
    // 查询供应商
    private async getDictionary() {
      const { data } = await GetDictionaryList(['gps_supplier'])
      if (data.success) {
        this.gpsSupplier = data.data.gps_supplier
      } else {
        this.$message.error(data)
      }
    }

    // 搜索加盟经理列表
    private remoteMethod(query: any) {
      if (query !== '') {
        this.loading = true
        GetJoinManageList({
          key: query
        }).then((response:any) => {
          if (response.data.success) {
            let array = response.data.data
            let newArr: any = []
            array.forEach((i: any) => {
              newArr.push({ value: i.id, label: i.name + i.mobile })
            })
            this.managerList = newArr
            this.loading = false
          } else {
            this.$message.error(response.data.flag)
          }
        })
      } else {
        this.managerList = []
      }
    }

    // 选择运营经理
    private checkManage(id: any) {
      this.ruleForm.operationId = id
    }

    private async submitForm(formName:any) {
      (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
        if (valid) {
          // this.ContractDetail.orderDeliverRebateFORMs[0].priceType = 1
          // this.ContractDetail.orderDeliverRebateFORMs[0].priceType = 1
          this.fullscreenLoading = true
          this.ruleForm.orderId = this.ContractDetail.orderId
          this.ruleForm.driverId = this.ContractDetail.driverId
          const { data } = await SubmitOrderDeliver(this.ruleForm
          )
          if (data.success) {
            (TagsViewModule as any).delView(this.$route); // 关闭当前页面
            (TagsViewModule as any).delCachedView({ // 删除指定页面缓存（进行刷新操作）
              name: 'DealManage'
            })
            this.$nextTick(() => {
              this.$router.push({ name: 'DealManage' })
            })
            this.$message.success('提交成功')
          } else {
            this.$message.error(data.errorMsg)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    private resetForm(formName:any) {
      (this.$refs[formName] as ElForm).resetFields()
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
