<template>
  <div :class="isPC ? 'OrderDetail' : 'OrderDetail-m'">
    <SectionContainer
      title="司机信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="司机姓名"
            :value="orderDetail.driverInfoVO.name"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="司机电话"
            :value="orderDetail.driverInfoVO.phone"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="工作城市"
            :value="orderDetail.driverInfoVO.workCityName"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="身份证号"
            :value="orderDetail.driverInfoVO.idNo"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <SectionContainer
      title="商品信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="商品分类"
            :value="orderDetail.busiTypeName"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="合作模式"
            :value="orderDetail.cooperationModelName"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="合作期限(月)"
            :value="orderDetail.cooperationTime"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="抽佣比例(%)"
            :value="orderDetail.rake"
          />
        </el-col>
        <el-col
          v-if="orderDetail.busiType === 0"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="收入保障(元)"
            :value="orderDetail.incomeGuarantee"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="商品金额(元)"
            :value="orderDetail.goodsAmount"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <SectionContainer
      title="商品附加信息"
      :md="true"
    >
      <el-row>
        <el-col
          v-if="Number(orderDetail.cooperationModel) === 3 && Number(orderDetail.busiType) === 0"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="年检有效期"
            :value="orderDetail.inspectionTime"
          />
        </el-col>

        <el-col
          v-if="Number(orderDetail.cooperationModel) === 3 && Number(orderDetail.busiType) === 0"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="保险有效期"
            :value="orderDetail.insuranceTime"
          />
        </el-col>

        <el-col
          v-if="orderDetail.cooperationModel === 2"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="租赁公司"
            :value="orderDetail.supplier"
          />
        </el-col>

        <el-col
          v-if="orderDetail.cooperationModel === 1"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="购车公司"
            :value="orderDetail.supplier"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="合作车型"
            :value="orderDetail.cooperationCarName"
          />
        </el-col>

        <el-col
          v-if="orderDetail.cooperationModel !== 1"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="车牌号"
            :value="orderDetail.plateNo"
          />
        </el-col>

        <el-col
          v-if="orderDetail.cooperationModel !== 3"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="车辆信息"
            :value="orderDetail.carMessage"
          />
        </el-col>

        <el-col
          v-if="orderDetail.cooperationModel !== 3"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="无税车价"
            :value="orderDetail.carPrice"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="运力配额(人)"
            :value="orderDetail.capacityQuota"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <SectionContainer
      title="支付信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 24 : 24">
          <p class="hint_title">
            支付记录
          </p>
          <el-table
            :data="orderDetail.orderPayRecordInfoVOList"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="money"
              label="支付金额（元）"
            />
            <el-table-column
              prop="payType"
              label="支付方式"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.payTypeName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="money"
              label="支付时间"
            >
              <template slot-scope="scope">
                {{ scope.row.payDate | Timestamp }}
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="支付截图"
            >
              <template slot-scope="scope">
                <el-image
                  v-if="scope.row.payImageUrl"
                  style="width:50px;height:50px;"
                  :preview-src-list="[scope.row.payImageUrl]"
                  :src="scope.row.payImageUrl"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="outTradeNo"
              label="交易编号"
            />
            <el-table-column
              prop="remarks"
              label="备注"
            />
          </el-table>
        </el-col>
      </el-row>
    </SectionContainer>
    <SectionContainer
      title="操作记录"
      :md="true"
    >
      <el-row
        type="flex"
        justify="space-between"
        class="wrap"
      >
        <el-col
          class="follow-card"
          :span="isPC ? 24 : 24"
        >
          <div class="card-tit">
            <div class="card-t">
              最新记录
            </div>
          </div>
          <div class="card-box clearfix">
            <el-col :span="24">
              <DetailItem
                name="订单状态"
                :value="orderDetail.statusName"
              />
            </el-col>
            <el-col :span="24">
              <!-- <DetailItem
                name="订单生成时间"
                :value="(orderDetail.driverInfoVO.createDate | Timestamp) + (driverInfoVO.driverInfoVO.createName)"
              /> -->
              <DetailItem
                name="订单生成时间"
                :value="orderDetail.createDate | Timestamp"
              >
                <template>
                  ({{ orderDetail.createName }})
                </template>
              </DetailItem>
            </el-col>
            <!-- <el-col
              v-if="orderDetail.status === 30"
              :span="24"
            > -->
            <!-- <DetailItem
                name="订单确认时间"
                :value="(orderDetail.driverInfoVO.confirmTime | Timestamp) + (driverInfoVO.driverInfoVO.confirmName)"
              /> -->
            <!-- <DetailItem
                name="订单确认时间"
                :value="orderDetail.confirmTime | Timestamp"
              >
                <template>
                  ({{ orderDetail.confirmName }})
                </template>
              </DetailItem>
            </el-col> -->
            <el-col
              v-if="orderDetail.status === 25"
              :span="24"
            >
              <!-- <DetailItem
                name="审核不通过时间"
                :value="(orderDetail.driverInfoVO.passTime | Timestamp) + (driverInfoVO.driverInfoVO.notPassName)"
              /> -->
              <DetailItem
                name="审核不通过时间"
                :value="orderDetail.notPassTime | Timestamp"
              >
                <template>
                  ({{ orderDetail.notPassName }})
                </template>
              </DetailItem>
            </el-col>
            <el-col
              v-if="orderDetail.status === 30"
              :span="24"
            >
              <!-- <DetailItem
                name="审核通过时间"
                :value="(orderDetail.driverInfoVO.notPassTime | Timestamp) + (driverInfoVO.driverInfoVO.passName)"
              /> -->
              <DetailItem
                name="审核通过时间"
                :value="orderDetail.passTime | Timestamp"
              >
                <template>
                  ({{ orderDetail.passName }})
                </template>
              </DetailItem>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </SectionContainer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { GetOrderDetail } from '@/api/join'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'
@Component({
  name: 'OrderDetail',
  components: {
    DetailItem,
    SectionContainer
  }
})
export default class extends Vue {
    private id: any = ''
    private orderDetail: any = {
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
        'confirmTime': '',
        'passTime': '',
        'notPassTime': '',
        'passName': '',
        'notPassName': '',
        'confirmName': '',
        'createName': '',
        'createDate': '',
        'address': '',
        'bankCardNo': '',
        'busiType': '',
        'busiTypeName': '',
        'carType': '',
        'carTypeName': '',
        'clueId': '',
        'corpUserId': '',
        'createId': '',
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
      'orderPayRecordInfoVOList': [],
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
    }
    private ruleForm: any = {
      name: '',
      region: '',
      date1: '',
      date2: '',
      delivery: false,
      type: [],
      resource: '',
      desc: ''
    };
    private rules: any = {
      name: [
        { required: true, message: '请输入活动名称', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      ],
      region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
      date1: [
        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
      ],
      date2: [
        { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
      ],
      type: [
        {
          type: 'array',
          required: true,
          message: '请至少选择一个活动性质',
          trigger: 'change'
        }
      ],
      resource: [
        { required: true, message: '请选择活动资源', trigger: 'change' }
      ],
      desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
    };

    created() {}

    mounted() {
      this.id = this.$route.query.id
      this.getDetail(this.id)
    }

    activated() {}

    // 判断是否是PC
    get isPC() {
      return SettingsModule.isPC
    }

    // 请求列表
    private async getDetail(value: any) {
      const { data } = await GetOrderDetail({ orderId: value })
      if (data.success) {
        let datas = data.data
        this.orderDetail = datas
      } else {
        this.$message.error(data)
      }
    }
}
</script>

<style lang="scss">
.OrderDetail {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .el-form-item__label {
    color: #4a4a4a;
    font-weight: 400;
  }

  .hint_title{
      width: 100%;
      font-size: 13px;
      color: #333;
      margin: 0 0 15px 0;
      box-sizing: border-box;
      display: inline-block;
      border-radius: 6px;
      span{
        color: #9e9e9e;
      }
  }
}
</style>

<style lang="scss">
.OrderDetail-m {
  width: 100%;
  .el-form-item__label {
    color: #4a4a4a;
    font-weight: 400;
  }
  .follow-card{
    margin-left: 10px;
    margin-right: 10px;
  }
  .card-box{
    padding: 10px;
  }
  .hint_title{
      width: 100%;
      font-size: 13px;
      color: #333;
      padding: 10px 15px 0;
      box-sizing: border-box;
      display: inline-block;
      border-radius: 6px;
      span{
        color: #9e9e9e;
      }
  }
}
</style>

<style lang="scss" scope>
.wrap {
  flex-wrap: wrap;
}
.follow-card {
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #dde2ee;
  background: #fafbfc;
  .card-tit {
    position: relative;
    height: 32px;
    line-height: 32px;
    background: #dde2ee;
    font-size: 14px;
    color: #838a9d;
    text-align: center;
    border-radius: 4px 4px 0 0;
  }
  .card-box {
    padding: 24px 30px;
  }
}
@media screen and (min-width: 701px) {
  .el-select {
    width: 100%;
  }
  .el-input {
    width: 75%;
  }
}

@media screen and (max-width: 700px) {
  .el-select {
    width: 100%;
  }
  .el-input {
    width: 90%;
  }
}
</style>
