<template>
  <div>
    <!-- 分配线索 -->
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
        label-width="110px"
      />
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { updateGmId } from '@/api/transport'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'ManagerDialog',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: () => [] }) rows!:any
  @Prop({ default: () => [] }) options!:any[]
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
      label: '请选择运营经理',
      tagAttrs: {
        placeholder: '请选择新的运营经理',
        filterable: true
      },
      options: []
    }
  ]

  @Watch('options', { deep: true })
  optionsChange(val:any[]) {
    console.log(456)
    this.dialogItems[0].options = val
  }

  @Watch('type')
  onTypeChange(val:string) {
    if (this.type === 'modify') {
      this.title = '修改运营经理'
    } else if (this.type === 'distribution') {
      this.title = '分配运营经理'
    }
  }
  mounted() {
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
  async confirm() {
    if (!this.dialogForm.manager) {
      return this.$message.error('请选择运营经理')
    }
    this.showAlert = false
    let carrierIds:any[] = []
    this.rows.map((ele:any, index:any) => {
      carrierIds.push(ele.carrierId)
    })
    let params = {
      'carrierIds': carrierIds,
      'gmId': this.dialogForm.manager
    }
    let { data } = await updateGmId(params)
    if (data.success) {
      this.$message.success('已成功分配运营经理')
      console.log(data)
    } else {
      this.$message.error(data)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
