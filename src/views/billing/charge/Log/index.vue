<template>
  <div
    class="logContainer"
    :class="{
      p15: isPC,
      m15: isPC
    }"
  >
    <div class="top">
      <div class="btn">
        <el-button @click.stop="handleBackClick">
          返回
        </el-button>
      </div>
      <h4>操作日志</h4>
    </div>
    <self-table
      v-loading="listLoading"
      :operation-list="[]"
      :index="false"
      :indexes="false"
      :is-p30="false"
      :table-data="tableData"
      :columns="columns"
    >
      <template v-slot:time="scope">
        {{ scope.row.time }}
      </template>
      <template v-slot:remark="scope">
        <span>
          {{ scope.row.remark }}
        </span>
      </template>
    </self-table>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import { SettingsModule } from '@/store/modules/settings'
@Component({
  components: {
    SelfTable
  }
})
export default class extends Vue {
  private listLoading:boolean = false;
  private tableData:any[] = [];
  private columns:any[] = [
    {
      key: 'a',
      label: '操作人',
      'min-width': '140px'
    },
    {
      key: 'time',
      label: '操作时间',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'remark',
      label: '备注',
      slot: true,
      'min-width': '140px'
    }
  ];

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 返回
  handleBackClick() {
    this.$router.go(-1)
  }
}
</script>
<style lang="scss" scoped>
  .m15 {
     margin: 15px;
  }
  .logContainer {
    background: #ffffff;
    border-radius: 8px;
  }
  .top {
    .btn {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
    }
    h4 {
      margin:10px 0px;
      font-size: 18px;
      color:#999;
    }
  }
</style>
