<template>
  <div
    :class="isPC ? 'pitchBox' : 'pitchBox-m'"
  >
    <el-drawer
      title="选中列表"
      :visible.sync="drawer"
      :size="size"
      :direction="direction"
      :before-close="handleClose"
      :with-header="headerShow"
      :show-close="true"
    >
      <div
        v-if="drawerList.length"
      >
        <div
          v-for="(item, index) in drawerList"
          :key="item.id"
          class="drawerList"
        >
          <div class="drawer-list-main">
            <slot :item="item" />
          </div>
          <div
            class="drawer-list-delet"
            @click="deletItem(item, index)"
          >
            <i class="el-icon-error" />
          </div>
        </div>
      </div>
      <div
        v-else
        class="none"
      >
        暂无选中信息
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'PitchBox'
})
export default class extends Vue {
  @Prop({ default: [] }) private drawerList!: []
  @Prop({ default: false }) private drawer!: Boolean
  @Prop({ default: true }) private headerShow!: Boolean
  @Prop({ default: '20' }) private size!: string
  private direction: any = 'rtl'

  get isPC() {
    return SettingsModule.isPC
  }

  private handleClose() {
    this.$emit('changeDrawer', false)
  }

  private deletItem(item: any, i:any) {
    this.$emit('deletDrawerList', item, i)
  }
}
</script>

<style lang="scss">
  .pitchBox{
    width: 100%;
    .drawerList{
        display: flex;
        padding:15px 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #dfdfdf;
        .drawer-list-main{
            flex: 54;
            font-size: 14px;
            color:$main-font;
            span{
                display: inline-block;
                padding:2px 10px;
                margin: 2px 5px;
                box-sizing: border-box;
            }
            span:nth-child(1){
                background: $main;
                color: #fff;
                border-radius: 16px;
            }
            span:nth-child(2){
                background: $main-btn;
                color: #fff;
                border-radius: 16px;
            }
        }
        .drawer-list-delet{
            flex: 1;
            line-height: inherit;
            align-items: flex-end;
            justify-content: center;
            flex-direction: column;
            display: flex;
            flex-wrap: wrap;
            color: $red;
            cursor: pointer;
        }
    }
  }

  .pitchBox-m{
    width: 100%;
    overflow-y: scroll;
    .drawerList{
        display: flex;
        padding:15px 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #dfdfdf;
        .drawer-list-main{
            flex: 54;
            font-size: 14px;
            color:$main-font;
            span{
                display: inline-block;
                padding:2px 10px;
                margin: 2px 5px;
                box-sizing: border-box;
            }
            span:nth-child(1){
                background: $main;
                color: #fff;
                border-radius: 16px;
            }
            span:nth-child(2){
                background: $main-btn;
                color: #fff;
                border-radius: 16px;
            }
            span:nth-child(3){
                border:1px solid $assist-btn;
                color: $main;
                border-radius: 16px;
            }
        }
        .drawer-list-delet{
            flex: 1;
            line-height: inherit;
            align-items: flex-end;
            justify-content: center;
            flex-direction: column;
            display: flex;
            flex-wrap: wrap;
            color: $red;
            cursor: pointer;
        }
    }
  }

  .none{
    width:100%;
    height:100vh;
    line-height: 100vh;
    text-align: center;
    color: #666;
    font-size: 14px;
  }

  .el-drawer.rtl{
    overflow-y: scroll;
  }
  :focus{
    outline:0;
  }
</style>
