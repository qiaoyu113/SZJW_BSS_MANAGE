<template>
  <div class="inviteInterview">
    <SelfDialog
      :visible.sync="showAlert"
      title="邀请面试"
      width="40%"
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
        label-width="100px"
        @onPass="handlePass"
      />
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { ClueFollow } from '@/api/driver'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'InviteInterview',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: '' }) clueId!:string|number
  private showAlert = false // 控制弹框
  // 表单对象
  private dialogForm:IState = {
    interviewDate: '',
    isNeedSendsms: true,
    remarks: ''
  }
  // 表单数组
  private dialogItems:any[] = [
    {
      type: 6,
      key: 'interviewDate',
      label: '面试时间',
      tagAttrs: {
        placeholder: '面试时间'
      }
    },
    {
      type: 2,
      key: 'isNeedSendsms',
      label: '是否发短信',
      tagAttrs: {
        placeholder: '是否发短信'
      },
      options: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ]
    },
    {
      type: 1,
      key: 'remarks',
      label: '描述',
      tagAttrs: {
        placeholder: '跟进情况描述',
        type: 'textarea',
        rows: 4,
        'show-word-limit': true,
        maxlength: 100,
        clearable: true
      }
    }
  ]
  // 校验规则
  private rules:IState = {
    interviewDate: [
      { required: true, message: '请选择面试时间', trigger: 'blur' }
    ],
    isNeedSendsms: [
      { required: true, message: '请选择是否发短信', trigger: 'change' }
    ],
    remarks: [
      { required: true, message: '请输入跟进情况描述', trigger: 'blur' }
    ]
  }
  @Emit('getRecord')
  getRecord() {
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
  /**
   *弹框关闭
   */
  handleClosed() {
    this.dialogForm.interviewDate = ''
    this.dialogForm.isNeedSendsms = true
    this.dialogForm.remarks = ''
  }
  /**
   * 取消按钮
   */
  cancel() {
    this.showAlert = false
  }
  /**
   * 确定按钮
   */
  async confirm() {
    try {
      let params = {
        clueId: this.clueId,
        interviewDate: this.dialogForm.interviewDate,
        isNeedSendsms: this.dialogForm.isNeedSendsms,
        remarks: this.dialogForm.remarks,
        type: 3
      }
      let { data: res } = await ClueFollow(params)
      if (res.success) {
        this.showAlert = false
        this.$message.success(`操作成功`)
        this.getRecord()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`confirm fail:${err}`)
    }
    (this.$refs.invite as any).submitForm()
  }
  /**
   * 校验通过
   */
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
