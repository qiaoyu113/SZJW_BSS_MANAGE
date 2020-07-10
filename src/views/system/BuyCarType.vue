<template>
  <div :class="isPC ? 'BuyCarType' : 'BuyCarType-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-date="handleDate"
      @handle-query="handleQuery"
    >
      <BuyCarForm
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
        <el-button :class="isPC ? 'btn-item' : 'btn-item-m'">
          <i class="el-icon-download" />
          <span v-if="isPC">导出</span>
        </el-button>
        <el-button
          type="primary"
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          @click="showDialog('create')"
        >
          <i class="el-icon-s-operation" />
          <span v-if="isPC">新建商品</span>
        </el-button>
        <el-dropdown
          :hide-on-click="false"
          trigger="click"
        >
          <el-button
            :class="isPC ? 'btn-item-filtrate' : 'btn-item-filtrate-m'"
            type="primary"
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
          ref="multipleTable"
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
          align="left"
          row-key="id"
          @cell-click="tableClick"
        >
          <el-table-column
            :key="Math.random()"
            prop="date"
            label="商品编号"
            fixed
          />
          <el-table-column
            v-if="checkList.includes('购车车型')"
            prop="date"
            label="购车车型"
          >
            <template slot-scope="{row}">
              <el-button type="text">
                {{ row.name }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.includes('车辆信息')"
            prop="date"
            label="车辆信息"
          />
          <el-table-column
            v-if="checkList.includes('供应商')"
            prop="date"
            label="供应商"
          />
          <el-table-column
            v-if="checkList.includes('无税加个（元）')"
            prop="date"
            label="无税加个（元）"
          />
          <el-table-column
            v-if="checkList.includes('城市')"
            prop="date"
            label="城市"
          />
          <el-table-column
            v-if="checkList.includes('车型状态')"
            prop="date"
            label="车型状态"
          />
          <el-table-column
            v-if="checkList.includes('创建时间')"
            prop="date"
            label="创建时间"
          />
          <el-table-column
            v-if="checkList.includes('创建人')"
            prop="date"
            label="创建人"
          />
          <el-table-column
            :key="Math.random()"
            label="操作"
            fixed="right"
            :width="isPC ? 'auto' : '50'"
          >
            <template slot-scope="{row}">
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
                  <el-dropdown-item>
                    下{{ row }}架
                  </el-dropdown-item>
                  <el-dropdown-item>
                    编辑
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total > 0"
        :operation-list="[]"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
    <Dialog
      :visible.sync="dialogVisible"
      :title="dialogTit"
      :confirm="confirm"
    >
      <el-form
        ref="dialogForm"
        :model="dialogForm"
        label-width="80px"
      >
        <el-form-item label="供应商">
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item label="车型">
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item label="车辆信息">
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item label="无税价格">
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item label="适用城市">
          <el-input v-model="dialogForm.name" />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { BuyCarForm } from './components'
import TableHeader from '@/components/TableHeader/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import { CargoListData } from '@/api/types'

import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'BuyCarType',
  components: {
    SuggestContainer,
    BuyCarForm,
    TableHeader,
    Pagination,
    Dialog
  }
})
export default class extends Vue {
  private tags: any[] = [];
  private tab: any[] = [
    {
      label: '全部',
      name: '0'
    },
    {
      label: '已上架',
      name: '1'
    },
    {
      label: '已下架',
      name: '2'
    }
  ];
  private DateValue: any[] = [];
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
  private dropdownList: any[] = [
    '购车车型',
    '车辆信息',
    '供应商',
    '无税价格（元）',
    '城市',
    '车型状态',
    '创建时间',
    '创建人'
  ];
  private checkList: any[] = this.dropdownList;
  // table
  private total = 0;
  private list: CargoListData[] = [];
  private page: Object | undefined = '';
  private listLoading = false;
  // dialog
  private dialogVisible: boolean = false;
  private dialogTit: string = '';
  private dialogForm: IState = {
    name: ''
  };

  // 计算属性
  get isPC() {
    return SettingsModule.isPC
  }
  // 事件处理
  // 处理tags方法
  private handleTags(value: any) {
    this.tags = value
  }
  // 所有请求方法
  private fetchData() {
    this.getList(this.listQuery)
  }
  // 处理query方法
  private handleQuery(value: any, key: any) {
    this.listQuery[key] = value
    this.fetchData()
  }
  // 处理选择日期方法
  private handleDate(value: any) {
    // this.DateValue = value
  }
  // button
  // 添加明细原因 row 当前行 column 当前列
  private tableClick(row: any, column: any, cell: any, event: any) {}
  // 请求列表
  private async getList(value: any) {}
  // table index
  private indexMethod(index: number) {
    let { page, limit } = this.listQuery
    return index + 1 + (page - 1) * limit
  }

  // dialog
  showDialog(key: string) {
    if (key === 'create') {
      // 新建
      this.dialogVisible = true
    } else {
      // 编辑
      console.log('编辑')
    }
  }
  confirm(done: any) {

  }
}
</script>
<style lang="scss" scoped>
.BuyCarType {
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  .table_box {
    height: calc(100vh - 225px) !important;
    background: #ffffff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      height: calc(100vh - 360px) !important;
      padding: 30px;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
    }
  }
}
.btn-item,
.btn-item-m {
  margin: 0 10px;
}
.btn-item-filtrate,
.btn-item-filtrate-m {
  background-color: $assist-btn;
  border-color: $assist-btn;
}
</style>
<style scoped>

</style>
