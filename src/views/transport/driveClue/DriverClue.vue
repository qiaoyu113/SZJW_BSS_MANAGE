<template>
  <div
    class="DriverClue"
    :class="{
      p15: isPC
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
          slot="btn"
          :class="isPC ? 'btnPc' : 'mobile'"
        >
          <el-button
            size="small"
            type="warning"
            :class="isPC ? '' : 'btnMobile'"
            name="driverclue_reset_btn"
            @click="handleResetClick"
          >
            重置
          </el-button>
          <el-button
            size="small"
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
        v-permission="['/v1/driver/clue/create/manually']"
        type="primary"
        size="mini"
        name="driverclue_creat_btn"
        @click.stop="handleCreateClue"
      >
        <i
          class="el-icon-plus"
        />
        <span v-if="isPC">创建线索</span>
      </el-button>
      <el-button
        v-permission="['/v1/driver/clue/clue/special/interview','/v1/driver/clue/clue/share/interview','/v1/driver/clue/clue/edit/interview']"
        type="primary"
        size="mini"
        name="driverclue_interview_btn"
        @click="handleInterviewClick"
      >
        <i
          class="el-icon-phone-outline"
        />
        <span v-if="isPC">发起面试</span>
      </el-button>

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
      ref="driverClueTable"
      v-loading="listLoading"
      :operation-list="operationList"
      :table-data="tableData"
      :columns="columns"
      row-key="clueId"
      :page="page"
      @onPageSize="handlePageSize"
      @olclick="handleOlClick"
      @selection-change="handleChange"
    >
      <template
        v-slot:name="scope"
      >
        <router-link
          :to="{path: '/transport/followClue',query: {id: scope.row.clueId}}"
          style="color: #409EFF;"
        >
          {{ scope.row.name }}
        </router-link>
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
        >跟进中</span>
        <span
          v-else-if="scope.row.status === 4"
          class="round giveup"
        >已面试</span>
        <span
          v-else-if="scope.row.status === 5"
          class="round giveup"
        >已成交</span>
        <span
          v-else-if="scope.row.status === 6"
          class="round giveup"
        >已放弃</span>
      </template>
      <template v-slot:createDate="scope">
        <span>{{ scope.row.createDate | Timestamp }}</span>
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
              v-permission="['/v1/driver/clue/clue/edit']"
              command="edit"
            >
              修改线索
            </el-dropdown-item>
            <el-dropdown-item
              v-permission="['/v1/driver/clue/clue/dispatch']"
              command="distribution"
            >
              分配线索
            </el-dropdown-item>
            <el-dropdown-item
              v-permission="['/v1/driver/clue/clue/special/interview','/v1/driver/clue/clue/share/interview','/v1/driver/clue/clue/edit/interview']"
              command="interview"
            >
              发起面试
            </el-dropdown-item>
            <el-dropdown-item
              v-permission="['/v1/driver/clue/clue/follow']"
              command="follow"
            >
              线索跟进
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </self-table>
    <!-- 线索分配 -->
    <clue-distribution
      ref="clueDistribution"
      :rows="muls"
      @onRefresh="getList"
    />

    <PitchBox
      :drawer.sync="drawer"
      :drawer-list="rows"
      @deletDrawerList="deletDrawerList"
      @changeDrawer="changeDrawer"
    >
      <template slot-scope="slotProp">
        <span>{{ slotProp.item.name }}</span>
        <span>{{ slotProp.item.clueId }}</span>
        <span>{{ slotProp.item.phone }}</span>
      </template>
    </PitchBox>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import { GetSpecialInterviewLists } from '@/api/driver'
import { HandlePages } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'
import ClueDistribution from './components/ClueDistribution.vue'
import PitchBox from '@/components/PitchBox/index.vue'
import { getLabel, phoneReg } from '@/utils/index.ts'
import { delayTime } from '@/settings'
import { GetOpenCityData, GetDictionaryList, GetManagerLists } from '@/api/common'
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
    ClueDistribution,
    PitchBox
  }
})

export default class extends Vue {
  private clueId:string ='' // 线索id
  private listLoading = false
  private muls:any = [] // 表格多选项数组
  private tab:Tab[] = [
    {
      label: '全部',
      name: '',
      id: 0,
      num: 0
    },
    {
      label: '待分配',
      name: '1',
      id: 1,
      num: 0
    },
    {
      label: '待跟进',
      name: '2',
      id: 2,
      num: 0
    },
    {
      label: '跟进中',
      name: '3',
      id: 3,
      num: 0
    },
    {
      label: '已面试',
      name: '4',
      id: 4,
      num: 0
    },
    {
      label: '已成交',
      name: '5',
      id: 5,
      num: 0
    },
    {
      label: '已放弃',
      name: '6',
      id: 6,
      num: 0
    }
  ] // 顶部状态数组
  private tags:any[] = []// 顶部查询按钮回显的数组
  private dropdownList:any[] = [] // 表格列筛选dropdown数组
  private checkList:any[] =[] // 表格列筛选checkbox数组
  private operationList = [
    {
      icon: 'el-icon-finished',
      name: '查看选中',
      color: '#F2A33A'
    },
    {
      icon: 'el-icon-s-operation',
      name: '分配线索',
      color: '#3F51B6'
    },
    {
      icon: 'el-icon-circle-close',
      name: '清空选择',
      color: '#5E7BBB'
    }
  ] // 左下角表格批量操作数组

  private carOptions:any[] = [] // 车型列表
  private sourceOptions:any[] = [] // 来源渠道列表
  private workCityOptions:any[] = [] // 城市列表
  private gmOptions:any[] = [] // 跟进人列表
  /**
   *表单对象
   */
  private listQuery:IState = {
    status: '',
    name: '',
    phone: '',
    carType: '',
    sourceChannel: '',
    workCity: '',
    gmId: '',
    onlyMe: '',
    clueId: ''
  }
  /**
   *表单数组
   */
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入姓名',
        maxlength: 10,
        clearable: true
      },
      label: '姓名',
      key: 'name'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入电话',
        maxlength: 11,
        clearable: true
      },
      label: '电话',
      key: 'phone'
    },
    {
      type: 2,
      key: 'carType',
      tagAttrs: {
        placeholder: '请选择车型',
        filterable: true
      },
      label: '车型',
      options: this.carOptions
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择来源渠道',
        filterable: true
      },
      label: '来源渠道',
      key: 'sourceChannel',
      options: this.sourceOptions
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择工作城市',
        filterable: true
      },
      label: '工作城市',
      key: 'workCity',
      options: this.workCityOptions
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择跟进人',
        filterable: true
      },
      label: '跟进人',
      key: 'gmId',
      options: this.gmOptions
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择'
      },
      label: '只看我的',
      key: 'onlyMe',
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
      type: 1,
      tagAttrs: {
        placeholder: '请输入编号',
        maxlength: 14,
        clearable: true
      },
      label: '编号',
      key: 'clueId'
    }
  ]

  /**
   *表格数据
   */
  private tableData:any[] = []

  /**
   *表格列的数组
   */
  private columns:any[] = [
    {
      key: 'name',
      label: '姓名',
      slot: true
    },
    {
      key: 'clueId',
      label: '编号',
      width: '160px'
    },
    {
      key: 'phone',
      label: '电话',
      width: '120px'
    },
    {
      key: 'workCityName',
      label: '城市'
    },
    {
      key: 'carTypeName',
      label: '车型',
      width: '130px'
    },
    {
      key: 'sourceChannelName',
      label: '来源'
    },
    {
      key: 'status',
      label: '状态',
      slot: true
    },
    {
      key: 'gmName',
      label: '跟进人'
    },
    {
      slot: true,
      key: 'createDate',
      label: '最后时间',
      width: '170px'
    },
    {
      slot: true,
      key: 'op',
      label: '操作',
      disabled: true,
      fixed: 'right',
      width: this.isPC ? '100px' : '50px'
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

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  @Watch('checkList', { deep: true })
  private checkListChange(val:any) {
    this.columns = this.dropdownList.filter(item => val.includes(item.label))
  }
  /**
   * 获取跟进人列表
   */
  async getManagers() {
    try {
      let params = {
        uri: `/v1/driver/clue/list/key-query`
      }
      let { data: res } = await GetManagerLists(params)
      if (res.success) {
        let gms = res.data.map((item:any) => ({ label: item.name, value: item.id }))
        this.gmOptions.push(...gms)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get manager fail:${err}`)
    }
  }
  /**
   *获取基础信息
   */
  async getBaseInfo() {
    try {
      let params = ['Intentional_compartment', 'source_channel']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        let cars = res.data.Intentional_compartment.map(function(item:any) {
          return { label: item.dictLabel, value: item.dictValue }
        })

        let sources = res.data.source_channel.map(function(item:any) {
          return { label: item.dictLabel, value: item.dictValue }
        })

        this.carOptions.push(...cars)
        this.sourceOptions.push(...sources)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }
  /**
   *获取开通城市
   */
  async getOpenCitys() {
    try {
      let { data: res } = await GetOpenCityData()
      if (res.success) {
        let workCitys = res.data.map(function(item:any) {
          return {
            label: item.name,
            value: item.code
          }
        })
        this.workCityOptions.push(...workCitys)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get `)
    }
  }

  /**
   * 获取列表
   */
  async getList() {
    try {
      if (this.listQuery.phone && !phoneReg.test(this.listQuery.phone)) {
        return this.$message.error('请输入正确的手机号')
      }
      this.listLoading = true
      let params:any = {
        limit: this.page.limit,
        page: this.page.page,
        ...this.listQuery,
        status: Number(this.listQuery.status)
      }
      if (!this.listQuery.status) {
        delete params.status
      }

      let { data: res } = await GetSpecialInterviewLists(params)
      if (res.success) {
        this.listLoading = false
        this.tableData = res.data
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
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
      console.log(`get list fail:`, err)
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
 * 分页
 */
  handlePageSize(page:any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }

  /**
   *重置按钮
   */
  handleResetClick() {
    this.listQuery = {
      status: '',
      name: '',
      phone: '',
      carType: '',
      sourceChannel: '',
      workCity: '',
      gmId: '',
      onlyMe: '',
      clueId: ''
    }
    this.tags = []
    this.getList()
  }

  /**
   *筛选按钮
   */
  handleFilterClick() {
    let blackLists = ['status']
    this.tags = []
    for (let key in this.listQuery) {
      if (this.listQuery[key] !== '' && (this.tags.findIndex(item => item.key === key) === -1) && !blackLists.includes(key)) {
        let name = getLabel(this.formItem, this.listQuery, key)
        if (name) {
          this.tags.push({
            type: 'info',
            name: name,
            key: key
          })
        }
      }
    }
    this.getList()
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
    if (key === 'edit') { // 修改线索
      this.$router.push({
        path: '/transport/createClue',
        query: {
          id: row.clueId
        }
      })
    } else if (key === 'distribution') { // 分配线索
      this.clueId = row.clueId
      this.muls = [row];
      (this.$refs.clueDistribution as any).openDialog()
    } else if (key === 'interview') { // 发起面试
      this.$router.push({
        path: '/transport/interview',
        query: {
          id: row.clueId
        }
      })
    } else if (key === 'follow') { // 线索跟进
      this.$router.push({
        path: '/transport/followClue',
        query: {
          id: row.clueId
        }
      })
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
    (this.$refs.driverClueTable as any).toggleRowSelection(arr)
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
      (this.$refs.driverClueTable as any).toggleRowSelection()
    } else if (val.name === '分配线索') {
      if (this.rows.length > 0) {
        this.muls = this.rows;
        (this.$refs.clueDistribution as any).openDialog()
      } else {
        this.$message.error('请先选择')
      }
    }
  }
  /**
   * 勾选表格
   */
  handleChange(row:any) {
    this.rows = row
  }
  // ------------上面区域是批量操作的功能,其他页面使用直接复制-------------

  mounted() {
    this.dropdownList = [...this.columns]
    this.checkList = this.dropdownList.map(item => item.label)
    this.getBaseInfo()
    this.getOpenCitys()
    this.getList()
    this.getManagers()
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/element-variables.scss';
  .DriverClue {
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
    .mobile {
      width:100%;
      text-align: center;
      .btnMobile {
        margin-left: 0;
        margin-top: 10px;
        width:80%;
      }
    }
  }
</style>

<style scoped>
  .DriverClue >>> .TableHeader_button {
    flex:2;
  }

  .DriverClue >>> .el-form-item__label {
    color:#999;
  }

  @media screen and (min-width: 700px) {
    .DriverClue >>> .el-collapse-item__wrap {
      padding: 20px 30px 0px 0px;
      box-sizing: border-box;
      position: absolute;
      z-index: 1000;
      background: #fff;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.85);
      right: 15px;
      left: 15px;
    }
    .DriverClue >>> .el-collapse-item__content {
      padding-bottom: 0px;
    }
  }

</style>
