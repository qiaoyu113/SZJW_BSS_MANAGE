<template>
  <div class="CreateClue">
    <el-card header="人工线索录入">
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
            :class="isPC ? '' : 'btnMobile'"
            type="primary"
            name="driverclue_save_btn"
            @click="handleSaveClick"
          >
            保存
          </el-button>
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            type="primary"
            name="driverclue_saveInterview_btn"
            @click="handleSaveAndInterviewClick"
          >
            保存并面试
          </el-button>
        </div>
      </self-form>
    </el-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/base/SelfForm.vue'
import { GetDriverIndexesList } from '@/api/driver'
import { HandlePages } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'CreateClue',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  /**
   *表单对象
   */
  private listQuery:IState = {
    name: '',
    phone: '',
    carType: '',
    channel: '',
    city: '',
    followPerson: '',
    onlyCan: ''
  }
  /**
   *表单数组
   */
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入姓名'
      },
      label: '姓名',
      key: 'name'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入电话'
      },
      label: '电话',
      key: 'phone'
    },
    {
      type: 2,
      key: 'carType',
      tagAttrs: {
        placeholder: '请选择车型'
      },
      label: '车型',
      options: [
        {
          label: '依维柯',
          value: 'yiweike'
        },
        {
          label: '金杯',
          value: 'jinbei'
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择来源渠道'
      },
      label: '来源渠道',
      key: 'channel',
      options: [
        {
          label: '58同城',
          value: '58'
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择工作城市'
      },
      label: '工作城市',
      key: 'city',
      options: [
        {
          label: '华北大区',
          value: 'huabei'
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择跟进人'
      },
      label: '跟进人',
      key: 'followPerson',
      options: [
        {
          label: 'tom',
          value: 'tom'
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择'
      },
      label: '只看我的',
      key: 'onlyCan',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 2
        }
      ]
    }
  ]
  private rules:IState = {
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入电话', trigger: 'blur' }
    ],
    carType: [
      { required: true, message: '请选择车型', trigger: 'change' }
    ],
    channel: [
      { required: true, message: '请选择来源渠道', trigger: 'change' }
    ],
    city: [
      { required: true, message: '请选择工作城市', trigger: 'change' }
    ],
    followPerson: [
      { required: true, message: '请选择跟进人', trigger: 'change' }
    ],
    onlyCan: [
      { required: true, message: '请选择只看我的', trigger: 'change' }
    ]
  }
  get isPC() {
    return SettingsModule.isPC
  }

  /**
   *取消按钮
   */
  handleCancelClick() {

  }

  /**
   *保存
   */
  handleSaveClick() {
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
    console.log(val)
  }
  /**
   *保存并面试
   */
  handleSaveAndInterviewClick() {
    this.handleValidateForm()
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
