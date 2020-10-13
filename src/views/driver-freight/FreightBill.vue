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
      <template slot="gmId">
        <el-select
          v-model="listQuery.gmId"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in gmIdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
      <!-- 表格 -->
      <self-table
        ref="freighForm"
        v-loading="listLoading"
        row-key="id"
        :height="tableHeight"
        :index="true"
        :is-p30="false"
        :indexes="false"
        :operation-list="operationList"
        :table-data="tableData"
        :columns="columns"
        :page="page"
        style="overflow: initial;"
        @olclick="handleOlClick"
        @onPageSize="handlePageSize"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:remarks="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.remarks"
            placement="top"
          >
            <span>{{ scope.row.remarks }}</span>
          </el-tooltip>
        </template>
        <template v-slot:departureDate="scope">
          {{ scope.row.departureDate | parseTime('{y}-{m}-{d}') }}
        </template>
        <template v-slot:createDate="scope">
          {{ scope.row.createDate | parseTime('{y}-{m}-{d}') }}
        </template>
        <template v-slot:driverName="scope">
          {{ scope.row.driverName }}/{{ scope.row.phone }}
        </template>
        <template v-slot:paymentReceivedFlag="scope">
          {{ scope.row.paymentReceivedFlag ? '是':'否' }}
        </template>
        <template v-slot:paymentVoucherPath="scope">
          <a
            type="primary"
            download
            :href="scope.row.paymentVoucherPath"
          >
            下载凭证
          </a>
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
                标记收款
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
      <p v-if="multipleSelection.length> 0">
        已选择{{ multipleSelection.length }}条流水
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
import { Vue, Component, Watch } from 'vue-property-decorator'
import { fileUpload } from '@/api/cargo'

import { month, lastmonth, threemonth } from './components/date'

import { GetFreightChargeList, ExportFreightChargeList, ReceiveFreightChargeList, GetSubjectList } from '@/api/driver-freight.ts'
import { Upload, getOfficeByType, getOfficeByTypeAndOfficeId, GetDutyListByLevel, GetSpecifiedRoleList } from '@/api/common'

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
    SelfDialog
  }
})
export default class extends Vue {
  private dutyListOptions:IState[] = [];// 业务线列表
  private gmIdOptions:IState[] = [];// 所属加盟经理列表
  private filelist:IState[] = []
  // 变动类型列表
  private subjectOptions:IState[] = []
  // 弹框选中的数据的id集合
  private ids:number|string[] = []
  // loading
  private listLoading:Boolean = false;
  @Watch('listQuery', { deep: true })
  onChange(newVal:IState, oldVal:IState) {
    if (newVal.driverCity.length > 0 && this.listQuery.businessType !== '') {
      this.getGmLists()
    }
  }
  // 查询表单
  private listQuery:IState = {
    driverName: '',
    gmId: '',
    businessType: '',
    paymentReceivedFlag: '',
    recordNo: '',
    businessNo: '',
    driverCity: [],
    subject: '',
    time: [],
    createTime: []
  }
  // 查询表单容器
  private formItem:any[] = [
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
      type: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'driverCity',
        props: {
          lazy: true,
          lazyLoad: this.showWork
        }
      },
      label: '司机城市:',
      key: 'driverCity',
      listeners: {
        'change': this.resetGmId
      }
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
      options: this.dutyListOptions,
      listeners: {
        'change': this.resetGmId
      }
    },
    {
      type: 'gmId',
      slot: true,
      label: '加盟经理:',
      key: 'gmId'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '是否已收款:',
      key: 'paymentReceivedFlag',
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
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 50
      },
      label: '流水编号:',
      key: 'recordNo'
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
      label: '变动类型:',
      key: 'subject',
      options: this.subjectOptions
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
      key: 'time'
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
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'businessNo',
      label: '出车单编号',
      'min-width': '200px'
    },
    {
      key: 'subject',
      label: '变动类型',
      'min-width': '140px'
    },
    {
      key: 'amount',
      label: '运费金额(元)',
      'min-width': '140px'
    },
    {
      key: 'createDate',
      label: '创建时间',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'createName',
      label: '创建人',
      'min-width': '140px'
    },
    {
      key: 'paymentReceivedFlag',
      label: '是否已收款',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'paymentVoucherPath',
      label: '收款凭证',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'remarks',
      label: '收款备注',
      slot: true,
      'min-width': '140px',
      attrs: {
        'show-overflow-tooltip': true
      }
    },
    {
      key: 'gmName',
      label: '加盟经理',
      'min-width': '140px'
    },
    {
      key: 'driverCity',
      label: '司机城市',
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
  private dialogFormItem:IState[] = [];
  // 弹窗表单容器
  private dialogItem: IState[] = [
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
      label: '运费金额:',
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
        type: 'textarea',
        placeholder: '请输入不超过100字',
        maxlength: 100,
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
  // 重置加盟经理
  resetGmId() {
    if (this.listQuery.gmId) {
      this.listQuery.gmId = ''
    }
  }
  // 重置表单
  private handleResetClick() {
    this.listQuery = {
      driverName: '',
      gmId: '',
      businessType: '',
      paymentReceivedFlag: '',
      recordNo: '',
      businessNo: '',
      driverCity: '',
      subject: '',
      time: [],
      createTime: []
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
      this.listQuery.driverName !== '' && (params.driverName = this.listQuery.driverName)
      this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)
      this.listQuery.businessType !== '' && (params.businessType = this.listQuery.businessType)
      this.listQuery.paymentReceivedFlag !== '' && (params.paymentReceivedFlag = this.listQuery.paymentReceivedFlag)
      this.listQuery.recordNo !== '' && (params.recordNo = this.listQuery.recordNo)
      this.listQuery.businessNo !== '' && (params.businessNo = this.listQuery.businessNo)
      if (this.listQuery.driverCity && this.listQuery.driverCity.length > 0) {
        params.driverCity = this.listQuery.driverCity[1]
      }
      this.listQuery.subject !== '' && (params.subject = this.listQuery.subject)
      if (this.listQuery.time && this.listQuery.time.length > 1) {
        let departureDateStart = new Date(this.listQuery.time[0])
        let departureDateEnd = new Date(this.listQuery.time[1])
        params.departureDateStart = departureDateStart.setHours(0, 0, 0)
        params.departureDateEnd = departureDateEnd.setHours(0, 0, 0)
      }
      if (this.listQuery.time && this.listQuery.time.length > 1) {
        let createDateStart = new Date(this.listQuery.createTime[0])
        let createDateEnd = new Date(this.listQuery.createTime[1])
        params.createDateStart = createDateStart.setHours(0, 0, 0)
        params.createDateEnd = createDateEnd.setHours(0, 0, 0)
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
      let params:IState = {
        page: this.page.page,
        limit: this.page.limit
      }
      this.listQuery.driverName !== '' && (params.driverName = this.listQuery.driverName)
      this.listQuery.businessType !== '' && (params.businessType = this.listQuery.businessType)
      this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)
      this.listQuery.paymentReceivedFlag !== '' && (params.paymentReceivedFlag = this.listQuery.paymentReceivedFlag)
      this.listQuery.recordNo !== '' && (params.recordNo = this.listQuery.recordNo)
      this.listQuery.businessNo !== '' && (params.businessNo = this.listQuery.businessNo)
      if (this.listQuery.driverCity && this.listQuery.driverCity.length > 0) {
        params.driverCity = this.listQuery.driverCity[1]
      }
      this.listQuery.subject !== '' && (params.subject = this.listQuery.subject)
      if (this.listQuery.time && this.listQuery.time.length > 1) {
        let departureDateStart = new Date(this.listQuery.time[0])
        let departureDateEnd = new Date(this.listQuery.time[1])
        params.departureDateStart = departureDateStart.setHours(0, 0, 0)
        params.departureDateEnd = departureDateEnd.setHours(0, 0, 0)
      }
      if (this.listQuery.time && this.listQuery.time.length > 1) {
        let createDateStart = new Date(this.listQuery.createTime[0])
        let createDateEnd = new Date(this.listQuery.createTime[1])
        params.createDateStart = createDateStart.setHours(0, 0, 0)
        params.createDateEnd = createDateEnd.setHours(0, 0, 0)
      }

      let { data: res } = await GetFreightChargeList(params)
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
  // 更多操作
  private handleCommandChange(key:string, row:any) {
    if (key === '1') { // 标记收款
      this.dialogTit = '标记收款'
      this.dialogFormItem = []
      this.resetDialogForm()
      this.dialogForm.recordNo = row.recordNo
      this.dialogForm.businessNo = row.businessNo
      this.dialogForm.amount = row.amount
      this.ids = [row.id]
      setTimeout(() => {
        this.dialogFormItem.push(...this.dialogItem)
        this.showDialog = true
      }, 20)
    }
  }
  // 重置弹框表单
  resetDialogForm() {
    this.dialogForm.recordNo = ''
    this.dialogForm.businessNo = ''
    this.dialogForm.amount = ''
    this.dialogForm.fileUrl = ''
    this.dialogForm.remark = ''
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
  // 确认弹窗
  private handlePassClick(valid: any) {
    this.saveData()
  }
  // 弹框确认按钮
  async saveData() {
    try {
      let params:IState = {
        fileUrl: this.dialogForm.fileUrl,
        id: this.ids
      }
      this.dialogForm.remark && (params.remark = this.dialogForm.remark)
      let { data: res } = await ReceiveFreightChargeList(params)
      if (res.success) {
        this.showDialog = false
        this.$message.success('操作成功')
        this.page.page = 1
        this.getLists()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`save data fail:${err}`)
    }
  }
  // 弹框的确定按钮
  private async confirm(done: any) {
    ((this.$refs.dialogForm) as any).submitForm()
  }
  // 关闭弹窗清除数据
  private handleClosed() {
    this.resetDialogForm()
    this.ids = [];
    (this.$refs.freighForm as any).toggleRowSelection()
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
      this.resetDialogForm()
      this.ids = this.multipleSelection.map(item => item.id)
      this.dialogTit = '批量标记收款'
      this.showDialog = true
      this.dialogFormItem = this.dialogItem.slice(3)
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
  // 获取客户城市
  private async showWork(node:any, resolve:any) {
    let query: any = {
      parentId: ''
    }
    if (node.level === 1) {
      query.parentId = node.value
    }
    try {
      if (node.level === 0) {
        let nodes = await this.areaAddress({ type: 2 })
        resolve(nodes)
      } else if (node.level === 1) {
        let nodes = await this.cityDetail(query)
        resolve(nodes)
      }
    } catch (err) {
      resolve([])
    }
  }
  // 获取大区列表
  private async areaAddress(params: any) {
    try {
      let { data: res } = await getOfficeByType(params)
      if (res.success) {
        const nodes = res.data.map(function(item: any) {
          return {
            value: item.id,
            label: item.name,
            leaf: false
          }
        })
        return nodes
      }
    } catch (err) {
      console.log(`load city by code fail:${err}`)
    }
  }
  // 根据大区获取城市列表
  private async cityDetail(params: any) {
    let { data: city } = await getOfficeByTypeAndOfficeId(params)
    if (city.success) {
      const nodes = city.data.map(function(item: any) {
        return {
          value: item.areaCode,
          label: item.name,
          leaf: true
        }
      })
      return nodes
    }
  }
  // 获取业务线
  private async getDutyListByLevel() {
    try {
      let params = {
        dutyLevel: 1
      }
      let { data: res } = await GetDutyListByLevel(params)
      if (res.success) {
        let options = res.data.map((item:any) => ({
          label: item.dutyName,
          value: item.id
        }))
        this.dutyListOptions.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get duty list fail:${err}`)
    }
  }
  // 获取加盟经理列表
  async getGmLists() {
    try {
      let len:number = this.gmIdOptions.length
      if (len > 0) {
        this.gmIdOptions.splice(0, len)
      }
      let params:IState = {
        roleType: 1
      }
      this.listQuery.businessType !== '' && (params.productLine = this.listQuery.businessType)
      if (this.listQuery.driverCity && this.listQuery.driverCity.length > 1) {
        params.cityCode = this.listQuery.driverCity[1]
      }

      let { data: res } = await GetSpecifiedRoleList(params)
      if (res.success) {
        let options = res.data.map((item:any) => ({
          label: item.name,
          value: item.id
        }))
        this.gmIdOptions.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get gm list fail:${err}`)
    }
  }
  mounted() {
    this.getLists()
    this.getDutyListByLevel()
    this.getSubjectList()
    this.getGmLists()
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
