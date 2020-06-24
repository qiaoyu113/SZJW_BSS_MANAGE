<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          梧桐BSS {{ $t('login.title') }}
        </h3>
        <!--<lang-select class="set-language" />-->
      </div>

      <el-form-item
        prop="username"
        style="background: #fff;"
      >
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <!-- <el-input
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          style="background: #fff;"
          auto-complete="on"
        /> -->
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
        style="background: #fff;"
      >
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
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
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <div class="wrapper">
        <el-button
          :loading="loading"
          class="button"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >
          {{ $t('login.logIn') }}
        </el-button>
      </div>
      <!-- <div style="position:relative">
        <div class="tips">
          <span>{{ $t('login.username') }} : admin</span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">
            {{ $t('login.username') }} : editor
          </span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div>

        <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
          {{ $t('login.thirdparty') }}
        </el-button>
      </div> -->
    </el-form>
    <div class="shadowBg" />

    <el-dialog
      :title="$t('login.thirdparty')"
      :visible.sync="showDialog"
    >
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vuex'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { isValidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect/index.vue'
import SocialSign from './components/SocialSignin.vue'

@Component({
  name: 'Login',
  components: {
    LangSelect,
    SocialSign
  }
})
export default class extends Vue {
  private validateUsername = (rule: any, value: string, callback: Function) => {
    if (!isValidUsername(value)) {
      callback(new Error('请输入账号'))
    } else {
      callback()
    }
  }
  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 1) {
      callback(new Error('请输入密码'))
    } else {
      callback()
    }
  }
  private loginForm = {
    username: 'wtadmin',
    password: '123'
  }
  private loginRules = {
    username: [{ validator: this.validateUsername, trigger: 'blur' }],
    password: [{ validator: this.validatePassword, trigger: 'blur' }]
  }
  private passwordType = 'password'
  private loading = false
  private showDialog = false
  private redirect?: string
  private otherQuery: Dictionary<string> = {}

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
        await UserModule.Login(this.loginForm)
        this.$router.replace({
          path: this.redirect || '/',
          query: this.otherQuery
        })
        // Just to simulate the time of the request
        setTimeout(() => {
          this.loading = false
        }, 0.5 * 1000)
      } else {
        return false
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $color: #2194E0;

  @keyframes sheen {
    0% {
      transform: skewY(-45deg) translateX(0);
    }
    100% {
      transform: skewY(-45deg) translateX(12.5em);
    }
  }

  .wrapper {
    display: block;
    position: relative;
    width: 100%;
  }
  .button {
    padding: 0.75em 2em;
    text-align: center;
    text-decoration: none;
    color: $color;
    border: 2px solid $color;
    font-size: 24px;
    display: inline-block;
    border-radius: 0.3em;
    transition: all 0.2s ease-in-out;
    position: relative;
    overflow: hidden;
    &:before {
      content: "";
      background-color: rgba(255,255,255,0.5);
      height: 100%;
      width: 3em;
      display: block;
      position: absolute;
      top: 0;
      left: -4.5em;
      transform: skewX(-45deg) translateX(0);
      transition: none;
    }
    &:hover {
      background-color: $color;
      color: #fff;
      border-bottom: 4px solid darken($color, 10%);
      &:before {
        transform: skewX(-45deg) translateX(35.5em);
        transition: all 0.3s ease-in-out;
      }
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  //$light_gray:#eee;
  $light_gray:#01466f;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-button{
      line-height:2;
      font-size:14px;
      color: #FFF;
      width: auto;
      float: left;
      overflow: hidden;
      position: relative;
      transition: all 1s;
      cursor: pointer;
      /*background: #298f9b;*/
      background: #5C5758;
      border: 1px solid #5C5758;
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
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:linear-gradient(140deg,#01466f,#e14494);
$bg3:linear-gradient(180deg,rgb(74, 183, 189),#AEFB7C);
$bg2:url('http://thyrsi.com/t6/674/1551184579x2890202953.png')no-repeat;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  max-height: 100%;
  background: $bg3;
  -webkit-background-size: cover;
  background-size: cover;
  overflow: hidden;
  .bgShow{
    width:100%;
    height:100%;
    position: fixed;
    transform: translate(50% , 50%);
    top:-50%;
    left:-50%;
    background:rgba(0, 0, 0, 0.5);
    z-index:0;
  }
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 130px;
    width: 580px;
    height: 350px;
    padding: 35px 35px 30px;
    margin: auto;
    background: -webkit-gradient(linear,left bottom,left top,from(#E6CF45),color-stop(33%,#E6CF45),color-stop(66%,#E6CF45),to(#E6CF45));
    background-size: 1px 300%;
    background-position: 0px 100%;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,.5);
    transition: box-shadow .5s,transform .5s;
    z-index: 100;
  }
  .login-form:before {
    content:"";
    position: absolute;
    right: 0;
    left: 0;
    bottom: -130px;
    margin: auto;
    width: 0;
    height: 0;
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
    border-top: 140px solid #E6CF45;
  }
  .el-form-item__content{
    background:#fff !important;
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
    color: #4ca2cc;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    h3{
      /*color: #298f9b !important;*/
      color: #fff !important;
    }
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size:18px;
      right: 0px;
      cursor: pointer;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
}
.login-container::before{
  content: '';
  width:100%;
  height:20%;
  position: fixed;
  transform: translate(50% , 50%);
  top:-50%;
  left:-50%;
  mix-blend-mode:screen;
  /*background:url("https://image.weilanwl.com/gif/wave.gif")no-repeat;*/
  z-index:0;
}
.shadowBg{
  position: relative;
  width: 2240px;
  height: 2240px;
  border-radius: 50%;
  background-color: #f7f6f4;
  background-image: url('https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/a764556ca46f4e5d8d2b27c6817f6295');
  background-size: 5px 5px;
  bottom: -805px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(0,0,0,.2);
}
</style>
