<template>
  <div :class="isPC ? 'LineManage' : 'LineManage-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.shelvesState"
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
              <span
                class="numCol"
                v-text="title.all"
              />
              条线路，总计可上岗
              <span
                class="numCol"
                v-text="title.mountGuardNo"
              />
              个，已上岗
              <span
                class="numCol"
                v-text="title.canMountGuardNo"
              />
              个，已下线
              <span
                class="numCol"
                v-text="0"
              />
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
          <template v-slot:createDate="scope">
            {{ scope.row.createDate |parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
          <template v-slot:busiType="scope">
            {{ scope.row.busiType === 0 ? '专车':'共享' }}
          </template>
          <template v-slot:carNum="scope">
            {{ scope.row.mountGuardNo }}/{{ scope.row.deployNo }}
          </template>
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
      :title="`上架调整`"
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
            :picker-options="pickerOptions"
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
import { getLabel } from '@/utils/index.ts'
import Dialog from '@/components/Dialog/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { HandlePages } from '@/utils/index'
import { manualDeactivate, shelfAdjustment, mountGuard, shelveLine, lineListAll } from '@/api/cargo'
import Pagination from '@/components/Pagination/index.vue'
import BettwenTitle from '@/components/TableHeader/BettwenTitle.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { GetDictionaryList, GetOpenCityData, GetCityByCode } from '@/api/common'
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
      name: '',
      num: 0
    },
    {
      label: '待上架',
      name: '1',
      num: 0
    },
    {
      label: '已上架',
      name: '2',
      num: 0
    },
    {
      label: '已售罄',
      name: '4',
      num: 0
    },
    {
      label: '已下架',
      name: '3',
      num: 0
    },
    {
      label: '已停用',
      name: '5',
      num: 0
    }
  ];
  private title:any = { all: 0, waitShelvesNum: 0, isShelvesNum: 0, noShelvesNum: 0, soldNum: 0, disableNum: 0 }
  private total = 0;
  private list: any[] = [];
  private limit: number = 20;
  private listLoading = false;
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
      key: 'lineSaleId',
      label: '线路销售',
      tagAttrs: {
        placeholder: '请选择线路销售'
      },
      options: []
    },
    {
      type: 2,
      key: 'auditState',
      label: '审核状态',
      tagAttrs: {
        placeholder: '请选择审核状态'
      },
      options: []
    },
    {
      type: 2,
      label: '选择车型',
      key: 'cartype',
      tagAttrs: {
        placeholder: '请选择车型'
      },
      options: []
    },
    {
      type: 1,
      label: '线路名称',
      w: '140px',
      key: 'lineName',
      tagAttrs: {
        placeholder: '请输入线路名称'
      }
    },
    {
      type: 1,
      label: '线路编号',
      w: '140px',
      key: 'lineId',
      tagAttrs: {
        placeholder: '请输入线路编号'
      }
    },
    {
      type: 1,
      label: '货主名称',
      key: 'customerName',
      tagAttrs: {
        placeholder: '请输入货主名称'
      }
    },
    {
      type: 8,
      key: 'houseAddress',
      label: '线路区域:',
      tagAttrs: {
        placeholder: '线路区域',
        props: {
          lazy: true,
          lazyLoad: this.getLineArea
        }
      }
    },
    {
      type: 2,
      key: 'returnWarehouse',
      label: '是否需要返仓',
      tagAttrs: {
        placeholder: '请选择是否需要返仓'
      },
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
    },
    {
      col: 12,
      label: '创建时间',
      type: 3,
      key: 'time'
    },
    {
      col: 12,
      label: '工作开始时间段',
      w: '130px',
      type: 3,
      key: 'jobTime'
    }
  ]
  private listQuery: IState = {
    shelvesState: '',
    lineSaleId: '',
    auditState: '',
    cartype: '',
    lineName: '',
    lineId: '',
    customerName: '',
    houseAddress: [],
    returnWarehouse: '',
    time: [],
    jobTime: []
  };
  private showPutDio:boolean = false
  private showGetDio:boolean = false
  // private workDio:boolean = false
  page:PageObj ={
    page: 1,
    limit: 10,
    total: 0
  }
  private tableData:any[] = []

  private columns:any[] = [
    {
      key: 'lineName',
      label: '线路名称'
    },
    {
      key: 'dayNo',
      label: '每日配送数'
    },
    {
      key: 'lineSaleName',
      label: '所属销售'
    },
    {
      key: 'carNum',
      label: '上车数（已上车）/可上车',
      slot: true
    },
    {
      key: 'shipperOffer',
      label: '货主预计月报价'
    },
    {
      key: 'everyTripGuaranteed',
      label: '货主单趟报价'
    },
    {
      key: 'timeDiff',
      label: '总计用时'
    },
    {
      key: 'distance',
      label: '预计每日平均总公里数'
    },
    {
      key: 'carTypeName',
      label: '选择车型'
    },
    {
      key: 'cargoTypeName',
      label: '货物类型'
    },
    {
      key: 'deliveryNo',
      label: '每日配送点位数'
    },
    {
      key: 'busiType',
      label: '线路角色',
      slot: true
    },
    {
      key: 'warehouse',
      label: '仓库位置'
    },
    {
      key: 'stabilityRateName',
      label: '线路稳定性'
    },
    {
      key: 'shelvesStateName',
      label: '上架状态'
    },
    {
      key: 'lineSource',
      label: '线路来源'
    },
    {
      key: 'createDate',
      label: '创建时间',
      slot: true
    },
    {
      key: 'customerName',
      label: '货主'
    },
    {
      key: 'cityName',
      label: '城市'
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

  private pickerOptions:any = {
    disabledDate(time:any) {
      return time.getTime() <= Date.now()
    }
  }
  mounted() {
    this.dropdownList = [...this.columns]
    this.checkList = this.dropdownList.map(item => item.label)
    this.dicList()
    this.getList()
  }
  /**
   * 省市县3级联动
   */
  async getLineArea(node:any, resolve:any) {
    let params:string[] = []
    if (node.level === 0) {
      params = ['100000']
    } else if (node.level === 1) {
      params = ['100000']
      params.push(node.value)
    } else if (node.level === 2) {
      params = ['100000']
      params.push(node.parent.value)
      params.push(node.value)
    }
    try {
      let nodes = await this.loadCityByCode(params)
      resolve(nodes)
    } catch (err) {
      resolve([])
    }
  }
  /**
     * 加载城市
     */
  async loadCityByCode(params:string[]) {
    try {
      let { data: res } = await GetCityByCode(params)
      if (res.success) {
        const nodes = res.data.map(function(item:any) {
          return {
            value: item.code,
            label: item.name,
            leaf: params.length > 2
          }
        })
        return nodes
      }
    } catch (err) {
      console.log(`load city by code fail:${err}`)
    }
  }
  /**
   *重置按钮
   */
  handleResetClick() {
    this.listQuery = {
      shelvesState: '',
      lineSaleId: '',
      auditState: '',
      cartype: '',
      lineName: '',
      lineId: '',
      customerName: '',
      houseAddress: [],
      returnWarehouse: '',
      time: [],
      jobTime: []
    }
  }
  /**
   *筛选按钮
   */
  handleFilterClick() {
    let blackLists = ['state']
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
     * 分页
     */
  handlePageSize(page:any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }

  private async dicList() {
    let params = ['Intentional_compartment', 'line_audit_state']
    let { data: res } = await GetDictionaryList(params)
    if (res.success) {
      // eslint-disable-next-line camelcase
      let { Intentional_compartment, line_audit_state } = res.data
      let cartype = Intentional_compartment.map(function(ele:any) {
        return { value: Number(ele.dictValue), label: ele.dictLabel }
      })
      let state = line_audit_state.map(function(ele:any) {
        return { value: Number(ele.dictValue), label: ele.dictLabel }
      })
      this.formItem.map(ele => {
        if (ele.key === 'cartype') {
          ele.options = cartype
        }
        if (ele.key === 'auditState') {
          ele.options = state
        }
      })
    } else {
      this.$message.error(res.errorMsg)
    }
    // let city = await GetOpenCityData()
    // console.log(city.data.success)
    // if (city.data.success) {
    //   let arr = city.data.data.map(function(ele:any) {
    //     return { value: ele.code, label: ele.name }
    //   })
    //   this.formItem.map(ele => {
    //     if (ele.key === 'workCoty') {
    //       ele.options = arr
    //     }
    //   })
    // } else {
    //   this.$message.error(data)
    // }
  }
  // 请求列表
  private async getList() {
    try {
      this.listLoading = true
      let params:any = {
        lineSaleId: this.listQuery.lineSaleId,
        auditState: this.listQuery.auditState,
        cartype: this.listQuery.cartype,
        lineName: this.listQuery.lineName,
        lineId: this.listQuery.lineId,
        customerName: this.listQuery.customerName,
        returnWarehouse: this.listQuery.returnWarehouse,
        provinceArea: this.listQuery.houseAddress[0],
        cityArea: this.listQuery.houseAddress[1],
        countyArea: this.listQuery.houseAddress[2],
        page: this.page.page,
        limit: this.page.limit
      }
      this.listQuery.shelvesState && (params.shelvesState = this.listQuery.shelvesState)
      if (this.listQuery.time.length > 0) {
        params.startDate = this.listQuery.time[0]
        params.endDate = this.listQuery.time[1]
      }
      if (this.listQuery.jobTime.length > 0) {
        params.jobStartDate = this.listQuery.time[0]
        params.jobEndDate = this.listQuery.time[1]
      }
      const { data: res } = await lineListAll(params)
      this.listLoading = false
      if (res.success) {
        this.tableData = res.data
        this.title = res.title
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
        this.tab.map(ele => {
          switch (ele.label) {
            case '全部':
              ele.num = this.title.all
              break
            case '待上架':
              ele.num = this.title.waitShelvesNum
              break
            case '已上架':
              ele.num = this.title.isShelvesNum
              break
            case '已售罄':
              ele.num = this.title.soldNum
              break
            case '已下架':
              ele.num = this.title.noShelvesNum
              break
            case '已停用':
              ele.num = this.title.disableNum
              break
            default:
              break
          }
        })
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      this.listLoading = false
      console.log(`get list fail:${err}`)
    }
  }

  /**
     * 表格下拉菜单
     */
  handleCommandChange(key:string|number, row:any) {
    this.id = row.lineId
    console.log(row)
    switch (key) {
      case 'edit':
        this.$router.push({ path: 'lineedit', query: { id: row.lineId } })
        break
      case 'copy':
        this.$router.push({ path: 'linecopy', query: { id: row.lineId } })
        break
      case 'audit':
        this.$router.push({ path: 'lineaudit', query: { id: row.lineId } })
        break
      case 'take':
        this.$router.push({ path: 'takepicture', query: { id: row.lineId } })
        break
      case 'showtender':
        this.$router.push({ path: 'showtender', query: { id: row.lineId } })
        break
      case 'showlog':
        this.$router.push({ path: 'showlog', query: { id: row.lineId } })
        break
      case 'putaway':
        this.showPutDio = true
        break
      case 'gowork':
        // this.workDio = true
        this.workDo(row.lineId)
        break
      case 'getaway':
        this.showGetDio = true
        break
      case 'linedetail':
        this.$router.push({ path: 'linedetail', query: { id: row.lineId } })
        break
      case 'showpic':
        this.$router.push({ path: 'showpicture', query: { id: row.lineId } })
        break
      case 'stopuse':
        this.useStop(row.lineId)
        break
      default:
        break
    }
  }
  private workDo(id:string) {
    this.$confirm('此操作将上岗, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      // id
      let { data } = await mountGuard({ lineId: 'XL202007180006' })
      if (data.success) {
        this.$message({
          type: 'success',
          message: '上岗成功!'
        })
      } else {
        this.$message.error(data.errorMsg || data)
      }
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消上岗'
      })
    })
  }

  private useStop(id:string) {
    this.$confirm('此操作将停用该线路, 是否继续?', '停用', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      let { data } = await manualDeactivate({ lineId: id })
      if (data.success) {
        this.$message({
          type: 'success',
          message: '停用成功!'
        })
      } else {
        this.$message.error(data.errorMsg || data)
      }
    })
  }

  // 上架操作
  private async putConfirm(done: any) {
    let params = {
      'deployNo': this.diaUpcarNum,
      'lineId': this.id,
      'waitDirveValidity': this.diaUpcar
    }
    let { data } = await shelfAdjustment(params)
    if (data.success) {
      done(this.$message.success('上架调整完成'))
    } else {
      this.$message.error(data.errorMsg || data)
    }
  }
  private putCancel(done: any) {
    this.$message.info('点击了取消')
    done()
  }

  // 下架操作
  private async getConfirm(done:any) {
    let { data } = await shelveLine({ lineId: this.id })
    if (data.success) {
      done(this.$message.success('下架完成'))
    } else {
      this.$message.error(data.errorMsg || data)
    }
    done()
  }
  private getCancel(done: any) {
    this.$message.info('点击了取消')
    done()
  }

  @Watch('checkList', { deep: true })
  private checkListChange(val:any) {
    this.columns = this.dropdownList.filter(item => val.includes(item.label))
  }

  // 处理tags方法
  private handleTags(value: any) {
    this.tags = value
  }

  // 处理query方法
  private handleQuery(value: any, key: any) {
    if (key === 'time' || key === 'jobTime') {
      this.listQuery[key] = []
    } else {
      this.listQuery[key] = value
    }
    this.getList()
  }

  // 处理选择日期方法
  private handleDate(value: any) {
    this.DateValue = value
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
