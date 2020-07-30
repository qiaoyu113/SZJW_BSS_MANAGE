<template>
  <div
    :class="isPC ? 'interview' : 'interview-m'"
    :style="{
      padding: isPC ? '15px' :'0px'
    }"
  >
    <el-card shadow="never">
      <div
        slot="header"
        class="header"
      >
        <div class="title_header">
          <span class="title_left_border" />
          <span class="name">面试信息表</span>
          <span
            v-if="listQuery.busiType === 0"
            class="tag"
          >专车</span>
          <span
            v-else-if="listQuery.busiType === 1"
            class="tag"
          >共享</span>
        </div>
        <div class="step">
          <el-steps
            :active="active"
            align-center
          >
            <el-step
              title="基本信息"
              icon="el-icon-edit-outline"
            />
            <el-step
              title="面试信息"
              icon="el-icon-s-custom"
            />
            <el-step
              title="面试完成"
              icon="el-icon-finished"
            />
          </el-steps>
        </div>
      </div>
      <!-- 基本信息 -->
      <template v-if="active === 0">
        <self-form
          ref="SelfForm"
          :list-query="listQuery"
          :form-item="formItem"
          label-width="100px"
          :pc-col="12"
          :rules="rules"
          @onPass="handlePassClick"
        >
          <template slot="btn">
            <el-col
              class="btn"
              :span="isPC ? 12 :24"
              :offset="isPC ? 6 :0"
            >
              <el-button
                style="width:100%;"
                type="primary"
                name="interview_next_btn"
                @click="handleNextClick"
              >
                下一步
              </el-button>
            </el-col>
          </template>
        </self-form>
      </template>
      <!-- 面试信息 -->
      <template v-else-if="active ===1">
        <special-interview
          v-if="String(listQuery.busiType) ==='0' && isShow"
          ref="specialInterview"
          :form="listQuery"
          :obj="form"
          @onFinish="handleStepFinish"
        />
        <share-interview
          v-else-if="String(listQuery.busiType) ==='1' && isShow"
          ref="shareInterview"
          :form="listQuery"
          :obj="form"
          @onFinish="handleStepFinish"
        />
        <div class="interviewInfo">
          <el-row>
            <el-col
              :span="8"
              :offset="2"
            >
              <el-button
                type="primary"
                class="inter_btn"
                name="interview_last_btn"
                @click.stop="handleLastStep"
              >
                上一步
              </el-button>
            </el-col>
            <el-col
              :span="8"
              :offset="2"
            >
              <el-button
                type="primary"
                class="inter_btn"
                name="interview_add_btn"
                @click="handleAddClick"
              >
                提交
              </el-button>
            </el-col>
          </el-row>
        </div>
      </template>
      <template v-else-if="active ===2">
        <div class="interviewFinish">
          <div class="content">
            <i class="el-icon-success" />
            <h4>面试已完成</h4>
          </div>
          <el-row>
            <el-col
              :span="isPC ? 8 :10"
              :offset="isPC ? 2 :1"
            >
              <el-button
                type="warning"
                class="finish_btn"
                name="interview_finish_btn"
                @click.stop="handleFinishClick"
              >
                完成
              </el-button>
            </el-col>
            <el-col
              :span="isPC ? 8 :10"
              :offset="isPC ? 2 :1"
            >
              <el-button
                v-permission="['/v1/order/createNewOrder']"
                type="primary"
                class="finish_btn"
                name="interview_createOrder_btn"
                @click="handleCreateOeder"
              >
                直接创建订单
              </el-button>
            </el-col>
          </el-row>
        </div>
      </template>
    </el-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { InterviewBasic, GetInterviewEditDetail, GetClueDetailByClueId } from '@/api/driver'
import { HandlePages } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'
import { GetOpenCityData, GetDictionaryList } from '@/api/common'
import { phoneReg } from '@/utils/index.ts'
import SpecialInterview from './components/specialInterview.vue'
import ShareInterview from './components/shareInterview.vue'
import { delayTime } from '@/settings'
import SectionContainer from '@/components/SectionContainer/index.vue'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'Interview',
  components: {
    SelfForm,
    SpecialInterview,
    ShareInterview,
    SectionContainer
  }
})
export default class extends Vue {
  private active:number = 0
  private listQuery:IState = {
    name: '',
    phone: '',
    workCity: '',
    carType: '',
    busiType: '',
    clueId: ''
  }
  private driverId = ''
  private form:any = {} // 编辑面试表单的时候获取的信息

  private formItem:any[] = [
    {
      type: 1,
      key: 'name',
      label: '姓名:',
      tagAttrs: {
        placeholder: '姓名',
        maxlength: 10,
        clearable: true
      }
    },
    {
      type: 1,
      key: 'phone',
      label: '电话:',
      tagAttrs: {
        placeholder: '电话',
        clearable: true
      }
    },
    {
      type: 2,
      key: 'workCity',
      label: '工作城市:',
      tagAttrs: {
        placeholder: '工作城市',
        filterable: true
      },
      options: []
    },
    {
      type: 2,
      key: 'carType',
      label: '车型:',
      tagAttrs: {
        placeholder: '车型',
        filterable: true
      },
      options: []
    }
  ]
  /**
   * 校验手机号
   */
  private validatePhone = (rule: any, value: string, callback: Function) => {
    if (!phoneReg.test(value)) {
      return callback(new Error('请输入正确的手机号'))
    }
    callback()
  }
  private rules:IState ={
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入电话', trigger: 'blur' },
      { validator: this.validatePhone, trigger: 'blur' }
    ],
    workCity: [
      { required: true, message: '请选择城市', trigger: 'change' }
    ],
    carType: [
      { required: true, message: '请选择车型', trigger: 'change' }
    ],
    busiType: [
      { required: true, message: '请选择业务类型', trigger: 'change' }
    ]
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  get isShow() {
    if (this.active === 1 || Object.keys(this.form).length > 0) {
      return true
    } else {
      return false
    }
  }

  mounted() {
    this.getBaseInfo()
    this.getOpenCitys()
    this.listQuery.clueId = (this.$route as any).query.id
    if (this.listQuery.clueId) {
      this.getClueDetailByClueId()
    } else {
      this.formItem.push({
        type: 2,
        tagAttrs: {
          placeholder: '请选择业务线'
        },
        label: '业务线',
        key: 'busiType',
        options: [
          {
            label: '专车',
            value: 0
          },
          {
            label: '共享',
            value: 1
          }
        ]
      })
    }
  }

  /**
   *获取司机线索信息
   */
  async getClueDetailByClueId() {
    try {
      let params = {
        clueId: this.listQuery.clueId
      }
      let { data: res } = await GetClueDetailByClueId(params)
      if (res.success) {
        this.listQuery.name = res.data.name
        this.listQuery.phone = res.data.phone
        this.listQuery.workCity = res.data.workCity + ''
        this.listQuery.carType = res.data.carType + ''
        this.listQuery.busiType = res.data.busiType
        if (res.data.existInterviewData) {
          this.getEditDetail()
        }
      }
    } catch (err) {
      console.log(`get clue detail fail:${err}`)
    }
  }
  /**
   *获取开通城市
   */
  async getOpenCitys() {
    try {
      let { data: res } = await GetOpenCityData()
      if (res.success) {
        this.formItem[2].options = res.data.map(function(item:any) {
          return {
            label: item.name,
            value: item.code
          }
        })
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get `)
    }
  }

  /**
   *获取面试编辑信息
   */
  async getEditDetail() {
    try {
      let params = {
        clueId: this.listQuery.clueId
      }
      let { data: res } = await GetInterviewEditDetail(params)
      if (res.success) {
        if (Object.keys(res.data).length > 0) {
          this.form = res.data
        }
      }
    } catch (err) {
      console.log(`get interview info fail:`, err)
    }
  }

  /**
   *获取基础信息
   */
  async getBaseInfo() {
    try {
      let params = ['Intentional_compartment']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        this.formItem[3].options = res.data.Intentional_compartment.map(function(item:any) {
          return { label: item.dictLabel, value: item.dictValue }
        })
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }
  /**
   * 下一步
   */
  handleNextClick() {
    ((this.$refs.SelfForm) as any).submitForm()
  }

  /**
   * 下一步表单验证通过
   */
  async handlePassClick(val:boolean) {
    try {
      let params = { ...this.listQuery }
      let { data: res } = await InterviewBasic(params)
      if (res.success) {
        if (res.data.allowNext) {
          this.active = 1
        } else {
          this.$message.error(res.data.msg)
        }
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`submit fail:${err}`)
    }
  }

  /**
   *上一步
   */
  handleLastStep() {
    this.active = 0
  }

  /**
   *提交
   */
  handleAddClick() {
    if (this.listQuery.busiType === 0) {
      (this.$refs.specialInterview as any).$refs.form.submitForm()
    } else if (this.listQuery.busiType === 1) {
      (this.$refs.shareInterview as any).$refs.form.submitForm()
    }
  }
  /**
   *填写金数据，提交成功
   */
  handleStepFinish(driverId:string) {
    this.active = 2
    this.driverId = driverId
  }
  /**
   *完成按钮
   */
  handleFinishClick() {
    setTimeout(() => {
      this.$router.push({
        path: '/transport/driverclue'
      })
    }, delayTime)
  }
  /**
   *直接创建订单
   */
  handleCreateOeder() {
    this.$router.push({
      path: '/join/creatorder',
      query: {
        driverId: this.driverId
      }
    })
  }
}
</script>
<style lang="scss">
  .interview {
   .header {
     .name {
       font-weight: bold;
     }
     .tag {
       margin-left:10px;
       padding: 2px 6px;
       background: $--color-primary;
       color:#ffffff;
       border-radius: 16px;
       font-size:12px;
    }
    .step {
      margin-top:20px;
      padding: 20px 10% 0px;
      border-top:1px solid #DADBE7;
    }
   }
   .inter_btn {
     margin-top:50px;
     width: 100%;
   }
   .interviewFinish {
     .content {
       padding: 50px 0px;
       text-align: center;
       .el-icon-success {
         color:#4CAF50;
         font-size:60px;
       }
       h4 {
         color:#000;
         font-weight: bold;
         font-size:18px;
       }
     }
     .finish_btn {
        width:100%;
     }
   }
   .el-step__title{
     font-size: 14px !important;
   }
  }
  .interview-m{
    .title_header{
      padding: 12px 8px;
      box-sizing: border-box;
      font-size: 15px;
      color: #4A4A4A;
    }
    .header {
     .name {
       font-weight: bold;
     }
     .tag {
       margin-left:10px;
       padding: 2px 6px;
       background: $--color-primary;
       color:#ffffff;
       border-radius: 16px;
       font-size:12px;
    }
    .step {
      padding: 20px 10% 10px;
      border-top: 2px solid #F8F9FA;
    }
   }
   .inter_btn {
     margin-top:50px;
     width: 100%;
   }
   .interviewFinish {
     .content {
       padding: 50px 0px;
       text-align: center;
       .el-icon-success {
         color:#4CAF50;
         font-size:60px;
       }
       h4 {
         color:#000;
         font-weight: bold;
         font-size:18px;
       }
     }
     .finish_btn {
        width:100%;
     }
   }
   .el-step__title{
     font-size: 14px !important;
   }
  }
</style>
<style scoped>
  .interview-m >>> .el-card__header{
    padding: 0;
  }
</style>
