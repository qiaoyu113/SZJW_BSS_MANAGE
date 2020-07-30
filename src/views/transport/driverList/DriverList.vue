<template>
  <div
    class="DriverList"
    :style="{
      padding: isPC ? '15px' : '0px'
    }"
  >
    <suggest-container
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.status"
      @handle-query="handleQuery"
    >
      <!-- 查询表单 -->
      <self-form
        :list-query="listQuery"
        :form-item="formItem"
        label-width="80px"
      >
        <div
          slot="btn1"
          :class="isPC ? 'btnPc' : 'mobile'"
        >
          <el-button
            type="primary"
            :class="isPC ? '' : 'btnMobile'"
            name="driverlist_query_btn"
            size="small"
            @click="handleQueryClick"
          >
            筛选
          </el-button>
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            name="driverlist_reset_btn"
            size="small"
            @click="handleResetClick"
          >
            重置
          </el-button>
          <el-button
            v-permission="['/v1/driver/updateDriverBDManager']"
            :class="isPC ? '' : 'btnMobile'"
            type="primary"
            name="driverlist_manager_btn"
            size="small"
            @click="handleModifyManager"
          >
            修改加盟经理
          </el-button>
        </div>
      </self-form>
    </suggest-container>
    <!-- 表格顶部的按钮 -->
    <table-header
      :tab="[]"
      active-name=""
    >
      <el-dropdown
        :hide-on-click="false"
        trigger="click"
      >
        <el-button
          type="warning"
          size="mini"
          style="margin-left:10px"
          name="driverclue_column_btn"
        >
          <i
            class="el-icon-s-operation"
          />
          <span v-if="isPC">筛选</span>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-checkbox-group v-model="checkList">
            <el-dropdown-item
              v-for="item in dropdownList"
              :key="item.label"
            >
              <el-checkbox
                :label="item.label"
                :disabled="item.disabled"
              />
            </el-dropdown-item>
          </el-checkbox-group>
        </el-dropdown-menu>
      </el-dropdown>
    </table-header>
    <!-- 表格 -->
    <self-table
      ref="driverListTable"
      v-loading="listLoading"
      row-key="driverId"
      :operation-list="operationList"
      :table-data="tableData"
      :columns="columns"
      :page="page"
      @olclick="handleOlClick"
      @onPageSize="handlePageSize"
      @selection-change="handleChange"
    >
      <template v-slot:createDate="scope">
        {{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
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
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="[4].includes(scope.row.status)"
              v-permission="['/v1/driver/driverDownToGm']"
              command="distribution"
            >
              分配
            </el-dropdown-item>
            <el-dropdown-item
              v-if="[1,2,3].includes(scope.row.status)"
              v-permission="['/v1/driver/driverFollowSave']"
              command="follow"
            >
              跟进
            </el-dropdown-item>
            <el-dropdown-item
              v-if="[2].includes(scope.row.status)"
              v-permission="['/v1/driver/driverFollowUpToDown']"
              command="giveup"
            >
              放弃
            </el-dropdown-item>
            <el-dropdown-item
              v-if="[1,2,3,4].includes(scope.row.status)"
              v-permission="['/v1/driver/updateDriver']"
              command="edit"
            >
              编辑
            </el-dropdown-item>
            <el-dropdown-item
              v-if="[1,2,3,4].includes(scope.row.status)"
              v-permission="['/v1/driver/driverDetailByInview']"
              command="detail"
            >
              详情
            </el-dropdown-item>
            <el-dropdown-item
              v-if="[3].includes(scope.row.status)"
              command="account"
            >
              账户
            </el-dropdown-item>
            <el-dropdown-item
              v-if="[1,2,3].includes(scope.row.status)"
              v-permission="['/v1/order/createNewOrder']"
              command="order"
            >
              创建订单
            </el-dropdown-item>
            <el-dropdown-item
              v-if="[3].includes(scope.row.status)"
              v-permission="['/v1/carrier/saveCarrierInfo']"
              command="transport"
            >
              创建运力
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </self-table>
    <manager-dialog
      ref="driverListManager"
      :rows="rows"
      :type="type"
      @onRefresh="handleGetList"
      @onRows="rows = []"
    />

    <PitchBox
      :drawer.sync="drawer"
      :drawer-list="rows"
      @deletDrawerList="deletDrawerList"
      @changeDrawer="changeDrawer"
    >
      <template slot-scope="slotProp">
        <span>{{ slotProp.item.name }}</span>
        <span>{{ slotProp.item.driverId }}</span>
        <span>{{ slotProp.item.busiTypeName }}</span>
      </template>
    </PitchBox>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
import SelfTable from '@/components/base/SelfTable.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import ManagerDialog from './components/managerDialog.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import PitchBox from '@/components/PitchBox/index.vue'
import { getLabel } from '@/utils/index.ts'
import { DriverFollowUpToDown, GetDriverList } from '@/api/driver'
import { delayTime } from '@/settings.ts'
import { HandlePages, phoneReg } from '@/utils/index'
import { GetManagerLists, GetOpenCityData } from '@/api/common'
interface IState {
    [key: string]: any;
}
interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}

interface Tab {
  label:String,
  name:String,
  id:Number,
  num?:Number | undefined
}

@Component({
  name: 'DriverList',
  components: {
    SelfForm,
    SelfTable,
    SuggestContainer,
    ManagerDialog,
    TableHeader,
    PitchBox
  }
})
export default class extends Vue {
  private listLoading:boolean = false
  private tab:Tab[] = [
    {
      label: '全部',
      name: '',
      id: 0,
      num: 0
    },
    {
      label: '待跟进',
      name: '1',
      id: 1,
      num: 0
    },
    {
      label: '已跟进',
      name: '2',
      id: 2,
      num: 0
    },
    {
      label: '已成交',
      name: '3',
      id: 3,
      num: 0
    },
    {
      label: '已放弃',
      name: '4',
      id: 4,
      num: 0
    }
  ]
  private tags:any[] = []
  private type:string = ''

  private dropdownList:any[] = []
  private checkList:any[] =[]
  private listQuery:IState = {
    status: '',
    workCity: '',
    driverId: '',
    name: '',
    phone: '',
    busiType: '',
    gmId: '',
    sourceChannel: '',
    carrierStatus: '',
    time: []
  }

  private formItem:any[] = [
    {
      type: 2,
      key: 'workCity',
      label: '工作城市',
      tagAttrs: {
        placeholder: '请选择工作城市',
        filterable: true
      },
      options: []
    },
    {
      type: 1,
      key: 'driverId',
      label: '司机编号',
      tagAttrs: {
        placeholder: '请输入司机编号',
        maxlength: 32,
        clearable: true
      }
    },
    {
      type: 1,
      key: 'name',
      label: '姓名',
      tagAttrs: {
        placeholder: '请输入姓名',
        maxlength: 10,
        clearable: true
      }
    },
    {
      type: 1,
      key: 'phone',
      label: '手机号',
      tagAttrs: {
        placeholder: '请输入手机号',
        maxlength: 11,
        clearable: true
      }
    },
    {
      type: 2,
      key: 'busiType',
      label: '业务线',
      tagAttrs: {
        placeholder: '请选择业务线'
      },
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '专车',
          value: 0
        },
        {
          label: '共享',
          value: 1
        }
      ]
    },
    {
      type: 2,
      key: 'gmId',
      label: '加盟经理',
      tagAttrs: {
        placeholder: '请选择加盟经理'
      },
      options: []
    },
    {
      type: 2,
      key: 'sourceChannel',
      label: '司机来源',
      tagAttrs: {
        placeholder: '请选择司机来源'
      },
      options: [
        {
          label: '面试转换',
          value: 1
        },
        {
          label: '自动创建',
          value: 2
        }
      ]
    },
    {
      type: 4,
      key: 'carrierStatus',
      label: '是否存在',
      col: 12,
      options: [
        {
          label: '待上岗运力',
          value: 0
        },
        {
          label: '上岗运力',
          value: 1
        },
        {
          label: '停用运力',
          value: 2
        }
      ]
    },
    {
      type: 3,
      key: 'time',
      label: '创建时间',
      col: 12,
      tagAttrs: {
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker:any) {
              const end = new Date()
              const start = new Date()
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '昨天',
            onClick(picker:any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, start])
            }
          }, {
            text: '近7天',
            onClick(picker:any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '近30天',
            onClick(picker:any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }

    },
    {
      slot: true,
      col: 24,
      w: '0px',
      type: 'btn1'
    }
  ]

  private tableData:any[] = []

  private columns:any[] = [
    {
      key: 'driverId',
      label: '司机编号',
      width: '140px'
    },
    {
      key: 'name',
      label: '司机姓名'
    },
    {
      key: 'phone',
      label: '手机号',
      width: '120px'
    },
    {
      key: 'busiTypeName',
      label: '业务线'
    },
    {
      key: 'workCityName',
      label: '工作城市'
    },
    {
      key: 'statusName',
      label: '司机状态'
    },
    {
      key: 'sourceChannelName',
      label: '司机来源'
    },
    {
      key: 'createName',
      label: '创建人'
    },
    {
      key: 'createDate',
      label: '创建时间',
      slot: true,
      width: '180px'
    },
    {
      key: 'carrierCount',
      label: '运力数'
    },
    {
      key: 'gmName',
      label: '加盟经理'
    },
    {
      key: 'gmMobile',
      label: '加盟经理手机号',
      width: '120px'
    },
    {
      key: 'op',
      label: '操作',
      disabled: true,
      slot: true,
      fixed: 'right',
      width: this.isPC ? '100px' : '50px'
    }
  ]

  private operationList = [
    {
      icon: 'el-icon-finished',
      name: '查看选中',
      color: '#F2A33A'
    },
    {
      icon: 'el-icon-circle-close',
      name: '清空选择',
      color: '#5E7BBB'
    }
  ]

  /**
   *分页对象
   */
  private page:PageObj = {
    page: 1,
    limit: 20,
    total: 0
  }

  mounted() {
    this.dropdownList = [...this.columns]
    this.checkList = this.dropdownList.map(item => item.label)
    this.getList()
    this.getManagers()
    this.getOpenCitys()
  }

  /**
   *获取加盟经理列表
   */
  async getManagers() {
    try {
      let params = {
        uri: '/v1/driver/getDriverList'
      }
      let { data: res } = await GetManagerLists(params)
      if (res.success) {
        this.formItem[5].options = res.data.map(function(item:any) {
          return {
            label: item.name,
            value: item.id
          }
        })
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get manager fail:${err}`)
    }
  }

  /**
   *获取开通城市
   */
  async getOpenCitys() {
    try {
      let { data: res } = await GetOpenCityData()
      if (res.success) {
        this.formItem[0].options = res.data.map(function(item:any) {
          return {
            label: item.name,
            value: item.code
          }
        })
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get `)
    }
  }
  /**
   *获取列表
   */
  async getList() {
    try {
      if (this.listQuery.phone && !phoneReg.test(this.listQuery.phone)) {
        return this.$message.error('请输入正确的手机号')
      }
      this.listLoading = true
      let params:any = {
        limit: this.page.limit,
        page: this.page.page
      }

      this.listQuery.carrierStatus !== '' && (params.carrierStatus = +this.listQuery.carrierStatus)
      this.listQuery.status && (params.status = +this.listQuery.status)
      this.listQuery.workCity && (params.workCity = this.listQuery.workCity)
      this.listQuery.driverId && (params.driverId = this.listQuery.driverId)
      this.listQuery.name && (params.name = this.listQuery.name)
      this.listQuery.phone && (params.phone = this.listQuery.phone)
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)
      this.listQuery.sourceChannel && (params.sourceChannel = this.listQuery.sourceChannel)

      if (this.listQuery.time.length > 1) {
        params.startDate = this.listQuery.time[0]
        params.endDate = this.listQuery.time[1] + 86399999
      }
      let { data: res } = await GetDriverList(params)
      this.listLoading = false
      if (res.success) {
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
        this.tableData = res.data
        for (let i = 0; i < this.tab.length; i++) {
          let item:Tab = this.tab[i]
          if (item.name === '') {
            item.num = res.title.all
          } else {
            item.num = res.title[item.name as string]
          }
        }
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      this.listLoading = false
      console.log(`get lists fail:`, err)
    }
  }
  @Watch('checkList', { deep: true })
  private checkListChange(val:any) {
    this.columns = this.dropdownList.filter(item => val.includes(item.label))
  }
  /**
   * 查询
   */
  private handleQueryClick() {
    let blackLists = ['status']
    this.tags = []
    for (let key in this.listQuery) {
      if (this.listQuery[key] !== '' && (this.tags.findIndex(item => item.key === key) === -1) && !blackLists.includes(key)) {
        let name = getLabel(this.formItem, this.listQuery, key)
        if (name) {
          this.tags.push({
            type: 'info',
            name,
            key: key
          })
        }
      }
    }
    this.getList()
  }
  /**
   *重置
   */
  private handleResetClick() {
    this.listQuery = {
      status: '',
      workCity: '',
      driverId: '',
      name: '',
      phone: '',
      busiType: '',
      gmId: '',
      sourceChannel: '',
      up: true,
      quit: 1,
      time: [],
      carrierStatus: ''
    }
    this.tags = []
    this.getList()
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  /**
   * 修改加盟经理
   */
  handleModifyManager() {
    let rows = (this.$refs.driverListTable as any).multipleSelection || []
    if (rows.length === 0) {
      return this.$message.error('请选择司机')
    }
    this.type = 'modify'
    this.rows = rows;
    (this.$refs.driverListManager as any).openDialog()
  }

  /**
 * 分页
 */
  handlePageSize(page:any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }

  /**
   * 更多操作
   */
  handleCommandChange(key:string|number, row:any) {
    if (key === 'distribution') { // 分配
      this.type = 'distribution'
      this.rows = [row];
      (this.$refs.driverListManager as any).openDialog()
    } else if (key === 'follow') { // 跟进
      this.$router.push({
        path: '/transport/followDriver',
        query: {
          id: row.driverId
        }
      })
    } else if (key === 'giveup') { // 放弃
      this.handleGiveupClick(row.driverId)
    } else if (key === 'edit') { // 编辑
      this.$router.push({
        path: '/transport/editDriver',
        query: {
          id: row.driverId
        }
      })
    } else if (key === 'detail') { // 详情
      this.$router.push({
        path: '/transport/driverDetail',
        query: {
          id: row.driverId
        }
      })
    } else if (key === 'account') { // 账户
      this.$message.warning('该功能暂没开放')
    } else if (key === 'order') { // 创建订单
      this.$router.push({
        path: '/join/creatorder',
        query: {
          driverId: row.driverId
        }
      })
    } else if (key === 'transport') { // 创建运力
      this.$router.push({
        path: '/transport/creattransport',
        query: {
          id: row.driverId,
          name: row.name,
          phone: row.phone
        }
      })
    }
  }

  /**
   * 删除顶部表单的选项
   */
  handleQuery(value:any, key:any) {
    if (key === 'state') {
      this.listQuery.status = value
    } else if (key === 'time') {
      this.listQuery[key] = []
    } else {
      this.listQuery[key] = value
    }
    this.getList()
  }

  /**
   * 放弃操作
   */
  handleGiveupClick(driverId:string) {
    this.$confirm('点击确定后,该司机将从司机列表中移出?', '是否放弃跟进该司机', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    }).then(async() => {
      try {
        let params = {
          driverId
        }
        let { data: res } = await DriverFollowUpToDown(params)
        if (res.success) {
          this.$message.success('操作成功')
          setTimeout(() => {
            this.getList()
          }, delayTime)
        }
      } catch (err) {
        console.log(`give up fail:${err}`)
      }
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }

  // ------------下面区域是批量操作的功能,其他页面使用直接复制-------------
   private drawer:boolean = false
  /**
   *当前页勾选中的数组集合
   */
  private rows:any[] = []
  // 删除选中项目
  private deletDrawerList(item:any, i:any) {
    let arr:any[] = [item];
    (this.$refs.driverListTable as any).toggleRowSelection(arr)
    if (this.rows.length === 0) {
      this.drawer = false
    }
  }
  // 关闭查看已选
  private changeDrawer(val: any) {
    this.drawer = val
  }

  /**
   * 批量操作的按钮
   */
  handleOlClick(val:any) {
    if (val.name === '查看选中') {
      if (this.rows.length > 0) {
        this.drawer = true
      } else {
        this.$message.error('请先选择')
      }
    } else if (val.name === '清空选择') {
      (this.$refs.driverListTable as any).toggleRowSelection()
    }
  }
  /**
   * 勾选表格
   */
  handleChange(row:any) {
    this.rows = row
  }
  // ------------上面区域是批量操作的功能,其他页面使用直接复制-------------
  /**
     *刷新表格
     */
  handleGetList() {
    this.page.page = 1
    setTimeout(() => {
      this.getList()
    }, delayTime)
  }
}

</script>
<style lang="scss" scoped>
  .DriverList {
    .btnPc {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      width: 100%;
    }
    .mobile {
      width:100%;
      text-align: center;
    }
    .btnMobile {
       margin-left: 0;
       margin-top: 10px;
       width:80%;
    }
  }
</style>

<style scoped>
  .DriverList >>> .el-form-item__label {
    color:#999;
  }
  @media screen and (min-width: 700px) {
    .DriverList >>> .el-collapse-item__wrap {
      position: absolute;
      z-index: 1000;
      background: #fff;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.85);
      right: 15px;
      left: 15px;
    }
    .DriverList >>> .el-collapse-item__content {
      padding-bottom: 0px;
    }
  }

</style>

<style>
  @media screen and (max-width:700px) {
    .el-message-box__wrapper {
      top:0!important;
      left:5%!important;
      right:5%!important;
    }
    .el-message-box {
      width:100%;
    }
  }

</style>
