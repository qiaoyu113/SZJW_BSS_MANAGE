<template>
  <div
    class="billingListContainer"
    :class="{
      p15: isPC,
      m15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      label-width="80px"
      class="p15"
    >
      <div
        slot="btn"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          type="primary"
          @click="handleFilterClick"
        >
          查询
        </el-button>
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          @click="handleResetClick"
        >
          重置
        </el-button>
      </div>
    </self-form>
    <div class="middle">
      <div class="count">
        总计：99个全部，299个启用，301个禁用
      </div>
      <router-link :to="{path: '/system/addUser'}">
        <el-button
          v-permission="['/v2/base/user/create']"
          class="createUser"
          icon="el-icon-plus"
          type="primary"
          size="small"
        >
          新建用户
        </el-button>
      </router-link>
    </div>
    <!-- 表格 -->
    <self-table
      v-loading="listLoading"
      :index="false"
      :is-p30="false"
      :indexes="true"
      :operation-list="[]"
      :table-data="tableData"
      :columns="columns"
      :page="page"
      @onPageSize="handlePageSize"
    >
      <template v-slot:createDate="scope">
        {{ scope.row.createDate }}
      </template>
      <template v-slot:op="scope">
        <el-dropdown
          :trigger="isPC ? 'hover' : 'click'"
          @command="(e) => handleCommandChange(e,scope.row)"
        >
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

          <el-dropdown-menu
            slot="dropdown"
          >
            <el-dropdown-item
              command="adjust"
            >
              调整
            </el-dropdown-item>
            <el-dropdown-item
              command="status"
            >
              <template v-if="scope.row.status ===1">
                禁用
              </template>
              <template v-else>
                启用
              </template>
            </el-dropdown-item>
            <el-dropdown-item
              command="log"
            >
              日志
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </self-table>
  </div>
</template>
<script lang="ts">
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { HandlePages } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'
import { Vue, Component } from 'vue-property-decorator'

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

interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SelfTable,
    SelfForm
  }
})
export default class extends Vue {
  // loading
  private listLoading:Boolean = false;
  // 查询表单
  private listQuery:IState = {

  }
  // 查询表单容器
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 10,
        clearable: true
      },
      label: 'SOP类型:',
      key: 'a'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 10,
        clearable: true
      },
      label: '计费编号:',
      key: 'b'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      label: '计费类型:',
      key: 'c',
      options: [
        {
          label: 'SOP计费',
          value: 1
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      label: '加盟类型:',
      key: 'd',
      options: [
        {
          label: '共享',
          value: 1
        },
        {
          label: '专车',
          value: 2
        }
      ]
    },
    {
      type: 4,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      col: 8,
      label: '计费状态:',
      key: 'e',
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '启用',
          value: '1'
        },
        {
          label: '禁用',
          value: '2'
        }
      ]
    },
    {
      type: 3,
      col: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      label: '创建日期:',
      key: 'f'
    }
  ]
  // 表格数据
  private tableData:any[] = [
    {
      a: 1
    }
  ]
  // 表格列
  private columns:any[] = [
    {
      key: 'a',
      label: '计费编号',
      'min-width': '140px'
    },
    {
      key: 'b',
      label: '计费类型',
      'min-width': '140px'
    },
    {
      key: 'c',
      label: 'SOP类型',
      'min-width': '140px'
    },
    {
      key: 'd',
      label: 'SOP描述',
      'min-width': '200px'
    },
    {
      key: 'e',
      label: '扣款类型',
      'min-width': '140px'
    },
    {
      key: 'f',
      label: '扣款标准',
      'min-width': '140px'
    },
    {
      key: 'g',
      label: '加盟类型',
      'min-width': '140px'
    },
    {
      key: 'createDate',
      label: '创建日期',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'h',
      label: '备注',
      'min-width': '140px'
    },
    {
      key: 'i',
      label: '计费状态',
      'min-width': '140px'
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      slot: true,
      'min-width': this.isPC ? '200px' : '50px'
    }
  ]
  // 分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 100
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 重置表单
  handleResetClick() {
    this.listQuery = {

    }
  }
  // 查询表单
  handleFilterClick() {

  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 获取列表
  getLists() {
  }
  // 更多操作
  handleCommandChange(key:string, row:any) {
    if (key === 'adjust') { // 调整

    } else if (key === 'log') { // 日志

    } else if (key === 'status') { // 重置密码

    }
  }
}
</script>
<style lang="scss" scoped>
  .m15 {
     margin: 15px;
  }
  .billingListContainer{
    background: #ffffff;
    border-radius: 8px;
    .btnPc {
       display: flex;
       flex-flow: row nowrap;
       justify-content: flex-end;
     }
    .mobile {
      width:100%;
      text-align: center;
      .btnMobile {
        margin-left: 0;
        margin-top: 10px;
        width:80%;
      }
    }
    .middle {
      margin: 10px 0px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .count {
        font-size:14px;
        color:#666;
      }
    }
  }
</style>
