<template>
  <div class="shareInterview">
    <self-form
      ref="form"
      :list-query="listQuery"
      :form-item="formItem"
      label-width="100px"
      :pc-col="12"
      :rules="rules"
      @onPass="handlePassClick"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Emit, Prop, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/base/SelfForm.vue'
import { ShareInterview, EditDriverInterviewEdit } from '@/api/driver'
import { GetCityByCode, GetManagerLists, GetDictionaryList } from '@/api/common'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'ShareInterview',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) form!:any
  @Prop({ default: () => {} }) obj!:any
  private listQuery:IState = {
    interviewDate: '',
    interviewAddress: [],
    interviewDistrict: '',
    gmId: '',
    home: [],
    liveDistrict: '',
    sourceChannel: '',
    drivingLicenceType: '',
    isLocalPlate: '',
    originIncomeAvg: '',
    expIncomeAvg: '',
    workDuration: '',
    scatteredJobRate: '',
    isNewEnergy: '',
    age: ''
  }
  private formItem:any[] = [
    {
      type: 6,
      key: 'interviewDate',
      label: '面试日期:',
      tagAttrs: {
        placeholder: '面试日期'
      }
    },
    {
      type: 8,
      key: 'interviewAddress',
      label: '面试地址:',
      tagAttrs: {
        placeholder: '面试地址',
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'interviewProvince',
        props: {
          lazy: true,
          lazyLoad: this.loadinterviewAddress
        }
      }
    },
    {
      type: 1,
      key: 'interviewDistrict',
      label: '详细面试地址:',
      w: '150px',
      tagAttrs: {
        placeholder: '详细面试地址',
        type: 'textarea',
        rows: 2,
        maxlength: 32,
        'show-word-limit': true
      }
    },
    {
      type: 1,
      key: 'age',
      label: '司机年龄:',
      tagAttrs: {
        placeholder: '请输入0-60之间的数字',
        type: 'number'
      }
    },
    {
      type: 2,
      key: 'gmId',
      label: '加盟经理:',
      tagAttrs: {
        placeholder: '加盟经理',
        filterable: true
      },
      options: []
    },
    {
      type: 8,
      key: 'home',
      label: '现住址:',
      tagAttrs: {
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'liveProvince',
        placeholder: '现住址',
        props: {
          lazy: true,
          lazyLoad: this.loadhomeAddress
        }
      }
    },
    {
      type: 1,
      key: 'liveDistrict',
      label: '详细住址:',
      tagAttrs: {
        placeholder: '现住址详细住址',
        type: 'textarea',
        rows: 2,
        maxlength: 32,
        'show-word-limit': true
      }
    },
    {
      type: 2,
      key: 'sourceChannel',
      label: '邀约渠道:',
      tagAttrs: {
        placeholder: '邀约渠道',
        filterable: true
      },
      options: []
    },
    {
      type: 2,
      key: 'drivingLicenceType',
      label: '驾照类型:',
      tagAttrs: {
        placeholder: '驾照类型',
        filterable: true
      },
      options: []
    },
    {
      type: 4,
      key: 'isLocalPlate',
      label: '是否工作地车牌:',
      w: '130px',
      tagAttrs: {
        placeholder: '是否工作地车牌'
      },
      options: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ]
    },
    {
      type: 1,
      key: 'originIncomeAvg',
      label: '原收入(去油)(元/月):',
      w: '160px',
      tagAttrs: {
        placeholder: '原收入(去油)(元/月)(请输入0-25000之间的数字)',
        type: 'number'
      }
    },
    {
      type: 1,
      key: 'expIncomeAvg',
      label: '期望收入(去油)(元/月):',
      w: '170px',
      tagAttrs: {
        placeholder: '期望收入（去油）（元/月） (请输入3000-25000之间的数字)',
        type: 'number'
      }
    },
    {
      type: 1,
      key: 'workDuration',
      label: '从业时间(月):',
      w: '120px',
      tagAttrs: {
        placeholder: '从业时间（月） (请输入0-500之间的数字)',
        type: 'number'
      }
    },
    {
      type: 1,
      key: 'scatteredJobRate',
      label: '零散活占比(%):',
      w: '130px',
      tagAttrs: {
        placeholder: '零散活占比（%） (请输入0-100之间的数字)',
        type: 'number'
      }
    },
    {
      type: 4,
      key: 'isNewEnergy',
      label: '是否新能源:',
      tagAttrs: {

      },
      options: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ]
    }
  ]
  // 司机年龄
  private validAge = (rule: any, value: string, callback: Function) => {
    if (Number(value) < 0 || Number(value) > 60) {
      return callback(new Error('请输入0-60之间的数字'))
    }
    callback()
  }
  /**
   *原收入
   */
  private validateOriginIncomeAvg = (rule: any, value: string, callback: Function) => {
    if (Number(value) < 0 || Number(value) > 25000) {
      return callback(new Error('请输入0-25000之间的数字'))
    }
    callback()
  }
  /**
   * 期望收入
   */
  private validateExpIncomeAvg = (rule: any, value: string, callback: Function) => {
    if (Number(value) < 3000 || Number(value) > 25000) {
      return callback(new Error('请输入3000-25000之间的数字'))
    }
    callback()
  }
  // 从业时间
  private validateWorkDuration = (rule: any, value: string, callback: Function) => {
    if (Number(value) < 0 || Number(value) > 500) {
      return callback(new Error('请输入0-500之间的数字'))
    }
    callback()
  }
  // 零散活占比

  private validateScatteredJobRate = (rule: any, value: string, callback: Function) => {
    if (Number(value) < 0 || Number(value) > 100) {
      return callback(new Error('请输入0-100之间的数字'))
    }
    callback()
  }
  private rules = {
    interviewDate: [
      { required: true, message: '请输入活动名称', trigger: 'blur' }
    ],
    interviewAddress: [
      { required: true, message: '请选择面试地址', trigger: 'blur' }
    ],
    interviewDistrict: [
      { required: true, message: '请输入详细面试地址', trigger: 'blur' }
    ],
    age: [
      { required: true, message: '请输入年龄', trigger: 'blur' },
      { validator: this.validAge, trigger: 'blur' }
    ],
    gmId: [
      { required: true, message: '请选择加盟经理', trigger: 'blur' }
    ],
    home: [
      { required: true, message: '请选择现住址', trigger: 'blur' }
    ],
    liveDistrict: [
      { required: true, message: '请输入详细住址', trigger: 'blur' }
    ],
    sourceChannel: [
      { required: true, message: '请选择邀约渠道', trigger: 'blur' }
    ],
    drivingLicenceType: [
      { required: false, message: '请选择驾照类型', trigger: 'blur' }
    ],
    isLocalPlate: [
      { required: true, message: '请选择是否工作地车牌', trigger: 'blur' }
    ],
    originIncomeAvg: [
      { required: true, message: '请输入原收入(去油)(元/月)', trigger: 'blur' },
      { validator: this.validateOriginIncomeAvg, trigger: 'blur' }
    ],
    expIncomeAvg: [
      { required: true, message: '请输入期望收入(去油)(元/月)', trigger: 'blur' },
      { validator: this.validateExpIncomeAvg, trigger: 'blur' }
    ],
    workDuration: [
      { required: true, message: '请输入从业时间(月)', trigger: 'blur' },
      { validator: this.validateWorkDuration, trigger: 'blur' }
    ],
    scatteredJobRate: [
      { required: true, message: '请输入零散活占比(%)', trigger: 'blur' },
      { validator: this.validateScatteredJobRate, trigger: 'blur' }

    ],
    isNewEnergy: [
      { required: true, message: '请选择是否新能源', trigger: 'blur' }
    ]
  }

  mounted() {
    this.getManagers()
    this.getBaseInfo()
  }

  /**
   *获取加盟经理列表
   */
  async getManagers() {
    try {
      let { data: res } = await GetManagerLists()
      if (res.success) {
        this.formItem[4].options = res.data.map(function(item:any) {
          return {
            label: item.name,
            value: item.id
          }
        })
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get manager fail:${err}`)
    }
  }
  /**
   *获取基础信息
   */
  async getBaseInfo() {
    try {
      let params = ['source_channel', 'driving_licence_type']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        this.formItem[7].options = res.data.source_channel.map(function(item:any) {
          return { label: item.dictLabel, value: +item.dictValue }
        })
        this.formItem[8].options = res.data.driving_licence_type.map(function(item:any) {
          return { label: item.dictLabel, value: +item.dictValue }
        })
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }
  @Watch('obj', { deep: true, immediate: true })
  handleObjChange(val:any) {
    this.listQuery = { ...this.listQuery, ...val }
    this.listQuery.interviewAddress.push(val.interviewProvince + '')
    this.listQuery.interviewAddress.push(val.interviewCity + '')
    this.listQuery.interviewAddress.push(val.interviewCounty + '')
    this.listQuery.home.push(val.liveProvince + '')
    this.listQuery.home.push(val.liveCity + '')
    this.listQuery.home.push(val.liveCounty + '')
    this.listQuery.interviewDate = new Date(this.listQuery.interviewDate).getTime()
  }

  /**
     * 加载城市
     */
  async loadCityByCode(params:string[]) {
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
  /**
   *现住址
   */
  async loadhomeAddress(node:any, resolve:any) {
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
  /**
   *面试地址
  */
  async loadinterviewAddress(node:any, resolve:any) {
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
  async handlePassClick() {
    let params = {
      age: this.listQuery.age,
      interviewDate: this.listQuery.interviewDate,
      gmId: this.listQuery.gmId,
      sourceChannel: this.listQuery.sourceChannel,
      drivingLicenceType: this.listQuery.drivingLicenceType,
      isLocalPlate: this.listQuery.isLocalPlate,
      originIncomeAvg: this.listQuery.originIncomeAvg,
      expIncomeAvg: this.listQuery.expIncomeAvg,
      workDuration: this.listQuery.workDuration,
      scatteredJobRate: this.listQuery.scatteredJobRate,
      isNewEnergy: this.listQuery.isNewEnergy,
      interviewProvince: this.listQuery.interviewAddress[0],
      interviewCity: this.listQuery.interviewAddress[1],
      interviewCounty: this.listQuery.interviewAddress[2],
      interviewDistrict: this.listQuery.interviewDistrict,
      liveProvince: this.listQuery.home[0],
      liveCity: this.listQuery.home[1],
      liveCounty: this.listQuery.home[2],
      liveDistrict: this.listQuery.liveDistrict,
      name: this.form.name,
      phone: this.form.phone,
      workCity: this.form.workCity,
      carType: this.form.carType,
      clueId: this.form.clueId,
      intentDrivingCarType: this.form.carType,
      busiType: this.form.busiType
    }
    if (Object.keys(this.obj).length > 0) {
      this.edit(params)
    } else {
      this.create(params)
    }
  }
  /**
   * 录入面试表
   */
  async create(params:any) {
    try {
      let { data: res } = await ShareInterview(params)
      if (res.success) {
        this.handleFinish()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`share add fail:${err}`)
    }
  }

  /**
     * 编辑面试表
     */
  async edit(params:any) {
    try {
      let { data: res } = await EditDriverInterviewEdit(params)
      if (res.success) {
        this.handleFinish()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`edit fail:${err}`)
    }
  }

  @Emit('onFinish')
  handleFinish() {
  }
}
</script>
<style lang="scss" scoped>
  .shareInterview {

  }
</style>
