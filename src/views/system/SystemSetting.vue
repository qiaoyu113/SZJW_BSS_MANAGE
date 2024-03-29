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
              prop="isDelivery"
            >
              <el-radio-group v-model="ruleForm.isDelivery">
                <el-radio
                  label="1"
                >
                  是
                </el-radio>
                <el-radio
                  label="2"
                >
                  否
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col
            v-if="ruleForm.isDelivery === '1'"
            :span="24"
          >
            <el-form-item
              label="适用工作城市"
              prop="city"
            >
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
              >
                全选
              </el-checkbox>
              <el-checkbox-group
                v-model="ruleForm.city"
                @change="handleCheckedCitiesChange"
              >
                <el-checkbox
                  v-for="(item, index) in optionsCity"
                  :key="index"
                  :label="item.code"
                >
                  {{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>
      <div class="btn_box">
        <el-button
          type="primary"
          name="systemsetting_formSave_btn"
          @click="submitForm('ruleForm')"
        >
          提交
        </el-button>
        <el-button
          name="systemsetting_formReset_btn"
          @click="resetForm('ruleForm')"
        >
          重置
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { GetDictionaryCity } from '@/api/common'
import { getSettingSystem, settingSystem } from '@/api/product'
import '@/styles/common.scss'
import { lock } from '@/utils/index'
@Component({
  name: 'SystemSetting',
  components: {
    SectionContainer
  }
})
export default class extends Vue {
  private optionsCity: any[] = []; // 字典查询定义(命名规则为options + 类型名称)

  private ruleForm:any = {
    isDelivery: '',
    city: []
  }
  private rules:any = {
    isDelivery: [
      { required: true, message: '请选择是否交付', trigger: 'change' }
    ],
    city: [
      { required: true, message: '请选择城市', trigger: 'change' }
    ]
  }
  private checkAll: boolean= false
  private isIndeterminate: boolean= false

  @Watch('ruleForm.isDelivery')
  private onval(value:any) {
    if (value === '2') {
      this.ruleForm.city = []
      this.checkAll = false
    }
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  private handleCheckAllChange(val: any) {
    this.ruleForm.city = val ? this.optionsCity.map((item: any) => item.code) : []
    this.isIndeterminate = false
  }
  private handleCheckedCitiesChange(value: any) {
    let checkedCount = value.length
    this.checkAll = checkedCount === this.optionsCity.length
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.optionsCity.length
  }
  private submitForm(formName:any) {
    (this.$refs[formName] as any).validate((valid: boolean) => {
      if (valid) {
        this.saveData()
      }
    })
  }
  @lock
  async saveData() {
    try {
      const formData = new FormData()
      formData.append('jsonStr', JSON.stringify(this.ruleForm))
      const { data } = await settingSystem(formData)
      if (data.success) {
        this.$message.success(`系统设置保存成功`)
      } else {
        this.$message.error(data)
      }
    } catch (err) {
      console.log(`submit fail:${err}`)
    } finally {
      console.log(`finally`)
    }
  }

  private resetForm(formName:any) {
    this.ruleForm.isDelivery = ''
    this.ruleForm.city = ''
    this.isIndeterminate = false
    this.checkAll = false
    this.$nextTick(() => {
      (this.$refs[formName] as any).clearValidate()
    })
  }
  private async getSetting() {
    const { data } = await getSettingSystem()
    if (data.success) {
      // console.log(data.data)
      if (data.data) {
        // console.log(data.data)
        const form = JSON.parse(data.data)
        this.ruleForm = form
        this.handleCheckedCitiesChange(this.ruleForm['city'])
      }
    } else {
      this.$message.error(data)
    }
  }
  private async getDictionary() {
    const { data } = await GetDictionaryCity()
    if (data.success) {
      this.optionsCity = data.data
    } else {
      this.$message.error(data)
    }
    this.getSetting()
  }
  private fetchData() {
    this.getDictionary()
  }
  mounted() {
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped>
.SystemSetting {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .btn_box {
    padding-top: 20px;
    box-sizing: border-box;
  }
}
.SystemSetting-m {
  .btn_box {
    padding: 30px 20px 0 20px;
    box-sizing: border-box;
    .el-button {
      width: 100%;
    }
    .el-button {
      margin: 0 0 20px 0;
    }
  }
}
.SystemSetting,
.SystemSetting-m{
  .el-radio{
    line-height: 32px
  }
}
</style>
<style lang="scss" scope>
.SystemSetting >>> .el-form-item__content,
.SystemSetting-m >>> .el-form-item__content{
  line-height: 32px
}
</style>
