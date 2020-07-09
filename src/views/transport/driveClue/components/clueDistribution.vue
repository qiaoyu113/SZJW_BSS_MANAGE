<template>
  <div>
    <!-- 分配线索 -->
    <Dialog
      :visible.sync="showAlert"
      title="线索分配"
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
import { Vue, Component, Prop } from 'vue-property-decorator'
import Dialog from '@/components/Dialog/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'ClueDistribution',
  components: {
    Dialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: 1 }) id!:number
  private showAlert = false
  private dialogForm:IState = {
    followPerson: ''
  }

  private dialogItems:any[] = [
    {
      type: 2,
      key: 'followPerson',
      tagAttrs: {
        placeholder: '请选择跟进人'
      },
      options: [
        {
          label: 'jack',
          value: 'jack'
        }
      ]
    }
  ]
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
    this.dialogForm.followPerson = ''
  }
  cancel() {
    this.showAlert = false
  }
  confirm() {
    if (!this.dialogForm.followPerson) {
      return this.$message.error('请选择人进人')
    }
    this.showAlert = false
  }
}
</script>
<style lang="scss" scoped>
</style>
