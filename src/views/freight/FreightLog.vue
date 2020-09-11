<template>
  <div :class="isPC ? 'ShowLog' : 'ShowLog-m'">
    <!--table表单-->
    <div class="table_center">
      <el-table
        v-loading="listLoading"
        :data="lists"
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
          label="时间"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createDate }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="用户"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.dealName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="平台"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createSource }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="操作前"
        >
          <template slot-scope="{row}">
            {{ row.afterStateName }}
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="操作后"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.beforeStateName }}</p>
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
import { freightLog } from '@/api/freight'
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
  private lists: any[] = []
  private total = 0;
  private operationList: any[] = [{}]
  private listQuery: IState = {
    page: 1,
    limit: 30,
    wayBillId: ''
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
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
    const { data } = await freightLog(this.listQuery)
    if (data.success) {
      console.log(data)
      this.lists = data.data
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
  created() {
    this.listQuery.wayBillId = this.$route.query.id
    this.fetchData()
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
