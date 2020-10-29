<template>
  <div :class="isPC ? 'FreightList' : 'FreightList-m'">
    <FreightListForm
      :tab="tab"
      :dispatch="dispatchTab"
      :list-query="listQuery"
      :date-value="DateValue"
      :date-value2="DateValue2"
      @handle-tags="handleTags"
      @handle-check="handleCheck"
      @handle-query="getList"
    />
    <div class="table_box">
      <!--table表单-->
      <div
        class="table_center"
        :style="total > 0 ? '' : 'padding-bottom: 30px;'"
      >
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="list"
          :row-style="{height: '20px'}"
          :cell-style="{padding: '5px 0'}"
          size="mini"
          :max-height="tableHeight"
          fit
          :border="isPC"
          stripe
          highlight-current-row
          style="width: 100%"
          row-key="customerNo"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            :key="checkList.length + 'selectable'"
            fixed
            reserve-selection
            type="selection"
            width="55"
            :selectable="selectable"
          />
          <el-table-column
            :key="checkList.length + 'departureDate'"
            type="index"
            width="55"
            label="序号"
            :index="indexMethod('listQuery')"
            align="center"
          />
          <el-table-column
            v-if="checkList.indexOf('出车日期') > -1"
            :key="checkList.length + 'a'"
            align="left"
            label="出车日期"
            min-width="90"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.departureDate | TimestampYMD }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('出车单号') > -1"
            :key="checkList.length + 'wayBillId'"
            align="left"
            label="出车单号"
            min-width="130"
          >
            <template slot-scope="scope">
              <el-link
                type="primary"
                style="font-size: 12px;"
                @click="goDetail(scope.row.wayBillId)"
              >
                {{ scope.row.wayBillId | DataIsNull }}
              </el-link>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('司机姓名') > -1"
            :key="checkList.length + 'driverName'"
            align="left"
            label="司机姓名"
            min-width="145"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.driverName + '/' + scope.row.driverPhone | DataIsNull }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('线路名称') > -1"
            :key="checkList.length + 'lineId'"
            align="left"
            label="线路名称"
            min-width="150"
          >
            <template slot-scope="{row}">
              {{ row.lineName + '/' + row.lineId | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('客户名称') > -1"
            :key="checkList.length + 'customerClueName'"
            align="left"
            label="客户名称"
            min-width="100"
          >
            <template slot-scope="{row}">
              {{ row.customerClueName | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('项目名称') > -1"
            :key="checkList.length + 'projectName'"
            align="left"
            label="项目名称"
            min-width="100"
          >
            <template slot-scope="{row}">
              {{ row.projectName | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('出车状态') > -1"
            :key="checkList.length + 'departStatus'"
            align="left"
            label="出车状态"
          >
            <template slot-scope="{row}">
              {{ row.departStatus | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('运费金额') > -1"
            :key="checkList.length + 'floowData'"
            align="left"
            label="运费金额（元）"
            min-width="110"
          >
            <template slot-scope="{row}">
              <el-popover
                placement="right"
                trigger="hover"
                @show="getFloowData(row.wayBillId, 'confirm')"
              >
                <el-table
                  v-loading="floowLoading"
                  :data="floowData"
                  size="mini"
                >
                  <el-table-column
                    type="index"
                    width="55"
                    label="趟数"
                    align="center"
                  />
                  <el-table-column
                    width="150"
                    property="deliverTime"
                    label="时间段"
                  />
                  <el-table-column
                    width="100"
                    property="money"
                    label="运费"
                  />
                </el-table>
                <el-button
                  slot="reference"
                  type="text"
                >
                  <span v-if="row.status === 20 && row.departStatusCode !== 1">{{ Number(row.freightFee).toFixed(2) | DataIsNull }}</span>
                  <span v-if="row.status !== 20 && row.isLookFee === 1">{{ Number(row.freightFee).toFixed(2) | DataIsNull }}</span>
                </el-button>
              </el-popover>
              <span v-if="row.departStatusCode === 1">未出车</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('运费状态') > -1"
            :key="checkList.length + 'statusName'"
            align="left"
            label="运费状态"
            min-width="105"
          >
            <template slot-scope="{row}">
              <span v-if="row.status !== 5">
                {{ row.statusName | DataIsNull }}
              </span>
              <!-- <span v-if="row.status === 20 && row.gmcIsNoCar === 1">/ 未出车</span>
              <span v-if="row.status === 20 && row.gmcIsNoCar !== 1">/ {{ row.confirmMoney || 0 }}元</span>
              <span v-if="row.status === 40 && row.againIsNoCar === 1">/ 未出车</span>
              <span v-if="row.status === 40 && row.againIsNoCar !== 1">/ {{ row.againConfirmMoney || 0 }}元</span> -->
              <!-- <span v-if="(row.status === 20 || row.status === 40) && row.gmcIsNoCar === 1">/ 未出车</span>
              <span v-else-if="(row.status === 20 || row.status === 40) && row.againIsNoCar === 1">/ 未出车</span>
              <span v-if="(row.status === 20 || row.status === 40) && row.againIsNoCar !== 1 && row.againIsNoCar !== 1">{{ row.confirmMoney || 0 }}元</span> -->
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('预估运费') > -1"
            :key="checkList.length + 'predictCost'"
            align="left"
            label="预估运费(元)"
            min-width="100"
          >
            <template slot-scope="scope">
              <p>{{ Number(scope.row.predictCost).toFixed(2) | DataIsNull }}</p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('司机运费上报状态') > -1"
            :key="checkList.length + 'driverFreightFeeUpStatus'"
            align="left"
            label="司机运费上报状态"
            min-width="130"
          >
            <template slot-scope="{row}">
              {{ row.driverFreightFeeUpStatus | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('加盟侧运费') > -1 && getPermission('/canDriverFee')"
            :key="checkList.length + 'gmFee'"
            align="left"
            label="司机运费上报金额（元）"
            min-width="155"
          >
            <template slot-scope="scope">
              <el-popover
                v-if="scope.row.gmStatusCode !== 2"
                placement="right"
                trigger="hover"
                @show="getFloowData(scope.row.wayBillId, 'driver')"
              >
                <el-table
                  v-loading="floowLoading"
                  :data="floowData"
                  size="mini"
                >
                  <el-table-column
                    type="index"
                    width="55"
                    label="趟数"
                    align="center"
                  />
                  <el-table-column
                    width="150"
                    property="deliverTime"
                    label="时间段"
                  />
                  <el-table-column
                    width="100"
                    property="money"
                    label="运费"
                  />
                </el-table>
                <el-button
                  slot="reference"
                  type="text"
                >
                  <span v-if="scope.row.gmStatusCode === 1">{{ Number(scope.row.gmFee).toFixed(2) | DataIsNull }}</span>
                </el-button>
              </el-popover>
              <span v-else>未出车</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('客户运费上报状态') > -1"
            :key="checkList.length + 'customerFreightFeeUpStatus'"
            align="left"
            label="客户运费上报状态"
            min-width="120"
          >
            <template slot-scope="{row}">
              {{ row.customerFreightFeeUpStatus | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('外线侧运费') > -1 && getPermission('/canLineFee')"
            :key="checkList.length + 'lineFee'"
            align="left"
            label="客户运费上报金额（元）"
            min-width="160"
          >
            <template slot-scope="scope">
              <el-popover
                v-if="scope.row.lineStatusCode !== 2"
                placement="right"
                trigger="hover"
                @show="getFloowData(scope.row.wayBillId, 'line')"
              >
                <el-table
                  v-loading="floowLoading"
                  :data="floowData"
                  size="mini"
                >
                  <el-table-column
                    type="index"
                    width="55"
                    label="趟数"
                    align="center"
                  />
                  <el-table-column
                    width="150"
                    property="deliverTime"
                    label="时间段"
                  />
                  <el-table-column
                    width="100"
                    property="money"
                    label="运费"
                  />
                </el-table>
                <el-button
                  slot="reference"
                  type="text"
                >
                  <span v-if="scope.row.lineStatusCode === 1">{{ Number(scope.row.lineFee).toFixed(2) | DataIsNull }}</span>
                </el-button>
              </el-popover>
              <span v-else>未出车</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('有无差额') > -1"
            :key="checkList.length + 'feeDiffValue'"
            align="left"
            label="有无差额（元）"
            min-width="120"
          >
            <template slot-scope="{row}">
              {{ Number(row.feeDiffValue).toFixed(2) || 0 }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('加盟经理') > -1"
            :key="checkList.length + 'joinManagerName'"
            align="left"
            label="加盟经理"
            min-width="120"
          >
            <template slot-scope="{row}">
              {{ row.joinManagerName + '/' + row.joinManagerPhone | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('上岗经理') > -1"
            :key="checkList.length + 'dutyManagerName'"
            align="left"
            label="上岗经理"
            min-width="120"
          >
            <template slot-scope="{row}">
              <span>{{ row.dutyManagerName + '/' + row.dutyManagerPhone | DataIsNull }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('运费更新时间') > -1"
            :key="checkList.length + 'freightUpdate'"
            align="left"
            label="运费更新时间"
            min-width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.freightUpdate | Timestamp }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('操作') > -1"
            :key="checkList.length + 'status'"
            align="left"
            label="操作"
            fixed="right"
            show-overflow-tooltip
            :width="isPC ? 'auto' : '50'"
          >
            <template slot-scope="scope">
              <el-dropdown :trigger="isPC ? 'hover' : 'click'">
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
                  <!--
                    v-if="scope.row.canConfirm"
                  > -->
                  <el-dropdown-item
                    v-permission="['/v2/waybill/shipping/reportMoneyBatch']"
                    name="ownerlist_detail_dropdown"
                    @click.native="checkOption(scope.row.departureDate, scope.row.wayBillId)"
                  >
                    <!-- {{ scope.row.status === 10 ? '单边确认' : '交叉确认' }} -->
                    <div v-if="scope.row.status === 10">
                      <span
                        v-permission="['/v2/waybill/shipping/reportMoneyBatch']"
                      >单边确认</span>
                    </div>
                    <div v-if="scope.row.status === 30">
                      <span
                        v-permission="['/v2/waybill/shipping/reportMoneyBatch']"
                      >交叉确认</span>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-permission="['/v2/waybill/shipping/shippingDetail']"
                    name="ownerlist_detail_dropdown"
                    @click.native="goDetail(scope.row.wayBillId)"
                  >
                    详情
                  </el-dropdown-item>
                  <!-- <el-dropdown-item
                    name="ownerlist_edit_dropdown"
                    @click.native="goLog(scope.row.wayBillId)"
                  >
                    日志
                  </el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total > 0"
        :operation-list="operationList | isPermission"
        :small="true"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
        @olclick="olClicks"
      />
    </div>
    <PitchBox
      :drawer.sync="drawer"
      :drawer-list="multipleSelection"
      @deletDrawerList="deletDrawerList"
      @changeDrawer="changeDrawer"
    >
      <template slot-scope="slotProp">
        <span>{{ slotProp.item.bussinessName }}</span>
        <span>{{ slotProp.item.bussinessPhone }}</span>
        <span>{{ slotProp.item.cityName }}</span>
      </template>
    </PitchBox>

    <!-- 运费确认 -->
    <SelfDialog
      :visible.sync="assignShowDialogMin"
      :title="`运费确认`"
      :confirm-button-text="`确认`"
      :cancel-button-text="`取消`"
      :other-button-text="`未出车`"
      :show-other-button="true"
      :confirm="confirmAssignMin"
      :other="confirmAssignOtherMin"
      other-type="danger"
    >
      <DetailItem
        name="出车单号"
        :value="freightForm.list[0].wayBillId"
      />
      <DetailItem
        name="司机姓名/手机号"
        :value="freightForm.list[0].driverName + '/' + freightForm.list[0].driverPhone"
      />
      <el-form
        ref="freightForm"
        :model="freightForm"
      >
        <div
          v-for="(item, index) in freightForm.list"
          :key="index"
        >
          <el-form-item
            :label="`趟数` + (index + 1) + `: ` + item.deliverTime"
            :prop="'list[' + index + '].preMoney'"
            :rules="{required: true, message: '请输入金额', trigger: 'change'}"
          >
            <el-input
              v-model="item.preMoney"
              v-only-number="{min: 0, max: 999999.99, precision: 2}"
              placeholder="请输入"
              name="freight_price_input"
              maxlength="10"
              clearable
            />
          </el-form-item>
        </div>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="freightForm.remark"
            name="addclue_remark_input"
            type="textarea"
            :autosize="{minRows: 2, maxRows: 4}"
            placeholder="请输入"
            maxlength="100"
            clearable
          />
        </el-form-item>
      </el-form>
    </SelfDialog>

    <!-- 批量运费确认 -->
    <SelfDialog
      :visible.sync="assignShowDialog"
      :title="`批量运费确认`"
      :confirm-button-text="`全部提交`"
      :cancel-button-text="`取消`"
      :other-button-text="`全部未出车`"
      :show-other-button="true"
      :confirm="confirmAssign"
      :other="confirmAssignOther"
      other-type="danger"
    >
      <el-form
        ref="freightFormAll"
        :model="freightFormAll"
      >
        <el-alert
          class="mb10"
          :title="`已选中${multipleSelection.length}条出车单`"
          type="warning"
          :closable="false"
        />
        <div
          v-for="(item, itemindex) in freightFormAll.lists"
          :key="item.id"
          class="freightSelfDialog"
        >
          <div style="box-sizing:border-box;">
            <el-switch
              v-model="item.check"
              style="padding:25px 15px;display: block"
              active-color="#13ce66"
              inactive-color="#F56C6C"
              active-text="已出车"
              inactive-text="未出车"
            />
          </div>
          <DetailItem
            name="出车单号"
            :value="item.wayBillId"
          />
          <DetailItem
            name="司机姓名/手机号"
            :value="item.driverName + '/' + item.driverPhone"
          />
          <div
            v-if="item.check"
          >
            <el-form-item
              v-for="(i, index) in item.list"
              :key="index"
              :label="`趟数` + (index + 1) + `: ` + i.deliverTime"
              :prop="'lists[' + itemindex + '].list.' + index + '.preMoney'"
              :rules="{required: true, message: '请输入金额', trigger: 'change'}"
            >
              <el-input
                v-model="i.preMoney"
                v-only-number="{min: 0, max: 999999.99, precision: 2}"
                placeholder="请输入"
                name="freight_price_input"
                maxlength="10"
                type="number"
                clearable
              />
            </el-form-item>
          </div>
        </div>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="remarkAll"
            name="addclue_remark_input"
            type="textarea"
            :autosize="{minRows: 2, maxRows: 4}"
            placeholder="请输入"
            maxlength="100"
            clearable
          />
        </el-form-item>
      </el-form>
    </SelfDialog>
    <!--提示窗口-->
    <SelfDialog
      :visible.sync="showDialog.visible"
      :title="showDialog.title"
      :center="true"
      :confirm="confirm"
    >
      <p>{{ showDialog.text }}</p>
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { GetConfirmInfoList, ReportMoneyBatch, WayBillAmountDetail, NoCarBatch, freightTripMoney } from '@/api/freight'
import { GetFindBusinessPhone } from '@/api/cargo'
import { CargoListData } from '@/api/types'
import { HandlePages } from '@/utils/index'
import Pagination from '@/components/Pagination/index.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
import PitchBox from '@/components/PitchBox/index.vue'
import { FreightListForm } from './components'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'FreightList',
  components: {
    Pagination,
    SuggestContainer,
    TableHeader,
    FreightListForm,
    SelfDialog,
    SelfTable,
    DetailItem,
    PitchBox
  }
})
export default class extends Vue {
    private showDialog: any = {
      visible: false,
      title: '提示',
      text: '内容',
      name: ''
    };
    private drawer: boolean= false;
    private total = 0;
    private list: CargoListData[] = [];
    private page: Object | undefined = '';
    private listLoading = true;
    private tags: any[] = [];
    private templateRadio: any[] = []
    private DateValue: any[] = [];
    private DateValue2: any[] = [];
    private multipleSelection: any[] = []
    private operationList: any[] = [
      { icon: 'el-icon-finished', name: '运费确认', color: '#F2A33A', key: '3', pUrl: ['/v2/waybill/shipping/reportMoneyBatch'] },
      { icon: 'el-icon-circle-close', name: '清空选择', color: '#F56C6C', key: '2' }
    ];
    private dropdownList: any[] = [
      '出车日期',
      '出车单号',
      '司机姓名',
      '出车状态',
      '项目名称',
      '客户名称',
      '运费金额',
      '司机运费上报状态',
      '客户运费上报状态',
      '运费更新时间',
      '线路名称',
      '预估运费',
      '加盟侧运费',
      '外线侧运费',
      '有无差额',
      '运费状态',
      '加盟经理',
      '上岗经理',
      '操作'
    ];
    private checkList: any[] = this.dropdownList;
    private floowData: any[] = [];
    private floowLoading: Boolean = false;
    private tab: any[] = [
      {
        label: '全部',
        name: '',
        num: ''
      },
      // {
      //   label: '待上报',
      //   name: '5',
      //   num: ''
      // },
      {
        label: '待单边确认',
        name: '10',
        num: ''
      },
      {
        label: '单边已确认',
        name: '20',
        num: ''
      },
      {
        label: '待交叉确认',
        name: '30',
        num: ''
      },
      {
        label: '已交叉确认',
        name: '40',
        num: ''
      }
    ];
    private dispatchTab: any[] = [
      {
        label: '全部',
        name: '',
        num: ''
      },
      {
        label: '待出车',
        name: '0',
        num: ''
      },
      {
        label: '已出车',
        name: '2',
        num: ''
      },
      {
        label: '未出车',
        name: '1',
        num: ''
      }
    ];
    private listQuery: IState = {
      customer: '',
      customerCity: '',
      customerName: '',
      productName: '',
      driver: '',
      driverCity: '',
      dutyManagerId: '',
      page: 1,
      limit: 30,
      startDate: '',
      endDate: '',
      freightStartTime: '',
      freightEndTime: '',
      feeDiff: '',
      gmId: '',
      key: '',
      line: '',
      pageNumber: '',
      project: '',
      wayBillId: '',
      state: '',
      dispatchState: '',
      business: '',
      clientUpLoadState: '',
      driverUpLoadState: ''
    };
    private freightForm: any = {
      list: [
        {
          price: ''
        },
        {
          price: ''
        }
      ],
      remark: ''
    };
    private freightFormAll: any = { lists: [
      {
        list: [
          {
            price: ''
          },
          {
            price: ''
          }
        ]
      }
    ] }
    private freightRules: any = {
      price: [
        { required: true, message: '请输入金额', trigger: 'change' }
      ]
    };
    private saleId: any = '';
    private remarkAll: any = '';
    // 弹窗分配
    private dialogList: any[] = [];
    private dialogLoading: boolean= false;
    private multipleSelectionAssign: any[] = []
    private assignShowDialog: boolean= false;
    private assignShowDialogMin: boolean= false;
    // 弹窗分页
    private dialogTotal: number = 0;
    private dialogListQuery: IState = {
      page: 1,
      limit: 20
    };

    @Watch('checkList', { deep: true })
    private checkListChange(val:any) {
      this.$nextTick(() => {
        ((this.$refs['multipleTable']) as any).doLayout()
      })
    }

    private getPermission(role: any) {
      let permission = (localStorage as any).getItem('permission')
      if (!permission) {
        return false
      } else {
        let permissionArr = permission.split(',')
        if (permissionArr.indexOf(role) > -1) {
          return true
        } else {
          return false
        }
      }
    }

    // 判断是否是PC
    get isPC() {
      return SettingsModule.isPC
    }

    // table列表高度适配
    get tableHeight() {
      // let otherHeight = 590
      // let value = document.body.offsetHeight - otherHeight || document.documentElement.offsetHeight - otherHeight
      // return value
      return 'auto'
    }

    // 确认清除
    private confirm(done:any) {
      if (this.showDialog.name === '1') {
        (this.$refs.multipleTable as any).clearSelection()
        this.multipleSelection = []
      } else {
        this.assignShowDialog = true
      }
      done()
    }

    // 判断是否可以选中
    private selectable(row: any) {
      if (row.status === 40 || row.status === 20) {
        return false
      }
      // return row.canConfirm
      return true
    }

    // 所有请求方法
    private fetchData() {
      this.getList(this.listQuery)
    }

    // 处理tags方法
    private handleTags(value: any) {
      this.tags = value
    }

    // 处理check方法
    private handleCheck() {
      (this.$refs.multipleTable as any).clearSelection()
    }

    // 处理选择日期方法
    private handleDate(value: any, name: any) {
      if (name === 'startDate') {
        this.DateValue = value
      } else {
        this.DateValue2 = value
      }
    }

    // 处理是否展示运费确认的总按钮
    private handleChecked(arr: any) {
      let list = [
        { icon: 'el-icon-finished', name: '运费确认', color: '#F2A33A', key: '3', pUrl: ['/v2/waybill/reportMoneyBatch'] },
        { icon: 'el-icon-circle-close', name: '清空选择', color: '#F56C6C', key: '2' }
      ]
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].status === 10 || arr[i].status === 30) {
          this.operationList = list
          return true
        }
      }
      list.shift()
      this.operationList = list
    }

    // 请求列表
    private async getList(value: any) {
      this.listQuery.page = value.page
      this.listQuery.limit = value.limit
      this.listLoading = true
      const { data } = await GetConfirmInfoList(this.listQuery)
      if (data.success) {
        this.list = data.data
        this.handleChecked(data.data)
        // this.tab[0].num = data.title.all
        // this.tab[1].num = data.title.notReported
        // this.tab[2].num = data.title.toBeConfirmed
        // this.tab[3].num = data.title.confirmed
        // this.tab[4].num = data.title.secondToBeConfirmed
        // this.tab[5].num = data.title.secondConfirmed
        data.page = await HandlePages(data.page)
        this.total = data.page.total
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      } else {
        this.$message.error(data)
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      }
    }

    // 确认操作
    private async checkOption(time: any, id: any) {
      // let type = this.getWeekStartDate(time)
      let type = false
      if (type) {
        let endTime = this.getWednesdayDate(time)
        this.$alert('出车单可确认时间，为' + endTime, '提示', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      } else {
        const { data } = await WayBillAmountDetail([id])
        if (data.success) {
          this.freightForm.list = data.data
          this.assignShowDialogMin = true
          this.freightForm.remark = ''
        } else {
          this.$message.error(data.errorMsg)
        }
      }
    }

    // 按钮操作
    private goDetail(id: string | (string | null)[] | null | undefined) {
      let purl: any = localStorage.getItem('permission')
      if (purl) {
        let purlArr: any = purl.split(',')
        if (purlArr.indexOf('/v2/waybill/shipping/shippingDetail') < 0) {
          return
        }
      }
      this.$router.push({ name: 'FreightDetail', query: { id: id } })
    }

    // 跳转线索
    private goLog(id: string | (string | null)[] | null | undefined) {
      this.$router.push({ name: 'FreightLog', query: { id: id } })
    }

    // 批量操作
    private async olClicks(item: any) {
      if (item.key === '2') {
        if (this.multipleSelection.length) {
          this.showDialog = {
            visible: true,
            title: '清空确认',
            text: '确认清空所有选择吗？',
            name: '1'
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择出车单'
          })
        }
      } else if (item.key === '3') {
        if (this.multipleSelection.length) {
          let ids: any = []
          this.multipleSelection.forEach((i: any) => {
            ids.push(i.wayBillId)
          })
          const { data } = await WayBillAmountDetail(ids)
          if (data.success) {
            let ret: any = []
            let list: any = []
            let datas = data.data
            datas.forEach((i: any, index: any) => {
              // this.freightForm[index].list = i
              if (ret.indexOf(i.wayBillId) === -1) {
                ret.push(i.wayBillId)
                i.check = true
                i.list = []
                let lists = Object.assign({}, i)
                lists.list.push({
                  deliverTime: lists.deliverTime,
                  wayBillId: lists.wayBillId,
                  wayBillAmountId: lists.wayBillAmountId,
                  check: lists.check,
                  preMoney: lists.preMoney
                })
                list.push(lists)
              } else {
                list.forEach((e: any) => {
                  if (e.wayBillId === i.wayBillId) {
                    i.check = true
                    let lists = Object.assign({}, i)
                    e.list.push({
                      deliverTime: lists.deliverTime,
                      wayBillId: lists.wayBillId,
                      wayBillAmountId: lists.wayBillAmountId,
                      check: lists.check,
                      preMoney: lists.preMoney
                    })
                  }
                })
              }
            })
            this.freightFormAll.lists = list
            this.assignShowDialog = true
          } else {
            this.$message.error(data.errorMsg)
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择出车单'
          })
        }
      }
    }

    // table选择框
    private handleSelectionChange(val: any) {
      this.multipleSelection = val
    }

    // 关闭查看已选
    private changeDrawer(val: any) {
      this.drawer = val
    }

    // 删除选中项目
    private deletDrawerList(item:any, i:any) {
      (this.$refs.multipleTable as any).toggleRowSelection(item)
    }

    // 弹窗操作
    private async confirmAssignMin(done: any) {
      (this.$refs.freightForm as any).validate(async(valid: boolean) => {
        if (valid) {
          let moneysArr: any = []
          let wayBillAmountIdsArr: any = []
          this.freightForm.list.forEach((i: any) => {
            moneysArr.push(i.preMoney)
            wayBillAmountIdsArr.push(i.wayBillAmountId)
          })
          const { data } = await ReportMoneyBatch({
            moneys: moneysArr,
            wayBillAmountIds: wayBillAmountIdsArr
          }, this.freightForm.remark)
          if (data.success) {
            this.$message.success('提交成功')
            this.assignShowDialogMin = false
            this.reset()
            done()
          } else {
            this.$message.error(data.errorMsg)
          }
        }
      })
    }

    // 批量弹窗操作
    private async confirmAssign(done: any) {
      (this.$refs.freightFormAll as any).validate(async(valid: boolean) => {
        if (valid) {
          let moneysArr: any = []
          let wayBillAmountIdsArr: any = []
          let noCheck: any = []
          this.freightFormAll.lists.forEach((i: any) => {
            i.list.forEach((element: any) => {
              if (element.check) {
                moneysArr.push(element.preMoney)
                wayBillAmountIdsArr.push(element.wayBillAmountId)
              } else {
                noCheck.push(element.wayBillAmountId)
              }
            })
          })
          const { data } = await ReportMoneyBatch({
            moneys: moneysArr,
            wayBillAmountIds: wayBillAmountIdsArr
          }, this.remarkAll)
          if (data.success) {
            this.reset()
            this.$message.success('提交成功')
            this.assignShowDialog = false
            if (noCheck.length) {
              const { data } = await NoCarBatch(noCheck, this.remarkAll)
              if (data.success) {
                this.assignShowDialog = false
                done()
              } else {
                this.$message.error(data.errorMsg)
              }
            } else {
              done()
            }
          } else {
            this.$message.error(data.errorMsg)
          }
        }
      })
    }

    // 全部未出车
    private confirmAssignOther(done: any) {
      let noCheck: any = []
      this.freightFormAll.lists.forEach((i: any) => {
        noCheck.push(i.wayBillAmountId)
      })
      this.$alert('确定全部' + noCheck.length + '个出车，全部未出车！', '提示', {
        confirmButtonText: '确定',
        callback: async action => {
          const { data } = await NoCarBatch(noCheck, this.remarkAll)
          if (data.success) {
            this.$message.success('已成功操作全部未出车')
            this.assignShowDialogMin = false
            this.reset()
            done()
          } else {
            this.$message.error(data.errorMsg)
          }
        }
      })
    }

    // 未出车
    private async confirmAssignOtherMin(done: any) {
      let wayBillAmountIdsArr: any = []
      this.freightForm.list.forEach((i: any) => {
        wayBillAmountIdsArr.push(i.wayBillAmountId)
      })
      const { data } = await NoCarBatch(wayBillAmountIdsArr, this.freightForm.remark)
      if (data.success) {
        this.$message.success('已成功操作未出车')
        this.assignShowDialogMin = false
        this.reset()
        done()
      } else {
        this.$message.error(data.errorMsg)
      }
    }

    // 弹窗表格选中
    private handleSelectionDialog(val: any) {
      this.saleId = val
    }

    private async getFloowData(id: any, type: any) {
      this.floowData = []
      this.floowLoading = true
      const { data } = await freightTripMoney({ wayBillId: id })
      if (data.success) {
        let dataList: any = []
        data.data.forEach((element: any) => {
          if (element.reportedType === type) {
            dataList.push(element)
          }
        })
        this.floowLoading = false
        this.floowData = dataList
      } else {
        this.$message.error(data.errorMsg)
      }
    }

    // table index
    private indexMethod(type: string) {
      let page: number, limit: number
      if (type === 'listQuery') {
        ({ page, limit } = this.listQuery)
      } else if (type === 'dialogListQuery') {
        ({ page, limit } = this.listQuery)
      }
      return (index: number) => {
        return index + 1 + (page - 1) * limit
      }
    }

    // 获得本周的开始日期
    private getWeekStartDate(times: any) {
      let now = new Date() // 当前日期
      let nowDayOfWeek = now.getDay() // 今天本周的第几天
      let nowDay = now.getDate() // 当前日
      let nowMonth = now.getMonth() // 当前月
      let nowYear = now.getFullYear() // 当前年
      nowYear += (nowYear < 2000) ? 1900 : 0
      let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek).getTime()
      return !(times - weekStartDate < 0)
    }

    // 获得本周的开始日期
    private getWednesdayDate(times: any) {
      let now = new Date() // 当前日期
      let nowDayOfWeek = now.getDay() // 今天本周的第几天
      let nowDay = now.getDate() // 当前日
      let nowMonth = now.getMonth() // 当前月
      let nowYear = now.getFullYear() // 当前年
      nowYear += (nowYear < 2000) ? 1900 : 0
      return this.formatDate(new Date(nowYear, nowMonth, nowDay + 10 - nowDayOfWeek))
    }

    // 重制
    private reset() {
      for (let key in this.listQuery) {
        if (key !== 'page' && key !== 'limit' && key !== 'state') {
          this.listQuery[key] = ''
        }
      }
      this.handleCheck() // 处理选择checked
      this.getList(this.listQuery)
    }

    // 格式化日期：yyyy-MM-dd
    private formatDate(date: any) {
      var myyear = date.getFullYear()
      var mymonth = date.getMonth() + 1
      var myweekday = date.getDate()

      if (mymonth < 10) {
        mymonth = '0' + mymonth
      }
      if (myweekday < 10) {
        myweekday = '0' + myweekday
      }
      return (myyear + '-' + mymonth + '-' + myweekday)
    }
    // 截取备注
    private splice(value: any) {
      return value.slice(0, 16)
    }

    // 生命周期
    created() {
      let wayBillId = this.$route.query.wayBillId
      if (wayBillId) this.listQuery.wayBillId = wayBillId
      this.fetchData()
    }

    activated() {
      this.$nextTick(() => {
        ((this.$refs['multipleTable']) as any).doLayout()
      })
    }
}
</script>

<style lang="scss">
.FreightList {
  padding: 15px;
  // padding-bottom: 0;
  box-sizing: border-box;
  .btn-item {
    background: #649cee;
    border-radius: 4px;
    border-radius: 4px;
    border: none;
    margin: 0 10px;
  }
  .btn-item-filtrate {
    background: #ffa000;
    border-radius: 4px;
    border-radius: 4px;
    border: none;
  }
  .table_box {
    // height: calc(100vh - 225px) !important;
    background: #ffffff;
    // border: 1px solid #dfe6ec;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      // height: calc(100vh - 360px) !important;
      padding: 30px 30px 0;
      box-sizing: border-box;
      background: #ffffff;
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
  .pagination-container {
    background: #fff;
  }
  .freightSelfDialog{
    padding-bottom: 15px;
    border-bottom: 1px solid #eeeeee;
    box-sizing: border-box;
  }
}
</style>

<style lang="scss" scoped>
.FreightList-m {
  padding-bottom: 0;
  box-sizing: border-box;
  .btn-item-m {
    background: #649cee;
    border-radius: 4px;
    border-radius: 4px;
    border: none;
    margin: 0 10px;
  }
  .btn-item-filtrate-m {
    background: #ffa000;
    border-radius: 4px;
    border-radius: 4px;
    border: none;
  }
  .table_box {
    // height: calc(100vh - 183px) !important;
    background: #ffffff;
    // border: 1px solid #dfe6ec;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      // height: calc(100vh - 300px) !important;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
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
  .pagination-container {
    background: #f8f9fa;
  }
  .el-table th.gutter {
    display: table-cell !important
  }
}
</style>

<style lang="scss" scope>
.el-collapse-item__content {
  padding-bottom: 0;
}

.el-form-item__content{
  font-size: 13px;
}

.el-form-item__label {
  color: #999999;
}

.redio-label{
  .el-radio__label{
    display: none;
  }
}

.el-dialog__body{
  max-height: 60vh;
  overflow: auto;
}
</style>
