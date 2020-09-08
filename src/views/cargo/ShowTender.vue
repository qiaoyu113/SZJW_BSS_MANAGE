<template>
  <div :class="isPC ? 'ShowTender' : 'ShowTender-m'">
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
          label="货主编号"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.customerId }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="货主"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.customerName }} （{{ scope.row.cityName }})</span>
          </template>
        </el-table-column>

        <el-table-column
          class-name="status-col"
          label="类型"
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
          label="合同状态"
        >
          <template slot-scope="{row}">
            {{ row.contractEffectiveness }}
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="创建时间"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.createDate | Timestamp }}</p>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="创建人"
        >
          <template slot-scope="scope">
            <p>
              <span
                v-if="scope.row.creatorName"
              >({{ scope.row.creatorName }})</span>
            </p>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="合同止期"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.contractEnd | Timestamp }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="线路销售"
        >
          <template slot-scope="{row}">
            {{ row.lineSaleName | DataIsNull }}
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
import { GetCustomerList } from '@/api/customer'
import { HandlePages } from '@/utils/index'
import Pagination from '@/components/Pagination/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { CargoListData } from '@/api/types'
interface IState {
  [key: string]: any;
}

@Component({
  name: 'ShowTender',
  components: {
    Pagination
  }
})

export default class ShowTender extends Vue {
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
    const { data } = await GetCustomerList(this.listQuery)
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

  created() {
    this.fetchData()
  }
}
</script>
<style scoped>
.ShowTender{
  padding: 20px;
}
.ShowTender-m{
  overflow: hidden;
}
.ShowTender-m .table_center{
  overflow-y: scroll;
}
.ShowTender >>> .operation-main,.ShowTender-m >>> .operation-m{
  display: none;
}
</style>
