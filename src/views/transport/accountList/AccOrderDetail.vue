<template>
  <div :class="isPC ? 'AccountDetail' : 'AccountDetail-m' ">
    <div class="accountBox">
      <account-info
        :list-query="orderObj"
        :form-item="formItem"
      />
    </div>
    <div class="detailBox">
      <el-tabs
        v-model="activeName"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="抽佣明细"
          name="f1"
        >
          <!--table表单-->
          <div class="table_center">
            <el-table
              v-loading="listLoading"
              :data="list"
              :row-style="{height: '20px'}"
              :cell-style="{padding: '5px 0'}"
              size="mini"
              :max-height="isPC ? 'calc(100vh - 550px)' : 'calc(100vh - 140px)'"
              fit
              :border="isPC"
              stripe
              highlight-current-row
              style="width: 100%"
            >
              <el-table-column
                fixed
                align="left"
                label="运力编号"
              >
                <template slot-scope="scope">
                  <router-link
                    class="linkTo"
                    :to="{
                      path: '/transport/transportdetail',
                      query: {id: scope.row.customerId}
                    }"
                  >
                    <span>{{ scope.row.customerId }}</span>
                  </router-link>
                </template>
              </el-table-column>

              <el-table-column label="运力手机号">
                <template slot-scope="scope">
                  <span>{{ scope.row.customerName }} （{{ scope.row.cityName }})</span>
                </template>
              </el-table-column>

              <el-table-column
                class-name="status-col"
                label="订单编号"
              >
                <template slot-scope="{row}">
                  <router-link
                    class="linkTo"
                    :to="{
                      path: '/transport/transportdetail',
                      query: {id: row.customerId}
                    }"
                  >
                    <span>{{ row.customerId }}</span>
                  </router-link>
                </template>
              </el-table-column>

              <el-table-column
                align="left"
                label="标书"
              >
                <template slot-scope="{row}">
                  <router-link
                    class="linkTo"
                    :to="{
                      path: '/transport/transportdetail',
                      query: {id: row.customerId}
                    }"
                  >
                    <span>{{ row.customerId }}</span>
                  </router-link>
                </template>
              </el-table-column>

              <el-table-column
                align="left"
                label="线路名称"
              >
                <template slot-scope="scope">
                  <p>{{ scope.row.createDate | Timestamp }}</p>
                </template>
              </el-table-column>

              <el-table-column
                align="left"
                label="出车时间"
              >
                <template slot-scope="scope">
                  <p>{{ scope.row.createDate | Timestamp }}</p>
                </template>
              </el-table-column>

              <el-table-column
                align="left"
                label="运费"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.contractEnd | Timestamp }}</span>
                </template>
              </el-table-column>

              <el-table-column
                align="left"
                label="抽佣比例"
              >
                <template slot-scope="{row}">
                  {{ row.lineSaleName | DataIsNull }}
                </template>
              </el-table-column>
              <el-table-column
                align="left"
                label="抽佣金额"
              >
                <template slot-scope="{row}">
                  {{ row.lineSaleName | DataIsNull }}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            :operation-list="operationList"
            @pagination="getList"
          />
        </el-tab-pane>
        <el-tab-pane
          label="缴费明细"
          name="f2"
        >
          <div class="table_center">
            <el-table
              v-loading="payLoading"
              :data="payData"
              style="width: 100%"
              :row-style="{height: '20px'}"
              :cell-style="{padding: '5px 0'}"
              size="mini"
              fit
              :border="isPC"
              stripe
              highlight-current-row
            >
              <el-table-column
                prop="date"
                label="缴费渠道"
                width="180"
              />
              <el-table-column
                prop="name"
                label="交易编号（只有小程序有）"
                width="180"
              />
              <el-table-column
                prop="address"
                label="交易截图（只有线下有）"
              >
                <template slot-scope="scope">
                  <!-- <el-image
                    v-if="scope.row.payImageUrl"
                    style="width:50px;height:50px;"
                    :preview-src-list="[scope.row.payImageUrl]"
                    :src="scope.row.payImageUrl"
                  /> -->
                  <el-image
                    :a="scope"
                    style="width:50px;height:50px;"
                    :preview-src-list="['https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg']"
                    src="https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="缴费时间"
              />
              <el-table-column
                prop="address"
                label="缴费金额"
              />
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="退款明细"
          name="f3"
        >
          <div class="table_center">
            <el-table
              v-loading="outLoading"
              :data="outData"
              style="width: 100%"
              :row-style="{height: '20px'}"
              :cell-style="{padding: '5px 0'}"
              size="mini"
              fit
              :border="isPC"
              stripe
              highlight-current-row
            >
              <el-table-column
                prop="date"
                label="退款方式"
                width="180"
              />
              <el-table-column
                prop="address"
                label="退款原因"
              />
              <el-table-column
                prop="address"
                label="退款时间"
              />
              <el-table-column
                prop="address"
                label="退款金额"
              />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { GetCustomerList } from '@/api/customer'
import { SettingsModule } from '@/store/modules/settings'
import AccountInfo from './components/AccountInfo.vue'
import AccountOrder from './components/AccountOrder.vue'
import { HandlePages } from '@/utils/index'
import Pagination from '@/components/Pagination/index.vue'
import '@/styles/common.scss'
import { CargoListData } from '@/api/types'

interface IState {
  [key: string]: any;
}

  @Component({
    name: 'TransportList',
    components: {
      AccountInfo,
      Pagination,
      AccountOrder
    }
  })

export default class extends Vue {
  private activeName:string = 'f1'
  private listLoading:boolean = true
  private list: CargoListData[] = []
  private total = 0;
  private payLoading:boolean = true
  private outLoading:boolean = true
  private outData:any[] = []
  private payData:any[] = [
    {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }, {
      date: '2016-05-04',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1517 弄'
    }, {
      date: '2016-05-01',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1519 弄'
    }, {
      date: '2016-05-03',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1516 弄'
    }]
  private operationList: any[] = [{}]
  private listQuery: IState = {
    key: '',
    city: '',
    page: 1,
    limit: 30,
    endDate: '',
    startDate: '',
    state: '',
    lineSaleId: ''
  }

  private orderObj = {
    a: 'DD2062160325621',
    b: '梧桐共享',
    c: '带车',
    d: '4.2米厢货',
    e: '3个月',
    f: '￥4000.00',
    g: '6.5%',
    h: '2020-12-12',
    all: 200000,
    yong: 1000,
    yu: 3000
  }
  private formItem:any[] = [
    {
      type: 7,
      key: 'a',
      label: '订单编号:',
      col: 24,
      // class: 'font-bold',
      tagAttrs: {
        style: {
          fontWeight: 'bold',
          fontSize: '16px'
        }
      }
    },
    {
      type: 7,
      key: 'b',
      col: 8,
      label: '商品分类:'
    },
    {
      type: 7,
      key: 'c',
      col: 8,
      label: '合作模式:',
      slot: true
    },
    {
      key: 'd',
      type: 7,
      col: 8,
      label: '合作车型:'
    },
    {
      key: 'e',
      type: 7,
      col: 8,
      label: '合作期限:'
    },
    {
      key: 'f',
      type: 7,
      col: 8,
      label: '订单金额:'
    },
    {
      key: 'g',
      type: 7,
      col: 8,
      label: '抽佣比例:'
    },
    {
      key: 'h',
      type: 7,
      col: 8,
      label: '支付时间:'
    }
  ]

  // 所有请求方法
  private fetchData() {
    this.getList(this.listQuery)
    this.getPay()
    this.outPay()
  }

  handleClick(tab:any) {
    this.activeName = tab.name
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

  private getPay() {
    this.payLoading = false
  }

  private outPay() {
    this.outLoading = false
  }
  created() {
    this.fetchData()
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>

<style lang="scss" scoped>
.AccountDetail{
  // .font-bold{
  //   font-weight: bold;
  // }
  width: 100%;
  .accountBox{
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
    background-color: white;
  }
  .detailBox{
   padding: 20px;
    box-sizing: border-box;
    // background-color: white;
  }
}
</style>
<style lang="scss">
.AccountDetail-m {
  width: 100%;
}
</style>
<style scoped>
.AccountDetail >>> .operation-main,.AccountDetail-m >>> .operation-m{
  display: none;
}
.linkTo {
  color: #649cee;
  font-weight: bold;
  cursor: pointer;
}
.AccountDetail-m >>> .el-tabs__header{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
