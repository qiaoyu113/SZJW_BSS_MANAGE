<template>
  <div class="inviteInterview">
    <Dialog
      :visible.sync="showAlert"
      title="邀请面试"
      width="30%"
      :before-close="beforeClose"
      :cancel="cancel"
      :confirm="confirm"
      @closed="handleClosed"
    >
      <self-form
        ref="invite"
        :rules="rules"
        :list-query="dialogForm"
        :form-item="dialogItems"
        :pc-col="24"
        label-width="0px"
        @onPass="handlePass"
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
  name: 'InviteInterview',
  components: {
    Dialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: '' }) type!:string
  private showAlert = false
  private dialogForm:IState = {
    date: '',
    message: '',
    desc: ''
  }
  private title:string = ''

  private dialogItems:any[] = [
    {
      type: 6,
      key: 'date',
      tagAttrs: {
        placeholder: '面试时间'
      }
    },
    {
      type: 2,
      key: 'message',
      tagAttrs: {
        placeholder: '是否发短信'
      },
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    },
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
  private rules:IState = {
    date: [
      { required: true, message: '请选择面试时间', trigger: 'blur' }
    ],
    message: [
      { required: true, message: '请选择是否发短信', trigger: 'blur' }
    ],
    desc: [
      { required: true, message: '请输入跟进情况描述', trigger: 'blur' }
    ]
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
    this.dialogForm.date = ''
    this.dialogForm.message = ''
    this.dialogForm.desc = ''
  }
  cancel() {
    this.showAlert = false
  }
  confirm() {
    (this.$refs.invite as any).submitForm()
  }
  handlePass() {
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
