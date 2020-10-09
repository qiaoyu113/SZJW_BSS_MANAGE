<template>
  <div
    class="financialFlowContainer"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      label-width="80px"
      class="p15 SuggestForm"
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
    <div class="table_box">
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
        :height="tableHeight"
        :is-p30="false"
        :operation-list="[]"
        :table-data="tableData"
        :columns="columns"
        :page="page"
        @onPageSize="handlePageSize"
      >
        <template v-slot:financialFlowCode="scope">
          <router-link to="#">
            {{ scope.row.financialFlowCode }}
          </router-link>
        </template>
        <template v-slot:inFlowDate="scope">
          {{ scope.row.inFlowDate | parseTime('{y}-{m}-{d}') }}
        </template>
        <template v-slot:driverCode="scope">
          <router-link to="#">
            {{ scope.row.driverCode }}
          </router-link>
        </template>
        <template v-slot:busiDate="scope">
          {{ scope.row.busiDate | parseTime('{y}-{m}-{d}') }}
        </template>
      </self-table>
    </div>

    <SelfDialog
      :visible.sync="dialogTableVisible"
      title="手动添加流水"
      width="50%"
      :before-close="beforeClose"
      :cancel="beforeClose"
      :confirm="handleConfirmClick"
      append-to-body
      @closed="handleClosed"
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
import { getFlowList, exportFlowList, saveFlowData } from '@/api/driver-account'
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
  private tableData:any[] = [];
  private columns:any[] = [
    {
      key: 'financialFlowCode',
      label: '财务流水编号',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'inFlowDate',
      label: '进流水时间',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'inFlowMoney',
      label: '进流水金额',
      'min-width': '140px'
    },
    {
      key: 'driverCode',
      label: '司机编号',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'driverName',
      label: '司机姓名',
      'min-width': '140px'
    },
    {
      key: 'city',
      label: '所属城市',
      'min-width': '140px'
    },
    {
      key: 'busiTypeName',
      label: '业务线',
      'width': '120px'
    },
    {
      key: 'gmName',
      label: '所属加盟经理',
      'min-width': '140px'
    },
    {
      key: 'busiName',
      label: '业务名称',
      'min-width': '140px'
    },
    {
      key: 'busiCode',
      label: '业务流水编号',
      'min-width': '140px'
    },
    {
      key: 'busiDate',
      label: '业务发生时间',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'busiMoney',
      label: '业务发生金额',
      'min-width': '140px'
    },
    {
      key: 'busiWay',
      label: '业务进流水方式',
      'min-width': '160px'
    },
    {
      key: 'opName',
      label: '操作人',
      'min-width': '120px'
    }
  ];
  private listQuery:IState = {
    city: [],
    busiType: '',
    gmId: '',
    driverCode: '',
    driverName: '',
    time: []
  }

  private formItem:any[] = [

    {
      type: 8,
      tagAttrs: {
        placeholder: '请选择'
      },
      label: '所属城市:',
      w: '100px',
      key: 'city',
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
      label: '业务线:',
      key: 'busiType',
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
      key: 'gmId',
      options: []
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 50,
        clearable: true
      },
      label: '司机编号:',
      key: 'driverCode'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '司机姓名:',
      key: 'driverName',
      options: []
    },
    {
      type: 3,
      col: 10,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      label: '业务发生时间:',
      w: '120px',
      key: 'time'
    },
    {
      type: 'mulBtn',
      col: 14,
      slot: true,
      w: '0px'
    }
  ]

  private addForm:IState = {
    driverCode: '',
    driverName: '',
    orderCode: '',
    orderStatus: '',
    billingType: '',
    amount: '',
    reason: ''
  }
  private addFormItem:any[] = [
    {
      type: 1,
      label: '司机编号:',
      key: 'driverCode'
    },
    {
      type: 7,
      label: '司机姓名:',
      key: 'driverName'
    },
    {
      type: 2,
      label: '选择订单:',
      key: 'orderCode',
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
      key: 'orderStatus'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '计费类型:',
      key: 'billingType',
      options: [
        {
          label: '固定金额',
          value: 1
        },
        {
          label: '运费比例',
          value: 2
        },
        {
          label: '服务费比例',
          value: 3
        }
      ]
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 10,
        clearable: true
      },
      label: '申请调流水金额:',
      key: 'amount'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 50,
        type: 'textarea',
        'show-word-limit': true,
        rows: '5'
      },
      label: '申请调流水原因:',
      key: 'reason'
    }
  ]
  private rules:IState = {
    orderCode: [
      { required: true, message: '请选择选择订单', trigger: 'blur' }
    ],
    billingType: [
      { required: true, message: '请输入计费类型', trigger: 'blur' }
    ],
    amount: [
      { required: true, message: '请输入申请调流水金额', trigger: 'blur' }
    ]
  }
  // 分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  get tableHeight() {
    let otherHeight = 440
    return document.body.offsetHeight - otherHeight || document.documentElement.offsetHeight - otherHeight
  }
  // 查询
  handleFilterClick() {
    this.page.page = 1
    this.getLists()
  }
  // 重置
  handleResetClick() {
    this.listQuery = {
      city: [],
      busiType: '',
      gmId: '',
      driverCode: '',
      driverName: '',
      time: []
    }
  }
  // 导出
  async handleExportClick() {
    try {
      let params:IState = {}
      if (this.listQuery.city && this.listQuery.city.length > 1) {
        params.city = this.listQuery.city[1]
      }
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)
      this.listQuery.driverCode !== '' && (params.driverCode = this.listQuery.driverCode)
      this.listQuery.driverName !== '' && (params.driverName = this.listQuery.driverName)

      if (this.listQuery.time && this.listQuery.time.length > 0) {
        let startDate = new Date(this.listQuery.time[0])
        let endDate = new Date(this.listQuery.time[1])
        params.startDate = startDate.setHours(0, 0, 0)
        params.endDate = endDate.setHours(23, 59, 59)
      }
      let { data: res } = await exportFlowList(params)
      if (res.success) {
        this.$message.success('操作成功')
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`export excel fail:${err}`)
    }
  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 获取列表
  async getLists() {
    try {
      this.listLoading = true
      let params:IState = {
        page: this.page.page,
        limit: this.page.limit
      }
      if (this.listQuery.city && this.listQuery.city.length > 1) {
        params.city = this.listQuery.city[1]
      }
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)
      this.listQuery.driverCode !== '' && (params.driverCode = this.listQuery.driverCode)
      this.listQuery.driverName !== '' && (params.driverName = this.listQuery.driverName)

      if (this.listQuery.time && this.listQuery.time.length > 0) {
        let startDate = new Date(this.listQuery.time[0])
        let endDate = new Date(this.listQuery.time[1])
        params.startDate = startDate.setHours(0, 0, 0)
        params.endDate = endDate.setHours(23, 59, 59)
      }

      let { data: res } = await getFlowList(params)
      if (res.success) {
        this.tableData = res.data
        this.page.total = res.page.total
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get list fail:${err}`)
    } finally {
      this.listLoading = false
    }
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
    this.saveData()
  }
  // 关闭弹框
  handleClosed() {
    this.addForm = {
      driverCode: '',
      driverName: '',
      orderCode: '',
      orderStatus: '',
      billingType: '',
      amount: '',
      reason: ''
    }
  }
  // 提交弹框表单
  async saveData() {
    try {
      let params = {
        driverCode: this.addForm.driverCode,
        driverName: this.addForm.driverName,
        orderCode: this.addForm.orderCode,
        orderStatus: this.addForm.orderStatus,
        billingType: this.addForm.billingType,
        amount: this.addForm.amount,
        reason: this.addForm.reason
      }
      let { data: res } = await saveFlowData(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.getLists()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`save data fail:${err}`)
    }
  }
  // 打开弹框
  handleOpenClick() {
    this.dialogTableVisible = true
  }
  mounted() {
    this.getLists()
  }
}
</script>
<style lang="scss" scoped>
  .financialFlowContainer {
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
    .SuggestForm {
      width: 100%;
      background: #fff;
      margin-bottom: 10px;
      margin-left:0px!important;
      margin-right:0px!important;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    }
    .table_box {
      padding: 0px 30px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
  }
</style>
