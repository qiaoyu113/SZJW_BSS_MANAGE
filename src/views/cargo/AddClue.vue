<template>
  <div
    v-loading="loading"
    :class="isPC ? 'AddClue' : 'AddClue-m'"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="isPC ? '160px' : '80px'"
    >
      <SectionContainer title="基本信息">
        <el-row>
          <el-col
            v-if="!isEdit"
            :span="isPC ? 6 : 24"
          >
            <el-form-item
              label="分配销售"
              prop="lineSaleId"
            >
              <el-select
                v-model="ruleForm.lineSaleId"
                placeholder="请选择"
                name="addclue_lineSaleId_select"
                clearable
                filterable
                :disabled="optionsSale.length === 1"
              >
                <el-option
                  v-for="(item, index) in optionsSale"
                  :key="index"
                  :label="item.name"
                  :value="Number(item.id)"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="线索来源"
              prop="clueSource"
            >
              <el-select
                v-model="ruleForm.clueSource"
                placeholder="请选择"
                name="addclue_clueSource_select"
                clearable
              >
                <el-option
                  v-for="(item, index) in optionsLineSource"
                  :key="index"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
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
                v-model="ruleForm.name"
                placeholder="请输入"
                name="addclue_name_input"
                maxlength="10"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="手机号码"
              prop="phone"
            >
              <el-input
                v-model="ruleForm.phone"
                placeholder="请输入"
                name="addclue_phone_input"
                maxlength="11"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="城市"
              prop="city"
            >
              <el-select
                v-model="ruleForm.city"
                placeholder="请选择"
                name="addclue_city_select"
                clearable
                filterable
                :disabled="optionsCity.length === 1"
              >
                <el-option
                  v-for="(item, index) in optionsCity"
                  :key="index"
                  :label="item.name"
                  :value="Number(item.code)"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="详细地址"
              prop="address"
            >
              <el-input
                v-model="ruleForm.address"
                name="addclue_address_input"
                placeholder="请输入"
                maxlength="50"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="职务"
              prop="position"
            >
              <el-input
                v-model="ruleForm.position"
                name="addclue_position_input"
                placeholder="请输入"
                maxlength="20"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="公司"
              prop="company"
            >
              <el-input
                v-model="ruleForm.company"
                name="addclue_company_input"
                placeholder="请输入"
                maxlength="20"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="备注"
              prop="remark"
            >
              <el-input
                v-model="ruleForm.remark"
                name="addclue_remark_input"
                type="textarea"
                :autosize="{minRows: 2, maxRows: 4}"
                placeholder="请输入"
                maxlength="300"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>
      <SectionContainer
        v-if="isEdit && details.clueState !== 0"
        title="需求信息"
      >
        <el-row>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item
              label="是否需继续跟进"
              prop="isFollowUp"
            >
              <el-radio-group
                v-model="ruleForm.isFollowUp"
                :disabled="details.clueState === 2"
              >
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
                <el-button
                  name="addclue_addCarType_btn"
                  @click="addCar"
                >
                  添加+
                </el-button>
              </div>
              <el-col :span="isPC ? 6 : 18">
                <el-select
                  v-model="item.demandCarType"
                  placeholder="请选择"
                  clearable
                  filterable
                  :name="`addclue_demandCarType${index}_select`"
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
                  :name="`addclue_demandNo${index}_input`"
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
                  :name="`addclue_remove${index}_btn`"
                  @click="removeCar(index)"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>

      <SectionContainer
        v-if="isEdit && details.clueState !== 0"
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
              v-if="
                ruleForm.lineClueFollowForms.length < 10 &&
                  details.clueState !== 2
              "
              name="addclue_record_btn"
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
          name="addclue_submit_btn"
          @click="submitForm('ruleForm')"
        >
          提交
        </el-button>
        <el-button
          name="addclue_reset_btn"
          @click="resetForm('ruleForm')"
        >
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

import { GetDictionaryList, GetManagerLists } from '@/api/common'
import {
  GetLineClueDetail,
  SaveLineClue,
  EditLineClue,
  GetCustomerOff
} from '@/api/cargo'

import '@/styles/common.scss'
@Component({
  name: 'AddClue',
  components: {
    SectionContainer
  }
})
export default class extends Vue {
  private details: any = {};
  private loading: boolean = false;
  private id: any = '';
  private isEdit: boolean = false; // 是否是编辑页面
  private optionsCity: any = [];
  private optionsCar: any = [];
  private optionsSale: any = [];
  private optionsLineSource: any = [];
  private ruleForm: any = {
    address: '',
    city: '',
    clueId: '',
    clueSource: '',
    company: '',
    isFollowUp: '',
    lineClueDemandForms: [],
    lineClueFollowForms: [],
    lineSaleId: '',
    name: '',
    phone: '',
    position: '',
    remark: ''
  };
  private rules: any = {
    isFollowUp: [
      { required: true, message: '请选择是否继续跟进', trigger: 'change' }
    ],
    clueSource: [
      { required: true, message: '请选择线索来源', trigger: 'change' }
    ],
    name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'change' },
      {
        pattern: /^1\d{10}$/,
        message: '请输入正确格式的手机号',
        trigger: 'change'
      }
    ],
    city: [{ required: true, message: '请选择城市', trigger: 'change' }]
  };

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 车型&车型数量表单验证
  private validateCar(rule: any, value: any, callback: any) {
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
  // 提交表单
  private submitForm(formName: any) {
    (this.$refs[formName] as any).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        let subForm = SaveLineClue
        let successMsg = '新增成功'
        const postData = { ...this.ruleForm }
        if (this.details && this.details.clueState === 0) {
          postData.isFollowUp = null
        }
        if (this.isEdit) {
          if (this.details && this.details.clueState === 2) {
            postData.isFollowUp = null
          }
          subForm = EditLineClue
          successMsg = '编辑成功'
        }
        const { data } = await subForm(postData)
        this.loading = false
        if (data.success) {
          this.$message.success(successMsg);
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
    this.ruleForm['lineClueDemandForms'] =
      this.details.clueState !== 0
        ? [
          {
            demandCarType: '',
            demandNo: ''
          }
        ]
        : []
    const list = this.ruleForm['lineClueFollowForms'].filter((a: any) => a.id)
    if (list.length > 0) {
      this.ruleForm['lineClueFollowForms'] = list
    } else if (this.details.clueState !== 0) {
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
  // 获取销售
  private async getSaleList() {
    const { data } = await GetManagerLists({
      uri: '/v1/line/clue/save'
    })
    if (data.success) {
      this.optionsSale = data.data
      if (this.optionsSale.length === 1) {
        this.ruleForm.lineSaleId = Number(this.optionsSale[0].id)
      }
    } else {
      this.$message.error(data)
    }
  }
  private async getCustomerOff() {
    const { data } = await GetCustomerOff()
    if (data.success) {
      // console.log(data.data)
      const list = data.data
      this.optionsCity = list
      if (this.optionsCity.length === 1) {
        this.ruleForm.city = Number(this.optionsCity[0].code)
      }
    } else {
      this.$message.error(data)
    }
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
      clueId: this.id,
      info: 'edit'
    })
    this.loading = false
    if (data.success) {
      const detail = data.data
      this.details = data.data
      const {
        address,
        city,
        clueId,
        clueSource,
        company,
        lineClueFollowVos,
        lineClueDemandVos,
        isTransform,
        lineSaleId,
        name,
        phone,
        position,
        remark
      } = detail

      if (lineClueFollowVos && lineClueFollowVos.length > 0) {
        this.ruleForm.lineClueFollowForms = lineClueFollowVos
      } else if (this.details.clueState !== 0) {
        this.ruleForm.lineClueFollowForms = [
          {
            demandCarType: '',
            demandNo: ''
          }
        ]
      }
      if (lineClueDemandVos && lineClueDemandVos.length > 0) {
        this.ruleForm.lineClueDemandForms = lineClueDemandVos
      } else if (this.details.clueState !== 0) {
        this.ruleForm.lineClueDemandForms = [
          {
            visitAddress: '',
            visitDate: '',
            visitRecord: ''
          }
        ]
      }
      this.ruleForm.isFollowUp = isTransform
      this.ruleForm.address = address
      this.ruleForm.city = city
      this.ruleForm.clueId = clueId
      this.ruleForm.clueSource = clueSource
      this.ruleForm.company = company
      this.ruleForm.lineSaleId = lineSaleId
      this.ruleForm.name = name
      this.ruleForm.phone = phone
      this.ruleForm.position = position
      this.ruleForm.remark = remark
    } else {
      this.$message.error(data)
    }
  }
  private async getDictionaryList() {
    const { data } = await GetDictionaryList([
      'Intentional_compartment',
      'line_clue_source'
    ])
    if (data.success) {
      this.optionsCar = data.data.Intentional_compartment
      this.optionsLineSource = data.data.line_clue_source
    } else {
      this.$message.error(data)
    }
  }
  private fetchData() {
    this.getDictionaryList()
    this.getCustomerOff()
    this.getSaleList()
    if (this.isEdit) {
      this.getDetail()
    }
  }
  mounted() {
    this.id = this.$route.query.id
    this.isEdit = this.$route.name === 'EditClue'
    this.ruleForm.clueId = this.id
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped>
.AddClue {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .btn_box {
    padding-top: 20px;
    box-sizing: border-box;
  }
}
.AddClue-m {
  .add-follow {
    height: 45px;
  }
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
}

</style>
