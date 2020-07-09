<template>
  <div class="DriverList">
    <el-card>
      <suggest-container
        :tab="tab"
        :tags="tags"
        :active-name="listQuery.state"
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
        :table-data="tableData"
        :columns="columns"
        :page="page"
        @onPageSize="handlePageSize"
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
        @onRows="rows = []"
      />
    </el-card>
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
    TableHeader
  }
})
export default class extends Vue {
  private listLoading:boolean = false
  private tab:Tab[] = [
    {
      label: '全部',
      name: 'all',
      id: 0,
      num: 187
    },
    {
      label: '待跟进',
      name: 'tab1',
      id: 1,
      num: 5
    },
    {
      label: '已跟进',
      name: 'tab2',
      id: 2,
      num: 1
    },
    {
      label: '已成交',
      name: 'tab3',
      id: 3,
      num: 1
    },
    {
      label: '已放弃',
      name: 'tab4',
      id: 4,
      num: 1
    }
  ]
  private tags:any[] = []
  private type:string = ''
  private rows:any[] = []

  private dropdownList:any[] = []
  private checkList:any[] =[]
  private listQuery:IState = {
    state: 'all',
    city: '',
    code: '',
    name: '',
    phone: '',
    line: '',
    group: '',
    manager: '',
    resource: '',
    up: true,
    quit: 1,
    time: []
  }

  private formItem:any[] = [
    {
      type: 2,
      key: 'city',
      label: '工作城市',
      tagAttrs: {
        placeholder: '请选择工作城市'
      }
    },
    {
      type: 1,
      key: 'code',
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
      key: 'line',
      label: '业绩线',
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
      key: 'group',
      label: '加盟小组',
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
      key: 'manager',
      label: '加盟经理',
      tagAttrs: {
        placeholder: '请选择加盟经理'
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
      key: 'resource',
      label: '司机来源',
      tagAttrs: {
        placeholder: '请选择司机来源'
      },
      options: [
        {
          label: '专车',
          value: 'car5'
        },
        {
          label: '共享',
          value: 'share5'
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

  private tableData:any[] = [
    {
      a: '12131312313',
      b: 'tom',
      c: '15021578502',
      d: '共享',
      e: '北京市',
      f: '待跟进',
      g: '面试转化',
      h: '王利',
      i: Date.now(),
      j: 5,
      k: '王利',
      l: '15021578502',
      status: 1
    },
    {
      a: '12131312313',
      b: 'tom',
      c: '15021578502',
      d: '共享',
      e: '北京市',
      f: '已跟进',
      g: '面试转化',
      h: '王利1',
      i: Date.now(),
      j: 5,
      k: '王利',
      l: '15021578502',
      status: 2
    },
    {
      a: '12131312313',
      b: 'tom',
      c: '15021578502',
      d: '共享',
      e: '北京市',
      f: '已成交',
      g: '面试转化',
      h: '王利2',
      i: Date.now(),
      j: 5,
      k: '王利',
      l: '15021578502',
      status: 3
    },
    {
      a: '12131312313',
      b: 'tom',
      c: '15021578502',
      d: '共享',
      e: '北京市',
      f: '已放弃',
      g: '面试转化',
      h: '王利3',
      i: Date.now(),
      j: 5,
      k: '王利',
      l: '15021578502',
      status: 4
    }
  ]

  private columns:any[] = [
    {
      key: 'a',
      label: '司机编号'
    },
    {
      key: 'b',
      label: '司机姓名'
    },
    {
      key: 'c',
      label: '手机号'
    },
    {
      key: 'd',
      label: '业务线'
    },
    {
      key: 'e',
      label: '工作城市'
    },
    {
      key: 'f',
      label: '司机状态'
    },
    {
      key: 'g',
      label: '司机来源'
    },
    {
      key: 'h',
      label: '创建人'
    },
    {
      key: 'i',
      label: '创建时间'
    },
    {
      key: 'j',
      label: '运力数'
    },
    {
      key: 'k',
      label: '加盟经理'
    },
    {
      key: 'l',
      label: '加盟经理手机号'
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      disabled: true,
      slot: true
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

  mounted() {
    this.dropdownList = [...this.columns]
    this.checkList = this.dropdownList.map(item => item.label)
  }

  @Watch('checkList', { deep: true })
  private checkListChange(val:any) {
    this.columns = this.dropdownList.filter(item => val.includes(item.label))
  }
  /**
   * 查询
   */
  private handleQueryClick() {
    console.log(this.listQuery)
    for (let key in this.listQuery) {
      if (this.listQuery[key] && (this.tags.findIndex(item => item.key === key) === -1)) {
        if (Array.isArray(this.listQuery[key]) && this.listQuery[key].length === 0) {
          // 啥也不操作
        } else if (key !== 'state') {
          this.tags.push({
            type: 'info',
            name: this.listQuery[key],
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
    this.listQuery = {
      city: '',
      code: '',
      name: '',
      phone: '',
      line: '',
      group: '',
      manager: '',
      resource: '',
      up: true,
      quit: 1,
      time: []
    }
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
        path: '/transport/followDriver'
      })
    } else if (key === 'giveup') { // 放弃
      this.handleGiveupClick()
    } else if (key === 'edit') { // 编辑
      this.$router.push({
        path: '/transport/editDriver',
        query: {
          id: '1'
        }
      })
    } else if (key === 'detail') { // 详情
      this.$router.push({
        path: '/transport/driverDetail'
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
    this.listQuery[key] = value
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