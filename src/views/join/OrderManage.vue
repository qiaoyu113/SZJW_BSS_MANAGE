<template>
  <div :class="isPC ? 'OrderManage' : 'OrderManage-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-date="handleDate"
      @handle-query="handleQuery"
    >
      <OrderManageForm
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

        <el-button
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          type="primary"
          size="small"
          name="cluelist_creat_btn"
          @click="$router.push({name: 'CreatOrder'})"
        >
          <i class="el-icon-plus" />
          <span v-if="isPC">创建订单</span>
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
              <span>{{ scope.row.diverName | DataIsNull }} </span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('订单状态') > -1"
            :key="checkList.length + '3'"
            align="left"
            label="订单状态"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.statusName | DataIsNull }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('合作模式') > -1"
            :key="checkList.length + '4'"
            align="left"
            label="合作模式"
          >
            <template slot-scope="{row}">
              {{ row.cooperationModelName | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('商品分类') > -1"
            :key="checkList.length + '5'"
            align="left"
            label="商品分类"
          >
            <template slot-scope="scope">
              <p>{{ scope.row.busiTypeName | DataIsNull }}</p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('订单金额') > -1"
            :key="checkList.length + '6'"
            align="left"
            label="订单金额"
          >
            <template slot-scope="scope">
              <p>
                <span>{{ scope.row.goodsAmount | DataIsNull }}</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('合作期限') > -1"
            :key="checkList.length + '7'"
            align="left"
            label="合作期限(月)"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.cooperationTime | DataIsNull }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('支付方式') > -1"
            :key="checkList.length + '8'"
            align="left"
            label="支付方式"
          >
            <template slot-scope="{row}">
              {{ row.payTypeName | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('城市') > -1"
            :key="checkList.length + '9'"
            align="left"
            label="城市"
          >
            <template slot-scope="{row}">
              {{ row.cityName | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('加盟经理') > -1"
            :key="checkList.length + '10'"
            align="left"
            label="加盟经理"
          >
            <template slot-scope="{row}">
              {{ row.joinManageName | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('创建人') > -1"
            :key="checkList.length + '11'"
            align="left"
            label="创建人"
          >
            <template slot-scope="{row}">
              {{ row.createName | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('订单创建时间') > -1"
            :key="checkList.length + '12'"
            align="left"
            label="订单创建时间"
          >
            <template slot-scope="{row}">
              {{ row.createDate | Timestamp }}
            </template>
          </el-table-column>

          <el-table-column
            :key="checkList.length + '13'"
            align="left"
            label="操作"
            fixed="right"
            :width="isPC ? '100' : '50'"
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
                  <el-dropdown-item
                    v-if="scope.row.status === 5"
                    @click.native="goCreat(scope.row, true)"
                  >
                    提交
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status === 5"
                    @click.native="cancelHandle(scope.row)"
                  >
                    取消
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status === 15 && scope.row.payType !== 1"
                    @click.native="goCheck(scope.row.orderId, 1)"
                  >
                    确认
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status === 20"
                    @click.native="goCheck(scope.row.orderId, 0)"
                  >
                    审核
                  </el-dropdown-item>
                  <!-- <el-dropdown-item
                    @click.native="refundHandle(scope.row)"
                  >
                    退款
                  </el-dropdown-item> -->
                  <el-dropdown-item
                    v-if="scope.row.status === 25"
                    @click.native="goCreat(scope.row, false)"
                  >
                    重新提交审核
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="goDetail(scope.row.orderId, 1)"
                  >
                    详情
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="goDetail(scope.row.orderId, 0)"
                  >
                    日志
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

    <!-- 订单退款审核 -->
    <Dialog
      :visible.sync="assignShowDialog"
      :title="`订单退款审核`"
      :confirm="confirmAssign"
    >
      <el-row>
        <el-form
          ref="refundDetail"
          :model="refundDetail"
          :rules="rules"
          :label-width="isPC ? '120px' : '30%'"
          class="refundForm"
        >
          <el-col :span="isPC ? 24 : 24">
            <DetailItem
              name="订单金额"
              :value="refundDetail.price"
            />
          </el-col>
          <el-col :span="isPC ? 24 : 24">
            <DetailItem
              name="订单金额"
              :value="refundDetail.price"
            />
          </el-col>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item label="退款金额">
              <el-input
                v-model="refundDetail.orderId"
                placeholder="请输入退款金额"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item label="退款原因">
              <el-select
                v-model="refundDetail.groupId"
                placeholder="请选择所属小组"
              >
                <el-option
                  v-for="item in optionsSource"
                  :key="item.codeVal"
                  :label="item.code"
                  :value="item.codeVal"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item label="退款方式">
              <el-select
                v-model="refundDetail.groupId"
                placeholder="请选择退款方式"
              >
                <el-option
                  v-for="item in optionsWay"
                  :key="item.codeVal"
                  :label="item.code"
                  :value="item.codeVal"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item
              ref="uploadElement"
              label="退款截图（截图中需要含有交易流水编号、收据等有效证明，图片支持PNG/JPEG/JPG格式，最大限制为5M)"
              prop="payImageUrl"
            >
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                action="/index/upload"
                :before-upload="beforeUpload"
                :on-change="handleChange"
                :auto-upload="false"
                :data="refundDetail"
              >
                <img
                  v-if="refundDetail.payImageUrl"
                  :src="refundDetail.payImageUrl"
                  style="width:100%;"
                >
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  circle
                />
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 24 : 24">
            <el-form-item
              label="备注"
              prop="remarks"
            >
              <el-input
                v-model="refundDetail.remarks"
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </Dialog>
    <!--提示窗口-->
    <Dialog
      :visible.sync="showDialog.visible"
      :title="showDialog.title"
      :center="true"
      :confirm="confirm"
    >
      <p>{{ showDialog.text }}</p>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { GetOrderInfoList, CancelOrder, OrderExport } from '@/api/join'
import { CargoListData } from '@/api/types'
import { HandlePages } from '@/utils/index'
import Pagination from '@/components/Pagination/index.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import SelfTable from '@/components/base/SelfTable.vue'
import PitchBox from '@/components/PitchBox/index.vue'
import { OrderManageForm } from './components'
import { SettingsModule } from '@/store/modules/settings'
import DetailItem from '@/components/DetailItem/index.vue'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'OrderManage',
  components: {
    Pagination,
    SuggestContainer,
    TableHeader,
    OrderManageForm,
    Dialog,
    SelfTable,
    PitchBox,
    DetailItem
  }
})
export default class extends Vue {
    private showDialog: any= {
      visible: false,
      title: '提示',
      text: '内容',
      name: ''
    };
    private refundDetail: any = {}
    private cancelId: any = ''
    private drawer: boolean= false;
    private total = 0;
    private list: CargoListData[] = [];
    private page: Object | undefined = '';
    private listLoading = true;
    private tags: any[] = [];
    private optionsSource: any[] = []
    private optionsWay: any[] = []
    private DateValue: any[] = [];
    private multipleSelection: any[] = []
    private operationList: any[] = [];
    private rules:any = {
      busiType: [
        { required: true, message: '请选择商品分类', trigger: 'change' }
      ],
      cooperationModel: [
        { required: true, message: '请选择合作模式', trigger: 'change' }
      ]
    }
    private dropdownList: any[] = [
      '订单编号',
      '司机姓名',
      '订单状态',
      '合作模式',
      '商品分类',
      '订单金额',
      '合作期限',
      '支付方式',
      '城市',
      '加盟经理',
      '创建人',
      '订单创建时间',
      '操作'
    ];
    private checkList: any[] = this.dropdownList;
    private tab: any[] = [
      {
        label: '全部',
        name: '',
        num: ''
      },
      {
        label: '待支付',
        name: '5',
        num: ''
      },
      {
        label: '待确认',
        name: '15',
        num: ''
      },
      {
        label: '待审核',
        name: '20',
        num: ''
      },
      {
        label: '审核不通过',
        name: '25',
        num: ''
      },
      {
        label: '已成交',
        name: '30',
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
      state: '',
      lineSaleId: '',

      busiType: '',
      busiTypeName: '',
      cityName: '',
      cooperationModel: '',
      cooperationModelName: '',
      createDate: '',
      createId: '',
      createName: '',
      createSource: '',
      createSourceName: '',
      deliverDate: '',
      diverName: '',
      driverId: '',
      driverPhone: '',
      groupName: '',
      isDeliver: '',
      joinManageId: '',
      joinManageName: '',
      orderId: '',
      payType: '',
      payTypeName: '',
      statusName: ''
    };
    // 弹窗分配
    private dialogList: any[] = [];
    private dialogLoading: boolean= false;
    private multipleSelectionAssign: any[] = []
    private assignShowDialog: boolean= false;
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

    // 图片预加载
    private beforeUpload(file: any) {
      return true
    }

    // 请求列表
    private async getList(value: any) {
      this.listQuery.page = value.page
      this.listQuery.limit = value.limit
      this.listLoading = true
      const { data } = await GetOrderInfoList(this.listQuery)
      if (data.success) {
        this.list = data.data
        if (data.title) {
          this.tab[0].num = data.title.all
          this.tab[1].num = data.title.toBePay
          this.tab[2].num = data.title.toConfire
          this.tab[3].num = data.title.toAudit
          this.tab[4].num = data.title.auditNotPass
          this.tab[5].num = data.title.haveDeal
        }
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

    // 获取弹窗list
    async getDialogList(value: any) {
      this.dialogListQuery.page = value.page
      this.dialogListQuery.limit = value.limit
      this.dialogLoading = true
      const { data } = await GetOrderInfoList(this.dialogListQuery)
      if (data.success) {
        this.dialogList = data.data
        this.dialogTotal = data.page.total
      } else {
        this.$message.error(data)
      }
      setTimeout(() => {
        this.dialogLoading = false
      }, 0.5 * 1000)
    }

    // 详情加日志操作
    private goDetail(id: string | (string | null)[] | null | undefined, type: any) {
      if (type) {
        this.$router.push({ name: 'OrderDetail', query: { id: id } })
      } else {
        this.$router.push({ name: 'OrderLog', query: { id: id } })
      }
    }

    // 提交 重新提交
    private goCreat(detail: any, type: any) {
      if (type) {
        this.$router.push({ name: 'CreatOrder', query: { id: detail.orderId } })
      } else {
        if (detail.createSource === 1) {
          this.$router.push({ name: 'CreatOrder', query: { id: detail.orderId } })
        } else {
          this.$router.push({ name: 'OrderCheck', query: { id: detail.orderId } })
        }
      }
    }

    // 确认和审核按钮
    private goCheck(id: string | (string | null)[] | null | undefined, type: any) {
      if (type) {
        this.$router.push({ name: 'OrderCheck', query: { id: id } })
      } else {
        this.$router.push({ name: 'OrderAudit', query: { id: id } })
      }
    }

    // 弹窗操作
    private confirmAssign(done: any) {
      // 提交操作
      if (this.multipleSelectionAssign.length) {
        this.assignShowDialog = false
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择货主再进行操作！'
        })
      }
      // done()
    }

    // 弹窗确认
    private confirm(done:any) {
      if (this.showDialog.name === '1') {
        this.cancelPost()
      } else {
        this.assignShowDialog = true
        this.getDialogList(this.dialogListQuery)
      }
      done()
    }

    // 选择图片
    private handleChange(file: any, fileList: any) {
      this.refundDetail.payImageUrl = URL.createObjectURL(file.raw)
    }

    // 取消操作
    private cancelHandle(detail: any) {
      this.showDialog = {
        visible: true,
        title: '取消订单',
        text: '确认取消订单吗？如果存在意向金金额，请下线进行退款!',
        name: '1'
      }
      this.cancelId = detail
    }
    // 订单退款审核
    private refundHandle(data: any) {
      this.refundDetail = data
      this.assignShowDialog = true
    }

    // 取消请求
    private async cancelPost() {
      const { data } = await CancelOrder({
        orderId: this.cancelId.orderId,
        operateFlag: 'cancel',
        'status': this.cancelId.status,
        'cooperationModel': this.cancelId.cooperationModel,
        'createSource': this.cancelId.createSource,
        'driverId': this.cancelId.driverId
      })
      if (data.success) {
        this.$message.success('订单取消成功')
        this.list = []
        this.fetchData()
      } else {
        this.$message.error(data.errorMsg)
      }
    }

    // 导出
    private async downLoad() {
      const postData = this.listQuery
      // delete postData.page
      // delete postData.limit
      const { data } = await OrderExport(postData)
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

<style lang="scss">
.OrderManage {
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
  .refundForm{
    .el-form-item{
        padding: 0 15px;
        box-sizing: border-box;
      }
      .el-form-item__label{
          width: 100% !important;
          font-size: 13px;
          color: #9e9e9e;
          font-weight: 400;
          text-align: left;
      }
      .el-form-item__content{
          padding-right: 35px;
          margin-left: 0px !important;
      }
  }
}
</style>

<style lang="scss">
.OrderManage-m {
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
  .refundForm{
    .el-form-item__label{
        color: #4a4a4a;
        font-weight: 400;
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
