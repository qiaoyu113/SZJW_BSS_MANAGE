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
      <template slot="months">
        <el-date-picker
          v-model="listQuery.months"
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
            @click="listQuery.checkStatus =item.name;handleFilterClick()"
          >
            {{ item.text }}
          </el-button>
        </el-badge>
      </template>
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
          筛选结果（1000条）
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
          {{ scope.row.closeStatus ===1 ? '是':'否' }}
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
                command="driverCheck"
              >
                司机对账
              </el-dropdown-item>
              <el-dropdown-item
                command="download"
              >
                账单下载
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
      <p v-if="multipleSelection.length>0">
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
        <span>{{ slotProp.item.monthBillId }}</span>
        <span>{{ slotProp.item.driverCity }}</span>
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
import { GetMonthlyBillList, ExportMonthlyBillList, driverMonthlyBillCheck } from '@/api/driver-freight'
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
  private ids:number|string[] = [];
  // loading
  private listLoading:Boolean = false;
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
    driverName: '',
    driverCity: '',
    businessType: '',
    gmId: '',
    closeStatus: '',
    months: [],
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
      label: '司机姓名:',
      key: 'driverName'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '司机城市:',
      key: 'driverCity',
      options: []
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '业务线:',
      key: 'businessType',
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
      key: 'gmId',
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
      col: 8,
      label: '月份:',
      key: 'months',
      type: 'months',
      slot: true
    },
    {
      col: 20,
      label: '对账状态:',
      key: 'checkStatus',
      type: 'checkStatus',
      slot: true
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
      label: '账单月份',
      'min-width': '140px'
    },
    {
      key: 'driverName',
      label: '司机姓名',
      'min-width': '140px'
    },
    {
      key: 'driverCity',
      label: '司机城市',
      'min-width': '200px'
    },
    {
      key: 'turnoverTotalCount',
      label: '运费流水(个)',
      'min-width': '140px'
    },
    {
      key: 'waybillTotalCount',
      label: '出车单数(个)',
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
      label: '上传凭证',
      'min-width': '140px'
    },
    {
      key: 'gmName',
      label: '加盟经理',
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
    fileUrl: '',
    remark: ''
  }
  private fileList: []= [];
  private dialogRole: IState= {
    fileUrl: [
      { required: true, message: '请上传凭证', trigger: 'change' }
    ]
  }
  private dialogFormItem:any[] = [];
  // 弹窗表单容器
  private dialogItem: any[] = [
    {
      type: 7,
      col: 12,
      label: '月账单编号:',
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
      key: 'fileUrl',
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
      monthBillId: '',
      driverName: '',
      driverCity: '',
      businessType: '',
      gmId: '',
      closeStatus: '',
      months: [],
      checkStatus: ''
    }
  }
  // 查询表单
  private handleFilterClick() {
    this.page.page = 1
    this.getLists()
  }
  // 导出
  private async handleExportClick() {
    let params:IState = {}
    this.listQuery.monthBillId !== '' && (params.monthBillId = this.listQuery.monthBillId)
    this.listQuery.driverName !== '' && (params.driverName = this.listQuery.driverName)
    this.listQuery.driverCity !== '' && (params.driverCity = this.listQuery.driverCity)
    this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)
    this.listQuery.closeStatus !== '' && (params.closeStatus = this.listQuery.closeStatus)
    this.listQuery.checkStatus !== '' && (params.checkStatus = this.listQuery.checkStatus)
    if (this.listQuery.months && this.listQuery.months.length > 0) {
      let monthBillDateStart = new Date(this.listQuery.months[0])
      let monthBillDateEnd = new Date(this.listQuery.months[1])
      params.monthBillDateStart = monthBillDateStart.setHours(0, 0, 0)
      params.monthBillDateEnd = monthBillDateEnd.setHours(23, 59, 59)
    }
    this.exportExcel(params)
  }
  // 导出和下载月账单
  async exportExcel(params:IState) {
    try {
      let { data: res } = await ExportMonthlyBillList(params)
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
      this.listQuery.driverName !== '' && (params.driverName = this.listQuery.driverName)
      this.listQuery.driverCity !== '' && (params.driverCity = this.listQuery.driverCity)
      this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)
      this.listQuery.closeStatus !== '' && (params.closeStatus = this.listQuery.closeStatus)
      this.listQuery.checkStatus !== '' && (params.checkStatus = this.listQuery.checkStatus)
      if (this.listQuery.months && this.listQuery.months.length > 0) {
        let monthBillDateStart = new Date(this.listQuery.months[0])
        let monthBillDateEnd = new Date(this.listQuery.months[1])
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
        path: '/driverfreight/bill'
      })
    } else if (key === 'driverCheck') { // 司机对账
      this.dialogTit = '月账单对账'
      this.dialogFormItem = []
      this.dialogForm.monthBillId = row.monthBillId
      this.dialogForm.monthBillDate = row.monthBillDate
      this.dialogForm.amount = row.amount
      this.ids = [row.id]
      setTimeout(() => {
        this.dialogFormItem.push(...this.dialogItem)
        this.showDialog = true
      }, 20)
    } else if (key === 'download') { // 账单下载
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
  // 单匡表单提交
  private async saveData() {
    try {
      let params:IState = {
        fileUrl: this.dialogForm.fileUrl,
        id: this.ids
      }
      this.dialogForm.remark !== '' && (params.remark = this.dialogForm.remark)
      let { data: res } = await driverMonthlyBillCheck(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.getLists()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`save dta:${err}`)
    }
  }
  // 重置弹框表单数据
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
    this.showDialog = false
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
      this.dialogTit = '批量月账单对账'
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
    margin-right:20px;
  }
</style>
