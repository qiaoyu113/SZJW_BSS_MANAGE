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
import { UpdateDriverBDManager, driverDownToGm } from '@/api/driver'
import { GetManagerLists } from '@/api/common'
import { delayTime } from '@/settings'
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
  @Prop({ default: '' }) type!:string
  private showAlert = false // 是否显示弹窗
  private title:string = '' // 标题

  private gmOptions:any[] = [] // 加盟经理列表
  // 表单对象
  private dialogForm:IState = {
    gmId: ''
  }
  // 表单数组
  private dialogItems:any[] = [
    {
      type: 2,
      key: 'gmId',
      label: '请选择加盟经理',
      tagAttrs: {
        placeholder: '请选择新的加盟经理',
        filterable: true,
        name: 'driverlist_gmId_select'
      },
      options: this.gmOptions
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
  @Emit('onRows')
  setEmptyRows(a:any) {
  }
  @Emit('onRefresh')
  getList() {
  }

  /**
   *获取加盟经理列表
   */
  async getManagers() {
    try {
      let params = {
        uri: '/v1/driver/driverDownToGm'
      }
      let { data: res } = await GetManagerLists(params)
      if (res.success) {
        let gms = res.data.map(function(item:any) {
          return {
            label: item.name,
            value: item.id
          }
        })
        this.gmOptions.push(...gms)
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
    this.dialogForm.gmId = ''
    this.setEmptyRows([])
  }
  /**
   * 取消
   */
  cancel() {
    this.showAlert = false
  }
  /**
   * 确定
   */
  async confirm() {
    try {
      if (!this.dialogForm.gmId) {
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
        setTimeout(() => {
          this.getList()
        }, delayTime)
      } else {
        this.$message.error(res.errorMsg)
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
        setTimeout(() => {
          this.getList()
        }, delayTime)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`modify manager fail:${err}`)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
