<template>
  <div
    v-loading="listLoading"
    class="opUser"
    :style="{
      padding: isPC ? '15px' :'0px'
    }"
  >
    <el-card>
      <div
        slot="header"
        class="title"
      >
        <h4>
          {{ userId ? '编辑用户':'创建账户' }}
        </h4>
      </div>
      <self-form
        ref="addUserForm"
        :class="isPC ? 'userForm' : ''"
        :pc-col="14"
        :m-block="true"
        :list-query="listQuery"
        :form-item="formItem"
        label-width="140px"
        :rules="rules"
        @onPass="handlePassClick"
      >
        <template slot="userName">
          <el-input
            v-model="listQuery.userName"
            maxlength="10"
            placeholder="请输入"
          />
        </template>
        <template slot="officeId">
          <el-cascader
            v-model="listQuery.officeId"
            :disabled="!!userId"
            placeholder="请选择"
            :props=" {
              checkStrictly: true,
              value: 'id',
              label: 'name',
              children: 'officeVOs'
            }"
            :options="officeArr"
            @change="handleOfficeIdChange"
          />
        </template>
        <template slot="roleId">
          <el-input
            v-if="!!userId"
            v-model="listQuery.roleName"
            :disabled="true"
          />
          <el-cascader
            v-else
            v-model="listQuery.roleId"
            placeholder="请选择"
            :props=" {
              value: 'id',
              label: 'dutyName',
              children: 'childDuty'
            }"
            :options="roleArr"
          />
        </template>
        <template slot="passwd">
          <el-input
            v-model.trim="listQuery.passwd"
            onkeyup="this.value=this.value.replace(' ','')"
            :disabled="!!userId"
            :readonly="!userId"
            placeholder="请输入"
            :type="!userId ? 'text' :'password'"
            :show-password="!!userId"
          />
        </template>
        <template
          v-if="userId"
          slot="confirmPassword"
        >
          <el-input
            v-model.trim="listQuery.confirmPassword"
            onkeyup="this.value=this.value.replace(' ','')"
            :disabled="!!userId"
            placeholder="请输入"
            type="password"
            show-password
          />
        </template>
        <template
          v-slot:mobile="scope"
        >
          <el-input
            v-model.trim="listQuery.mobile"
            :disabled="scope.row.status ===1&&listQuery.id!==''"
            maxlength="11"
            placeholder="请输入"
          />
        </template>
        <template
          v-slot:syncStatus="scope"
        >
          <span>{{ scope.row.syncStatus ? '已同步':'未同步' }}</span>
        </template>
        <template
          v-slot:crmUserStatus="scope"
        >
          <span>{{ scope.row.crmUserStatus }}</span>
        </template>
        <div
          slot="btn"
          :class="isPC ? 'btnPc' : 'mobile'"
        >
          <router-link
            :to="{path: '/system/user'}"
            style="margin-right:20px;"
          >
            <el-button>取消</el-button>
          </router-link>

          <!-- v-permission="['/v2/base/user/create','/v2/base/user/update']" -->
          <el-button
            type="primary"
            @click="handleValidateForm"
          >
            确定
          </el-button>
        </div>
      </self-form>
    </el-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { Form as ElForm } from 'element-ui'
import { ValidateFieldCallback } from 'element-ui/types/form.d'
import { phoneReg, isValidPassWord, lock } from '@/utils/index.ts'
import { getOfficeByCurrentUserV2 as getOfficeByCurrentUser, getDutyAndRoleList, RoleParams, addUser, modifyUser, userDetail } from '@/api/system'
import { delayTime } from '@/settings'
import { SettingsModule } from '@/store/modules/settings'
export interface FormObj {
  id?:number | string;
  userName: string;
  mobile: string;
  officeId: string|number [] ;
  roleId?: string|number [];
  passwd: string;
  confirmPassword: string;
  nickName: string;
  roleName?:string;
  crmUserStatus?:string;
  syncStatus?:boolean;
  status?:number;
}

interface RuleForm {
  userName: any[];
  mobile: any[];
  officeId: any[];
  roleId: any[];
  passwd: any[];
  confirmPassword: any[];
}

@Component({
  components: {
    SelfForm
  }
})
export default class extends Vue {
  userId:string| number = ''
  private listLoading:boolean = false
  private officeArr = [] // 组织架构列表
  private roleArr = [] // 角色列表
  private listQuery:FormObj = {
    id: '',
    userName: '',
    mobile: '',
    officeId: [],
    roleId: [],
    passwd: 'Aa123456',
    confirmPassword: '',
    nickName: '',
    roleName: '',
    crmUserStatus: '',
    syncStatus: false,
    status: 0
  }
  sourcePhone:string = ''
  private formItem:any[] = [
    // {
    //   type: 1,
    //   key: 'userName',
    //   label: '姓名:',
    //   tagAttrs: {
    //     placeholder: '请输入',
    //     maxlength: 10
    //   }
    // },
    {
      type: 'userName',
      key: 'userName',
      label: '姓名:',
      slot: true
    },
    {
      type: 'mobile',
      key: 'mobile',
      label: '电话:',
      slot: true
    },
    {
      key: 'officeId',
      type: 'officeId',
      label: '组织结构:',
      slot: true
    },
    {
      key: 'roleId',
      type: 'roleId',
      label: '角色:',
      slot: true
    },
    {
      key: 'passwd',
      type: 'passwd',
      label: '密码:',
      slot: true
    }
  ]
  private rules:any ={
    userName: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { validator: this.validatePhone, trigger: 'blur' }
    ],
    officeId: [
      { required: true, message: '请选择组织机构', trigger: 'blur' }
    ],
    roleId: [
      { required: true, message: '请选择角色', trigger: 'blur' }
    ],
    passwd: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
      { validator: this.validatePasswd, trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请输入确认密码', trigger: 'blur' },
      { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
      { validator: this.validateConfirmPassword, trigger: 'blur' }
    ]
  }

  // 验证手机号
  private validatePhone(rule:any, value:string, callback:(string?: Error) => void) {
    if (!/\d{8,11}/.test(value)) {
      return callback(new Error('请输入正确的手机号'))
    }
    return callback()
  }
  private validatePasswd(rule:any, value:string, callback:(string?: Error) => void) {
    if (!isValidPassWord.test(value)) {
      return callback(new Error('密码必须包含8-16，数字，大写字母，小写字母'))
    }
    return callback()
  }
  private validateConfirmPassword(rule:any, value:string, callback:(string?: Error) => void) {
    if (!isValidPassWord.test(value)) {
      return callback(new Error('密码必须包含8-16，数字，大写字母，小写字母'))
    } else if (value !== this.listQuery.passwd) {
      return callback(new Error('确认密码和密码不一致，请检查'))
    }
    return callback()
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 提交
  handlePassClick(valid:boolean) {
    if (this.listQuery.id) {
      this.modifyUser()
    } else {
      this.addUser()
    }
  }
  // 表单校验
  handleValidateForm() {
    ((this.$refs.addUserForm) as any).submitForm()
  }

  // 获取用户信息
  async getUserDetail() {
    try {
      if (!this.userId) {
        return false
      }

      let { data: res } = await userDetail(+this.userId)
      if (res.success) {
        let result = res.data
        let officeIds = this.getTreeSelectOffice(this.officeArr, result.officeId)
        this.sourcePhone = result.mobile
        this.listQuery = {
          id: result.id,
          userName: result.nickName,
          mobile: result.mobile,
          officeId: officeIds,
          roleName: result.roleName,
          passwd: '123456789qQ',
          confirmPassword: '123456789qQ',
          nickName: result.nickName,
          roleId: [result.roleId],
          crmUserStatus: result.crmUserStatus,
          syncStatus: result.syncStatus,
          status: result.status
        }
        if (result.syncStatus) {
          this.formItem.push({
            type: 'syncStatus',
            label: 'CRM账号同步状态:',
            slot: true
          })
          this.formItem.push({
            type: 'crmUserStatus',
            label: 'CRM账号状态:',
            slot: true
          })
        }
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get user info fail:${err}`)
    }
  }
  // 获取组织架构
  async getOfficeByCurrentUser() {
    try {
      let { data: res } = await getOfficeByCurrentUser()
      if (res.success) {
        let arrs = res.data
        let brrs = this.deeploopOffice(arrs)
        this.officeArr.push(...(brrs as []))
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get office fail:${err}`)
    }
  }
  // 组织架构数据改造
  deeploopOffice(arrs:any[]) {
    let brrs:any[] = []
    arrs.forEach(item => {
      if (item.type === 3) {
        item.disabled = true
      }
      if (item.officeVOs === null || item.officeVOs.length === 0) {
        delete item.officeVOs
      } else {
        let crr = this.deeploopOffice(item.officeVOs)
        item.officeVOs = crr
      }
      brrs.push(item)
    })
    return brrs
  }
  // 组织架构发生变化
  handleOfficeIdChange(val:number[]) {
    this.listQuery.roleId = []
    let obj:{
      [propName:string]:any
      } = {
        officeVOs: []
      }
    if (val.length >= 1) {
      obj = this.officeArr.filter((item:any) => item.id === val[0])[0]
    }

    if (val.length >= 2) {
      obj = obj.officeVOs.filter((item:any) => item.id === val[1])[0]
    }

    if (val.length >= 3) {
      obj = obj.officeVOs.filter((item:any) => item.id === val[2])[0]
    }
    if (val.length >= 4) {
      obj = obj.officeVOs.filter((item:any) => item.id === val[3])[0]
    }
    if (val.length >= 5) {
      obj = obj.officeVOs.filter((item:any) => item.id === val[4])[0]
    }
    // 目前最大是5级
    let officeLevel:number = 0
    if (obj.type === 1) { // 总部
      officeLevel = 1
    } else if (obj.type === 2) { // 大区
      officeLevel = 2
    } else { // 业务线
      officeLevel = 3
    }
    let params:RoleParams = {
      officeLevel
    }
    if (obj.type > 3) {
      params.dutyId = obj.dutyId
    }

    this.getDutyAndRoleList(params)
  }
  // 获取角色
  async getDutyAndRoleList(params:RoleParams) {
    try {
      let { data: res } = await getDutyAndRoleList(params)
      if (res.success) {
        let arrs = res.data
        this.roleArr = []
        let brrs = this.deeploopRole(arrs)
        this.roleArr.push(...(brrs as []))
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get role list fail:{err}`)
    }
  }
  // 角色列表数据改造
  deeploopRole(arrs:any[]) {
    let brrs:any[] = []
    arrs.forEach(item => {
      if (item.childDuty === null || item.childDuty.length === 0) {
        delete item.childDuty
        if (item.dutyLevel < 3) {
          item.disabled = true
        }
      } else {
        let crr = this.deeploopRole(item.childDuty)
        item.childDuty = crr
      }
      brrs.push(item)
    })
    return brrs
  }
  // 新增用户
  @lock
  async addUser() {
    try {
      this.listLoading = true
      let params:any = {
        ...this.listQuery,
        nickName: this.listQuery.userName,
        officeId: this.listQuery.officeId[this.listQuery.officeId.length - 1],
        roleId: (this.listQuery.roleId as [])[(this.listQuery.roleId as []).length - 1]
      }
      params.confirmPassword = params.passwd
      delete params.id
      delete params.roleName
      delete params.crmUserStatus
      delete params.syncStatus
      delete params.status
      let { data: res } = await addUser(params)
      if (res.success) {
        this.$message.success('创建成功')
        this.jumplist()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`addUser fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 修改用户
  async modifyUser() {
    try {
      this.listLoading = true
      let params:any = {
        id: this.listQuery.id,
        nickName: this.listQuery.userName,
        userName: this.listQuery.userName
      }
      if (this.sourcePhone !== this.listQuery.mobile) {
        params.mobile = this.listQuery.mobile
      }
      let { data: res } = await modifyUser(params)
      if (res.success) {
        if (this.sourcePhone !== this.listQuery.mobile && this.listQuery.syncStatus) {
          this.$message.success('无法更改CRM中手机号，建议在本系统重新创建以新手机号为账号，并同至CRM，并前往CRM中删除相关账号')
        } else {
          this.$message.success('修改成功')
        }
        this.jumplist()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`modify user fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 跳转到用户列表
  jumplist() {
    setTimeout(() => {
      this.$router.push({
        path: '/system/user'
      })
    }, delayTime)
  }
  // 组织架构获取回显数据
  getTreeSelectOffice(data:any, value:string|number) {
    let arr:any[] = []
    let setChecked = (obj:any) => {
      for (let key in obj) {
        if (!obj[key]) {
          return false
        }
        const offList = obj[key].parentIds.split(',').map((item:string|number) => +item)
        offList.push(obj[key].id)
        if (offList.includes(value)) {
          arr = offList
          return false
        }

        if (obj[key].officeVOs && obj[key].officeVOs.length > 0) {
          setChecked(obj[key].officeVOs)
        }
      }
    }
    setChecked(data)
    arr.shift()
    return arr
  }

  // 重置表单
  resetForm() {
    ((this.$refs.addUserForm) as any).resetForm()
    this.listQuery = {
      id: '',
      userName: '',
      mobile: '',
      officeId: [],
      roleId: [],
      passwd: '',
      confirmPassword: '',
      nickName: ''
    }
  }
  beforeRouteLeave(to:any, from:any, next:Function) {
    this.resetForm()
    next()
  }
  async mounted() {
    this.userId = +this.$route.query.userId || ''
    if (this.userId) {
      let add = {
        key: 'confirmPassword',
        type: 'confirmPassword',
        label: '确认密码:',
        slot: true
      }
      this.formItem.push(add)
    }
    await this.getOfficeByCurrentUser()
    this.getUserDetail()
  }
}
</script>
<style lang="scss" scoped>
  .opUser {
     .title {
      h4 {
        margin: 0px;
      }
     }
     .userForm {
       padding-left: 100px;
     }
     .btnPc {
       display: flex;
       flex-flow: row nowrap;
       justify-content: center;
     }
    .mobile {
      width:100%;
      text-align: center;
      .btnMobile {
        margin-left: 0;
        margin-top: 10px;
        width:80%;
      }
    }
  }
</style>

<style scoped>
  .opUser >>> .el-card {
    border:none;
  }
  .opUser >>> .el-card__header {
    border-bottom: none;
  }
</style>
