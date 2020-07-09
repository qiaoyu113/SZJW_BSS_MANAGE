<template>
  <div>
    <!-- 分配线索 -->
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
        label-width="110px"
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
  name: 'ManagerDialog',
  components: {
    Dialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: () => [] }) rows!:any
  @Prop({ default: '' }) type!:string
  private showAlert = false
  private title:string = ''
  private dialogForm:IState = {
    followPerson: ''
  }

  private dialogItems:any[] = [
    {
      type: 2,
      key: 'manager',
      label: '请选择加盟经理',
      tagAttrs: {
        placeholder: '请选择新的加盟经理',
        filterable: true
      },
      options: [
        {
          label: 'jack',
          value: 'jack'
        }
      ]
    }
  ]

  @Watch('type')
  onTypeChange(val:string) {
    if (this.type === 'modify') {
      this.title = '修改加盟经理'
    } else if (this.type === 'distribution') {
      this.title = '分配加盟经理'
    }
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
    this.dialogForm.manager = ''
    this.setEmptyRows([])
  }
  @Emit('onRows')
  setEmptyRows(a:any) {
  }
  cancel() {
    this.showAlert = false
  }
  confirm() {
    if (!this.dialogForm.manager) {
      return this.$message.error('请选择加盟经理')
    }
    this.showAlert = false
    this.$message.success('已成功分配加盟经理')
  }
}
</script>
<style lang="scss" scoped>
</style>
