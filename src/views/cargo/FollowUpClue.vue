<template>
  <div
    v-loading="loading"
    :class="isPC ? 'FollowUpClue' : 'FollowUpClue-m'"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="isPC ? '160px' : '80px'"
    >
      <SectionContainer title="需求信息">
        <el-row>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item
              label="是否需继续跟进"
              prop="isFollowUp"
            >
              <el-radio-group v-model="ruleForm.isFollowUp">
                <el-radio :label="1">
                  是
                </el-radio>
                <el-radio :label="2">
                  否
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 18 : 24">
            <el-form-item
              v-for="(item, index) in ruleForm.lineClueDemandForms"
              :key="index"
              :label="index === 0 ? '需求车型' : ''"
              :prop="'lineClueDemandForms.' + index + '.demandCarType'"
              :rules="{
                required: true,
                validator: validateCar,
                trigger: 'blur'
              }"
            >
              <div
                v-if="index === 0 && ruleForm.lineClueDemandForms.length < 4"
                class="mb10"
              >
                <el-button @click="addCar">
                  添加+
                </el-button>
              </div>
              <el-col :span="isPC ? 6 : 18">
                <el-select
                  v-model="item.demandCarType"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="city in optionsCar"
                    :key="city.dictValue"
                    :label="city.dictLabel"
                    :value="Number(city.dictValue)"
                  />
                </el-select>
              </el-col>
              <el-col :span="isPC ? 6 : 18">
                <el-input
                  v-model="item.demandNo"
                  v-only-number="{min: 1, max: 100}"
                  placeholder="请输入车型数量"
                  clearable
                >
                  <template slot="append">
                    辆
                  </template>
                </el-input>
              </el-col>
              <el-col
                v-if="index !== 0"
                :span="isPC ? 6 : 6"
              >
                <el-button
                  class="ml10"
                  type="danger"
                  icon="el-icon-close"
                  circle
                  @click="removeCar(index)"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>

      <SectionContainer
        title="跟进记录"
        class="posr"
      >
        <el-row
          class="add-follow"
          type="flex"
          justify="center"
          align="middle"
        >
          <el-col :span="12">
            <el-button
              v-if="ruleForm.lineClueFollowForms.length < 10"
              @click="addFollow"
            >
              添加跟进记录
            </el-button>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          justify="space-between"
          class="wrap"
        >
          <el-col
            v-for="(item, index) in ruleForm.lineClueFollowForms"
            :key="index"
            class="follow-card"
            :span="isPC ? 10 : 24"
          >
            <div class="card-tit">
              <div class="card-t">
                跟进记录{{ index + 1 }}
              </div>
              <el-button
                v-if="index !== 0 && !item.id"
                class="card-del"
                type="danger"
                icon="el-icon-close"
                circle
                @click="removeFollow(index)"
              />
            </div>
            <div class="card-box">
              <el-form-item
                label="拜访时间"
                :prop="'lineClueFollowForms.' + index + '.visitDate'"
                label-width="80px"
                :rules="{
                  required: true,
                  message: '请选择拜访时间',
                  trigger: 'change'
                }"
              >
                <el-date-picker
                  v-model="item.visitDate"
                  :disabled="!!item.id"
                  type="datetime"
                  placeholder="选择日期时间"
                  clearable
                  :editable="false"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
              <el-form-item
                label="拜访地址"
                label-width="80px"
                :prop="'lineClueFollowForms.' + index + '.visitAddress'"
                :rules="{
                  required: true,
                  message: '请输入拜访地址',
                  trigger: 'change'
                }"
              >
                <el-input
                  v-model="item.visitAddress"
                  :disabled="!!item.id"
                  placeholder="请输入"
                  maxlength="50"
                  clearable
                />
              </el-form-item>
              <el-form-item
                label="拜访记录"
                label-width="80px"
                :prop="'lineClueFollowForms.' + index + '.visitRecord'"
                :rules="{
                  required: true,
                  message: '请输入拜访记录',
                  trigger: 'change'
                }"
              >
                <el-input
                  v-model="item.visitRecord"
                  :disabled="!!item.id"
                  placeholder="请输入"
                  maxlength="200"
                  clearable
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </SectionContainer>
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
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { TagsViewModule } from '@/store/modules/tags-view'

import { GetDictionaryList } from '@/api/common'
import { GetLineClueDetail, IsFollowClue } from '@/api/cargo'

import '@/styles/common.scss'
@Component({
  name: 'FollowUpClue',
  components: {
    SectionContainer
  }
})
export default class extends Vue {
  private loading: boolean = false;
  private id: any = '';
  private optionsCar: any = [];
  private ruleForm: any = {
    clueId: '',
    isFollowUp: '',
    lineClueDemandForms: [],
    lineClueFollowForms: []
  };
  private rules: any = {
    isFollowUp: [
      { required: true, message: '请选择是否继续跟进', trigger: 'change' }
    ]
  };

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  private validateCar(rule: any, value: any, callback: any) {
    // console.log(rule, value)
    const index = rule.field.split('.')[1]
    const item = this.ruleForm.lineClueDemandForms[index]
    if (!item.demandCarType) {
      callback(new Error(`请选择车型`))
      return
    }
    if (!item.demandNo) {
      callback(new Error(`请输入车型数量`))
      return
    }
    callback()
  }
  private submitForm(formName: any) {
    (this.$refs[formName] as any).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        const { data } = await IsFollowClue(this.ruleForm)
        this.loading = false
        if (data.success) {
          this.$message.success(`保存成功`);
          (TagsViewModule as any).delView(this.$route); // 关闭当前页面
          (TagsViewModule as any).delCachedView({
            // 删除指定页面缓存（进行刷新操作）
            name: 'ClueList'
          })
          this.$nextTick(() => {
            this.$router.push({ name: 'ClueList' })
          })
        } else {
          this.$message.error(data)
        }
      }
    })
  }

  private resetForm(formName: any) {
    (this.$refs[formName] as any).resetFields()
    this.ruleForm['lineClueDemandForms'] = [
      {
        demandCarType: '',
        demandNo: ''
      }
    ]
    const list = this.ruleForm['lineClueFollowForms'].filter((a: any) => a.id)
    if (list.length > 0) {
      this.ruleForm['lineClueFollowForms'] = list
    } else {
      this.ruleForm['lineClueFollowForms'] = [
        {
          visitAddress: '',
          visitDate: '',
          visitRecord: ''
        }
      ]
    }
  }
  private removeCar(index: number) {
    this.ruleForm.lineClueDemandForms.splice(index, 1)
  }
  private addCar() {
    // console.log('添加车型')
    this.ruleForm.lineClueDemandForms.push({
      demandCarType: '',
      demandNo: ''
    })
  }
  private removeFollow(index: number) {
    this.ruleForm.lineClueFollowForms.splice(index, 1)
  }
  private addFollow() {
    // console.log('添加车型')
    this.ruleForm.lineClueFollowForms.push({
      visitAddress: '',
      visitDate: '',
      visitRecord: ''
    })
  }

  private async getDetail() {
    this.loading = true
    const { data } = await GetLineClueDetail({
      clueId: this.id
    })
    this.loading = false
    if (data.success) {
      const detail = data.data
      const { lineClueFollowVos, lineClueDemandVos } = data.data
      if (lineClueFollowVos && lineClueFollowVos.length > 0) {
        this.ruleForm.lineClueFollowForms = lineClueFollowVos
      } else {
        this.ruleForm.lineClueFollowForms = [
          {
            demandCarType: '',
            demandNo: ''
          }
        ]
      }
      if (lineClueDemandVos && lineClueDemandVos.length > 0) {
        this.ruleForm.lineClueDemandForms = lineClueDemandVos
      } else {
        this.ruleForm.lineClueDemandForms = [
          {
            visitAddress: '',
            visitDate: '',
            visitRecord: ''
          }
        ]
      }
      this.ruleForm.isFollowUp = detail.isTransform
    } else {
      this.$message.error(data)
    }
  }
  private async getDictionaryList() {
    const { data } = await GetDictionaryList(['Intentional_compartment'])
    if (data.success) {
      this.optionsCar = data.data.Intentional_compartment
    } else {
      this.$message.error(data)
    }
  }
  private fetchData() {
    this.getDictionaryList()
    this.getDetail()
  }
  mounted() {
    this.id = this.$route.query.id
    this.ruleForm.clueId = this.id
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped>
.FollowUpClue {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .btn_box {
    padding-top: 20px;
    box-sizing: border-box;
  }
}
.FollowUpClue-m {
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
.SectionContainer,
.SectionContainer-m {
  .el-select,
  .el-date-editor {
    width: auto;
    display: block;
  }
  .wrap {
    flex-wrap: wrap;
  }
  .mb10 {
    margin-bottom: 10px;
  }
  .mr10 {
    margin-right: 10px;
  }
  .ml10 {
    margin-left: 10px;
  }
  .add-car:not(:nth-last-of-type(1)) {
    margin-bottom: 20px;
  }
  &.posr {
    position: relative;
    .add-follow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 58px;
      text-align: center;
    }
  }

  .follow-card {
    margin-bottom: 20px;
    border-radius: 4px;
    border: 1px solid #dde2ee;
    background: #fafbfc;
    .card-tit {
      position: relative;
      height: 32px;
      line-height: 32px;
      background: #dde2ee;
      font-size: 14px;
      color: #838a9d;
      text-align: center;
      border-radius: 4px 4px 0 0;
    }
    .card-del {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
    }
    .card-box {
      padding: 24px 30px;
    }
  }
}
.SectionContainer-m {
  .add-follow {
    height: 45px;
  }
}
</style>
