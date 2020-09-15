<template>
  <div class="userManager">
    <el-card>
      <div
        slot="header"
        class="title"
      >
        <h4>
          角色管理
        </h4>
        <el-button
          class="createUser"
          icon="el-icon-plus"
          type="primary"
          size="small"
        >
          新建用户
        </el-button>
      </div>
      <self-table
        v-loading="listLoading"
        :operation-list="[]"
        :index="false"
        :table-data="tableData"
        :columns="columns"
        :page="page"
      >
        <template v-slot:status="scope">
          <span v-if="scope.row.status ===1">启用</span>
          <span v-else>禁用</span>
        </template>
        <template v-slot:op="scope">
          <el-button
            v-if="scope.row.status ===1"
            type="text"
          >
            禁用
          </el-button>
          <el-button
            v-else
            type="text"
          >
            启用
          </el-button>
          <el-button type="text">
            重置密码
          </el-button>
          <el-button type="text">
            编辑
          </el-button>
        </template>
      </self-table>
    </el-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import { SettingsModule } from '@/store/modules/settings'
import { getUserManagerList } from '@/api/system'
interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}

interface ColumnsObj {
  key: string;
  label: string;
  width?: string;
  'min-width'?:string;
  slot?:boolean;
  fixed?:string;
}

interface tableObj {
  nickName: string;
  roleName: string;
  officeName: string;
  mobile: string;
  status: number;
}

@Component({
  components: {
    SelfTable
  }
})

export default class extends Vue {
  private listLoading:boolean = false
  private tableData:tableObj[] = []
  private columns:ColumnsObj[] = [
    {
      key: 'nickName',
      label: '姓名',
      'min-width': '140px'
    },
    {
      key: 'roleName',
      label: '角色',
      'min-width': '140px'
    },
    {
      key: 'officeName',
      label: '组织架构',
      'min-width': '200px'
    },
    {
      key: 'mobile',
      label: '电话',
      'min-width': '140px'
    },
    {
      key: 'status',
      label: '状态',
      'min-width': '140px',
      slot: true
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      slot: true,
      'min-width': this.isPC ? '200px' : '50px'
    }
  ]
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  mounted() {
    this.getLists()
  }
  // 获取用户列表
  async getLists() {
    try {
      this.listLoading = true
      let params = {
        limit: this.page.limit,
        page: this.page.page
      }
      let { data: res } = await getUserManagerList(params)
      if (res.success) {
        this.tableData = res.data
        this.page = res.page
      }
    } catch (err) {
      console.log(`get lists fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .userManager {
    padding: 15px;
    .title {
      h4 {
        margin: 0px;
      }
      .createUser {
        margin-top:20px;
      }
    }
  }
</style>

<style scoped>
  .userManager >>> .el-card {
    border:none;
  }
  .userManager >>> .el-card__header {
    border-bottom: none;
  }
</style>
