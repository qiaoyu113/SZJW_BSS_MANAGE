<template>
  <div
    class="AdjustmentList"
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
          @click="handleAddClick"
        >
          新增
        </el-button>
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
          筛选结果（{{ page.total }}条）
        </div>
      </div>
      <!-- 表格 -->
      <self-table
        ref="freighForm"
        v-loading="listLoading"
        row-key="id"
        :height="tableHeight"
        :index="false"
        :is-p30="false"
        :indexes="false"
        :operation-list="[]"
        :table-data="tableData"
        :columns="columns"
        :page="page"
        style="overflow: initial;"
        @onPageSize="handlePageSize"
      >
        <template v-slot:voucher_path="scope">
          <span>{{ scope.row.voucher_path }}</span>
        </template>
        <template v-slot:remark="scope">
          <el-tooltip
            effect="dark"
            :content="scope.row.remark"
            placement="top"
          >
            <span>{{ scope.row.remark }}</span>
          </el-tooltip>
        </template>
        <template v-slot:createDate="scope">
          <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </self-table>
    </div>
    <!-- 标记收款弹窗 -->
    <SelfDialog
      :class="'distributionDialog'"
      :visible.sync="showDialog"
      title="新增运费调整"
      :confirm="confirm"
      :destroy-on-close="true"
      @closed="handleClosed"
    >
      <self-form
        ref="dialogForm"
        :list-query="dialogForm"
        :form-item="dialogFormItem"
        size="small"
        label-width="90px"
        class="p15"
        :pc-col="24"
        :rules="dialogRole"
        @onPass="handlePassClick"
      >
        <template slot="amount">
          <el-input
            v-model.trim="dialogForm.amount"
            type="text"
          >
            <template slot="append">
              元
            </template>
          </el-input>
        </template>
        <template
          slot="fileUrl"
        >
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
import { Vue, Component } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { HandlePages } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'
import PitchBox from '@/components/PitchBox/index.vue'
import { month, lastmonth, threemonth } from './components/date'
import { GetShippingChangeList, GetShippingChangeExport, SaveShippingChange, GetSubjectList } from '@/api/driver-freight'
import { Upload } from '@/api/common'
interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}

interface IState {
  [key: string]: any;
}
@Component({
  name: 'AdjustmentList',
  components: {
    SelfTable,
    SelfForm,
    SelfDialog,
    PitchBox
  }
})
export default class extends Vue {
  // 运费调整原因列表
  private subjectOptions:IState[] = []
  // loading
  private listLoading:boolean = false
  // 是否显示弹框
  private showDialog:boolean = false
  // 查询表单
  private listQuery:IState = {
    changeId: '',
    subject: '',
    driverName: '',
    gmId: '',
    businessType: '',
    driverId: '',
    driverCity: '',
    createTime: []
  }
  // 查询表单容器
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入编号',
        clearable: true,
        maxlength: 50
      },
      label: '调整编号:',
      key: 'changeId'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '调整原因:',
      key: 'subject',
      options: []
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入姓名/手机号',
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
      label: '业务线:',
      key: 'businessType',
      options: []
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 50
      },
      label: '司机编号:',
      key: 'driverId'
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
      key: 'createTime'
    }
  ]
  // 表格数据
  private tableData:any[] = []

  // 表格列
  private columns:any[] = [
    {
      key: 'changeId',
      label: '调整编号',
      'min-width': '140px'
    },
    {
      key: 'driverId',
      label: '司机编号',
      'min-width': '140px'
    },
    {
      key: 'driverName',
      label: '司机姓名',
      'min-width': '140px'
    },
    {
      key: 'businessNo',
      label: '调整金额(元)',
      'min-width': '140px'
    },
    {
      key: 'subject',
      label: '调整原因',
      'min-width': '140px'
    },
    {
      key: 'voucher_path',
      label: '调整凭证',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'remark',
      label: '备注',
      slot: true,
      'min-width': '140px',
      attrs: {
        'show-overflow-tooltip': true
      }

    },
    {
      key: 'createName',
      label: '创建人',
      'min-width': '140px'
    },
    {
      key: 'createDate',
      label: '创建时间',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'businessType',
      label: '业务线',
      'min-width': '140px'
    },
    {
      key: 'driverCity',
      label: '司机城市',
      'min-width': '140px'
    },
    {
      key: 'gmName',
      label: '司机加盟经理',
      'min-width': '140px'
    }
  ]
  // 分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }

  private dialogForm:IState = {
    subject: '',
    driverId: '',
    amount: '',
    fileUrl: '',
    remark: ''
  }
  private filelist:string[] = []
  private dialogFormItem:any[] = [
    {
      type: 2,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true
      },
      label: '调整原因:',
      key: 'subject',
      options: this.subjectOptions
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '选择司机:',
      key: 'driverId',
      options: []
    },
    {
      slot: true,
      label: '运费金额:',
      type: 'amount',
      key: 'amount'
    },
    {
      slot: true,
      label: '上传凭证:',
      type: 'fileUrl',
      key: 'fileUrl'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 100,
        rows: 3,
        type: 'textarea',
        'show-word-limit': true
      },
      label: '备注:',
      key: 'remark'
    }
  ]
  private dialogRole:any = {
    subject: [
      { required: true, message: '请输入', trigger: 'blur' }
    ],
    driverId: [
      { required: true, message: '请选择', trigger: 'blur' }
    ],
    amount: [
      { required: true, message: '请输入', trigger: 'blur' }
    ],
    fileUrl: [
      { required: true, message: '请选择', trigger: 'blur' }
    ]
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  get tableHeight() {
    let otherHeight = 440
    return document.body.offsetHeight - otherHeight || document.documentElement.offsetHeight - otherHeight
  }
  // 导出
  async handleExportClick() {
    try {
      let params:IState = {}
      this.listQuery.changeId !== '' && (params.changeId = this.listQuery.changeId)
      this.listQuery.subject !== '' && (params.subject = this.listQuery.subject)
      this.listQuery.driverName !== '' && (params.driverName = this.listQuery.driverName)
      this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)
      this.listQuery.businessType !== '' && (params.businessType = this.listQuery.businessType)
      this.listQuery.driverId !== '' && (params.driverId = this.listQuery.driverId)
      this.listQuery.driverCity !== '' && (params.driverCity = this.listQuery.driverCity)
      if (this.listQuery.createTime && this.listQuery.createTime.length > 0) {
        let createDateStart = new Date(this.listQuery.createDateStart[0])
        let createDateEnd = new Date(this.listQuery.createTime[1])
        params.createDateStart = createDateStart.setHours(0, 0, 0)
        params.createDateEnd = createDateEnd.setHours(23, 59, 59)
      }
      let { data: res } = await GetShippingChangeExport(params)
      if (res.success) {
        this.$message.success('操作成功')
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`export excel fail:${err}`)
    }
  }
  // 查询
  handleFilterClick() {
    this.page.page = 1
    this.getLists()
  }
  // 重置
  handleResetClick() {
    this.listQuery = {
      changeId: '',
      subject: '',
      driverName: '',
      gmId: '',
      businessType: '',
      driverId: '',
      driverCity: '',
      createTime: []
    }
  }
  // 新增
  handleAddClick() {
    this.showDialog = true
  }
  // 弹框确定按钮
  handlePassClick() {
    this.saveData()
  }
  // 弹框提交表单
  async saveData() {
    try {
      let params:IState = {
        subject: this.dialogForm.subject,
        driverId: this.dialogForm.driverId,
        amount: this.dialogForm.amount,
        fileUrl: this.dialogForm.fileUrl
      }
      this.dialogForm.remark && (params.remark = this.dialogForm.remark)
      let { data: res } = await SaveShippingChange(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.getLists()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`submit fail:${err}`)
    }
  }
  // 关闭弹框
  handleClosed() {
    this.dialogForm = {
      subject: '',
      driverId: '',
      amount: '',
      fileUrl: '',
      remark: ''
    }
    this.showDialog = false
  }
  confirm() {
    ((this.$refs.dialogForm) as any).submitForm()
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
    const isSize = file.size / 1024 / 1024 < 10
    if (isType) {
      this.$message.error('上传文件只能是 .rar .zip .doc .docx jpg等 格式!')
      return false
    }
    if (!isSize) {
      this.$message.error('上传文件大小不能超过 10MB!')
      return false
    }
    return true
  }
  // 分页
  private handlePageSize(page:PageObj) {
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
      this.listQuery.changeId !== '' && (params.changeId = this.listQuery.changeId)
      this.listQuery.subject !== '' && (params.subject = this.listQuery.subject)
      this.listQuery.driverName !== '' && (params.driverName = this.listQuery.driverName)
      this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)
      this.listQuery.businessType !== '' && (params.businessType = this.listQuery.businessType)
      this.listQuery.driverId !== '' && (params.driverId = this.listQuery.driverId)
      this.listQuery.driverCity !== '' && (params.driverCity = this.listQuery.driverCity)
      if (this.listQuery.createTime && this.listQuery.createTime.length > 0) {
        let createDateStart = new Date(this.listQuery.createDateStart[0])
        let createDateEnd = new Date(this.listQuery.createTime[1])
        params.createDateStart = createDateStart.setHours(0, 0, 0)
        params.createDateEnd = createDateEnd.setHours(23, 59, 59)
      }
      let { data: res } = await GetShippingChangeList(params)
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
  // 获取调整原因
  async getSubjectList() {
    try {
      let { data: res } = await GetSubjectList()
      if (res.success) {
        let subjectArr = res.data.map((item:any) => {
          return {
            label: item.name,
            value: item.code
          }
        })
        this.subjectOptions.push(...subjectArr)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get subject list fail:${err}`)
    }
  }
  mounted() {
    this.getLists()
    this.getSubjectList()
  }
}
</script>

<style lang="scss" scoped>
  .AdjustmentList{
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
  .AdjustmentList >>> .el-input-group__append {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
  }
</style>