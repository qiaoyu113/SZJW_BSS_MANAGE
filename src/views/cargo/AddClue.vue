<template>
  <div :class="isPC ? 'AddClue' : 'AddClue-m'">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="isPC ? '160px' : '80px'"
    >
      <SectionContainer title="基本信息">
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="分配销售"
              prop="name"
            >
              <el-select
                v-model="ruleForm.region"
                placeholder="请选择"
              >
                <el-option
                  label="区域一"
                  value="shanghai"
                />
                <el-option
                  label="区域二"
                  value="beijing"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="线索来源"
              prop="name"
            >
              <el-select
                v-model="ruleForm.region"
                placeholder="请选择"
              >
                <el-option
                  label="区域一"
                  value="shanghai"
                />
                <el-option
                  label="区域二"
                  value="beijing"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="姓名"
              prop="name"
            >
              <el-input
                v-model="ruleForm.name2"
                placeholder="请输入"
                maxlength="10"
              />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="手机号码"
              prop="name"
            >
              <el-input
                v-model="ruleForm.name3"
                placeholder="请输入"
                maxlength="10"
              />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="城市"
              prop="name"
            >
              <el-select
                v-model="ruleForm.region"
                placeholder="请选择"
              >
                <el-option
                  label="区域一"
                  value="shanghai"
                />
                <el-option
                  label="区域二"
                  value="beijing"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="详细地址"
              prop="region"
            >
              <el-input
                v-model="ruleForm.name3"
                placeholder="请输入"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="职务"
              prop="region"
            >
              <el-input
                v-model="ruleForm.name3"
                placeholder="请输入"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="公司"
              prop="region"
            >
              <el-input
                v-model="ruleForm.name3"
                placeholder="请输入"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="备注"
              prop="region"
            >
              <el-input
                v-model="ruleForm.name3"
                type="textarea"
                :autosize="{minRows: 2, maxRows: 4}"
                placeholder="请输入"
                maxlength="300"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <div class="btn_box">
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
            >
              提交
            </el-button>
            <el-button @click="resetForm('ruleForm')">
              重置
            </el-button>
          </div>
        </el-form-item>
      </SectionContainer>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'

import '@/styles/common.scss'
@Component({
  name: 'AddClue',
  components: {
    SectionContainer
  }
})
export default class extends Vue {
  private id: any = ''
  private ruleForm:any = {
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: ''
  }
  private rules:any = {
    name: [
      { required: true, message: '请输入活动名称', trigger: 'blur' },
      { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    region: [
      { required: true, message: '请选择活动区域', trigger: 'change' }
    ],
    date1: [
      { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
    ],
    date2: [
      { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
    ],
    type: [
      { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
    ],
    resource: [
      { required: true, message: '请选择活动资源', trigger: 'change' }
    ],
    desc: [
      { required: true, message: '请填写活动形式', trigger: 'blur' }
    ]
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  private submitForm(formName:any) {
    (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        alert('submit!')
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  private resetForm(formName:any) {
    (this.$refs[formName] as ElForm).resetFields()
  }

  mounted() {
    this.id = this.$route.query.id
  }
}
</script>

<style lang="scss" scoped>
.el-select{
  display: block;
}
</style>
