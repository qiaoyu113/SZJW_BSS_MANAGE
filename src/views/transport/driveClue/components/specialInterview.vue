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
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfForm from '@/components/base/SelfForm.vue'
@Component({
  name: 'SpecialInterview',
  components: {
    SelfForm
  }
})
export default class extends Vue {
    @Prop({ default: () => {} }) form!:any

    private listQuery = {
      gmId: '',
      b: '',
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
      houseAddress: [],
      householdDistrict: '',
      childNum: '',
      experience: '',
      drivingAge: '',
      livingAge: '',
      drivingLicenceType: '',
      hasOwnCar: '',
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
          placeholder: '加盟经理'
        },
        options: []
      },
      {
        type: 2,
        key: 'b',
        label: '邀约方式:',
        tagAttrs: {
          placeholder: '邀约方式'
        },
        options: []
      },
      {
        type: 2,
        key: 'sourceChannel',
        label: '来源渠道:',
        tagAttrs: {
          placeholder: '来源渠道'
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
        label: '面试地址:',
        tagAttrs: {
          placeholder: '现居住地址',
          listeners: {
            'change': this.handleInterviewAddressChange
          }
        },
        options: []
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
          listeners: {
            'change': this.handleIntentionChange
          }
        },
        options: []
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
        options: []
      },
      {
        type: 2,
        key: 'intentCargoType',
        label: '意向货物类型',
        w: '130px',
        options: []
      },
      {
        type: 2,
        key: 'intentWorkDuration',
        label: '意向工作时间段',
        w: '140px',
        options: []
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
        key: '',
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
          listeners: {
            'change': this.handlehouseChange
          }
        },
        options: []
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
        key: '',
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
        type: 1,
        key: '',
        label: '补充信息',
        tagAttrs: {
          placeholder: '请输入补充信息'
        }
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

    private rules = {
      gmId: [
        { required: true, message: '请选择加盟经理', trigger: 'blur' }
      ],
      b: [
        { required: true, message: '请选择邀约方式', trigger: 'blur' }
      ],
      sourceChannel: [
        { required: true, message: '请选择来源渠道', trigger: 'blur' }
      ],
      whereKnow: [
        { required: true, message: '请输入', trigger: 'blur' }
      ],
      heavyAgentName: [
        { required: true, message: '请输入重代理姓名', trigger: 'blur' }
      ],
      age: [
        { required: true, message: '请输入年龄', trigger: 'blur' }
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
        { required: true, message: '请输入原职业月均收入', trigger: 'blur' }
      ],
      expIncomeAvg: [
        { required: true, message: '请输入期望月均净收入，去油去电', trigger: 'blur' }
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
        { required: true, message: '请选择子女数', trigger: 'blur' }
      ],
      drivingAge: [
        { required: true, message: '请输入实际货车驾龄', trigger: 'blur' }
      ],
      livingAge: [
        { required: true, message: '请输入本城市居住时长', trigger: 'blur' }
      ],
      drivingLicenceType: [
        { required: true, message: '请选择驾照类型', trigger: 'blur' }
      ],
      hasOwnCar: [
        { required: true, message: '请选择是否有自己的货车', trigger: 'blur' }
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

    handlePassClick() {

    }

    /**
     *先居住地址
    */
    handleInterviewAddressChange(val:any) {

    }
    /**
   *意向地址
   */
    handleIntentionChange(val:any) {

    }
    /**
     *户籍地址
    */
    handlehouseChange(val:any) {

    }
}
</script>
<style lang="scss" scoped>
  .specialInterview {

  }
</style>
