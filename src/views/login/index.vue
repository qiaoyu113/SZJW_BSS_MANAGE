<template>
  <div :class="isPC ? 'login-container' : 'login-container-m'">
    <div
      v-if="!isPC"
      class="logo"
    />
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <p class="title">
          云鸟梧桐综合业务支撑平台
        </p>
      </div>

      <el-form-item
        prop="username"
        style="background: #fff;"
      >
        <span class="svg-container">
          <svg-icon name="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          auto-complete="on"
          name="username"
          placeholder="用户名"
          tabindex="1"
          type="text"
        />
      </el-form-item>

      <el-form-item
        prop="password"
        style="background: #fff;margin-bottom: 70px;"
      >
        <span class="svg-container">
          <svg-icon name="password" />
        </span>
        <el-input
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="$t('login.password')"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span
          class="show-pwd"
          @click="showPwd"
        >
          <svg-icon :name="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <div class="wrapper">
        <el-button
          :loading="loading"
          class="button"
          type="primary"
          style="width:100%;margin:auto;"
          @click.native.prevent="handleLogin"
        >
          {{ $t("login.logIn") }}
        </el-button>
      </div>
    </el-form>

    <el-dialog
      :title="$t('login.thirdparty')"
      :visible.sync="showDialog"
    >
      {{ $t("login.thirdpartyTips") }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
    <SelfDialog
      :visible.sync="assignShowDialog"
      :title="`该账号密码不安全，请重新设置`"
      :confirm="confirm"
      @closed="resetForm"
    >
      <el-row>
        <el-form
          ref="reCreatRule"
          :model="reCreat"
          :rules="rules"
          :label-width="isPC ? '80px' : '30%'"
          class="refundForm"
        >
          <el-col :span="isPC ? 24 : 24">
            <el-form-item
              label="密码设置"
              class="mb35"
              prop="passwd"
            >
              <el-input
                v-model="reCreat.passwd"
                type="password"
                autocomplete="off"
                placeholder="请输入密码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item
              label="确认密码"
              prop="checkPass"
            >
              <el-input
                v-model="reCreat.checkPass"
                type="password"
                autocomplete="off"
                placeholder="请再次输入密码"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { isValidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect/index.vue'
import SocialSign from './components/SocialSignin.vue'
import { SettingsModule } from '@/store/modules/settings'
import SelfDialog from '@/components/SelfDialog/index.vue'

@Component({
  name: 'Login',
  components: {
    LangSelect,
    SocialSign,
    SelfDialog
  }
})
export default class extends Vue {
  private assignShowDialog = false;
  private reCreat: any = {
    passwd: '',
    checkPass: ''
  };
  private token: any = ''
  private rules: any = {
    passwd: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { validator: this.validatePasswd, trigger: 'blur' }
    ],
    checkPass: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      { validator: this.validateCheckPass, trigger: 'blur' }
    ]
  };
  private validateUsername = (rule: any, value: string, callback: Function) => {
    if (!isValidUsername(value)) {
      callback(new Error('请输入账号'))
    } else {
      callback()
    }
  };
  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 1) {
      callback(new Error('请输入密码'))
    } else {
      callback()
    }
  };
  private validatePasswd(rule:any, value:any, callback:any) {
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
  private validateCheckPass(rule:any, value:any, callback:any) {
    if (this.reCreat.passwd !== '' && this.reCreat.checkPass === '') {
      callback(new Error('请再次输入密码'))
    } else if (this.reCreat.passwd !== this.reCreat.checkPass) {
      callback(new Error('两次输入密码不一致'))
    } else {
      callback()
    }
  }
  private loginForm = {
    username: '',
    password: ''
  };
  private loginRules = {
    username: [{ validator: this.validateUsername, trigger: 'blur' }],
    password: [{ validator: this.validatePassword, trigger: 'blur' }]
  };
  private passwordType = 'password';
  private loading = false;
  private showDialog = false;
  private redirect?: string;
  private otherQuery: Dictionary<string> = {};

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details

    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  mounted() {
    if (this.loginForm.username === '') {
      (this.$refs.username as Input).focus()
    } else if (this.loginForm.password === '') {
      (this.$refs.password as Input).focus()
    }
  }

  // 判断是否是PC
  get isPC() {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      return false
    } else {
      return true
    }
  }

  private showPwd() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }

  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        const data = await UserModule.Login(this.loginForm)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.loading = false
        }, 0.5 * 1000)
        if (data && data.isWeakPwd) {
          // 强制修改密码
          this.token = data.token
          this.$alert('您的登录密码过于简单，具有安全隐患，需要重新设置登录密码。', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              let query:any = {
                setAll: true
              }
              this.$router.push({
                path: '/profile/resetpassword',
                query: query
              })
            }
          })
          return
        }

        // if (data && !data.settingFlag) {
        //   // 强制修改密码
        //   // this.reCreat.id = data.
        //   this.token = data.token
        //   this.assignShowDialog = true
        //   return
        // }

        this.$router.replace({
          path: this.redirect || '/',
          query: this.otherQuery
        })
      } else {
        return false
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce(
      (acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      },
      {} as Dictionary<string>
    )
  }
  private resetForm() {
    (this.$refs.reCreatRule as any).resetFields()
    this.$nextTick(() => {
      (this.$refs.reCreatRule as any).clearValidate()
    })
  }
  private async confirm(done: any) {
    const data = await UserModule.ResetPassword({
      token: this.token,
      password: {
        password: this.reCreat.passwd
      }
    })
    if (data.success) {
      done()
      this.$message.success(`重置成功，请重新登录`)
    } else {
      this.$message.error(data)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$color: #2194e0;

@keyframes sheen {
  0% {
    transform: skewY(-45deg) translateX(0);
  }
  100% {
    transform: skewY(-45deg) translateX(12.5em);
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
//$light_gray:#eee;
$light_gray: #01466f;
$cursor: #fff;
$color: #2194e0;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    &::first-line {
      color: $light_gray;
    }
  }
}
.mb35{
  margin-bottom: 35px;
}
/* reset element-ui css */
.login-container {
  .login-form {
    .wrapper {
      display: block;
      position: relative;
      width: 430px;
      text-align: center;
      margin: auto;
    }
    .button {
      padding: 0.75em 2em;
      text-align: center;
      text-decoration: none;
      color: $color;
      border: 2px solid $color;
      font-size: 24px;
      display: inline-block;
      border-radius: 25px;
      transition: all 0.2s ease-in-out;
      overflow: hidden;
      position: relative;
      margin: auto;
    }
    .el-button {
      line-height: 2;
      font-size: 14px;
      color: #fff;
      width: auto;
      float: left;
      overflow: hidden;
      position: relative;
      transition: all 1s;
      cursor: pointer;
      /*background: #298f9b;*/
      background: #399ffb;
      border: 1px solid #399ffb;
      border-radius: 25px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        /*color: $light_gray;*/
        color: #4ca2cc;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          /*-webkit-box-shadow: 0 0 0px 1000px $bg inset !important;*/
          -webkit-text-fill-color: #4ca2cc !important;
          box-shadow: 0 0 0px 1000px #fff inset !important;
          background-color: #fff;
          background-image: none;
        }
      }
    }
    .el-form-item {
      width: 430px;
      background: #384f86;
      border: 1px solid #399ffb;
      border-radius: 29px;
      color: #fff;
      margin: 0 auto 40px;
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: linear-gradient(140deg, #01466f, #e14494);
$bg3: linear-gradient(180deg, rgb(74, 183, 189), #aefb7c);
$bg4: #0d1846;
$bg2: url("http://thyrsi.com/t6/674/1551184579x2890202953.png") no-repeat;
$dark_gray: #889aa4;
$light_gray: #eee;
$color: #2194e0;

.login-container {
  width: 100%;
  height: 100vh;
  background: $bg4;
  background: url("https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/95ee944cbce04d6e99797887254618b7")
    no-repeat;
  background-size: 100% 100%;
  -webkit-background-size: cover;
  background-size: cover;
  overflow: hidden;
  .bgShow {
    width: 100%;
    height: 100%;
    position: fixed;
    transform: translate(50%, 50%);
    top: -50%;
    left: -50%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 0;
  }
  .login-form {
    position: absolute;
    left: 5.7%;
    top: 0;
    bottom: 0;
    width: 595px;
    height: 470px;
    margin: auto;
    background: #172452;
    border: 1px solid #3887f7;
    background-size: 1px 300%;
    background-position: 0px 100%;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    transition: box-shadow 0.5s, transform 0.5s;
    z-index: 100;
  }
  .el-form-item__content {
    background: #fff !important;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    /*color: $dark_gray;*/
    color: #4ca2cc !important;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 32px;
      color: #ffffff;
      text-align: center;
      margin-top: 60px;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #4ca2cc !important;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
}
.shadowBg {
  position: relative;
  width: 2240px;
  height: 2240px;
  border-radius: 50%;
  background-color: #f7f6f4;
  background-image: url("https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/a764556ca46f4e5d8d2b27c6817f6295");
  background-size: 5px 5px;
  bottom: -805px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.login-container-m {
  width: 100%;
  height: 100vh;
  -webkit-background-size: cover;
  background-size: cover;
  overflow: hidden;
  .logo {
    width: 100%;
    height: 28vh;
    background: url("https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/a6ce085a5d6e425295ab487097e9cd3a")
      no-repeat;
    -webkit-background-size: cover;
    background-size: cover;
  }
  .login-form {
    padding: 0 20px;
    box-sizing: border-box;
    .wrapper {
      display: block;
      position: relative;
      width: 100%;
      text-align: center;
      margin: auto;
    }
    .button {
      height: 40px;
      text-align: center;
      text-decoration: none;
      color: #abcefb;
      font-size: 16px;
      display: inline-block;
      overflow: hidden;
      position: relative;
      margin: auto;
      background: #2f448a;
      border-radius: 10px;
    }
    .login-form {
      width: 100%;
      margin: auto;
      z-index: 100;
      padding: 10px 20px;
      box-sizing: border-box;
    }
    .el-form-item__content {
      background: #fff !important;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      /*color: $dark_gray;*/
      color: #4ca2cc !important;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .title-container {
      display: none;
      .title {
        font-size: 32px;
        color: #ffffff;
        text-align: center;
        margin-top: 60px;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 3px;
        font-size: 18px;
        right: 0px;
        cursor: pointer;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: #4ca2cc !important;
      cursor: pointer;
      user-select: none;
    }
    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }
  }
}
.shadowBg {
  position: relative;
  width: 2240px;
  height: 2240px;
  border-radius: 50%;
  background-color: #f7f6f4;
  background-image: url("https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/a764556ca46f4e5d8d2b27c6817f6295");
  background-size: 5px 5px;
  bottom: -805px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
