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
          @click="handleAddClick"
        >
          新增
        </el-button>
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
        <template v-slot:driverName="scope">
          <span>{{ scope.row.driverName }}/{{ scope.row.phone }}</span>
        </template>
        <template v-slot:voucher_path="scope">
          <a
            :href="scope.row.voucher_path"
            style="color:#649CEE;cursor: pointer;"
          >下载凭证</a>
        </template>
        <template v-slot:remark="scope">
          {{ scope.row.remark | DataIsNull }}
        </template>
        <template v-slot:createDate="scope">
          <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </self-table>
    </div>
    <!-- 标记收款弹窗 -->
    <SelfDialog
      :class="'distributionDialog'"
      :visible.sync="showDialog"
      title="新增运费调整"
      :sumbit-again="submitLoading"
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
        <template slot="driverId">
          <el-select
            ref="select"
            v-model.trim="dialogForm.driverId"
            v-loadmore="loadQueryDriverByKeyword"
            placeholder="请选择"
            clearable
            filterable
            remote
            :remote-method="querySearchByKeyword"
            @clear="handleClearQueryDriver"
            @change="getOrderListByDriverId"
          >
            <el-option
              v-for="item in driverOptions"
              :key="item.value"
              :label="`${item.label}/${item.phone}` "
              :value="item.value"
            />
          </el-select>
        </template>
        <template slot="amount">
          <el-input
            v-model.trim="dialogForm.amount"
            v-only-number="{min: 0, max: 999999.99, precision: 2}"
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
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { HandlePages } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'
import PitchBox from '@/components/PitchBox/index.vue'
import { month, lastmonth, threemonth } from './components/date'
import { GetShippingChangeList, GetShippingChangeExport, SaveShippingChange, GetSubjectList, GetOrderDriverList } from '@/api/driver-freight'
import { GetDriverListByKerWord } from '@/api/driver'
import { Upload, getOfficeByType, getOfficeByTypeAndOfficeId, GetDutyListByLevel, GetSpecifiedRoleList } from '@/api/common'
import { delayTime } from '@/settings'
import { getOrderListByDriverId } from '@/api/driver-account'
interface PageObj {
  page:number,
  limit:number,
  total?:number
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
  private searchKeyword:string = ''
  private dutyListOptions:IState[] = [];// 业务线列表
  private gmIdOptions:IState[] = [];// 所属加盟经理列表
  private orderListOptions:IState[] = []; // 订单列表
  // 运费调整原因列表
  private subjectOptions:IState[] = []
  // loading
  private listLoading:boolean = false
  // 是否显示弹框
  private driverOptions:IState[] = [];// 司机列表
  private showDialog:boolean = false
  private submitLoading:boolean = false;
  // 查询表单
  private listQuery:IState = {
    changeId: '',
    subject: '',
    driverName: '',
    gmId: '',
    businessType: '',
    driverId: '',
    driverCity: [],
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
      options: this.subjectOptions
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
      type: 8,
      tagAttrs: {
        placeholder: '请选择',
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'driverCity',
        clearable: true,
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
      slot: true,
      label: '司机姓名',
      'min-width': '140px'
    },
    {
      key: 'amount',
      label: '调整金额(元)',
      'min-width': '140px'
    },
    {
      key: 'subjectName',
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
      key: 'cityName',
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
    orderId: '',
    amount: '',
    fileUrl: '',
    remark: ''
  }
  private filelist:string[] = []
  private dialogFormItem:any[] = [
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '调整原因:',
      key: 'subject',
      options: this.subjectOptions
    },
    {
      type: 'driverId',
      slot: true,
      label: '选择司机:',
      key: 'driverId'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '订单编号:',
      key: 'orderId',
      options: this.orderListOptions
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
      { required: true, message: '请选择', trigger: ['blur', 'change'] }
    ],
    driverId: [
      { required: true, message: '请选择成交的司机', trigger: ['blur', 'change'] }
    ],
    orderId: [
      { required: true, message: '请选择', trigger: ['blur', 'change'] }
    ],
    amount: [
      { required: true, message: '请输入运费金额', trigger: ['blur', 'change'] },
      { validator: this.validateAmount, trigger: ['blur', 'change'] }
    ],
    fileUrl: [
      { required: true, message: '请上传凭证', trigger: ['blur', 'change'] }
    ]
  }
  validateAmount(rule:any, value:any, callback:any) {
    if (+value <= 0) {
      return callback(new Error('流水金额不能小于0'))
    } else {
      callback()
    }
  }
  // 查询分页
  private queryPage:PageObj = {
    page: 0,
    limit: 10
  }
  private queryDriverLoading:boolean = false
  @Watch('showDialog')
  onDialogChange(val:boolean) {
    if (val) {
      this.loadQueryDriverByKeyword()
    }
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  get tableHeight() {
    let otherHeight = 440
    return document.body.offsetHeight - otherHeight || document.documentElement.offsetHeight - otherHeight
  }

  // 重置加盟经理
  resetGmId() {
    if (this.listQuery.gmId) {
      this.listQuery.gmId = ''
    }
    this.getGmLists()
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
      if (this.listQuery.driverCity && this.listQuery.driverCity.length > 0) {
        params.driverCity = this.listQuery.driverCity[1]
      }
      if (this.listQuery.createTime && this.listQuery.createTime.length > 0) {
        let createDateStart = new Date(this.listQuery.createTime[0])
        let createDateEnd = new Date(this.listQuery.createTime[1])
        params.createDateStart = createDateStart.setHours(0, 0, 0)
        params.createDateEnd = createDateEnd.setHours(23, 59, 59)
      } else {
        return this.$message.error('请选择创建时间')
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
    this.getGmLists()
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
      this.submitLoading = true
      let params:IState = {
        subject: this.dialogForm.subject,
        driverId: this.dialogForm.driverId,
        orderId: this.dialogForm.orderId,
        amount: this.dialogForm.amount,
        fileUrl: this.dialogForm.fileUrl
      }
      this.dialogForm.remark && (params.remark = this.dialogForm.remark)
      let { data: res } = await SaveShippingChange(params)
      if (res.success) {
        this.showDialog = false
        this.$message.success('新增运费调整成功')
        setTimeout(() => {
          this.getLists()
        }, delayTime)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`submit fail:${err}`)
    } finally {
      setTimeout(() => {
        this.submitLoading = false
      }, 1000)
    }
  }
  // 关闭弹框
  handleClosed() {
    this.dialogForm = {
      subject: '',
      driverId: '',
      orderId: '',
      amount: '',
      fileUrl: '',
      remark: ''
    }
    this.resetDriver();
    ((this.$refs.dialogForm) as any).resetForm()
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
      if (this.listQuery.driverCity && this.listQuery.driverCity.length > 0) {
        params.driverCity = this.listQuery.driverCity[1]
      }
      if (this.listQuery.createTime && this.listQuery.createTime.length > 0) {
        let createDateStart = new Date(this.listQuery.createTime[0])
        let createDateEnd = new Date(this.listQuery.createTime[1])
        params.createDateStart = createDateStart.setHours(0, 0, 0)
        params.createDateEnd = createDateEnd.setHours(23, 59, 59)
      }
      let { data: res } = await GetShippingChangeList(params)
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
  // 变动类型列表
  async getSubjectList() {
    try {
      let params:IState = {
        type: 1
      }
      let { data: res } = await GetSubjectList(params)
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
        this.dutyListOptions.push({
          label: '全部',
          value: ''
        })
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
      if (this.listQuery.driverCity.length > 1) {
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
  // 顶部司机关键字搜索
  querySearchByKeyword(val:string) {
    this.queryPage.page = 0
    this.resetDriver()
    this.searchKeyword = val
    this.loadQueryDriverByKeyword(val)
  }
  async loadQueryDriverByKeyword(val?:string) {
    if (this.searchKeyword && this.queryPage.page !== 0) {
      this.searchKeyword = ''
      return false
    }
    this.queryPage.page++
    let params:IState = {
      page: this.queryPage.page,
      limit: this.queryPage.limit,
      statuss: [3, 4, 5]
    }
    val !== '' && (params.key = val)
    this.queryDriverLoading = true
    try {
      let result:IState[] = await this.loadDriverByKeyword(params)
      this.driverOptions.push(...result)
    } finally {
      this.queryDriverLoading = false
    }
  }
  // 根据关键字查司机id
  async loadDriverByKeyword(params:IState) {
    try {
      let { data: res } = await GetOrderDriverList(params)
      let result:any[] = res.data.map((item:any) => ({
        label: item.name,
        value: item.driverId,
        phone: item.phone
      }))
      return result
    } catch (err) {
      console.log(`get driver list fail:${err}`)
      return []
    }
  }
  // 删除查询区选中的司机
  handleClearQueryDriver() {
    this.resetDriver()
    this.loadQueryDriverByKeyword()
  }
  // 重置司机
  resetDriver() {
    this.dialogForm.driverId = ''
    let len:number = this.driverOptions.length
    if (len > 0) {
      this.queryPage.page = 0
      this.driverOptions.splice(0, len)
    }
    this.resetOrder()
  }
  // 重置订单
  resetOrder() {
    this.dialogForm.orderId = ''
    let len:number = this.orderListOptions.length
    if (len > 0) {
      this.orderListOptions.splice(0, len)
    }
  }
  // 根据司机id获取已终止订单列表
  async getOrderListByDriverId() {
    try {
      this.resetOrder()
      let params = {
        driverId: this.dialogForm.driverId,
        operateFlag: 'abort_deal'
      }
      let { data: res } = await getOrderListByDriverId(params)
      if (res.success) {
        let orderList = res.data.map((item:any) => ({
          label: item.orderId,
          value: item.orderId
        }))
        this.orderListOptions.push(...orderList)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get order list fail:${err}`)
    }
  }
  mounted() {
    this.getLists()
    this.getSubjectList()
    this.getDutyListByLevel()
    this.getGmLists()
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
  .AdjustmentList >>> .el-input-group__append {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
  }
</style>
