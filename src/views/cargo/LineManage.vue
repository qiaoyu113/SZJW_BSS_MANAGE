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
        ref="lineForm"
        class="lineForm"
        :list-query="listQuery"
        :form-item="formItem"
        label-width="100px"
      >
        <div
          slot="btn"
          :class="isPC ? 'btnPc' : 'btnPc-m'"
        >
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            size="small"
            name="linemanage_reset_btn"
            @click="handleResetClick"
          >
            重置
          </el-button>
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            type="primary"
            size="small"
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
        :active-name="listQuery.shelvesState"
      >
        <template v-slot:left>
          <div>
            <span>
              统计：已查询到
              <span
                class="numCol"
                v-text="title.all"
              />
              条线路，总计可上岗
              <span
                class="numCol"
                v-text="title.canMountGuardNo"
              />
              个，已上岗
              <span
                class="numCol"
                v-text="title.mountGuardNo"
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
              v-permission="['/v1/line/lineInfo/lineExport']"
              :class="isPC ? 'btn-item' : 'btn-item-m'"
              type="primary"
              size="small"
              name="LineManage_downLoad_btn"
              @click="downLoad"
            >
              <i class="el-icon-download" />
              <span v-if="isPC">导出</span>
            </el-button>
            <el-button
              v-permission="['/v1/line/create']"
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
          :func="chooseBox"
          @olclick="handleOlClick"
          @onPageSize="handlePageSize"
          @selection-change="handleChange"
        >
          <template v-slot:lineId="scope">
            <span
              class="linkTo"
              @click="goDetail(scope.row.lineId)"
            >{{ scope.row.lineId }}</span>
          </template>
          <template v-slot:createDate="scope">
            {{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
          <template v-slot:busiType="scope">
            {{ scope.row.busiType === 0 ? '专车':'共享' }}
          </template>
          <template v-slot:carNum="scope">
            {{ scope.row.mountGuardNo }}/{{ scope.row.deployNo }}
          </template>
          <template v-slot:operate="scope">
            <el-dropdown
              :trigger="isPC ? 'hover' : 'click'"
              @command="(e) =>
                handleCommandChange(e,scope.row)"
            >
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
                  v-if="[3].includes(scope.row.shelvesState)"
                  v-permission="['/v1/line/edit']"
                  command="edit"
                >
                  <template>
                    编辑
                  </template>
                </el-dropdown-item>
                <el-dropdown-item
                  permission="['/v1/line/saveOrUpdatePicture']"
                  command="take"
                >
                  <template>
                    拍照
                  </template>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="[3].includes(scope.row.shelvesState)"
                  v-permission="['/v1/line/manualDeactivate']"
                  command="stopuse"
                >
                  <template>
                    停用
                  </template>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="[2].includes(scope.row.shelvesState)"
                  v-permission="['/v1/line/mountGuard']"
                  command="gowork"
                >
                  <template>
                    上岗
                  </template>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="[2].includes(scope.row.shelvesState)"
                  v-permission="['/v1/line/shelfAdjustment']"
                  command="putaway"
                >
                  <template>
                    上架调整
                  </template>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="[2].includes(scope.row.shelvesState)"
                  v-permission="['/v1/line/shelveLine']"
                  command="getaway"
                >
                  <template>
                    下架
                  </template>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="[1,2,3,4].includes(scope.row.shelvesState)"
                  v-permission="['/v1/line/copy']"
                  command="copy"
                >
                  <template>
                    复制
                  </template>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="[1].includes(scope.row.shelvesState)"
                  v-permission="['/v1/line/approved']"
                  command="audit"
                >
                  <template>
                    审核
                  </template>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template v-slot:detail="scope">
            <el-dropdown
              :trigger="isPC ? 'hover' : 'click'"
              @command="(e) => handleCommandChange(e,scope.row)"
            >
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
                  class="el-icon-view"
                />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-permission="['/v1/line/detail']"
                  command="linedetail"
                >
                  <template>
                    查看线路详情
                  </template>
                </el-dropdown-item>
                <el-dropdown-item
                  v-permission="['/v1/line/pictureDetail']"
                  command="showpic"
                >
                  <template>
                    查看线路照片
                  </template>
                </el-dropdown-item>
                <el-dropdown-item
                  v-permission="['/v1/line/customer/queryLineCustomerList']"
                  command="showtender"
                >
                  <template>
                    查看全部标书
                  </template>
                </el-dropdown-item>
                <el-dropdown-item
                  v-permission="['/v1/line/list']"
                  command="showlog"
                >
                  <template>
                    操作日志
                  </template>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>

          <template v-slot:lineName="scope">
            <span>{{ scope.row.lineName }}</span>
            <img
              v-if="scope.row.shelvesState === 4"
              class="overshop"
              src="https://oss-qzn.yunniao.cn/img/1b819fc72e5a4153b749ff46dbe9ac19"
              alt=""
            >
          </template>
        </self-table>
      </div>
    </div>
    <!-- 上架 -->
    <SelfDialog
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
            value-format="timestamp"
          />
        </div>
        <div class="dioBox">
          <span>可上车数：</span>
          <el-input
            v-model="diaUpcarNum"
            type="number"
            :min="rowInfo.mountGuardNo"
            placeholder="请输入可上车数量"
          />
        </div>
        <p class="dioBox">
          目前有效期至：{{ rowInfo.waitDirveValidity | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </p>
        <p class="dioBox">
          目前已上车数量：{{ rowInfo.mountGuardNo }}辆
        </p>
      </div>
    </SelfDialog>

    <!-- 下架 -->
    <SelfDialog
      :visible.sync="showGetDio"
      :title="`下架`"
      :center="true"
      :cancel="getCancel"
      :confirm="getConfirm"
    >
      <div>
        <div class="dioBox">
          <p class="dioBox">
            线路编号：{{ rowInfo.lineId }}
          </p>
          <p class="dioBox">
            已上车数量：{{ rowInfo.mountGuardNo }}辆
          </p>
          <p class="dioBox">
            是否确认将此线路失效？
          </p>
        </div>
      </div>
    </SelfDialog>

    <!-- 审核拒绝原因 -->
    <SelfDialog
      :visible.sync="passNo"
      :title="`拒绝原因`"
      :center="true"
      :cancel="passCancel"
      :confirm="passConfirm"
    >
      <div>
        <div class="dioBox">
          <el-form
            ref="form"
            label-width="80px"
          >
            <el-form-item label="原因">
              <el-input
                v-model="reason"
                type="textarea"
                placeholder="请至少输入5个字符"
                minlength="5"
                maxlength="100"
                rows="5"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </SelfDialog>

    <PitchBox
      :drawer.sync="drawer"
      :drawer-list="rows"
      @deletDrawerList="deletDrawerList"
      @changeDrawer="changeDrawer"
    >
      <template slot-scope="slotProp">
        <span>{{ slotProp.item.lineName }}</span>
        <span>{{ slotProp.item.lineSaleName }}</span>
      </template>
    </PitchBox>
  </div>
</template>
<script lang="ts">
import { delayTime } from '@/settings'
import { getLabel } from '@/utils/index.ts'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { HandlePages, parseTime } from '@/utils/index'
import {
  manualDeactivate,
  shelfAdjustment,
  mountGuard,
  shelveLine,
  lineListAll,
  customerCheckNames,
  fuzzyCheckNames,
  lineExport,
  batchApproved,
  batchNoApproved
} from '@/api/cargo'
import Pagination from '@/components/Pagination/index.vue'
import BettwenTitle from '@/components/TableHeader/BettwenTitle.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import {
  GetDictionaryList,
  GetOpenCityData,
  GetCityByCode,
  GetManagerLists
} from '@/api/common'
import SelfTable from '@/components/base/SelfTable.vue'
import PitchBox from '@/components/PitchBox/index.vue'
import '@/styles/common.scss'

interface PageObj {
  page: Number;
  limit: Number;
  total?: Number;
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
    SelfDialog,
    PitchBox
  }
})
export default class LineManage extends Vue {
  private rowInfo: any = {};
  private id: string = '';
  private diaUpcar: string = '';
  private diaUpcarNum: string = '';
  private tab: any[] = [
    {
      label: '全部',
      name: '',
      id: 0,
      num: 0
    },
    {
      label: '待上架',
      name: '1',
      id: 1,
      num: 0
    },
    {
      label: '已上架',
      name: '2',
      id: 2,
      num: 0
    },
    {
      label: '已售罄',
      name: '4',
      id: 4,
      num: 0
    },
    {
      label: '已下架',
      name: '3',
      id: 3,
      num: 0
    },
    {
      label: '已停用',
      name: '5',
      id: 5,
      num: 0
    }
  ];
  private title: any = {
    all: 0,
    waitShelvesNum: 0,
    isShelvesNum: 0,
    noShelvesNum: 0,
    soldNum: 0,
    disableNum: 0
  };
  private total = 0;
  private list: any[] = [];
  private limit: number = 20;
  private listLoading = false;
  private tags: any[] = [];
  private DateValue: any[] = [];
  private operationList: any[] = [
    { icon: 'el-icon-finished', name: '查看选中', color: '#F2A33A' },
    { icon: 'el-icon-circle-close', name: '清空选择', color: '#5E7BBB' }
  ];
  private dropdownList: any[] = [];
  private checkList: any[] = this.dropdownList;
  private customerLoading: boolean = false;
  private formItem: any[] = [
    {
      type: 2,
      key: 'city',
      label: '工作城市',
      tagAttrs: {
        placeholder: '请选择工作城市'
      },
      options: []
    },
    {
      type: 2,
      key: 'lineSaleId',
      label: '线路销售',
      tagAttrs: {
        placeholder: '请选择线路销售',
        filterable: true
      },
      options: []
    },
    // {
    //   type: 2,
    //   key: 'auditState',
    //   label: '审核状态',
    //   tagAttrs: {
    //     clearable: true,
    //     placeholder: '请选择审核状态'
    //   },
    //   options: []
    // },
    {
      type: 2,
      label: '选择车型',
      key: 'carType',
      tagAttrs: {
        placeholder: '请选择车型',
        filterable: true
      },
      options: []
    },
    {
      type: 11,
      label: '线路名称',
      key: 'lineName',
      tagAttrs: {
        placeholder: '请输入线路名称',
        clearable: true,
        'fetch-suggestions': this.remoteMethodName
      }
    },
    {
      type: 1,
      label: '线路编号',
      key: 'lineId',
      tagAttrs: {
        placeholder: '请输入线路编号',
        clearable: true
      }
    },
    {
      type: 11,
      label: '货主名称',
      key: 'customerName',
      tagAttrs: {
        clearable: true,
        placeholder: '请输入货主名称',
        'fetch-suggestions': this.remoteMethod
      }
    },
    {
      type: 8,
      key: 'houseAddress',
      label: '配送区域:',
      tagAttrs: {
        ref: 'cascader',
        placeholder: '请输入配送区域',
        clearable: true,
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
        clearable: true,
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
      key: 'time',
      tagAttrs: {
        'picker-options': {
          disabledDate(time: any) {
            return (
              time.getTime() < Date.now() - 18 * 30 * 86400000 ||
              time.getTime() > Date.now() + 18 * 30 * 86400000
            )
          }
        }
      }
    },
    {
      col: 12,
      label: '工作开始时间段',
      w: '130px',
      type: 12,
      key: 'jobTime'
    }
  ];
  private showPutDio: boolean = false;
  private showGetDio: boolean = false;
  private tableData: any[] = [];
  private columns: any[] = [
    {
      key: 'lineId',
      label: '线路编号',
      slot: true,
      width: '160px',
      disabled: true
    },
    {
      key: 'lineName',
      label: '线路名称',
      slot: true
    },
    {
      key: 'lineSaleName',
      label: '所属销售',
      disabled: true
    },
    {
      key: 'carNum',
      label: '上车数（已上车）/可上车',
      slot: true,
      disabled: true
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
      width: '160px',
      label: '选择车型'
    },
    {
      key: 'cargoTypeName',
      label: '货物类型'
    },
    {
      key: 'dayNo',
      label: '每日配送数'
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
      width: '160px',
      label: '仓库位置'
    },
    {
      key: 'stabilityRateName',
      width: '160px',
      label: '线路稳定性'
    },
    {
      key: 'shelvesStateName',
      label: '上架状态'
    },
    {
      key: 'lineSourceName',
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
      width: this.isPC ? '100px' : '50px',
      slot: true,
      disabled: true
    },
    {
      disabled: true,
      fixed: 'right',
      width: this.isPC ? '100px' : '50px',
      key: 'detail',
      slot: true,
      label: '详情'
    }
  ];
  private passNo:boolean = false
  private reason:string = ''
  private listQuery: IState = {
    city: '',
    shelvesState: '',
    lineSaleId: '',
    // auditState: '',
    carType: '',
    lineName: '',
    lineId: '',
    customerName: '',
    houseAddress: [],
    returnWarehouse: '',
    time: [],
    // jobTime: [Date.now(),Date.now()],
    jobTime: {
      jobStartDate: '',
      jobEndDate: ''
    },
    jobStartDate: '',
    jobEndDate: ''
  };
  private page: PageObj = {
    page: 1,
    limit: 10,
    total: 0
  };

  @Watch('checkList', { deep: true })
  private checkListChange(val: any) {
    this.columns = this.dropdownList.filter(item => val.includes(item.label))
  }
  get isPC() {
    return SettingsModule.isPC
  }

  // 时间处理方法
  private pickerOptions: any = {
    disabledDate(time: any) {
      return (
        time.getTime() < Date.now() ||
        time.getTime() > Date.now() + 41 * 86400000
      )
    }
  };

  // 下载方法
  private async downLoad() {
    const postData = this.listQuery
    // delete postData.page
    // delete postData.limit
    const { data } = await lineExport(postData)
    if (data.success) {
      this.$message({
        type: 'success',
        message: '导出成功!'
      })
      // const fileName = headers['content-disposition'].split('fileName=')[1]
      // this.download(data, decodeURI(fileName))
    } else {
      this.$message.error(data.errorMsg)
    }
  }

  // 货主模糊查询
  private async remoteMethod(query: string, cb: Function) {
    if (query !== '') {
      let params = {
        customerCompanyName: query
      }
      let { data } = await customerCheckNames(params)
      if (data.success) {
        let options = data.data.map(function(ele: any) {
          return {
            value: ele.customerCompanyName,
            label: ele.customerCompanyName
          }
        })
        cb(options)
      } else {
        this.$message.error(data.data.errorMsg)
      }
    } else {
      cb()
    }
  }

  // 线路名称模糊查询
  private async remoteMethodName(query: string, cb: Function) {
    if (query !== '') {
      let params = {
        lineName: query
      }
      let { data } = await fuzzyCheckNames(params)
      if (data.success) {
        let options = data.data.map(function(ele: any) {
          return { label: ele.lineName, value: ele.lineName }
        })
        cb(options)
      } else {
        this.$message.error(data.data.errorMsg)
      }
    } else {
      cb()
    }
  }

  /**
   * 省市县3级联动
   */
  private async getLineArea(node: any, resolve: any) {
    let params: string[] = []
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
  private async loadCityByCode(params: string[]) {
    try {
      let { data: res } = await GetCityByCode(params)
      if (res.success) {
        const nodes = res.data.map(function(item: any) {
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
  private handleResetClick() {
    this.tags = []
    this.listQuery = {
      city: '',
      shelvesState: '',
      lineSaleId: '',
      // auditState: '',
      carType: '',
      lineName: '',
      lineId: '',
      customerName: '',
      houseAddress: [],
      returnWarehouse: '',
      time: [],
      jobTime: {
        jobStartDate: '',
        jobEndDate: ''
      },
      jobStartDate: '',
      jobEndDate: ''
    }
    this.getList()
  }
  /**
   *筛选按钮
   */
  private handleFilterClick() {
    let blackLists = ['shelvesState']
    this.tags = []
    if (this.listQuery.houseAddress.length !== 0) {
      let address: any =
        (this.$refs.lineForm as any).$refs.cascader[0].getCheckedNodes()[0]
          .pathLabels || undefined
      if (address) {
        let addressLabel = address.join('-')
        this.tags.push({
          key: 'houseAddress',
          name: addressLabel,
          type: 'info'
        })
      }
    }
    for (let key in this.listQuery) {
      if (
        this.listQuery[key] !== '' &&
        this.tags.findIndex(item => item.key === key) === -1 &&
        !blackLists.includes(key)
      ) {
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
  private handlePageSize(page: any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }

  private async dicList() {
    // , 'line_audit_state'
    let params = ['Intentional_compartment']
    let { data: res } = await GetDictionaryList(params)
    if (res.success) {
      // eslint-disable-next-line camelcase
      let { Intentional_compartment, line_audit_state } = res.data
      let cartype = Intentional_compartment.map(function(ele: any) {
        return { value: Number(ele.dictValue), label: ele.dictLabel }
      })
      this.formItem.map(ele => {
        if (ele.key === 'carType') {
          ele.options = cartype
        }
      })
    } else {
      this.$message.error(res.errorMsg)
    }
    this.getLowerStaffInfo()
    let city = await GetOpenCityData()
    if (city.data.success) {
      let arr = city.data.data.map(function(ele: any) {
        return { value: ele.code, label: ele.name }
      })
      this.formItem.map(ele => {
        if (ele.key === 'city') {
          ele.options = arr
        }
      })
    } else {
      this.$message.error(city.data.errorMsg)
    }
  }

  private async getLowerStaffInfo() {
    try {
      let paramsUrl = {
        uri: '/v1/line/lineInfo/queryLineListByConditionsQuery'
      }
      let { data: res } = await GetManagerLists(paramsUrl)
      if (res.success) {
        if (res.data.length > 1) {
          this.operationList.push({ icon: 'el-icon-view', name: '批量审核通过', color: '#978374' })
          this.operationList.push({ icon: 'el-icon-view', name: '批量审核不通过', color: '#978374' })
        }
        this.formItem.map(ele => {
          if (ele.key === 'lineSaleId') {
            ele.options = res.data.map(function(ele: any) {
              return { value: Number(ele.id), label: ele.name }
            })
          }
        })
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }

  private goDetail(id: string) {
    this.$router.push({ path: '/cargo/linedetail', query: { id: id } })
  }
  // 请求列表
  private async getList() {
    try {
      this.listLoading = true
      let params: any = {
        city: this.listQuery.city,
        lineSaleId: this.listQuery.lineSaleId,
        // auditState: this.listQuery.auditState,
        carType: this.listQuery.carType,
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
      this.listQuery.shelvesState &&
        (params.shelvesState = this.listQuery.shelvesState)
      if (this.listQuery.time.length > 0) {
        params.startDate = this.listQuery.time[0]
        params.endDate = this.listQuery.time[1] + 86399999
      }
      // if (this.listQuery.jobTime.length > 0) {
      //   params.jobStartDate = parseTime(this.listQuery.jobTime[0], '{h}:{i}')
      //   params.jobEndDate = parseTime(this.listQuery.jobTime[1], '{h}:{i}')
      // }
      console.log(this.listQuery)
      params.jobEndDate = this.listQuery.jobTime.jobEndDate
      params.jobStartDate = this.listQuery.jobTime.jobStartDate
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
  private handleCommandChange(key: string | number, row: any) {
    this.id = row.lineId
    this.rowInfo = row
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
        this.$router.push({
          path: 'takepicture',
          query: { lineId: row.lineId }
        })
        break
      case 'showtender':
        this.$router.push({ path: 'showtender', query: { id: row.lineId } })
        break
      case 'showlog':
        this.$router.push({ path: 'showlog', query: { id: row.lineId } })
        break
      case 'putaway':
        this.showPutDio = true
        this.diaUpcar = row.waitDirveValidity
        this.diaUpcarNum = row.deployNo
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
        this.$router.push({
          path: 'showpicture',
          query: { id: row.id, lineId: row.lineId }
        })
        break
      case 'stopuse':
        this.useStop(row.lineId)
        break
      default:
        break
    }
  }

  private workDo(id: string) {
    this.$confirm('此操作将上岗, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async() => {
        let { data } = await mountGuard({ lineId: id })
        if (data.success) {
          this.$message({
            type: 'success',
            message: '上岗成功!'
          })
          setTimeout(() => {
            this.getList()
          }, delayTime)
        } else {
          this.$message.error(data.errorMsg || data)
        }
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上岗'
        })
      })
  }

  private useStop(id: string) {
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
        setTimeout(() => {
          this.getList()
        }, delayTime)
      } else {
        this.$message.error(data.errorMsg || data)
      }
    })
  }

  // 上架操作
  private async putConfirm(done: any) {
    if (Number(this.diaUpcarNum) < Number(this.rowInfo.mountGuardNo)) {
      this.$message.error('可上车数要大于或等于已上岗标书数量')
      return
    }
    if (this.diaUpcarNum === '') {
      this.diaUpcarNum = this.rowInfo.deployNo
    }
    if (Number(this.diaUpcarNum) >= 11 || Number(this.diaUpcarNum) <= 0) {
      this.$message.error('可上车数只能在0至11之间')
      return
    }
    let params = {
      deployNo: this.diaUpcarNum,
      lineId: this.id,
      waitDirveValidity: this.diaUpcar
    }
    let { data } = await shelfAdjustment(params)
    if (data.success) {
      setTimeout(() => {
        this.getList()
      }, delayTime)
      done(
        this.$message.success('上架调整完成'),
        (this.diaUpcarNum = ''),
        (this.diaUpcar = ''),
        (this.id = '')
      )
    } else {
      this.$message.error(data.errorMsg || data)
    }
  }

  private putCancel(done: any) {
    this.$message.info('点击了取消')
    done((this.diaUpcarNum = ''), (this.diaUpcar = ''), (this.id = ''))
  }

  // 下架操作
  private async getConfirm(done: any) {
    let { data } = await shelveLine({ lineId: this.id })
    if (data.success) {
      done(this.$message.success('下架完成'))
      setTimeout(() => {
        this.getList()
      }, delayTime)
    } else {
      this.$message.error(data.errorMsg || data)
    }
    done()
  }
  private getCancel(done: any) {
    this.$message.info('点击了取消')
    done()
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
    this.listQuery.shelvesState = value
    this.getList()
  }

  // 处理选择日期方法
  private handleDate(value: any) {
    this.DateValue = value
  }

  private goCreat() {
    this.$router.push('creatline')
  }

  // ------------下面区域是批量操作的功能,其他页面使用直接复制-------------
  private drawer: boolean = false;
  /**
   *当前页勾选中的数组集合
   */
  private rows: any[] = [];
  // 删除选中项目
  private deletDrawerList(item: any, i: any) {
    let arr: any[] = [item];
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
  private handleOlClick(val: any) {
    if (val.name === '查看选中') {
      if (this.rows.length > 0) {
        this.drawer = true
      } else {
        this.$message.error('请先选择')
      }
    } else if (val.name === '清空选择') {
      (this.$refs.LineManageTable as any).toggleRowSelection()
    } else if (val.name === '批量审核通过') {
      this.allApproved(this.rows)
    } else if (val.name === '批量审核不通过') {
      this.passNo = true
    }
  }

  private async allApproved(params:any) {
    if (this.rows.length === 0) {
      return this.$message.error('请选择相应线路')
    }
    let lineArray = params.map((ele:any) => {
      return ele.lineId
    })
    let { data } = await batchApproved(lineArray)
    if (data.success) {
      this.$message.success('批量审核成功')
      setTimeout(() => {
        this.getList()
      }, delayTime)
    } else {
      this.$message.error(data.errorMsg)
    }
  }

  private async noApproved(params:any, bodyParams:any) {
    let { data } = await batchNoApproved(params, bodyParams)
    if (data.success) {
      this.$message.success('批量审核不通过成功')
      setTimeout(() => {
        this.getList()
      }, delayTime)
    } else {
      this.$message.error(data.errorMsg)
    }
  }

  // 批量禁用状态处理
  private chooseBox(row: any, index: number) {
    if (row.shelvesState !== 1) {
      return false // 禁用状态
    } else {
      return true // 非禁用状态
    }
  }

  private passCancel(done: any) {
    done(this.reason = '')
  }

  private passConfirm(done: any) {
    if (this.rows.length === 0) {
      return this.$message.error('请选择相应线路')
    }
    if (this.reason !== '' && this.reason.length < 5) {
      return this.$message.error('拒绝原因应大于5个字符，或不填写')
    }
    let lineArray = this.rows.map((ele:any) => {
      return ele.lineId
    })

    let params = {
      reason: this.reason
    }
    done(this.noApproved(params, lineArray))
  }

  /**
   * 勾选表格
   */
  handleChange(row: any) {
    this.rows = row
  }
  // ------------上面区域是批量操作的功能,其他页面使用直接复制-------------

  mounted() {
    this.dropdownList = [...this.columns]
    this.checkList = this.dropdownList.map(item => item.label)
    this.dicList()
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/_variables.scss";
.LineManage {
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  .btn-item-left {
    border-radius: 4px;
    border: none;
    margin-right: 10px;
  }
  .btn-item-right {
    border-radius: 4px;
    border: none;
    margin-left: 10px;
  }
  .btn-main-color {
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
      .linkTo {
        color: #649cee;
        cursor: pointer;
      }
      height: calc(100vh - 300px) !important;
      padding: 0px;
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
  .overshop {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 0;
    left: 0;
  }
  .dioBox {
    margin-bottom: 20px;
    padding: 0 20px;
    .el-input {
      width: 200px !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.LineManage-m {
  padding-bottom: 0;
  box-sizing: border-box;
  .btnPc-m {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .btn-item-right-m {
    border-radius: 4px;
    border: none;
    margin-right: 10px;
  }
  .btn-item-left-m {
    border-radius: 4px;
    border: none;
    // margin-left: 10px;
  }
  .btn-item-filtrate-m {
    background: #ffa000;
    border-radius: 4px;
    border-radius: 4px;
    border: none;
  }
  .btn-main-color-m {
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
      .linkTo {
        color: #649cee;
      }
      // height: calc(100vh - 360px) !important;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
      overflow-y: scroll;
    }
  }
  .overshop {
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
.numCol {
  color: #649cee;
  margin: 0 !important;
}
.btn-main-color {
  border: 1px solid $main-btn;
  color: $main-btn;
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
  margin-left: 0px!important;
  margin-top: 10px;
  width: 80%;
}
</style>
<style scoped>
.LineManage .lineForm >>> .timeSelect .el-input__inner{
  width: 90%;
}
.LineManage >>> .el-collapse-item__wrap {
  padding: 20px 30px 0 0;
  box-sizing: border-box;
  position: absolute;
  z-index: 1000;
  background: #fff;
  box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.85);
  right: 15px;
  left: 15px;
}
</style>
