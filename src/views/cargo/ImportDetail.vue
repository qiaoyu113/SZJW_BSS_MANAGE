<template>
  <div :class="isPC ? 'ImportDetail' : 'ImportDetail-m'">
    <SectionContainer
      title="导入详情"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 8 : 24">
          <DetailItem
            name="文档名称"
            value="刘德华123123"
          />
        </el-col>
        <el-col :span="isPC ? 8 : 24">
          <DetailItem
            name="导入日期"
            value="刘德华123123"
          />
        </el-col>
        <el-col :span="isPC ? 8 : 24">
          <DetailItem
            name="导入结果"
            value="刘德华123123"
          />
        </el-col>
        <el-col :span="isPC ? 8 : 24">
          <DetailItem
            name="线索总数"
            value="刘德华123123"
          />
        </el-col>
        <el-col :span="isPC ? 8 : 24">
          <DetailItem
            name="失败记录条数"
            value="刘德华123123"
          />
        </el-col>
        <el-col :span="isPC ? 8 : 24">
          <DetailItem
            name="检测错误数"
            value="刘德华123123"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <div class="table_box">
      <!--操作栏-->
      <TableHeader
        :tab="tab"
        :active-name="''"
      >
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
        >
          <el-table-column
            :key="Math.random()"
            type="index"
            width="55"
            label="序号"
            :index="indexMethod"
            align="center"
            fixed
          />
          <el-table-column
            v-if="checkList.includes('导入日期')"
            prop="date"
            label="导入日期"
          />
          <el-table-column
            v-if="checkList.includes('文档名称')"
            prop="date"
            label="文档名称"
          >
            <template slot-scope="{row}">
              <el-button type="text">
                {{ row.name }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.includes('导入结果')"
            prop="date"
            label="导入结果"
          />
          <el-table-column
            v-if="checkList.includes('线索总数')"
            prop="date"
            label="线索总数"
          />
          <el-table-column
            v-if="checkList.includes('失败记录数')"
            prop="date"
            label="失败记录数"
          />
          <el-table-column
            v-if="checkList.includes('检测错误数')"
            prop="date"
            label="检测错误数"
          />
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import TableHeader from '@/components/TableHeader/index.vue'
import Pagination from '@/components/Pagination/index.vue'

import '@/styles/common.scss'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'ImportDetail',
  components: {
    DetailItem,
    SectionContainer,
    TableHeader,
    Pagination
  }
})
export default class extends Vue {
  private tab: any[] = [];
  private listQuery: IState = {
    page: 1,
    limit: 30
  };
  // table
  private total = 0;
  private list: any[] = [];
  private page: Object | undefined = '';
  private listLoading = false;
  private dropdownList: any[] = [
    '导入日期',
    '文档名称',
    '导入结果',
    '线索总数',
    '失败记录数',
    '检测错误数'
  ];
  private checkList: any[] = this.dropdownList;
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  // table index
  private indexMethod(index: number) {
    let { page, limit } = this.listQuery
    return index + 1 + (page - 1) * limit
  }

  // 获取列表
  private getList() {

  }
}
</script>

<style lang="scss" scoped>
.ImportDetail {
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  .table_box {
    background: #ffffff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      padding: 30px;
      box-sizing: border-box;
      background: #ffffff;
    }
  }
}
.btn-item-filtrate,
.btn-item-filtrate-m {
  background-color: $assist-btn;
  border-color: $assist-btn;
}
</style>
