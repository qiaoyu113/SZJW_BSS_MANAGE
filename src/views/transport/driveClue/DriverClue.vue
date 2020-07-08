<template>
  <div class="DriverClue">
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
          slot="btn"
          :class="isPC ? 'btnPc' : ''"
        >
          <el-button

            type="warning"
            :class="isPC ? '' : 'btnMobile'"
            name="driverclue_reset_btn"
            @click="handleResetClick"
          >
            重置
          </el-button>
          <el-button

            :class="isPC ? '' : 'btnMobile'"
            type="primary"
            name="driverclue_filter_btn"
            @click="handleFilterClick"
          >
            筛选
          </el-button>
        </div>
      </self-form>
    </suggest-container>
    <!-- 表格顶部的按钮 -->
    <table-header
      :tab="[]"
      active-name=""
    >
      <el-button
        type="primary"
        size="small"
        name="driverclue_creat_btn"
        @click.stop="handleCreateClue"
      >
        <i
          class="el-icon-edit"
        />
        <span v-if="isPC">创建线索</span>
      </el-button>
      <el-button
        type="primary"
        size="small"
        name="driverclue_interview_btn"
        @click="handleInterviewClick"
      >
        <i
          class="el-icon-edit"
        />
        <span v-if="isPC">发起面试</span>
      </el-button>

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
      ref="selfTable"
      v-loading="listLoading"
      border
      :operation-list="operationList"
      :table-data="tableData"
      :columns="columns"
      :page="page"
      @onPageSize="handlePageSize"
      @olclick="handleOlClick"
      @onCommand="handleCommandChange"
    >
      <template v-slot:phone="scope">
        <span v-if="scope.row.isShow">{{ scope.row.phone | hidePhone }}</span>
        <span v-else>{{ scope.row.phone }}</span>
      </template>
      <template v-slot:status="scope">
        <span
          v-if="scope.row.status === 1"
          class="round wait"
        >待分配</span>
        <span
          v-else-if="scope.row.status === 2"
          class="round follow"
        >待跟进</span>
        <span
          v-else-if="scope.row.status === 3"
          class="round giveup"
        >已放弃</span>
      </template>
      <template v-slot:lastTime="scope">
        <span>{{ scope.row.lastTime | Timestamp }}</span>
      </template>
      <template v-slot:op="scope">
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
      </template>
    </self-table>
    <!-- 线索分配 -->
    <clue-distribution
      id="1"
      ref="clueDistribution"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'
import SelfTable from '@/components/base/SelfTable.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import { GetDriverIndexesList } from '@/api/driver'
import { HandlePages } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'
import ClueDistribution from './components/clueDistribution.vue'
interface IState {
  [key: string]: any;
}

interface Tab {
  label:String,
  name:String,
  id:Number,
  num?:Number | undefined
}

interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}

@Component({
  name: 'DriverClue',
  components: {
    SuggestContainer,
    SelfForm,
    SelfTable,
    TableHeader,
    ClueDistribution
  }
})

export default class extends Vue {
  private listLoading = false
  private tab:Tab[] = [
    {
      label: '全部',
      name: 'all',
      id: 0,
      num: 187
    },
    {
      label: '待分配',
      name: 'tab1',
      id: 1,
      num: 5
    },
    {
      label: '待跟进',
      name: 'tab2',
      id: 2,
      num: 1
    },
    {
      label: '跟进中',
      name: 'tab3',
      id: 3,
      num: 3
    },
    {
      label: '已面试',
      name: 'tab4',
      id: 4,
      num: 8
    },
    {
      label: '已成交',
      name: 'tab5',
      id: 5,
      num: 6
    },
    {
      label: '已放弃',
      name: 'tab6',
      id: 6,
      num: 5
    }
  ]
  private tags:any[] = []
  private dropdownList:any[] = []
  private checkList:any[] =[]
  private operationList = [
    {
      icon: 'el-icon-view',
      name: '查看选中',
      color: '#673BB8'
    },
    {
      icon: 'el-icon-finished',
      name: '分配线索',
      color: '#3F51B6'
    },
    {
      icon: 'el-icon-circle-close',
      name: '清空选择',
      color: '#F54436'
    }
  ]
  /**
   *表单对象
   */
  private listQuery:IState = {
    name: '',
    phone: '',
    carType: '',
    channel: '',
    city: '',
    followPerson: '',
    onlyCan: ''
  }
  /**
   *表单数组
   */
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入姓名'
      },
      label: '姓名',
      key: 'name'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入电话'
      },
      label: '电话',
      key: 'phone'
    },
    {
      type: 2,
      key: 'carType',
      tagAttrs: {
        placeholder: '请选择车型'
      },
      label: '车型',
      options: [
        {
          label: '依维柯',
          value: 'yiweike'
        },
        {
          label: '金杯',
          value: 'jinbei'
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择来源渠道'
      },
      label: '来源渠道',
      key: 'channel',
      options: [
        {
          label: '58同城',
          value: '58'
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择工作城市'
      },
      label: '工作城市',
      key: 'city',
      options: [
        {
          label: '华北大区',
          value: 'huabei'
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择跟进人'
      },
      label: '跟进人',
      key: 'followPerson',
      options: [
        {
          label: 'tom',
          value: 'tom'
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择'
      },
      label: '只看我的',
      key: 'onlyCan',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 2
        }
      ]
    }
  ]

  /**
   *表格数据
   */
  private tableData:any[] = [
    {
      name: '段秀英',
      code: 'SX-BJ-198002069437',
      phone: '14798446913',
      city: '秦皇岛市',
      carType: '金杯',
      channel: '58同城',
      status: 1,
      followPerson: 'tom',
      lastTime: Date.now()
    }
  ]

  /**
   *表格列的数组
   */
  private columns:any[] = [
    {
      key: 'name',
      label: '姓名',
      disabled: true
    },
    {
      key: 'code',
      label: '编号'
    },
    {
      key: 'phone',
      label: '电话',
      slot: true
    },
    {
      key: 'city',
      label: '城市'
    },
    {
      key: 'carType',
      label: '车型'
    },
    {
      key: 'channel',
      label: '来源'
    },
    {
      key: 'status',
      label: '状态',
      slot: true
    },
    {
      key: 'followPerson',
      label: '跟进人'
    },
    {
      slot: true,
      key: 'lastTime',
      label: '最后时间'
    },
    {
      slot: true,
      fixed: 'right',
      key: 'op',
      label: '操作',
      moreOp: [
        {
          label: '修改线索',
          value: 'edit',
          icon: 'el-icon-edit'
        },
        {
          label: '分配线索',
          value: 'distribution',
          icon: 'el-icon-s-custom'
        },
        {
          label: '发起面试',
          value: 'interview',
          icon: 'el-icon-chat-dot-square'
        },
        {
          label: '线索跟进',
          value: 'follow',
          icon: 'el-icon-chat-dot-square'
        }
      ]
    }
  ]

  arry:any[] = []

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
    for (let i = 0; i < 10; i++) {
      this.arry.push({ ...this.tableData[0], ...{ lastTime: Date.now(), isShow: i % 2 === 0, status: i % 3 + 1 } })
    }
    this.tableData = this.arry.slice(0, 10)
  }

  @Watch('checkList', { deep: true })
  private checkListChange(val:any) {
    this.columns = this.dropdownList.filter(item => val.includes(item.label))
  }
  /**
   * 获取列表
   */
  async getList() {
    try {
      let { data: res } = await GetDriverIndexesList({ ...this.listQuery, ...this.page })
      if (res.success) {
        this.tableData = res.data
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }
    } catch (err) {
      console.log(`get list fail:`, err)
    }
  }
  /**
   * 删除顶部表单的选项
   */
  handleQuery(value:any, key:any) {
    this.listQuery[key] = value
  }

  /**
   * 获取选中节点的集合
   */
  handleGetNodeClick() {
    let nodes = (this.$refs.selfTable as any).multipleSelection
    console.log(nodes)
  }

  /**
 * 分页
 */
  handlePageSize(page:any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.tableData = this.arry.slice(page.page, 4)
  }

  /**
   *重置按钮
   */
  handleResetClick() {
    this.listQuery = {
      name: '',
      phone: '',
      carType: '',
      channel: '',
      city: '',
      followPerson: '',
      onlyCan: ''
    }
  }

  /**
   *筛选按钮
   */
  handleFilterClick() {
    for (let key in this.listQuery) {
      if (this.listQuery[key] && (this.tags.findIndex(item => item.key === key) === -1)) {
        this.tags.push({
          type: 'info',
          name: this.listQuery[key],
          key: key
        })
      }
    }

    console.log('filter:', this.listQuery)
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  /**
   * 批量操作的按钮
   */
  handleOlClick(val:any) {
    console.log('op:', val)
  }
  /**
   * 创建线索
   */
  handleCreateClue() {
    this.$router.push({
      path: '/transport/createClue'
    })
  }
  /**
   *发起面试
   */
  handleInterviewClick() {
    this.$router.push({
      path: '/transport/interview'
    })
  }
  /**
   * 更多操作
   */
  handleCommandChange(key:string|number, row:any) {
    console.log('xxx:', key, row)
    if (key === 'edit') { // 修改线索
      this.$router.push({
        path: '/transport/createClue',
        query: {
          id: row.id
        }
      })
    } else if (key === 'distribution') { // 分配线索
      (this.$refs.clueDistribution as any).openDialog()
    } else if (key === 'interview') { // 发起面试
      this.$router.push({
        path: '/transport/interview',
        query: {
          id: row.id
        }
      })
    } else if (key === 'follow') { // 线索跟进
      this.$router.push({
        path: '/transport/followClue',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/element-variables.scss';
  .DriverClue {
    padding: 20px;
    .round {
      display: inline-block;
      padding: 1px 8px;
      border-radius: 12px;
      color:#ffffff;
      &.wait {
        background: $--color-primary;
      }
      &.follow {
        background: $--color-warning;
      }
      &.giveup {
        background: $--color-danger;
      }
    }
    .btnPc {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
    }
    .btnMobile {
      margin-left: 0;
      margin-top: 10px;
      width:100%;
    }
  }
</style>

<style scoped>
  .DriverClue >>> .TableHeader_button {
    flex:2;
  }
</style>
