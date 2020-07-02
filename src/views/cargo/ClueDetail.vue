<template>
  <div :class="isPC ? 'ClueDetail' : 'ClueDetail-m'">
    <SectionContainer
      title="详情信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="姓名"
            value="刘德华123123"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="手机号"
            value="15071362991"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="地址"
            value="武汉市黄陂区前川街人信城"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="仓位置"
            value="四川省成都市青白江区祥福镇宇培分拨中心"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="预计日工作时间"
            value="04:30-11:30"
          />
        </el-col>
      </el-row>
    </SectionContainer>

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
              label="活动名称"
              prop="name"
            >
              <el-input v-model="ruleForm.name1" />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="活动名称"
              prop="name"
            >
              <el-input v-model="ruleForm.name1" />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="活动名称"
              prop="name"
            >
              <el-input v-model="ruleForm.name2" />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="活动名称"
              prop="name"
            >
              <el-input v-model="ruleForm.name3" />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="活动名称"
              prop="name"
            >
              <el-input v-model="ruleForm.name4" />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="活动区域"
              prop="region"
            >
              <el-select
                v-model="ruleForm.region"
                placeholder="请选择活动区域"
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
              label="活动区域"
              prop="region"
            >
              123
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>

      <SectionContainer title="面试信息">
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="活动名称"
              prop="name"
            >
              <el-input v-model="ruleForm.name" />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="活动区域"
              prop="region"
            >
              <el-select
                v-model="ruleForm.region"
                placeholder="请选择活动区域"
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
              label="活动时间"
              required
            >
              <el-col :span="11">
                <el-form-item prop="date1">
                  <el-date-picker
                    v-model="ruleForm.date1"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col
                class="line"
                :span="2"
              >
                -
              </el-col>
              <el-col :span="11">
                <el-form-item prop="date2">
                  <el-time-picker
                    v-model="ruleForm.date2"
                    placeholder="选择时间"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          label="即时配送"
          prop="delivery"
        >
          <el-switch v-model="ruleForm.delivery" />
        </el-form-item>
        <el-form-item
          label="活动性质"
          prop="type"
        >
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox
              label="美食/餐厅线上活动"
              name="type"
            />
            <el-checkbox
              label="地推活动"
              name="type"
            />
            <el-checkbox
              label="线下主题活动"
              name="type"
            />
            <el-checkbox
              label="单纯品牌曝光"
              name="type"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="特殊资源"
          prop="resource"
        >
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助" />
            <el-radio label="线下场地免费" />
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="活动形式"
          prop="desc"
        >
          <el-input
            v-model="ruleForm.desc"
            type="textarea"
          />
        </el-form-item>
        <el-form-item>
          <div class="btn_box">
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
            >
              立即创建
            </el-button>
            <el-button @click="resetForm('ruleForm')">
              重置
            </el-button>
          </div>
        </el-form-item>
      </sectioncontainer>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { GetCustomerList } from '@/api/customer'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

    @Component({
      name: 'ClueDetail',
      components: {
        DetailItem,
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

  created() {
  }

  mounted() {
  }

  activated() {
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
}
</script>

<style lang="scss">
.ClueDetail {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .el-form-item__label{
    color: #4a4a4a;
    font-weight: 400;
  }
}
</style>

<style lang="scss">
.ClueDetail-m {
  width: 100%;
  .el-form-item__label{
    color: #4a4a4a;
    font-weight: 400;
  }
}
</style>

<style lang="scss" scope>
@media screen and (min-width: 701px) {
  .el-select {
    width: 100%;
  }
  .el-input{
    width: 75%;
  }
}

@media screen and (max-width: 700px) {
  .el-select {
    width: 100%;
  }
  .el-input{
    width: 90%;
  }
}
</style>
