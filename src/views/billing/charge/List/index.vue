<template>
  <div
    class="billingListContainer"
    :class="{
      p15: isPC,
      m15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      :pc-col="8"
      size="small"
      label-width="80px"
      class="p15"
    >
      <div
        slot="mulBtn"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
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
    <div class="middle">
      <div class="count">
        计费状态:
        <el-badge
          v-for="item in btns"
          :key="item.text"
        >
          <el-button
            size="small"
            type="primary"
            :plain="item.name !== listQuery.status"
            @click="handleSearchClick(item)"
          >
            {{ item.text }}
          </el-button>
        </el-badge>
      </div>
      <router-link :to="{path: '/driveraccount/billingCreate'}">
        <el-button
          class="createUser"
          icon="el-icon-plus"
          type="primary"
          size="small"
        >
          新建
        </el-button>
      </router-link>
    </div>
    <!-- 表格 -->
    <self-table
      v-loading="listLoading"
      :index="false"
      :is-p30="false"
      :indexes="true"
      :height="tableHeight"
      :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
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
        <el-dropdown
          :trigger="isPC ? 'hover' : 'click'"
          @command="(e) => handleCommandChange(e,scope.row)"
        >
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

          <el-dropdown-menu
            slot="dropdown"
          >
            <el-dropdown-item
              command="adjust"
            >
              调整
            </el-dropdown-item>
            <el-dropdown-item
              command="status"
            >
              <template v-if="scope.row.status ===1">
                禁用
              </template>
              <template v-else>
                启用
              </template>
            </el-dropdown-item>
            <el-dropdown-item
              command="log"
            >
              日志
            </el-dropdown-item>
            <el-dropdown-item
              command="detail"
            >
              详情
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </self-table>
  </div>
</template>
<script lang="ts">
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { HandlePages } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'
import { Vue, Component } from 'vue-property-decorator'
import { GetDutyListByLevel } from '@/api/common'
import { GetChargingList, ChangeChargingStatus, getListAll } from '@/api/driver-account'
import { delayTime } from '@/settings'

interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}

interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SelfTable,
    SelfForm
  }
})
export default class extends Vue {
  // 业务线列表
  private busiType:IState[] = [];
  // loading
  private listLoading:Boolean = false;
  // 计费类型列表
  private chargeListOption:IState[] = [];
  // 查询表单
  private listQuery:IState = {
    sopType: '',
    chargingCode: '',
    chargingType: '',
    busiType: '',
    time: [],
    status: ''
  }
  // 查询表单容器
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 20,
        clearable: true
      },
      label: 'SOP类型',
      key: 'sopType'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 50,
        clearable: true
      },
      label: '计费编号',
      key: 'chargingCode'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '计费类型',
      key: 'chargingType',
      options: this.chargeListOption
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '业务线',
      key: 'busiType',
      options: this.busiType
    },
    {
      type: 3,
      col: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      label: '创建日期',
      key: 'time'
    },
    {
      type: 'mulBtn',
      col: 8,
      slot: true,
      w: '0px'
    }
  ]
  // 表格数据
  private tableData:IState[] = []
  // 表格列
  private columns:any[] = [
    {
      key: 'chargingCode',
      label: '计费编号',
      'min-width': '140px'
    },
    {
      key: 'chargingTypeName',
      label: '计费类型',
      'min-width': '140px'
    },
    {
      key: 'sopType',
      label: 'SOP类型',
      'min-width': '140px'
    },
    {
      key: 'sopDesc',
      label: 'SOP描述',
      'min-width': '200px',
      'width': '240px',
      attrs: {
        'show-overflow-tooltip': true
      }
    },
    {
      key: 'deductionTypeName',
      label: '扣款类型',
      'min-width': '140px'
    },
    {
      key: 'deductionStandard',
      label: '扣款标准',
      'min-width': '140px'
    },
    {
      key: 'busiTypeName',
      label: '业务线',
      'min-width': '140px'
    },
    {
      key: 'statusName',
      label: '计费状态',
      'min-width': '140px'
    },
    {
      key: 'remark',
      label: '备注',
      'width': '240px',
      attrs: {
        'show-overflow-tooltip': true
      }
    },
    {
      key: 'createDate',
      label: '创建日期',
      slot: true,
      'width': '160px'
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      slot: true,
      'min-width': this.isPC ? '200px' : '50px'
    }
  ]
  // 分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  // 按钮组
  private btns:any[] = [
    {
      name: '',
      text: '全部'
    },
    {
      name: '1',
      text: '启用'
    },
    {
      name: '2',
      text: '禁用'
    }
  ]
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  get tableHeight() {
    let otherHeight = 440
    return document.body.offsetHeight - otherHeight || document.documentElement.offsetHeight - otherHeight
  }
  // 重置表单
  handleResetClick() {
    this.listQuery = {
      sopType: '',
      chargingCode: '',
      chargingType: '',
      busiType: '',
      time: [],
      status: ''
    }
  }
  // 查询表单
  handleFilterClick() {
    this.page.page = 1
    this.getLists()
  }
  // 切换状态
  handleSearchClick(item:IState) {
    this.listQuery.status = item.name
    this.handleFilterClick()
  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 获取列表
  async getLists() {
    try {
      this.listLoading = true
      let params:IState = {
        page: this.page.page,
        limit: this.page.limit
      }
      this.listQuery.sopType !== '' && (params.sopType = this.listQuery.sopType)
      this.listQuery.chargingCode !== '' && (params.chargingCode = this.listQuery.chargingCode)
      this.listQuery.chargingType !== '' && (params.chargingType = this.listQuery.chargingType)
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.status !== '' && (params.status = this.listQuery.status)
      if (this.listQuery.time && this.listQuery.time.length > 1) {
        let createStartDate = new Date(this.listQuery.time[0]).setHours(0, 0, 0)
        let createEndDate = new Date(this.listQuery.time[1]).setHours(23, 59, 59)
        params.createStartDate = createStartDate
        params.createEndDate = createEndDate
      }
      let { data: res } = await GetChargingList(params)
      if (res.success) {
        this.tableData = res.data
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get list fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 获取计费类型列表
  async getChargeListAll() {
    try {
      let { data: res } = await getListAll()
      if (res.success) {
        let options:IState[] = res.data.map((item:any) => ({
          label: item.sopTypeDesc,
          value: item.id
        }))
        this.chargeListOption.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get charge list fail:${err}`)
    }
  }
  // 更多操作
  handleCommandChange(key:string, row:any) {
    if (key === 'adjust') { // 调整
      this.$router.push({
        path: '/driveraccount/billingAdjust',
        query: {
          id: row.id
        }
      })
    } else if (key === 'log') { // 日志
      this.$router.push({
        path: '/driveraccount/billingLog',
        query: {
          id: row.id
        }
      })
    } else if (key === 'status') { // 状态
      this.changeStatus(row)
    } else if (key === 'detail') { // 详情
      this.$router.push({
        path: '/driveraccount/billingDetail',
        query: {
          id: row.id
        }
      })
    }
  }
  // 改变状态
  changeStatus(row:IState) {
    this.$confirm(`此操作将${row.status === 1 ? '禁用' : '启用'}, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.changeChargingStatus(row)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消操作'
      })
    })
  }
  // 获取业务线列表
  async getBusiType() {
    try {
      let params = {
        dutyLevel: 1
      }
      let { data: res } = await GetDutyListByLevel(params)
      if (res.success) {
        let options = res.data.map((item:any) => ({
          label: item.dutyName,
          value: item.id
        }))
        this.busiType.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get busiType fail:${err}`)
    }
  }
  // 切换状态
  async changeChargingStatus(row:IState) {
    try {
      let params = {
        id: row.id,
        status: row.status === 1 ? 2 : 1
      }
      let { data: res } = await ChangeChargingStatus(params)
      if (res.success) {
        this.$message.success('操作成功')
        setTimeout(() => {
          this.getLists()
        }, delayTime)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`change status fail:${err}`)
    }
  }
  mounted() {
    this.getChargeListAll()
    this.getBusiType()
    this.getLists()
  }
}
</script>
<style lang="scss" scoped>
  .m15 {
     margin: 15px;
  }
  .billingListContainer{
    background: #ffffff;
    border-radius: 8px;
    .btnPc {
       width: 100%;
       display: flex;
       flex-flow: row nowrap;
       justify-content: flex-end;
     }
    .mobile {
      width:100%;
      text-align: center;
      .btnMobile {
        margin-left: 0;
        margin-top: 10px;
        width:80%;
      }
    }
    .middle {
      margin: 10px 0px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .count {
        font-size:14px;
        color:#666;
      }
    }
  }
</style>

<style scoped>
  .billingListContainer >>> .el-badge {
    margin-right:20px;
  }
</style>
