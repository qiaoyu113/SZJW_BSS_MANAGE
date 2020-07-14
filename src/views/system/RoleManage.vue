<template>
  <div :class="isPC ? 'RoleManage' : 'RoleManage-m'">
    <div class="table_box">
      <!--操作栏-->
      <TableHeader
        :tab="tab"
        :active-name="'0'"
      >
        <el-button
          type="primary"
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          @click="goCreateUser"
        >
          <i class="el-icon-edit" />
          <span v-if="isPC">创建角色</span>
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
            v-if="checkList.includes('名称')"
            :key="checkList.length + 'nick'"
            prop="nick"
            label="名称"
            fixed
          />
          <el-table-column
            v-if="checkList.includes('描述')"
            prop="description"
            label="描述"
          />
          <el-table-column
            v-if="checkList.includes('人数')"
            prop="usedUserCount"
            label="人数"
          />
          <el-table-column
            v-if="checkList.includes('操作')"
            :key="checkList.length"
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
                    @click.native="deleteRole(row)"
                  >
                    删除
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="editRole(row)"
                  >
                    编辑
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import { roleList, createRole, updateRole, deleteRole } from '@/api/system'

import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'RoleManage',
  components: {
    SuggestContainer,
    TableHeader
  }
})
export default class extends Vue {
  private loading: boolean = false;
  private tags: any[] = [];
  private tab: any[] = [
    {
      label: '角色管理',
      name: '0'
    }
  ];
  private dropdownList: any[] = [
    '名称',
    '描述',
    '人数',
    '操作'
  ];
  private checkList: any[] = this.dropdownList;
  // table
  private total = 0;
  private list: any[] = [];
  private page: Object | undefined = '';
  private listLoading = false;
  // 计算属性
  get isPC() {
    return SettingsModule.isPC
  }
  // 事件处理
  // 处理tags方法
  // 所有请求方法
  private fetchData() {
    this.getList()
  }
  // button
  // 添加明细原因 row 当前行 column 当前列
  private tableClick(row: any, column: any, cell: any, event: any) {}
  // 请求列表
  private async getList() {
    this.listLoading = true
    const { data } = await roleList()
    this.listLoading = false
    if (data.success) {
      this.list = data.data
    } else {
      this.$message.error(data)
    }
  }
  private goCreateUser() {
    this.$router.push({ name: 'CreateRole' })
  }
  private editRole(row: any) {
    this.$router.push({ name: 'EditRole', query: { id: row.id } })
  }
  private deleteRole(item: any) {
    this.$confirm(`您确定要删除“${item.roleName}”吗？`, '删除组织', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      const { data } = await deleteRole(item.id)
      if (data.success) {
        this.$message.success(`删除成功`)
        this.getList()
      } else {
        this.$message.error(data)
      }
    })
  }
  mounted() {
    this.fetchData()
  }
}
</script>
<style lang="scss" scoped>
.RoleManage {
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  .table_box {
    height: calc(100vh - 114px) !important;
    background: #ffffff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      height: calc(100vh - 246px) !important;
      padding: 30px;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
    }
  }
}
.RoleManage-m{
  padding-bottom: 0;
  box-sizing: border-box;
  .table_box {
    height: calc(100vh - 84px) !important;
    background: #ffffff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      height: calc(100vh - 140px) !important;
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
