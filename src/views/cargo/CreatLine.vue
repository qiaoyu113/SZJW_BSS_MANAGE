<template>
  <div :class="isPC ? 'CreatLine' : 'CreatLine-m'">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <SectionContainer
        title="详情信息"
        :md="true"
      >
        <el-row class="detail">
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'customerId',type: 5,label: '货主名称',tagAttrs: {placeholder: '请输入选择货主',filterable: true,disabled: this.$route.path.split('/')[2] === 'creatline' ? false :true},options: customerOptions}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'lineName',type: 1,label: '内部使用线路名称',tagAttrs: {placeholder: '名称应具有辨识度'}}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'deployNo',type: 1,label: '可上车数',kind: 'number',placeholder: '请输入可上车数'}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'lineType',type: 3,label: '线路类型',radio: lineType}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'waitDirveValidity',type: 2,label: '等待上车有效期（天）',placeholder: '请输入有效期'}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'remark',type: 1,label: '备注信息/线路描述',kind: 'textarea',tagAttrs: {maxlength:
              500, row: 6, showWordLimit: true}}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :pccol="24"
            :params="{prop: 'stabilityRate',type: 3,label: '线路稳定性',radio: linetask}"
          />
          <!-- <SelfItem
            :rule-form="ruleForm"
            :pccol="12"
            :params="{prop: 'cangweizhi',type: 4,label: '仓位置',kind: '2',iswrite: true}"
          /> -->
        </el-row>
      </SectionContainer>
      <SectionContainer
        title="配送信息"
        :md="true"
      >
        <el-row>
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'carType',type: 5,label: '选择车型',placeholder: '请选择车型',options: carType}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'returnWarehouse',type: 3,label: '是否需要返仓',radio: [{label: '是',type: 1},{label: '否',type: 2}]}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'returnBill',type: 3,label: '是否需要回单',radio: [{label: '是',type: 1},{label: '否',type: 2}]}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'deliveryNo',type: 1,label: '预计每日平均配送点位数',tagAttrs: {placeholder: '请输入每日平均配送点位数'},kind: 'number'}"
            :pccol="8"
            :width="200"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'distance',type: 1,label: '预计每日平均总公里数（公里）',tagAttrs: {placeholder: '请输入每日平均总公里数'},kind: 'number'}"
            :pccol="8"
            :width="240"
          />
          <!-- <SelfItem
            :rule-form="ruleForm"
            :pccol="12"
            :params="{prop: 'peisong',type: 4,label: '配送区域',kind: '2',iswrite: true}"
          /> -->
        </el-row>
      </SectionContainer>
      <SectionContainer
        title="结算信息"
        :md="true"
      >
        <el-row>
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'dayNo',type: 1,label: '每日配送趟数',tagAttrs: {placeholder: '请输入配送趟数'},kind: 'number'}"
          />
          <div
            v-for="item in ruleForm['dayNo']"
            :key="item"
          >
            <SelfItem
              :rule-form="ruleForm"
              :params="{prop: 'lineDeliveryInfoFORMS',type: 2,label: '预计工作时间',placeholder: '请选择时间',kind: 'daterange'}"
            />
          </div>

          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'monthNo',type: 1,label: '预计月出车天数',tagAttrs: {placeholder: '请输入月出车天数'},kind: 'number'}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'incomeSettlementMethod',type: 3,label: '结算方式',radio: [{label: '整车',type: 1},{label: '多点配',type: 2}]}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'settlementDays',type: 5,label: '结算天数',tagAttrs: {placeholder: '请输入结算天数'},options: dayOver}"
          />

          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'shipperOffer',type: 1,label: '预计货主月报价',kind: 'number',tagAttrs: {placeholder: '请输入货主月报价'}}"
          />

          <SelfItem
            v-if="ruleForm['incomeSettlementMethod'] === 1"
            :rule-form="ruleForm"
            :params="{prop: 'everyTripGuaranteed',type: 1,label: '货主单趟报价',placeholder: '请输入单趟报价',kind: 'number'}"
          />
          <SelfItem
            v-if="ruleForm['incomeSettlementMethod'] === 2"
            :rule-form="ruleForm"
            :params="{prop: 'everyTripGuaranteed',type: 1,label: '每趟保底（元）',placeholder: '请输入每趟保底',kind: 'number'}"
          />
          <SelfItem
            v-if="ruleForm['incomeSettlementMethod'] === 2"
            :rule-form="ruleForm"
            :params="{prop: 'everyUnitPrice',type: 1,label: '每趟提成单价（元）',placeholder: '请输入每趟提成',kind: 'number'}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :pccol="12"
            :params="{prop: 'settlementCycle',type: 3,label: '结算周期',radio: settlement}"
          />
        </el-row>
      </SectionContainer>
      <SectionContainer
        title="货物信息"
        :md="true"
      >
        <el-row>
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'cargoType',type: 5,label: '货物类型',placeholder: '请选择货物类型',options: goodsType}"
          />
          <SelfItem
            :pccol="12"
            :rule-form="ruleForm"
            :params="{prop: 'goodsWeight',type: 3,label: '货物总重量',radio: goodsWeight}"
          />
          <SelfItem
            :pccol="8"
            :rule-form="ruleForm"
            :params="{prop: 'carry',type: 3,label: '是否需要搬运',radio: [{label: '是',type: 1},{label: '否',type: 2}]}"
          />
          <SelfItem
            v-if="ruleForm['carry'] === 1"
            :pccol="12"
            :rule-form="ruleForm"
            :params="{prop: 'handlingDifficultyDegree',type: 3,label: '装卸难度',radio: difficulty}"
          />
        </el-row>
      </SectionContainer>
      <SectionContainer
        title="线路角色"
        :md="true"
      >
        <el-row>
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'lineSaleId',type: 5,label: '所属销售',placeholder: '请选择所属销售',options: [{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶'
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }]}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'lineSaleId',type: 1,label: '线路打分',placeholder: '请输入'}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'lineSaleId',type: 1,label: '线路角色',placeholder: '请输入'}"
          />
        </el-row>
      </SectionContainer>

      <div class="btn_box">
        <el-button
          v-if="pageStatus === 1"
          type="primary"
          name="CreatLine-btn-creat"
          @click="submitForm('ruleForm')"
        >
          立即创建
        </el-button>
        <el-button
          v-if="pageStatus === 2"
          type="primary"
          name="CreatLine-btn-creat"
          @click="againForm('ruleForm')"
        >
          重新提交
        </el-button>
        <el-button
          v-if="pageStatus === 3"
          type="primary"
          name="CreatLine-btn-creat"
          @click="copyForm('ruleForm')"
        >
          提交
        </el-button>

        <el-button
          name="CreatLine-btn-cancel"
          @click="cancelBtn"
        >
          取消
        </el-button>

        <el-button
          v-if="pageStatus === 1"
          name="CreatLine-btn-reset"
          @click="resetForm('ruleForm')"
        >
          重置
        </el-button>
        <el-button
          v-if="pageStatus === 1"
          name="CreatLine-btn-xcxshow"
          @click="resetForm('ruleForm')"
        >
          小程序预览
        </el-button>
      </div>

      <Dialog
        :visible.sync="showDio"
        :title="`取消提交`"
        :center="true"
        :cancel="picCancel"
        :confirm="picConfirm"
      >
        <div>
          <div class="dioBox">
            线路未提交，是否放弃编辑？
          </div>
        </div>
      </Dialog>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Form as ElForm, Input } from 'element-ui'
import Dialog from '@/components/Dialog/index.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import { GetDictionaryList } from '@/api/common'
import { createLine, editLine } from '@/api/cargo'
import DetailItem from '@/components/DetailItem/index.vue'
import SectionContainer from '@/components/SectionContainer/index.vue'
import SelfItem from '@/components/base/SelfItem.vue'
import '@/styles/common.scss'
@Component({
  name: 'CreatLine',
  components: {
    SelfItem,
    SectionContainer,
    Dialog
  }
})
export default class CreatLine extends Vue {
  private lineType:any[] = []
  private carType:any[] = []
  private linetask:any[] =[]
  private settlement:any[] = []
  private dayOver:any[] = []
  private goodsWeight:any[] = []
  private goodsType:any[] = []
  private difficulty:any[] = []
  private pageStatus:number = 0
  private pccol:number=6
  private lineId:string = ''
  private showDio:boolean = false
  private customerOptions:any[] = [
    {
      label: 'liweishan',
      value: 'HX202007080001'
    },
    {
      label: 'zed',
      value: 'HX202007080002'
    }
  ]
  private ruleForm:any = {
    'cityArea': 110100,
    'countyArea': 110105,
    'districtArea': '北京八城666',
    'provinceArea': 110000,
    'auditState': 1,
    'busiType': 0,
    'carType': 1,
    'cargoType': 1,
    'carry': 2,
    'city': 110100,
    'customerId': 'HX202007080001',
    'dayNo': 5,
    'deliveryNo': 6,
    'deliveryWeekCycle': '1,2,3',
    'deployNo': 20,
    'deployNoChangeReason': 0,
    'distance': 20,
    'everyTripGuaranteed': 100,
    'everyUnitPrice': 80,
    'goodsWeight': 2,
    'handlingDifficultyDegree': 3,
    'incomeSettlementMethod': 1,
    'lineName': '自行车配送666',
    'lineRank': 86,
    'lineSaleId': 48,
    'lineType': 1,
    'monthNo': 10,
    'remark': '线路备注6666',
    'returnBill': 1,
    'returnWarehouse': 1,
    'settlementCycle': 2,
    'settlementDays': 3,
    'shelvesState': 1,
    'shipperOffer': 1000,
    'stabilityRate': 1,
    'volume': 10,
    'waitDirveValidity': '1595692800000',
    'warehouseCity': 110000,
    'warehouseCounty': 110105,
    'warehouseDistrict': '仓库详细位置666',
    'warehouseProvince': 110100,
    'lineDeliveryInfoFORMS': [{
      'workingTimeStart': '00:00',
      'workingTimeEnd': '00:30'
    }, {
      'workingTimeStart': '01:45',
      'workingTimeEnd': '03:15'
    }, {
      'workingTimeStart': '02:45',
      'workingTimeEnd': '03:30'
    }, {
      'workingTimeStart': '03:45',
      'workingTimeEnd': '04:45'
    }],
    'warehouseTown': '110105110000'
  }
  // private ruleForm:any = {
  //   carType: '',
  //   // 选择车型
  //   cargoType: '',
  //   // 货物类型
  //   carry: '',
  //   // 是否搬运（是 2否）
  //   city: '',
  //   // 城市（已开通业务的）
  //   cityArea: '',
  //   // 配送区域-市
  //   countyArea: '',
  //   // 配送区域-区、县
  //   customerId: '',
  //   // 货主编号id
  //   dayNo: '',
  //   // 每日配送趟数
  //   deliveryNo: '',
  //   // 预计每日平均配送点位数
  //   deliveryWeekCycle: '',
  //   // 配送周期(周一至周日对应数字拼接)
  //   deployNo: '',
  //   // 可上车数量
  //   deployNoChangeReason: '',
  //   // 可上车数变化原因
  //   distance: '',
  //   // 预计每日平均总里程（公里）
  //   districtArea: '',
  //   // 具体配送区域范围
  //   everyTripGuaranteed: '',
  //   // 每趟保底、货主单趟报价(元)
  //   everyUnitPrice: '0',
  //   // 每趟提成(元)
  //   goodsWeight: '',
  //   // 总货物重量(: T以下 2: -3T 3: 3-5T 4: 5T以上)
  //   handlingDifficultyDegree: '0',
  //   // 装卸难度
  //   incomeSettlementMethod: '',
  //   // 收入结算方式：:传站 2:多点配
  //   lineDeliveryInfoFORMS: [],
  //   // 配送时间
  //   lineId: '',
  //   // 线路id
  //   lineName: '',
  //   // 内部使用线路名称
  //   lineSaleId: '',
  //   // 线路销售id
  //   lineType: '',
  //   // 线路类型(:供给性线路 2：替换型线路)、
  //   monthNo: '',
  //   // 预计月出车天数、
  //   provinceArea: '',
  //   // 配送区域-省
  //   remark: '',
  //   // 备注信息/线路描述
  //   returnBill: '',
  //   // 是否需要回单（是 2否）
  //   returnWarehouse: '',
  //   // 是否需要返仓（是 2否）
  //   settlementCycle: '',
  //   // 结算周期（：现结 2：周结 3：半月结 4：月结 5：季度结）
  //   settlementDays: '',
  //   // 结算天数（：7天 2：0天 3：5天 4：30天 5：45天 6：60天 7：90天）
  //   shipperOffer: '',
  //   // 预计货主月报价(元)
  //   stabilityRate: '',
  //   // 线路稳定性（：一个月内（不稳定） 2：两个月内（不稳定） 3：2-4个月（一般稳定） 4：4个月以上（很稳定））
  //   volume: '',
  //   // 预计每件货物总体积
  //   waitDirveValidity: '',
  //   // 等待上车有效期
  //   warehouseCity: '',
  //   // 仓位置-市
  //   warehouseCounty: '',
  //   // 仓位置-区、县
  //   warehouseDistrict: '',
  //   // 仓位置-详细地址
  //   warehouseProvince: '',
  //   // 仓位置-省
  //   warehouseTown: ''
  //   // 仓位置-乡镇、街道
  // }
  private rules:any = {
    customerId: [
      { required: true, message: '货主不能为空', trigger: 'blur' }
    ],
    lineName: [
      { required: true, message: '线路名称不能为空', trigger: 'blur' },
      { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
    ],
    lineType: [
      { required: true, message: '线路类型不能为空', trigger: 'change' }
    ],
    deployNo: [
      { required: true, message: '可上车数不能为空', trigger: 'change' }
    ],
    cangweizhi: [
      { required: true, message: '仓位置不能为空', trigger: 'change' }
    ],
    waitDirveValidity: [
      { required: true, message: '等待上车有效期不能为空', trigger: 'change' }
    ],
    stabilityRate: [
      { required: true, message: '线路稳定性不能为空', trigger: 'change' }
    ],
    carType: [
      { required: true, message: '车型不能为空', trigger: 'change' }
    ],
    peisong: [
      { required: true, message: '请选择活动资源', trigger: 'change' }
    ],
    returnWarehouse: [
      { required: true, message: '请选择是否返单', trigger: 'change' }
    ],
    returnBill: [
      { required: true, message: '请选择是否回单', trigger: 'change' }
    ],
    deliveryNo: [
      { required: true, message: '请选择活动资源', trigger: 'change' }
    ],
    distance: [
      { required: true, message: '公里数不能为空', trigger: 'change' }
    ],
    dayNo: [
      { required: true, message: '每日配送趟数不能为空', trigger: 'change' }
    ],
    // lineDeliveryInfoFORMS: [
    //   { required: true, message: '工作时间不能为空', trigger: 'change' }
    // ],
    monthNo: [
      { required: true, message: '出车天数不能为空', trigger: 'change' }
    ],
    incomeSettlementMethod: [
      { required: true, message: '结算方式不能为空', trigger: 'change' }
    ],
    settlementCycle: [
      { required: true, message: '结算周期不能为空', trigger: 'change' }
    ],
    settlementDays: [
      { required: true, message: '结算天数不能为空', trigger: 'change' }
    ],
    everyTripGuaranteed: [
      { required: true, message: '单趟价格不能为空', trigger: 'change' }
    ],
    shipperOffer: [
      { required: true, message: '预计货主月报价不能为空', trigger: 'change' }
    ],
    everyUnitPrice: [
      { required: true, message: '提成单价不能为空', trigger: 'change' }
    ],
    cargoType: [
      { required: true, message: '货物类型不能为空', trigger: 'change' }
    ],
    goodsWeight: [
      { required: true, message: '货物总重量', trigger: 'change' }
    ],
    carry: [
      { required: true, message: '是否搬运不能为空', trigger: 'change' }
    ]
  }

  @Watch('ruleForm', { deep: true })
  private changeRuleForm(value:any) {
    console.log(value.songnum)
  }

  // 再次提交编辑
  private async againForm(formName:any) {
    (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        console.log(this.ruleForm)
        // alert('submit!')
        let { data } = await editLine({ ...this.ruleForm, ...{ lineId: this.lineId } })
        if (data.success) {
          console.log(data.data)
          this.$message.success('线路已提交成功')
          this.$router.go(-1)
        } else {
          this.$message.error(data.errorMsg)
        }
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  // 复制线路
  private async copyForm(formName:any) {
    (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.createdLine(this.ruleForm)
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  // 新建
  private submitForm(formName:any) {
    (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        console.log(this.ruleForm)
        this.createdLine(this.ruleForm)
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  private async createdLine(params:any) {
    let { data } = await createLine(params)
    if (data.success) {
      console.log(data.data)
      this.$message.success('线路创建成功')
      this.$router.go(-1)
    } else {
      this.$message.error(data.errorMsg)
    }
  }

  private resetForm(formName:any) {
    (this.$refs[formName] as ElForm).resetFields()
  }

  private picCancel(done: any) {
    done()
  }
  private picConfirm(done: any) {
    done(this.$router.go(-1))
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  private async GetDictionaryAll() {
    let dictArr = ['Intentional_compartment', 'type_of_goods', 'line_distinguished_type', 'linetask_stability_rate', 'line_type', 'settlement_cycle', 'settlement_days', 'goods_weight', 'handling_difficulty_degree']
    let { data } = await GetDictionaryList(dictArr)
    if (data.success) {
      // eslint-disable-next-line camelcase
      let { Intentional_compartment, type_of_goods, line_distinguished_type, linetask_stability_rate, line_type, settlement_cycle, settlement_days, goods_weight, handling_difficulty_degree } = data.data
      let linetype = line_type.map(function(ele:any) {
        return { type: Number(ele.dictValue), label: ele.dictLabel }
      })
      // eslint-disable-next-line camelcase
      let carType = Intentional_compartment.map(function(ele:any) {
        return { value: Number(ele.dictValue), label: ele.dictLabel }
      })
      let linetask = linetask_stability_rate.map(function(ele:any) {
        return { type: Number(ele.dictValue), label: ele.dictLabel }
      })
      let settlement = settlement_cycle.map(function(ele:any) {
        return { type: Number(ele.dictValue), label: ele.dictLabel }
      })
      let dayOver = settlement_days.map(function(ele:any) {
        return { value: Number(ele.dictValue), label: ele.dictLabel }
      })
      let goodsWeight = goods_weight.map(function(ele:any) {
        return { type: Number(ele.dictValue), label: ele.dictLabel }
      })
      let goodsType = type_of_goods.map(function(ele:any) {
        return { value: Number(ele.dictValue), label: ele.dictLabel }
      })
      let difficulty = handling_difficulty_degree.map(function(ele:any) {
        return { type: Number(ele.dictValue), label: ele.dictLabel }
      })

      this.lineType = linetype
      this.carType = carType
      this.linetask = linetask
      this.settlement = settlement
      this.dayOver = dayOver
      this.goodsWeight = goodsWeight
      this.goodsType = goodsType
      this.difficulty = difficulty
    } else {
      this.$message.error(data)
    }
  }

  private cancelBtn() {
    let routeArr = this.$route.path.split('/')
    if (routeArr[2] === 'creatline') {
      this.showDio = true
    } else {
      this.$router.go(-1)
    }
  }

  private fetchData() {
    this.GetDictionaryAll()
  }
  created() {
    this.fetchData()
    let routeArr = this.$route.path.split('/')
    if (routeArr[2] === 'creatline') {
      this.pageStatus = 1
    } else if (routeArr[2] === 'lineedit') {
      this.lineId = (this.$route.query.id) as string
      this.pageStatus = 2
    } else if (routeArr[2] === 'linecopy') {
      this.lineId = (this.$route.query.id) as string
      this.pageStatus = 3
    }
  }
}
</script>
<style lang="scss" scoped>
.CreatLine {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .btn-content{
    color: #4a4a4a;
    font-weight: 400;
  }
  .btn_box{
    padding-top: 40px;
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
}
</style>
<style lang="scss" scoped>
.CreatLine-m {
  width: 100%;
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
}
</style>
<style lang="scss" scoped>
@media screen and (min-width: 701px) {
  .SelfItem .el-select {
    width: 100%;
  }
  .SelfItem  .el-input, .el-date-editor, .el-textarea {
    width: 75%;
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
    width: 90%;
  }
}
</style>
