<template>
  <div :class="isPC ? 'MyClue' : 'MyClue-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-date="handleDate"
      @handle-query="handleQuery"
    >
      <MyClueForm
        :list-query="listQuery"
        :date-value="DateValue"
        @handle-tags="handleTags"
      />
    </SuggestContainer>
    <div class="table_box">
      <!-- 操作栏 -->
      <TableHeader
        :tab="tab"
        :active-name="listQuery.state"
      >
        <el-button
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          type="primary"
          size="small"
          icon="el-icon-search"
        >
          <span v-if="isPC">创建线索</span>
        </el-button>
        <el-button
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          type="primary"
          size="small"
          icon="el-icon-search"
        >
          <span v-if="isPC">发起面试</span>
        </el-button>

        <el-dropdown :hide-on-click="false">
          <el-button
            :class="isPC ? 'btn-item-filtrate' : 'btn-item-filtrate-m'"
            type="primary"
            size="small"
            icon="el-icon-search"
          >
            <span v-if="isPC">筛选</span>
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
            align="left"
            label="姓名"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.customerId }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            label="电话"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.customerName }} （{{ scope.row.cityName }})</span>
            </template>
          </el-table-column>

          <el-table-column
            class-name="status-col"
            label="城市"
          >
            <template slot-scope="{row}">
              <el-tag :type="row.status | articleStatusFilter">
                {{ row.primaryClassificationName }}<span v-if="row.secondaryClassificationName">/{{ row.secondaryClassificationName }}</span>
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            v-if="isPC"
            align="left"
            label="车型"
          >
            <template slot-scope="{row}">
              {{ row.contractEffectiveness }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="isPC"
            align="left"
            label="来源"
          >
            <template slot-scope="scope">
              <p>{{ scope.row.createDate | Timestamp }}</p>
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
import Pagination from '@/components/Pagination/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import TableHeader from '@/components/TableHeader/index.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { CargoListData } from '@/api/types'
import { GetCustomerList } from '@/api/customer'
import { HandlePages } from '@/utils/index'
import { MyClueForm } from './components'
import '@/styles/common.scss'
interface IState {
  [key: string]: any;
}
  interface tags {
    type:string,
    key:string
  }
  @Component({
    name: 'MyClue',
    components: {
      MyClueForm,
      Pagination,
      TableHeader,
      SuggestContainer
    }
  })
export default class extends Vue {
  private total = 0
  private list: CargoListData[] = []
  private page: Object | undefined = ''
  private listLoading = true
  private tab:tags[] = [
    {
      label: '线索总数',
      name: '0'
    },
    {
      label: '待跟进数',
      name: '1'
    },
    {
      label: '已跟进数',
      name: '2'
    },
    {
      label: '已转化数',
      name: '3'
    }
  ]
  private tags:object[] = []
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
  private checkList: any[] = ['复选框A', '复选框B']
  private DateValue: any[] = []
  // 处理query方法
  private handleQuery(value:any, key:any) {
    this.listQuery[key] = value
    // this.fetchData()
  }
  private handleTags(val:any):void {
    console.log(val)
    this.tags = val
  }

  // 处理选择日期方法
  private handleDate(value:any) {
    this.DateValue = value
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
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
}
</script>

<style lang="scss" scoped>
.MyClue{
    padding: 15px;
    padding-bottom: 0;
    box-sizing: border-box;
    .btn-item{
      background: #649CEE;
      border-radius: 4px;
      border: none;
      margin-left:10px;
    }
    .btn-item-filtrate{
      background: #FFA000;
      border-radius: 4px;
      border: none;
      margin-left:10px;
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
}
</style>
<style lang="scss" scoped>
.MyClue-m{
  .btn-item-m{
      background: #649CEE;
      border-radius: 4px;
      border: none;
      margin-right:10px;
    }
  .btn-item-filtrate-m{
    background: #FFA000;
    border-radius: 4px;
    margin-left:10px;
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
}
</style>
