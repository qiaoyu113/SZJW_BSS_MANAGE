<template>
  <div
    class="DriverFreightList"
    :class="{
      p15: isPC,
      m15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      :pc-col="8"
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
          @click="handleExportClick"
        >
          导出
        </el-button>
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
        筛选结果（1000条）
      </div>
    </div>
    <!-- 表格 -->
    <self-table
      v-loading="listLoading"
      :index="false"
      :is-p30="false"
      :indexes="false"
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
              command="bill"
            >
              查看流水
            </el-dropdown-item>
            <el-dropdown-item
              command="monthlyBill"
            >
              查看月账单
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

interface IState {
  [key: string]: any;
}
@Component({
  name: 'DriverFreightList',
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
        clearable: true,
        maxlength: 50
      },
      label: '客户编号:',
      key: 'a'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 50
      },
      label: '客户名称:',
      key: 'b'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '客户城市:',
      key: 'c',
      options: [
        {
          label: '北京',
          value: 1
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '客户属性:',
      key: 'd',
      options: []
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
      label: '客户编号',
      'min-width': '140px'
    },
    {
      key: 'b',
      label: '客户名称',
      'min-width': '140px'
    },
    {
      key: 'c',
      label: '客户城市',
      'min-width': '140px'
    },
    {
      key: 'd',
      label: '客户属性',
      'min-width': '200px'
    },
    {
      key: 'e',
      label: '运费总额(元)',
      'min-width': '140px'
    },
    {
      key: 'f',
      label: '出车单数(个)',
      'min-width': '140px'
    },
    {
      key: 'g',
      label: '出车趟数(趟)',
      'min-width': '140px'
    },
    {
      key: 'aa',
      label: '运费流水(个)',
      'min-width': '140px'
    },
    {
      key: 'h',
      label: '客户联系人',
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
  private handleResetClick() {

  }
  // 查询表单
  private handleFilterClick() {

  }
  // 导出
  private handleExportClick() {

  }
  // 分页
  private handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 获取列表
  private getLists() {
  }
  // 更多操作
  private handleCommandChange(key:string, row:any) {
    if (key === 'bill') { // 查看账单

    } else if (key === 'monthlyBill') { // 查看月账单

    }
  }
}
</script>
<style lang="scss" scoped>
  .m15 {
     margin: 15px;
  }
  .DriverFreightList{
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
