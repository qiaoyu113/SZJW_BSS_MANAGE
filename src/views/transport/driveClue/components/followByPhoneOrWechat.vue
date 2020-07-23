<template>
  <div class="followByPhoneOrWechat">
    <SelfDialog
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
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'
import { ClueFollow } from '@/api/driver'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'FollowByPhoneOrWechat',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) type!:number
  @Prop({ default: '' }) clueId!:string|number
  private showAlert = false
  private dialogForm:IState = {
    remarks: ''
  }
  private title:string = ''

  private dialogItems:any[] = [
    {
      type: 1,
      key: 'remarks',
      tagAttrs: {
        placeholder: '跟进情况描述',
        type: 'textarea',
        rows: 3,
        maxlength: 100,
        'show-word-limit': 100
      }
    }
  ]

  @Watch('type')
  onTypeChange(val:number) {
    if (val === 1) {
      this.title = '电话跟进'
    } else if (val === 2) {
      this.title = '微信跟进'
    } else if (val === 4) {
      this.title = '无效线索'
    } else if (val === 5) {
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
    this.dialogForm.remarks = ''
  }
  cancel() {
    this.showAlert = false
  }
  async confirm() {
    try {
      if (!this.dialogForm.remarks) {
        return this.$message.error('请输入跟进情况描述')
      }
      let params = {
        clueId: this.clueId,
        remarks: this.dialogForm.remarks,
        type: this.type
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
  }
  @Emit('getRecord')
  getRecord() {
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
