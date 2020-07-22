<template>
  <div :class="isPC ? 'UserManage' : 'UserManage-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-query="handleQuery"
    >
      <UserListForm
        :list-query="listQuery"
        @handle-tags="handleTags"
        @handle-query="fetchData"
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
          size="small"
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          @click="goCreateUser"
        >
          <i class="el-icon-plus" />
          <span v-if="isPC">新建用户</span>
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
            v-if="checkList.includes('姓名')"
            :key="checkList.length + 'nickName'"
            prop="nickName"
            label="姓名"
            fixed
          />
          <el-table-column
            v-if="checkList.includes('手机')"
            :key="checkList.length + 'mobile'"
            prop="mobile"
            label="手机"
          />
          <el-table-column
            v-if="checkList.includes('角色')"
            :key="checkList.length + 'roleName'"
            prop="roleName"
            label="角色"
          />
          <el-table-column
            v-if="checkList.includes('组织')"
            :key="checkList.length + 'officeName'"
            prop="officeName"
            label="组织"
          />
          <el-table-column
            v-if="checkList.includes('操作')"
            :key="checkList.length + 'right'"
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
                  <el-dropdown-item
                    @click.native="enableOrDisable(row)"
                  >
                    {{ row.status === 1 ? '禁用' : '启用' }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="resetPassword(row)"
                  >
                    重置密码
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="goEdit(row)"
                  >
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
import { Component, Vue, Watch } from 'vue-property-decorator'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { UserListForm } from './components'
import TableHeader from '@/components/TableHeader/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { getUserList, enableOrDisable, resetPassword } from '@/api/system'
import { HandlePages } from '@/utils/index'

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
  private listQuery: IState = {
    mobile: '',
    nickName: '',
    officeId: '',
    roleId: '',
    status: '',
    page: 1,
    limit: 20
  };
  private dropdownList: any[] = [
    '姓名',
    '手机',
    '角色',
    '组织',
    '操作'
  ];
  private checkList: any[] = this.dropdownList;
  // table
  private total = 0;
  private list: any[] = [];
  private page: Object | undefined = '';
  private listLoading = false;
  // Watch
  @Watch('checkList', { deep: true })
  private onval(value: any) {
    this.$nextTick(() => {
      ((this.$refs['multipleTable']) as any).doLayout()
    })
  }
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
  // button
  // 添加明细原因 row 当前行 column 当前列
  private tableClick(row: any, column: any, cell: any, event: any) {}
  // 请求列表
  private async getList(value: any) {
    this.listQuery.page = value.page
    this.listQuery.limit = value.limit
    this.listLoading = true
    const { data } = await getUserList(this.listQuery)
    if (data.success) {
      this.list = data.data
      data.page = await HandlePages(data.page)
      this.total = data.page.total
    } else {
      this.$message.error(data)
    }
    setTimeout(() => {
      const el = document.querySelector(
        '.el-table .el-table__body-wrapper'
      ) as HTMLElement
      el.scroll(0, 0)
      this.listLoading = false
    }, 0.5 * 1000)
  }
  // 启用or禁用
  private async enableOrDisable(row: any) {
    let { id, status, nickName } = row
    // status = 1 传2 status = 2 传1
    let statusText = status === 1 ? '禁用' : '启用'
    this.$confirm(`您确定要${statusText}“${nickName}”吗？`, `${statusText}用户`, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      const { data } = await enableOrDisable({ id, status: status ^ 1 ^ 2 })
      if (data.success) {
        this.$message.success(`${statusText}成功`)
        this.fetchData()
      } else {
        this.$message.error(data)
      }
    })
  }
  private async resetPassword(row: any) {
    let { id } = row
    this.$confirm(`您确定要将密码重置为手机号吗？`, `重置密码`, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      const { data } = await resetPassword({ id })
      if (data.success) {
        this.$message.success(`重置成功`)
        this.fetchData()
      } else {
        this.$message.error(data)
      }
    })
  }
  private goEdit(row:any) {
    const { id } = row
    this.$router.push({ name: 'EditUser', query: { id } })
  }
  private goCreateUser() {
    this.$router.push({ name: 'CreateUser' })
  }
  mounted() {
    this.fetchData()
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
      padding: 0 30px;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
    }
  }
}
.UserManage-m{
  padding-bottom: 0;
  box-sizing: border-box;
  .table_box {
    height: calc(100vh - 185px) !important;
    background: #ffffff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      height: calc(100vh - 300px) !important;
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
  /* display: none; */
  opacity: 0;
}
</style>
