<template>
  <div
    v-loading="listLoading"
    class="driverClueContainer"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      label-width="140px"
      class="p15 SuggestForm"
      :pc-col="8"
    >
      <div
        slot="mulBtn"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          type="primary"
          :disabled="multipleSelection.length > 0 ? false :true"
          @click="handleMulDistributionClick"
        >
          批量分配
        </el-button>
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          type="primary"
          @click="handleExportClick"
        >
          导出
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
      <template slot="status">
        <el-badge
          v-for="item in btns"
          :key="item.text"
        >
          <el-button
            type="primary"
            :plain="item.name !== listQuery.status"
            @click="() => {
              listQuery.status = item.name
              handleFilterClick()
            }"
          >
            {{ item.text }}
          </el-button>
        </el-badge>
      </template>
    </self-form>
    <!-- 表格 -->
    <div
      class="table_box"
    >
      <self-table
        :index="true"
        :is-p30="false"
        :operation-list="[]"
        :func="disabledFunc"
        row-key="id"
        :table-data="tableData"
        :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
        :columns="columns"
        :page="page"
        @onPageSize="handlePageSize"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:name="scope">
          <p
            v-if="scope.row.name"
            class="text"
          >
            {{ scope.row.name | DataIsNull }}
          </p>
          <p
            v-if="scope.row.phone"
            class="text"
          >
            {{ scope.row.phone | DataIsNull }}
          </p>
        </template>
        <template v-slot:followPerson="scope">
          <p
            v-if="scope.row.followerName"
            class="text"
          >
            {{ scope.row.followerName | DataIsNull }}
          </p>
          <p
            v-if="scope.row.followerPhone"
            class="text"
          >
            {{ scope.row.followerPhone | DataIsNull }}
          </p>
        </template>
        <template v-slot:city="scope">
          <p class="text">
            {{ scope.row.cityName }}/{{ scope.row.busiTypeName }}
          </p>
        </template>
        <template v-slot:allocatedDate="scope">
          <p class="text">
            {{ scope.row.allocatedDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
          </p>
        </template>
        <template v-slot:op="scope">
          <el-button
            type="text"
            size="small"
            @click="handleDetailClick(scope.row)"
          >
            详情
          </el-button>
          <el-button
            v-if="[10,20,30,40].includes(scope.row.status)"
            type="text"
            size="small"
            @click="handleDistributionClick(scope.row)"
          >
            分配
          </el-button>
        </template>
      </self-table>
    </div>
    <SelfDialog
      class="driverClueContainerDialog"
      :visible.sync="showDialog"
      :confirm="confirm"
      width="500px"
      :destroy-on-close="false"
      @closed="handleDialogClosed"
    >
      <self-form
        ref="dialogDriverClue"
        :rules="rules"
        :list-query="dialogListQuery"
        :form-item="dialogFormItem"
        size="small"
        label-width="100px"
        :pc-col="24"
        @onPass="handlePassClick"
      />
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import { GetDutyListByLevel, getOfficeByTypeAndOfficeId, getOfficeByType, GetDictionaryList, GetOpenCityData, getGroupInfoByCityCodeAndProductLine, GetSpecifiedRoleList } from '@/api/common'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { GetDriverClueList, ExportDriverClue, allocationClue } from '@/api/driver-cloud'
import { delayTime } from '@/settings'
import { HandlePages, lock, parseTime, showCityGroupPerson, showWork, DataIsNull } from '@/utils/index'
interface PageObj {
  page:number,
  limit:number,
  total?:number
}

interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SelfForm,
    SelfTable,
    SelfDialog
  }
})
export default class extends Vue {
  private listLoading:boolean = false;
  private showDialog:boolean = false; // 弹框
  private rows:IState[] = []; // 弹框选中的数据
  private dutyListOptions:IState[] = [];// 业务线
  private multipleSelection:IState[] = [];// 多选选中
  private carOptions:IState[] = [];// 车型列表
  private contactsOption:IState[] = [];// 联系情况列表
  private followerListOptions:IState[] = [];// 跟进人列表
  private listQuery:IState = {
    name: '',
    phone: '',
    haveCar: '',
    carTypes: [],
    contactSituations: [],
    followerId: '',
    time: [],
    workCity: [],
    busiType: '',
    onlyMe: '',
    status: ''
  };
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 10
      },
      label: '司机姓名',
      key: 'name'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 11
      },
      label: '手机号',
      key: 'phone'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '是否有车',
      key: 'haveCar',
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '有',
          value: 1
        },
        {
          label: '无',
          value: 0
        }
      ]
    },
    {
      type: 8,
      tagAttrs: {
        placeholder: '请选择',
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'workCity',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: showWork
        }
      },
      label: '城市',
      key: 'workCity',
      listeners: {
        'change': () => {
          this.getGmOptions()
        }
      }
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
      options: this.dutyListOptions,
      listeners: {
        'change': () => {
          this.getGmOptions()
        }
      }
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '跟进人',
      key: 'followerId',
      options: this.followerListOptions
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        multiple: true,
        'collapse-tags': true
      },
      label: '车型',
      key: 'carTypes',
      options: this.carOptions
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        multiple: true,
        'collapse-tags': true
      },
      label: '联系情况',
      key: 'contactSituations',
      options: this.contactsOption
    },
    {
      type: 3,
      col: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      label: '分配时间',
      key: 'time'
    },
    {
      type: 5,
      label: '只看自己',
      key: 'onlyMe',
      options: [
        {
          label: '',
          value: 1
        }
      ]
    },
    {
      type: 'status',
      col: 24,
      slot: true,
      w: '50px'
    },
    {
      type: 'mulBtn',
      col: 24,
      slot: true,
      w: '0px'
    }

  ];
  private btns:any[] = [
    {
      name: '',
      text: '全部'
    },
    {
      name: '10',
      text: '待分配'
    },
    {
      name: '20',
      text: '待跟进'// 审核通过
    },
    {
      name: '30',
      text: '跟进中'
    },
    {
      name: '40',
      text: '待面试'
    },
    {
      name: '50',
      text: '已面试'
    },
    {
      name: '60',
      text: '已成交'
    }
  ]
  private columns:IState[] = [
    {
      key: 'name',
      label: '姓名/手机号',
      'width': '140px',
      slot: true
    },
    {
      key: 'haveCar',
      label: '是否有车/车型',
      'width': '140px'
    },
    {
      key: 'experience',
      label: '货运经验',
      'width': '100px'
    },
    {
      key: 'contactSituationName',
      label: '联系情况',
      'width': '140px',
      attrs: {
        'show-overflow-tooltip': true
      }
    },
    {
      key: 'remark',
      label: '备注',
      'width': '140px',
      attrs: {
        'show-overflow-tooltip': true
      }
    },
    {
      key: 'statusName',
      label: '状态',
      'width': '100px'
    },
    {
      key: 'followPerson',
      label: '跟进人',
      'width': '140px',
      slot: true
    },
    {
      key: 'allocatedDate',
      label: '分配时间/最近跟进时间',
      'width': '150px',
      slot: true
    },
    {
      key: 'city',
      label: '城市/业务线',
      'width': '140px',
      slot: true
    },
    {
      key: 'op',
      label: '操作',
      slot: true,
      width: '150px',
      fixed: 'right'
    }
  ];
  private tableData:IState[] = [{}, {}];
  // 表格分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
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
  private dialogListQuery:IState = {
    follow: []
  };
  private rules:IState = {
    follow: [
      { required: true, message: '请选择跟进人', trigger: 'blur' }
    ]
  };
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  // 获取业务线
  private async getDutyListByLevel() {
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
        this.dutyListOptions.push({
          label: '全部',
          value: ''
        })
        this.dutyListOptions.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get duty list fail:${err}`)
    }
  }
  // 查询
  handleFilterClick() {
    this.page.page = 1
    this.getLists()
  }
  // 重置
  handleResetClick() {
    this.listQuery = {
      name: '',
      phone: '',
      haveCar: '',
      carType: [],
      contactSituation: [],
      followerId: '',
      time: [],
      workCity: [],
      busiType: '',
      onlyMe: 0,
      status: ''
    }
  }
  // 表格是否禁用
  private disabledFunc(row:any) {
    if ([10, 20, 30, 40].includes(row.status)) {
      return false
    }
    return true
  }
  // 详情
  handleDetailClick(row:IState) {
    this.$router.push({
      path: '/driverClond/driverClueDetail',
      query: {
        id: row.marketClueId
      }
    })
  }
  // 分配
  handleDistributionClick(row:IState) {
    this.rows.push(row)
    this.showDialog = true
  }
  // 多选选中
  handleSelectionChange(val:any) {
    this.multipleSelection = val
  }
  // 批量分配
  handleMulDistributionClick() {
    this.rows.push(...this.multipleSelection)
    this.showDialog = true
  }
  // 导出
  @lock
  async handleExportClick() {
    try {
      try {
        let params:IState = {}
        this.listQuery.haveCar !== '' && (params.haveCar = this.listQuery.haveCar)
        this.listQuery.onlyMe && (params.onlyMe = 1)
        this.listQuery.name && (params.name = this.listQuery.name)
        this.listQuery.phone && (params.phone = this.listQuery.phone)
        this.listQuery.carTypes && this.listQuery.carTypes.length !== 0 && (params.carTypes = this.listQuery.carTypes)
        this.listQuery.contactSituations && this.listQuery.contactSituations.length !== 0 && (params.contactSituations = this.listQuery.contactSituations)
        this.listQuery.followerId !== '' && (params.followerId = this.listQuery.followerId)
        this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
        this.listQuery.status !== '' && (params.status = +this.listQuery.status)
        if (this.listQuery.time && this.listQuery.time.length > 0) {
          let startDate = new Date(this.listQuery.time[0]).setHours(0, 0, 0)
          let endDate = new Date(this.listQuery.time[1]).setHours(23, 59, 59)
          params.startDate = startDate
          params.endDate = endDate
        } else {
          return this.$message.warning('请选择分配时间')
        }
        let { data: res } = await ExportDriverClue(params)
        if (res.success) {
          this.$message.success('操作成功')
        } else {
          this.$message.warning(res.message)
        }
      } catch (err) {
        console.log(`get list fail:${err}`)
      } finally {
        this.listLoading = false
      }
    } catch (err) {
      console.log(`export fail:${err}`)
    } finally {
      console.log(`finally`)
    }
  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 获取列表
  @lock
  async getLists() {
    try {
      this.listLoading = true
      let params:IState = {
        limit: this.page.limit,
        page: this.page.page
      }
      this.listQuery.haveCar !== '' && (params.haveCar = this.listQuery.haveCar)
      this.listQuery.onlyMe && (params.onlyMe = 1)
      this.listQuery.name && (params.name = this.listQuery.name)
      this.listQuery.phone && (params.phone = this.listQuery.phone)
      this.listQuery.carTypes && this.listQuery.carTypes.length !== 0 && (params.carTypes = this.listQuery.carTypes)
      this.listQuery.contactSituations && this.listQuery.contactSituations.length !== 0 && (params.contactSituations = this.listQuery.contactSituations)
      this.listQuery.followerId !== '' && (params.followerId = this.listQuery.followerId)
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.status !== '' && (params.status = +this.listQuery.status)
      if (this.listQuery.time && this.listQuery.time.length > 0) {
        let startDate = new Date(this.listQuery.time[0]).setHours(0, 0, 0)
        let endDate = new Date(this.listQuery.time[1]).setHours(23, 59, 59)
        params.startDate = startDate
        params.endDate = endDate
      }
      let { data: res } = await GetDriverClueList(params)
      if (res.success) {
        this.tableData = res.data
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
      } else {
        this.$message.warning(res.message)
      }
    } catch (err) {
      console.log(`get list fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 弹框确认
  confirm() {
    (this.$refs.dialogDriverClue as any).submitForm()
  }
  // 表单验证通过
  handlePassClick(val:boolean) {
    this.allocationClue()
  }
  // 分配、批量分配
  @lock
  async allocationClue() {
    try {
      if (this.dialogListQuery.follow.length !== 3) {
        this.$message.warning('请选择跟进人')
        return false
      }
      let params:IState = {
        marketClueId: this.rows.map((item:any) => item.marketClueId + ''),
        followerId: +this.dialogListQuery.follow[2]
      }
      let { data: res } = await allocationClue(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.showDialog = false
        setTimeout(() => {
          this.getLists()
        }, delayTime)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`fenpei fail:${err}`)
    } finally {
      //
    }
  }
  // 弹框关闭后
  handleDialogClosed() {
    (this.$refs.dialogDriverClue as any).resetForm()
    this.dialogListQuery = {
      follow: []
    }
    this.rows = []
  }
  // 获取车型
  async getBaseInfo() {
    try {
      let carLen:number = this.carOptions.length
      if (carLen > 0) {
        this.carOptions.splice(0, carLen)
      }
      let contactsLen:number = this.contactsOption.length
      if (contactsLen > 0) {
        this.contactsOption.splice(0, contactsLen)
      }
      let params = ['Intentional_compartment', 'driver_clue_contact_situation']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        let cars = res.data.Intentional_compartment.map(function(item:any) {
          return { label: item.dictLabel, value: item.dictValue }
        })
        let contactsOption = res.data.driver_clue_contact_situation.map(function(item:any) {
          return { label: item.dictLabel, value: item.dictValue }
        })
        this.carOptions.push(...cars)
        this.contactsOption.push(...contactsOption)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }
  // 获取跟进人列表
  async getGmOptions() {
    try {
      let params:any = {
        roleTypes: [1],
        uri: '/v2/driverBilling/shippingChange/queryGM'
      }
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      if (this.listQuery.workCity && this.listQuery.workCity.length > 1) {
        params.cityCode = this.listQuery.workCity[1]
      }

      let { data: res } = await GetSpecifiedRoleList(params)
      if (res.success) {
        let arr = res.data.map(function(item: any) {
          return {
            label: item.name,
            value: item.id
          }
        })
        this.followerListOptions.push(...arr)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    }
  }

  mounted() {
    this.getLists()
    this.getDutyListByLevel()
    this.getBaseInfo()
    this.getGmOptions()
  }
}
</script>
<style lang="scss" scoped>
  .driverClueContainer {
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
    .SuggestForm {
      width: 100%;
      background: #fff;
      margin-bottom: 10px;
      margin-left:0px!important;
      margin-right:0px!important;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    }
    .table_box {
      padding: 30px 30px 0px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
    .text {
      margin:0px;
    }
  }
</style>

<style scoped>
   .driverClueContainer >>> .el-badge{
      margin-right: 20px;
   }
   .SuggestForm >>> .el-checkbox__inner {
     border-radius: 50%;
   }
</style>
