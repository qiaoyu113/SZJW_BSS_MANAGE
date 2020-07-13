<template>
  <div class="tenderLog">
    <el-card>
      <!-- 表格 -->
      <self-table
        ref="tendermanageTable"
        v-loading="listLoading"
        :table-data="tableData"
        :columns="columns"
        :operation-list="[]"
        :page="page"
        :index="false"
        @onPageSize="handlePageSize"
      >
        <template v-slot:time="scope">
          {{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}
        </template>
      </self-table>
    </el-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfTable from '@/components/base/SelfTable.vue'

interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}
@Component({
  name: 'TenderLog',
  components: {
    SelfTable
  }
})
export default class extends Vue {
   private listLoading:boolean = false
   private tableData = [
     {
       time: Date.now(),
       op: '上岗',
       opPerson: 'tom',
       opResult: '已上线'
     }
   ]
   private columns = [
     {
       key: 'time',
       label: '时间',
       slot: true
     },
     {
       key: 'op',
       label: '操作类型'
     },
     {
       key: 'opPerson',
       label: '操作员'
     },
     {
       key: 'opResult',
       label: '操作结果'
     }
   ]

   /**
   *分页对象
   */
  private page:PageObj = {
    page: 1,
    limit: 20,
    total: 100
  }
  /**
   * 分页
   */
  handlePageSize(page:any) {
    this.page.page = page.page
    this.page.limit = page.limit
  }
}
</script>
<style lang="scss" scoped>
  .tenderLog {
    padding: 20px;
  }
</style>
