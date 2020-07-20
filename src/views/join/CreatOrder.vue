<template>
  <div :class="isPC ? 'CreatOrder' : 'CreatOrder-m'">
    <el-collapse>
      <el-collapse-item
        title="订单攻略"
        name="1"
      >
        <div>1、交付信息会根据订单信息，不同的配置，需要把必填项都填写完整后提交。</div>
        <div>2、合作模式：购车，需要填写车辆交付，如返利等，如有问题可以联系供应链同事。</div>
        <div>3、运营经理负责成交后的司机运营跟进。</div>
        <div>4、GPS绑定的编号，需要填写准确，对后期的设备状态和轨迹，会有影响。</div>
      </el-collapse-item>
    </el-collapse>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      class="demo-ruleForm"
    >
      <SectionContainer
        title="选择司机"
        :md="true"
      >
        <el-row class="driver">
          <el-col :span="isPC ? 6 : 24">
            <el-select
              v-model="ruleForm.driverId"
              :remote-method="remoteMethod"
              :loading="loading"
              filterable
              remote
              reserve-keyword
              placeholder="请输入司机姓名或完整手机号"
              @change="checkDiver"
            >
              <el-option
                v-for="item in driverList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
      </SectionContainer>
      <SectionContainer
        v-if="ruleForm.driverId"
        title="司机信息"
        :md="true"
      >
        <el-row class="detail">
          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="姓名"
              :value="ruleForm.driverInfoFORM.name"
            />
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="司机电话"
              :value="ruleForm.driverInfoFORM.phone"
            />
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="工作城市"
              :value="ruleForm.driverInfoFORM.workCityName"
            />
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="身份证号"
              prop="driverInfoFORM.idNo"
            >
              <el-input
                v-model="ruleForm.driverInfoFORM.idNo"
                placeholder="请输入身份证号"
                maxlength="18"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>
      <SectionContainer
        v-if="ruleForm.driverId"
        title="商品信息"
        :md="true"
      >
        <el-row class="detail">
          <el-col :span="isPC ? 24 : 24">
            <el-form-item
              label="商品分类"
              prop="busiType"
            >
              <el-radio-group v-model="ruleForm.busiType">
                <el-radio
                  v-for="item in optionsBusi"
                  :key="item.dictValue"
                  :label="item.dictValue"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item
              label="合作模式"
              prop="cooperationModel"
            >
              <el-radio-group v-model="ruleForm.cooperationModel">
                <el-radio label="1">
                  购车
                </el-radio>
                <el-radio label="2">
                  租车
                </el-radio>
                <el-radio label="3">
                  带车
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="合作期限（月）"
              prop="cooperationTime"
            >
              <el-input
                v-model="ruleForm.cooperationTime"
                v-only-number="{min: 0, max: 12}"
                placeholder="合作期限"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="收入保障（元）"
              prop="incomeGuarantee"
            >
              <el-input
                v-model="ruleForm.incomeGuarantee"
                v-only-number="{min: 0, precision: 2}"
                placeholder="请输入收入保障"
                maxlength="10"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="抽佣比例（%）"
              prop="rake"
            >
              <el-input
                v-model="ruleForm.rake"
                v-only-number="{min: 0, max: 100}"
                placeholder="请输入抽佣比例"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="商品金额（元）"
              prop="goodsAmount"
            >
              <el-input
                v-model="ruleForm.goodsAmount"
                v-only-number="{min: 0, precision: 2}"
                placeholder="请输入商品金额"
                type="number"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>

      <SectionContainer
        v-if="ruleForm.cooperationModel && ruleForm.driverId"
        title="商品附加信息"
        :md="true"
      >
        <el-row class="detail">
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              v-if="ruleForm.cooperationModel === '3'"
              label="年检有效期"
              prop="inspectionTime"
            >
              <el-date-picker
                v-model="ruleForm.inspectionTime"
                type="date"
                placeholder="请输入年检有效期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              v-if="ruleForm.cooperationModel === '3'"
              label="保险有效期"
              prop="insuranceTime"
            >
              <el-date-picker
                v-model="ruleForm.insuranceTime"
                type="date"
                placeholder="请输入保险有效期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              v-if="ruleForm.cooperationModel === '2'"
              label="租赁公司"
              prop="supplier"
            >
              <el-select
                v-model="ruleForm.supplier"
                placeholder="请选择租赁公司"
              >
                <el-option
                  v-for="item in optionsCompany"
                  :key="item.codeVal"
                  :label="item.code"
                  :value="item.codeVal"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              v-if="ruleForm.cooperationModel === '1'"
              label="购车公司"
              prop="supplier"
            >
              <el-select
                v-model="ruleForm.supplier"
                placeholder="请选择购车公司"
              >
                <el-option
                  v-for="item in optionsCompany"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--购车和租车-->
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              v-if="ruleForm.supplier && ruleForm.cooperationModel !== '3'"
              label="合作车型"
              prop="cooperationCar"
            >
              <el-select
                v-model="ruleForm.cooperationCar"
                placeholder="请选择合作车型"
              >
                <el-option
                  v-for="item in optionsCar"
                  :key="item.carType"
                  :label="item.carTypeName"
                  :value="item.carType"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--带车-->
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              v-if="ruleForm.cooperationModel === '3'"
              label="合作车型"
              prop="cooperationCar"
            >
              <el-select
                v-model="ruleForm.cooperationCar"
                placeholder="请选择合作车型"
              >
                <el-option
                  v-for="item in optionsCar2"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--车辆型号-->
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              v-if="ruleForm.supplier && ruleForm.cooperationCar && ruleForm.cooperationModel !== '3'"
              label="车辆型号"
              prop="cooperationCar"
            >
              <el-select
                v-model="ruleForm.carModel"
                placeholder="请选择车辆型号"
              >
                <el-option
                  v-for="item in optionsCarType"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="车牌号"
              prop="plateNo"
            >
              <el-input
                v-model="ruleForm.plateNo"
                placeholder="请输入车牌号"
                maxlength="10"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="运力配额"
              prop="capacityQuota"
            >
              <el-input
                v-model="ruleForm.capacityQuota"
                v-only-number="{min: 1, max: 99}"
                placeholder="请输入运力配额"
                maxlength="10"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="ruleForm.cooperationModel !== '3' && ruleForm.cooperationCar">
          <div class="follow">
            <p>
              <span class="follow_title">
                车辆信息
              </span>
            </p>
          </div>
          <el-row>
            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                name="车辆信息"
                :value="ruleForm.describe"
              />
            </el-col>
            <el-col :span="isPC ? 6 : 24">
              <DetailItem
                v-if="ruleForm.supplier && ruleForm.cooperationModel !== '3'"
                name="无税车价"
                :value="ruleForm.carPrice"
              />
            </el-col>
          </el-row>
        </div>
      </SectionContainer>
      <SectionContainer
        v-if="ruleForm.driverId"
        :title="`支付信息` + `( 订单金额：¥` + orderPrice + ` )`"
        :md="true"
      >
        <p class="hint_title">
          添加支付金额 <span>（说明：如果分多次支付，需要添加多次支付金额，确保支付金额共计等于订单金额 ）</span>
        </p>
        <el-row
          style="width: 100%;"
        >
          <el-col :span="isPC ? 8 : 24">
            <el-form-item :label="`剩余添加金额： ¥` + remain + ``">
              <el-input
                v-model="payNumber"
                v-only-number="{min: 0, max: '', precision: 2}"
                placeholder="请输入支付金额"
                maxlength="10"
              />
              <div
                class="add_btn"
              >
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="addPayList"
                >
                  添加金额
                </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="isPC ? 24 : 24">
            <p class="hint_title">
              支付记录 <span>(已支付金额： ¥{{ readyPay }}，未支付: ¥ {{ Number(orderPrice) - Number(remain) - Number(readyPay) }} )</span>
            </p>
            <el-form-item :label="` `">
              <el-table
                :data="ruleForm.orderPayRecordInfoFORMList"
                border
                style="width: 100%"
              >
                <el-table-column
                  prop="money"
                  label="支付金额（元）"
                />
                <el-table-column
                  prop="status"
                  label="是否支付"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-if="Number(scope.row.status) === 1"
                      type="warning"
                      size="small"
                      plain
                      @click="goBill(scope.row, scope.$index)"
                    >
                      立即支付
                    </el-button>
                    <el-button
                      v-if="Number(scope.row.status) === 3"
                      type="text"
                      size="small"
                      style="color: #67C23A;"
                    >
                      已支付
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-if="Number(scope.row.status) === 3"
                      type="text"
                      size="small"
                      @click="handleClick(scope.row, scope.$index)"
                    >
                      查看
                    </el-button>
                    <el-button
                      v-if="Number(scope.row.status) === 1"
                      type="text"
                      size="small"
                      @click="delClick(scope.row, scope.$index)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>
    </el-form>
    <!--按钮-->
    <div
      v-if="ruleForm.driverId"
      class="btn_box"
    >
      <el-button
        v-loading.fullscreen.lock="fullscreenLoading"
        type="primary"
        name="CreatLine-btn-creat"
        @click="submitForm('ruleForm')"
      >
        立即创建
      </el-button>
      <el-button
        name="CreatLine-btn-creat"
        @click="resetForm('ruleForm')"
      >
        重置
      </el-button>
    </div>
    <!-- 支付 -->
    <Dialog
      :visible.sync="showMessageBill"
      title="支付"
      :confirm="confirm"
    >
      <el-form
        ref="payForm"
        :model="payForm"
        :rules="payRules"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="isPC ? 24 : 24">
            <DetailItem
              name="支付金额"
              :value="payForm.money"
            />
          </el-col>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item
              label="支付时间"
              prop="payDate"
            >
              <el-date-picker
                v-model="payForm.payDate"
                type="date"
                value-format="timestamp"
                placeholder="请选择支付时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item
              label="支付方式"
              prop="payType"
            >
              <el-select
                v-model="payForm.payType"
                placeholder="请选择支付方式"
              >
                <el-option
                  label="账户"
                  value="1"
                />
                <el-option
                  label="微信支付"
                  value="2"
                />
                <el-option
                  label="云鸟钱包"
                  value="3"
                />
                <el-option
                  label="支付宝"
                  value="4"
                />
                <el-option
                  label="银联支付"
                  value="5"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item
              ref="uploadElement"
              label="上传支付图片(请上传支付截图，截图中需要有金额和交易编号，图片支持PNG/JPEG/JPG格式，最大限制为5M)"
              prop="payImageUrl"
            >
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                action="/api/base/v1/upload/uploadOSS/img/true/-1"
                :before-upload="beforeAvatarUpload"
                :on-change="handleChange"
                :auto-upload="false"
                :data="ruleForm"
              >
                <img
                  v-if="payForm.payImageUrl"
                  :src="payForm.payImageUrl"
                  style="width:100%;"
                >
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  circle
                />
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item
              label="流水编号"
              prop="transactionId"
            >
              <el-input
                v-model="payForm.transactionId"
                placeholder="请输入流水编号"
                maxlength="10"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item
              label="备注"
              prop="remarks"
            >
              <el-input
                v-model="ruleForm.remarks"
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </Dialog>
    <!-- 支付详情 -->
    <Dialog
      :visible.sync="showMessage"
      title="支付详情"
    >
      <el-row>
        <el-col :span="isPC ? 24 : 24">
          <DetailItem
            name="订单金额"
            :value="'¥' + payForm.money"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="isPC ? 24 : 24">
          <DetailItem
            name="支付时间"
            :value="payForm.payDate | Timestamp"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="isPC ? 24 : 24">
          <DetailItem
            name="支付方式"
            :value="payForm.payType === '1' ? '账户' : (payForm.payType === '2' ? '微信支付' : (payForm.payType === '3' ? '云鸟钱包' : (payForm.payType === '4' ? '支付宝' : (payForm.payType === '5' ? '银联支付' : '暂无数据'))))"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="isPC ? 24 : 24">
          <DetailItem
            name="支付图片"
            type="image"
            :value="payForm.payImageUrl"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="isPC ? 24 : 24">
          <DetailItem
            name="备注"
            :value="payForm.remarks"
          />
        </el-col>
      </el-row>
    </Dialog>
  </div>
</template>
<script lang="ts">
import { Form as ElForm, Input } from 'element-ui'
import Dialog from '@/components/Dialog/index.vue'
import { GetDictionaryList, Upload } from '@/api/common'
import { CreateNewOrder, GetDriverDetail, GetDriverList, GetSupplierByTypeAndCity, GetCarTypeByTypeAndCityAndSupplier, GetPriceAndByTypeAndCityAndSupplierAndCarType, GetOrderDetail, GetModelByTypeAndCityAndSupplierAndCarType, RepayOrder } from '@/api/join'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import DetailItem from '@/components/DetailItem/index.vue'
import SectionContainer from '@/components/SectionContainer/index.vue'
import SelfItem from '@/components/base/SelfItem.vue'
import { TagsViewModule } from '@/store/modules/tags-view'
import '@/styles/common.scss'
@Component({
  name: 'CreatOrder',
  components: {
    SelfItem,
    SectionContainer,
    DetailItem,
    Dialog
  }
})
export default class CreatLine extends Vue {
  private pageStatus:number = 0
  private remain: number = 0
  private readyPay: number = 0
  private orderPrice: number = 0
  private orderIndex:number = 0
  private optionsCar: any[] = [] // 字典查询定义(命名规则为options + 类型名称)
  private optionsCar2: any[] = [] // 字典查询定义(命名规则为options + 类型名称)
  private optionsBusi: any[] = []
  private optionsCompany: any[] = [] // 字典查询定义(命名规则为options + 类型名称)
  private optionsRentCompany: any[] = [] // 字典查询定义(命名规则为options + 类型名称)
  private driverList: any[] = []
  private optionsCarType: any[] = []
  private payNumber: any = ''
  private billDetail: any = {}
  private loading:boolean = false
  private showMessage:boolean = false
  private showMessageBill:boolean = false
  private fullscreenLoading: Boolean = false
  private id: any = ''
  private ruleForm:any = {
    'operateFlag': 'creat',
    'busiType': '',
    'buyCarCompany': '',
    'capacityQuota': '',
    'carPrice': '',
    'city': '',
    'confirmId': '',
    'confirmTime': '',
    'cooperationCar': '',
    'cooperationModel': '',
    'cooperationTime': '',
    'createDate': '',
    'createId': '',
    'createSource': '',
    'deliverDate': '',
    'driverId': '',
    'driverInfoFORM': {
      'driverId': '',
      'idNo': '',
      'name': '',
      'phone': '',
      'workCity': ''
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
    'orderId': '',
    'orderPayRecordInfoFORMList': [],
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
    'supplier': '',
    'carModel': '',
    'updateId': '',
    'productId': ''
  }
  private rules:any = {
    'driverInfoFORM.idNo': [
      { required: true, message: '请输入身份证号', trigger: 'blur' },
      {
        pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
        message: '证件号码格式有误！',
        trigger: 'blur'
      }
    ],
    busiType: [
      { required: true, message: '请选择商品分类', trigger: 'change' }
    ],
    cooperationModel: [
      { required: true, message: '请选择合作模式', trigger: 'change' }
    ],
    cooperationTime: [
      { required: true, message: '请输入合作期限', trigger: 'change' }
    ],
    incomeGuarantee: [
      { required: true, message: '请输入收入保障', trigger: 'change' }
    ],
    rake: [
      { required: true, message: '请输入抽佣比例', trigger: 'change' }
    ],
    goodsAmount: [
      { required: true, message: '请输入商品金额', trigger: 'change' }
    ],
    inspectionTime: [
      { required: true, message: '请选择年检有效期', trigger: 'change' }
    ],
    insuranceTime: [
      { required: true, message: '请选择保险有效期', trigger: 'change' }
    ],
    leaseCarCompany: [
      { required: true, message: '请选择租赁公司', trigger: 'change' }
    ],
    buyCarCompany: [
      { required: true, message: '请选择购车公司', trigger: 'change' }
    ],
    supplier: [
      { required: true, message: '请选择供应商', trigger: 'change' }
    ],
    cooperationCar: [
      { required: true, message: '请选择合作车型', trigger: 'change' }
    ],
    plateNo: [
      { required: true, message: '请输入车牌号', trigger: 'change' }
    ],
    capacityQuota: [
      { required: true, message: '请输入运力配额', trigger: 'change' }
    ]
  }
  private payForm:any = {
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
  private payRules:any = {
    payDate: [
      { required: true, message: '请输入支付时间', trigger: 'blur' }
    ],
    transactionId: [
      { required: true, message: '请输入流水编号', trigger: 'change' },
      { min: 1, max: 50, message: '长度在50个字符内', trigger: 'change' }
    ],
    payType: [
      { required: true, message: '请选择支付方式', trigger: 'change' }
    ],
    payImageUrl: [
      { required: false, message: '请上传支付图片', trigger: 'change' }
    ],
    remake: [
      { required: true, message: '请选择活动区域', trigger: 'change' }
    ],
    cangweizhi: [
      { required: true, message: '请选择活动区域', trigger: 'change' }
    ],
    waitday: [
      { required: true, message: '请选择活动资源', trigger: 'change' }
    ],
    wending: [
      { required: true, message: '请选择活动资源', trigger: 'change' }
    ]
  }

  @Watch('showMessageBill', { deep: true })
  private changeRuleForm(value:any) {
    if (!value) {
      (this.$refs['payForm'] as ElForm).resetFields()
    }
  }

  @Watch('showMessage', { deep: true })
  private changeRule(value:any) {
    if (!value) {
      (this.$refs['payForm'] as ElForm).resetFields()
    }
  }

  @Watch('payForm', { deep: true })
  private changePayForm(value:any) {
    console.log(value)
  }

  @Watch('ruleForm.cooperationModel', { deep: true })
  private changecooperationModel(value:any) {
    if (value === '1') {
      this.getCompany()
    } else if (value === '2') {
      this.getCompany()
    }
  }

  @Watch('ruleForm.buyCarCompany', { deep: true })
  private changeCarCompany(value:any) {
    // this.ruleForm.cooperationCar = ''
    this.getCar()
  }

  @Watch('ruleForm.supplier', { deep: true })
  private changeleaseCarCompany(value:any) {
    // this.ruleForm.cooperationCar = ''
    this.getCar()
  }

  @Watch('ruleForm.cooperationCar', { deep: true })
  private changeCooperationCar(value:any) {
    if (this.ruleForm.cooperationModel === '1') {
      this.getModelByTypeAndCityAndSupplierAndCarType()
    }
    this.getPrice()
  }

  @Watch('ruleForm.goodsAmount', { deep: true })
  private changeGoodsAmount(value:any) {
    this.orderPrice = value
    this.remain = this.orderPrice - this.readyPay
  }

  @Watch('remain')
  private changeGoodsAmounts(value:any) {
    console.log(4, value)
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  private async getDictionary() {
    const { data } = await GetDictionaryList(['Intentional_compartment', 'busi_type'])
    if (data.success) {
      this.optionsCar2 = data.data.Intentional_compartment
      this.optionsBusi = data.data.busi_type
    } else {
      this.$message.error(data)
    }
  }
  // 查供应商
  private async getCompany() {
    let { data } = await GetSupplierByTypeAndCity(
      { busType: this.ruleForm.cooperationModel, city: this.ruleForm.driverInfoFORM.workCity }
    )
    if (data.success) {
      this.optionsCompany = data.data
    } else {
      this.$message.error(data)
    }
  }
  // 查看车型
  private async getCar() {
    let { data } = await GetCarTypeByTypeAndCityAndSupplier(
      { busType: this.ruleForm.cooperationModel, city: this.ruleForm.driverInfoFORM.workCity, supplier: this.ruleForm.supplier }
    )
    if (data.success) {
      this.optionsCar = data.data
    } else {
      this.$message.error(data)
    }
  }
  // 查看无税车价
  private async getPrice() {
    let { data } = await GetPriceAndByTypeAndCityAndSupplierAndCarType(
      { busType: this.ruleForm.cooperationModel, city: this.ruleForm.driverInfoFORM.workCity, supplier: this.ruleForm.supplier, carType: this.ruleForm.cooperationCar }
    )
    if (data.success) {
      this.ruleForm.carPrice = data.data.price
      this.ruleForm.describe = data.data.describe
      this.ruleForm.productId = data.data.productCode
    } else {
      this.$message.error(data)
    }
  }

  // 查看车型
  private async getModelByTypeAndCityAndSupplierAndCarType() {
    let { data } = await GetModelByTypeAndCityAndSupplierAndCarType(
      { busType: this.ruleForm.cooperationModel, city: this.ruleForm.driverInfoFORM.workCity, supplier: this.ruleForm.supplier, carType: this.ruleForm.cooperationCar }
    )
    if (data.success) {
      this.optionsCarType = data.data
    } else {
      this.$message.error(data)
    }
  }

  // 所有请求
  private async fetchData() {
    this.getDictionary()
  }

  mounted() {
    this.fetchData()
    let id = this.$route.query.id
    this.id = id
    if (id) {
      this.getDetail(id)
    }
  }

  // 获取订单详情
  private async getDetail(id: any) {
    const { data } = await GetOrderDetail({ orderId: id })
    if (data.success) {
      let datas = data.data
      this.ruleForm = Object.assign(this.ruleForm, datas)
      this.ruleForm.driverInfoFORM = this.ruleForm.driverInfoVO
      this.ruleForm.orderPayRecordInfoFORMList = this.ruleForm.orderPayRecordInfoVOList
      this.orderPrice = this.ruleForm.goodsAmount
      let notReadPay = 0
      this.ruleForm.orderPayRecordInfoFORMList.forEach((i: any) => {
        if (Number(i.status) !== 1) {
          this.readyPay = Number(this.readyPay) + Number(i.money)
        } else {
          notReadPay = notReadPay + Number(i.money)
        }
      })
      setTimeout(() => {
        this.remain = Number(this.orderPrice) - notReadPay
      }, 100)
      this.ruleForm.busiType = this.ruleForm.busiType.toString()
      this.ruleForm.cooperationModel = this.ruleForm.cooperationModel.toString()
    } else {
      this.$message.error(data)
    }
  }

  // 添加金额
  private addPayList() {
    if (this.payNumber) {
      if (Number(this.payNumber) > Number(this.remain)) {
        this.$message.error('添加的支付金额，不能超过剩余添加金额')
      } else {
        this.remain = Number(this.remain) - Number(this.payNumber)
        this.ruleForm.orderPayRecordInfoFORMList.push(
          {
            money: Number(this.payNumber).toFixed(2).toString(),
            status: '1'
          }
        )
        this.payNumber = ''
      }
    } else {
      this.$message.warning('请输入支付金额')
    }
  }

  // 查看详情
  private handleClick(res: any, index: any) {
    this.orderIndex = index
    this.payForm = Object.assign(this.payForm, res)
    this.showMessage = true
  }
  // 删除
  private delClick(res: any, index: any) {
    this.ruleForm.orderPayRecordInfoFORMList.splice(index, 1)
  }
  // 立即支付
  private goBill(res: any, index: any) {
    this.orderIndex = index
    this.payForm = Object.assign(this.payForm, res)
    this.showMessageBill = true
  }
  private beforeAvatarUpload(file:any) {
    const isImage = file.type.includes('image')
    if (!isImage) {
      this.$message.error('上传图片格式不正确')
    }
    return isImage
  }
  // 选择图片
  private async handleChange(file: any, fileList: any) {
    let formData = new FormData() // 创建form对象
    formData.append('file', file.raw)
    let { data } = await Upload({
      expire: 0,
      folder: 'img',
      isEncode: true
    },
    formData)
    if (data.success) {
      this.payForm.payImageUrl = data.data.url
    } else {
      this.$message.error(data.errorMsg)
    }
  }

  // 确认订单
  private confirm() {
    (this.$refs['payForm'] as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        if (this.payForm.payImageUrl) {
          let index = this.orderIndex
          this.payForm.status = '3'
          this.readyPay = Number(this.readyPay) + Number(this.payForm.money)
          this.ruleForm.orderPayRecordInfoFORMList[index] = Object.assign(this.ruleForm.orderPayRecordInfoFORMList[index], this.payForm)
          Vue.set(this.ruleForm.orderPayRecordInfoFORMList, index, this.ruleForm.orderPayRecordInfoFORMList[index])
          this.showMessageBill = false
        } else {
          this.$message.error('请上传支付图片')
        }
      } else {
        return false
      }
    })
  }
  // 搜索司机列表
  private remoteMethod(query: any) {
    if (query !== '') {
      this.loading = true
      GetDriverList({
        key: query
      }).then(response => {
        if (response.data.success) {
          let array = response.data.data
          let newArr: any = []
          array.forEach((i: any) => {
            newArr.push({ value: i.driverId, label: i.name + i.phone, detail: i })
          })
          this.driverList = newArr
          this.loading = false
        } else {
          this.$message.error(response.data.errorMsg)
        }
      })
    } else {
      this.driverList = []
    }
  }
  // 选择司机
  private checkDiver(driverId: any) {
    this.driverList.forEach(i => {
      if (i.value === driverId) {
        this.ruleForm.driverInfoFORM.name = i.detail.name
        this.ruleForm.driverInfoFORM.phone = i.detail.phone
        this.ruleForm.driverInfoFORM.workCity = i.detail.workCity
        this.ruleForm.driverInfoFORM.workCityName = i.detail.workCityName
        this.ruleForm.driverInfoFORM.driverId = driverId
      }
    })
  }
  // 提交
  private submitForm(formName:any) {
    (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        if (this.id) {
          this.ruleForm.operateFlag = 'rePay'
          RepayOrder(this.ruleForm
          ).then((data: any) => {
            if (data.data.success) {
              this.fullscreenLoading = true
              this.$message.success('创建订单成功！')
              setTimeout(() => {
                (TagsViewModule as any).delView(this.$route); // 关闭当前页面
                (TagsViewModule as any).delCachedView({ // 删除指定页面缓存（进行刷新操作）
                  name: 'OrderManage'
                })
                this.$nextTick(() => {
                  this.$router.push({ name: 'OrderManage' })
                })
              }, 1500)
            } else {
              this.$message.error(data.data.errorMsg)
            }
          }).catch(err => {
            this.$message.error(err)
          })
        } else {
          CreateNewOrder(this.ruleForm
          ).then((data: any) => {
            if (data.data.success) {
              this.fullscreenLoading = true
              this.$message.success('创建订单成功！')
              this.$router.push({ name: 'OrderManage' })
            } else {
              this.$message.error(data.data.errorMsg)
            }
          }).catch(err => {
            this.$message.error(err)
          })
        }
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  // 重置
  private resetForm(formName:any) {
    (this.$refs[formName] as ElForm).resetFields()
  }
}
</script>
<style lang="scss">
.CreatOrder {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .btn-content{
    color: #4a4a4a;
    font-weight: 400;
  }
  .btn_box{
    padding-top: 20px;
    box-sizing: border-box;
  }
    .dioBox{
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
      padding: 0 20px;
      .el-input{
        width: 200px!important;
      }
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
  .el-form-item__label{
      width: 100% !important;
      font-size: 13px;
      color: #9e9e9e;
      font-weight: 400;
      text-align: left;
  }
  .el-form-item__content{
      padding-right: 35px;
  }
  .el-select{
      width: 100%;
  }

  .card-tit{
      position: relative;
      height: 32px;
      line-height: 32px;
      background: #DDE2EE;
      font-size: 14px;
      color: #838A9D;
      text-align: center;
      border-radius: 4px 4px 0 0;
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
    .add_btn{
        position: absolute;
        margin-left: 15px;
        display: inline-block;
        width: max-content;
    }
}
</style>
<style lang="scss">
.CreatOrder-m {
  width: 100%;
  .driver{
    padding: 10px;
    box-sizing: border-box;
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
  .add_btn{
      width: 100% !important;
      display: inline-block;
      margin-top: 10px;
      .el-button--primary{
        width: 100%;
      }
  }
  .el-form-item{
    // padding-left: 15px;
    box-sizing: border-box;
    margin: 10px;
  }
  .el-form-item__label{
    color: #4a4a4a;
    font-weight: 400;
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
    .dioBox{
    margin-bottom: 20px;
    padding: 0 20px;
    .el-input{
      width: 200px!important;
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
<style lang="scss" scoped>
@media screen and (min-width: 701px) {
  .SelfItem .el-select {
    width: 100%;
  }
  .SelfItem  .el-input, .el-date-editor, .el-textarea {
    width: 100%;
  }
  // .el-cascader{
  //   width: 100%;
  // }
}

@media screen and (max-width: 700px) {
  .el-select {
    width: 100%;
  }
  .el-input{
    width: 100%;
  }
}
</style>
