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
            @click="handleStatusChange(item.name)"
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
          :disabled="true"
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
      <!-- 表格 -->
      <self-table
        ref="freighForm"
        v-loading="listLoading"
        :index="true"
        row-key="id"
        :height="tableHeight"
        :is-p30="false"
        :indexes="false"
        :func="disabledFunc"
        :operation-list="operationList"
        :table-data="tableData"
        :columns="columns"
        :page="page"
        style="overflow: initial;"
        @olclick="handleOlClick"
        @onPageSize="handlePageSize"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:monthBillDate="scope">
          {{ scope.row.monthBillDate | parseTime('{y}-{m}') }}
        </template>
        <template v-slot:monthBillId="scope">
          {{ scope.row.monthBillId }}
        </template>

        <template v-slot:checkVoucherPath="scope">
          <a
            v-if="scope.row.checkStatus"
            :href="scope.row.checkVoucherPath"
            style="color:#649CEE;cursor: pointer;"
          >下载凭证</a>
        </template>
        <template v-slot:checkStatus="scope">
          {{ scope.row.checkStatus ? '已对账':'待对账' }}
        </template>
        <template v-slot:closeStatus="scope">
          {{ scope.row.closeStatus ? '是':'否' }}
          / {{ scope.row.closeDate | parseTime('{m}/{d}') }}
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
                v-if="scope.row.closeStatus ===1"
                command="checkBill"
              >
                客户对账
              </el-dropdown-item>
              <!-- <el-dropdown-item
                command="download"
              >
                下载账单
              </el-dropdown-item> -->
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
      :sumbit-again="submitLoading"
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
        <template slot="fileUrl">
          <el-upload
            :http-request="uploadFile"
            :show-file-list="false"
            :limit="1"
            :before-upload="beforeFileUpload"
            action="/121"
            :file-list="filelist"
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
              支持扩展名:不超过10M,.rar .zip .doc .docx .pdf
            </div>
          </el-upload>
        </template>
      </self-form>
    </SelfDialog>
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
import { GetMonthlyBillList, ExportMonthlyBill, CustomerMonthlyBillCheck, GetProjectSearch } from '@/api/customer-freight'
import { Upload, GetSpecifiedRoleList, GetOpenCityData } from '@/api/common'
import { delayTime } from '@/settings'
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
    SelfDialog
  }
})
export default class extends Vue {
  private filelist:IState[] = []
  // loading
  private listLoading:Boolean = false;
  private postManagerOptions:IState[] = []; // 上岗经理列表
  private outsideSalesOptions:IState[] = [];// 外线销售列表
  private submitLoading:boolean = false;
  private workCityOptions:IState[] = [];// 客户城市列表
  private projectListOptions:IState[] = [];// 项目列表
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
    customerId: '',
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
      label: '客户名称:',
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
      options: this.workCityOptions
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
      options: this.postManagerOptions
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
      options: this.outsideSalesOptions
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
          label: '全部',
          value: ''
        },
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
      key: 'projectId',
      options: this.projectListOptions
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
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'monthBillDate',
      label: '月份',
      slot: true,
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
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'checkVoucherPath',
      label: '对账凭证',
      slot: true,
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
    { icon: 'el-icon-thumb', name: '批量标记收款', color: '#5E7BBB', key: '1' },
    { icon: 'el-icon-circle-close', name: '清空选择', color: '#F56C6C', key: '2' }
  ]
  private multipleSelection: any[] = []

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
    fileUrl: '',
    remark: ''
  }
  private fileList: []= [];
  private dialogRole: IState= {
    fileUrl: [
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
      type: 'fileUrl',
      key: 'fileUrl',
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
  get tableHeight() {
    let otherHeight = 490
    return document.body.offsetHeight - otherHeight || document.documentElement.offsetHeight - otherHeight
  }
  private disabledFunc(row:any) {
    if (row && row.closeStatus) {
      return false
    }
    return true
  }
  // 获取加盟经理、上岗经理、外线销售
  async getManagerList(roleType:number) {
    try {
      let params:IState = {
        roleType
      }
      let { data: res } = await GetSpecifiedRoleList(params)
      if (res.success) {
        return res.data.map((item:IState) => ({
          label: item.name,
          value: item.id
        }))
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get mamager list fail:${err}`)
    }
  }

  // 重置表单
  private handleResetClick() {
    this.listQuery = {
      monthBillId: '',
      customerName: '',
      customerId: '',
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
    this.listQuery.customerId !== '' && (params.customerId = this.listQuery.customerId)
    this.listQuery.customerCity !== '' && (params.customerCity = this.listQuery.customerCity)
    this.listQuery.dutyManagerId !== '' && (params.dutyManagerId = this.listQuery.dutyManagerId)
    this.listQuery.lineSaleId !== '' && (params.lineSaleId = this.listQuery.lineSaleId)
    this.listQuery.closeStatus !== '' && (params.closeStatus = this.listQuery.closeStatus)
    this.listQuery.projectId !== '' && (params.projectId = this.listQuery.projectId)
    this.listQuery.checkStatus !== '' && (params.checkStatus = this.listQuery.checkStatus)
    if (this.listQuery.monthBillDate && this.listQuery.monthBillDate.length > 0) {
      let monthBillDateStart = new Date(this.listQuery.monthBillDate[0])
      let monthBillDateEnd = new Date(this.listQuery.monthBillDate[1])
      const y = monthBillDateEnd.getFullYear()
      const m = monthBillDateEnd.getMonth()
      const end = +new Date(y, m + 1) - 1
      params.monthBillDateStart = monthBillDateStart.setHours(0, 0, 0)
      params.monthBillDateEnd = new Date(end).setHours(23, 59, 59)
    } else {
      return this.$message.error('请选择月份')
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
      this.listQuery.customerId !== '' && (params.customerId = this.listQuery.customerId)
      this.listQuery.customerCity !== '' && (params.customerCity = this.listQuery.customerCity)
      this.listQuery.dutyManagerId !== '' && (params.dutyManagerId = this.listQuery.dutyManagerId)
      this.listQuery.lineSaleId !== '' && (params.lineSaleId = this.listQuery.lineSaleId)
      this.listQuery.closeStatus !== '' && (params.closeStatus = this.listQuery.closeStatus)
      this.listQuery.projectId !== '' && (params.projectId = this.listQuery.projectId)
      this.listQuery.checkStatus !== '' && (params.checkStatus = this.listQuery.checkStatus)
      if (this.listQuery.monthBillDate && this.listQuery.monthBillDate.length > 0) {
        let monthBillDateStart = new Date(this.listQuery.monthBillDate[0])
        let monthBillDateEnd = new Date(this.listQuery.monthBillDate[1])

        const y = monthBillDateEnd.getFullYear()
        const m = monthBillDateEnd.getMonth()
        const end = +new Date(y, m + 1) - 1
        params.monthBillDateStart = monthBillDateStart.setHours(0, 0, 0)
        params.monthBillDateEnd = new Date(end).setHours(23, 59, 59)
      }
      let { data: res } = await GetMonthlyBillList(params)
      if (res.success) {
        this.tableData = res.data || []
        res.page = await HandlePages(res.page)
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
      this.submitLoading = true
      let params:IState = {
        fileUrl: this.dialogForm.fileUrl,
        ids: this.ids
      }
      let { data: res } = await CustomerMonthlyBillCheck(params)
      if (res.success) {
        this.showDialog = false
        this.$message.success('操作成功')
        setTimeout(() => {
          this.getLists()
        }, delayTime)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`save data fail:${err}`)
    } finally {
      setTimeout(() => {
        this.submitLoading = false
      }, 1000)
    }
  }
  // 重置弹框表单
  resetDialogForm() {
    this.dialogForm = {
      monthBillId: '',
      monthBillDate: '',
      amount: '',
      fileUrl: '',
      remark: ''
    }
  }
  // 关闭弹窗清除数据
  private handleClosed() {
    this.resetDialogForm()
    this.ids = [];
    (this.$refs.freighForm as any).toggleRowSelection()
  }
  // 上传文件
  async uploadFile(file:any) {
    try {
      let params = {
        expire: -1,
        folder: 'img',
        isEncode: true
      }
      let formData = new FormData()
      formData.append('file', file.file)
      let { data: res } = await Upload(params, formData)
      if (res.success) {
        this.dialogForm.fileUrl = res.data.url
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`upload fail:${err}`)
    }
  }
  // 上传文件前的校验
  beforeFileUpload(file:any) {
    this.filelist = []
    const isType = file.type.indexOf('audio') > -1 || file.type.indexOf('video') > -1
    const isSize = file.size / 1024 / 1024
    if (isType) {
      this.$message.error('上传文件只能是 .rar .zip .doc .docx jpg等 格式!')
      return false
    }
    if (isSize > 10) {
      this.$message.error('上传文件大小不能超过 10MB!')
      return false
    } else if (isSize <= 0) {
      this.$message.error('上传文件大小应该大于 0MB!')
      return false
    }
    return true
  }
  // table选择框
  private handleSelectionChange(val: any) {
    this.multipleSelection = val
  }
  // 批量操作
  private handleOlClick(item: any) {
    const { key } = item
    if (key === '2') {
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
  // 获取城市列表
  async getCityList() {
    try {
      let { data: res } = await GetOpenCityData()
      if (res.success) {
        let cityOptions:IState[] = res.data.map((item:any) => ({
          label: item.name,
          value: item.code
        }))
        this.workCityOptions.push(...cityOptions)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get open city fail:${err}`)
    }
  }
  // 获取项目列表
  async getProjectSearch() {
    try {
      let params:IState = {}
      let { data: res } = await GetProjectSearch(params)
      if (res.success) {
        let options = res.data.map((item:any) => ({
          label: item.projectName,
          value: item.projectId
        }))
        this.projectListOptions.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get project list fail:${err}`)
    }
  }
  async init() {
    // 加盟经理(1)  外销销售(2) 上岗经理(3)
    let data1 = await this.getManagerList(3)
    this.postManagerOptions.push(...data1)
    let data2 = await this.getManagerList(2)
    this.outsideSalesOptions.push(...data2)
    this.getCityList()
    this.getProjectSearch()
  }
  // 状态变化
  handleStatusChange(name:string) {
    this.listQuery.checkStatus = name
    this.page.page = 1
    this.getLists()
  }
  mounted() {
    this.getLists()
    this.init()
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
      padding: 30px 30px 0px;
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
