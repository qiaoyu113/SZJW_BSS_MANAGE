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
import { UpdateDriverBDManager, driverDownToGm } from '@/api/driver'
import { GetManagerLists } from '@/api/common'
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
    gmId: ''
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
      options: []
    }
  ]

  @Watch('type')
  onTypeChange(val:string) {
    this.getManagers()
    if (this.type === 'modify') {
      this.title = '修改加盟经理'
    } else if (this.type === 'distribution') {
      this.title = '分配加盟经理'
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
    this.dialogForm.gmId = ''
    this.setEmptyRows([])
  }
  @Emit('onRows')
  setEmptyRows(a:any) {
  }
  cancel() {
    this.showAlert = false
  }
  async confirm() {
    try {
      if (!this.dialogForm.manager) {
        return this.$message.error('请选择加盟经理')
      }
      if (this.type === 'modify') {
        this.modifyManager()
      } else if (this.type === 'distribution') {
        this.driverDownToGm()
      }
    } catch (err) {
      console.log(`confirm fail:${err}`)
    }
  }

  /**
 *分配加盟经理
 */
  async driverDownToGm() {
    try {
      let params = {
        driverId: this.rows[0].driverId,
        gmId: this.dialogForm.gmId
      }
      let { data: res } = await driverDownToGm(params)
      if (res.success) {
        this.showAlert = false
        this.$message.success('操作成功')
        this.getList()
      }
    } catch (err) {
      console.log(`driver to gm fail:${err}`)
    }
  }
  /**
 *修改加盟经理
 */
  async modifyManager() {
    try {
      let driverId = this.rows.map(function(item:any) {
        return item.driverId
      })
      let params = {
        driverId,
        gmId: this.dialogForm.gmId
      }

      let { data: res } = await UpdateDriverBDManager(params)
      if (res.success) {
        this.showAlert = false
        this.$message.success('操作成功')
        this.getList()
      }
    } catch (err) {
      console.log(`modify manager fail:${err}`)
    }
  }
  @Emit('onRefresh')
  getList() {
  }
}
</script>
<style lang="scss" scoped>
</style>
