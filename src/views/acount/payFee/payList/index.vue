<template>
  <div
    class="payList"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      ref="searchForm"
      :list-query="listQuery"
      :form-item="formItem"
      :rules="searchRules"
      label-width="80px"
      class="p15"
    >
      <div
        slot="btn1"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
        <el-button
          type="primary"
          :class="isPC ? '' : 'btnMobile'"
          name="driverlist_query_btn"
          size="small"
          @click="handleQueryClick"
        >
          筛选
        </el-button>
        <el-button
          :class="isPC ? '' : 'btnMobile'"
          name="driverlist_reset_btn"
          size="small"
          @click="handleResetClick"
        >
          重置
        </el-button>
      </div>

      <div
        slot="statusBox"
        class="tableTitle"
      >
        <div class="statusBox">
          <div class="btnBox">
            <el-badge
              v-for="(item,index) in statusOptions"
              :key="index"
              :value="item.num"
              class="item"
            >
              <el-button
                size="small"
                :plain="item.value !== listQuery.status"
                :type="index === active ? 'primary' : 'default' "
                @click="changeStatus(item,index)"
              >
                {{ item.label }}
              </el-button>
            </el-badge>
          </div>
        </div>
        <el-button
          size="small"
          type="primary"
          @click="goRoute('addPay')"
        >
          新建缴费
        </el-button>
      </div>
    </self-form>
    <!-- 表头 -->

    <div class="table_box">
      <div class="middle">
        <div
          class="count"
          v-text="`筛选结果（${page.total}条）`"
        />
      </div>
      <!-- 表格 -->
      <self-table
        ref="driverListTable"
        v-loading="listLoading"
        :indexes="true"
        height="calc(100vh - 550px)"
        :index="false"
        :operation-list="[]"
        :table-data="tableData"
        :columns="columns"
        :page="page"
        @onPageSize="handlePageSize"
      >
        <template v-slot:createDate="scope">
          {{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
        <template v-slot:op="scope">
          <div>
            <span
              class="doItem"
              @click="goRoute('payDetail',scope.row.driverId)"
            >详情</span>
            <span
              class="doItem"
              @click="goRoute('payAudit',scope.row.driverId)"
            >审核</span>
          </div>
        </template>
      </self-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
import SelfTable from '@/components/Base/SelfTable.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import { getLabel, phoneRegExp, IdRegExp } from '@/utils/index.ts'
import { GetConfirmInfoList } from '@/api/freight'
import { delayTime } from '@/settings.ts'
import { HandlePages, phoneReg } from '@/utils/index'
import { GetManagerLists, GetOpenCityData } from '@/api/common'
interface IState {
  [key: string]: any;
}
interface PageObj {
  page: Number;
  limit: Number;
  total?: Number;
}

interface Tab {
  label: String;
  name: String;
  id: Number;
  num?: Number | undefined;
}

@Component({
  name: 'payList',
  components: {
    SelfForm,
    SelfTable,
    TableHeader
  }
})
export default class extends Vue {
  private active: number = 0;
  private listLoading: boolean = false; // loading
  private tags: any[] = []; // 回显label
  private type: string = ''; // 修改加盟经理or分配加盟经理
  private statusOptions: any[] = [
    { label: '全部', value: '', num: '' },
    { label: '待审核', value: 0, num: '' },
    { label: '审核通过', value: 1, num: '' },
    { label: '审核未通过', value: 2, num: '' }
  ];
  private workCityOptions: any[] = []; // 工作城市列表
  private gmOptions: any[] = []; // 加盟经理列表
  private pageTitle: any = {
    all: '',
    toAudit: '',
    passAudit: '',
    noAudit: ''
  };
  // 表单对象
  private listQuery: IState = {
    payId: '',
    workCity: '',
    driverId: '',
    name: '',
    phone: '',
    gmId: '',
    status: '',
    time: []
  };
  private searchRules: any = {
    payId: [{ validator: this.checkID, trigger: 'blur' }],
    driverId: [{ validator: this.checkID, trigger: 'blur' }],
    phone: [{ validator: this.checkPhone, trigger: 'blur' }]
  };
  // 表单数组
  private formItem: any[] = [
    {
      type: 1,
      key: 'payId',
      label: '缴费编号',
      col: 8,
      tagAttrs: {
        placeholder: '请输入司机编号',
        maxlength: 20,
        'show-word-limit': true,
        clearable: true,
        name: 'driverList_driverId_input'
      }
    },
    {
      type: 1,
      key: 'driverId',
      label: '司机编号',
      col: 8,
      tagAttrs: {
        placeholder: '请输入司机编号',
        maxlength: 20,
        'show-word-limit': true,
        clearable: true,
        name: 'driverList_driverId_input'
      }
    },
    {
      type: 1,
      key: 'name',
      col: 8,
      label: '司机姓名',
      tagAttrs: {
        placeholder: '请输入姓名',
        maxlength: 10,
        'show-word-limit': true,
        clearable: true,
        name: 'driverList_name_input'
      }
    },
    {
      type: 1,
      col: 8,
      key: 'phone',
      label: '联系电话',
      tagAttrs: {
        placeholder: '请输入手机号',
        maxlength: 11,
        clearable: true,
        // type: 'number',
        name: 'driverList_phone_input'
      }
    },
    {
      type: 2,
      key: 'workCity',
      label: '所属城市',
      col: 8,
      tagAttrs: {
        placeholder: '请选择所属城市',
        filterable: true,
        name: 'driverList_workCity_select'
      },
      options: this.workCityOptions
    },
    {
      type: 2,
      key: 'gmId',
      col: 8,
      label: '加盟经理',
      tagAttrs: {
        placeholder: '请选择加盟经理',
        name: 'driverList_gmId_select'
      },
      options: this.gmOptions
    },
    {
      type: 3,
      key: 'time',
      label: '创建日期',
      col: 12,
      dateType: 'datetimerange',
      tagAttrs: {
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '昨天',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
                picker.$emit('pick', [start, start])
              }
            },
            {
              text: '近7天',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '近30天',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        }
      }
    },
    {
      slot: true,
      col: 12,
      w: '0px',
      type: 'btn1'
    },
    {
      slot: true,
      label: '审核状态',
      col: 24,
      type: 'statusBox'
    }
  ];
  // 表格
  private tableData: any[] = [];
  // 列数组
  private columns: any[] = [
    {
      key: 'payId',
      label: '缴费编号'
    },
    {
      key: 'driverId',
      label: '司机编号',
      width: '140px'
    },
    {
      key: 'name',
      label: '司机姓名'
    },
    {
      key: 'phone',
      label: '联系电话',
      width: '120px'
    },
    {
      key: 'workCityName',
      label: '所属城市'
    },
    {
      key: 'orderId',
      label: '订单编号'
    },
    {
      key: 'cashMoney',
      label: '可提现金额（元）',
      width: '120px'
    },
    {
      key: 'dealMoney',
      label: '本笔交易金额总计',
      width: '120px'
    },
    {
      key: 'isReceipt',
      label: '是否开收据'
    },
    {
      key: 'gmName',
      label: '加盟经理'
    },
    {
      key: 'statusName',
      label: '审核状态'
    },
    {
      key: 'createName',
      label: '创建人'
    },
    {
      key: 'createDate',
      label: '创建时间',
      slot: true,
      width: '180px'
    },
    {
      key: 'op',
      label: '操作',
      disabled: true,
      slot: true,
      fixed: 'right',
      width: this.isPC ? '150px' : '50px'
    }
  ];
  /**
   *分页对象
   */
  private page: PageObj = {
    page: 1,
    limit: 30,
    total: 0
  };

  // 手机号验证
  private checkPhone(rule: any, value: any, callback: any) {
    if (value === '') {
      callback()
    }
    const can = phoneRegExp.test(value)
    if (can) {
      callback()
    } else {
      callback(new Error('请输入正确的手机号'))
    }
  }

  // 字母数字校验
  private checkID(rule: any, value: any, callback: any) {
    const can = IdRegExp.test(value)
    if (can) {
      callback()
    } else {
      callback(new Error('请输入正确的编号'))
    }
  }
  /**
   *获取加盟经理列表
   */
  async getManagers() {
    try {
      let params = {
        uri: '/v1/driver/getDriverList'
      }
      let { data: res } = await GetManagerLists(params)
      if (res.success) {
        let gms = res.data.map(function(item: any) {
          return {
            label: item.name,
            value: item.id
          }
        })
        this.gmOptions.push(...gms)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get manager fail:${err}`)
    }
  }

  /**
   *获取开通城市
   */
  async getOpenCitys() {
    try {
      let { data: res } = await GetOpenCityData()
      if (res.success) {
        let workCity = res.data.map(function(item: any) {
          return {
            label: item.name,
            value: item.code
          }
        })
        this.workCityOptions.push(...workCity)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get `)
    }
  }
  /**
   *获取列表
   */
  async getList() {
    try {
      if (this.listQuery.phone && !phoneReg.test(this.listQuery.phone)) {
        return this.$message.error('请输入正确的手机号')
      }
      this.listLoading = true
      let params: any = {
        limit: this.page.limit,
        page: this.page.page
      }

      this.listQuery.status !== '' && (params.status = +this.listQuery.status)
      this.listQuery.status && (params.status = +this.listQuery.status)
      this.listQuery.workCity && (params.workCity = this.listQuery.workCity)
      this.listQuery.driverId && (params.driverId = this.listQuery.driverId)
      this.listQuery.name && (params.name = this.listQuery.name)
      this.listQuery.phone && (params.phone = this.listQuery.phone)
      this.listQuery.payId !== '' && (params.payId = this.listQuery.payId)
      this.listQuery.gmId !== '' && (params.gmId = this.listQuery.gmId)
      if (this.listQuery.time.length > 1) {
        params.startDate = this.listQuery.time[0]
        params.endDate = this.listQuery.time[1] + 86399999
      }
      let { data: res } = await GetConfirmInfoList(params)
      this.listLoading = false
      if (res.success) {
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
        this.tableData = res.data
        this.pageTitle = res.title
        this.statusOptions[0].num = this.pageTitle.all
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      this.listLoading = false
      console.log(`get lists fail:`, err)
    }
  }

  private changeStatus(item: any, index: number) {
    this.active = index
    this.listQuery.status = item.value
    this.getList()
  }
  /**
   * 路径跳转
   */
  goRoute(url: string, id: any) {
    if (id) {
      this.$router.push({ path: url, query: { id: id } })
    } else {
      this.$router.push({ path: url })
    }
  }
  /**
   * 查询
   */
  private handleQueryClick() {
    let blackLists = ['status']
    this.tags = []
    for (let key in this.listQuery) {
      if (
        this.listQuery[key] !== '' &&
        this.tags.findIndex((item) => item.key === key) === -1 &&
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
   *重置
   */
  private handleResetClick() {
    this.listQuery = {
      payId: '',
      workCity: '',
      driverId: '',
      name: '',
      phone: '',
      gmId: '',
      status: '',
      time: []
    };
    ((this.$refs.searchForm) as any).resetForm()
    this.tags = []
    // this.getList()
  }

  /**
   * 分页
   */
  handlePageSize(page: any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  mounted() {
    this.getList()
    this.getManagers()
    this.getOpenCitys()
  }
}
</script>
<style lang="scss" scoped>
.payList {
  .table_box {
    padding: 0px 30px;
    background: #ffffff;
    -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    .middle {
      margin: 10px 0px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .count {
        font-size: 14px;
        color: #666;
      }
    }
  }
  .tableTitle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    .el-badge {
      margin-right: 30px;
    }
    .statusBox {
      display: flex;
      align-items: center;
      .btnBox {
        display: flex;
        align-items: center;
      }
    }
  }
  .mobile {
    width: 100%;
    text-align: center;
  }
  .btnMobile {
    margin-left: 0;
    margin-top: 10px;
    width: 80%;
  }
  .btnPc {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>

<style scoped>
.payList >>> .selfForm {
  width: 100%;
  background: #fff;
  margin-bottom: 10px;
  margin-left: 0px !important;
  margin-right: 0px !important;
  box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
}
.payList >>> .el-form-item__label {
  color: #999;
}
.doItem {
  color: #649cee;
  margin: 0 5px;
  cursor: pointer;
}
@media screen and (min-width: 700px) {
  .payList >>> .el-collapse-item__wrap {
    position: absolute;
    z-index: 1000;
    background: #fff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.85);
    right: 15px;
    left: 15px;
  }
  .payList >>> .el-collapse-item__content {
    padding-bottom: 0px;
  }
}
</style>

<style>
@media screen and (max-width: 700px) {
  .el-message-box__wrapper {
    top: 0 !important;
    left: 5% !important;
    right: 5% !important;
  }
  .el-message-box {
    width: 100%;
  }
}
</style>
