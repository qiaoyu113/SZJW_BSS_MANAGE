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
          name="cluelist_creat_btn"
          @click="showDialog = true"
        >
          <i class="el-icon-s-operation" />
          <span v-if="isPC">创建客户</span>
        </el-button>

        <el-dropdown
          :hide-on-click="false"
          trigger="click"
        >
          <el-button
            :class="isPC ? 'btn-item-filtrate' : 'btn-item-filtrate-m'"
            type="primary"
            size="small"
          >
            <i class="el-icon-s-operation" />
            <span v-if="isPC">筛选</span>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-checkbox-group v-model="checkList">
              <el-dropdown-item
                v-for="item in dropdownList"
                :key="item"
              >
                <el-checkbox :label="item" />
              </el-dropdown-item>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </TableHeader>

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
          @cell-click="tableClick"
        >
          <el-table-column
            v-if="checkList.indexOf('货主编号') > -1"
            align="left"
            fixed
            label="货主编号"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.customerId }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('货主') > -1"
            align="left"
            label="货主"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.customerName }} （{{ scope.row.cityName }})</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('类型') > -1"
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
            v-if="checkList.indexOf('合同状态') > -1"
            align="left"
            label="合同状态"
          >
            <template slot-scope="{row}">
              {{ row.contractEffectiveness }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('创建时间') > -1"
            align="left"
            label="创建时间"
          >
            <template slot-scope="scope">
              <p>{{ scope.row.createDate | Timestamp }}</p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('创建人') > -1"
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
            v-if="checkList.indexOf('合同止期') > -1"
            align="left"
            label="合同止期"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.contractEnd | Timestamp }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('线路销售') > -1"
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
            :width="isPC ? 'auto' : '50'"
          >
            <template slot-scope="scope">
              <el-dropdown>
                <span
                  v-if="isPC"
                  class="el-dropdown-link"
                >
                  更多操作<i
                    v-if="isPC"
                    class="el-icon-arrow-down el-icon--right"
                  />
                </span>
                <span
                  v-else
                  style="font-size: 18px;"
                  class="el-dropdown-link"
                >
                  <i class="el-icon-setting el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="goDetail(scope.row.customerNo)"
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
        v-show="total > 0"
        :operation-list="operationList"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
        @olclick="olClicks"
      />
    </div>

    <!-- <Dialog
      :visible.sync="showDialog"
      :title="`测试标题`"
      :show-cancel-button="true"
      :show-confirm-button="true"
      @confirm="confirm"
    >
      <ClueListForm
        :list-query="listQuery"
        :date-value="DateValue"
        @handle-tags="handleTags"
      />
      <ClueListForm
        :list-query="listQuery"
        :date-value="DateValue"
        @handle-tags="handleTags"
      />
    </Dialog> -->
    <Dialog
      :visible.sync="showDialog"
      :title="`测试标题`"
      :center="true"
      :before-close="beforeClose"
      @cancel="cancel"
      @confirm="confirm"
    >
      <p>确认要关闭弹窗吗</p>
    </Dialog>
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
import Dialog from '@/components/Dialog/index.vue'
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
    ClueListForm,
    Dialog
  }
})
export default class extends Vue {
  private showDialog: boolean= false;
  private total = 0;
  private list: CargoListData[] = [];
  private page: Object | undefined = '';
  private listLoading = true;
  private tags: any[] = [];
  private DateValue: any[] = [];
  private operationList: any[] = [
    { icon: 'el-icon-phone', name: '1', color: '#999' },
    { icon: 'el-icon-star-off', name: '2', color: '#978374' }
  ];
  private dropdownList: any[] = [
    '货主编号',
    '货主',
    '类型',
    '合同状态',
    '创建时间',
    '创建人',
    '合同止期',
    '线路销售'
  ];
  private checkList: any[] = this.dropdownList;
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
    },
    {
      label: '已面试',
      name: '4'
    },
    {
      label: '已面试',
      name: '5'
    }
  ];
  private listQuery: IState = {
    key: '',
    city: '',
    page: 1,
    limit: 30,
    endDate: '',
    startDate: '',
    state: '',
    lineSaleId: ''
  };

  created() {
    this.fetchData()
  }

  mounted() {}

  activated() {
    // this.handleScroll()
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 测试dialog
  private confirm(done: any) {
    this.$message.info('点击了确定')
    done()
  }
  private cancel(done: any) {
    this.$message.info('点击了取消')
    done()
  }
  private beforeClose(done: any) {
    this.$message.info('点击了X')
    done()
  }
  // 所有请求方法
  private fetchData() {
    this.getList(this.listQuery)
  }

  // 处理tags方法
  private handleTags(value: any) {
    this.tags = value
  }

  // 处理query方法
  private handleQuery(value: any, key: any) {
    this.listQuery[key] = value
    this.fetchData()
  }

  // 处理选择日期方法
  private handleDate(value: any) {
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

  // 添加明细原因 row 当前行 column 当前列
  private tableClick(row: any, column: any, cell: any, event: any) {
    // switch (column.label) {
    //   case '原因说明':
    //     this.tabClickIndex = row.index
    //     this.tabClickLabel = column.label
    //     break
    //   case '判责金额(元)':
    //     this.tabClickIndex = row.index
    //     this.tabClickLabel = column.label
    //     break
    //   case '备注':
    //     this.tabClickIndex = row.index
    //     this.tabClickLabel = column.label
    //     break
    //   default: return
    // }
    console.log('添加明细原因', row, column, cell, event)
  }

  // 按钮操作
  private goDetail(id: string | (string | null)[] | null | undefined) {
    this.$router.push({ name: 'ClueDetail', query: { id: id } })
  }

  // 批量操作
  private olClicks(item: any) {
    console.log(item)
  }
}
</script>

<style lang="scss" scoped>
.ClueList {
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  .btn-item {
    background: #649cee;
    border-radius: 4px;
    border-radius: 4px;
    border: none;
    margin: 0 10px;
  }
  .btn-item-filtrate {
    background: #ffa000;
    border-radius: 4px;
    border-radius: 4px;
    border: none;
  }
  .table_box {
    height: calc(100vh - 225px) !important;
    background: #ffffff;
    // border: 1px solid #dfe6ec;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      height: calc(100vh - 360px) !important;
      padding: 30px;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
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
  .pagination-container {
    background: #fff;
  }
}
</style>

<style lang="scss" scoped>
.ClueList-m {
  padding-bottom: 0;
  box-sizing: border-box;
  .btn-item-m {
    background: #649cee;
    border-radius: 4px;
    border-radius: 4px;
    border: none;
    margin: 0 10px;
  }
  .btn-item-filtrate-m {
    background: #ffa000;
    border-radius: 4px;
    border-radius: 4px;
    border: none;
  }
  .table_box {
    height: calc(100vh - 183px) !important;
    background: #ffffff;
    // border: 1px solid #dfe6ec;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      height: calc(100vh - 300px) !important;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
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
  .pagination-container {
    background: #f8f9fa;
  }
}
</style>

<style lang="scss" scope>
.el-collapse-item__content {
  padding-bottom: 0;
}

.el-form-item__label {
  color: #999999;
}
</style>
