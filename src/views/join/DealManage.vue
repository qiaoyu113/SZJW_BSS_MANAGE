<template>
  <div :class="isPC ? 'DealManage' : 'DealManage-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-date="handleDate"
      @handle-query="handleQuery"
    >
      <DealManageForm
        :list-query="listQuery"
        :date-value="DateValue"
        @handle-tags="handleTags"
        @handle-query="getList"
      />
    </SuggestContainer>

    <div class="table_box">
      <!--操作栏-->
      <TableHeader
        :tab="tab"
        :active-name="listQuery.state"
      >
        <el-button
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          type="primary"
          size="small"
          name="cluelist_creat_btn"
          @click="downLoad"
        >
          <i class="el-icon-download" />
          <span v-if="isPC">导出</span>
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
                :key="item"
              >
                <el-checkbox :label="item" />
              </el-dropdown-item>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </TableHeader>

      <!--table表单-->
      <div class="table_center">
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="list"
          :row-style="{height: '20px'}"
          :cell-style="{padding: '5px 0'}"
          size="mini"
          :height="'100%'"
          fit
          :border="isPC"
          stripe
          highlight-current-row
          style="width: 100%"
          row-key="customerNo"
        >
          <el-table-column
            v-if="checkList.indexOf('订单编号') > -1"
            :key="checkList.length + '1'"
            align="left"
            fixed
            label="订单编号"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.orderId | DataIsNull }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('司机姓名') > -1"
            :key="checkList.length + '2'"
            align="left"
            label="司机姓名"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.diverName | DataIsNull }} ({{ scope.row.driverPhone | DataIsNull }}) </span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('城市') > -1"
            :key="checkList.length + '3'"
            align="left"
            label="城市"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.cityName | DataIsNull }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('加盟经理') > -1"
            :key="checkList.length + '4'"
            align="left"
            label="加盟经理"
          >
            <template slot-scope="{row}">
              {{ row.joinManageName | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('交付状态') > -1"
            :key="checkList.length + '5'"
            align="left"
            label="交付状态"
          >
            <template slot-scope="scope">
              <p>
                <span v-if="scope.row.isDeliver === 1">已交付</span>
                <span v-else-if="scope.row.isDeliver === 0">待交付</span>
                <span v-else>暂无数据</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('车牌号') > -1"
            :key="checkList.length + '6'"
            align="left"
            label="车牌号"
          >
            <template slot-scope="scope">
              <p>
                <span>{{ scope.row.plateNo | DataIsNull }}</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('操作人') > -1"
            :key="checkList.length + '7'"
            align="left"
            label="操作人"
          >
            <template slot-scope="scope">
              <p>
                <span>{{ scope.row.deliverName | DataIsNull }}</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('交付完成时间') > -1"
            :key="checkList.length + '8'"
            align="left"
            label="交付完成时间"
          >
            <template slot-scope="scope">
              <p>
                <span>{{ scope.row.deliverDate | Timestamp }}</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('操作') > -1"
            :key="checkList.length + '9'"
            align="left"
            label="操作"
            fixed="right"
            :width="isPC ? 'auto' : '50'"
          >
            <template slot-scope="scope">
              <el-dropdown>
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
                  <!-- v-if="(scope.row.status === 30 || scope.row.status === 35 || scope.row.status === 40) && scope.row.isDeliver === 0" -->
                  <el-dropdown-item
                    v-if="scope.row.isDeliver === 0"
                    @click.native="goDetail(scope.row.orderId, 1)"
                  >
                    交付
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.isDeliver === 1"
                    @click.native="goDetail(scope.row.orderId, 2)"
                  >
                    详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total > 0"
        :operation-list="operationList"
        :small="true"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { GetDelieverList, DelieverExportDown } from '@/api/join'
import { CargoListData } from '@/api/types'
import { HandlePages } from '@/utils/index'
import Pagination from '@/components/Pagination/index.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { DealManageForm } from './components'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'DealManage',
  components: {
    Pagination,
    SuggestContainer,
    TableHeader,
    DealManageForm,
    SelfDialog
  }
})
export default class extends Vue {
    private showDialog: Object= {
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
    private DateValue: any[] = [];
    private multipleSelection: any[] = []
    private operationList: any[] = [];
    private dropdownList: any[] = [
      '订单编号',
      '司机姓名',
      '城市',
      '加盟经理',
      '交付状态',
      '车牌号',
      '操作人',
      '交付完成时间',
      '操作'
    ];
    private checkList: any[] = this.dropdownList;
    private tab: any[] = [
      {
        label: '全部',
        name: '99',
        num: ''
      },
      {
        label: '待交付',
        name: '0',
        num: ''
      },
      {
        label: '已交付',
        name: '1',
        num: ''
      }
    ];
    private listQuery: IState = {
      key: '',
      city: '',
      page: 1,
      limit: 30,
      endDate: '',
      startDate: '',
      state: '99',
      lineSaleId: '',
      'busiType': '',
      'cooperationModel': '',
      'createDate': '',
      'createId': '',
      'createSource': '',
      'deliverDate': '',
      'diverName': '',
      'driverId': '',
      'isDeliver': '',
      'joinManageId': '',
      'orderId': '',
      'pageNumber': '',
      'payType': '',
      'status': ''
    };

    @Watch('checkList', { deep: true })
    private checkListChange(val:any) {
      this.$nextTick(() => {
        ((this.$refs['multipleTable']) as any).doLayout()
      })
    }

    created() {
      this.fetchData()
    }

    mounted() {}

    activated() {
    // this.handleScroll()
    }

    // 判断是否是PC
    get isPC() {
      return SettingsModule.isPC
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
      this.listQuery[key] = value
      this.fetchData()
    }

    // 处理选择日期方法
    private handleDate(value: any) {
      this.DateValue = value
    }

    // 请求列表
    private async getList(value: any) {
      this.listQuery.page = value.page
      this.listQuery.limit = value.limit
      this.listLoading = true
      const { data } = await GetDelieverList(this.listQuery)
      if (data.success) {
        this.list = data.data
        this.tab[0].num = data.title.all
        this.tab[1].num = data.title.notDelivered
        this.tab[2].num = data.title.delivered
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

    // 按钮操作-查看详情
    private goDetail(id: string | (string | null)[] | null | undefined, type: number) {
      if (type === 1) {
        this.$router.push({ name: 'DealForm', query: { id: id } })
      } else {
        this.$router.push({ name: 'DealManageDetail', query: { id: id } })
      }
    }

    // private filterObj(obj:any) {
    //   let result: any = {}
    //   Object.keys(obj).filter((key) => obj[key] !== '').forEach((key) => {
    //     result[key] = obj[key]
    //   })
    //   return result
    // }
    // 导出
    private async downLoad() {
      const postData = this.listQuery
      // delete postData.page
      // delete postData.limit
      const { data } = await DelieverExportDown(postData)
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
    private download(data: any, name: any) {
      if (!data) {
        return
      }
      let url = window.URL.createObjectURL(new Blob([data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
    }
}
</script>

<style lang="scss" scoped>
.DealManage {
  padding: 15px;
  padding-bottom: 0;
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
    height: calc(100vh - 225px) !important;
    background: #ffffff;
    // border: 1px solid #dfe6ec;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      height: calc(100vh - 340px) !important;
      padding: 0 30px;
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
    background: #fff;
  }
}
</style>

<style lang="scss" scoped>
.DealManage-m {
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
    height: calc(100vh - 183px) !important;
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
.el-collapse-item__content {
  padding-bottom: 0;
}

.el-form-item__label {
  color: #999999;
}
</style>
