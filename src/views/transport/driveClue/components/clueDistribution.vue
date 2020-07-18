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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Dialog from '@/components/Dialog/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'
import { ClueDispatch } from '@/api/driver'
import { GetManagerLists } from '@/api/common'
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
  @Prop({ default: () => [] }) rows!:any[]
  private showAlert = false
  private dialogForm:IState = {
    userId: ''
  }

  private dialogItems:any[] = [
    {
      type: 2,
      key: 'userId',
      tagAttrs: {
        placeholder: '请选择跟进人',
        filterable: true
      },
      options: []
    }
  ]

  @Watch('showAlert')
  onShowAlertChange(val:boolean) {
    if (val) {
      this.getManagers()
    }
  }
  /**
   *获取加盟经理列表
   */
  async getManagers() {
    try {
      let { data: res } = await GetManagerLists()
      if (res.success) {
        this.dialogItems[0].options = res.data.map(function(item:any) {
          return {
            label: item.name,
            value: item.id
          }
        })
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get manager fail:${err}`)
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
    this.dialogForm.userId = ''
  }
  cancel() {
    this.showAlert = false
  }
  async confirm() {
    try {
      if (!this.dialogForm.userId) {
        return this.$message.error('请选择人进人')
      }
      let clueIds = this.rows.map(function(item:any) {
        return item.clueId
      })
      let params = {
        clueIds,
        userId: this.dialogForm.userId
      }
      let { data: res } = await ClueDispatch(params)
      if (res.success) {
        this.showAlert = false
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`confirm fail:${err}`)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
