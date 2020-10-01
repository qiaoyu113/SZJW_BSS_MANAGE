<template>
  <div
    class="DriverFreightMonthBill"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      :pc-col="8"
      label-width="90px"
      class="p15 SuggestForm"
    >
      <template slot="monthBillDate">
        <el-date-picker
          v-model="listQuery.monthBillDate"
          class="month-picker"
          type="monthrange"
          range-separator="-"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
        />
      </template>
      <template slot="checkStatus">
        <el-badge
          v-for="item in btns"
          :key="item.text"
        >
          <el-button
            size="small"
            type="primary"
            :plain="item.name !== listQuery.checkStatus"
            @click="listQuery.checkStatus =item.name"
          >
            {{ item.text }}
          </el-button>
        </el-badge>
      </template>
      <div
        slot="mulBtn"
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
    <div class="table_box">
      <div class="middle">
        <div class="count">
          筛选结果 1000条 10元
        </div>
      </div>
      <!-- 表格 -->
      <self-table
        ref="freighForm"
        v-loading="listLoading"
        :index="true"
        row-key="id"
        :is-p30="false"
        :indexes="false"
        :operation-list="operationList"
        :table-data="tableData"
        :columns="columns"
        :page="page"
        style="overflow: inherit;"
        @olclick="handleOlClick"
        @onPageSize="handlePageSize"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:closeStatus="scope">
          {{ scope.row.closeStatus ? '是':'否' }}
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
                command="flow"
              >
                查看流水
              </el-dropdown-item>
              <el-dropdown-item
                command="checkBill"
              >
                客户对账
              </el-dropdown-item>
              <el-dropdown-item
                command="download"
              >
                下载账单
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </self-table>
    </div>
    <!-- 标记收款弹窗 -->
    <SelfDialog
      :class="'distributionDialog'"
      :visible.sync="showDialog"
      :title="dialogTit"
      :confirm="confirm"
      :destroy-on-close="true"
      @closed="handleClosed"
    >
      <p v-if="multipleSelection.length > 0">
        已选择{{ multipleSelection.length }}个月账单
      </p>
      <self-form
        ref="dialogForm"
        :list-query="dialogForm"
        :form-item="dialogFormItem"
        size="small"
        label-width="90px"
        class="p15"
        :rules="dialogRole"
        @onPass="handlePassClick"
      >
        <template v-slot:amount="scope">
          {{ scope.row.amount }} 元
        </template>
        <template slot="fieldUrl">
          <el-upload
            ref="upload"
            :http-request="customUpload"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :auto-upload="true"
            :multiple="false"
            :limit="1"
            action="/line/gmv/importFile"
            :show-file-list="true"
          >
            <el-button
              size="small"
              type="primary"
            >
              点击上传
            </el-button>
            <div
              slot="tip"
              class="el-upload__tip"
            >
              支持扩展名：.rar .zip .doc .docx .pdf .jpg...
            </div>
          </el-upload>
        </template>
      </self-form>
    </SelfDialog>
    <PitchBox
      :drawer.sync="drawer"
      :drawer-list="multipleSelection"
      @deletDrawerList="deletDrawerList"
      @changeDrawer="changeDrawer"
    >
      <template slot-scope="slotProp">
        <span>{{ slotProp.item.customerName }}</span>
        <span>{{ slotProp.item.monthBillId }}</span>
        <span>{{ slotProp.item.customerCity }}</span>
      </template>
    </PitchBox>
  </div>
</template>
<script lang="ts">
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { HandlePages } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'
import { Vue, Component } from 'vue-property-decorator'
import { fileUpload } from '@/api/cargo'
import PitchBox from '@/components/PitchBox/index.vue'
import { GetMonthlyBillList, ExportMonthlyBill, CustomerMonthlyBillCheck } from '@/api/customer-freight'
interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}

interface IState {
  [key: string]: any;
}
@Component({
  name: 'DriverFreightMonthBill',
  components: {
    SelfTable,
    SelfForm,
    SelfDialog,
    PitchBox
  }
})
export default class extends Vue {
  // loading
  private listLoading:Boolean = false;
  private ids:string|number[] = []
  private btns:any[] = [
    {
      name: '',
      text: '全部'
    },
    {
      name: '0',
      text: '待对账'
    },
    {
      name: '1',
      text: '已对账'
    }
  ]
  // 查询表单
  private listQuery:IState = {
    monthBillId: '',
    customerName: '',
    customerCity: '',
    dutyManagerId: '',
    lineSaleId: '',
    closeStatus: '',
    projectId: '',
    monthBillDate: [],
    checkStatus: ''
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
      label: '月账单编号:',
      key: 'monthBillId'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 50
      },
      label: '客户姓名:',
      key: 'customerName'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '客户城市:',
      key: 'customerCity',
      options: []
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '上岗经理:',
      key: 'dutyManagerId',
      options: []
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '外线销售:',
      key: 'lineSaleId',
      options: []
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '是否封账:',
      key: 'closeStatus',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true
      },
      label: '项目名称:',
      key: 'projectId'
    },
    {
      col: 10,
      label: '月份:',
      type: 'monthBillDate',
      slot: true
    },
    {
      col: 16,
      label: '对账状态:',
      type: 'checkStatus',
      slot: true
    },
    {
      type: 'mulBtn',
      col: 8,
      slot: true,
      w: '0px'
    }
  ]
  // 表格数据
  private tableData:any[] = []
  // 表格列
  private columns:any[] = [
    {
      key: 'monthBillId',
      label: '月账单编号',
      'min-width': '140px'
    },
    {
      key: 'monthBillDate',
      label: '月份',
      'min-width': '140px'
    },
    {
      key: 'customerName',
      label: '客户名称',
      'min-width': '140px'
    },
    {
      key: 'projectName',
      label: '项目名称',
      'min-width': '200px'
    },
    {
      key: 'customerCity',
      label: '客户城市',
      'min-width': '200px'
    },
    {
      key: 'turnoverTotalCount',
      label: '账单个数(个)',
      'min-width': '140px'
    },
    {
      key: 'waybillTotalCount',
      label: '出车单数(个)',
      'min-width': '140px'
    },
    {
      key: 'amount',
      label: '运费总额(元)',
      'min-width': '140px'
    },
    {
      key: 'closeStatus',
      label: '是否封账',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'checkStatus',
      label: '对账状态',
      'min-width': '140px'
    },
    {
      key: 'checkVoucherPath',
      label: '对账凭证',
      'min-width': '140px'
    },
    {
      key: 'dutyManagerName',
      label: '上岗经理',
      'min-width': '140px'
    },
    {
      key: 'lineSaleName',
      label: '外线销售',
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
  // 全选
  private operationList: any[] = [
    { icon: 'el-icon-finished', name: '查看选中', color: '#F2A33A', key: '3' },
    { icon: 'el-icon-thumb', name: '批量标记收款', color: '#5E7BBB', key: '1' },
    { icon: 'el-icon-circle-close', name: '清空选择', color: '#F56C6C', key: '2' }
  ]
  private multipleSelection: any[] = []
  private drawer: boolean= false;

  // 分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  // 弹窗
  private showDialog: boolean = false;
  // 弹窗标题
  private dialogTit: string = '';
  // 弹窗form
  private dialogForm: IState = {
    monthBillId: '',
    monthBillDate: '',
    amount: '',
    fieldUrl: '',
    remark: ''
  }
  private fileList: []= [];
  private dialogRole: IState= {
    fieldUrl: [
      { required: true, message: '请上传凭证', trigger: 'change' }
    ]
  }
  private dialogFormItem:any[] = []
  // 弹窗表单容器
  private dialogItem: any[] = [
    {
      type: 7,
      col: 12,
      label: '月账单流水号:',
      w: '120px',
      key: 'monthBillId'
    },
    {
      type: 7,
      col: 12,
      label: '账单月份:',
      key: 'monthBillDate'
    },
    {
      type: 'amount',
      col: 24,
      label: '运费总额:',
      slot: true
    },
    {
      col: 24,
      label: '上传凭证:',
      type: 'fieldUrl',
      slot: true
    },
    {
      type: 1,
      label: '备注:',
      col: 24,
      tagAttrs: {
        placeholder: '请输入不超过100字',
        maxlength: 100,
        type: 'textarea',
        'show-word-limit': true,
        autosize: { minRows: 3, maxRows: 4 },
        clearable: true
      },
      key: 'remark'
    }
  ];
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 重置表单
  private handleResetClick() {
    this.listQuery = {
      monthBillId: '',
      customerName: '',
      customerCity: '',
      dutyManagerId: '',
      lineSaleId: '',
      closeStatus: '',
      projectId: '',
      monthBillDate: [],
      checkStatus: ''
    }
  }
  // 查询表单
  private handleFilterClick() {
    this.page.page = 1
    this.getLists()
  }
  // 导出
  private handleExportClick() {
    let params:IState = {}
    this.listQuery.monthBillId !== '' && (params.monthBillId = this.listQuery.monthBillId)
    this.listQuery.customerName !== '' && (params.customerName = this.listQuery.customerName)
    this.listQuery.customerCity !== '' && (params.customerCity = this.listQuery.customerCity)
    this.listQuery.dutyManagerId !== '' && (params.dutyManagerId = this.listQuery.dutyManagerId)
    this.listQuery.lineSaleId !== '' && (params.lineSaleId = this.listQuery.lineSaleId)
    this.listQuery.closeStatus !== '' && (params.closeStatus = this.listQuery.closeStatus)
    this.listQuery.projectId !== '' && (params.projectId = this.listQuery.projectId)
    this.listQuery.checkStatus !== '' && (params.checkStatus = this.listQuery.checkStatus)
    if (this.listQuery.monthBillDate && this.listQuery.monthBillDate.length > 0) {
      let monthBillDateStart = new Date(this.listQuery.monthBillDate[0])
      let monthBillDateEnd = new Date(this.listQuery.monthBillDate[1])
      params.monthBillDateStart = monthBillDateStart.setHours(0, 0, 0)
      params.monthBillDateEnd = monthBillDateEnd.setHours(23, 59, 59)
    }
    this.exportExcel(params)
  }
  // 导出或下载月账单
  async exportExcel(params:IState) {
    try {
      let { data: res } = await ExportMonthlyBill(params)
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
  private handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 获取列表
  private async getLists() {
    try {
      this.listLoading = true
      let params:IState = {
        page: this.page.page,
        limit: this.page.limit
      }
      this.listQuery.monthBillId !== '' && (params.monthBillId = this.listQuery.monthBillId)
      this.listQuery.customerName !== '' && (params.customerName = this.listQuery.customerName)
      this.listQuery.customerCity !== '' && (params.customerCity = this.listQuery.customerCity)
      this.listQuery.dutyManagerId !== '' && (params.dutyManagerId = this.listQuery.dutyManagerId)
      this.listQuery.lineSaleId !== '' && (params.lineSaleId = this.listQuery.lineSaleId)
      this.listQuery.closeStatus !== '' && (params.closeStatus = this.listQuery.closeStatus)
      this.listQuery.projectId !== '' && (params.projectId = this.listQuery.projectId)
      this.listQuery.checkStatus !== '' && (params.checkStatus = this.listQuery.checkStatus)
      if (this.listQuery.monthBillDate && this.listQuery.monthBillDate.length > 0) {
        let monthBillDateStart = new Date(this.listQuery.monthBillDate[0])
        let monthBillDateEnd = new Date(this.listQuery.monthBillDate[1])
        params.monthBillDateStart = monthBillDateStart.setHours(0, 0, 0)
        params.monthBillDateEnd = monthBillDateEnd.setHours(23, 59, 59)
      }
      let { data: res } = await GetMonthlyBillList(params)
      if (res.success) {
        this.tableData = res.data
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get list fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 更多操作
  private handleCommandChange(key:string, row:any) {
    if (key === 'flow') { // 查看流水
      this.$router.push({
        path: '/customerfreight/bill'
      })
    } else if (key === 'checkBill') { // 客户对账
      this.dialogTit = '月账单客户确认'
      this.dialogFormItem = []
      this.resetDialogForm()
      this.dialogForm.monthBillId = row.monthBillId
      this.dialogForm.monthBillDate = row.monthBillDate
      this.dialogForm.amount = row.amount
      this.ids = [row.id]
      setTimeout(() => {
        this.dialogFormItem.push(...this.dialogItem)
        this.showDialog = true
      }, 20)
    } else if (key === 'download') { // 下载账单
      let params:IState = {
        monthBillId: row.id
      }
      this.exportExcel(params)
    }
  }
  // 确认弹窗
  private handlePassClick(valid: any) {
    this.saveData()
  }
  private async confirm(done: any) {
    ((this.$refs.dialogForm) as any).submitForm()
  }
  // 弹框表单保存
  async saveData() {
    try {
      let params:IState = {
        fieldUrl: this.dialogForm.fieldUrl,
        id: this.ids
      }
      let { data: res } = await CustomerMonthlyBillCheck(params)
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
  // 重置弹框表单
  resetDialogForm() {
    this.dialogForm = {
      monthBillId: '',
      monthBillDate: '',
      amount: '',
      fieldUrl: '',
      remark: ''
    }
  }
  // 关闭弹窗清除数据
  private handleClosed() {
    this.showDialog = false
    this.resetDialogForm()
    this.ids = [];
    (this.$refs.freighForm as any).toggleRowSelection()
  }
  private customUpload(param: any) {
    // 自定义上传
    const formData = new FormData()
    formData.append('file', param.file)
    fileUpload(formData)
      .then(({ data } : any) => {
        if (data.success) {
          this.$message.success('上传成功')
        } else {
          this.fileList = []
          this.$message({
            showClose: true,
            duration: 0,
            message: data.errorMsg,
            type: 'error'
          })
        }
      })
      .catch(() => {
        this.fileList = []
      })
  }
  private handleRemove(file: any, fileList: any) {
    this.fileList = fileList
  }
  private handleChange(file: any, fileList: any) {
    this.fileList = fileList.slice(-3)
  }
  private handleExceed(files: any, fileList: any) {
    this.$message.warning(`当前限制选择 1 个文件`)
  }
  // table选择框
  private handleSelectionChange(val: any) {
    this.multipleSelection = val
  }
  // 批量操作
  private handleOlClick(item: any) {
    const { key } = item
    if (key === '3') {
      if (this.multipleSelection.length > 0) {
        this.drawer = true
      } else {
        this.$message.error('请先选择')
      }
    } else if (key === '2') {
      (this.$refs.freighForm as any).toggleRowSelection()
    } else if (key === '1') {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请先选择')
        return
      }
      this.ids = this.multipleSelection.map(item => item.id)
      this.dialogTit = '批量月账单客户确认'
      this.showDialog = true
      this.dialogFormItem = this.dialogItem.slice(3)
    }
  }
  // 关闭查看已选
  private changeDrawer(val: any) {
    this.drawer = val
  }

  // 删除选中项目
  private deletDrawerList(item: any, i: any) {
    let arr: any[] = [item];
    (this.$refs.freighForm as any).toggleRowSelection(arr)
    if (this.multipleSelection.length === 0) {
      this.drawer = false
    }
  }
  mounted() {
    this.getLists()
  }
}
</script>
<style lang="scss" scoped>
  .DriverFreightMonthBill{
    .month-picker{
      ::v-deep{
        .el-range-separator{
          padding: 0;
        }
      }
    }
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

<style scoped>
  .DriverFreightMonthBill >>> .el-badge {
    margin-right: 20px;
  }
</style>
