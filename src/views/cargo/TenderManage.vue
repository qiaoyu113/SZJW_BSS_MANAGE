<template>
  <div
    class="tenderManage"
    :style="{
      padding: isPC ? '15px' :'0px'
    }"
  >
    <suggest-container
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-query="handleQuery"
    >
      <self-form
        ref="tenderForm"
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
            name="tendermanage_query_btn"
            size="small"
            @click="handleQueryClick"
          >
            查询
          </el-button>
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            name="tendermanage_reset_btn"
            size="small"
            @click="handleResetClick"
          >
            重置
          </el-button>
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            name="tendermanage_excel_btn"
            size="small"
            type="success"
            @click="handleExcelClick"
          >
            下载
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
          name="tendermanage_column_btn"
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
      ref="tendermanageTable"
      v-loading="listLoading"
      border
      row-key="e"
      :operation-list="operationList"
      :table-data="tableData"
      :columns="columns"
      :page="page"
      @olclick="handleOlClick"
      @onPageSize="handlePageSize"
      @selection-change="handleChange"
    >
      <template v-slot:i="scope">
        <span>{{ scope.row.i | parseTime('{h}') }}小时</span>
      </template>
      <template v-slot:t="scope">
        <span>{{ scope.row.t | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template v-slot:u="scope">
        <span>{{ scope.row.u | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
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
              command="downLine"
            >
              下线
            </el-dropdown-item>
            <el-dropdown-item
              command="tenderDetail"
            >
              查看标书详情
            </el-dropdown-item>
            <el-dropdown-item
              command="log"
            >
              查看操作日志
            </el-dropdown-item>
            <el-dropdown-item
              command="edit"
            >
              编辑
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </self-table>

    <PitchBox
      :drawer.sync="drawer"
      :drawer-list="rows"
      @deletDrawerList="deletDrawerList"
      @changeDrawer="changeDrawer"
    >
      <template slot-scope="slotProp">
        <span>{{ slotProp.item.a }}</span>
        <span>{{ slotProp.item.b }}</span>
        <span>{{ slotProp.item.e }}</span>
      </template>
    </PitchBox>

    <DownLine ref="downline" />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
import SelfTable from '@/components/base/SelfTable.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import PitchBox from '@/components/PitchBox/index.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import { getLabel } from '@/utils/index.ts'
import DownLine from './components/TenderManage/downLine.vue'

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
  name: 'TenderManage',
  components: {
    SelfForm,
    SelfTable,
    SuggestContainer,
    PitchBox,
    TableHeader,
    DownLine
  }
})
export default class extends Vue {
  private cascaderLables:string[] = []
  private listLoading:boolean = false
  private tab:Tab[] = [
    {
      label: '全部',
      name: 'all',
      id: 0,
      num: 6
    },
    {
      label: '已上线',
      name: 'tab1',
      id: 1,
      num: 5
    },
    {
      label: '已下线',
      name: 'tab2',
      id: 2,
      num: 1
    }
  ]
  private tags:any[] = []
  private listQuery:IState = {
    state: 'all',
    city: '',
    seller: '',
    carType: '',
    code: '',
    name: '',
    a: '',
    createTime: [],
    startTime: [],
    role: 'all'
  }

  private formItem:any[] = [
    {
      type: 2,
      key: 'city',
      label: '城市',
      tagAttrs: {
        placeholder: '请选择城市'
      },
      options: [
        {
          label: '北京',
          value: 'beijing'
        }
      ]
    },
    {
      type: 1,
      key: 'seller',
      label: '线路销售',
      tagAttrs: {
        placeholder: '请输入线路销售'
      }
    },
    {
      type: 1,
      key: 'carType',
      label: '选择车型',
      tagAttrs: {
        placeholder: '请输入选择车型'
      }
    },
    {
      type: 2,
      key: 'code',
      label: '线路名称/线路编号',
      w: '130px',
      tagAttrs: {
        placeholder: '请输入',
        filterable: true
      },
      options: [
        {
          label: 'a',
          value: 'a'
        },
        {
          label: 'b',
          value: 'b'
        }
      ]
    },
    {
      type: 2,
      key: 'name',
      label: '货主名称',
      tagAttrs: {
        placeholder: '请选择货主名称',
        filterable: true
      },
      options: [
        {
          label: 'tom',
          value: 'tom'
        },
        {
          label: 'jack',
          value: 'jack'
        }
      ]
    },
    {
      type: 8,
      key: 'area',
      label: '配送区域',
      tagAttrs: {
        placeholder: '请选择',
        ref: 'tenderCascader'
      },
      listeners: {
        'change': this.handleCascaderChange
      },
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }]
    },
    {
      type: 2,
      key: 'a',
      label: '是否需要返仓',
      w: '100px',
      tagAttrs: {
        placeholder: '请选择'
      },
      options: [
        {
          label: '全部',
          value: 'all'
        },
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '2'
        }
      ]
    },
    {
      type: 3,
      key: 'createTime',
      label: '标书创建时间',
      w: '110px',
      col: 12,
      tagAttrs: {
        placeholder: '请选择'
      }
    },
    {
      type: 3,
      key: 'startTime',
      label: '任务开始时间段',
      w: '110px',
      col: 12,
      tagAttrs: {
        placeholder: '请选择'
      }
    },
    {
      type: 2,
      key: 'role',
      label: '线路角色',
      options: [
        {
          label: '全部',
          value: 'all'
        },
        {
          label: '共享',
          value: 'share'
        },
        {
          label: '专车',
          value: 'car'
        }
      ]
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
      key: 'a',
      label: '标书编号'
    },
    {
      key: 'b',
      label: '线路编号',
      disabled: true
    },
    {
      key: 'c',
      label: '运力编号'
    },
    {
      key: 'd',
      label: '线路名称'
    },
    {
      key: 'e',
      label: '所属销售',
      disabled: true
    },
    {
      key: 'f',
      label: '标书状态'
    },
    {
      key: 'g',
      label: '司机姓名'
    },
    {
      key: 'h',
      label: '货主单趟报价'
    },
    {
      key: 'i',
      label: '总计用时',
      slot: true
    },
    {
      key: 'j',
      label: '预计每日总公里数(公里)'
    },
    {
      key: 'k',
      label: '选择车型'
    },
    {
      key: 'l',
      label: '货物类型'
    },
    {
      key: 'm',
      label: '每日配送趟数'
    },
    {
      key: 'n',
      label: '线路角色'
    },
    {
      key: 'o',
      label: '仓库位置'
    },
    {
      key: 'p',
      label: '货主'
    },
    {
      key: 'q',
      label: '城市'
    },
    {
      key: 'r',
      label: '司机所属城市'
    },
    {
      key: 's',
      label: '是否首岗'
    },
    {
      key: 't',
      label: '首次出车时间',
      slot: true
    },
    {
      key: 'u',
      label: '最后一次出车时间',
      slot: true
    },
    {
      key: 'v',
      label: '累计出车次数'
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      disabled: true,
      slot: true,
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

  private dropdownList:any[] = []
  private checkList:any[] =[]

  /**
   *分页对象
   */
  private page:PageObj = {
    page: 1,
    limit: 5,
    total: 100
  }

  mounted() {
    this.dropdownList = [...this.columns]
    this.checkList = this.dropdownList.map(item => item.label)
    this.getList()
  }
  getList() {
    let arr = []
    let _i:number = +this.page.page
    let j:number = +this.page.page + 5
    for (let i; _i < j; _i++) {
      let num:number = _i + (+this.page.page - 1) * 5
      arr.push({
        a: '212312312312' + num,
        b: 'aada12312312',
        c: 'gfd3131312',
        d: '金杯EK配送',
        e: 'tom' + num,
        f: '已上线',
        g: 'jack',
        h: '5000',
        i: Date.now(),
        j: 500,
        k: '金杯' + num,
        l: '面粉',
        m: '6',
        n: 'tom',
        o: '郑州市xx区',
        p: 'yijie',
        q: '郑州',
        r: '郑州',
        s: '否',
        t: Date.now(),
        u: Date.now(),
        v: 10
      })
      this.tableData = arr
    }
  }
  @Watch('checkList', { deep: true })
  private checkListChange(val:any) {
    this.columns = this.dropdownList.filter(item => val.includes(item.label))
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  /**
   * 删除顶部表单的选项
   */
  handleQuery(value:any, key:any) {
    if (['createTime', 'startTime', 'area'].includes(key)) {
      this.listQuery[key] = []
      this.cascaderLables = []
    } else {
      this.listQuery[key] = value
    }
  }
  /**
   * 查询
   */
  private handleQueryClick() {
    let blackLists = ['state']
    for (let key in this.listQuery) {
      if (this.listQuery[key] && (this.tags.findIndex(item => item.key === key) === -1) && !blackLists.includes(key)) {
        if (key === 'area') {
          this.tags.push({
            type: 'info',
            name: this.cascaderLables.join(','),
            key: key
          })
        } else {
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
  }
  /**
   *重置
   */
  private handleResetClick() {
    this.listQuery = {
      state: 'all',
      city: '',
      seller: '',
      carType: '',
      code: '',
      name: '',
      a: '',
      createTime: [],
      startTime: [],
      role: 'all'
    }
    this.tags = []
  }
  /**
   * 分页
   */
  handlePageSize(page:any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
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
    (this.$refs.tendermanageTable as any).toggleRowSelection(arr)
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
      (this.$refs.tendermanageTable as any).toggleRowSelection()
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
   * 下载excel
   */
  handleExcelClick() {

  }

  /**
   * 更多操作
   */
  handleCommandChange(key:string|number, row:any) {
    if (key === 'downLine') { // 下线
      (this.$refs.downline as any).openDialog()
    } else if (key === 'tenderDetail') { // 查看标书详情
      this.$router.push({
        path: '/cargo/tenderDetail'
      })
    } else if (key === 'log') { // 查看操作日志
      this.$router.push({
        path: '/cargo/tenderLog'
      })
    } else if (key === 'edit') { // 编辑
      this.$router.push({
        path: '/cargo/tenderEdit'
      })
    }
  }
  /**
   *配送区域阶联框
   */
  handleCascaderChange(val:any, form:any, thsAreaCode:any) {
    this.cascaderLables = (this.$refs.tenderForm as any).$refs.tenderCascader.getCheckedNodes()[0].pathLabels
  }
}
</script>
<style lang="scss" scoped>
  .tenderManage {
    .btnPc {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      width: 100%;
    }
    .mobile {
      width:100%;
      .btnMobile {
        margin-left: 0;
        margin-top: 10px;
        width:100%;
      }
    }
  }
</style>

<style scoped>
  @media screen and (min-width: 700px) {
    .tenderManage >>> .el-collapse-item__wrap {
      padding: 20px 30px 0px 0px;
      box-sizing: border-box;
      position: absolute;
      z-index: 1000;
      background: #fff;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.85);
      right: 15px;
      left: 15px;
    }
    .tenderManage >>> .el-collapse-item__content {
      padding-bottom: 0px;
    }
  }
</style>
