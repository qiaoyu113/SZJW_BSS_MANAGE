<template>
  <div :class="isPC ? 'OrderAudit' : 'OrderAudit-m'">
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
          v-if="Number(ruleForm.busiType) === 0"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="收入保障"
            :value="orderDetail.incomeGuarantee"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="商品金额"
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
          v-if="Number(orderDetail.busiType) === 0 && Number(orderDetail.cooperationModel) === 3"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="年检有效期"
            :value="orderDetail.inspectionTime"
          />
        </el-col>

        <el-col
          v-if="Number(orderDetail.busiType) === 0 && Number(orderDetail.cooperationModel) === 3"
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
          v-if="orderDetail.supplier && Number(orderDetail.cooperationModel) === 1"
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
    <!--按钮-->
    <div class="btn_box">
      <el-button
        v-loading.fullscreen.lock="fullscreenLoading"
        type="success"
        name="orderaudit-resolve-btn"
        @click="auditPass()"
      >
        审核通过
      </el-button>
      <el-button
        v-loading.fullscreen.lock="fullscreenLoading"
        name="orderaudit-reject-btn"
        type="danger"
        @click="auditNoPass()"
      >
        审核不通过
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { GetOrderDetail, PostAuditOrder } from '@/api/join'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { TagsViewModule } from '@/store/modules/tags-view'
import '@/styles/common.scss'
@Component({
  name: 'OrderAudit',
  components: {
    DetailItem,
    SectionContainer
  }
})
export default class extends Vue {
    private id: any = ''
    private fullscreenLoading: Boolean = false
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

    // 审核通过
    private async auditPass(value: any) {
      this.fullscreenLoading = true
      const { data } = await PostAuditOrder({
        orderId: this.id,
        operateFlag: 'auditPass',
        status: this.orderDetail.status,
        cooperationModel: this.orderDetail.cooperationModel,
        driverId: this.orderDetail.driverId,
        createSource: this.orderDetail.createSource
      })
      if (data.success) {
        (TagsViewModule as any).delView(this.$route); // 关闭当前页面
        (TagsViewModule as any).delCachedView({ // 删除指定页面缓存（进行刷新操作）
          name: 'OrderManage'
        })
        this.$nextTick(() => {
          setTimeout(() => {
            this.$router.push({ name: 'OrderManage' })
          }, 1500)
        })
        this.$message.success('操作成功，审核通过')
      } else {
        this.$message.error(data.errorMsg)
        if (data.errorMsg === '司机信息不完善') {
          this.$confirm('检测到该司机没有现在居住地址信息，请完善！', '提示', {
            confirmButtonText: '去完善',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({ name: 'EditDriver', query: { id: this.orderDetail.driverId } })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      }
    }

    // 审核通过
    private async auditNoPass(value: any) {
      this.fullscreenLoading = true
      const { data } = await PostAuditOrder({
        orderId: this.id,
        operateFlag: 'auditNotPass',
        status: this.orderDetail.status,
        cooperationModel: this.orderDetail.cooperationModel,
        driverId: this.orderDetail.driverId,
        createSource: this.orderDetail.createSource
      })
      if (data.success) {
        (TagsViewModule as any).delView(this.$route); // 关闭当前页面
        (TagsViewModule as any).delCachedView({ // 删除指定页面缓存（进行刷新操作）
          name: 'OrderManage'
        })
        this.$nextTick(() => {
          this.$router.push({ name: 'OrderManage' })
        })
        this.$message.success('操作成功，审核不通过')
      } else {
        this.fullscreenLoading = false
        this.$message.error(data.errorMsg)
        if (data.errorCode === 650) {
          setTimeout(() => {
            this.$router.push({ name: 'EditDriver', query: { id: this.orderDetail.driverId } })
          }, 1500)
        }
      }
    }

    // 生命周期
    mounted() {
      this.id = this.$route.query.id
      this.getDetail(this.id)
    }
}
</script>

<style lang="scss">
.OrderAudit {
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

  .btn_box{
    padding-top: 20px;
    box-sizing: border-box;
  }
}
</style>

<style lang="scss">
.OrderAudit-m {
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
  .OrderAudit{
    .el-select {
      width: 100%;
    }
    .el-input {
      width: 75%;
    }
  }
}

@media screen and (max-width: 700px) {
  .OrderAudit-m{
    .el-select {
      width: 100%;
    }
    .el-input {
      width: 90%;
    }
  }
}
</style>
