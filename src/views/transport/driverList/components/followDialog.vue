<template>
  <div>
    <!-- 司机跟进 -->
    <Dialog
      :visible.sync="showAlert"
      :title="title"
      width="30%"
      :before-close="beforeClose"
      :cancel="cancel"
      :confirm="confirm"
      @closed="handleClosed"
    >
      <self-form
        :list-query="dialogForm"
        :form-item="dialogItems"
        :pc-col="24"
        label-width="0px"
      />
    </Dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import Dialog from '@/components/Dialog/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'FollowDialog',
  components: {
    Dialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: '' }) type!:string
  private showAlert = false
  private title:string = ''
  private dialogForm:IState = {
    desc: ''
  }

  private dialogItems:any[] = [
    {
      type: 1,
      key: 'desc',
      tagAttrs: {
        placeholder: '描述跟进情况(50字以内)',
        type: 'textarea',
        rows: 3,
        maxlength: 50,
        'show-word-limit': true
      }
    }
  ]

  @Watch('type')
  onTypeChange(val:string) {
    this.title = val
  }
  /**
   *发开模态框
   */
  openDialog() {
    this.showAlert = true
  }
  /**
   * 关闭弹窗
   */
  beforeClose() {
    this.showAlert = false
  }
  handleClosed() {
    this.dialogForm.desc = ''
  }

  cancel() {
    this.showAlert = false
  }
  confirm() {
    if (!this.dialogForm.desc) {
      return this.$message.error('请输入跟进情况')
    }
    this.showAlert = false
  }
}
</script>
<style lang="scss" scoped>
</style>
