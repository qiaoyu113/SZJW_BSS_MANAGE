<template>
  <div :class="isPC ? 'CreatTransport' : 'CreatTransport-m'">
    <div class="creatBox">
      <h1 class="pageTitle">
        创建运力
      </h1>
      <p class="pageWord">
        为签约司机创建运力，运力即为该签约司机下可以承担货运任务的人和车，可以为每个运力撮合标书上岗。
      </p>
      <div class="creatInfo">
        <div class="stepsBox">
          <el-steps :active="activeCreat">
            <el-step
              title="选择签约司机和订单"
            />
            <el-step
              title="确认运力信息"
            />
            <el-step
              title="完成"
            />
          </el-steps>
        </div>
        <template v-if="activeCreat === 1">
          <div class="chooseBox">
            <div
              class="creatPhone"
              @click="confession"
            >
              <span class="phoneLabel">签约司机姓名（手机号）:</span>
              <el-select
                ref="elInput"
                v-model="phoneNum"
                :remote-method="remoteMethod"
                :loading="loading"
                filterable
                remote
                reserve-keyword
                placeholder="请输入司机姓名或完整手机号"
                @change="getOrderList"
                @focus="confession"
              >
                <el-option
                  v-for="item in driverOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <span
              v-if="chooseOrderState"
              class="orderLabel"
            >请选择签约订单 :</span>
          </div>
          <div
            v-if="chooseOrderState"
            class="orderBox"
          >
            <el-row
              style="width:100%"
            >
              <el-col
                v-for="(item, index) in orderList"
                :key="index"
                :span="isPC ? 6 : 24"
              >
                <div
                  class="boxItem"
                >
                  <i :class="( index ) === activeItem ? 'el-icon-star-on' : 'el-icon-star-off'" />
                  <div
                    :class=" item.flag ? 'orderItem' : 'orderItemNo'"
                    @click="orderGet(index,item)"
                  >
                    <span class="orderNum">订单编号：{{ item.orderInfo.orderId }}</span>
                    <span>商品分类：{{ item.orderInfo.busiTypeName }}</span>
                    <span v-if="item.orderInfo.cooperationModel === 1">合作模式：购车</span>
                    <span v-else-if="item.orderInfo.cooperationModel === 2">合作模式：租车</span>
                    <span v-else-if="item.orderInfo.cooperationModel === 3">合作模式：带车</span>
                    <span>合作车型：{{ item.orderInfo.cooperationCarName }}</span>
                    <div class="goDetail">
                      <span>订单金额：￥{{ item.orderInfo.goodsAmount }}</span>
                      <span
                        style="margin-left:20px"
                        @click="goOrderDetail(item.orderInfo.orderId)"
                      >详情></span>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <el-button
            class="nextBtn"
            type="primary"
            style="margin-top:40px"
            @click="nextChoose"
          >
            下一步
          </el-button>
        </template>
        <template v-if="activeCreat === 2">
          <div class="orderForm">
            <SectionContainer
              title="基础信息（必填项）"
              :md="true"
            >
              <self-form
                ref="CreatTransport"
                :list-query="orderInfo"
                :form-item="formItem"
                label-width="100px"
                :rules="rules"
                @onPass="handlePassClick"
              />
            </SectionContainer>
            <SectionContainer
              title="基础信息（非必填项）"
              :md="true"
            >
              <self-form
                v-if="showAddress"
                :list-query="orderInfo"
                :form-item="formItemOther"
                label-width="140px"
                :rules="rules"
              />
            </SectionContainer>
          </div>
          <div class="btnGroup">
            <el-button
              v-if="isEditor"
              @click="backChoose"
            >
              上一步
            </el-button>
            <el-button
              type="primary"
              @click="sureSubmit"
            >
              确定
            </el-button>
          </div>
        </template>
        <template v-if="activeCreat === 3">
          <div class="creatOver">
            <i
              class="el-icon-success icon"
              color="#52c41a"
            />
            <span class="successText">成功创建</span>
            <div>
              <el-button
                type="primary"
                @click="backAgain"
              >
                再次创建
              </el-button>
              <el-button

                @click="backRouter"
              >
                返回运力列表
              </el-button>
            </div>
          </div>
        </template>
      </div>
      <div
        v-if="activeCreat === 1"
        class="textInfo"
      >
        <p class="textTitle">
          说明
        </p>
        <div>
          <p class="textTitle">
            选择签约司机
          </p>
          <p class="textWord">
            为该签约司机创建可以承担货运任务的运力
          </p>
        </div>
        <div>
          <p class="textTitle">
            选择签约订单
          </p>
          <p class="textWord">
            绑定订单和运力，该运力的跑活情况收到订单影响
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SectionContainer from '@/components/SectionContainer/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { saveCarrierInfo, transportOrderList, transportOrderDetail, driverList } from '@/api/transport'
import { GetDictionary, GetDictionaryList, GetOpenCityData, GetManagerLists, GetCityByCode } from '@/api/common'
import '@/styles/common.scss'
import { validatorNumberRange } from '@/utils/index.ts'

  interface IState {
    [key: string]: any;
  }

  @Component({
    name: 'TransportList',
    components: {
      SectionContainer,
      SelfForm
    }
  })

export default class extends Vue {
  private pagestate:boolean = false
  private carrierId:string = ''
  private canClick:boolean = false
  private IntentionalCompartment:any[] =[]
  private dayWork:any[] =[]
  private expectedMonthlyIncome:any[] =[]
  private typeGoods:any[] =[]
  private driverId:string = ''
  private orderId:string = ''
  private driverOptions:any[] = []
  private chooseOrderState:boolean = false
  private isHasOrder:boolean = false
  private isEditor:boolean = true
  private activeCreat:number = 1
  private activeItem:number | null = null
  private phoneNum:string = ''
  private orderType:number = 0
  private loading:boolean = false
  private list:any[] = []
  private orderList:any[] = []
  private phoneList:any[] =[]
  private orderInfo:any = {
    carType: '',
    // 车型
    gmId: '',
    // 运营经理
    name: '',
    // 运力姓名
    phone: '',
    // 联系方式
    plateNo: '',
    // 车牌号
    workCity: '',
    // 工作城市
    orderId: '',
    // 所选的订单号
    driverId: '',
    // 所属司机id

    // -------------
    status: null,
    // 运力状态
    carrierId: null,
    // 运力id有此字段为修改运力信息
    age: null,
    // 司机年龄
    householdType: null,
    // 户口类型，1农村2城镇
    workExperience: null,
    // 货物运输经验（月）
    cargoType: null,
    // 配送货物类型
    homeCity: null,
    // 家庭住址-市
    homeCounty: null,
    // 家庭住址-区县
    homeDistrict: null,
    // 家庭住址-具体区域
    homeProvince: null,
    address: [],
    // 家庭住址-省
    expMonthlyIncome: null,
    // 期望月收入
    avgMonthlyIncome: null,
    // 平均月收入
    isIndebted: null,
    // 是否存在贷款，1是2否
    maxWorkTime: null,
    // 可接受一天工作时长
    remarks: null
    // 备注

  }
  private formItem:any[] = [
    {
      type: 1,
      label: '姓名',
      key: 'name',
      tagAttrs: {
        showWordLimit: true,
        placeholder: '请输入姓名',
        maxlength: 10,
        clearable: true
      }
    },
    {
      type: 1,
      label: '联系方式',
      key: 'phone',
      tagAttrs: {
        showWordLimit: true,
        placeholder: '请输入联系方式',
        maxlength: '11'
      }
    },
    {
      type: 2,
      key: 'workCity',
      label: '工作城市',
      tagAttrs: {
        placeholder: '请选择城市'
      },
      options: []
    },
    {
      type: 1,
      label: '车牌号',
      key: 'plateNo',
      tagAttrs: {
        placeholder: '请输入车牌号'
      }
    },
    {
      type: 2,
      key: 'carType',
      label: '车型',
      tagAttrs: {
        placeholder: '请选择车型'
      },
      options: []
    },
    {
      type: 2,
      key: 'gmId',
      label: '运营经理',
      tagAttrs: {
        placeholder: '请选择运营经理'
      },
      options: []
    }
  ]
  private formItemOther:any[] = [
    {
      type: 1,
      label: '司机年龄',
      key: 'age',
      tagAttrs: {
        placeholder: '请输入司机年龄',
        type: 'number'
      }
    },
    {
      type: 2,
      key: 'householdType',
      label: '户口类型',
      tagAttrs: {
        placeholder: '请选择户口类型'
      },
      options: [
        {
          label: '农村户口',
          value: '1'
        },
        {
          label: '城镇户口',
          value: '2'
        }
      ]
    },
    {
      type: 1,
      label: '货物运输经验（月）',
      key: 'workExperience',
      tagAttrs: {
        placeholder: '请输入货物运输经验',
        type: 'number'
      }
    },
    {
      type: 8,
      label: '家庭住址',
      key: 'address',
      tagAttrs: {
        placeholder: '请输入家庭住址',
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'homeProvince',
        props: {
          lazy: true,
          lazyLoad: this.loadhouseAddress
        }
      }
    },
    {
      type: 2,
      key: 'cargoType',
      label: '配送货物类型',
      tagAttrs: {
        placeholder: '请选择配送货物类型'
      },
      options: []
    },
    {
      type: 2,
      key: 'expMonthlyIncome',
      label: '期望月收入',
      tagAttrs: {
        placeholder: '请选择期望月收入'
      },
      options: []
    },
    {
      type: 1,
      label: '平均月收入',
      key: 'avgMonthlyIncome',
      tagAttrs: {
        placeholder: '请输入平均月收入'
      }
    },
    {
      type: 2,
      key: 'isIndebted',
      label: '是否存在还贷款',
      tagAttrs: {
        placeholder: '请选择是否存在还贷款'
      },
      options: [
        {
          label: '否',
          value: 2
        },
        {
          label: '是',
          value: 1
        }
      ]
    },
    {
      type: 2,
      key: 'maxWorkTime',
      label: '可接受一天工作时长',
      tagAttrs: {
        placeholder: '请选择可接受一天工作时长'
      },
      options: []
    },
    {
      type: 1,
      label: '备注',
      key: 'remarks',
      col: 12,
      tagAttrs: {
        placeholder: '请输入备注（最多可填100字）',
        type: 'textarea',
        rows: 4,
        maxlength: 100,
        row: 6,
        showWordLimit: true
      }
    }
  ]
  private rules:IState = {
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入电话', trigger: 'blur' },
      { validator: this.checkPhone, trigger: 'blur' }
    ],
    workCity: [
      { required: true, message: '请选择工作城市', trigger: 'change' }
    ],
    plateNo: [
      { required: true, message: '请输入车牌号', trigger: 'change' }
    ],
    carType: [
      { required: true, message: '请选择车型', trigger: 'change' }
    ],
    gmId: [
      { required: true, message: '请选择运营经理', trigger: 'change' }
    ],
    age: [
      { validator: this.checkAge, trigger: 'blur' }
    ],
    workExperience: [
      { validator: validatorNumberRange(1, 500) }
    ],
    avgMonthlyIncome: [
      { validator: validatorNumberRange(1, 25000) }
    ]
  }

  // 自定义效验方法
  private checkAge(rule:any, value:any, callback:Function) {
    if (value < 18) {
      callback(new Error('必须年满18岁'))
    } else if (value > 100) {
      callback(new Error('请输入100以内的数字'))
    } else {
      callback()
    }
  }

  private checkPhone(rule:any, value:any, callback:any) {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
      callback(new Error('手机号码不符合规范，请重新输入'))
    } else {
      callback()
    }
  }

  @Watch('orderInfo.phone')
  changePhone(val:string) {
    this.phoneList.map(ele => {
      if (ele.driverId === this.driverId) {
        if (String(val) === String(ele.phone)) {
          this.orderInfo = { ...this.orderInfo, ...ele }
        }
      }
    })
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
      let nodes = await this.loadCityByCode(params)
      resolve(nodes)
    } catch (err) {
      resolve([])
    }
  }

  // 地址级联选择器 回显问题
  get showAddress() {
    if (this.carrierId) {
      if (this.orderInfo.address.length > 0) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  private async loadCityByCode(params:string[]) {
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

  private nextChoose() {
    if (this.phoneNum === '') {
      this.$message.error('请填写手机号码或者司机姓名')
      return
    }
    if (this.orderList.length === 0) {
      this.$message.error('暂无订单')
      return
    }
    if (this.activeItem === null) {
      this.$message.error('请选择订单')
      return
    }
    if (!this.isHasOrder) {
      return this.$message.error('该司机目前没有创建订单，暂无法创建运力')
    }
    this.activeCreat = 2
  }

  private backChoose() {
    this.activeCreat = 1
  }
  private backAgain() {
    this.isEditor = true
    this.activeCreat = 1
    this.pagestate = false
    this.phoneNum = ''
    this.activeItem = null
    this.chooseOrderState = false
    this.driverOptions = []
    this.orderInfo = {
      carType: '',
      // 车型
      gmId: '',
      // 运营经理
      name: '',
      // 运力姓名
      phone: '',
      // 联系方式
      plateNo: '',
      // 车牌号
      workCity: '',
      // 工作城市
      orderId: '',
      // 所选的订单号
      driverId: '',
      // 所属司机id

      // -------------
      status: null,
      // 运力状态
      carrierId: null,
      // 运力id有此字段为修改运力信息
      age: null,
      // 司机年龄
      householdType: null,
      // 户口类型，1农村2城镇
      workExperience: null,
      // 货物运输经验（月）
      cargoType: null,
      // 配送货物类型
      homeCity: null,
      // 家庭住址-市
      homeCounty: null,
      // 家庭住址-区县
      homeDistrict: null,
      // 家庭住址-具体区域
      homeProvince: null,
      address: [],
      // 家庭住址-省
      expMonthlyIncome: null,
      // 期望月收入
      avgMonthlyIncome: null,
      // 平均月收入
      isIndebted: null,
      // 是否存在贷款，1是2否
      maxWorkTime: null,
      // 可接受一天工作时长
      remarks: null
    // 备注
    }
  }
  private backRouter() {
    this.$router.push('transportlist')
  }
  private sureSubmit() {
    ((this.$refs.CreatTransport) as any).submitForm()
  }
  private async handlePassClick(val:boolean) {
    if (val) {
      if (!this.pagestate) {
        this.orderInfo.orderId = this.orderId
        this.orderInfo.driverId = this.driverId
      }
      if (this.orderInfo.address.length !== 0) {
        this.orderInfo.homeProvince = this.orderInfo.address[0]
        this.orderInfo.homeCity = this.orderInfo.address[1]
        this.orderInfo.homeCounty = this.orderInfo.address[2]
      }
      let { data } = await saveCarrierInfo(this.orderInfo)
      if (data.success) {
        if (data.data.flag) {
          this.activeCreat = 3
        } else {
          this.$message.error(data.data.msg)
        }
      } else {
        this.$message.error(data)
      }
    }
  }

  // 搜索司机列表
  private async remoteMethod(query: any) {
    if (query !== '') {
      this.loading = true
      let { data } = await driverList({ key: query })
      if (data.success) {
        this.phoneList = data.data
        let driverOptions = data.data.map(function(ele:any) {
          return { value: ele.driverId, label: `${ele.name}(${ele.phone})` }
        })
        this.driverOptions = driverOptions
        this.loading = false
      } else {
        this.$message.error(data.data.errorMsg)
      }
    } else {
      this.driverOptions = []
    }
  }

  // 兼容IOS
  private confession() {
    console.log(123, this.$refs)
    let u = navigator.userAgent
    if (u.indexOf('iPhone') > -1) { // ios手机
      (this.$refs['elInput'] as any).focus()// 显示键盘
    }
  }

  private async getDictionaryAll() {
    let params = ['Intentional_compartment', 'type_of_goods', 'expected_monthly_income', 'accept_one_day_of_work']
    let { data } = await GetDictionaryList(params)
    if (data.success) {
      // eslint-disable-next-line camelcase
      let { Intentional_compartment, type_of_goods, expected_monthly_income, accept_one_day_of_work } = data.data
      let cartype = Intentional_compartment.map(function(ele:any) {
        return { value: Number(ele.dictValue), label: ele.dictLabel }
      })
      let goods = type_of_goods.map(function(ele:any) {
        return { value: Number(ele.dictValue), label: ele.dictLabel }
      })
      let monthly = expected_monthly_income.map(function(ele:any) {
        return { value: Number(ele.dictValue), label: ele.dictLabel }
      })
      let daywork = accept_one_day_of_work.map(function(ele:any) {
        return { value: Number(ele.dictValue), label: ele.dictLabel }
      })
      // eslint-disable-next-line camelcase
      this.IntentionalCompartment = cartype
      this.dayWork = daywork
      this.expectedMonthlyIncome = monthly
      this.typeGoods = goods
      this.formItem.map(ele => {
        if (ele.key === 'carType') {
          ele.options = cartype
        }
      })
      this.formItemOther.map(ele => {
        if (ele.key === 'cargoType') {
          ele.options = goods
        }
        if (ele.key === 'expMonthlyIncome') {
          ele.options = monthly
        }
        if (ele.key === 'maxWorkTime') {
          ele.options = daywork
        }
      })
    } else {
      this.$message.error(data)
    }
    let city = await GetOpenCityData()
    if (city.data.success) {
      let arr = city.data.data.map(function(ele:any) {
        return { value: Number(ele.code), label: ele.name }
      })
      this.formItem.map(ele => {
        if (ele.key === 'workCity') {
          ele.options = arr
        }
      })
    } else {
      this.$message.error(data)
    }
    let paramurl:any = {
      uri: '/v1/carrier/saveCarrierInfo'
    }
    let manager = await GetManagerLists(paramurl)
    if (manager.data.success) {
      let arr = manager.data.data.map(function(ele:any) {
        return { value: Number(ele.id), label: ele.name }
      })
      this.formItem.map(ele => {
        if (ele.key === 'gmId') {
          ele.options = arr
        }
      })
    } else {
      this.$message.error(data)
    }
  }

  private orderGet(index:number, ele:any) {
    this.orderId = ele.orderInfo.orderId
    if (!ele.flag) {
      return this.$message.error('当前订单配额达到上限或者未交付')
    } else {
      this.isHasOrder = true
      this.activeItem = index
    }
  }

  private async getOrderList(val:any) {
    this.driverId = val
    let { data: res } = await transportOrderList({ driverId: val })
    if (res.success) {
      this.orderList = res.data

      if (this.orderList.length === 0) {
        this.chooseOrderState = false
      } else {
        this.chooseOrderState = true
      }
    } else {
      this.$message.error(res.errorMsg)
    }
  }

  private goOrderDetail(id:string) {
    this.$router.push({ path: '/join/orderdetail', query: { id: id } })
  }

  private fetchData() {
    this.getDictionaryAll()
  }

  private async getCarrierDetail(carrierId:string) {
    let { data } = await transportOrderDetail({ carrierId: carrierId })
    if (data.success) {
      this.activeCreat = 2
      let orderInfo = data.data

      for (let ele in orderInfo) {
        if (orderInfo[ele] === 0) {
          orderInfo[ele] = ''
        }
      }
      this.orderInfo = { ...this.orderInfo, ...orderInfo }
      this.orderInfo.address.push(this.orderInfo.homeProvince + '')
      this.orderInfo.address.push(this.orderInfo.homeCity + '')
      this.orderInfo.address.push(this.orderInfo.homeCounty + '')
    } else {
      this.$message.error(data.data.errorMsg)
    }
  }

  mounted() {
    this.fetchData()
    let carrierId = this.$route.query.carrierId as string
    this.carrierId = carrierId
    if (carrierId) {
      this.pagestate = true
      this.isEditor = false
      this.activeCreat = 2
      this.orderInfo.carrierId = carrierId
      this.getCarrierDetail(carrierId)
    } else {
      let driverId = this.$route.query.id as string
      let name = this.$route.query.name as string
      let phone = this.$route.query.phone as string
      this.pagestate = false
      this.isEditor = true
      this.activeCreat = 1
      if (driverId) {
        let optionItem = {
          label: `${name}(${phone})`,
          value: driverId
        }
        this.driverOptions.push(optionItem)
        this.phoneNum = driverId
        this.getOrderList(driverId)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.CreatTransport{
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  .creatBox{
    background-color: white;
    border-radius: 5px;
    padding: 30px 50px;
    box-sizing: border-box;
    .pageTitle{
      font-size: 18px;
      color: #4A4A4A;
      padding: 0;
      margin: 0;
    }
    .pageWord{
      font-size: 14px;
      color: #4A4A4A;
    }
    .creatInfo{
      border-bottom: 1px solid #ebebeb;
      .stepsBox{
        width: 100%;
      }
      padding:  30px 50px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      .chooseBox{
        margin-top: 60px;
        .creatPhone{
          display: flex;
          align-items: center;
          justify-content: center;
          .phoneLabel{
              display: block;
              width: 160px;
              text-align: right;
              color: #595959;
              margin-right: 10px;
              font-size: 14px;
            }
            .el-select{
              width: 600px;
            }
          }
        }
        .orderLabel{
          margin: 30px 0;
          display: block;
          width: 160px;
          text-align: right;
          color: #595959;
          margin-right: 10px;
        }
      .orderBox{
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        .boxItem{
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
          .orderItem{
            cursor: pointer;
            margin-left: 20px;
            border: 1px solid #648be7;
            padding: 10px 20px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            font-size: 14px;
            color: #140303;
            span{
              margin-bottom: 10px;
            }
            .goDetail{
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .orderNum{
              font-weight: bold;
              color: black;
            }
          }
          .orderItemNo{
            cursor: pointer;
            margin-left: 20px;
            border: 1px solid #bdcdf1;
            padding: 10px 20px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            font-size: 14px;
            color: #c4c4c4;
            span{
              margin-bottom: 10px;
            }
            .goDetail{
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .orderNum{
              font-weight: bold;
              color: #c4c4c4;
            }
          }
          .orderItem:last-child{
            margin-bottom: 0;
          }
          .orderItemNo:last-child{
            margin-bottom: 0;
          }
        }
      }
    }
    .textInfo{
      margin-top: 40px;
      .textTitle{
        font-weight: bold;
        font-size: 14px;
        color: #8d8d8d;
      }
      .textWord{
        color: #a0a0a0;
        font-size: 14px;
      }
    }
  }
  .orderForm{
    padding: 30px 0;
  }
  .btnGroup{
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }
  .creatOver{
    width: 100%;
    height: calc( 100vh - 400px );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .successText{
      font-weight: bold;
      font-size: 24px;
      margin: 40px 0;
    }
    .icon{
      font-size: 60px;
      color: #52c41a;
    }
  }
}
</style>
<style lang="scss" scoped>
.CreatTransport-m{
  .pageTitle{
    padding: 0 20px;
    font-size: 16px;
  }
  .pageWord{
    padding: 0 20px;
    font-size: 14px;
    line-height: 16px;
  }
  .creatInfo{
    display: flex;
    flex-direction: column;
    .stepsBox{
      font-size: 12px;
      padding: 20px;
      box-sizing: border-box;
    }
    .chooseBox{
      padding: 0 20px;
      box-sizing: border-box;
    }
    .nextBtn{
      width: 80%;
      margin-top: 20px!important;
      margin: 20px auto;
    }
    .creatPhone{
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: 12px;
      margin:20px 0;
      .el-select{
        flex: .6;
      }
      span{
        flex: .4;
      }
    }
    .orderBox .el-row{
      margin-top: 10px;
      max-height: 40vh;
      overflow-y: scroll;
      .boxItem{
        padding: 0 30px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        .orderItem{
          cursor: pointer;
          width: 100%;
          margin-left: 10px;
          border: 1px solid #648be7;
          padding: 5px 10px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          font-size: 12px;
          color: #140303;
          span{
              margin-bottom: 10px;
            }
          .goDetail{
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .orderNum{
              font-weight: bold;
              color: black;
            }
        }
        .orderItemNo{
            width: 100%;
            margin-left: 10px;
            border: 1px solid #bdcdf1;
            padding: 5px 10px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            font-size: 12px;
            color: #c4c4c4;
            span{
              margin-bottom: 10px;
            }
            .goDetail{
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .orderNum{
              font-weight: bold;
              color: black;
            }
          }
          .orderItem:last-child{
            margin-bottom: 0;
          }
          .orderItemNo:last-child{
            margin-bottom: 0;
          }
      }
    }
  }
.textInfo{
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 14px;
  }
  .btnGroup{
    margin-top: 10px;
    width: 100%;
    text-align: center;
    .el-button + .el-button {
        margin-left: 0px;
    }
    .el-button{
      width: 80%;
      margin-bottom: 10px;
    }
  }
  .creatOver{
    width: 100%;
    height: calc( 100vh - 400px );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .successText{
      font-weight: bold;
      font-size: 24px;
      margin: 40px 0;
    }
    .icon{
      font-size: 60px;
      color: #52c41a;
    }
  }
}
</style>
