<template>
  <div class="DriverList">
    <el-card>
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
            :class="isPC ? 'btnPc' : ''"
          >
            <el-button
              type="primary"
              :class="isPC ? '' : 'btnMobile'"
              name="driverlist_query_btn"
              size="small"
              @click="handleQueryClick"
            >
              查询
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
            type="primary"
            size="small"
            style="margin-left:10px"
            name="driverclue_column_btn"
          >
            <i
              class="el-icon-s-operation"
            />
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
        border
        row-key="a"
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
          <el-dropdown @command="(e) => handleCommandChange(e,scope.row)">
            <span class="el-dropdown-link">
              <el-button
                v-if="isPC"
                :a="scope"
                type="text"
              >
                更多操作
              </el-button>
              <i
                v-else
                class="el-icon-setting"
              />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="[4].includes(scope.row.status)"
                command="distribution"
              >
                <template v-if="isPC">
                  分配
                </template>
                <i
                  v-else
                  class="el-icon-edit"
                />
              </el-dropdown-item>
              <el-dropdown-item
                v-if="[1,2,3].includes(scope.row.status)"
                command="follow"
              >
                <template v-if="isPC">
                  跟进
                </template>
                <i
                  v-else
                  class="el-icon-edit"
                />
              </el-dropdown-item>
              <el-dropdown-item
                v-if="[2].includes(scope.row.status)"
                command="giveup"
              >
                <template v-if="isPC">
                  放弃
                </template>
                <i
                  v-else
                  class="el-icon-edit"
                />
              </el-dropdown-item>
              <el-dropdown-item
                v-if="[1,2,3,4].includes(scope.row.status)"
                command="edit"
              >
                <template v-if="isPC">
                  编辑
                </template>
                <i
                  v-else
                  class="el-icon-edit"
                />
              </el-dropdown-item>
              <el-dropdown-item
                v-if="[1,2,3,4].includes(scope.row.status)"
                command="detail"
              >
                <template v-if="isPC">
                  详情
                </template>
                <i
                  v-else
                  class="el-icon-chat-dot-square"
                />
              </el-dropdown-item>
              <el-dropdown-item
                v-if="[3].includes(scope.row.status)"
                command="account"
              >
                <template v-if="isPC">
                  账户
                </template>
                <i
                  v-else
                  class="el-icon-edit"
                />
              </el-dropdown-item>
              <el-dropdown-item
                v-if="[1,2,3].includes(scope.row.status)"
                command="order"
              >
                <template v-if="isPC">
                  创建订单
                </template>
                <i
                  v-else
                  class="el-icon-edit"
                />
              </el-dropdown-item>
              <el-dropdown-item
                v-if="[3].includes(scope.row.status)"
                command="transport"
              >
                <template v-if="isPC">
                  创建运力
                </template>
                <i
                  v-else
                  class="el-icon-edit"
                />
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
    </el-card>

    <PitchBox
      :drawer.sync="drawer"
      :drawer-list="rows"
      @deletDrawerList="deletDrawerList"
      @changeDrawer="changeDrawer"
    >
      <template slot-scope="slotProp">
        <span>{{ slotProp.item.a }}</span>
        <span>{{ slotProp.item.b }}</span>
        <span>{{ slotProp.item.c }}</span>
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
import { HandlePages } from '@/utils/index'
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
    gmTeam: '',
    gmId: '',
    sourceChannel: '',
    up: true,
    quit: 1,
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
        placeholder: '请输入司机编号'
      }
    },
    {
      type: 1,
      key: 'name',
      label: '姓名',
      tagAttrs: {
        placeholder: '请输入姓名'
      }
    },
    {
      type: 1,
      key: 'phone',
      label: '手机号',
      tagAttrs: {
        placeholder: '请输入手机号'
      }
    },
    {
      type: 2,
      key: 'busiType',
      label: '业绩线',
      tagAttrs: {
        placeholder: '请选择业绩线'
      },
      options: [
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
      key: 'gmTeam',
      label: '加盟小组',
      tagAttrs: {
        placeholder: '请选择加盟小组'
      },
      options: []
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
      key: 'up',
      label: '是否有待上岗运力',
      w: '130px',
      options: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ]
    },
    {
      type: 4,
      key: 'quit',
      w: '130px',
      label: '是否有已退出运力',
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
      label: '司机编号'
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
      fixed: 'right',
      disabled: true,
      slot: true
    }
  ]

  private operationList = [
    {
      icon: 'el-icon-view',
      name: '查看选中',
      color: '#673BB8'
    },
    {
      icon: 'el-icon-circle-close',
      name: '清空选择',
      color: '#F54436'
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
      let { data: res } = await GetManagerLists()
      if (res.success) {
        this.formItem[6].options = res.data.map(function(item:any) {
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
      this.listLoading = true
      let params:any = {
        limit: this.page.limit,
        page: this.page.page
        // carrierStatus: ''
      }
      this.listQuery.status && (params.status = +this.listQuery.status)
      this.listQuery.workCity && (params.workCity = this.listQuery.workCity)
      this.listQuery.driverId && (params.driverId = this.listQuery.driverId)
      this.listQuery.name && (params.name = this.listQuery.name)
      this.listQuery.phone && (params.phone = this.listQuery.phone)
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.gmTeam !== '' && (params.gmTeam = this.listQuery.gmTeam)
      this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)
      this.listQuery.sourceChannel && (params.sourceChannel = this.listQuery.sourceChannel)

      if (this.listQuery.time.length > 1) {
        params.startDate = this.listQuery.time[0]
        params.endDate = this.listQuery.time[1]
      }
      let { data: res } = await GetDriverList(params)
      this.listLoading = false
      if (res.success) {
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
        this.tableData = res.data
        for (let i = 0; i < this.tab.length; i++) {
          let item = this.tab[i]
          if (item.name === this.listQuery.status) {
            item.num = res.title.all
          } else {
            item.num = 0
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
    let blackLists = ['state']
    for (let key in this.listQuery) {
      if (this.listQuery[key] !== '' && (this.tags.findIndex(item => item.key === key) === -1) && !blackLists.includes(key)) {
        let name = getLabel(this.formItem, this.listQuery, key)
        console.log(name, key)
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
      gmTeam: '',
      gmId: '',
      sourceChannel: '',
      up: true,
      quit: 1,
      time: []
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

    } else if (key === 'order') { // 创建订单

    } else if (key === 'transport') { // 创建运力

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
    padding: 20px;
    .btnPc {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      width: 100%;
    }
    .btnMobile {
      margin-left: 0;
      margin-top: 10px;
      width:100%;
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
