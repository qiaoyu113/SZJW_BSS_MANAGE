<template>
  <div :class="isPC ? 'AccountDetail' : 'AccountDetail-m' ">
    <div class="accountBox">
      <account-info
        :list-query="accountObj"
        :form-item="formItem"
      />
    </div>
    <div class="detailBox">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="抽样明细"
          name="f1"
        >
          <!--table表单-->
          <el-card>
            <div class="table_center">
              <el-table
                v-loading="listLoading"
                :data="list"
                :row-style="{height: '20px'}"
                :cell-style="{padding: '5px 0'}"
                size="mini"
                :height="isPC ? 'calc(100vh - 550px)' : 'calc(100vh - 140px)'"
                fit
                :border="isPC"
                stripe
                highlight-current-row
                style="width: 100%"
              >
                <el-table-column
                  fixed
                  align="left"
                  label="货主编号"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.customerId }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  label="货主"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.customerName }} （{{ scope.row.cityName }})</span>
                  </template>
                </el-table-column>

                <el-table-column
                  class-name="status-col"
                  label="类型"
                >
                  <template slot-scope="{row}">
                    <el-tag :type="row.status | articleStatusFilter">
                      {{ row.primaryClassificationName
                      }}<span
                        v-if="row.secondaryClassificationName"
                      >/{{ row.secondaryClassificationName }}</span>
                    </el-tag>
                  </template>
                </el-table-column>

                <el-table-column
                  align="left"
                  label="合同状态"
                >
                  <template slot-scope="{row}">
                    {{ row.contractEffectiveness }}
                  </template>
                </el-table-column>

                <el-table-column
                  align="left"
                  label="创建时间"
                >
                  <template slot-scope="scope">
                    <p>{{ scope.row.createDate | Timestamp }}</p>
                  </template>
                </el-table-column>

                <el-table-column
                  align="left"
                  label="创建人"
                >
                  <template slot-scope="scope">
                    <p>
                      <span
                        v-if="scope.row.creatorName"
                      >({{ scope.row.creatorName }})</span>
                    </p>
                  </template>
                </el-table-column>

                <el-table-column
                  align="left"
                  label="合同止期"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.contractEnd | Timestamp }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  align="left"
                  label="线路销售"
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
          </el-card>
        </el-tab-pane>
        <el-tab-pane
          label="订单"
          name="f2"
        >
          <template
            v-for="(item,index) in list"
          >
            <account-order
              :key="index"
              :item="item"
            />
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { GetCustomerList } from '@/api/customer'
import { SettingsModule } from '@/store/modules/settings'
import AccountInfo from './components/accountInfo.vue'
import { HandlePages } from '@/utils/index'
import accountOrder from './components/accountOrder.vue'
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
      accountOrder
    }
  })

export default class extends Vue {
  private activeName:string = 'f2'
  private listLoading = true
  private list: CargoListData[] = []
  private total = 0;
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

  private accountObj = {
    name: '穆家祥',
    a: '20200709313331',
    b: '15021578502',
    c: '北京市',
    d: '4.2米厢货',
    e: '共享一组、专车二组',
    f: '李威山',
    g: 100000,
    h: 100,
    i: 200000
  }
  private formItem:any[] = [
    {
      key: 'a',
      label: '司机编号:',
      slot: true,
      type: 'detail',
      col: 8
    },
    {
      type: 7,
      key: 'b',
      col: 8,
      label: '联系方式:'
    },
    {
      type: 7,
      key: 'c',
      col: 8,
      label: '工作城市:',
      slot: true
    },
    {
      key: 'd',
      type: 7,
      col: 8,
      label: '业务线:'
    },
    {
      key: 'e',
      type: 7,
      col: 8,
      label: '加盟小组:'
    },
    {
      key: 'f',
      type: 7,
      col: 8,
      label: '加盟经理:'
    }
  ]

  // 所有请求方法
  private fetchData() {
    this.getList(this.listQuery)
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
</style>
