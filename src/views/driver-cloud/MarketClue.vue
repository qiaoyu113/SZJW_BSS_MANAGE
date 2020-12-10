
<template>
  <div
    v-loading="listLoading"
    class="MarketClue"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      ref="suggestForm"
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      label-width="80px"
      class="p15 SuggestForm"
      :pc-col="8"
    >
      <div
        slot="mulBtn"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
        <!-- v-permission="['/api/carrier_center/v2/clueH5/updateFollowerByMarketClueId']" -->
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          :disabled="multipleSelection.length > 0 ? false :true"
          @click="handleallAllotClick"
        >
          批量分配
        </el-button>
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          type="primary"
          @click="handleFilterClick"
        >
          查询
        </el-button>
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          @click="handleResetClick"
        >
          重置
        </el-button>
      </div>
    </self-form>
    <div class="table_box">
      <!-- 表格 -->
      <self-table
        ref="MarketClueTable"
        :height="tableHeight"
        :is-p30="false"
        :operation-list="[]"
        :table-data="tableData"
        :columns="columns"
        :index="true"
        :page="page"
        row-key="marketClueId"
        style="overflow: initial;"
        :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
        @onPageSize="handlePageSize"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:createDate="scope">
          {{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
        <template v-slot:op="scope">
          <!-- v-permission="['/api/carrier_center/v2/clueH5/updateFollowerByMarketClueId']" -->
          <el-button
            type="text"
            @click="handleAllotClick(scope.row)"
          >
            分配
          </el-button>
        </template>
      </self-table>
    </div>
    <SelfDialog
      :visible.sync="showDialog"
      :title="dialogTit"
      :confirm="confirm"
      width="500px"
      :sumbit-again="submitLoading"
      :destroy-on-close="true"
      @closed="handleDialogClosed"
    >
      <template v-if="showDialog">
        <self-form
          ref="dialogMarketClue"
          :rules="rules"
          :list-query="dialogListQuery"
          :form-item="dialogFormItem"
          size="small"
          label-width="100px"
          :pc-col="24"
          @onPass="handlePassClick"
        />
      </template>
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { HandlePages, lock } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'
import SelfDialog from '@/components/SelfDialog/index.vue'
import {
  today,
  yesterday,
  month,
  lastmonth,
  threemonth
} from '../driver-freight/components/date'
import {
  GetDutyListByLevel,
  getOfficeByTypeAndOfficeId,
  getOfficeByType
} from '@/api/common'
import { showWork, showCityGroupPerson } from '@/utils'
import {
  marketClue,
  allocationClue
} from '@/api/driver-cloud'
import { delayTime } from '@/settings'
interface PageObj {
  page: number;
  limit: number;
  total?: number;
}

interface IState {
  [key: string]: any;
}
@Component({
  name: 'MarketClue',
  components: {
    SelfTable,
    SelfForm,
    SelfDialog
  }
})
export default class extends Vue {
  private multipleSelection: any[] = []; // 当前页选中的数据
  private idKey:string = 'phone'; // 标识列表数据中每一行的唯一键的名称
  private cityArea:any = {};
  private driverOver: Boolean = false;
  private driverLoading: Boolean = false;
  private showDialog: boolean = false;
  private listLoading: boolean = false;
  private dialogTableVisible: boolean = false;
  private submitLoading: boolean = false;
  private tableData: any[] = [];
  private busiTypeList: IState = [];

  private dialogTit: string = '';
  private hasCarList: any[] = [
    { label: '全部', value: '' },
    { label: '有', value: 1 },
    { label: '无', value: 0 }
  ];
  private columns: any[] = [
    {
      key: 'phone',
      label: '手机号',
      width: '120px'
    },
    {
      key: 'haveCar',
      label: '是否有车'
    },
    {
      key: 'cityName',
      label: '城市'
    },
    {
      key: 'busiTypeName',
      label: '业务线',
      width: '100px'
    },
    {
      key: 'createDate',
      label: '创建时间',
      slot: true,
      width: '150px'
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      slot: true,
      'min-width': this.isPC ? '200px' : '50px'
    }
  ];
  private listQuery: IState = {
    workCity: '',
    busiType: '',
    phone: '',
    haveCar: '',
    time: []
  };
  private formItem: any[] = [
    {
      type: 8,
      key: 'workCity',
      col: 8,
      label: '所属城市',
      tagAttrs: {
        placeholder: '请选择所属城市',
        clearable: true,
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'workCity',
        props: {
          lazy: true,
          lazyLoad: showWork
        }
      }
    },
    {
      type: 2,
      label: '业务线',
      key: 'busiType',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.busiTypeList
    },
    {
      type: 1,
      label: '手机号',
      key: 'phone',
      tagAttrs: {
        type: 'tel',
        placeholder: '请输入',
        maxlength: 11,
        'show-word-limit': true,
        clearable: true
      },
      listeners: {
        'input': this.oninputOnlyNum
      }
    },
    {
      type: 2,
      label: '是否有车',
      key: 'haveCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.hasCarList
    },
    {
      type: 3,
      col: 10,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-time': ['00:00:00', '23:59:59'],
        pickerOptions: {
          shortcuts: [today, yesterday, month, lastmonth, threemonth]
        }
      },
      label: '创建日期',
      key: 'time'
    },
    {
      type: 'mulBtn',
      col: 6,
      slot: true,
      w: '0px'
    }
  ];
  private dialogListQuery:IState = {
    follow: []
  };
  private dialogFormItem:any[] = [
    {
      type: 8,
      tagAttrs: {
        placeholder: '请选择',
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'city',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: showCityGroupPerson
        }
      },
      label: '选择跟进人',
      key: 'follow'
    }
  ];
  private rules:IState = {
    follow: [
      { required: true, message: '请选择跟进人', trigger: 'blur' },
      { validator: this.validateFollow, trigger: 'change' }
    ]
  };

  private rowData:any[] = []
  // 分页
  private page: PageObj = {
    page: 1,
    limit: 30,
    total: 0
  };
  get getMarketIds() {
    return this.rowData.map((item:any) => item.marketClueId)
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  get tableHeight() {
    let otherHeight = 400
    return (
      document.body.offsetHeight - otherHeight ||
      document.documentElement.offsetHeight - otherHeight
    )
  }

  private validateFollow(rule:any, value:any, callback:Function) {
    if (value === '') {
      callback(new Error('请选择跟进人!'))
    } else if (value.length !== 3) {
      callback(new Error('该组织下无跟进人!'))
    } else {
      callback()
    }
  }
  // 获取业务线
  private async getGetDutyListByLevel() {
    try {
      let params = {
        dutyLevel: 1
      }
      let { data: res } = await GetDutyListByLevel(params)
      if (res.success) {
        let options: IState[] = res.data.map((item: any) => ({
          label: item.dutyName,
          value: item.id
        }))
        options.unshift({
          label: '全部',
          value: ''
        })
        this.busiTypeList.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get busiType fail:${err}`)
    }
  }
  // 查询
  private handleFilterClick() {
    this.page.page = 1
    this.getLists()
  }
  // 重置
  private async handleResetClick(row: IState) {
    (this.$refs['suggestForm'] as any).resetForm()
    this.getLists()
  }
  // 分配
  private handleAllotClick(row: IState) {
    this.dialogTit = '分配'
    this.showDialog = true
    this.rowData.push(row)
  }

  private handleSelectionChange(val:any) {
    this.multipleSelection = val
  }

  // 批量分配
  private handleallAllotClick() {
    this.dialogTit = '批量分配'
    this.showDialog = true
    this.rowData.push(...this.multipleSelection)
  }

  private oninputOnlyNum(value:string) {
    this.listQuery.phone = value.replace(/[^\d]/g, '')
  }

  // 弹框确认
  private confirm() {
    (this.$refs.dialogMarketClue as any).submitForm()
  }
  // 表单验证通过
  @lock
  private async handlePassClick(val:boolean) {
    try {
      let params = {
        followerId: Number(this.dialogListQuery.follow[2]),
        marketClueId: this.getMarketIds
      }
      const { data: res } = await allocationClue(params)
      if (res.success) {
        if (res.data.flag) {
          this.$message(res.data.msg)
        } else {
          this.$message.warning(res.data.msg)
        }
        this.showDialog = false;
        (this.$refs.MarketClueTable as any).toggleRowSelection()
        this.handleDialogClosed()
        setTimeout(() => {
          this.getLists()
        }, delayTime)
      } else {
        this.$message.warning(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    }
  }
  // 弹框关闭后
  handleDialogClosed() {
    this.dialogListQuery.follow = []
    this.rowData = []
  }
  // 分页
  private handlePageSize(page: PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }

  // 处理params
  private dealParams(params: any) {
    this.listQuery.workCity.length === 2 &&
      (params.workCity = this.listQuery.workCity[1])
    this.listQuery.busiType !== '' &&
      (params.busiType = this.listQuery.busiType)
    this.listQuery.phone && (params.phone = this.listQuery.phone)
    this.listQuery.haveCar !== '' && (params.haveCar = this.listQuery.haveCar)
    if (this.listQuery.time && this.listQuery.time.length > 1) {
      let startDate = new Date(this.listQuery.time[0])
      let endDate = new Date(this.listQuery.time[1])
      params.startDate = startDate.setHours(0, 0, 0)
      params.endDate = endDate.setHours(23, 59, 59)
    }
    return params
  }
  // 获取列表
  @lock
  private async getLists() {
    try {
      this.listLoading = true
      let params: IState = {
        page: this.page.page,
        limit: this.page.limit
      }
      params = this.dealParams(params)
      let { data: res } = await marketClue(params)
      if (res.success) {
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
        this.tableData = res.data
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get list fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  mounted() {
    this.getGetDutyListByLevel()
    this.getLists()
    this.cityArea = showCityGroupPerson
  }
}
</script>
<style lang="scss" scoped>
.MarketClue {
  .btnPc {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
  }
  .mobile {
    width: 100%;
    text-align: center;
    .btnMobile {
      margin-left: 0;
      margin-top: 10px;
      width: 80%;
    }
  }
  .middle {
    margin: 10px 0px;
  }
  .SuggestForm {
    width: 100%;
    background: #fff;
    margin-bottom: 10px;
    margin-left: 0px !important;
    margin-right: 0px !important;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
  }
  .table_box {
    padding: 10px 30px;
    background: #ffffff;
    -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
  .addInfo {
    margin-left: 50px;
    font-size: 13px;
    color: #ff5d5d;
  }
}
</style>
