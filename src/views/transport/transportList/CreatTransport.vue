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
            <div class="creatPhone">
              <span class="phoneLabel">签约司机姓名（手机号）:</span>
              <!-- <el-input
                v-model="phoneNum"
                placeholder="请输入司机姓名或手机号"
              /> -->
              <el-select
                v-model="phoneNum"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="item in options"
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
            <el-row>
              <el-col
                v-for="index in 9"
                :key="index"
                :span="6"
              >
                <div

                  class="boxItem"
                >
                  <i :class="( index ) === activeItem ? 'el-icon-star-on' : 'el-icon-star-off'" />
                  <div
                    class="orderItem"
                    @click="() => {
                      activeItem = index
                    }"
                  >
                    <span class="orderNum">订单编号：DSADASDSA5313</span>
                    <span>商品分类：梧桐共享</span>
                    <span>合作模式：带车</span>
                    <span>合作车型：4.2米厢货</span>
                    <div class="goDetail">
                      <span>订单金额：￥4000.00</span>
                      <span>详情></span>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- <div class="boxItem">
              <i class="el-icon-star-off" />
              <div class="orderItem">
                <span class="orderNum">订单编号：DSADASDSA5313</span>
                <span>商品分类：梧桐共享</span>
                <span>合作模式：带车</span>
                <span>合作车型：4.2米厢货</span>
                <div class="goDetail">
                  <span>订单金额：￥4000.00</span>
                  <span>详情></span>
                </div>
              </div>
            </div>
            <div class="boxItem">
              <i class="el-icon-star-off" />
              <div class="orderItem">
                <span class="orderNum">订单编号：DSADASDSA5313</span>
                <span>商品分类：梧桐共享</span>
                <span>合作模式：带车</span>
                <span>合作车型：4.2米厢货</span>
                <div class="goDetail">
                  <span>订单金额：￥4000.00</span>
                  <span>详情></span>
                </div>
              </div>
            </div> -->
          </div>
          <el-button
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
            绑定订单和运力，改运力的炮火情况收到订单影响
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SectionContainer from '@/components/SectionContainer/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'
import { saveCarrierInfo, transportOrderList } from '@/api/transport'
import { GetDictionary, GetDictionaryList, GetDictionaryAll } from '@/api/common'
import '@/styles/common.scss'

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
  private chooseOrderState:boolean = false
  private isEditor:boolean = true
  private activeCreat:number = 1
  private activeItem:number = 0
  private phoneNum:string = ''
  private orderType:number = 0
  private loading:boolean = false
  private options:any[] = []
  private list:any[] = []
  private orderList:any[] = []
  private states:any[] = [
    'Alabama', 'Alaska', 'Arizona',
    'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida',
    'Georgia', 'Hawaii', 'Idaho', 'Illinois',
    'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana',
    'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas',
    'Utah', 'Vermont', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin',
    'Wyoming'
  ]
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
        maxlength: '10'
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
      options: [
        {
          label: '58同城',
          value: '5'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
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
      options: [
        {
          label: '58同城',
          value: '5'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
    },
    {
      type: 2,
      key: 'gmId',
      label: '运营经理',
      tagAttrs: {
        placeholder: '请选择运营经理'
      },
      options: [
        {
          label: '58同城',
          value: '5'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
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
      type: 1,
      label: '家庭住址',
      key: 'age',
      tagAttrs: {
        placeholder: '请输入司机年龄'
      }
    },
    {
      type: 2,
      key: 'cargoType',
      label: '配送货物类型',
      tagAttrs: {
        placeholder: '请选择配送货物类型'
      },
      options: [
        {
          label: '58同城',
          value: '58'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
    },
    {
      type: 2,
      key: 'expMonthlyIncome',
      label: '期望月收入',
      tagAttrs: {
        placeholder: '请选择期望月收入'
      },
      options: [
        {
          label: '58同城',
          value: '58'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
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
          value: '2'
        },
        {
          label: '是',
          value: '1'
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
      options: [
        {
          label: '6小时',
          value: '1'
        },
        {
          label: '8小时',
          value: '2'
        },
        {
          label: '10小时',
          value: '3'
        },
        {
          label: '12小时',
          value: '4'
        }
      ]
    },
    {
      type: 1,
      label: '备注',
      key: 'remarks',
      col: 12,
      tagAttrs: {
        placeholder: '请输入备注（最多可填100字）',
        type: 'textarea',
        rows: 4
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
    ]
  }

  private checkPhone(rule:any, value:any, callback:any) {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
      callback(new Error('手机号码不符合规范，请重新输入'))
    } else {
      callback()
    }
  }

  private nextChoose() {
    if (this.phoneNum === '') {
      this.$message.error('请填写手机号码或者司机姓名')
      return
    }
    if (!this.activeItem) {
      this.$message.error('请选择订单')
      return
    }
    // var phone = this.phoneNum
    // if (!(/^1[3456789]\d{9}$/.test(phone))) {
    //   this.$message.error('手机号码有误，请重填')
    //   return false
    // }
    this.activeCreat = 2
  }

  private backChoose() {
    this.activeCreat = 1
  }
  private backAgain() {
    this.activeCreat = 1
  }
  private backRouter() {
    this.$router.push('transportlist')
  }
  private sureSubmit() {
    ((this.$refs.CreatTransport) as any).submitForm()
  }
  private async handlePassClick(val:boolean) {
    if (val) {
      for (var k in this.orderInfo) {
        if (this.orderInfo[k] === null) {
          delete this.orderInfo[k]
        }
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

  private remoteMethod(query:any) {
    if (query !== '') {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.options = this.list.filter(item => {
          return item.label.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
      }, 200)
    } else {
      this.options = []
    }
  }

  private async getDictionary() {
    const { data } = await GetDictionary({ dictType: 'online_city' })
    if (data.success) {
      this.formItem.map(ele => {
        if (ele.key === 'workCity') {
          let list:any[] = data.data
          ele.options = list.map(item => {
            return { label: item.code, value: item.codeVal }
          })
        }
      })
    } else {
      this.$message.error(data)
    }
  }

  private async getDictionaryAll() {
    let params:string[] = ['']
    const { data } = await GetDictionaryAll(params)
  }

  private async getOrderList() {
    let { data } = await transportOrderList({ dirverId: 'SJ202007131003' })
    if (data.success) {
      this.chooseOrderState = true
      console.log(data)
    } else {
      this.$message.error(data)
    }
  }

  private fetchData() {
    this.getDictionaryAll()
    this.getOrderList()
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // activated() {
  //   this.fetchData()
  //   let driverId = this.$route.query.driverId
  //   let orderId = this.$route.query.orderId
  //   if (driverId && orderId) {
  //     this.isEditor = false
  //     this.activeCreat = 2
  //     // this.phoneNum = driverId as string
  //   } else {
  //     this.isEditor = true
  //     this.activeCreat = 1
  //   }
  //   this.list = this.states.map(item => {
  //     return { value: `value:${item}`, label: `label:${item}` }
  //   })
  // }

  created() {
    this.fetchData()
    let driverId = this.$route.query.driverId
    let orderId = this.$route.query.orderId
    if (driverId && orderId) {
      this.isEditor = false
      this.activeCreat = 2
      // this.phoneNum = driverId as string
    } else {
      this.isEditor = true
      this.activeCreat = 1
    }
    this.list = this.states.map(item => {
      return { value: `value:${item}`, label: `label:${item}` }
    })
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
            border: 1px solid #DCDFE6;
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
              color: black;
            }
          }
          .orderItem:last-child{
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
