<template>
  <div class="ConversionClue">
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
              label="公司简称"
              prop="name"
            >
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="公司主体公司"
              prop="name"
            >
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="合同止期"
              prop="name"
            >
              <el-date-picker
                v-model="ruleForm.name"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="分类"
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
              label="业务对接人姓名"
              prop="name"
            >
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="业务对接人联系电话"
              prop="name"
            >
              <el-input
                v-model="ruleForm.name"
                maxlength="11"
                placeholder="请输入"
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
              prop="name"
            >
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="详细地址"
              prop="name"
            >
              <el-upload
                list-type="picture-card"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img
                  :src="dialogImageUrl"
                  width="100%"
                  alt=""
                >
              </el-dialog>
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
import { TagsViewModule } from '@/store/modules/tags-view'

import '@/styles/common.scss'
@Component({
  name: 'ConversionClue',
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
    // this.id = this.$route.query.id
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
.el-select{
  display: block;
}
.el-date-editor{
  display: block;
  width: auto;
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
