<template>
  <div
    v-loading="listLoading"
    class="SelfDriverTag"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      label-width="140px"
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
          :loading="ExportClick"
          @click="handleExportClick"
        >
          导出
        </el-button>
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          @click="handleAddClick"
        >
          新增
        </el-button>
      </div>
    </self-form>
    <div class="table_box">
      <!-- 表格 -->
      <self-table
        ref="selfDriverTag"
        :height="tableHeight"
        :is-p30="false"
        :operation-list="[]"
        :table-data="tableData"
        :columns="columns"
        :index="false"
        :page="page"
        style="overflow: initial;"
        :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
        @onPageSize="handlePageSize"
      >
        <template v-slot:createDate="scope">
          {{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
        <template
          v-slot:op="scope"
        >
          <el-button
            type="text"
            @click="handleEditClick(scope.row)"
          >
            编辑
          </el-button>
        </template>
      </self-table>
    </div>
    <SelfDialog
      :visible.sync="showDialog"
      :title="dialogTit"
      :confirm="confirm"
      :sumbit-again="submitLoading"
      :destroy-on-close="true"
      @closed="handleClosed"
    >
      <p
        v-if="dialogTit === '新增司机标签'"
        class="addInfo"
      >
        说明：只有梧桐司机状态是已成交或已上岗或没有被新增标签的司机可新增
      </p>
      <self-form
        ref="dialogSelfTag"
        :rules="dialogRules"
        :list-query="dialogQuery"
        :form-item="dialogFormItem"
        size="small"
        label-width="140px"
        :pc-col="24"
        @onPass="handlePassClick"
      >
        <template slot="driverName">
          <el-select
            v-model.trim="dialogQuery.driverCode"
            v-loadmore="loadQueryDriverByKeyword"
            placeholder="请选择"
            reserve-keyword
            :default-first-option="true"
            clearable
            filterable
            remote
            :remote-method="querySearchByKeyword"
            :loading="driverLoading"
            @clear="handleClearQueryDriver"
            @change="handleDriverChange"
          >
            <el-option
              v-for="item in driverOptions"
              :key="item.driverCode"
              :label="`${item.label}` "
              :value="item.value"
            />
          </el-select>
        </template>
      </self-form>
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { HandlePages } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { today, yesterday, month, lastmonth, threemonth } from '../driver-freight/components/date'
import { GetDutyListByLevel, GetDictionaryCity } from '@/api/common'
import { GetDriverTagList, ExportDriverTagList, EditDriverTag, AddDriverTag, GetDriverByDriverName } from '@/api/driver-cloud'
interface PageObj {
  page:number,
  limit:number,
  total?:number
}

interface IState {
  [key: string]: any;
}
@Component({
  name: 'SelfDriverTag',
  components: {
    SelfTable,
    SelfForm,
    SelfDialog
  }
})
export default class extends Vue {
  private driverOver:Boolean = false
  private driverLoading:Boolean = false
  private ExportClick:boolean = false
  private showDialog:boolean = false;
  private listLoading:boolean = false;
  private dialogTableVisible:boolean = false;
  private submitLoading:boolean = false;
  private searchKeyword:string = ''
  private driverOptions:IState[] = [];
  private tableData:any[] = [];
  private openCityList:IState = [];
  private busiTypeList:IState = [];
  private dialogTit:string = ''
  private columns:any[] = [
    {
      key: 'id',
      label: '序号',
      width: '50px'
    },
    {
      key: 'workCityName',
      label: '梧桐司机城市',
      'width': '140px'
    },
    {
      key: 'name',
      label: '梧桐司机姓名',
      'width': '100px'
    },
    {
      key: 'phone',
      label: '梧桐司机手机号',
      'width': '100px'
    },
    {
      key: 'driverId',
      label: '梧桐司机编号',
      'width': '160px'
    },
    {
      key: 'adriverId',
      label: 'A端司机编号',
      'width': '160px'
    },
    {
      key: 'busiTypeName',
      label: '司机业务线',
      'width': '100px'
    },
    {
      key: 'statusName',
      label: '司机状态',
      'width': '100px'
    },
    {
      key: 'createName',
      label: '创建人',
      'width': '100px'
    },
    {
      key: 'createDate',
      label: '创建时间',
      slot: true,
      'width': '150px'
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      slot: true,
      'min-width': this.isPC ? '200px' : '50px'
    }
  ];
  private listQuery:IState = {
    key: '',
    driverId: '',
    aDriverId: '',
    workCity: '',
    busiType: '',
    status: '',
    time: []
  };
  // 司机状态
  private driverStatus:any = [
    {
      label: '全部',
      value: ''
    },
    {
      label: '已面试',
      value: 1
    },
    {
      label: '待成交',
      value: 2
    },
    {
      label: '已成交',
      value: 3
    },
    {
      label: '已上岗',
      value: 4
    },
    {
      label: '已终止服务',
      value: 5
    }
  ]
  private formItem:any[] = [
    {
      type: 1,
      label: '梧桐司机姓名:',
      key: 'key',
      tagAttrs: {
        placeholder: '请输入姓名/手机号',
        maxlength: 20,
        'show-word-limit': true,
        clearable: true
      }
    },
    {
      type: 1,
      label: '梧桐司机编号:',
      key: 'driverId',
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 50,
        'show-word-limit': true,
        clearable: true
      }
    },
    {
      type: 1,
      label: 'A端司机编号:',
      key: 'aDriverId',
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 50,
        'show-word-limit': true,
        clearable: true
      }
    },
    {
      type: 2,
      label: '梧桐司机城市:',
      key: 'workCity',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.openCityList
    },
    {
      type: 2,
      label: '司机业务线:',
      key: 'busiType',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.busiTypeList
    },
    {
      type: 2,
      label: '司机状态:',
      key: 'status',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.driverStatus
    },
    {
      type: 3,
      col: 10,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-time': ['00:00:00', '23:59:59'],
        pickerOptions: {
          shortcuts: [today, yesterday, month, lastmonth, threemonth]
        }
      },
      label: '创建日期',
      key: 'time'
    },
    {
      type: 'mulBtn',
      col: 14,
      slot: true,
      w: '0px'
    }
  ];
  // 分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  // 搜索司机分页
  private queryPage:PageObj = {
    page: 1,
    limit: 20,
    total: 0
  }
  private dialogQuery:IState = {
    id: '',
    driverName: '',
    driverCode: '',
    businessTypeName: '',
    aDriverCode: ''
  }
  private dialogFormItem:IState[] = [
    {
      type: 7,
      label: '梧桐司机编号:',
      key: 'driverCode',
      isNull: true
    },
    {
      type: 7,
      label: '业务线:',
      key: 'businessTypeName',
      isNull: true
    },
    {
      type: 1,
      label: 'A端司机编号:',
      key: 'aDriverCode',
      tagAttrs: {
        placeholder: '请输入7位自承运司机编号',
        maxlength: 7,
        'show-word-limit': true,
        type: 'number'
      }
    }
  ]

  private dialogRules = {
    aDriverCode: [
      { required: true, message: '请输入7位自承运司机编号', trigger: 'blur' },
      { validator: this.validateADriverCode, trigger: 'blur' }
    ],
    driverName: { required: true, message: '请输入选择司机', trigger: 'blur' }
  }
  private validateADriverCode(rule:any, value:any, callback:any) {
    const isInteger = Number.isInteger(Number(value))
    if (!isInteger) {
      callback(new Error('A端司机编号格式错误!'))
    } else {
      if (value.length !== 7 || isNaN(Number(value))) {
        callback(new Error('A端司机编号格式错误!'))
      } else {
        callback()
      }
    }
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  get tableHeight() {
    let otherHeight = 400
    return document.body.offsetHeight - otherHeight || document.documentElement.offsetHeight - otherHeight
  }
  // 获取开通城市
  async getOpenCity() {
    try {
      let { data: res } = await GetDictionaryCity()
      if (res.success) {
        let options:IState[] = res.data.map((item:any) => ({
          value: item.code,
          label: item.name
        }))
        options.unshift({
          label: '全部',
          value: ''
        })
        this.openCityList.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get open city list fail:${err}`)
    }
  }
  // 获取业务线
  async getGetDutyListByLevel() {
    try {
      let params = {
        dutyLevel: 1
      }
      let { data: res } = await GetDutyListByLevel(params)
      if (res.success) {
        let options:IState[] = res.data.map((item:any) => ({
          label: item.dutyName,
          value: item.id
        }))
        options.unshift({
          label: '全部',
          value: ''
        })
        this.busiTypeList.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get busiType fail:${err}`)
    }
  }
  // 查询
  handleFilterClick() {
    this.page.page = 1
    this.getLists()
  }
  // 导出
  private async handleExportClick(row:IState) {
    try {
      this.ExportClick = true
      let params:IState = {}
      this.listQuery.key && (params.key = this.listQuery.key)
      this.listQuery.driverId && (params.driverId = this.listQuery.driverId)
      this.listQuery.aDriverId && (params.otherDriverId = this.listQuery.aDriverId)
      this.listQuery.workCity && (params.workCity = this.listQuery.workCity)
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.status && (params.status = this.listQuery.status)
      if (this.listQuery.time && this.listQuery.time.length > 0) {
        let startDate = new Date(this.listQuery.time[0])
        let endDate = new Date(this.listQuery.time[1])
        startDate.setHours(0, 0, 0)
        endDate.setHours(23, 59, 59)
        params.startDate = startDate
        params.endDate = endDate
      }
      let { data: res } = await ExportDriverTagList(params)
      if (res.success) {
        this.ExportClick = false
        this.$message({
          type: 'success',
          message: '导出成功!'
        })
      } else {
        this.ExportClick = false
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get list fail:${err}`)
    }
  }
  // 新增
  handleAddClick() {
    this.dialogTit = '新增司机标签'
    this.dialogFormItem.unshift({
      key: 'driverName',
      label: '梧桐司机姓名:',
      type: 'driverName',
      slot: true
    })
    this.loadQueryDriverByKeyword()
    this.showDialog = true
  }
  // 编辑
  handleEditClick(row:IState) {
    this.dialogTit = '编辑司机标签'
    this.dialogFormItem.unshift({
      label: '梧桐司机姓名:',
      type: 7,
      key: 'driverName'
    })
    this.showDialog = true
    this.dialogQuery.id = row.id
    this.dialogQuery.driverName = row.name
    this.dialogQuery.driverCode = row.driverId
    this.dialogQuery.businessTypeName = row.busiTypeName
    this.dialogQuery.aDriverCode = row.adriverId
  }

  // 表单验证通过
  handlePassClick(valid:boolean) {
    this.saveData()
  }
  // 弹框确认按钮
  confirm() {
    ((this.$refs.dialogSelfTag) as any).submitForm()
  }
  // 保存-编辑或新增
  private async saveData() {
    try {
      this.submitLoading = true
      let params:IState = {
        driverId: this.dialogQuery.driverCode,
        otherDriverId: this.dialogQuery.aDriverCode
      }
      await this.chooseAddorUpdata(params)
      setTimeout(() => {
        this.submitLoading = false
      }, 1000)
    } catch (err) {
      this.submitLoading = false
      console.log(`submit fail:${err}`)
    }
  }

  private async chooseAddorUpdata(params:any) {
    if (this.dialogTit === '编辑司机标签') {
      let { data: res } = await EditDriverTag(params)
      if (res.success) {
        this.showDialog = false
        this.getLists()
        this.$message.success('提交成功')
      } else {
        this.$message.error(res.errorMsg)
      }
    } else {
      let { data: res } = await AddDriverTag(params)
      if (res.success) {
        this.showDialog = false
        this.getLists()
        this.$message.success('提交成功')
      } else {
        this.$message.error(res.errorMsg)
      }
    }
  }
  // 弹框关闭后
  handleClosed() {
    ((this.$refs.dialogSelfTag) as any).resetForm()
    this.reset()
    this.dialogFormItem.shift()
    this.submitLoading = false
  }
  // 搜索司机
  async loadQueryDriverByKeyword(val:string = '') {
    try {
      val = this.searchKeyword
      let params:IState = {
        page: this.queryPage.page,
        limit: this.queryPage.limit
      }
      val !== '' && (params.key = val)
      let result:IState[] = await this.loadDriverByKeyword(params)
      this.driverOptions.push(...result)
    } catch (err) {
      console.log(`get driver fail:${err}`)
    }
  }
  // 根据关键字查司机信息
  async loadDriverByKeyword(params:IState) {
    if (this.driverOver) {
      return
    }
    try {
      let { data: res } = await GetDriverByDriverName(params)
      if (res.data.length && res.data.length > 0 && res.data.length === this.queryPage.limit) {
        this.queryPage.page++
      } else {
        this.driverOver = true
      }
      let result = res.data.map((item:IState) => {
        item.label = `${item.name}(${item.phone})`
        item.value = item.driverId
        return item
      })
      return result
    } catch (err) {
      console.log(`get driver list fail:${err}`)
      return []
    }
  }
  // 搜索
  async querySearchByKeyword(val:string) {
    this.reset()
    this.driverLoading = true
    this.searchKeyword = val
    this.driverOptions.splice(0, this.driverOptions.length)
    await this.loadQueryDriverByKeyword(this.searchKeyword)
    this.driverLoading = false
  }
  // 重置弹框司机信息
  reset() {
    this.queryPage.page = 1
    this.dialogQuery.id = ''
    this.dialogQuery.driverName = ''
    this.dialogQuery.driverCode = ''
    this.dialogQuery.businessTypeName = ''
    this.dialogQuery.aDriverCode = ''
    this.searchKeyword = ''
    this.driverOver = false
    this.driverOptions.splice(0, this.driverOptions.length)
  }
  // 删除司机
  handleClearQueryDriver() {
    this.searchKeyword = ''
    this.reset()
    this.loadQueryDriverByKeyword()
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
      this.listQuery.key && (params.key = this.listQuery.key)
      this.listQuery.driverId && (params.driverId = this.listQuery.driverId)
      this.listQuery.aDriverId && (params.otherDriverId = this.listQuery.aDriverId)
      this.listQuery.workCity && (params.workCity = this.listQuery.workCity)
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.status && (params.status = this.listQuery.status)
      if (this.listQuery.time && this.listQuery.time.length > 1) {
        let startDate = new Date(this.listQuery.time[0])
        let endDate = new Date(this.listQuery.time[1])
        params.startDate = startDate.setHours(0, 0, 0)
        params.endDate = endDate.setHours(23, 59, 59)
      }
      let { data: res } = await GetDriverTagList(params)
      if (res.success) {
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
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
  // 新增选择完司机
  handleDriverChange(val:string) {
    let array:IState[] = this.driverOptions.filter((item:any) => item.driverId === val)
    if (array.length > 0) {
      this.dialogQuery.driverName = array[0].name
      this.dialogQuery.driverCode = array[0].driverId
      this.dialogQuery.businessTypeName = array[0].busiTypeName
      this.dialogQuery.aDriverCode = array[0].aDriverCode
    }
  }
  mounted() {
    this.getOpenCity()
    this.getGetDutyListByLevel()
    this.getLists()
  }
}

</script>
<style lang="scss" scoped>
  .SelfDriverTag {
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
      padding: 10px 30px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
    .addInfo{
      margin-left: 50px;
      font-size: 13px;
      color: #FF5D5D;
    }

  }
</style>
