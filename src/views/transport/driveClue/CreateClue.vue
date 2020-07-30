<template>
  <div class="CreateClue">
    <SectionContainer
      title="人工线索录入"
      :md="true"
    >
      <self-form
        ref="SelfForm"
        :list-query="listQuery"
        :form-item="formItem"
        label-width="80px"
        :rules="rules"
        @onPass="handlePassClick"
      >
        <div
          slot="btn"
          :class="isPC ? 'btnPc' : ''"
        >
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            type="warning"
            name="createClue_cancel_btn"
            @click="handleCancelClick"
          >
            取消
          </el-button>
          <el-button
            v-permission="['/v1/driver/clue/create/manually']"
            :class="isPC ? '' : 'btnMobile'"
            type="primary"
            name="driverclue_save_btn"
            @click="handleSaveClick"
          >
            保存
          </el-button>
          <el-button
            v-permission="['/v1/driver/clue/clue/special/interview','/v1/driver/clue/clue/share/interview','/v1/driver/clue/clue/edit/interview']"
            :class="isPC ? '' : 'btnMobile'"
            type="primary"
            name="driverclue_saveInterview_btn"
            :disabled="!id"
            @click="handleSaveAndInterviewClick"
          >
            保存并面试
          </el-button>
        </div>
      </self-form>
    </SectionContainer>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Emit } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { CreateActivity, EditActivity, GetClueDetailByClueId } from '@/api/driver'
import { HandlePages } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'
import { phoneReg } from '@/utils/index.ts'
import { GetOpenCityData, GetDictionaryList } from '@/api/common'
import { delayTime } from '@/settings'
import SectionContainer from '@/components/SectionContainer/index.vue'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'CreateClue',
  components: {
    SelfForm,
    SectionContainer
  }
})
export default class extends Vue {
  private type:string = '' // 表单校验通过,是保存还是保存并面试按钮
  private id:number|string = '' // 线索id

  private workCityOptions:any[] = [] // 车型列表
  private carOptions:any[] = [] // 车型列表
  private sourceOptions:any[] = [] // 来源渠道列表
  /**
   *表单对象
   */
  private listQuery:IState = {
    name: '',
    phone: '',
    wechatNo: '',
    workCity: '',
    carType: '',
    sourceChannel: '',
    busiType: ''
  }
  /**
   *表单数组
   */
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入姓名',
        maxlength: 10,
        clearable: true
      },
      label: '姓名',
      key: 'name'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入电话',
        clearable: true
      },
      label: '电话',
      key: 'phone'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入微信',
        maxlength: 20,
        clearable: true
      },
      label: '微信',
      key: 'wechatNo'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择工作城市',
        filterable: true
      },
      label: '工作城市',
      key: 'workCity',
      options: this.workCityOptions
    },
    {
      type: 2,
      key: 'carType',
      tagAttrs: {
        placeholder: '请选择车型',
        filterable: true
      },
      label: '车型',
      options: this.carOptions
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择来源渠道',
        filterable: true
      },
      label: '来源渠道',
      key: 'sourceChannel',
      options: this.sourceOptions
    },
    {
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
    }
  ]
  /**
   *区分设备
   */
  get isPC() {
    return SettingsModule.isPC
  }
  /**
   * 校验手机号
   */
  private validatePhone = (rule: any, value: string, callback: Function) => {
    if (!phoneReg.test(value)) {
      return callback(new Error('请输入正确的手机号'))
    }
    callback()
  }
  private rules:IState = {
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入电话', trigger: 'blur' },
      { validator: this.validatePhone, trigger: 'blur' }
    ],
    wechatNo: [
      { required: false, message: '请输入微信', trigger: 'blur' }
    ],
    workCity: [
      { required: true, message: '请选择工作城市', trigger: 'change' }
    ],
    carType: [
      { required: true, message: '请选择车型', trigger: 'change' }
    ],
    sourceChannel: [
      { required: true, message: '请选择来源渠道', trigger: 'change' }
    ],
    busiType: [
      { required: true, message: '请选择业务线', trigger: 'change' }
    ]
  }

  /**
   *获取开通城市
   */
  async getOpenCitys() {
    try {
      let { data: res } = await GetOpenCityData()
      if (res.success) {
        let workCity = res.data.map(function(item:any) {
          return {
            label: item.name,
            value: item.code
          }
        })
        this.workCityOptions.push(...workCity)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get `)
    }
  }
  /**
   *获取基础信息
   */
  async getBaseInfo() {
    try {
      let params = ['Intentional_compartment', 'source_channel']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        let cars = res.data.Intentional_compartment.map(function(item:any) {
          return { label: item.dictLabel, value: item.dictValue }
        })
        let sources = res.data.source_channel.map(function(item:any) {
          return { label: item.dictLabel, value: item.dictValue }
        })

        this.carOptions.push(...cars)
        this.sourceOptions.push(...sources)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }
  /**
   * 获取司机线索详细
   */
  async getClueDetail() {
    try {
      let params = {
        clueId: this.id
      }
      let { data: res } = await GetClueDetailByClueId(params)
      if (res.success) {
        this.listQuery = {
          ...this.listQuery,
          ...{
            name: res.data.name,
            phone: res.data.phone,
            wechatNo: res.data.wechatNo,
            workCity: res.data.workCity + '',
            carType: res.data.carType + '',
            sourceChannel: res.data.sourceChannel + '',
            busiType: res.data.busiType
          }
        }
      }
    } catch (err) {
      console.log(`get clue detail err:${err}`)
    }
  }
  /**
   *取消按钮
   */
  handleCancelClick() {
    this.$router.go(-1)
  }

  /**
   *保存
   */
  handleSaveClick() {
    this.type = 'save'
    this.handleValidateForm()
  }
  /**
   *校验表单
   */
  handleValidateForm() {
    ((this.$refs.SelfForm) as any).submitForm()
  }
  /**
   *校验表单的结果
   */
  handlePassClick(val:boolean) {
    if (this.id) {
      this.editActivity()
    } else {
      this.createActivity()
    }
  }
  /**
   *保存并面试
   */
  handleSaveAndInterviewClick() {
    this.type = 'interview'
    this.handleValidateForm()
  }
  /**
   *创建司机索引
   */
  async createActivity() {
    try {
      let params = { ...this.listQuery }
      let { data: res } = await CreateActivity(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.jump()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`create activity fail:${err}`)
    }
  }

  jump() {
    if (this.type === 'interview') {
      this.$router.push({
        path: '/transport/interview',
        query: {
          id: this.id + ''
        }
      })
    } else {
      setTimeout(() => {
        this.$router.push({
          path: '/transport/driverclue'
        })
      }, delayTime)
    }
  }

  /**
   *编辑司机索引
   */
  async editActivity() {
    try {
      let params = {
        ...this.listQuery,
        clueId: this.id
      }
      let { data: res } = await EditActivity(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.jump()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`edit activity fail:${err}`)
    }
  }

  mounted() {
    this.getBaseInfo()
    this.getOpenCitys()
    this.id = (this.$route.query.id) as number | string
    if (this.id) {
      this.getClueDetail()
    }
  }
}
</script>
<style lang="scss" scoped>
  .CreateClue {
    padding: 20px;
    .btnPc {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
    }
    .btnMobile {
      margin-left: 0;
      margin-top: 10px;
      width:100%;
    }
  }
</style>
