<template>
  <div class="AccountList">
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
              name="AccountList_query_btn"
              size="small"
              @click="handleQueryClick"
            >
              查询
            </el-button>
            <el-button
              :class="isPC ? '' : 'btnMobile'"
              name="AccountList_reset_btn"
              size="small"
              @click="handleResetClick"
            >
              重置
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
        ref="AccountListTable"
        v-loading="listLoading"
        class="accountTable"
        border
        row-key="id"
        :index="false"
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
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </self-table>
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
import SelfForm from '@/components/Base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
import SelfTable from '@/components/Base/SelfTable.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import PitchBox from '@/components/PitchBox/index.vue'
import { getLabel } from '@/utils/index.ts'
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
  name: 'AccountList',
  components: {
    SelfForm,
    SelfTable,
    SuggestContainer,
    TableHeader,
    PitchBox
  }
})
export default class extends Vue {
  private listLoading:boolean = false
  private tab:Tab[] = []
  private tags:any[] = []
  private type:string = ''

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
      label: '业务线',
      tagAttrs: {
        placeholder: '请选择业务线'
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
      type: 4,
      key: 'up',
      label: '是否有待续费订单',
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
      label: '是否有欠费订单',
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
      a: '121313123131',
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
      a: '121313123132',
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
      a: '121313123133',
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
      a: '121313123134',
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
    total: 100
  }

  mounted() {
    this.dropdownList = [...this.columns]
    this.checkList = this.dropdownList.map(item => item.label)
  }

  @Watch('checkList', { deep: true })
  private checkListChange(val:any) {
    setTimeout(() => {
      this.columns = this.dropdownList.filter(item => val.includes(item.label))
    }, 20)
  }
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
    if (key === 'detail') { // 分配
      this.type = 'detail'
      this.rows = [row]
      console.log(row.i, key)
      this.$router.push({ path: 'accountdetail', query: { id: row.i } })
    }
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

  // ------------下面区域是批量操作的功能,其他页面使用直接复制-------------
   private drawer:boolean = false
  /**
   *当前页勾选中的数组集合
   */
  private rows:any[] = []
  // 删除选中项目
  private deletDrawerList(item:any, i:any) {
    let arr:any[] = [item];
    (this.$refs.AccountListTable as any).toggleRowSelection(arr)
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
      (this.$refs.AccountListTable as any).toggleRowSelection()
    }
  }
  /**
   * 勾选表格
   */
  handleChange(row:any) {
    this.rows = row
  }
  // ------------上面区域是批量操作的功能,其他页面使用直接复制-------------
}

</script>
<style lang="scss" scoped>
  .AccountList {
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
.accountTable >>> .operation-main{
    display: none;
  }
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
