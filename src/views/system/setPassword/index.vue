<!--  -->
<template>
  <div
    :class="isSetAll ? 'p15 resetPassowrd v-modal' : 'p15 resetPassowrd'"
  >
    <el-card class="box-card">
      <div slot="header">
        <span>修改密码</span>
      </div>
      <div class="passwordBox">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
          validate-on-rule-change
        >
          <div class="contentBox">
            <el-form-item
              label="原密码"
              prop="oldPassword"
            >
              <el-input
                v-model.trim="ruleForm.oldPassword"
                placeholder="请输入内容"
                clearable
                :type="type.oldPassword"
              >
                <el-button
                  slot="append"
                  @click="checkType('oldPassword')"
                >
                  <svg-icon :name="icon.oldPassword" />
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item
              label="输入新密码"
              prop="password1"
            >
              <el-input
                v-model="ruleForm.password1"
                placeholder="输入新密码"
                clearable
                :type="type.password1"
              >
                <!-- @change="changePassword1" -->
                <el-button
                  slot="append"
                  @click="checkType('password1')"
                >
                  <svg-icon :name="icon.password1" />
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item
              label="确认新密码"
              prop="password2"
            >
              <el-input
                v-model="ruleForm.password2"
                placeholder="请确认新密码"
                clearable
                :type="type.password2"
              >
                <el-button
                  slot="append"
                  @click="checkType('password2')"
                >
                  <svg-icon :name="icon.password2" />
                </el-button>
              </el-input>
            </el-form-item>
          </div>
          <p class="passwordInfo">
            <span>说明：</span>
            <span>1、如忘记原密码，请联系管理员处理</span>
            <span> 2、密码规则：新密码必须包含8-16位的数字+大写字母+小写字母，且不能为：Aa123456此类简单组合</span>
            <span> 3、确认新密码需要与新密码一致</span>
          </p>
          <div class="btnBox">
            <el-button
              v-if="isSetAll !== true"
              size="small"
              @click="() => {
                this.$router.push('/profile/index')
              }"
            >
              取消
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="submitForm('ruleForm')"
            >
              确认修改
            </el-button>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { resetPass } from '@/api/users'
import { AppModule } from '@/store/modules/app'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { lock } from '@/utils/index'
@Component({
  name: 'resetPassowrd',
  components: {}
})
export default class extends Vue {
  @Watch('ruleForm.password1')
  private clearPassword(val: string) {
    this.ruleForm.password2 = ''
  }
  mounted() {
    let routerUrl = (this.$route.query as any).setAll
    if (routerUrl) {
      if (typeof routerUrl === 'string') {
        this.isSetAll = JSON.parse(routerUrl)
      } else {
        this.isSetAll = routerUrl
      }
    }

    if (this.isSetAll) {
      this.toggleSideBar();
      (history as any).pushState(null, null, document.URL)
      window.addEventListener('popstate', function() {
        (history as any).pushState(null, null, document.URL)
      })
      window.addEventListener('historychange', function() {
        (history as any).pushState(null, null, document.URL)
      })
    }
  }

  private isSetAll:boolean = false
  private changeOld: boolean = true;

  private type: any = {
    oldPassword: 'password',
    password1: 'password',
    password2: 'password'
  };

  private icon: any = {
    oldPassword: 'eye',
    password1: 'eye',
    password2: 'eye'
  };

  private ruleForm: any = {
    oldPassword: '',
    password1: '',
    password2: ''
  };

  // private changePassword1(val:string) {
  //   if (this.ruleForm.password2) {
  //     (this.$refs.ruleForm as any).validateField('password2')
  //   }
  // }

  private isTypeVal(type: string) {
    if (type === 'password') {
      return 'text'
    } else {
      return 'password'
    }
  }

  private changeIcon(type: string) {
    if (type === 'eye') {
      return 'eye-open'
    } else {
      return 'eye'
    }
  }

  private checkType(typeVal: string) {
    let inputType = this.isTypeVal(this.type[typeVal])
    this.type[typeVal] = inputType
    let icon = this.changeIcon(this.icon[typeVal])
    this.icon[typeVal] = icon
  }

  private checkPassed = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== this.ruleForm.password1) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  };

  private validateReg(str = '') {
    const notAZ = /^([A-Z])([a-z])([1])([2])([3])([4])([5])([6])$/
    const regPWd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{8,16}$/
    var s = str.substring(0, 16)
    if (notAZ.test(s)) {
      s = s.toUpperCase()
      if (s[0] === s[1]) {
        return false
      }
    }
    return regPWd.test(str)
  }

  private checkVad(rule: any, value: any, callback: any) {
    let isPass:Boolean = this.validateReg(value)
    if (isPass) {
      callback()
    } else {
      callback(
        new Error(
          '新密码必须包含8-16位的数字+大写字母+小写字母，且不能为：Aa123456此类简单组合!'
        )
      )
    }
  }

  private checkOld(rule: any, value: any, callback: any) {
    if (this.changeOld) {
      callback(new Error('输入的原密码错误'))
    } else {
      callback()
    }
  }

  private rules: any = {
    oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
    password1: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      {
        min: 8,
        max: 16,
        message:
          '新密码必须包含8-16位的数字+大写字母+小写字母，且不能为：Aa123456此类简单组合',
        trigger: 'blur'
      },
      { validator: this.checkVad, trigger: 'blur' }
    ],
    password2: [
      { required: true, message: '请确认新密码', trigger: 'blur' },
      { validator: this.checkPassed, trigger: ['change', 'blur'] }
    ]
  };
  @lock
  private async sendData() {
    try {
      let param = {
        oldPassword: this.ruleForm.oldPassword,
        password: this.ruleForm.password2
      }
      let { data: res } = await resetPass(param)
      if (res.success) {
        if (res.data) {
          this.$message.success('密码修改成功')
          window.localStorage.setItem('isWeakPwd', 'false')
          if (this.isSetAll) {
            (history as any).pushState(null, null, '/')
            window.removeEventListener('popstate', function() {})
            window.removeEventListener('historychange', function() {})
            setTimeout(() => {
              this.$router.push('/profile/index')
            }, 0)
          }
          setTimeout(() => {
            this.isSetAll = false
            this.$router.push('/profile/index')
          }, 0)
        }
      } else {
        if (res.errorMsg === '输入的原密码错误') {
          this.changeOld = true
          let addOldpass = { validator: this.checkOld, trigger: 'change' }
          this.rules.oldPassword.push(addOldpass);
          (this.$refs.ruleForm as any).validateField('oldPassword')
          this.changeOld = false
        } else {
          this.$message.error('密码修改失败，请稍后重试')
        }
      }
    } catch (err) {
      console.log(`submit fail:${err}`)
    } finally {
      console.log(`finally`)
    }
  }

  private submitForm(formName: any) {
    (this.$refs[formName] as any).validate((valid: boolean) => {
      if (valid) {
        this.sendData()
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  private toggleSideBar() {
    AppModule.CloseSideBar(false)
  }
}
</script>
<style lang='scss' scoped>
.resetPassowrd {
  z-index: 3000;
  .passwordBox {
    padding: 30px 0px 20px 40px;
    box-sizing: border-box;
    .contentBox {
      width: 50vw;
      .append {
        width: 100%;
        height: 100%;
        border: 1px solid black;
      }
    }
    .passwordInfo {
      margin-left: 100px;
      margin-top: 50px;
      color: #9e9e9e;
      span {
        display: block;
        line-height: 25px;
        font-size: 14px;
      }
    }
    .btnBox {
      width: 100%;
      text-align: center;
    }
  }
}
</style>
<style scoped>
.contentBox >>> .el-input-group__append:hover {
  background-color: #DCDFE6;
  opacity: 0.8;
}
.contentBox >>> .el-input-group__append {
  cursor: pointer;
}
.el-form-item {
  padding-right: 20%;
  box-sizing: border-box;
}
.v-modal{
  opacity: 1;
  padding: 100px 80px 0px 80px;
  box-sizing: border-box;
  background:0;
}
</style>
