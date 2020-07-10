<template>
  <div :class="isPC ? 'UserManage' : 'UserManage-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-date="handleDate"
      @handle-query="handleQuery"
    >
      <UserListForm
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
          type="primary"
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          @click="goCreateUser"
        >
          <i class="el-icon-edit" />
          <span v-if="isPC">新建用户</span>
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
            label="姓名"
            fixed
          />
          <el-table-column
            v-if="checkList.includes('手机')"
            prop="date"
            label="手机"
          >
            <template slot-scope="{row}">
              <el-button type="text">
                {{ row.name }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.includes('角色')"
            prop="date"
            label="角色"
          />
          <el-table-column
            v-if="checkList.includes('组织')"
            prop="date"
            label="组织"
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
                    禁{{ row }}用
                  </el-dropdown-item>
                  <el-dropdown-item>
                    重置密码
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { UserListForm } from './components'
import TableHeader from '@/components/TableHeader/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { CargoListData } from '@/api/types'

import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'UserManage',
  components: {
    SuggestContainer,
    UserListForm,
    TableHeader,
    Pagination
  }
})
export default class extends Vue {
  private tags: any[] = [];
  private tab: any[] = [];
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
    '手机',
    '角色',
    '组织'
  ];
  private checkList: any[] = this.dropdownList;
  // table
  private total = 0;
  private list: CargoListData[] = [];
  private page: Object | undefined = '';
  private listLoading = false;
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
  private goCreateUser() {
    this.$router.push({ name: 'CreateUser' })
  }
}
</script>
<style lang="scss" scoped>
.UserManage {
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
.UserManage >>> .TableHeader_title,
.UserManage-m >>> .TableHeader_title {
  display: none;
}
</style>
