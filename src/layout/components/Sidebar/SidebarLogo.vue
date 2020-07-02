<template>
  <div
    class="sidebar-logo-container"
    :class="{'collapse': collapse}"
  >
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          src="favicon.ico"
          class="sidebar-logo"
        >
      </router-link>
      <router-link
        v-else
        key="expand"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          src="@/assets/image/title-logo.png"
          class="sidebar-logo-pc"
        >
        <!-- <h1 class="sidebar-title">
          {{ title }}
        </h1> -->
        <!-- <div class="user">
          <div class="tags">
            <p class="tag_list">
              北京市
            </p>
            <p class="tag_list">
              共享一组
            </p>
            <p class="tag_list">
              共享GBL
            </p>
          </div>
          <div class="user_info">
            <p class="user_name">
              刘德华
            </p>
            <p class="user_phone">
              13888888888
            </p>
          </div>
        </div> -->
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'SidebarLogo'
})
export default class extends Vue {
  @Prop({ required: true }) private collapse!: boolean

  private title = '云 鸟 科 技'
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #182B5C;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-logo-pc {
      width: 110px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #4C85C6;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }

    & .user {
      & .tags{
          display: flex;
          padding:5px 0;
          box-sizing: border-box;
          & .tag_list{
            flex: 1;
            color: #4C85C6;
            font-size: 12px;
            border: 1px solid #4C85C6;
            border-radius: 25px;
            height: 20px;
            line-height: 18px;
            margin: 0 3px;
          }
        }
      & .user_info{
        & .user_name{
          width: 66px;
          height: 66px;
          line-height: 66px;
          text-align: center;
          border-radius: 100%;
          font-size: 14px;
          opacity: 0.9;
          background: #399FFB;
          margin: 15px auto 0;
        }
        & .user_phone{
          font-size: 15px;
          color: #CED3DD;
          line-height: 10px;
        }
      }
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }

}
</style>
