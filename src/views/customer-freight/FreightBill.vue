<template>
  <div
    class="DriverFreightBill"
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
    <div class="table_box">
      <div class="middle">
        <div class="count">
          筛选结果1000条 10元
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
        <template v-slot:departureDate="scope">
          {{ scope.row.departureDate | parseTime('{y}-{m}-{d}') }}
        </template>
        <template v-slot:createDate="scope">
          {{ scope.row.createDate | parseTime('{y}-{m}-{d}') }}
        </template>
        <template v-slot:paymentReceivedFlag="scope">
          {{ scope.row.paymentReceivedFlag ? '是':'否' }}
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
                command="1"
              >
                标记付款
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
        已选择{{ multipleSelection.length }}条
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
        <span>{{ slotProp.item.driverName }}</span>
        <span>{{ slotProp.item.recordNo }}</span>
        <span>{{ slotProp.item.amount }}</span>
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

import { month, lastmonth, threemonth } from './components/date'
import { GetFreightChargeList, ExportFreightChargeList, BjfreightChargeReceive } from '@/api/customer-freight'
interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}

interface IState {
  [key: string]: any;
}
@Component({
  name: 'DriverFreightBillList',
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
  private ids:number|string[] = [];
  // 查询表单
  private listQuery:IState = {
    customerName: '',
    customerId: '',
    customerProperty: '',
    recordNo: '',
    subject: '',
    driverName: '',
    projectName: '',
    businessNo: '',
    paymentReceivedFlag: '',
    departureDate: [],
    createDate: []
  }
  // 查询表单容器
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入名称',
        clearable: true,
        maxlength: 50
      },
      label: '客户名称:',
      key: 'customerName'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入编号',
        clearable: true,
        maxlength: 50
      },
      label: '客户编号:',
      key: 'customerId'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '客户属性:',
      key: 'customerProperty',
      options: [
        {
          label: '外线客户',
          value: 1
        },
        {
          label: '自承运客户 ',
          value: 2
        },
        {
          label: '集团客户',
          value: 3
        }
      ]
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入编号',
        clearable: true,
        maxlength: 50
      },
      label: '流水编号:',
      key: 'recordNo'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '变动类型:',
      key: 'subject',
      options: []
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
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 50
      },
      label: '项目名称:',
      key: 'projectName'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 50
      },
      label: '出车单编号:',
      key: 'businessNo'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '是否已付款:',
      key: 'paymentReceivedFlag',
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
      type: 3,
      col: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-time': ['00:00:00', '23:59:59'],
        pickerOptions: {
          shortcuts: [month, lastmonth, threemonth]
        }
      },
      label: '出车日期:',
      key: 'departureDate'
    },
    {
      type: 3,
      col: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-time': ['00:00:00', '23:59:59'],
        pickerOptions: {
          shortcuts: [month, lastmonth, threemonth]
        }
      },
      label: '创建时间:',
      key: 'createDate'
    }
  ]
  // 表格数据
  private tableData:any[] = []
  // 表格列
  private columns:any[] = [
    {
      key: 'recordNo',
      label: '流水编号',
      'min-width': '140px'
    },
    {
      key: 'departureDate',
      slot: true,
      label: '出车日期',
      'min-width': '140px'
    },
    {
      key: 'driverName',
      label: '司机姓名',
      'min-width': '140px'
    },
    {
      key: 'businessNo',
      label: '出车单号',
      'min-width': '200px'
    },
    {
      key: 'subject',
      label: '变动类型',
      'min-width': '140px'
    },
    {
      key: 'amount',
      label: '流水金额(元)',
      'min-width': '140px'
    },
    {
      key: 'createDate',
      slot: true,
      label: '创建时间',
      'min-width': '140px'
    },
    {
      key: 'createName',
      label: '创建人',
      'min-width': '140px'
    },
    {
      key: 'paymentReceivedFlag',
      label: '是否已付款',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'paymentVoucherPath',
      label: '付款凭证',
      'min-width': '140px'
    },
    {
      key: 'lineSaleName',
      label: '外线销售',
      'min-width': '140px'
    },
    {
      key: 'dutyManagerName',
      label: '上岗经理',
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
    { icon: 'el-icon-thumb', name: '批量标记付款', color: '#5E7BBB', key: '1' },
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
    recordNo: '',
    businessNo: '',
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
      label: '流水编号:',
      key: 'recordNo'
    },
    {
      type: 7,
      col: 12,
      label: '出车单编号:',
      key: 'businessNo'
    },
    {
      type: 'amount',
      col: 24,
      slot: true,
      label: '流水金额:'
    },
    {
      col: 24,
      label: '上传凭证:',
      type: 'fileUrl',
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
      customerName: '',
      customerId: '',
      customerProperty: '',
      recordNo: '',
      subject: '',
      driverName: '',
      projectName: '',
      businessNo: '',
      paymentReceivedFlag: '',
      departureDate: [],
      createDate: []
    }
  }
  // 查询表单
  private handleFilterClick() {
    this.page.page = 1
    this.getLists()
  }
  // 导出
  private async handleExportClick() {
    try {
      let params:IState = {}
      this.listQuery.customerName && (params.customerName = this.listQuery.customerName)
      this.listQuery.customerId && (params.customerId = this.listQuery.customerId)
      this.listQuery.customerProperty && (params.customerProperty = this.listQuery.customerProperty)
      this.listQuery.recordNo && (params.recordNo = this.listQuery.recordNo)
      this.listQuery.subject && (params.subject = this.listQuery.subject)
      this.listQuery.driverName && (params.driverName = this.listQuery.driverName)
      this.listQuery.projectName && (params.projectName = this.listQuery.projectName)
      this.listQuery.businessNo && (params.businessNo = this.listQuery.businessNo)
      this.listQuery.paymentReceivedFlag && (params.paymentReceivedFlag = this.listQuery.paymentReceivedFlag)
      if (this.listQuery.departureDate && this.listQuery.departureDate.length > 0) {
        let departureDateStart = new Date(this.listQuery.departureDate[0])
        let departureDateEnd = new Date(this.listQuery.departureDate[1])
        params.departureDateStart = departureDateStart.setHours(0, 0, 0)
        params.departureDateEnd = departureDateEnd.setHours(23, 59, 59)
      }

      if (this.listQuery.createDate && this.listQuery.createDate.length > 0) {
        let createDateStart = new Date(this.listQuery.createDate[0])
        let createDateEnd = new Date(this.listQuery.createDate[1])
        params.createDateStart = createDateStart.setHours(0, 0, 0)
        params.createDateEnd = createDateEnd.setHours(23, 59, 59)
      }
      let { data: res } = await ExportFreightChargeList(params)
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
      this.listQuery.customerName && (params.customerName = this.listQuery.customerName)
      this.listQuery.customerId && (params.customerId = this.listQuery.customerId)
      this.listQuery.customerProperty && (params.customerProperty = this.listQuery.customerProperty)
      this.listQuery.recordNo && (params.recordNo = this.listQuery.recordNo)
      this.listQuery.subject && (params.subject = this.listQuery.subject)
      this.listQuery.driverName && (params.driverName = this.listQuery.driverName)
      this.listQuery.projectName && (params.projectName = this.listQuery.projectName)
      this.listQuery.businessNo && (params.businessNo = this.listQuery.businessNo)
      this.listQuery.paymentReceivedFlag && (params.paymentReceivedFlag = this.listQuery.paymentReceivedFlag)
      if (this.listQuery.departureDate && this.listQuery.departureDate.length > 0) {
        let departureDateStart = new Date(this.listQuery.departureDate[0])
        let departureDateEnd = new Date(this.listQuery.departureDate[1])
        params.departureDateStart = departureDateStart.setHours(0, 0, 0)
        params.departureDateEnd = departureDateEnd.setHours(23, 59, 59)
      }

      if (this.listQuery.createDate && this.listQuery.createDate.length > 0) {
        let createDateStart = new Date(this.listQuery.createDate[0])
        let createDateEnd = new Date(this.listQuery.createDate[1])
        params.createDateStart = createDateStart.setHours(0, 0, 0)
        params.createDateEnd = createDateEnd.setHours(23, 59, 59)
      }
      let { data: res } = await GetFreightChargeList(params)
      if (res.success) {
        this.tableData = res.data
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get lists fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 更多操作
  private handleCommandChange(key:string, row:any) {
    if (key === '1') { // 标记付款
      this.dialogTit = '标记付款'
      this.dialogFormItem = []
      this.ids = [row.id]
      this.resetDialogForm()
      this.dialogForm.recordNo = row.recordNo
      this.dialogForm.businessNo = row.businessNo
      this.dialogForm.amount = row.amount
      setTimeout(() => {
        this.dialogFormItem.push(...this.dialogItem)
        this.showDialog = true
      }, 20)
    }
  }
  // 确认弹窗
  private handlePassClick(valid: any) {
    this.saveData()
  }
  private async confirm(done: any) {
    ((this.$refs.dialogForm) as any).submitForm()
  }
  // 重置弹框表单
  resetDialogForm() {
    this.dialogForm = {
      recordNo: '',
      businessNo: '',
      amount: '',
      fileUrl: '',
      remark: ''
    }
  }
  // 弹框表单提交
  async saveData() {
    try {
      let params:IState = {
        fileUrl: this.dialogForm.fileUrl,
        id: this.ids
      }
      this.dialogForm.remark && (params.remark = this.dialogForm.remark)
      let { data: res } = await BjfreightChargeReceive(params)
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
  // 关闭弹窗清除数据
  private handleClosed() {
    this.resetDialogForm()
    this.ids = []
    this.showDialog = false;
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
      this.resetDialogForm()
      this.ids = this.multipleSelection.map(item => item.id)
      this.dialogTit = '批量标记付款'
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
  .DriverFreightBill{
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
