<template>
  <div :class="isPC ? 'OrderLog' : 'OrderLog-m'">
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
          align="left"
          label="时间"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.customerId }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="用户"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.customerName }} （{{ scope.row.cityName }})</span>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="平台"
        >
          <template slot-scope="{row}">
            <el-tag :type="row.status | articleStatusFilter">
              {{ row.primaryClassificationName
              }}<span
                v-if="row.secondaryClassificationName"
              >/{{ row.secondaryClassificationName }}</span>
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="操作前"
        >
          <template slot-scope="{row}">
            {{ row.contractEffectiveness }}
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="操作后"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.createDate | Timestamp }}</p>
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
import { GetOrderLog } from '@/api/join'
import { HandlePages } from '@/utils/index'
import Pagination from '@/components/Pagination/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { CargoListData } from '@/api/types'
interface IState {
  [key: string]: any;
}

@Component({
  name: 'OrderLog',
  components: {
    Pagination
  }
})

export default class ShowLog extends Vue {
  private listLoading = true
  private list: CargoListData[] = []
  private total = 0;
  private operationList: any[] = [{}]
  private listQuery: IState = {
    key: '',
    city: '',
    page: 1,
    limit: 30,
    endDate: '',
    startDate: '',
    state: '',
    lineSaleId: ''
  }
  created() {
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
    const { data } = await GetOrderLog(this.listQuery)
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
.OrderLog{
  padding: 20px;
}
.OrderLog-m{
  overflow: hidden;
}
.OrderLog-m .table_center{
  overflow-y: scroll;
}
.OrderLog >>> .operation-main,.ShowLog-m >>> .operation-m{
  display: none;
}
</style>
