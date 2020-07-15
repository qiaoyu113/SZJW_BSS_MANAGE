<template>
  <div :class="isPC ? 'CreateUser' : 'CreateUser-m'">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="isPC ? '160px' : '80px'"
    >
      <SectionContainer :title="isEdit ? '编辑账号' : '创建账号'">
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="姓名"
              prop="userName"
            >
              <el-input
                v-model="ruleForm.userName"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="电话"
              prop="mobile"
            >
              <el-input
                v-model="ruleForm.mobile"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="角色"
              prop="roleId"
            >
              <el-select
                v-model="ruleForm.roleId"
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
              label="组织机构"
              prop="officeId"
            >
              <el-input
                v-model="ruleForm.officeId"
                placeholder="请输入"
                maxlength="10"
              />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="密码"
              prop="passwd"
            >
              <el-input
                v-model="ruleForm.passwd"
                placeholder="请输入"
                maxlength="10"
              />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="确认密码"
              prop="passwd2"
            >
              <el-select
                v-model="ruleForm.passwd2"
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
import { getOfficeList } from '@/api/system'
import '@/styles/common.scss'
@Component({
  name: 'CreateUser',
  components: {
    SectionContainer
  }
})
export default class extends Vue {
  private isEdit: boolean = false; // 是否是编辑页面
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
    userName: [
      { required: true, message: '请输入活动名称', trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '请选择活动区域', trigger: 'change' }
    ],
    roleId: [
      { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
    ],
    officeId: [
      { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
    ],
    passwd: [
      { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
    ],
    passwd2: [
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

  // 获取组织列表
  private async getOfficeList() {
    const { data } = await getOfficeList()
    console.log(data)
    if (data.success) {
      // this.optionsCity = data.data
    } else {
      this.$message.error(data)
    }
  }

  mounted() {
    this.getOfficeList()
    // this.id = this.$route.query.id
    console.log(this.$route)
    this.isEdit = this.$route.name === 'EditUser'
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
</style>
<style lang="scss" scope>
.el-collapse-item__content {
  padding-bottom: 0;
}
.el-form-item__label {
  color: #999999;
}
</style>
