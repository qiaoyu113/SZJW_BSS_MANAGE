<template>
  <div :class="isPC ? 'dialog' : 'dialog-m'">
    <el-dialog
      :visible.sync="show"
      :width="isPC ? width : '90%'"
      :custom-class="`${isPC ? customClass : (customClass + 'dialog-content-m')}`"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <div slot="title">
        {{ title }}
      </div>
      <div
        class="dialog-body"
      >
        <slot />
      </div>
      <div
        v-if="showConfirmButton || showCancelButton"
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          v-if="showCancelButton"
          @click="cancel"
        >
          {{ cancelButtonText }}
        </el-button>
        <el-button
          v-if="showConfirmButton"
          type="primary"
          @click="confirm"
        >
          {{ confirmButtonText }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'Dialog'
})
export default class extends Vue {
  @Prop({ required: true }) private visible!: boolean;
  @Prop({ default: true }) private showCancelButton!: boolean;
  @Prop({ default: true }) private showConfirmButton!: boolean;
  @Prop({ default: '50%' }) private width!: string;
  @Prop({ default: '取消' }) private cancelButtonText!: string;
  @Prop({ default: '确定' }) private confirmButtonText!: string;
  @Prop({ default: '提示' }) private title!: string;
  @Prop({ default: '' }) private customClass!: string;

  get show() {
    return this.visible
  }
  set show(value: boolean) {
    this.$emit('update:visible', value)
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  private confirm() {
    this.$emit('confirm', () => {
      this.show = false
    })
  }
  private cancel() {
    this.$emit('cancel', () => {
      this.show = false
    })
  }
  mounted() {}

  beforeDestory() {}
}
</script>

<style lang="scss">
.dialog,
.dialog-m {
  .el-dialog__header {
    padding: 0;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    background: #2f448a;
    border-radius: 2px;
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
    text-align: left;
  }
  .el-dialog__headerbtn {
    top: 10px;
    .el-dialog__close {
      color: #fff;
      font-size: 20px;
    }
  }
  .el-dialog__body {
    padding: 15px 20px;
  }
  .el-dialog{
    border-radius: 6px;
    overflow: hidden;
  }
}
.dialog-m{
  .el-dialog__wrapper{
    display: flex;
    align-items: center;
  }
  .el-dialog__header{
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .el-dialog__footer{
    position: sticky;
    bottom: 0;
    background: #fff;
    z-index: 10;
  }
  .el-dialog{
    margin-top: 0!important;
    margin-bottom: 0!important;
  }
  .dialog-content-m{
    max-height: 80vh;
    overflow: auto;
  }
}
</style>
