<template>
  <div :class="isPC ? 'TransportList' : 'TransportList-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.status"
      @handle-query="handleQuery"
    >
      <!-- 查询表单 -->
      <self-form
        :list-query="listQuery"
        :form-item="formItem"
        label-width="100px"
      >
        <div
          slot="btn1"
          :class="isPC ? 'btnPc' : 'btnPc-m'"
        >
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            name="transportList_reset_btn"
            size="small"
            @click="handleResetClick"
          >
            重置
          </el-button>
          <el-button
            type="primary"
            :class="isPC ? '' : 'btnMobile'"
            name="transportList_query_btn"
            size="small"
            @click="handleQueryClick"
          >
            筛选
          </el-button>
        </div>
      </self-form>
    </SuggestContainer>

    <div class="table_box">
      <!--操作栏-->
      <TableHeader
        :tab="tab"
        :active-name="listQuery.status"
      >
        <el-button
          v-permission="['/v1/carrier/saveCarrierInfo']"
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          type="primary"
          size="small"
          name="Transport_btn_creat"
          @click="creatTransport"
        >
          <i
            class="el-icon-plus"
          />
          <span v-if="isPC">创建运力</span>
        </el-button>

        <el-dropdown
          :hide-on-click="false"
          trigger="click"
        >
          <el-button
            :class="isPC ? 'btn-item-filtrate' : 'btn-item-filtrate-m'"
            type="primary"
            size="small"
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

        <el-button
          v-permission="['/v1/carrier/updateGmId']"
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          type="primary"
          size="small"
          name="Transport_btn_change"
          @click="handleModifyManager"
        >
          <i
            class="el-icon-edit"
          />
          <span v-if="isPC">修改运营经理</span>
        </el-button>
      </tableheader>

      <!--table表单-->
      <self-table
        ref="transportList"
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
          {{ scope.row.createDate | Timestamp }}
        </template>
        <template v-slot:op="scope">
          <el-dropdown
            :trigger="isPC ? 'hover' : 'click'"
            @command="(e) => handleCommandChange(e,scope.row)"
          >
            <span class="el-dropdown-link">
              <el-button
                v-if="isPC"
                :a="scope"
                type="text"
                size="mini"
              >
                更多操作<i
                  v-if="isPC"
                  class="el-icon-arrow-down el-icon--right"
                />
              </el-button>
              <i
                v-else
                class="el-icon-setting"
              />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-permission="['/v1/carrier/saveCarrierInfo']"
                command="editor"
              >
                <template>
                  编辑
                </template>
              </el-dropdown-item>
              <el-dropdown-item
                v-permission="['/v1/carrier/getCarrierInfoByCarrierId']"
                command="detail"
              >
                <template>
                  详情
                </template>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="[0,1].includes(scope.row.status)"
                v-permission="['/v1/carrier/updateCarrierStatus']"
                command="stop"
              >
                <template>
                  停用
                </template>
              </el-dropdown-item>
              <!-- <el-dropdown-item
                command="gowork"
              >
                <template>
                  上岗
                </template>
              </el-dropdown-item> -->
              <el-dropdown-item
                v-if="[2].includes(scope.row.status) && scope.row.isRefund === 0"
                v-permission="['/v1/carrier/updateCarrierStatus']"
                command="alive"
              >
                <template>
                  激活
                </template>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </self-table>
    </div>
    <PitchBox
      :drawer.sync="drawer"
      :drawer-list="rows"
      @deletDrawerList="deletDrawerList"
      @changeDrawer="changeDrawer"
    >
      <template slot-scope="slotProp">
        <span>{{ slotProp.item.name }}</span>
        <span>{{ slotProp.item.phone }}</span>
      </template>
    </PitchBox>

    <!-- 修改运营经理 -->
    <manager-dialog
      ref="transportDia"
      :rows="rows"
      :type="type"
      :options="managerArr"
      @onRows="rows = []"
      @changeSuccess="getList(listQuery)"
    />

    <!-- 上岗 -->
    <work-dialog
      ref="workDia"
      :rows="rowItem"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { CargoListData } from '@/api/types'
import PitchBox from '@/components/PitchBox/index.vue'
import { HandlePages, phoneReg } from '@/utils/index'
import SelfTable from '@/components/Base/SelfTable.vue'
import Pagination from '@/components/Pagination/index.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { TransportListForm } from '../components'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'
import { GetDictionaryList, GetOpenCityData, GetManagerLists } from '@/api/common'
import { updateCarrierStatus, getCarrierInfoList } from '@/api/transport'
import { getLabel } from '@/utils/index.ts'
import SelfForm from '@/components/Base/SelfForm.vue'
import ManagerDialog from './components/ManagerDialog.vue'
import WorkDialog from './components/WorkDialog.vue'
import { delayTime } from '@/settings'

interface IState {
  [key: string]: any;
}
interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}

  @Component({
    name: 'TransportList',
    components: {
      Pagination,
      SuggestContainer,
      TableHeader,
      TransportListForm,
      SelfForm,
      SelfTable,
      PitchBox,
      ManagerDialog,
      WorkDialog
    }
  })

export default class extends Vue {
    private IntentionalCompartment:any[] = []
    private type:string = ''
    private title:any = {}
    private managerArr:any[] = []
    private list: CargoListData[] = []
    private dropdownList:any[] = []
    private checkList:any[] =[]
    private listLoading = false
    private tags: any[] = []
    private rowItem:any = {}
    private tab: any[] = [
      {
        label: '全部',
        name: 'all',
        num: '0',
        id: 10
      },
      {
        label: '待上岗',
        name: '0',
        num: '0',
        id: 11
      },
      {
        label: '上岗',
        name: '1',
        num: '0',
        id: 12
      },
      {
        label: '停用',
        name: '2',
        num: '0',
        id: 13
      }
    ]
    private columns:any[] = [
      {
        key: 'carrierId',
        label: '运力编号'
      },
      {
        key: 'name',
        label: '运力姓名',
        disabled: true
      },
      {
        key: 'phone',
        label: '运力手机号'
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
        key: 'carTypeName',
        label: '车型'
      },
      {
        key: 'plateNo',
        label: '车牌号'
      },
      {
        key: 'statusName',
        label: '运力状态'
      },
      {
        key: 'driverName',
        label: '所属司机'
      },
      {
        key: 'driverPhone',
        label: '所属司机手机号'
      },
      {
        key: 'gmName',
        label: '运营经理'
      },
      {
        key: 'gmPhone',
        label: '运营经理手机号'
      },
      {
        key: 'createName',
        label: '创建人',
        disabled: true
      },
      {
        key: 'createDate',
        label: '创建时间',
        slot: true
      },
      {
        key: 'op',
        label: '操作',
        width: this.isPC ? '100px' : '50px',
        fixed: 'right',
        disabled: true,
        slot: true
      }
    ]
    private tableData:any[] = []
    /**
     *分页对象
    */
    private page:PageObj = {
      page: 1,
      limit: 20,
      total: 0
    }
    private listQuery:IState = {
      gmId: '',
      status: 'all',
      workCity: null,
      carrierId: null,
      name: null,
      phone: null,
      carType: null,
      busiType: null,
      // gmGroup: null,
      // gmId: null,
      dirverName: null,
      driverPhone: null,
      createDate: [],
      startDate: '',
      endDate: ''
    }

    private formItem:any[] = [
      {
        type: 2,
        key: 'workCity',
        label: '工作城市',
        tagAttrs: {
          placeholder: '请选择工作城市'
        },
        options: []
      },
      {
        type: 1,
        key: 'carrierId',
        label: '运力编号',
        tagAttrs: {
          placeholder: '请输入司机编号'
        }
      },
      {
        type: 1,
        key: 'name',
        label: '运力姓名',
        tagAttrs: {
          placeholder: '请输入姓名'
        }
      },
      {
        type: 1,
        key: 'phone',
        label: '运力手机号',
        tagAttrs: {
          placeholder: '请输入手机号',
          type: ''
        }
      },
      {
        type: 2,
        key: 'carType',
        label: '车型',
        tagAttrs: {
          placeholder: '请选择车型'
        },
        options: []
      },
      {
        type: 2,
        key: 'busiType',
        label: '业务线',
        tagAttrs: {
          placeholder: '业务线'
        },
        options: [
          {
            label: '梧桐专车',
            value: '0'
          },
          {
            label: '梧桐共享',
            value: '1'
          }
        ]
      },
      // {
      //   type: 2,
      //   key: 'gmGroup',
      //   label: '运营小组',
      //   tagAttrs: {
      //     placeholder: '请选择运营小组'
      //   },
      //   options: []
      // },
      {
        type: 2,
        key: 'gmId',
        label: '运营经理',
        tagAttrs: {
          placeholder: '请选择运营经理'
        },
        options: []
      },
      {
        type: 1,
        key: 'driverName',
        label: '所属司机姓名',
        w: '130px',
        tagAttrs: {
          placeholder: '请输入所属司机姓名'
        }
      },
      {
        type: 1,
        key: 'driverPhone',
        label: '所属司机手机号',
        w: '130px',
        tagAttrs: {
          placeholder: '请输入所属司机手机号'
        }
      },
      {
        type: 3,
        key: 'createDate',
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

    /**
   * 查询
   */
    private handleQueryClick() {
      this.tags = []
      let blackLists = ['status']
      for (let key in this.listQuery) {
        if (this.listQuery[key] && (this.tags.findIndex(item => item.key === key) === -1) && !blackLists.includes(key)) {
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
      this.getList(this.listQuery)
    }
    /**
   *重置
   */
    private handleResetClick() {
      this.tags = []
      this.listQuery = {
        gmId: '',
        limit: '10',
        page: '1',
        status: null,
        workCity: null,
        carrierId: null,
        name: null,
        phone: null,
        carType: null,
        busiType: null,
        // gmGroup: null,
        // gmId: null,
        dirverName: null,
        driverPhone: null,
        createDate: [],
        startDate: '',
        endDate: ''
      }
      this.getList(this.listQuery)
    }

    private gmConfirm(done: any) {
      this.$message.info('点击了确定')
      done()
    }
    private gmCancel(done: any) {
      this.$message.info('点击了取消')
      done()
    }

    /**
   * 修改加盟经理
   */
    handleModifyManager() {
      let rows = (this.$refs.transportList as any).multipleSelection || []
      if (rows.length === 0) {
        return this.$message.error('请选择司机')
      }
      this.type = 'modify'
      this.rows = rows;
      (this.$refs.transportDia as any).openDialog()
    }

    /**
   * 放弃操作
   */
    handleGiveupClick() {
      this.$confirm('点击确定后,该司机将从司机列表中移出?', '是否放弃跟进该司机', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

    private operationList: any[] = [
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
    ];

    private creatTransport() {
      this.$router.push('creattransport')
    }

    created() {
      this.fetchData()
    }

    mounted() {
      this.dropdownList = [...this.columns]
      this.checkList = this.dropdownList.map(item => item.label)
    }
    @Watch('checkList', { deep: true })
    private checkListChange(val:any) {
      this.columns = this.dropdownList.filter(item => val.includes(item.label))
    }

    activated() {
      // this.handleScroll()
    }

    // 判断是否是PC
    get isPC() {
      return SettingsModule.isPC
    }

    // 所有请求方法
    private fetchData() {
      this.getList(this.listQuery)
      this.dicList()
    }

    private async dicList() {
      let params = ['Intentional_compartment']
      let { data } = await GetDictionaryList(params)
      if (data.success) {
        // eslint-disable-next-line camelcase
        let { Intentional_compartment } = data.data
        let cartype = Intentional_compartment.map(function(ele:any) {
          return { value: Number(ele.dictValue), label: ele.dictLabel }
        })
        // eslint-disable-next-line camelcase
        this.IntentionalCompartment = cartype
        this.formItem.map(ele => {
          if (ele.key === 'carType') {
            ele.options = cartype
          }
        })
      } else {
        this.$message.error(data)
      }
      let city = await GetOpenCityData()
      if (city.data.success) {
        let arr = city.data.data.map(function(ele:any) {
          return { value: ele.code, label: ele.name }
        })
        this.formItem.map(ele => {
          if (ele.key === 'workCity') {
            ele.options = arr
          }
        })
      } else {
        this.$message.error(data)
      }
      let paramurl:any = {
        uri: '/v1/order/getCarrierInfoList'
      }
      let manager = await GetManagerLists(paramurl)
      if (manager.data.success) {
        let arr = manager.data.data.map(function(ele:any) {
          return { value: Number(ele.id), label: ele.name }
        })
        this.managerArr = arr
        this.formItem.map(ele => {
          if (ele.key === 'gmId') {
            ele.options = arr
          }
        })
      } else {
        this.$message.error(data)
      }
    }

    private async updateCarrier(params:any, type:string) {
      let { data } = await updateCarrierStatus(params)
      if (data.success) {
        if (type === '停用') {
          if (data.data.flag) {
            this.$message({
              type: 'success',
              message: '运力停用成功!'
            })
            setTimeout(() => {
              this.getList(this.listQuery)
            }, delayTime)
          } else {
            this.$message.error(data.data.msg)
          }
        } else {
          if (data.data.flag) {
            this.$message({
              type: 'success',
              message: '激活成功!'
            })
            setTimeout(() => {
              this.getList(this.listQuery)
            }, delayTime)
          } else {
            this.$message.error(data.data.msg)
          }
        }
      } else {
        this.$message.error(data)
      }
    }

    private stopTransport(row:any) {
      this.$confirm('是否停用', '停用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          'carrierId': row.carrierId,
          'carrierStatus': 2
        }
        this.updateCarrier(params, '停用')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }

    private aliveTransport(row:any) {
      this.$confirm('是否激活', '激活', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          'carrierId': row.carrierId,
          'carrierStatus': 0
        }
        this.updateCarrier(params, '激活')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }

    /**
   * 更多操作
   */
    handleCommandChange(key:string|number, row:any) {
      let id = row.carrierId
      switch (key) {
        case 'gowork':
          this.rowItem = row
          // (this.$refs.workDia as any).openDialog()
          break
        case 'alive':
          this.aliveTransport(row)
          break
        case 'stop':
          this.stopTransport(row)
          break
        case 'editor':
          this.$router.push({ path: 'editortransport', query: { carrierId: id } })
          break
        case 'detail':
          this.$router.push({ path: 'transportdetail', query: { carrierId: id } })
          break
        default:
          break
      }
    }
    /**
 * 分页
 */
    handlePageSize(page:any) {
      this.page.page = page.page
      this.page.limit = page.limit
      this.getList(this.listQuery)
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
    (this.$refs.transportList as any).toggleRowSelection(arr)
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
      (this.$refs.transportList as any).toggleRowSelection()
    }
  }
  /**
   * 勾选表格
   */
  handleChange(row:any) {
    this.rows = row
  }
  // ------------上面区域是批量操作的功能,其他页面使用直接复制-------------

  // 处理tags方法
  private handleTags(value:any) {
    this.tags = value
  }

  // tab切换
  handleQuery(value:any, key:any) {
    console.log(value, key, 455)
    if (key === 'time') {
      this.listQuery[key] = null
    } else if (key === 'state') {
      this.listQuery.status = value
    } else {
      this.listQuery[key] = value
    }

    this.getList(this.listQuery)
  }

  // 请求列表
  private async getList(value: any) {
    if (this.listQuery.phone && !phoneReg.test(this.listQuery.phone)) {
      return this.$message.error('请输入正确的手机号')
    }
    if (this.listQuery.driverPhone && !phoneReg.test(this.listQuery.driverPhone)) {
      return this.$message.error('请输入正确的手机号')
    }

    this.listQuery.page = this.page.page
    this.listQuery.limit = this.page.limit
    this.listQuery.startDate = this.listQuery.createDate[0]
    this.listQuery.endDate = this.listQuery.createDate[1] + 86399999
    this.listLoading = true
    let params = { ...this.listQuery }
    if (params.status === 'all') {
      delete params.status
    }
    const { data } = await getCarrierInfoList(params)
    if (data.success) {
      this.tableData = data.data
      this.title = data.title
      data.page = await HandlePages(data.page)
      this.page.total = data.page.total
      this.tab.map(ele => {
        switch (ele.label) {
          case '全部':
            ele.num = this.title.all
            break
          case '上岗':
            ele.num = this.title['1']
            break
          case '待上岗':
            ele.num = this.title['0']
            break
          case '停用':
            ele.num = this.title['2']
            break
          default:
            break
        }
      })
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    } else {
      this.$message.error(data)
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    }
  }

  // 按钮操作
  private goDetail(id: string | (string | null)[] | null | undefined) {
    this.$router.push({ path: 'transportdetail', query: { id: id } })
  }
}
</script>

<style lang="scss" scoped>
  .TransportList{
    padding-bottom: 0;
    box-sizing: border-box;
    padding: 15px;
    .btnPc {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      width: 100%;
    }
    .btn-item{
      background: #649CEE;
      border-radius: 4px;
      border: none;
      margin:0 10px;
    }
    .btn-item-filtrate{
      background: #FFA000;
      border-radius: 4px;
      border: none;
    }
    .table_box{
      height: calc(100vh - 225px) !important;
      background: #FFFFFF;
      // border: 1px solid #dfe6ec;
      box-shadow: 4px 4px 10px 0 rgba(218,218,218,0.50);
      overflow: hidden;
      .table_center{
        height: calc(100vh - 360px) !important;
        padding:0px;
        padding-bottom: 0;
        box-sizing: border-box;
        background: #FFFFFF;
        overflow-y: scroll;
      }
    }
    .edit-input {
      padding-right: 100px;
    }
    .cancel-btn {
      position: absolute;
      right: 15px;
      top: 10px;
    }
    .pagination-container{
      background: #fff;
    }
  }

</style>

<style lang="scss" scoped>
  .TransportList-m{
    padding-bottom: 0;
    box-sizing: border-box;
    .btn-item-m{
      background: #649CEE;
      border-radius: 4px;
      border-radius: 4px;
      border: none;
      margin:0 10px;
    }
    .btnPc-m {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .btnMobile {
      margin-left: 0;
      margin-top: 10px;
      width:80%;
    }
    .btn-item-filtrate-m{
      background: #FFA000;
      border-radius: 4px;
      border-radius: 4px;
      border: none;
    }
    .table_box{
      height: calc(100vh - 183px) !important;
      background: #FFFFFF;
      // border: 1px solid #dfe6ec;
      box-shadow: 4px 4px 10px 0 rgba(218,218,218,0.50);
      overflow: hidden;
      .table_center{
        height: calc(100vh - 340px) !important;
        padding-bottom: 0;
        box-sizing: border-box;
        background: #FFFFFF;
        overflow-y: scroll;
      }
    }
    .edit-input {
      padding-right: 100px;
    }
    .cancel-btn {
      position: absolute;
      right: 15px;
      top: 10px;
    }
    .pagination-container{
      background: #f8f9fa;
    }
  }

</style>

<style lang="scss" scope>
.el-collapse-item__content{
    padding-bottom:0;
}

.el-form-item__label{
  color: #999999;
}
</style>
<style scoped>
  .TransportList >>> .el-collapse-item__wrap {
    position: absolute;
    z-index: 1000;
    background: #fff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.85);
    right: 15px;
    left: 15px;
  }
</style>
