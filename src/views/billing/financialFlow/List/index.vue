<template>
  <div
    class="financialFlowContainer"
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
      :pc-col="8"
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
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          @click="handleExportClick"
        >
          导出
        </el-button>
      </div>
    </self-form>
    <div class="middle">
      <el-button
        icon="el-icon-plus"
        type="primary"
        size="small"
        @click="handleOpenClick"
      >
        手动添加流水
      </el-button>
    </div>
    <!-- 表格 -->
    <self-table
      v-loading="listLoading"
      :index="false"
      :is-p30="false"
      :operation-list="[]"
      :table-data="tableData"
      :columns="columns"
      :page="page"
      @onPageSize="handlePageSize"
    >
      <template v-slot:a="scope">
        <router-link to="#">
          {{ scope.row.a }}
        </router-link>
      </template>
      <template v-slot:b="scope">
        {{ scope.row.b }}
      </template>
      <template v-slot:d="scope">
        <router-link to="#">
          {{ scope.row.d }}
        </router-link>
      </template>
      <template v-slot:h="scope">
        {{ scope.row.h }}
      </template>
    </self-table>

    <SelfDialog
      :visible.sync="dialogTableVisible"
      title="解冻"
      width="50%"
      :before-close="beforeClose"
      :cancel="beforeClose"
      :confirm="handleConfirmClick"
      append-to-body
    >
      <self-form
        ref="addFlow"
        :list-query="addForm"
        :form-item="addFormItem"
        label-width="140px"
        class="p15"
        :pc-col="20"
        :rules="rules"
        @onPass="handlePassClick"
      />
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { HandlePages } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'
import SelfDialog from '@/components/SelfDialog/index.vue'

interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}

interface IState {
  [key: string]: any;
}

@Component({
  components: {
    SelfTable,
    SelfForm,
    SelfDialog
  }
})
export default class extends Vue {
  private listLoading:boolean = false;
  private dialogTableVisible:boolean = false;
  private tableData:any[] = [
    {}
  ];
  private columns:any[] = [
    {
      key: 'a',
      label: '财务流水编号',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'b',
      label: '进流水时间',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'c',
      label: '进流水金额',
      'min-width': '140px'
    },
    {
      key: 'd',
      label: '司机编号',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'e',
      label: '司机姓名',
      'min-width': '140px'
    },
    {
      key: 'f',
      label: '项目名称',
      'min-width': '140px'
    },
    {
      key: 'g',
      label: '项目业务流水单号',
      'min-width': '140px'
    },
    {
      key: 'h',
      label: '项目发生时间',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'i',
      label: '项目发生金额',
      'min-width': '140px'
    },
    {
      key: 'j',
      label: '进流水方式',
      'min-width': '140px'
    },
    {
      key: 'k',
      label: '操作人',
      'min-width': '140px'
    }
  ];
  private listQuery:IState = {
    a: '',
    b: '',
    c: '',
    d: '',
    e: '',
    f: '',
    g: []
  }

  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 50,
        clearable: true
      },
      label: '司机编号:',
      key: 'a'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '司机姓名:',
      key: 'b',
      options: []
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '所属管理区:',
      w: '100px',
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
      label: '所属加盟经理:',
      w: '100px',
      key: 'd',
      options: []
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      w: '100px',
      label: '所属业务线:',
      key: 'e',
      options: []
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      w: '100px',
      label: '梧桐账户状态:',
      key: 'f',
      options: []
    },
    {
      type: 3,
      col: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      label: '选择时间:',
      key: 'g'
    },
    {
      type: 'mulBtn',
      col: 16,
      slot: true,
      w: '0px'
    }
  ]

  private addForm:IState = {}
  private addFormItem:any[] = [
    {
      type: 7,
      label: '司机编号:',
      key: 'a'
    },
    {
      type: 7,
      label: '司机姓名:',
      key: 'b'
    },
    {
      type: 2,
      label: '选择订单:',
      key: 'c',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      options: []
    },
    {
      type: 7,
      label: '订单状态:',
      key: 'd'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 10,
        clearable: true
      },
      label: '计费类型:',
      key: 'e'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 10,
        clearable: true
      },
      label: '申请调流水金额:',
      key: 'f'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 300,
        type: 'textarea',
        'show-word-limit': true,
        rows: '5'
      },
      label: '申请调流水原因:',
      key: 'g'
    }
  ]
  private rules:IState = {
    c: [
      { required: true, message: '请选择选择订单', trigger: 'blur' }
    ],
    e: [
      { required: true, message: '请输入计费类型', trigger: 'blur' }
    ],
    f: [
      { required: true, message: '请输入申请调流水金额', trigger: 'blur' }
    ]
  }
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
  // 查询
  handleFilterClick() {

  }
  // 重置
  handleResetClick() {

  }
  // 导出
  handleExportClick() {

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
  // 弹框关闭
  beforeClose() {
    this.dialogTableVisible = false
  }
  // 弹框确认
  handleConfirmClick() {
    ((this.$refs.addFlow) as any).submitForm()
  }
  // 表单验证通过
  handlePassClick(valid:boolean) {
    this.dialogTableVisible = false
  }
  // 打开弹框
  handleOpenClick() {
    this.dialogTableVisible = true
  }
}
</script>
<style lang="scss" scoped>
  .m15 {
     margin: 15px;
  }
  .financialFlowContainer {
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
    }
  }
</style>
