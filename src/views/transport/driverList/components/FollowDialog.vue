<template>
  <div>
    <!-- 司机跟进 -->
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
import SelfForm from '@/components/Base/SelfForm.vue'
import { DriverFollowOp } from '@/api/driver'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'FollowDialog',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: '' }) type!:number
  @Prop({ default: '' }) driverId!:string
  private showAlert = false // 控制弹窗
  private title:string = '' // 标题
  // 表单对象
  private dialogForm:IState = {
    remarks: ''
  }
  // 表单数组
  private dialogItems:any[] = [
    {
      type: 1,
      key: 'remarks',
      tagAttrs: {
        placeholder: '描述跟进情况(50字以内)',
        type: 'textarea',
        name: 'followDriver_remarks_input',
        rows: 3,
        maxlength: 50,
        'show-word-limit': true,
        clearable: true
      }
    }
  ]

  @Watch('type')
  onTypeChange(val:number) {
    if (val === 5) {
      this.title = '成交意向'
    } else if (val === 6) {
      this.title = '征信通过情况'
    } else if (val === 7) {
      this.title = '跟车情况'
    } else if (val === 8) {
      this.title = '其他'
    }
  }

  @Emit('onRefresh')
  handleRefresh() {
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
   *关闭弹窗后
   */
  handleClosed() {
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
      if (!this.dialogForm.remarks) {
        return this.$message.error('请输入跟进情况')
      }
      let params = {
        createId: 0,
        driverId: this.driverId,
        remarks: this.dialogForm.remarks,
        type: this.type
      }

      let { data: res } = await DriverFollowOp(params)
      if (res.success) {
        this.showAlert = false
        this.$message.success('操作成功')
        this.handleRefresh()
      }
    } catch (err) {
      console.log(`confirm fail:${err}`)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
