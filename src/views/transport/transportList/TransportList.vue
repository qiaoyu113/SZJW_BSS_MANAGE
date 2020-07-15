<template>
  <div :class="isPC ? 'TransportList' : 'TransportList-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
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
          :class="isPC ? 'btnPc' : ''"
        >
          <el-button
            type="primary"
            :class="isPC ? '' : 'btnMobile'"
            name="transportList_query_btn"
            size="small"
            @click="handleQueryClick"
          >
            查询
          </el-button>
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            name="transportList_reset_btn"
            size="small"
            @click="handleResetClick"
          >
            重置
          </el-button>
        </div>
      </self-form>
    </SuggestContainer>

    <div class="table_box">
      <!--操作栏-->
      <TableHeader
        :tab="tab"
        :active-name="listQuery.state"
      >
        <el-button
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          type="primary"
          size="small"
          name="Transport_btn_creat"
          @click="creatTransport"
        >
          创建运力
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
            筛选
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
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          type="primary"
          size="small"
          name="Transport_btn_change"
          @click="handleModifyManager"
        >
          修改运营经理
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
                command="editor"
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
                command="detail"
              >
                <template v-if="isPC">
                  详情
                </template>
                <i
                  v-else
                  class="el-icon-edit"
                />
              </el-dropdown-item>
              <el-dropdown-item
                command="stop"
              >
                <template v-if="isPC">
                  停用
                </template>
                <i
                  v-else
                  class="el-icon-chat-dot-square"
                />
              </el-dropdown-item>
              <el-dropdown-item
                command="gowork"
              >
                <template v-if="isPC">
                  上岗
                </template>
                <i
                  v-else
                  class="el-icon-edit"
                />
              </el-dropdown-item>
              <el-dropdown-item
                command="alive"
              >
                <template v-if="isPC">
                  激活
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
      @onRows="rows = []"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { GetCustomerList } from '@/api/customer'
import { CargoListData } from '@/api/types'
import PitchBox from '@/components/PitchBox/index.vue'
import { HandlePages } from '@/utils/index'
import SelfTable from '@/components/base/SelfTable.vue'
import Pagination from '@/components/Pagination/index.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { TransportListForm } from '../components'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'
import { getLabel } from '@/utils/index.ts'
import SelfForm from '@/components/base/SelfForm.vue'
import ManagerDialog from './components/managerDialog.vue'

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
      ManagerDialog
    }
  })

export default class extends Vue {
    private type:string = ''
    private total = 0
    private list: CargoListData[] = []
    private dropdownList:any[] = []
    private checkList:any[] =[]
    private listLoading = false
    private tags: any[] = []
    private tab: any[] = [
      {
        label: '全部',
        name: '0'
      },
      {
        label: '待上岗',
        name: '1'
      },
      {
        label: '上岗',
        name: '2'
      },
      {
        label: '停用',
        name: '3'
      }
    ]
    private columns:any[] = [
      {
        key: 'carrierId',
        label: '运力编号'
      },
      {
        key: 'name',
        label: '运力姓名'
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
        key: 'driverId',
        label: '所属司机'
      },
      {
        key: 'driverPhone',
        label: '所属司机手机号'
      },
      {
        key: 'gmIdName',
        label: '运营经理'
      },
      {
        key: 'gmPhone',
        label: '运营经理手机号'
      },
      {
        key: 'createName',
        label: '创建人'
      },
      {
        key: 'createDate',
        label: '创建时间'
      },
      {
        key: 'op',
        label: '操作',
        fixed: 'right',
        disabled: true,
        slot: true
      }
    ]
    private tableData:any[] = [
      {
        carrierId: '121313123131',
        name: 'tom',
        phone: '15021578502',
        busiTypeName: '共享',
        workCityName: '北京市',
        statusName: '待跟进',
        driverId: '面试转化',
        driverPhone: '王利',
        gmIdName: Date.now(),
        gmPhone: 5,
        createName: '王利',
        createDate: '15021578502'
      },
      {
        carrierId: '121313123131',
        name: 'tom',
        phone: '15021578502',
        busiTypeName: '共享',
        workCityName: '北京市',
        statusName: '待跟进',
        driverId: '面试转化',
        driverPhone: '王利',
        gmIdName: Date.now(),
        gmPhone: 5,
        createName: '王利',
        createDate: '15021578502'
      }
    ]
    /**
     *分页对象
    */
    private page:PageObj = {
      page: 1,
      limit: 20,
      total: 100
    }
    private listQuery:IState = {
      state: 'all',
      workCityName: '',
      carrierId: '',
      name: '',
      phone: '',
      carTypeName: '',
      busiTypeName: '',
      gmGroup: '',
      gmIdName: '',
      dirverName: '',
      driverPhone: '',
      createDate: []
    }

    private formItem:any[] = [
      {
        type: 2,
        key: 'workCityName',
        label: '工作城市',
        tagAttrs: {
          placeholder: '请选择工作城市'
        }
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
          placeholder: '请输入手机号'
        }
      },
      {
        type: 2,
        key: 'carTypeName',
        label: '车型',
        tagAttrs: {
          placeholder: '请选择业绩线'
        },
        options: [
          {
            label: '专车',
            value: 'car1'
          },
          {
            label: '共享',
            value: 'share1'
          }
        ]
      },
      {
        type: 2,
        key: 'busiTypeName',
        label: '业务线',
        tagAttrs: {
          placeholder: '请选择加盟小组'
        },
        options: [
          {
            label: '专车',
            value: 'car2'
          },
          {
            label: '共享',
            value: 'share2'
          }
        ]
      },
      {
        type: 2,
        key: 'gmGroup',
        label: '运营小组',
        tagAttrs: {
          placeholder: '请选择运营小组'
        },
        options: [
          {
            label: '专车',
            value: 'car3'
          },
          {
            label: '共享',
            value: 'share3'
          }
        ]
      },
      {
        type: 2,
        key: 'gmIdName',
        label: '运营经理',
        tagAttrs: {
          placeholder: '请选择运营经理'
        }
      },
      {
        type: 1,
        key: 'dirverName',
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
      let blackLists = ['state']
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
    }
    /**
   *重置
   */
    private handleResetClick() {
      this.tags = []
      this.listQuery = {
        workCityName: '',
        carrierId: '',
        name: '',
        phone: '',
        carTypeName: '',
        busiTypeName: '',
        gmGroup: '',
        gmIdName: '',
        dirverName: '',
        driverPhone: '',
        createDate: []
      }
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
        icon: 'el-icon-view',
        name: '查看选中',
        color: '#673BB8'
      },
      {
        icon: 'el-icon-circle-close',
        name: '清空选择',
        color: '#F54436'
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
      // this.getList(this.listQuery)
    }

    private stopTransport() {
      this.$confirm('是否解绑标书', '停用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.error('请先解绑标书，才能停用该运力')
        // this.$message({
        //   type: 'success',
        //   message: '运力停用成功!'
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }

    private aliveTransport() {
      this.$confirm('该运力选中的订单状态是否为：已退款', '激活', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.error('该运力选中的订单已退款，不可激活')
        // this.$message({
        //   type: 'success',
        //   message: '激活成功!'
        // })
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
      console.log(key)
      // this.id = row.clientPhone
      switch (key) {
        case 'gowork':

          break
        case 'alive':
          this.aliveTransport()
          break
        case 'stop':
          this.stopTransport()
          break
        case 'editor':
          this.$router.push({ path: 'editortransport', query: { driverId: 'SJ202007131003', orderId: 'DD202007131004' } })
          break
        case 'detail':
          this.$router.push({ path: 'transportdetail', query: { id: row.clientPhone } })
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
      // this.fetchData()
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

  /**
   * 删除顶部表单的选项
   */
  handleQuery(value:any, key:any) {
    if (key === 'time') {
      this.listQuery[key] = []
    } else {
      this.listQuery[key] = value
    }
  }

  // 请求列表
  private async getList(value: any) {
    this.listQuery.page = value.page
    this.listQuery.limit = value.limit
    this.listLoading = true
    const { data } = await GetCustomerList(this.listQuery)
    if (data.success) {
      this.list = data.data
      data.page = await HandlePages(data.page)
      this.total = data.page.total
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
    .btnMobile {
      margin-left: 0;
      margin-top: 10px;
      width:100%;
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
        padding:30px;
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
        height: calc(100vh - 300px) !important;
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
