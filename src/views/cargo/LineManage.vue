<template>
  <div :class="isPC ? 'LineManage' : 'LineManage-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-date="handleDate"
      @handle-query="handleQuery"
    >
      <self-form
        :list-query="listQuery"
        :form-item="formItem"
        label-width="100px"
      >
        <div
          slot="btn"
          :class="isPC ? 'btnPc' : ''"
        >
          <el-button

            type="warning"
            :class="isPC ? '' : 'btnMobile'"
            name="linemanage_reset_btn"
            @click="handleResetClick"
          >
            重置
          </el-button>
          <el-button

            :class="isPC ? '' : 'btnMobile'"
            type="primary"
            name="linemanage_filter_btn"
            @click="handleFilterClick"
          >
            筛选
          </el-button>
        </div>
      </self-form>
    </SuggestContainer>

    <div class="table_box">
      <!--操作栏-->
      <BettwenTitle
        :tab="tab"
        :active-name="listQuery.state"
      >
        <template v-slot:left>
          <div>
            <span>统计：已查询到
              <span class="numCol">700</span>
              条线路，总计可上岗
              <span class="numCol">100</span>
              个，已上岗
              <span class="numCol">40</span>
              个，已下线
              <span class="numCol">20</span>
              个
            </span>
          </div>
        </template>

        <template v-slot:right>
          <div>
            <el-button
              :class="isPC ? 'btn-item-right' : 'btn-item-right-m'"
              type="primary"
              size="small"
              name="LineManage_creat_btn"
              @click="goCreat"
            >
              <i class="el-icon-plus" />
              <span v-if="isPC">新建</span>
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
                <i class="el-icon-s-operation" />
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
          </div>
        </template>
      </BettwenTitle>
      <div class="table_center">
        <self-table
          ref="LineManageTable"
          v-loading="listLoading"
          :operation-list="operationList"
          border
          row-key="id"
          :table-data="tableData"
          :columns="columns"
          :page="page"
          @olclick="handleOlClick"
          @onPageSize="handlePageSize"
          @selection-change="handleChange"
        >
          <template v-slot:operate="scope">
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
                  command="take"
                >
                  <template v-if="isPC">
                    拍照
                  </template>
                  <i
                    v-else
                    class="el-icon-camera"
                  />
                </el-dropdown-item>
                <el-dropdown-item
                  command="stopuse"
                >
                  <template v-if="isPC">
                    停用
                  </template>
                  <i
                    v-else
                    class="el-icon-camera"
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
                    class="el-icon-camera"
                  />
                </el-dropdown-item>
                <el-dropdown-item
                  command="putaway"
                >
                  <template v-if="isPC">
                    上架
                  </template>
                  <i
                    v-else
                    class="el-icon-camera"
                  />
                </el-dropdown-item>
                <el-dropdown-item
                  command="getaway"
                >
                  <template v-if="isPC">
                    下架
                  </template>
                  <i
                    v-else
                    class="el-icon-camera"
                  />
                </el-dropdown-item>
                <el-dropdown-item
                  command="copy"
                >
                  <template v-if="isPC">
                    复制
                  </template>
                  <i
                    v-else
                    class="el-icon-camera"
                  />
                </el-dropdown-item>
                <el-dropdown-item
                  command="audit"
                >
                  <template v-if="isPC">
                    审核
                  </template>
                  <i
                    v-else
                    class="el-icon-camera"
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template v-slot:detail="scope">
            <el-dropdown @command="(e) => handleCommandChange(e,scope.row)">
              <span class="el-dropdown-link">
                <el-button
                  v-if="isPC"
                  :a="scope"
                  type="text"
                >
                  详情
                </el-button>
                <i
                  v-else
                  class="el-icon-setting"
                />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  command="linedetail"
                >
                  <template v-if="isPC">
                    查看线路详情
                  </template>
                  <i
                    v-else
                    class="el-icon-edit"
                  />
                </el-dropdown-item>
                <el-dropdown-item
                  command="showpic"
                >
                  <template v-if="isPC">
                    查看线路照片
                  </template>
                  <i
                    v-else
                    class="el-icon-delete"
                  />
                </el-dropdown-item>
                <el-dropdown-item
                  command="showtender"
                >
                  <template v-if="isPC">
                    查看全部标书
                  </template>
                  <i
                    v-else
                    class="el-icon-edit"
                  />
                </el-dropdown-item>
                <el-dropdown-item
                  command="showlog"
                >
                  <template v-if="isPC">
                    操作日志
                  </template>
                  <i
                    v-else
                    class="el-icon-edit"
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>

          <template v-slot:customerName="scope">
            <span>{{ scope.row.customerName }}</span>
            <img
              class="overshop"
              src="https://oss-qzn.yunniao.cn/img/1b819fc72e5a4153b749ff46dbe9ac19"
              alt=""
            >
          </template>
        </self-table>
      </div>
    </div>

    <!-- 上架 -->
    <Dialog
      :visible.sync="showPutDio"
      :title="`上架`"
      :center="true"
      :cancel="putCancel"
      :confirm="putConfirm"
    >
      <div>
        <div class="dioBox">
          <span>等待上车有效期（天）：</span>
          <el-date-picker
            v-model="diaUpcar"
            type="date"
            placeholder="选择日期"
          />
        </div>
        <div class="dioBox">
          <span>可上车数：</span>
          <el-input
            v-model="diaUpcarNum"
            type="number"
            placeholder="请输入可上车数量"
          />
        </div>
        <p class="dioBox">
          目前有效期至：2020-07-01
        </p>
        <p class="dioBox">
          目前已上车数量：3辆
        </p>
      </div>
    </Dialog>

    <!-- 下架 -->
    <Dialog
      :visible.sync="showGetDio"
      :title="`下架`"
      :center="true"
      :cancel="getCancel"
      :confirm="getConfirm"
    >
      <div>
        <div class="dioBox">
          <p class="dioBox">
            线路编号：SL2020030101
          </p>
          <p class="dioBox">
            已上车数量：0辆
          </p>
          <p class="dioBox">
            是否确认将此线路失效？
          </p>
        </div>
      </div>
    </Dialog>

    <PitchBox
      :drawer.sync="drawer"
      :drawer-list="rows"
      @deletDrawerList="deletDrawerList"
      @changeDrawer="changeDrawer"
    >
      <template slot-scope="slotProp">
        <span>{{ slotProp.item.customerNo }}</span>
        <span>{{ slotProp.item.customerName }}</span>
      </template>
    </PitchBox>
  </div>
</template>
<script lang="ts">
import { unique, getLabel } from '@/utils/index.ts'
import Dialog from '@/components/Dialog/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { HandlePages } from '@/utils/index'
import { GetCustomerList } from '@/api/customer'
import Pagination from '@/components/Pagination/index.vue'
import BettwenTitle from '@/components/TableHeader/BettwenTitle.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
// import { LineManageForm } from './components'
import SelfTable from '@/components/base/SelfTable.vue'
import PitchBox from '@/components/PitchBox/index.vue'
import '@/styles/common.scss'

  interface PageObj {
    page:Number,
    limit:Number,
    total?:Number
  }

  interface IState {
    [key: string]: any;
  }

  @Component({
    name: 'LineManage',
    components: {
      Pagination,
      SuggestContainer,
      BettwenTitle,
      SelfTable,
      SelfForm,
      Dialog,
      PitchBox
    }
  })

export default class LineManage extends Vue {
  private id:string = ''
  private diaUpcar:string = ''
  private diaUpcarNum:string = ''
  private tab: any[] = [
    {
      label: '全部',
      name: '0',
      num: 187
    },
    {
      label: '待上架',
      name: '1',
      num: 187
    },
    {
      label: '已上架',
      name: '2',
      num: 1
    },
    {
      label: '已售罄',
      name: '3'
    },
    {
      label: '已停用',
      name: '4'
    }
  ];
  private total = 0;
  private list: any[] = [];
  private limit: number = 20;
  // private page: Object | undefined = '';
  private listLoading = true;
  private tags: any[] = [];
  private DateValue: any[] = [];
  private operationList: any[] = [
    { icon: 'el-icon-edit-outline', name: '查看选中', color: '#999' },
    { icon: 'el-icon-edit', name: '复制', color: '#978374' },
    { icon: 'el-icon-view', name: '审核', color: '#978374' }
  ];
  private dropdownList: any[] = [];
  private checkList: any[] = this.dropdownList;
  private formItem:any[] = [
    {
      type: 2,
      key: 'name',
      label: '城市',
      tagAttrs: {
        placeholder: '请选择城市'
      },
      options: [
        {
          label: '58同城',
          value: '58'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
    },
    {
      type: 1,
      label: '线路销售',
      key: 'soldName',
      tagAttrs: {
        placeholder: '请选择线路销售'
      }
    },
    {
      type: 2,
      key: 'state',
      label: '审核状态',
      tagAttrs: {
        // disabled: true,
      // clearable: true,
      // multiple: true,
        placeholder: '请选择审核状态'
      },
      options: [
        {
          label: '58同城',
          value: '58'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
    },
    {
      type: 2,
      label: '选择车型',
      key: 'cartype',
      tagAttrs: {
        // disabled: true,
      // clearable: true,
      // multiple: true,
        placeholder: '请选择车型'
      },
      options: [
        {
          label: '58同城',
          value: '58'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
    },
    {
      type: 1,
      label: '线路名称/线路编号',
      w: '140px',
      key: 'soldnum',
      tagAttrs: {
        placeholder: '请输入线路名称/线路编号'
      }
    },
    {
      type: 1,
      label: '货主名称',
      key: 'huozhuName',
      tagAttrs: {
        placeholder: '请输入货主名称'
      }
    },
    {
      type: 2,
      label: '上架状态',
      key: 'upstatus',
      tagAttrs: {
        // disabled: true,
      // clearable: true,
      // multiple: true,
        placeholder: '请选择上架状态'
      },
      options: [
        {
          label: '58同城',
          value: '58'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
    },
    {
      type: 2,
      label: '线路区域',
      key: 'linearea',
      tagAttrs: {
        // disabled: true,
      // clearable: true,
      // multiple: true,
        placeholder: '请选择线路区域'
      },
      options: [
        {
          label: '58同城',
          value: '58'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
    },
    {
      type: 2,
      key: 'fancang',
      label: '是否需要返仓',
      tagAttrs: {
        // disabled: true,
      // clearable: true,
      // multiple: true,
        placeholder: '请选择是否需要返仓'
      },
      options: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '0'
        }
      ]
    },
    {
      type: 2,
      label: '停用状态',
      key: 'stopstatus',
      tagAttrs: {
        // disabled: true,
      // clearable: true,
      // multiple: true,
        placeholder: '请选择停用状态'
      },
      options: [
        {
          label: '58同城',
          value: '58'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
    },
    {
      col: 12,
      label: '创建时间',
      type: 3,
      key: 'creattime'
    },
    {
      col: 12,
      label: '工作开始时间段',
      w: '130px',
      type: 3,
      key: 'starttime'
    }
  ]
  private listQuery: IState = {
    key: '',
    city: '',
    page: 1,
    limit: 30,
    endDate: '',
    startDate: '',
    state: '',
    lineSaleId: '',
    name: '',
    soldName: '',
    soldnum: '',
    huozhuName: '',
    upstatus: '',
    linearea: '',
    fancang: '',
    stopstatus: '',
    creattime: [],
    starttime: []
  };
  private showPutDio:boolean = false
  private showGetDio:boolean = false
  page:PageObj ={
    page: 1,
    limit: 10,
    total: 20
  }
  private tableData:any[] = []

  private columns:any[] = [
    {
      key: 'customerNo',
      label: '货主编号',
      disabled: true
    },
    {
      key: 'customerName',
      label: '货主',
      slot: true
    },
    {
      key: 'distributionType',
      label: '类型'
    },
    {
      key: 'clueStatus',
      label: '合同状态'
    },
    {
      key: 'createDate',
      label: '创建时间'
    },
    {
      key: 'creater',
      label: '创建人'
    },
    {
      key: 'customerNo22',
      label: '合同止期'
    },
    {
      key: 'clientsName',
      label: '线路销售'
    },
    {
      fixed: 'right',
      key: 'operate',
      label: '操作',
      slot: true
    },
    {
      fixed: 'right',
      key: 'detail',
      slot: true,
      label: '详情'
    }
  ]

  /**
   *重置按钮
   */
  handleResetClick() {
    this.listQuery = {
      key: '',
      city: '',
      page: 1,
      limit: 30,
      endDate: '',
      startDate: '',
      state: '',
      lineSaleId: '',
      name: '',
      soldName: '',
      soldnum: '',
      huozhuName: '',
      upstatus: '',
      linearea: '',
      fancang: '',
      stopstatus: '',
      creattime: [],
      starttime: []
    }
  }
  /**
   *筛选按钮
   */
  handleFilterClick() {
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

    console.log('filter:', this.listQuery)
  }

  /**
     * 分页
     */
  handlePageSize(page:any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.fetchData()
  }
  /**
     * 表格下拉菜单
     */
  handleCommandChange(key:string|number, row:any) {
    console.log(key)
    this.id = row.clientPhone
    switch (key) {
      case 'edit':
        this.$router.push({ path: 'lineedit', query: { id: row.clientPhone } })
        break
      case 'copy':
        this.$router.push({ path: 'linecopy', query: { id: row.clientPhone } })
        break
      case 'audit':
        this.$router.push({ path: 'lineaudit', query: { id: row.clientPhone } })
        break
      case 'take':
        this.$router.push({ path: 'takepicture', query: { id: row.clientPhone } })
        break
      case 'showtender':
        this.$router.push({ path: 'showtender', query: { id: row.clientPhone } })
        break
      case 'showlog':
        this.$router.push({ path: 'showlog', query: { id: row.clientPhone } })
        break
      case 'putaway':
        this.showPutDio = true
        break
      case 'getaway':
        this.showGetDio = true
        break
      case 'linedetail':
        this.$router.push({ path: 'linedetail', query: { id: row.clientPhone } })
        break
      case 'showpic':
        this.$router.push({ path: 'showpicture', query: { id: row.clientPhone } })
        break
      default:
        break
    }
  }

  // 上架操作
  private putConfirm(done: any) {
    this.$message.info('点击了确定')
    done()
  }
  private putCancel(done: any) {
    this.$message.info('点击了取消')
    done()
  }
  // 下架操作
  private getConfirm(done:any) {
    this.$message.info('点击了确定')
    done()
  }
  private getCancel(done: any) {
    this.$message.info('点击了取消')
    done()
  }

  private olClicks(item: any) {
    console.log(item)
  }

  created() {
    this.fetchData()
    this.dropdownList = [...this.columns]
    this.checkList = this.dropdownList.map(item => item.label)
  }

    @Watch('checkList', { deep: true })
  private checkListChange(val:any) {
    this.columns = this.dropdownList.filter(item => val.includes(item.label))
  }
    // 所有请求方法
    private fetchData() {
      this.getList(this.listQuery)
    }

    // 处理tags方法
    private handleTags(value: any) {
      this.tags = value
    }

    // 处理query方法
    private handleQuery(value: any, key: any) {
      if (key === 'creattime' || key === 'starttime') {
        this.listQuery[key] = []
      } else {
        this.listQuery[key] = value
      }
      this.fetchData()
    }

    // 处理选择日期方法
    private handleDate(value: any) {
      this.DateValue = value
    }

    // 请求列表
    private async getList(value: any) {
      this.listQuery.page = this.page.page
      this.listQuery.limit = this.page.limit
      this.listLoading = true
      const { data } = await GetCustomerList(this.listQuery)
      if (data.success) {
        this.tableData = data.data
        this.page.total = data.page.total
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

    private goCreat() {
      this.$router.push('creatline')
    }

    get isPC() {
      return SettingsModule.isPC
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
    (this.$refs.LineManageTable as any).toggleRowSelection(arr)
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
      (this.$refs.LineManageTable as any).toggleRowSelection()
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
@import '@/styles/_variables.scss';
.LineManage {
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  .btn-item-left{
    border-radius: 4px;
    border: none;
    margin-right: 10px;
  }
  .btn-item-right{
    border-radius: 4px;
    border: none;
    margin-left: 10px;
  }
  .btn-main-color{
    border: 1px solid $main-btn;
    color: $main-btn;
  }
  .btn-item-filtrate {
    background: #ffa000;
    border-radius: 4px;
    border: none;
    margin-left: 10px;
  }
  .table_box {
    height: calc(100vh - 225px) !important;
    background: #ffffff;
    // border: 1px solid #dfe6ec;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      height: calc(100vh - 300px) !important;
      padding: 30px;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
      // overflow-y: scroll;
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
  .pagination-container {
    background: #fff;
  }
  .overshop{
  width: 40px;
  height: 40px;
  position: absolute;
  top: 0;
  left: 0;
}
  .dioBox{
    margin-bottom: 20px;
    padding: 0 20px;
    .el-input{
      width: 200px!important;
    }
  }
}
</style>
<style lang="scss" scoped>
.LineManage-m {
  padding-bottom: 0;
  box-sizing: border-box;
  .btn-item-right-m{
    border-radius: 4px;
    border: none;
    margin-right: 10px;
  }
  .btn-item-left-m{
    border-radius: 4px;
    border: none;
    margin-left: 10px;
  }
  .btn-item-filtrate-m {
    background: #ffa000;
    border-radius: 4px;
    border-radius: 4px;
    border: none;
  }
    .btn-main-color-m{
    border: 1px solid $main-btn;
    color: $main-btn;
  }
  .table_box {
    background: #ffffff;
    // border: 1px solid #dfe6ec;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      height: calc(100vh - 300px) !important;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
      overflow-y: scroll;
    }
  }
    .overshop{
  width: 30px;
  height: 30px;
  position: absolute;
  top: 0;
  left: 0;
}
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .pagination-container {
    background: #f8f9fa;
  }
}
</style>

<style lang="scss" scope>
.numCol{
  color: #649CEE;
  margin: 0!important;
}
.btn-main-color{
    border: 1px solid $main-btn;
    color:$main-btn
  }
.el-collapse-item__content {
  padding-bottom: 0;
}

.el-form-item__label {
  color: #999999;
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
</style>
