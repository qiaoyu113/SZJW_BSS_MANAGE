<template>
  <div :class="isPC ? 'ShowLog' : 'ShowLog-m'">
    <!--table表单-->
    <div class="table_center">
      <el-table
        v-loading="listLoading"
        :data="list"
        :row-style="{height: '20px'}"
        :cell-style="{padding: '5px 0'}"
        size="mini"
        :height="isPC ? 'calc(100vh - 250px)' : 'calc(100vh - 140px)'"
        fit
        :border="isPC"
        stripe
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          fixed
          align="left"
          label="创建时间"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createDate | Timestamp }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作描述"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.operDesc }}</span>
          </template>
        </el-table-column>

        <el-table-column
          class-name="status-col"
          label="操作员"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createrName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="执行结果"
        >
          <template slot-scope="{row}">
            {{ row.result }}
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="备注"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.remarks }}</p>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="操作类型"
        >
          <template slot-scope="scope">
            <p>
              <span>{{ scope.row.operType }}</span>
            </p>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="操作后状态"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.afterState }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :operation-list="operationList"
      @pagination="getList"
    />
  </div>
</template>
<script lang="ts">
import { GetLogList } from '@/api/cargo'
import { HandlePages } from '@/utils/index'
import Pagination from '@/components/Pagination/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { Vue, Component, Watch } from 'vue-property-decorator'
interface IState {
  [key: string]: any;
}

@Component({
  name: 'ShowLog',
  components: {
    Pagination
  }
})

export default class ShowLog extends Vue {
  private listLoading = true
  private list: any[] = []
  private total = 0;
  private operationList: any[] = [{}]
  private listQuery: IState = {
    page: 1,
    limit: 30,
    lineId: ''
  }
  created() {
    this.listQuery.lineId = this.$route.query.id
    this.fetchData()
  }

  // 所有请求方法
  private fetchData() {
    this.getList(this.listQuery)
  }

  // 请求列表
  private async getList(value: any) {
    this.listQuery.page = value.page
    this.listQuery.limit = value.limit
    this.listLoading = true
    const { data } = await GetLogList(this.listQuery)
    if (data.success) {
      this.list = data.data
      data.page = await HandlePages(data.page)
      this.total = data.page.total
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    } else {
      this.$message.error(data)
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    }
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>
<style scoped>
.ShowLog{
  padding: 20px;
}
.ShowLog-m{
  overflow: hidden;
}
.ShowLog-m .table_center{
  overflow-y: scroll;
}
.ShowLog >>> .operation-main,.ShowLog-m >>> .operation-m{
  display: none;
}
</style>
