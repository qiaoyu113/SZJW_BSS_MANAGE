<template>
  <div class="followByPhoneOrWechat">
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Dialog from '@/components/Dialog/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'

interface IState {
  [key: string]: any;
}
@Component({
  name: 'FollowByPhoneOrWechat',
  components: {
    Dialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: '' }) type!:string
  private showAlert = false
  private dialogForm:IState = {
    desc: ''
  }
  private title:string = ''

  private dialogItems:any[] = [
    {
      type: 1,
      key: 'desc',
      tagAttrs: {
        placeholder: '跟进情况描述',
        type: 'textarea',
        rows: 3
      }
    }
  ]

  @Watch('type')
  onTypeChange(val:string) {
    if (val === 'phone') {
      this.title = '电话跟进'
    } else if (val === 'wechat') {
      this.title = '微信跟进'
    } else if (val === 'noValid') {
      this.title = '无效线索'
    } else if (val === 'noFollow') {
      this.title = '无法跟进'
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
    this.dialogForm.desc = ''
  }
  cancel() {
    this.showAlert = false
  }
  confirm() {
    if (!this.dialogForm.followPerson) {
      return this.$message.error('请输入跟进情况描述')
    }
    this.showAlert = false
  }
}
</script>
<style scoped>
  @media screen and (max-width: 700px) {
    .followByPhoneOrWechat >>> .el-col {
      border-bottom:none!important;
    }
  }
</style>
