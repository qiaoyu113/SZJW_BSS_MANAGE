<template>
  <div class="specialInterview">
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
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/base/SelfForm.vue'
import { SpecialInterview } from '@/api/driver'
import { GetCityByCode, GetManagerLists, GetDictionaryList } from '@/api/common'
@Component({
  name: 'SpecialInterview',
  components: {
    SelfForm
  }
})
export default class extends Vue {
    @Prop({ default: () => {} }) form!:any
    @Prop({ default: () => {} }) obj!:any

    private listQuery = {
      gmId: '',
      inviteType: '',
      sourceChannel: '',
      whereKnow: '',
      heavyAgentName: '',
      age: '',
      interviewAddress: [],
      interviewDistrict: '',
      intentAddress: [],
      intentWorkDistrict: '',
      intentDeliveryMode: '',
      intentCargoType: '',
      intentWorkDuration: '',
      originIncomeAvg: '',
      expIncomeAvg: '',
      householdType: '',
      houseAddress: [],
      householdDistrict: '',
      childNum: '',
      experience: '',
      drivingAge: '',
      livingAge: '',
      drivingLicenceType: '',
      hasOwnCar: '',
      ownCarNum: '',
      maxAdvancePayment: '',
      heavyLifting: '',
      providePersonalCredit: '',
      strategyRight: '',
      cooperateFocusPoint: '',
      cooperateKeyFactor: '',
      isAdvancedIntention: '',
      remarks: ''
    }

    private formItem = [
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
        type: 2,
        key: 'inviteType',
        label: '邀约方式:',
        tagAttrs: {
          placeholder: '邀约方式',
          filterable: true
        },
        options: []
      },
      {
        type: 2,
        key: 'sourceChannel',
        label: '来源渠道:',
        tagAttrs: {
          placeholder: '来源渠道',
          filterable: true
        },
        options: []
      },
      {
        type: 1,
        key: 'whereKnow',
        label: '您是从哪里了解我们的加盟信息?',
        w: '230px',
        tagAttrs: {
          placeholder: '您是从哪里了解我们的加盟信息?',
          type: 'textarea',
          rows: 2,
          maxlength: 30,
          'show-word-limit': true
        }
      },
      {
        type: 1,
        key: 'heavyAgentName',
        label: '重代理姓名:',
        tagAttrs: {
          placeholder: '重代理姓名'
        }
      },
      {
        type: 1,
        key: 'age',
        label: '年龄:',
        tagAttrs: {
          placeholder: '请输入0-60之间的数字',
          type: 'number'
        }
      },
      {
        type: 8,
        key: 'interviewAddress',
        label: '居住地址:',
        tagAttrs: {
          placeholder: '现居住地址',
          props: {
            lazy: true,
            lazyLoad: this.loadinterviewAddress
          }
        }
      },
      {
        type: 1,
        key: 'interviewDistrict',
        label: '详细居住地址:',
        w: '150px',
        tagAttrs: {
          placeholder: '详细居住地址',
          type: 'textarea',
          rows: 2,
          maxlength: 32,
          'show-word-limit': true
        }
      },
      {
        type: 8,
        key: 'intentAddress',
        label: '意向工作区域:',
        w: '130px',
        tagAttrs: {
          placeholder: '意向工作区域',
          props: {
            lazy: true,
            lazyLoad: this.loadintentAddress
          }
        }
      },
      {
        type: 1,
        key: 'intentWorkDistrict',
        label: '详细意向工作区域:',
        w: '150px',
        tagAttrs: {
          placeholder: '详细意向工作区域',
          type: 'textarea',
          rows: 2,
          maxlength: 32,
          'show-word-limit': true
        }
      },
      {
        type: 2,
        key: 'intentDeliveryMode',
        label: '意向配送模式',
        w: '130px',
        options: [],
        tagAttrs: {
          filterable: true
        }
      },
      {
        type: 2,
        key: 'intentCargoType',
        label: '意向货物类型',
        w: '130px',
        tagAttrs: {
          filterable: true
        },
        options: []
      },
      {
        type: 2,
        key: 'intentWorkDuration',
        label: '意向工作时间段',
        w: '140px',
        options: [],
        tagAttrs: {
          filterable: true
        }
      },
      {
        type: 1,
        key: 'originIncomeAvg',
        label: '原职业月均收入（元/月）',
        w: '200px',
        tagAttrs: {
          type: 'number',
          placeholder: '请输入0-25000之间的数字'
        }
      },
      {
        type: 1,
        key: 'expIncomeAvg',
        label: '期望月均净收入，去油去电（元/月）',
        w: '260px',
        tagAttrs: {
          type: 'number',
          placeholder: '请输入3000-25000之间的数字'
        }
      },
      {
        type: 4,
        label: '户籍类型',
        key: 'householdType',
        options: [
          {
            label: '农村',
            value: '1'
          },
          {
            label: '城镇',
            value: '2'
          }
        ]
      },
      {
        type: 8,
        key: 'houseAddress',
        label: '户籍地址:',
        tagAttrs: {
          placeholder: '户籍地址',
          props: {
            lazy: true,
            lazyLoad: this.loadhouseAddress
          }
        }
      },
      {
        type: 1,
        key: 'householdDistrict',
        label: '详细户籍地址:',
        w: '150px',
        tagAttrs: {
          placeholder: '详细户籍地址',
          type: 'textarea',
          rows: 2,
          maxlength: 32,
          'show-word-limit': true
        }
      },
      {
        label: '子女数',
        key: 'childNum',
        type: 4,
        options: [
          {
            value: 0,
            label: 0
          },
          {
            value: 1,
            label: 1
          },
          {
            value: 2,
            label: 2
          },
          {
            value: 3,
            label: 3
          }
        ]
      },
      {
        type: 1,
        label: '货物运输经验（月)',
        key: 'experience',
        w: '150px',
        tagAttrs: {
          placeholder: '请输入0-500之间的数字',
          type: 'number'
        }
      },
      {
        type: 1,
        key: 'drivingAge',
        label: '实际货车驾龄（月)',
        w: '150px',
        tagAttrs: {
          placeholder: '请输入0-500之间的数字',
          type: 'number'
        }
      },
      {
        type: 1,
        key: 'livingAge',
        label: '本城市居住时长（月)',
        w: '160px',
        tagAttrs: {
          placeholder: '请输入0-730之间的数字',
          type: 'number'
        }
      },
      {
        type: 2,
        key: 'drivingLicenceType',
        label: '驾照类型',
        options: []
      },
      {
        type: 2,
        key: 'hasOwnCar',
        label: '是否有自己的货车',
        w: '150px',
        col: 8,
        options: [
          {
            label: '有',
            value: true
          },
          {
            label: '无',
            value: false
          }
        ]
      },
      {
        type: 2, // 有几辆
        key: 'ownCarNum',
        w: '0px',
        col: 4,
        options: [

        ]
      },
      {
        type: 2,
        key: 'maxAdvancePayment',
        label: '最大可支付首付款',
        w: '150px',
        options: [

        ]
      },
      {
        type: 4,
        key: 'heavyLifting',
        label: '是否能承担较重搬运',
        w: '150px',
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
        type: 4,
        key: 'providePersonalCredit',
        label: '能否提供个人征信',
        w: '150px',
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
        type: 2,
        key: 'strategyRight',
        label: '投资决策权',
        options: []
      },
      {
        type: 2,
        key: 'cooperateFocusPoint',
        label: '如果有机会跟云鸟合作，你看中的是什么',
        w: '280px',
        options: []
      },
      {
        type: 2,
        label: '最终决定你是否与云鸟合作的关键因素是什么?',
        key: 'cooperateKeyFactor',
        w: '330px',
        options: []
      },
      {
        type: 4,
        key: 'isAdvancedIntention',
        label: '是否是高意向司机',
        w: '150px',
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
        key: 'remarks',
        label: '备注 ',
        tagAttrs: {
          placeholder: '请填写最多100个字,其他个性化要求，如没有填写无',
          type: 'textarea',
          maxlength: 100,
          'show-word-limit': true
        }
      }
    ]
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
  /**
   *货物运输经验（月
   */
   private validateExperience = (rule: any, value: string, callback: Function) => {
     if (Number(value) < 0 || Number(value) > 500) {
       return callback(new Error('请输入0-500之间的数字'))
     }
     callback()
   }
   // 实际驾龄
    private validateDrivingAge = (rule: any, value: string, callback: Function) => {
      if (Number(value) < 0 || Number(value) > 500) {
        return callback(new Error('请输入0-500之间的数字'))
      }
      callback()
    }
    // 本市居住时长
    private validateLivingAge = (rule: any, value: string, callback: Function) => {
      if (Number(value) < 0 || Number(value) > 730) {
        return callback(new Error('请输入0-730之间的数字'))
      }
      callback()
    }
    // 司机年龄
    private validAge = (rule: any, value: string, callback: Function) => {
      if (Number(value) < 0 || Number(value) > 60) {
        return callback(new Error('请输入0-60之间的数字'))
      }
      callback()
    }

    private rules = {
      gmId: [
        { required: true, message: '请选择加盟经理', trigger: 'blur' }
      ],
      inviteType: [
        { required: true, message: '请选择邀约方式', trigger: 'blur' }
      ],
      sourceChannel: [
        { required: true, message: '请选择来源渠道', trigger: 'blur' }
      ],
      whereKnow: [
        { required: true, message: '请输入', trigger: 'blur' }
      ],
      age: [
        { required: true, message: '请输入年龄', trigger: 'blur' },
        { validator: this.validAge, trigger: 'blur' }
      ],
      interviewAddress: [
        { required: true, message: '请选择面试地址', trigger: 'blur' }
      ],
      interviewDistrict: [
        { required: true, message: '请输入详细居住地址', trigger: 'blur' }
      ],
      intentAddress: [
        { required: true, message: '请选择意向工作区域', trigger: 'blur' }
      ],
      intentWorkDistrict: [
        { required: true, message: '请输入详细意向工作区域', trigger: 'blur' }
      ],
      intentDeliveryMode: [
        { required: true, message: '请选择意向配送模式', trigger: 'blur' }
      ],
      intentCargoType: [
        { required: true, message: '请选择意向货物类型', trigger: 'blur' }
      ],
      intentWorkDuration: [
        { required: true, message: '请选择意向工作时间段', trigger: 'blur' }
      ],
      originIncomeAvg: [
        { required: true, message: '请输入原职业月均收入', trigger: 'blur' },
        { validator: this.validateOriginIncomeAvg, trigger: 'blur' }
      ],
      expIncomeAvg: [
        { required: true, message: '请输入期望月均净收入，去油去电', trigger: 'blur' },
        { validator: this.validateExpIncomeAvg, trigger: 'blur' }
      ],
      householdType: [
        { required: true, message: '请选择户籍类型', trigger: 'blur' }
      ],
      houseAddress: [
        { required: true, message: '请选择户籍地址', trigger: 'blur' }
      ],
      householdDistrict: [
        { required: true, message: '请输入详细户籍地址', trigger: 'blur' }
      ],
      childNum: [
        { required: true, message: '请选择子女数', trigger: 'blur' }
      ],
      experience: [
        { required: true, message: '请输入', trigger: 'blur' },
        { validator: this.validateExperience, trigger: 'blur' }
      ],
      drivingAge: [
        { required: true, message: '请输入实际货车驾龄', trigger: 'blur' },
        { validator: this.validateDrivingAge, trigger: 'blur' }
      ],
      livingAge: [
        { required: true, message: '请输入本城市居住时长', trigger: 'blur' },
        { validator: this.validateLivingAge, trigger: 'blur' }
      ],
      drivingLicenceType: [
        { required: true, message: '请选择驾照类型', trigger: 'blur' }
      ],
      hasOwnCar: [
        { required: true, message: '请选择是否有自己的货车', trigger: 'blur' }
      ],
      ownCarNum: [
        { required: true, message: '请输入', trigger: 'blur' }
      ],
      maxAdvancePayment: [
        { required: true, message: '请选择最大可支付首付款', trigger: 'blur' }
      ],
      heavyLifting: [
        { required: true, message: '请选择是否能承担较重搬运', trigger: 'blur' }
      ],
      providePersonalCredit: [
        { required: true, message: '请选择能否提供个人征信', trigger: 'blur' }
      ],
      strategyRight: [
        { required: true, message: '请选择投资决策权', trigger: 'blur' }
      ],
      cooperateFocusPoint: [
        { required: true, message: '请选择', trigger: 'blur' }
      ],
      cooperateKeyFactor: [
        { required: true, message: '请选择', trigger: 'blur' }
      ],
      isAdvancedIntention: [
        { required: true, message: '请选择是否是高意向司机', trigger: 'blur' }
      ],
      remarks: [
        { required: true, message: '请输入remarks', trigger: 'blur' }
      ]
    }
    mounted() {
      this.getManagers()
      this.getBaseInfo()
    }

    /**
   *获取基础信息
   */
    async getBaseInfo() {
      try {
        let params = ['source_channel', 'accep_payment_range', 'accep_payment_range', 'driving_licence_type', 'invite_type', 'intent_delivery_mode', 'strategy_right', 'cooperate_focus_point', 'cooperate_key_factor', 'intent_work_duration']
        let { data: res } = await GetDictionaryList(params)
        if (res.success) {
          this.formItem[1].options = res.data.invite_type.map(function(item:any) {
            return { label: item.dictLabel, value: item.dictValue }
          })
          this.formItem[2].options = res.data.source_channel.map(function(item:any) {
            return { label: item.dictLabel, value: item.dictValue }
          })
          this.formItem[10].options = res.data.intent_delivery_mode.map(function(item:any) {
            return { label: item.dictLabel, value: item.dictValue }
          })
          this.formItem[11].options = res.data.accep_payment_range.map(function(item:any) {
            return { label: item.dictLabel, value: item.dictValue }
          })
          this.formItem[12].options = res.data.intent_work_duration.map(function(item:any) {
            return { label: item.dictLabel, value: item.dictValue }
          })
          this.formItem[22].options = res.data.driving_licence_type.map(function(item:any) {
            return { label: item.dictLabel, value: item.dictValue }
          })
          this.formItem[25].options = res.data.accep_payment_range.map(function(item:any) {
            return { label: item.dictLabel, value: item.dictValue }
          })
          this.formItem[28].options = res.data.strategy_right.map(function(item:any) {
            return { label: item.dictLabel, value: item.dictValue }
          })
          this.formItem[29].options = res.data.cooperate_focus_point.map(function(item:any) {
            return { label: item.dictLabel, value: item.dictValue }
          })
          this.formItem[30].options = res.data.cooperate_key_factor.map(function(item:any) {
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
   *获取加盟经理列表
   */
    async getManagers() {
      try {
        let { data: res } = await GetManagerLists()
        if (res.success) {
          this.formItem[0].options = res.data.map(function(item:any) {
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

    @Watch('obj', { deep: true })
    handleObjChange(val:any) {
      this.listQuery = { ...this.listQuery, ...this.obj }
    }

    @Watch('listQuery.hasOwnCar')
    onOwnCar(val:boolean) {
      this.listQuery.ownCarNum = ''
      if (val) {
        this.formItem[24].options = [
          {
            label: 1,
            value: 1
          },
          {
            label: 2,
            value: 2
          },
          {
            label: 3,
            value: 3
          }
        ]
      } else {
        this.formItem[24].options = [
          {
            label: 0,
            value: 0
          }
        ]
      }
    }

    async handlePassClick() {
      try {
        let params = {
          gmId: this.listQuery.gmId,
          inviteType: this.listQuery.inviteType,
          sourceChannel: this.listQuery.sourceChannel,
          whereKnow: this.listQuery.whereKnow,
          heavyAgentName: this.listQuery.heavyAgentName,
          age: this.listQuery.age,
          interviewProvince: this.listQuery.interviewAddress[0],
          interviewCity: this.listQuery.interviewAddress[1],
          interviewCounty: this.listQuery.interviewAddress[2],
          interviewDistrict: this.listQuery.interviewDistrict,
          intentWorkProvince: this.listQuery.intentAddress[0],
          intentWorkCity: this.listQuery.intentAddress[1],
          intentWorkCounty: this.listQuery.intentAddress[2],
          intentWorkDistrict: this.listQuery.intentWorkDistrict,
          intentDeliveryMode: this.listQuery.intentDeliveryMode,
          intentCargoType: this.listQuery.intentCargoType,
          intentWorkDuration: this.listQuery.intentWorkDuration,
          originIncomeAvg: this.listQuery.originIncomeAvg,
          expIncomeAvg: this.listQuery.expIncomeAvg,
          householdType: this.listQuery.householdType,
          householdProvince: this.listQuery.houseAddress[0],
          householdCity: this.listQuery.houseAddress[1],
          householdCounty: this.listQuery.houseAddress[2],
          householdDistrict: this.listQuery.householdDistrict,
          childNum: this.listQuery.childNum,
          experience: this.listQuery.experience,
          drivingAge: this.listQuery.drivingAge,
          livingAge: this.listQuery.livingAge,
          drivingLicenceType: this.listQuery.drivingLicenceType,
          hasOwnCar: this.listQuery.hasOwnCar,
          ownCarNum: this.listQuery.ownCarNum,
          maxAdvancePayment: this.listQuery.maxAdvancePayment,
          heavyLifting: this.listQuery.heavyLifting,
          providePersonalCredit: this.listQuery.providePersonalCredit,
          strategyRight: this.listQuery.strategyRight,
          cooperateFocusPoint: this.listQuery.cooperateFocusPoint,
          cooperateKeyFactor: this.listQuery.cooperateKeyFactor,
          isAdvancedIntention: this.listQuery.isAdvancedIntention,
          remarks: this.listQuery.remarks,
          name: this.form.name,
          phone: this.form.phone,
          workCity: this.form.workCity,
          carType: this.form.carType,
          clueId: this.form.clueId
        }
        let { data: res } = await SpecialInterview(params)
        if (res.success) {
          this.handleFinish()
        } else {
          this.$message.error(res.errorMsg)
        }
      } catch (err) {
        console.log(`special interview fail:${err}`)
      }
    }

    @Emit('onFinish')
    handleFinish() {
    }
    /**
     * 现居住地址
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
    /**
     *户籍地址
     */
    async loadhouseAddress(node:any, resolve:any) {
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
     *意向工作区域
     */
    async loadintentAddress(node:any, resolve:any) {
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
}
</script>
<style lang="scss" scoped>
  .specialInterview {

  }
</style>
