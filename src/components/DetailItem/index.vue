<template>
  <div
    :class="isPC ? 'DetailItem' : 'DetailItem-m'"
  >
    <div class="detail-title">
      {{ name }}
    </div>
    <img
      v-if="type === 'image'"
      style="width: 100%"
      :src="valueName"
    >
    <div
      v-else
      class="detail-value"
    >
      {{ valueName }}
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'DetailItem'
})
export default class extends Vue {
  @Prop({ default: '' }) private name: any; // 默认无法识别显示空
  @Prop({ default: '暂无数据' }) private value!: string | number; // 默认无法识别显示空type
  @Prop({ default: '' }) private type: any; // 默认无法识别显示空
  private valueName: any = '';

  // created() {
  //   let val = this.value.toString()
  //   if (!val) {
  //     this.valueName = '暂无数据'
  //   } else {
  //     this.valueName = val
  //   }
  // }
  @Watch('value', { deep: true, immediate: true })
  changeVal(val: any) {
    if (!val) {
      this.valueName = '暂无数据'
    } else {
      this.valueName = val
    }
  }
  mounted() {
    this.valueName = this.value
  }
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>

<style lang="scss" scope>
.DetailItem {
  width: 100%;
  padding: 0 15px 10px;
  box-sizing: border-box;
  .detail-title {
    // flex: 1;
    font-size: 13px;
    color: #9e9e9e;
    font-weight: 400;
    // text-align: right;
    padding-right: 16px;
    box-sizing: border-box;
    padding-bottom: 6px;
    line-height: 36px;
  }
  .detail-value {
    // flex: 2;
    font-size: 14px;
    color: #333;
    font-weight: 500;
    overflow-wrap: break-word;
    // line-height: 36px;
  }
}
</style>

<style lang="scss" scope>
.DetailItem-m {
  width: 100%;
  padding: 10px 14px;
  box-sizing: border-box;
  border-bottom: 1px solid #f8f9fa;
  .detail-title {
    width: 100%;
    font-size: 12px;
    color: #666;
    font-weight: 400;
    text-align: left;
    padding-right: 15px;
    padding-bottom: 10px;
    box-sizing: border-box;
  }
  .detail-value {
    width: 100%;
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
