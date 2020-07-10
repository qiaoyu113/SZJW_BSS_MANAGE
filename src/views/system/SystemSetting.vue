<template>
  <div :class="isPC ? 'SystemSetting' : 'SystemSetting-m'">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="isPC ? '160px' : '80px'"
    >
      <SectionContainer title="GPS交付设置">
        <div />
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="是否交付"
              prop="name"
            >
              <el-radio-group v-model="ruleForm.region">
                <el-radio label="线上品牌商赞助" />
                <el-radio label="线下场地免费" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="是否交付"
              prop="name"
            >
              <el-radio-group v-model="ruleForm.region">
                <el-radio label="线上品牌商赞助" />
                <el-radio label="线下场地免费" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="适用工作城市"
              prop="name"
            >
              <el-radio-group v-model="ruleForm.region">
                <el-radio label="线上品牌商赞助" />
                <el-radio label="线上品牌商赞助" />
                <el-radio label="线上品牌商赞助" />
                <el-radio label="线上品牌商赞助" />
                <el-radio label="线上品牌商赞助" />
                <el-radio label="线上品牌商赞助" />
                <el-radio label="线上品牌商赞助" />
                <el-radio label="线下场地免费" />
              </el-radio-group>
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
import { TagsViewModule } from '@/store/modules/tags-view'

import '@/styles/common.scss'
@Component({
  name: 'SystemSetting',
  components: {
    SectionContainer
  }
})
export default class extends Vue {
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

  private addCar() {
    console.log('添加车型')
  }
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
.el-radio{
  line-height: 32px
}
</style>
<style lang="scss" scope>
.SystemSetting >>> .el-form-item__content{
  line-height: 32px
}
.el-collapse-item__content {
  padding-bottom: 0;
}
.el-form-item__label {
  color: #999999;
}
</style>
