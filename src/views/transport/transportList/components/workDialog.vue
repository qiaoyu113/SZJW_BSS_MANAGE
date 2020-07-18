<template>
  <div>
    <!-- 分配线索 -->
    <Dialog
      :visible.sync="showAlert"
      title="上岗"
      width="30%"
      :before-close="beforeClose"
      :cancel="cancel"
      :confirm="confirm"
      @closed="handleClosed"
    >
      <div class="searchBox">
        <span
          class="label"
          v-text="label"
        />
        <el-select
          v-model="searchVal"
          placeholder="请选择"
        >
          <el-option
            v-for="item in searchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span class="changeBtn">切换为货主搜索</span>
      </div>
      <self-form
        v-if="showForm"
        :list-query="dialogForm"
        :form-item="dialogItems"
        :pc-col="12"
        label-width="110px"
      />
    </Dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import Dialog from '@/components/Dialog/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'

interface IState {
  [key: string]: any;
}
@Component({
  name: 'workDialog',
  components: {
    Dialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: () => [] }) rows!:any
  @Prop({ default: '' }) type!:string
  private showAlert = false
  private label:string = '选择线路'
  private searchVal:string = ''
  private showForm:boolean = false
  private searchOptions:any[] = [
    {
      value: '选项1',
      label: '黄金糕'
    }, {
      value: '选项2',
      label: '双皮奶'
    }, {
      value: '选项3',
      label: '蚵仔煎'
    }, {
      value: '选项4',
      label: '龙须面'
    }, {
      value: '选项5',
      label: '北京烤鸭'
    }]
  private dialogItems:any[] = [
    {
      type: 7,
      key: 'lineId',
      label: '线路编号'
    },
    {
      type: 7,
      key: 'lineId',
      label: '可上车数'
    },
    {
      type: 7,
      key: 'lineId',
      label: '线路名称'
    },
    {
      type: 7,
      key: 'lineId',
      label: '可上岗'
    },
    {
      type: 7,
      key: 'lineId',
      label: '仓位置'
    },
    {
      type: 7,
      key: 'lineId',
      label: '线路稳定性'
    },
    {
      type: 7,
      key: 'lineId',
      label: '配送区域'
    },
    {
      type: 7,
      key: 'lineId',
      label: '线路有效期'
    },
    {
      type: 1,
      label: '每日配送趟数',
      key: 'plateNo',
      tagAttrs: {
        placeholder: '请输入车牌号'
      }
    },
    {
      type: 3,
      key: 'createDate',
      label: '预计工作时间',
      col: 24
    }
  ]
  private dialogForm:IState = {
    lineId: '6513'
  }

  @Watch('searchVal')
  changeVal(val:string) {
    if (val) {
      this.showForm = true
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
  }
  cancel() {
    this.showAlert = false
  }
  async confirm() {
    console.log(this.rows)
    // let { data } = status
  }
}
</script>
<style lang="scss" scoped>
.searchBox{
  display: flex;
  justify-content: center;
  align-items: center;
  .label{
    margin-right: 5%;
  }
  .changeBtn{
    margin-left: 5%;
    color: #649CEE;
    cursor: pointer;
  }
}
</style>
