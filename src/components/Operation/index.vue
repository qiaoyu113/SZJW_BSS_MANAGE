<template>
  <div
    v-if="operationList.length"
    :class="isPC ? 'operation' : 'operation-m'"
  >
    <div
      class="operation-main"
      @click="showList = !showList"
    >
      <i class="el-icon-sort el-icon-left" />
      <span>批量操作</span>
    </div>
    <div
      v-if="showList"
      class="operation-list"
    >
      <div
        v-for="item in operationList"
        :key="item.name"
        class="ol"
        @click="olclick(item)"
      >
        <div
          class="ol-icon"
          :style="'background:' + item.color"
        >
          <i :class="item.icon" />
        </div>
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'Operation'
})
export default class extends Vue {
  // 批量操作按钮
  @Prop({ default: [] }) private operationList!:[]
  private showList: Boolean = false

  get isPC() {
    return SettingsModule.isPC
  }

  olclick(value:any) {
    this.showList = !this.showList
    this.$emit('olclick', value)
  }
}
</script>

<style lang="scss" scoped>
  .operation{
    flex: 1;
    text-align: left;
    position: relative;
    z-index: 10;
    .operation-main{
      width: 100px;
      height: 28px;
      line-height: 28px;
      border-radius: 25px;
      text-align: center;
      background:$main-btn;
      color: #fff;
      font-size: 13px;
      box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
    }
    .operation-main:hover{
      cursor: pointer;
    }
    .operation-main:before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border-radius: inherit;
    }
    .operation-list{
      width:100%;
      position: absolute;
      bottom: 32px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      .ol{
        position: relative;
        .ol-icon{
          width:32px;
          height:32px;
          line-height: 32px;
          text-align: center;
          overflow: hidden;
          background: $main-btn;
          border-radius: 100%;
          box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
          color:#fff;
          margin:12px 0;
        }
        span{
          position: absolute;
          left: 40px;
          top:6px;
          font-size: 10px;
          color: #fafafa;
          background: #757575;
          display: inline;
          padding:4px 6px;
          border-radius: 6px;
        }
      }
    }
    .operation-list:hover{
      cursor: pointer;
    }
  }
  .el-pagination{
    flex: 6;
  }

  .operation-m{
    flex: 1;
    text-align: left;
    position: relative;
    z-index: 10;
    .operation-main{
      width: 25px;
      height: 25px;
      line-height: 25px;
      border-radius: 25px;
      text-align: center;
      background:$main-btn;
      color: #fff;
      font-size: 13px;
      box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
      span{
        display: none;
      }
    }
    .operation-main:hover{
      cursor: pointer;
    }
    .operation-main:before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border-radius: inherit;
    }
    .operation-list{
      position: absolute;
      bottom: 32px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      .ol{
        position: relative;
        .ol-icon{
          width:32px;
          height:32px;
          line-height: 32px;
          text-align: center;
          overflow: hidden;
          background: $main-btn;
          border-radius: 100%;
          box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
          color:#fff;
          margin:12px 0;
        }
        span{
          min-width: max-content;
          position: absolute;
          left: 40px;
          top:6px;
          font-size: 10px;
          color: #fafafa;
          background: #757575;
          display: inline;
          padding:4px 6px;
          border-radius: 6px;
        }
      }
    }
    .operation-list:hover{
      cursor: pointer;
    }
  }
</style>
