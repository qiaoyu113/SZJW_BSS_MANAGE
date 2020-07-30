<template>
  <div
    v-loading="loading"
    :class="isPC ? 'CreateUser' : 'CreateUser-m'"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="isPC ? '100px' : '80px'"
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
                placeholder="请输入姓名"
                maxlength="5"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="手机号"
              prop="mobile"
            >
              <el-input
                v-model="ruleForm.mobile"
                clearable
                placeholder="请输入手机号"
                maxlength="11"
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
                clearable
              >
                <el-option
                  v-for="item in optionsRoles"
                  :key="item.id"
                  :label="item.nick"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="组织机构"
              prop="officeId"
            >
              <el-cascader
                ref="cascaderOff"
                v-model="officeList"
                :options="optionsOffice"
                :show-all-levels="false"
                :props="{
                  label: 'name',
                  value: 'id',
                  children: 'officeVOs',
                  checkStrictly: true
                }"
                clearable
                @change="handleChange"
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
                type="password"
                autocomplete="off"
                placeholder="默认密码为手机号"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="确认密码"
              prop="checkPass"
            >
              <el-input
                v-model="ruleForm.checkPass"
                type="password"
                autocomplete="off"
                placeholder="请再次输入密码"
                clearable
              />
            </el-form-item>
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
import {
  roleList,
  getOfficeByCurrentUser,
  createUser,
  updateUser,
  userDetail
} from '@/api/system'
import '@/styles/common.scss'
import { off } from 'codemirror'
@Component({
  name: 'CreateUser',
  components: {
    SectionContainer
  }
})
export default class extends Vue {
  private loading: boolean = false;
  private isEdit: boolean = false; // 是否是编辑页面
  private id: any = '';
  private ruleForm: any = {
    mobile: '',
    nickName: '',
    officeId: '',
    passwd: '',
    checkPass: '',
    roleId: '',
    userName: ''
  };
  private details: any = {};
  private rules: any = {
    userName: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      {
        pattern: /^(?:[\u4e00-\u9fa5·]{2,5})$/,
        message: '请输入2-5个中文',
        trigger: 'blur'
      }
    ],
    mobile: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1\d{10}$/, message: '请输入正确格式手机号', trigger: 'blur' }
    ],
    roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
    officeId: [
      {
        type: 'date',
        required: true,
        message: '请选择组织机构',
        trigger: 'change'
      }
    ],
    passwd: [{ validator: this.validatePasswd, trigger: 'blur' }],
    checkPass: [{ validator: this.validateCheckPass, trigger: 'blur' }]
  };
  private optionsRoles: any[] = [];
  private optionsOffice: any[] = [];
  private officeList: any[] = [];

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  private validatePasswd(rule: any, value: any, callback: any) {
    if (value === '') {
      callback()
    } else {
      const passwdReg = /^\S*(?=\S{8,16})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])\S*$/
      if (!passwdReg.test(value)) {
        callback(new Error('密码为8-16位，必须包含数字，大写字母，小写字母'))
      } else {
        callback()
      }
    }
  }
  private validateCheckPass(rule: any, value: any, callback: any) {
    if (this.ruleForm.passwd !== '' && this.ruleForm.checkPass === '') {
      callback(new Error('请再次输入密码'))
    } else if (this.ruleForm.passwd !== this.ruleForm.checkPass) {
      callback(new Error('两次输入密码不一致'))
    } else {
      callback()
    }
  }
  private submitForm(formName: any) {
    (this.$refs[formName] as any).validate(async(valid: boolean) => {
      if (valid) {
        if (this.isEdit) {
          // 编辑
          this.updateUser()
        } else {
          // 创建
          this.createUser()
        }
      }
    })
  }
  private async createUser() {
    this.loading = true
    const postData = {
      ...this.ruleForm
    }
    postData.nickName = postData.userName
    delete postData.checkPass
    const { data } = await createUser(postData)
    this.loading = false
    if (data.success) {
      this.$message.success(`创建成功`)
      setTimeout(() => {
        (TagsViewModule as any).delView(this.$route); // 关闭当前页面
        (TagsViewModule as any).delCachedView({
          // 删除指定页面缓存（进行刷新操作）
          name: 'UserManage'
        })
        this.$nextTick(() => {
          this.$router.push({ name: 'UserManage' })
        })
      }, 800)
    } else {
      this.$message.error(data)
    }
  }
  private async updateUser() {
    this.loading = true
    const postData = {
      ...this.ruleForm
    }
    postData.nickName = postData.userName
    delete postData.checkPass
    const { data } = await updateUser(postData)
    this.loading = false
    if (data.success) {
      this.$message.success(`编辑成功`)
      setTimeout(() => {
        (TagsViewModule as any).delView(this.$route); // 关闭当前页面
        (TagsViewModule as any).delCachedView({
          // 删除指定页面缓存（进行刷新操作）
          name: 'UserManage'
        })
        this.$nextTick(() => {
          this.$router.push({ name: 'UserManage' })
        })
      }, 800)
    } else {
      this.$message.error(data)
    }
  }
  private resetForm(formName: any) {
    this.ruleForm.mobile = ''
    this.ruleForm.nickName = ''
    this.ruleForm.officeId = ''
    this.ruleForm.passwd = ''
    this.ruleForm.checkPass = ''
    this.ruleForm.roleId = ''
    this.ruleForm.userName = ''
    this.officeList = []
    this.$nextTick(() => {
      (this.$refs[formName] as any).clearValidate()
    })
  }
  private handleChange(value: any) {
    this.ruleForm.officeId = value.slice().pop() || ''
  }
  // 获取角色
  private async getRoleList() {
    const { data } = await roleList()
    if (data.success) {
      this.optionsRoles = data.data
    } else {
      this.$message.error(data)
    }
  }
  // 获取组织管理列表
  private async getOfficeByCurrentUser() {
    const { data } = await getOfficeByCurrentUser()
    if (data.success) {
      const tree = this.traverseTree(data.data)
      this.optionsOffice = tree.data
      if (tree.arr.length > 0) {
        this.officeList = tree.arr.slice().pop()
      }
    } else {
      this.$message.error(data)
    }
  }
  private traverseTree(data: any) {
    let arr: any[] = []
    var setChecked = (list: any) => {
      for (var i in list) {
        if (!list[i]) {
          return
        }
        const offList = list[i].parentIds.split(',')
        offList.push(list[i].id)
        if (offList.includes(this.details.officeId)) {
          arr = offList
        }
        if (list[i].officeVOs && list[i].officeVOs.length > 0) {
          setChecked(list[i].officeVOs)
        } else {
          delete list[i].officeVOs
        }
      }
    }
    setChecked(data)
    return { data, arr }
  }
  private async fetchData() {
    if (this.isEdit) {
      const { data } = await userDetail(this.id)
      if (data.success) {
        const form = data.data
        this.details = data.data
        this.ruleForm.id = form.id
        this.ruleForm.mobile = form.mobile
        this.ruleForm.nickName = form.nickName
        this.ruleForm.userName = form.nickName
        this.ruleForm.officeId = form.officeId
        this.ruleForm.roleId = form.roleId
      } else {
        this.$message.error(data)
      }
    }
    this.getOfficeByCurrentUser()
    this.getRoleList()
  }
  mounted() {
    this.id = this.$route.query.id
    this.isEdit = this.$route.name === 'EditUser'
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped>
.CreateUser {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .btn_box {
    padding-top: 20px;
    box-sizing: border-box;
  }
}
.CreateUser-m {
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
.CreateUser,
.CreateUser-m {
  .el-select,
  .el-cascader,
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
}
</style>
