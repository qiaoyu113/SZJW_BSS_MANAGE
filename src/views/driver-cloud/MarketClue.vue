
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
        <el-button
          v-permission="['/v2/driver/label-sync/export']"
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
        ref="selfDriverTag"
        :height="tableHeight"
        :is-p30="false"
        :operation-list="[]"
        :table-data="tableData"
        :columns="columns"
        :index="true"
        :page="page"
        row-key="id"
        style="overflow: initial;"
        :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
        @onPageSize="handlePageSize"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:createDate="scope">
          {{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
        <template v-slot:op="scope">
          <el-button
            v-permission="['/v2/driver/label-sync/update']"
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
      :sumbit-again="submitLoading"
      :destroy-on-close="true"
      @closed="handleClosed"
    >
      <template v-if="showDialog">
        <el-form class="followChoose">
          <el-form-item label="选择跟进人">
            <el-cascader
              v-model="followPeople"
              placeholder="请选择所属城市"
              clearable
              default-expanded-keys="true"
              default-checked-keys="true"
              node-key="followPeople"
              :props="{
                lazy: true,
                lazyLoad: cityArea
              }"
            >
              <template slot-scope="{data}">
                <span>{{ data.label }}</span>
                <span v-if="data.value === 1301"> (停用) </span>
              </template>
            </el-cascader>
          </el-form-item>
        </el-form>
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
import { showWork } from '@/utils'
import {
  marketClue
} from '@/api/driver-cloud'
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
  private cityArea:any = {};
  private driverOver: Boolean = false;
  private driverLoading: Boolean = false;
  private showDialog: boolean = false;
  private listLoading: boolean = false;
  private dialogTableVisible: boolean = false;
  private submitLoading: boolean = false;
  private tableData: any[] = [];
  private busiTypeList: IState = [];
  private multipleSelection: any[] = []
  private dialogTit: string = '';
  private hasCarList: any[] = [
    { label: '有', value: true },
    { label: '无', value: false }
  ];
  private columns: any[] = [
    {
      key: 'phone',
      label: '手机号',
      width: '120px'
    },
    {
      key: 'hasCarName',
      label: '是否有车'
    },
    {
      key: 'workCityName',
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
    hasCar: '',
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
        placeholder: '请输入',
        maxlength: 11,
        'show-word-limit': true,
        clearable: true
      }
    },
    {
      type: 2,
      label: '是否有车',
      key: 'hasCar',
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
  private followPeople: Array<number | string> = [];
  // 分页
  private page: PageObj = {
    page: 1,
    limit: 30,
    total: 0
  };
  get getMarketIds() {
    return this.multipleSelection.map((item:any) => {
      return {
        busiType: item.busiType,
        phone: item.phone
      }
    })
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
  // 获取业务线
  async getGetDutyListByLevel() {
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
  handleFilterClick() {
    this.page.page = 1
    this.getLists()
  }
  // 重置
  @lock
  private async handleResetClick(row: IState) {
    (this.$refs['suggestForm'] as any).resetForm()
  }
  // 分配
  handleAllotClick(row: IState) {
    this.dialogTit = '分配'
    this.showDialog = true
    const params = {
      busiType: row.busiType,
      phone: row.phone
    }
    console.log('params1', params)
  }

  handleSelectionChange(val:any) {
    this.multipleSelection = val
  }

  // 批量分配
  private handleallAllotClick() {
    this.dialogTit = '批量分配'
    this.showDialog = true
    console.log('params2', this.getMarketIds)
  }

  // 弹框确认按钮
  confirm() {
    (this.$refs.dialogSelfTag as any).submitForm()
  }

  // 弹框关闭后
  handleClosed() {
    this.followPeople = []
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
    this.listQuery.hasCar !== '' && (params.hasCar = this.listQuery.hasCar)
    if (this.listQuery.time && this.listQuery.time.length > 1) {
      let startDate = new Date(this.listQuery.time[0])
      let endDate = new Date(this.listQuery.time[1])
      params.startDate = startDate.setHours(0, 0, 0)
      params.endDate = endDate.setHours(23, 59, 59)
    }
    return params
  }
  // 获取列表
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
    this.cityArea = showWork
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
<style scoped>
.followChoose >>> .el-cascader {
  width: 70%;
}
</style>
