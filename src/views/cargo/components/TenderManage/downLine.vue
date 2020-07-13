<template>
  <div class="downLine">
    <Dialog
      :visible.sync="showAlert"
      title="标书下线"
      width="40%"
      :before-close="beforeClose"
      :cancel="cancel"
      :confirm="confirm"
      center
      confirm-button-text="提交"
    >
      <self-form
        :list-query="dialogForm"
        :form-item="dialogItems"
        :pc-col="12"
        label-width="90px"
      >
        <template v-slot:lineExpire="{row}">
          {{ row.lineExpire | parseTime('{y}-{m}-{d}') }}(司机原因,线路T +7天)
        </template>
        <template v-slot:reason="{row}">
          <el-dropdown @command="(e) => handleCommandChange(e)">
            <span class="el-dropdown-link">
              <el-button
                :a="row"
                type="primary"
              >
                显现原因
              </el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="cuntomer"
              >
                客户原因
              </el-dropdown-item>
              <el-dropdown-item
                command="driver"
              >
                司机原因
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </self-form>
    </Dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import Dialog from '@/components/Dialog/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'

interface IState {
  [key: string]: any;
}
@Component({
  name: 'DownLine',
  components: {
    Dialog,
    SelfForm
  }
})
export default class extends Vue {
  private showAlert = false
  private dialogForm:IState = {
    transportInfo: '    ',
    name: '贾大方',
    ycode: '1213131232',
    manager: '张晓气',
    carType: '金杯',
    tenderInfo: '  ',
    code: '12312',
    lineName: '金杯EK配送',
    lineExpire: Date.now()
  }
  private title:string = ''

  private dialogItems:any[] = [
    {
      type: 7,
      label: '运力信息',
      col: 24,
      class: 'labelTitle',
      key: 'transportInfo'
    },
    {
      type: 7,
      key: 'name',
      label: '运力姓名:'
    },
    {
      type: 7,
      key: 'ycode',
      label: '运力编号:'
    },
    {
      type: 7,
      key: 'manager',
      label: '加盟经理:'
    },
    {
      type: 7,
      key: 'carType',
      label: '车型:'
    },
    {
      type: 7,
      label: '标书信息',
      class: 'labelTitle',
      col: 24,
      key: 'tenderInfo'
    },
    {
      type: 7,
      label: '标书编号:',
      key: 'code'
    },
    {
      label: '线路名称:',
      key: 'lineName',
      type: 7
    },
    {
      label: '线路有效期:',
      key: 'lineExpire',
      slot: true,
      type: 'lineExpire',
      col: 15
    },
    {
      key: 'reason',
      slot: true,
      type: 'reason',
      w: '0px',
      col: 9
    }
  ]

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
  cancel() {
    this.showAlert = false
  }
  confirm() {
    this.showAlert = false
  }
  @Emit('onSubmit')
  handleConfirmClick() {
  }
  /**
  *下线原因
  */
  handleCommandChange(e:string) {
    if (e === 'cuntomer') {
      console.log(e)
    } else if (e === 'driver') {
      console.log(e)
    }
  }
}
</script>

<style scoped>
  .downLine >>> label {
    font-weight:400;
  }
  .downLine >>> .labelTitle label{
    font-size: 14px;
    font-weight:bold;
    color: #1f2d3d;
  }

  .downLine >>> .el-form-item {
    margin-bottom:10px;
  }
</style>
