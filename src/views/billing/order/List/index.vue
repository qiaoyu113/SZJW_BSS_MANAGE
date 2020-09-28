<template>
  <div
    class="orderListsContainer"
    :class="{
      p15: isPC,
      m15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      :pc-col="8"
      label-width="80px"
      class="p15"
    >
      <div
        slot="mulBtn"
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
        订单状态:
        <el-badge
          v-for="item in btns"
          :key="item.text"
        >
          <el-button
            size="small"
            type="primary"
            :plain="item.name !== listQuery.status"
            @click="listQuery.status =item.name"
          >
            {{ item.text }}
          </el-button>
        </el-badge>
      </div>
      <div>
        <el-button
          type="primary"
          size="small"
          @click="handleExportExcel"
        >
          导出
        </el-button>
      </div>
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
      <template v-slot:term="scope">
        {{ scope.row.term }}
      </template>
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
            <!-- <el-dropdown-item
              command="detail"
            >
              详情
            </el-dropdown-item> -->
            <el-dropdown-item
              command="renew"
            >
              续费
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </self-table>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { HandlePages } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'

interface IState {
  [key: string]: any;
}

interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}
@Component({
  components: {
    SelfTable,
    SelfForm
  }
})
export default class extends Vue {
  // loading
  private listLoading:boolean = false;
  // 分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 100
  }
  // 表格数据
  private tableData:any[] = [{}]
  // 表格列
  private columns:any[] = [
    {
      key: 'orderCode',
      label: '订单编号',
      'min-width': '140px'
    },
    {
      key: 'odriverCode',
      label: '司机编号',
      'min-width': '140px'
    },
    {
      key: 'odriverName',
      label: '司机姓名',
      'min-width': '140px'
    },
    {
      key: 'city',
      label: '司机所属城市',
      'min-width': '140px'
    },
    {
      key: 'joinManager',
      label: '加盟经理',
      'min-width': '140px'
    },
    {
      key: 'commodityMoney',
      label: '商品金额(元)',
      'min-width': '140px'
    },
    {
      key: 'payMoney',
      label: '支付金额(元)',
      'min-width': '140px'
    },
    {
      key: 'frozenMoney',
      label: '冻结金额(元)',
      'min-width': '140px'
    },
    {
      key: 'term',
      label: '合作年限',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'maidPercent',
      label: '抽佣比例',
      'min-width': '140px'
    },
    {
      key: 'maidDetail',
      label: '抽佣比例明细',
      'min-width': '140px'
    },
    {
      key: 'busiLine',
      label: '业务线',
      'min-width': '140px'
    },
    {
      key: 'phone',
      label: '联系电话',
      'min-width': '140px'
    },
    {
      key: 'idCard',
      label: '身份证号',
      'min-width': '140px'
    },
    {
      key: 'orderStatusName',
      label: '订单状态',
      'min-width': '140px'
    },
    {
      key: 'createDate',
      label: '创建日趋',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'remark',
      label: '备注',
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
  // 按钮组
  private btns:any[] = [
    {
      name: '',
      text: '全部'
    },
    {
      name: '1',
      text: '待审核'
    },
    {
      name: '2',
      text: '审核未通过'
    },
    {
      name: '3',
      text: '已成交'
    },
    {
      name: '4',
      text: '订单终止'
    }
  ]
  // 查询表单
  private listQuery:IState = {
    status: ''
  }
  // 查询表单容器
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 50,
        clearable: true
      },
      label: '订单编号:',
      key: 'a'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 50,
        clearable: true
      },
      label: '司机编号:',
      key: 'b'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '所属城市:',
      key: 'c',
      options: []
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '加盟经理:',
      key: 'd',
      options: []
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 20,
        clearable: true
      },
      label: '司机姓名:',
      key: 'e'
    },
    {
      type: 3,
      col: 12,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      label: '创建日期:',
      key: 'f'
    },
    {
      type: 'mulBtn',
      col: 4,
      slot: true,
      w: '0px'
    }
  ]
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 查询表单
  handleFilterClick() {

  }
  // 重置表单
  handleResetClick() {
    this.listQuery = {

    }
  }
  // 更多操作
  handleCommandChange(key:string, row:any) {
    if (key === 'detail') { // 详情
      this.$router.push({
        path: '#'
      })
    } else if (key === 'renew') { // 续费
      this.$router.push({
        path: '#'
      })
    }
  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  getLists() {

  }
  // 导出excel
  handleExportExcel() {

  }
}
</script>
<style lang="scss" scoped>
  .m15 {
     margin: 15px;
  }
  .orderListsContainer {
    background: #ffffff;
    border-radius: 8px;
    .btnPc {
       width: 100%;
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

<style scoped>
  .orderListsContainer >>> .el-badge {
    margin-right:20px;
  }
</style>
