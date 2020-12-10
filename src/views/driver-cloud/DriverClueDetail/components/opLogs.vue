<template>
  <div>
    <div
      class="table_box"
    >
      <h4>操作日志</h4>
      <self-table
        :show-header="false"
        :index="false"
        :is-p30="false"
        :operation-list="[]"
        :table-data="tableData"
        :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
        :columns="columns"
        :page="page"
        @onPageSize="handlePageSize"
      >
        <template v-slot:createDate="scope">
          {{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </self-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import { HandlePages, lock, parseTime } from '@/utils/index'
import { GetDriverClueLogList } from '@/api/driver-cloud'
interface PageObj {
  page:number,
  limit:number,
  total?:number
}

interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SelfTable
  }
})
export default class extends Vue {
  private tableData:IState[] = [];
  private columns:IState[] = [
    {
      key: 'detail',
      label: ''
    },
    {
      key: 'createDate',
      label: '',
      slot: true,
      'width': '140px'
    }
  ];
  // 表格分页
  private page :PageObj= {
    page: 1,
    limit: 10,
    total: 0
  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 获取日志表格
  async getLists() {
    try {
      let params:IState = {
        page: this.page.page,
        limit: this.page.limit,
        marketClueId: this.$route.query.id
      }

      let { data: res } = await GetDriverClueLogList(params)
      if (res.success) {
        this.tableData = res.data
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
      } else {
        this.$message.warning(res.message)
      }
    } catch (err) {
      console.log(`get log fail:${err}`)
    } finally {
      //
    }
  }
  mounted() {
    this.getLists()
  }
}
</script>
<style lang="scss" scoped>
  .table_box {
      padding: 30px 30px 0px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
  }
</style>
