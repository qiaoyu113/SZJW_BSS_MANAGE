<template>
  <div :class="isPC ? 'AddClue' : 'AddClue-m'">
    <el-form
      v-if="!isFollow"
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
        <el-form-item v-if="!isEdit">
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
      <SectionContainer title="需求信息">
        <el-row>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item
              label="是否需继续跟进"
              prop="name"
            >
              <el-radio-group v-model="ruleForm.name">
                <el-radio
                  label="是"
                  value="1"
                />
                <el-radio
                  label="否"
                  value="2"
                />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 18 : 24">
            <el-form-item
              label="需求车型"
            >
              <div class="mb10">
                <el-button @click="addCar">
                  添加+
                </el-button>
              </div>
              <el-row
                class="add-car"
              >
                <el-col
                  :span="isPC ? 6 : 18"
                >
                  <el-select
                    v-model="ruleForm.name"
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
                </el-col>
                <el-col :span="isPC ? 6 : 18">
                  <el-input
                    v-model="ruleForm.name"
                    placeholder="请输入内容"
                  >
                    <template slot="append">
                      辆
                    </template>
                  </el-input>
                </el-col>
                <el-col :span="isPC ? 6 : 6">
                  <el-button
                    class="ml10"
                    type="danger"
                    icon="el-icon-close"
                    circle
                  />
                </el-col>
              </el-row>
              <el-row
                class="add-car"
              >
                <el-col
                  :span="isPC ? 6 : 18"
                >
                  <el-select
                    v-model="ruleForm.name"
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
                </el-col>
                <el-col :span="isPC ? 6 : 18">
                  <el-input
                    v-model="ruleForm.name"
                    placeholder="请输入内容"
                  >
                    <template slot="append">
                      辆
                    </template>
                  </el-input>
                </el-col>
                <el-col :span="isPC ? 6 : 6">
                  <el-button
                    class="ml10"
                    type="danger"
                    icon="el-icon-close"
                    circle
                  />
                </el-col>
              </el-row>
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
            <el-button>
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
            class="follow-card"
            :span="isPC ? 10 : 24"
          >
            <div class="card-tit">
              <div class="card-t">
                跟进记录1
              </div>
              <el-button
                class="card-del"
                type="danger"
                icon="el-icon-close"
                circle
              />
            </div>
            <div class="card-box">
              <el-form-item
                label="拜访时间"
                prop="name"
                label-width="80px"
              >
                <el-date-picker
                  v-model="ruleForm.name"
                  type="datetime"
                  placeholder="选择日期时间"
                />
              </el-form-item>
              <el-form-item
                label="拜访地址"
                prop="name"
                label-width="80px"
              >
                <el-input
                  v-model="ruleForm.name"
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item
                label="拜访记录"
                prop="name"
                label-width="80px"
              >
                <el-input
                  v-model="ruleForm.name"
                  placeholder="请输入"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col
            class="follow-card"
            :span="isPC ? 10 : 24"
          >
            <div class="card-tit">
              <div class="card-t">
                跟进记录1
              </div>
              <el-button
                class="card-del"
                type="danger"
                icon="el-icon-close"
                circle
              />
            </div>
            <div class="card-box">
              <el-form-item
                label="拜访时间"
                prop="name"
                label-width="80px"
              >
                <el-date-picker
                  v-model="ruleForm.name"
                  type="datetime"
                  placeholder="选择日期时间"
                />
              </el-form-item>
              <el-form-item
                label="拜访地址"
                prop="name"
                label-width="80px"
              >
                <el-input
                  v-model="ruleForm.name"
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item
                label="拜访记录"
                prop="name"
                label-width="80px"
              >
                <el-input
                  v-model="ruleForm.name"
                  placeholder="请输入"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col
            class="follow-card"
            :span="isPC ? 10 : 24"
          >
            <div class="card-tit">
              <div class="card-t">
                跟进记录1
              </div>
              <el-button
                class="card-del"
                type="danger"
                icon="el-icon-close"
                circle
              />
            </div>
            <div class="card-box">
              <el-form-item
                label="拜访时间"
                prop="name"
                label-width="80px"
              >
                <el-date-picker
                  v-model="ruleForm.name"
                  type="datetime"
                  placeholder="选择日期时间"
                />
              </el-form-item>
              <el-form-item
                label="拜访地址"
                prop="name"
                label-width="80px"
              >
                <el-input
                  v-model="ruleForm.name"
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item
                label="拜访记录"
                prop="name"
                label-width="80px"
              >
                <el-input
                  v-model="ruleForm.name"
                  placeholder="请输入"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-form-item v-if="isEdit">
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
    <el-form
      v-if="isFollow"
      ref="followForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="isPC ? '160px' : '80px'"
    >
      <SectionContainer title="需求信息">
        <el-row>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item
              label="是否需继续跟进"
              prop="name"
            >
              <el-radio-group v-model="ruleForm.name">
                <el-radio
                  label="是"
                  value="1"
                />
                <el-radio
                  label="否"
                  value="2"
                />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 18 : 24">
            <el-form-item
              label="需求车型"
            >
              <div class="mb10">
                <el-button @click="addCar">
                  添加+
                </el-button>
              </div>
              <el-row
                type="flex"
                justify="space-between"
                class="wrap"
              >
                <el-col
                  :span="isPC ? 6 : 16"
                  class="mr10 mb10"
                >
                  <el-select
                    v-model="ruleForm.name"
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
                </el-col>
                <el-col :span="isPC ? 6 : 16">
                  <el-input
                    v-model="ruleForm.name"
                    placeholder="请输入内容"
                  >
                    <template slot="append">
                      辆
                    </template>
                  </el-input>
                </el-col>
                <el-col :span="isPC ? 6 : 6">
                  <el-button type="danger">
                    删除
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
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
  name: 'AddClue',
  components: {
    SectionContainer
  }
})
export default class extends Vue {
  private isEdit: boolean = false; // 是否是编辑页面
  private isFollow: boolean = false; // 是否是跟进页面
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

  private addCar() {
    console.log('添加车型')
  }
  mounted() {
    // this.id = this.$route.query.id
    this.isEdit = this.$route.name === 'EditClue'
    this.isFollow = this.$route.name === 'FollowUpClue'
    // console.log(this.$router)
    // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   type: 'warning'
    // }).then(() => {
    //   (TagsViewModule as any).delView(this.$route); // 关闭当前页面
    //   (TagsViewModule as any).delCachedView({ // 删除指定页面缓存（进行刷新操作）
    //     name: 'ClueList'
    //   })
    //   this.$nextTick(() => {
    //     this.$router.push({ name: 'ClueList' })
    //   })
    // })
  }
}
</script>

<style lang="scss" scoped>
.el-select,
.el-date-editor{
  width: auto;
  display: block;
}
.wrap{
  flex-wrap: wrap;
}
.mb10{
  margin-bottom: 10px;
}
.mr10{
  margin-right: 10px;
}
.ml10{
  margin-left: 10px;
}
.add-car:not(:nth-last-of-type(1)){
  margin-bottom: 20px;
}
.posr{
  position: relative;
  .add-follow{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 58px;
    text-align: center;
  }
}
.SectionContainer,
.SectionContainer-m{
  .follow-card{
    margin-bottom: 20px;
    border-radius: 4px;
    border: 1px solid #DDE2EE;
    background: #FAFBFC;
    .card-tit{
      position: relative;
      height: 32px;
      line-height: 32px;
      background: #DDE2EE;
      font-size: 14px;
      color: #838A9D;
      text-align: center;
      border-radius: 4px 4px 0 0;
    }
    .card-del{
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
    }
    .card-box{
      padding: 24px 30px;
    }
  }
}
.SectionContainer-m{
  .add-follow{
    height: 45px;
  }
}
</style>
<style lang="scss" scope>
.el-collapse-item__content {
  padding-bottom: 0;
}
.el-form-item__label {
  color: #999999;
}
</style>
