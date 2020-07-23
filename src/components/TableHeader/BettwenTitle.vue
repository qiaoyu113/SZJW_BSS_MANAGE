<template>
  <div
    :class="isPC ? 'BettwenTitle' : 'BettwenTitle-m'"
  >
    <div class="BettwenTitle_left">
      <span class="tabName">{{ tabName }}</span>
      <div class="tagInfo">
        <i
          style="font-size:16px;color:#FFA000;margin-right:10px"
          class="el-icon-warning"
          color="#FFA000"
        />
        <slot name="left" />
      </div>
    </div>
    <div class="BettwenTitle_right">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'BettwenTitle'
})
export default class extends Vue {
  @Prop({ default: '0' }) private activeName: any // 默认为0 选择第一个
  @Prop({ default: [] }) private tab: any
  private active: any = '0'
  private tabName: any = ''

 @Watch('activeName', { deep: true })
  private onListQueryChange(value: any) {
    this.handleTab()
  }
 mounted() {
   this.handleTab()
 }
 private handleTab() {
   if (this.activeName && this.activeName !== '') {
     this.active = this.activeName
   }
   for (let index = 0; index < this.tab.length; index++) {
     const element = this.tab[index].name
     if (element === '') {
       this.tabName = '全部'
     } else {
       if (element.toString() === this.active.toString()) this.tabName = this.tab[index].label
     }
   }
 }

 get isPC() {
   return SettingsModule.isPC
 }
}
</script>

<style lang="scss" scope>
.BettwenTitle-m{
    width: 100%;
    background: #FFFFFF;
    overflow: hidden;
    padding: 24px 18px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
      .BettwenTitle_left{
        display: flex;
        align-items: center;
        float:left;
        flex: 0.6;
        box-sizing: border-box;
        font-size: 12px;
        color: #649CEE;
        line-height: 20px;
        .tabName{
          margin-right:10px;
          width:60px;
        }
      }
      .BettwenTitle_right{
          margin-top: 10px;
          flex: 0.4;
          text-align: right;
          box-sizing: border-box;
      }
      .tagInfo{
      // width: 100%;
      flex: 1;
      background: rgba(100,156,238,0.08);
      border: 1px solid #649CEE;
      border-radius: 4px;
      padding: 4px 7px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #656565;
      letter-spacing: 0;
      span{
        margin-left: 10px;
      }
    }
    }

</style>

<style lang="scss" scope>
.BettwenTitle{
    width: 100%;
    background: #FFFFFF;
    overflow: hidden;
    padding: 10px 30px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .tabName{
          margin-right:10px;
          width:60px;
        }
      .BettwenTitle_left{
          // float:left;
          flex: 0.6;
          font-size: 14px;
          color: #649CEE;
          line-height: 30px;
          display: flex;
          align-items: center;
      }
      .BettwenTitle_right{
          flex: 0.4;
          text-align: right;
          box-sizing: border-box;
      }
    }
    .tagInfo{
      flex: auto;
      background: rgba(100,156,238,0.08);
      border: 1px solid #649CEE;
      border-radius: 4px;
      padding: 0px 14px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #656565;
      letter-spacing: 0;
      span{
        margin-left: 10px;
      }
    }
</style>
