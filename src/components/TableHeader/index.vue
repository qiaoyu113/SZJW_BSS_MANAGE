<template>
  <div
    :class="isPC ? 'TableHeader' : 'TableHeader-m'"
  >
    <div class="TableHeader_title">
      {{ tabName }}
    </div>
    <div class="TableHeader_button">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'TableHeader'
})
export default class extends Vue {
  @Prop({ default: '0' }) private activeName: any // 默认为0 选择第一个
  @Prop({ default: [] }) private tab: any

  private tabName: any = ''
  private active: any = '0'

  @Watch('activeName', { deep: true })
  private onListQueryChange(value: any) {
    this.handleTab()
  }

  mounted() {
    this.handleTab()
  }

  get isPC() {
    return SettingsModule.isPC
  }

  private handleTab() {
    if (this.activeName && this.activeName !== '') {
      this.active = this.activeName
    }
    for (let index = 0; index < this.tab.length; index++) {
      const element = this.tab[index].name
      if (element.toString() === this.active.toString()) this.tabName = this.tab[index].label
    }
  }
}
</script>

<style lang="scss" scope>
.TableHeader-m{
    width: 100%;
    background: #FFFFFF;
    overflow: hidden;
    border: 1px solid  #F8F9FA;
    padding: 10px 18px;
    box-sizing: border-box;
    display: flex;
    .TableHeader_title{
        // float:left;
        flex: 1;
        font-size: 14px;
        color: #649CEE;
        line-height: 30px;
    }
    .TableHeader_button{
        flex: 1;
        text-align: right;
        box-sizing: border-box;
    }
}
</style>

<style lang="scss" scope>
.TableHeader{
    width: 100%;
    background: #FFFFFF;
    overflow: hidden;
    border: 1px solid  #F8F9FA;
    padding: 10px 30px;
    box-sizing: border-box;
    display: flex;
    .TableHeader_title{
        // float:left;
        flex: 1;
        font-size: 14px;
        color: #649CEE;
        line-height: 30px;
    }
    .TableHeader_button{
        flex: 2;
        text-align: right;
        box-sizing: border-box;
    }
}
</style>
