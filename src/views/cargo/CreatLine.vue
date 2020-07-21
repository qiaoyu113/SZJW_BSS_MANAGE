<template>
  <div
    :class="isPC ? 'CreatLine' : 'CreatLine-m'"
    :offer="offer"
  >
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
            :params="{prop: 'customerId',type: 5,label: '货主名称',tagAttrs: {
              clearable: true,
              filterable: true,remote: true,reserveKeyword: true,remoteMethod: remoteMethod,loading: loading,
              placeholder: '请输入选择货主',filterable: true,
              disabled: this.$route.path.split('/')[2] === 'creatline' ? false :true},options: customerOptions}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'lineName',type: 1,label: '内部使用线路名称',
                      tagAttrs: {
                        placeholder: '名称应具有辨识度',
                        maxlength: 10,
                        showWordLimit: true,
                        clearable: true
                      }}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'deployNo',type: 1,label: '可上车数',kind: 'number',tagAttrs: {placeholder: '请输入可上车数',min: 0,max: 11,clearable: true}}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'lineType',type: 3,label: '线路类型',radio: lineType}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'waitDirveValidity',type: 2,label: '等待上车有效期（天）',tagAttrs: {
              placeholder: '请输入有效期',
              'picker-options': {
                disabledDate(time) {
                  return (time.getTime() < Date.now() || time.getTime() > Date.now() + 41 * 86400000 )
                }
              }
            }}"
          />

          <SelfItem
            :rule-form="ruleForm"
            :pccol="8"
            :params="{prop: 'address',type: 8,label: '仓位置',tagAttrs: {
              placeholder: '请选择仓位置',
              'default-expanded-keys': true,
              'default-checked-keys': true,
              'node-key': 'warehouseProvince',
              props: {
                lazy: true,
                lazyLoad: loadAddress
              }}}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'warehouseDistrict',type: 1,label: '仓位置详细地址',tagAttrs: {placeholder: '请输入仓位置详细地址',
                                                                                    maxlength: 20,
                                                                                    showWordLimit: true,
                                                                                    clearable: true}}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :pccol="16"
            :params="{prop: 'stabilityRate',type: 3,label: '线路稳定性',radio: linetask}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'remark',type: 1,label: '备注信息/线路描述',kind: 'textarea',tagAttrs: {maxlength:
              500, row: 6, showWordLimit: true,placeholder: '请输入备注信息或线路描述'}}"
          />
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
          <SelfItem
            :rule-form="ruleForm"
            :pccol="8"
            :params="{prop: 'delivery',type: 8,label: '配送区域',
                      tagAttrs: {
                        placeholder: '请选择配送区域',
                        'default-expanded-keys': true,
                        'default-checked-keys': true,
                        'node-key': 'provinceArea',
                        props: {
                          lazy: true,
                          lazyLoad: loadhouseAddress
                        }}}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'districtArea',type: 1,label: '配送区域详细地址',tagAttrs: {placeholder: '请输入配送区域详细地址',
                                                                                maxlength: 20,
                                                                                showWordLimit: true,
                                                                                clearable: true}}"
          />
        </el-row>
      </SectionContainer>
      <SectionContainer
        title="结算信息"
        :md="true"
      >
        <el-row>
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'dayNo',type: 1,label: '每日配送趟数',tagAttrs: {placeholder: '每日配送趟数不能超过6次',maxlength: 6},kind: 'number'}"
          />
          <div
            v-if="ruleForm['dayNo'] > 0"
          >
            <SelfItem
              v-for="(item,idx) in Number(ruleForm['dayNo'])"
              :key="item"
              :rule-form="ruleForm"
              :params="{prop: `lineDeliveryInfoFORMS${idx}`,type: 7,label: '预计工作时间',placeholder: '请选择时间',required: true}"
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
            v-if="ruleForm['incomeSettlementMethod']"
            :rule-form="ruleForm"
            :params="{prop: 'shipperOffer',type: 1,label: '预计货主月报价',kind: 'number',tagAttrs: {placeholder: '请输入货主月报价',disabled: NoshipperOffer}}"
          />

          <SelfItem
            v-if="ruleForm['incomeSettlementMethod'] === 1"
            :rule-form="ruleForm"
            :params="{prop: 'everyTripGuaranteed',type: 1,label: '货主单趟报价',kind: 'number',tagAttrs: {placeholder: '请输入单趟报价'}}"
          />
          <SelfItem
            v-if="ruleForm['incomeSettlementMethod'] === 2"
            :rule-form="ruleForm"
            :params="{prop: 'everyTripGuaranteed',type: 1,label: '每趟保底（元）',kind: 'number',tagAttrs: {placeholder: '请输入每趟保底'}}"
          />
          <SelfItem
            v-if="ruleForm['incomeSettlementMethod'] === 2"
            :rule-form="ruleForm"
            :params="{prop: 'everyUnitPrice',type: 1,label: '每趟提成单价（元）',kind: 'number',tagAttrs: {placeholder: '请输入每趟提成',min: 0,max: 2000,type: number}}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :pccol="12"
            :params="{prop: 'settlementCycle',type: 3,label: '结算周期',radio: settlement}"
          />
          <SelfItem
            v-if="ruleForm['stabilityRate'] >= 3"
            :pccol="16"
            :rule-form="ruleForm"
            :params="{prop: 'deliveryWeekCycle',type: 6,label: '配送周期',options: WeekCycleList,tagAttrs: {},listeners: {
              change: checkBoxChange
            }}"
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
            :params="{prop: 'lineSaleId',type: 5,label: '所属销售',
                      tagAttrs: {placeholder: '请选择所属销售',disabled: lineSaleIdState,filterable: true},options: optionsSale}"
          />
          <!-- <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'lineSaleId',type: 1,label: '线路打分',placeholder: '请输入'}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'lineSaleId',type: 1,label: '线路角色',placeholder: '请输入'}"
          /> -->
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
        <!-- <el-button
          v-if="pageStatus === 1"
          name="CreatLine-btn-xcxshow"
          @click="resetForm('ruleForm')"
        >
          小程序预览
        </el-button> -->
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
import { GetDictionaryList, GetCityByCode, detailCity, GetJoinManageList } from '@/api/common'
import { createLine, editLine, customerCheckNames, GetLineDetail } from '@/api/cargo'
import { GetReginByCityCode } from '@/api/transport'
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
  private lineSaleIdState:boolean = true
  private optionsSale:any[] = []
  private lineSaleId:string = ''
  private loading:boolean = false
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
  private NoshipperOffer:boolean = false
  private customerOptions:any[] = []
  private WeekCycleList:any[] = [
    { label: '全部', type: '' },
    { label: '周一', type: '1' },
    { label: '周二', type: '2' },
    { label: '周三', type: '3' },
    { label: '周四', type: '4' },
    { label: '周五', type: '5' },
    { label: '周六', type: '6' },
    { label: '周日', type: '7' }
  ]
  private ruleForm:any = {
    carType: '',
    // 选择车型
    cargoType: '',
    // 货物类型
    carry: '',
    // 是否搬运（是 2否）
    city: '',
    // 城市（已开通业务的）
    cityArea: '',
    // 配送区域-市
    countyArea: '',
    // 配送区域-区、县
    customerId: '',
    // 货主编号id
    // 配送位置
    delivery: [],
    // 仓位置
    address: [],
    dayNo: '',
    // 每日配送趟数
    deliveryNo: '',
    // 预计每日平均配送点位数
    deliveryWeekCycle: [],
    // 配送周期(周一至周日对应数字拼接)
    deployNo: '',
    // 可上车数量
    deployNoChangeReason: '',
    // 可上车数变化原因
    distance: '',
    // 预计每日平均总里程（公里）
    districtArea: '',
    // 具体配送区域范围
    everyTripGuaranteed: '',
    // 每趟保底、货主单趟报价(元)
    everyUnitPrice: '',
    // 每趟提成(元)
    goodsWeight: '',
    // 总货物重量(: T以下 2: -3T 3: 3-5T 4: 5T以上)
    handlingDifficultyDegree: 0,
    // 装卸难度
    incomeSettlementMethod: '',
    // 收入结算方式：:传站 2:多点配
    lineDeliveryInfoFORMS: [],
    // 配送时间
    lineId: '',
    // 线路id
    lineName: '',
    // 内部使用线路名称
    lineSaleId: '',
    // 线路销售id
    lineType: '',
    // 线路类型(:供给性线路 2：替换型线路)、
    monthNo: '',
    // 预计月出车天数、
    provinceArea: '',
    // 配送区域-省
    remark: '',
    // 备注信息/线路描述
    returnBill: '',
    // 是否需要回单（是 2否）
    returnWarehouse: '',
    // 是否需要返仓（是 2否）
    settlementCycle: '',
    // 结算周期（：现结 2：周结 3：半月结 4：月结 5：季度结）
    settlementDays: '',
    // 结算天数（：7天 2：0天 3：5天 4：30天 5：45天 6：60天 7：90天）
    shipperOffer: '',
    // 预计货主月报价(元)
    stabilityRate: '',
    // 线路稳定性（：一个月内（不稳定） 2：两个月内（不稳定） 3：2-4个月（一般稳定） 4：4个月以上（很稳定））
    volume: '',
    // 预计每件货物总体积
    waitDirveValidity: '',
    // 等待上车有效期
    warehouseCity: '',
    // 仓位置-市
    warehouseCounty: '',
    // 仓位置-区、县
    warehouseDistrict: '',
    // 仓位置-详细地址
    warehouseProvince: '',
    // 仓位置-省
    warehouseTown: ''
    // 仓位置-乡镇、街道
  }
  private rules:any = {
    customerId: [
      { required: true, message: '货主不能为空', trigger: 'blur' }
    ],
    lineName: [
      { required: true, message: '线路名称不能为空', trigger: 'blur' },
      { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
      { validator: this.validator(0, 11) }
    ],
    lineType: [
      { required: true, message: '线路类型不能为空', trigger: 'change' }
    ],
    deployNo: [
      { required: true, message: '可上车数不能为空', trigger: 'change' },
      { validator: this.validator(0, 11) }
    ],
    address: [
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
    delivery: [
      { required: true, message: '请选择配送区域', trigger: 'change' }
    ],
    districtArea: [
      { required: true, message: '请选择配送区域详细地址', trigger: 'change' }
    ],
    returnWarehouse: [
      { required: true, message: '请选择是否返单', trigger: 'change' }
    ],
    returnBill: [
      { required: true, message: '请选择是否回单', trigger: 'change' }
    ],
    deliveryNo: [
      { required: true, message: '每日平均配送点位数不能为空', trigger: 'change' },
      { validator: this.validator(0, 100) }
    ],
    deliveryWeekCycle: [
      { required: true, message: '配送周期不能为空', trigger: 'change' }
    ],
    distance: [
      { required: true, message: '公里数不能为空', trigger: 'change' },
      { validator: this.validator(0, 2000) }
    ],
    dayNo: [
      { required: true, message: '每日配送趟数不能为空', trigger: 'change' },
      { validator: this.validator(0, 6) }
    ],
    // lineDeliveryInfoFORMS: [
    //   { required: true, message: '工作时间不能为空', trigger: 'change' }
    // ],
    monthNo: [
      { required: true, message: '出车天数不能为空', trigger: 'change' },
      { validator: this.validator(0, 32) }
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
      { required: true, message: '单趟价格不能为空', trigger: 'change' },
      { validator: this.validator(0, 2000) }
    ],
    shipperOffer: [
      { required: true, message: '预计货主月报价不能为空', trigger: 'change' },
      { validator: this.validator(0, 100000) }
    ],
    everyUnitPrice: [
      { required: true, message: '提成单价不能为空', trigger: 'change' },
      { min: 0, max: 2000, message: '提成区间在0-2000之间', trigger: 'change' },
      { validator: this.validator(0, 2000) }
    ],
    cargoType: [
      { required: true, message: '货物类型不能为空', trigger: 'change' }
    ],
    goodsWeight: [
      { required: true, message: '货物总重量', trigger: 'change' }
    ],
    carry: [
      { required: true, message: '是否搬运不能为空', trigger: 'change' }
    ],
    lineSaleId: [
      { required: true, message: '所属销售不能为空', trigger: 'change' }
    ],
    warehouseDistrict: [ // 详细仓位置
      { required: true, message: '详细地址不能为空', trigger: 'change' }
    ]
  }

  // 数字校验
  validator(c:number, d:number) {
    return function sizeDeliveryNo(rule:any, value:any, callback:Function) {
      if (Number(value) < c || Number(value) > d) {
        return callback(new Error(`请输入${c}-${d}之间的数字`))
      }
      callback()
    }
  }

  private pickerDisabled(time:any) {
    return time.getTime() > Date.now()
  }

  private async loadAddress(node:any, resolve:any) {
    let params:string[] = []
    let query:any = {
      countryCode: ''
    }
    if (node.level === 0) {
      params = ['100000']
    } else if (node.level === 1) {
      params = ['100000']
      params.push(node.value)
    } else if (node.level === 2) {
      params = ['100000']
      params.push(node.parent.value)
      params.push(node.value)
    } else if (node.level === 3) {
      query.countryCode = node.value
    }
    try {
      if (node.level < 3) {
        let nodes = await this.loadCityByCode(params)
        resolve(nodes)
      } else if (node.level === 3) {
        let nodes = await this.cityDeyail(query)
        resolve(nodes)
      }
    } catch (err) {
      resolve([])
    }
  }

  private async deArr(params:string[]) {
    try {
      let { data: res } = await GetCityByCode(params)
      if (res.success) {
        const nodes = res.data.map(function(item:any) {
          return {
            value: item.code,
            label: item.name,
            leaf: params.length > 2
          }
        })
        return nodes
      }
    } catch (err) {
      console.log(`load city by code fail:${err}`)
    }
  }

  async loadCityByCode(params:any) {
    try {
      let { data: res } = await GetCityByCode(params)
      if (res.success) {
        const nodes = res.data.map(function(item:any) {
          return {
            value: item.code,
            label: item.name,
            leaf: false
          }
        })
        return nodes
      }
    } catch (err) {
      console.log(`load city by code fail:${err}`)
    }
  }

  async cityDeyail(params:string[]) {
    let { data: city } = await detailCity(params)
    if (city.success) {
      const nodes = city.data.map(function(item:any) {
        return {
          value: item.code,
          label: item.name,
          leaf: true
        }
      })
      return nodes
    }
  }

  get offer() {
    if (this.ruleForm.incomeSettlementMethod === 1) {
      this.ruleForm.shipperOffer = Number(this.ruleForm.dayNo) * Number(this.ruleForm.monthNo) * Number(this.ruleForm.everyTripGuaranteed)
      return true
    } else {
      // this.ruleForm.shipperOffer = ''
      return true
    }
  }

  @Watch('ruleForm.dayNo')
  private dayNoChange(val:any, oldVal:any) {
    if (val > 6) {
      this.ruleForm.dayNo = ''
    }
    for (let j = 0; j < Number(oldVal); j++) {
      delete this.ruleForm['lineDeliveryInfoFORMS' + j]
    }
    for (let i = 0; i < val; i++) {
      this.$set(this.ruleForm, 'lineDeliveryInfoFORMS' + i, {
        workingTimeStart: '', workingTimeEnd: ''
      })
      this.rules['lineDeliveryInfoFORMS' + i] = [
        { required: true, message: '工作时间不能为空', trigger: 'blur' }
      ]
    }
  }

  @Watch('ruleForm.customerId')
  private customerIdChange(val:any) {
    if (this.pageStatus === 1) {
      let lineSaleId = JSON.parse(val).lineSaleId
      if (lineSaleId) {
        this.lineSaleId = lineSaleId
        this.ruleForm.lineSaleId = lineSaleId
      }
    }
  }

  @Watch('ruleForm.incomeSettlementMethod')
  private changeRuleForm(value:any) {
    if (value === 1) {
      // this.ruleForm.everyUnitPrice = ''
      this.NoshipperOffer = true
      // this.ruleForm.shipperOffer = ''
    } else {
      // this.ruleForm.everyUnitPrice = ''
      this.NoshipperOffer = false
      // this.ruleForm.shipperOffer = ''
    }
  }

  // 配送周期
  @Watch('ruleForm.stabilityRate')
  private changeStability(value:any) {
    if (value < 3) {
      this.ruleForm.deliveryWeekCycle = []
    }
  }

  // 可上车数
  @Watch('ruleForm.deployNo')
  private changeDeployNo(value:any) {
    if (value > 11 || value < 0) {
      this.ruleForm.deployNo = ''
      this.$message.info('可上车数必须大于0小于11')
    }
  }

  private checkBoxChange() {
    if (this.ruleForm.deliveryWeekCycle && this.ruleForm.deliveryWeekCycle.includes('')) {
      this.ruleForm.deliveryWeekCycle = this.WeekCycleList.map(item => item.type)
    }
  }

  private async remoteMethod(query: any) {
    if (query !== '') {
      this.loading = true
      let { data } = await customerCheckNames({ customerCompanyName: query })
      if (data.success) {
        let customerOptions = data.data.map(function(ele:any) {
          return { value: JSON.stringify(ele), label: ele.customerCompanyName }
        })
        this.customerOptions = customerOptions
        this.loading = false
      } else {
        this.$message.error(data.data.errorMsg)
      }
    } else {
      this.customerOptions = []
    }
  }

  // 再次提交编辑
  private async againForm(formName:any) {
    (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        let ruleForm = { ...this.ruleForm }
        if (ruleForm.everyUnitPrice === '') {
          ruleForm.everyUnitPrice = 0
        }
        for (let i = 0; i < ruleForm.dayNo; i++) {
          ruleForm.lineDeliveryInfoFORMS.push(ruleForm['lineDeliveryInfoFORMS' + i])
        }
        for (let i = 0; i < ruleForm.dayNo; i++) {
          delete ruleForm['lineDeliveryInfoFORMS' + i]
        }
        if (ruleForm.address.length !== 0) {
          ruleForm.warehouseProvince = ruleForm.address[0]
          ruleForm.warehouseCity = ruleForm.address[1]
          ruleForm.warehouseCounty = ruleForm.address[2]
          ruleForm.warehouseTown = ruleForm.address[3]
        }
        if (ruleForm.delivery.length !== 0) {
          ruleForm.provinceArea = ruleForm.delivery[0]
          ruleForm.cityArea = ruleForm.delivery[1]
          ruleForm.countyArea = ruleForm.delivery[2]
        }
        if (ruleForm.deliveryWeekCycle.indexOf('') > -1) {
          let deliveryWeekCycle = ruleForm.deliveryWeekCycle.filter(function(ele:any) {
            return ele !== ''
          })
          ruleForm.deliveryWeekCycle = deliveryWeekCycle.join(',')
        } else {
          ruleForm.deliveryWeekCycle = this.ruleForm.deliveryWeekCycle.join(',')
        }
        if (ruleForm.deliveryWeekCycle.length === 0) {
          ruleForm.deliveryWeekCycle = ''
        }
        // alert('submit!')
        let { data } = await editLine({ ...ruleForm, ...{ lineId: this.lineId } })
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
    this.dealData(formName, 2)
  }

  // 新建
  private submitForm(formName:any) {
    this.dealData(formName, 1)
  }

  // 保存数据处理
  private dealData(formName:any, type:number) {
    (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        let ruleForm = { ...this.ruleForm }
        if (type === 1) {
          ruleForm.customerId = JSON.parse(ruleForm.customerId).customerId
        }
        if (ruleForm.everyUnitPrice === '') {
          ruleForm.everyUnitPrice = 0
        }
        for (let i = 0; i < ruleForm.dayNo; i++) {
          ruleForm.lineDeliveryInfoFORMS.push(ruleForm['lineDeliveryInfoFORMS' + i])
        }
        if (ruleForm.delivery.length !== 0) {
          ruleForm.provinceArea = ruleForm.delivery[0]
          ruleForm.cityArea = ruleForm.delivery[1]
          ruleForm.countyArea = ruleForm.delivery[2]
        }
        if (ruleForm.address.length !== 0) {
          ruleForm.warehouseProvince = ruleForm.address[0]
          ruleForm.warehouseCity = ruleForm.address[1]
          ruleForm.warehouseCounty = ruleForm.address[2]
          ruleForm.warehouseTown = ruleForm.address[3]
        }
        if (ruleForm.deliveryWeekCycle.indexOf('') > -1) {
          let deliveryWeekCycle = ruleForm.deliveryWeekCycle.filter(function(ele:any) {
            return ele !== ''
          })
          ruleForm.deliveryWeekCycle = deliveryWeekCycle.join(',')
        } else {
          ruleForm.deliveryWeekCycle = this.ruleForm.deliveryWeekCycle.join(',')
        }
        if (ruleForm.deliveryWeekCycle.length === 0) {
          ruleForm.deliveryWeekCycle = ''
        }
        this.createdLine(ruleForm)
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  private async createdLine(params:any) {
    let { data } = await createLine(params)
    if (data.success) {
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
    this.getLowerStaffInfo()
  }

  private async getLowerStaffInfo() {
    try {
      let { data: res } = await GetJoinManageList({})
      if (res.success) {
        if (res.data.length > 1) {
          this.lineSaleIdState = false
        } else {
          this.lineSaleIdState = true
        }
        this.optionsSale = res.data.map(function(ele:any) {
          return { value: Number(ele.id), label: ele.name }
        })
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
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

  private async loadhouseAddress(node:any, resolve:any) {
    let params:string[] = []
    if (node.level === 0) {
      params = ['100000']
    } else if (node.level === 1) {
      params = ['100000']
      params.push(node.value)
    } else if (node.level === 2) {
      params = ['100000']
      params.push(node.parent.value)
      params.push(node.value)
    }
    try {
      let nodes = await this.deArr(params)
      resolve(nodes)
    } catch (err) {
      resolve([])
    }
  }

  private fetchData() {
    this.GetDictionaryAll()
  }

  private async getDetail(id:string) {
    let { data } = await GetLineDetail({ lineId: id })
    if (data.success) {
      let allParams = data.data
      if (allParams.deliveryWeekCycle === '') {
        allParams.deliveryWeekCycle = []
      } else {
        allParams.deliveryWeekCycle = allParams.deliveryWeekCycle.split(',')
        if (allParams.deliveryWeekCycle.length === 7) {
          allParams.deliveryWeekCycle = ['', '1', '2', '3', '4', '5', '6', '7']
        }
      }
      allParams.address = []
      allParams.delivery = []
      // 仓位置
      allParams.address.push(allParams.warehouseProvince + '')
      allParams.address.push(allParams.warehouseCity + '')
      allParams.address.push(allParams.warehouseCounty + '')
      allParams.address.push(Number(allParams.warehouseTown))
      // 配送区域
      allParams.delivery.push(allParams.provinceArea + '')
      allParams.delivery.push(allParams.cityArea + '')
      allParams.delivery.push(allParams.countyArea + '')

      this.customerOptions = [{ value: allParams.customerId, label: allParams.bussinessName }]
      this.ruleForm = { ...this.ruleForm, ...allParams }

      setTimeout(() => {
        for (let i = 0; i < Number(allParams.dayNo); i++) {
          this.$set(this.ruleForm, 'lineDeliveryInfoFORMS' + i, {
            workingTimeStart: allParams.lineDeliveryInfoFORMS[i].workingTimeStart, workingTimeEnd: allParams.lineDeliveryInfoFORMS[i].workingTimeEnd
          })
        }
      }, 20)
    } else {
      this.$message.error(data)
    }
  }

  created() {
    this.fetchData()
    let routeArr = this.$route.path.split('/')
    if (routeArr[2] === 'creatline') {
      this.pageStatus = 1
    } else if (routeArr[2] === 'lineedit') {
      this.lineId = (this.$route.query.id) as string
      this.pageStatus = 2
      this.getDetail(this.lineId)
    } else if (routeArr[2] === 'linecopy') {
      this.lineId = (this.$route.query.id) as string
      this.pageStatus = 3
      this.getDetail(this.lineId)
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
<style scoped>
.CreatLine >>> .el-cascader{
  width: 100%;
}
@media screen and (min-width: 701px) {
  .SelfItem .el-select {
    width: 100%;
  }
  .SelfItem  .el-input, .el-date-editor, .el-textarea {
    width: 75%;
  }
  .el-cascader{
   width: 100%;
  }
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
