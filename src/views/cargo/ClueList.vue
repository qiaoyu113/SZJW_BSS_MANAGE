<template>
  <div :class="isPC ? 'ClueList' : 'ClueList-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-date="handleDate"
      @handle-query="handleQuery"
    >
      <ClueListForm
        :list-query="listQuery"
        :date-value="DateValue"
        @handle-tags="handleTags"
      />
    </SuggestContainer>

    <div class="table_box">
      <!--操作栏-->
      <TableHeader
        :tab="tab"
        :active-name="listQuery.state"
      >
        <el-button
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          type="primary"
          size="small"
        >
          创建客户
        </el-button>

        <el-dropdown :hide-on-click="false">
          <el-button
            :class="isPC ? 'btn-item-filtrate' : 'btn-item-filtrate-m'"
            type="primary"
            size="small"
          >
            筛选
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-checkbox-group v-model="checkList">
              <el-dropdown-item>
                <el-checkbox label="复选框A" />
              </el-dropdown-item>
              <el-dropdown-item>
                <el-checkbox label="复选框B" />
              </el-dropdown-item>
              <el-dropdown-item>
                <el-checkbox label="复选框C" />
              </el-dropdown-item>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </tableheader>

      <!--table表单-->
      <div class="table_center">
        <el-table
          v-loading="listLoading"
          :data="list"
          :row-style="{height: '20px'}"
          :cell-style="{padding: '5px 0'}"
          size="mini"
          :height="'100%'"
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
            align="left"
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
                {{ row.primaryClassificationName }}<span v-if="row.secondaryClassificationName">/{{ row.secondaryClassificationName }}</span>
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
              <p><span v-if="scope.row.creatorName">({{ scope.row.creatorName }})</span></p>
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

          <el-table-column
            align="left"
            label="操作"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-dropdown>
                <span
                  class="el-dropdown-link"
                >
                  更多操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    icon="el-icon-files"
                    @click="goDetail(scope.row.customerId)"
                  >
                    详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { GetCustomerList } from '@/api/customer'
import { CargoListData } from '@/api/types'
import { HandlePages } from '@/utils/index'
import Pagination from '@/components/Pagination/index.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { ClueListForm } from './components'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}

  @Component({
    name: 'ClueList',
    components: {
      Pagination,
      SuggestContainer,
      TableHeader,
      ClueListForm
    }
  })

export default class extends Vue {
    private total = 0
    private list: CargoListData[] = []
    private page: Object | undefined = ''
    private listLoading = true
    private tags: any[] = []
    private DateValue: any[] = []
    private checkList: any[] = ['复选框A', '复选框B']
    private tab: any[] = [
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
    ]
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
      this.getList(this.listQuery)
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

    // 按钮操作
    private goDetail(id: string | (string | null)[] | null | undefined) {
      this.$router.push({ name: 'CustomerDetail', query: { id: id } })
    }
}
</script>

<style lang="scss" scoped>
  .ClueList{
    padding: 15px;
    padding-bottom: 0;
    box-sizing: border-box;
    .btn-item{
      background: #649CEE;
      border-radius: 4px;
      border-radius: 4px;
      border: none;
      margin:0 10px;
    }
    .btn-item-filtrate{
      background: #FFA000;
      border-radius: 4px;
      border-radius: 4px;
      border: none;
    }
    .table_box{
      height: calc(100vh - 225px) !important;
      background: #FFFFFF;
      // border: 1px solid #dfe6ec;
      box-shadow: 4px 4px 10px 0 rgba(218,218,218,0.50);
      overflow: hidden;
      .table_center{
        height: calc(100vh - 360px) !important;
        padding:30px;
        padding-bottom: 0;
        box-sizing: border-box;
        background: #FFFFFF;
        overflow-y: scroll;
      }
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
      background: #fff;
    }
  }

</style>

<style lang="scss" scoped>
  .ClueList-m{
    padding-bottom: 0;
    box-sizing: border-box;
    .btn-item-m{
      background: #649CEE;
      border-radius: 4px;
      border-radius: 4px;
      border: none;
      margin:0 10px;
    }
    .btn-item-filtrate-m{
      background: #FFA000;
      border-radius: 4px;
      border-radius: 4px;
      border: none;
    }
    .table_box{
      height: calc(100vh - 183px) !important;
      background: #FFFFFF;
      // border: 1px solid #dfe6ec;
      box-shadow: 4px 4px 10px 0 rgba(218,218,218,0.50);
      overflow: hidden;
      .table_center{
        height: calc(100vh - 300px) !important;
        padding-bottom: 0;
        box-sizing: border-box;
        background: #FFFFFF;
        overflow-y: scroll;
      }
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
