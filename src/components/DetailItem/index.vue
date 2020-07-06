<template>
  <div :class="isPC ? 'DetailItem' : 'DetailItem-m'">
    <div class="detail-title">
      {{ name }}:
    </div>
    <div class="detail-value">
      {{ value }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'DetailItem'
})
export default class extends Vue {
  @Prop({ default: '' }) private name: any; // 默认无法识别显示空
  @Prop({ default: '暂无数据' }) private value: any; // 默认无法识别显示空

  created() {}

  get isPC() {
    return SettingsModule.isPC
  }
}
</script>

<style lang="scss" scope>
.DetailItem {
  width: 100%;
  display: flex;
  padding: 10px;
  box-sizing: border-box;
  .detail-title {
    flex: 1;
    font-size: 14px;
    color: #666;
    font-weight: 400;
    text-align: right;
    padding-right: 16px;
    box-sizing: border-box;
  }
  .detail-value {
    flex: 2;
    font-size: 14px;
    color: #333;
    font-weight: 500;
  }
}
</style>

<style lang="scss" scope>
.DetailItem-m {
  width: 100%;
  display: flex;
  padding: 14px;
  box-sizing: border-box;
  border-bottom: 1px solid #f8f9fa;
  .detail-title {
    flex: 1;
    font-size: 14px;
    color: #666;
    font-weight: 400;
    text-align: left;
    padding-right: 15px;
    box-sizing: border-box;
  }
  .detail-value {
    flex: 2;
    text-align: right;
    font-size: 14px;
    color: #333;
    font-weight: 400;
  }
}
</style>
