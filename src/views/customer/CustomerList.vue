<template>
  <div :class="isPC ? 'DriverList' : 'DriverList-m'">
    <SuggestContainer
      :tab="[
        {
          label: '待跟进',
          name: '0'
        },
        {
          label: '跟进中',
          name: '1'
        },
        {
          label: '已面试',
          name: '2'
        },
        {
          label: '已面试',
          name: '3'
        }
      ]"
      :tags="tags"
      active-name="0"
      @handle-date="handleDate"
      @handle-query="handleQuery"
    >
      <SuggestForm
        :list-query="listQuery"
        :date-value="DateValue"
        @handle-tags="handleTags"
      />
    </SuggestContainer>
    <el-table
      v-loading="listLoading"
      :data="list"
      height="250"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        fixed
        width="150px"
        align="center"
        label="货主编号"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.customerId }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="180px"
        align="center"
        label="货主"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.customerName }} （{{ scope.row.cityName }})</span>
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        label="类型"
        width="180px"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | articleStatusFilter">
            {{ row.primaryClassificationName }}<span v-if="row.secondaryClassificationName">/{{ row.secondaryClassificationName }}</span>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        width="160px"
        align="center"
        label="合同状态"
      >
        <template slot-scope="{row}">
          {{ row.contractEffectiveness }}
        </template>
      </el-table-column>

      <el-table-column
        width="180px"
        align="center"
        label="创建时间"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.createDate | Timestamp }}</p>
        </template>
      </el-table-column>

      <el-table-column
        width="180px"
        align="center"
        label="创建人"
      >
        <template slot-scope="scope">
          <p><span v-if="scope.row.creatorName">({{ scope.row.creatorName }})</span></p>
        </template>
      </el-table-column>

      <el-table-column
        min-width="120px"
        align="center"
        label="合同止期"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.contractEnd | Timestamp }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="120"
        align="center"
        label="线路销售"
      >
        <template slot-scope="{row}">
          {{ row.lineSaleName | DataIsNull }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="120"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="goDetail(scope.row.customerId)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { GetCustomerList } from '@/api/customer'
import { IArticleData } from '@/api/types'
import { HandlePages } from '@/utils/index'
import Pagination from '@/components/Pagination/index.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { SuggestForm } from './components'
import { SettingsModule } from '@/store/modules/settings'

interface IState {
  [key: string]: any;
}

  @Component({
    name: 'DriverList',
    components: {
      Pagination,
      SuggestContainer,
      SuggestForm
    }
  })

export default class extends Vue {
    private total = 0
    private list: IArticleData[] = []
    private page: Object | undefined = ''
    private listLoading = true
    private tags: any[] = []
    private DateValue: any[] = []
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

    mounted() {
    }

    activated() {
    // this.handleScroll()
    }

    // 判断是否是PC
    get isPC() {
      return SettingsModule.isPC
    }

    // 所有请求方法
    private fetchData() {
      this.getList()
    }

    // 处理tags方法
    private handleTags(value:any) {
      this.tags = value
    }

    // 处理query方法
    private handleQuery(value:any, key:any) {
      this.listQuery[key] = value
      this.fetchData()
    }

    // 处理选择日期方法
    private handleDate(value:any) {
      this.DateValue = value
    }

    // 请求列表
    private async getList() {
      this.listLoading = true
      const { data } = await GetCustomerList(this.listQuery)
      if (data.success) {
        this.list = data.data
        data.page = await HandlePages(data.page)
        this.total = data.page.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }
    }

    // 按钮操作
    private goDetail(id: string | (string | null)[] | null | undefined) {
      this.$router.push({ name: 'CustomerDetail', query: { id: id } })
    }
}
</script>

<style lang="scss" scoped>
  .DriverList{
    padding: 20px;
    padding-bottom: 0;
    box-sizing: border-box;
    .el-table{
      height: calc(100vh - 310px) !important;
      border: 1px solid #dfe6ec;
      overflow-y: scroll;
    }
    .edit-input {
      padding-right: 100px;
    }
    .cancel-btn {
      position: absolute;
      right: 15px;
      top: 10px;
    }
    .pagination-container{
      background: #f8f9fa;
    }
  }

</style>

<style lang="scss" scoped>
  .DriverList-m{
    padding-bottom: 0;
    box-sizing: border-box;
    .el-table{
      height: calc(100vh - 250px) !important;
      border: 1px solid #dfe6ec;
      overflow-y: scroll;
    }
    .edit-input {
      padding-right: 100px;
    }
    .cancel-btn {
      position: absolute;
      right: 15px;
      top: 10px;
    }
    .pagination-container{
      background: #f8f9fa;
    }
  }

</style>
