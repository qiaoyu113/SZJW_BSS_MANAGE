<template>
  <div>
    <!-- 分配线索 -->
    <SelfDialog
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
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { ClueDispatch } from '@/api/driver'
import { GetManagerLists } from '@/api/common'
import { delayTime } from '@/settings'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'ClueDistribution',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: () => [] }) rows!:any[]
  private showAlert = false // 控制弹窗

  private gmOptions:any[] = [] // 跟进人列表
  // 表单对象
  private dialogForm:IState = {
    userId: ''
  }
  // 表单数组
  private dialogItems:any[] = [
    {
      type: 2,
      key: 'userId',
      tagAttrs: {
        placeholder: '请选择跟进人',
        filterable: true
      },
      options: this.gmOptions
    }
  ]

  @Watch('showAlert')
  onShowAlertChange(val:boolean) {
    if (val) {
      this.getManagers()
    }
  }
  @Emit('onRefresh')
  handleRefresh() {
  }
  /**
   *获取加盟经理列表
   */
  async getManagers() {
    try {
      let params = {
        uri: '/v1/driver/clue/clue/follow'
      }
      let { data: res } = await GetManagerLists(params)
      if (res.success) {
        let gm = res.data.map(function(item:any) {
          return {
            label: item.name,
            value: item.id
          }
        })
        this.gmOptions.push(...gm)
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
  /**
   * 弹窗关闭后
   */
  handleClosed() {
    this.dialogForm.userId = ''
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
        this.$message.success('操作成功')
        setTimeout(() => {
          this.handleRefresh()
        }, delayTime)
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
