<template>
  <div class="interview">
    <el-card>
      <div
        slot="header"
        class="header"
      >
        <span class="name">面试信息表</span> <span class="tag">专车</span>
        <div class="step">
          <el-steps
            :active="1"
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
      <self-form
        ref="SelfForm"
        :list-query="listQuery"
        :form-item="formItem"
        label-with="80px"
        :pc-col="12"
        :rules="rules"
        @onPass="handlePassClick"
      >
        <template slot="btn">
          <el-col
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
  name: 'Interview',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  private listQuery:IState = {
    name: '',
    phone: '',
    city: '',
    carType: ''
  }

  private formItem:any[] = [
    {
      type: 1,
      key: 'name',
      tagAttrs: {
        placeholder: '姓名'
      }
    },
    {
      type: 1,
      key: 'phone',
      tagAttrs: {
        placeholder: '电话'
      }
    },
    {
      type: 2,
      key: 'city',
      tagAttrs: {
        placeholder: '工作城市'
      },
      options: [
        {
          label: '北京',
          value: 'beijing'
        }
      ]
    },
    {
      type: 2,
      key: 'carType',
      tagAttrs: {
        placeholder: '车型'
      },
      options: [
        {
          label: '金杯',
          value: 'jinbei'
        }
      ]
    }
  ]
  private rules:IState ={
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入电话', trigger: 'blur' }
    ],
    city: [
      { required: true, message: '请选择城市', trigger: 'change' }
    ],
    carType: [
      { required: true, message: '请选择车型', trigger: 'change' }
    ]
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  handleNextClick() {
    ((this.$refs.SelfForm) as any).submitForm()
  }

  handlePassClick(val:boolean) {
    console.log(val)
  }
}
</script>
<style lang="scss" scoped>
  .interview {
    padding: 20px;
   .header {
     .name {
       font-weight: bold;
     }
     .tag {
       margin-left:10px;
       padding: 3px;
       background: #4051B6;
       color:#ffffff;
       border-radius: 5px;
       font-size:14px;
    }
    .step {
      margin-top:20px;
      padding: 20px 10% 0px;
      border-top:1px solid #DADBE7;
    }
   }
  }
</style>

<style scoped>

</style>
