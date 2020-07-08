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
          label-with="80px"
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
        <div class="interviewInfo">
          <h4 class="text">
            根据金数据面试表实现
            不包括基本信息中的属性
            不包括加盟经理、小组，取当前用户数据
          </h4>
          <el-row>
            <el-col
              :span="8"
              :offset="2"
            >
              <el-button
                type="primary"
                class="btn"
                style="width:100%"
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
                class="btn"
                style="width:100%"
              >
                提交
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
  private active:number = 1
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
    this.active = 1
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
   .text {
     margin-top: 50px;
     text-align: center;
   }
  }
</style>

<style scoped>
  .interview >>> .el-card {
    padding: 0px;
    height: calc(100vh - 140px);
  }

  @media screen and (min-width: 701px) {
    .btn {
      margin-top:160px;
    }
  }
</style>
