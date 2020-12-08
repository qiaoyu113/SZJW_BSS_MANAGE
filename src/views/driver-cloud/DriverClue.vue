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
        <template v-slot:driverName="scope">
          <p class="text">
            {{ scope.row.driverName }}
          </p>
          <p class="text">
            {{ scope.row.phone }}
          </p>
        </template>
        <template v-slot:hasCar="scope">
          <div v-if="scope.row.hasCar">
            {{ scope.row.carTypeName }}
          </div>
          <div v-else>
            无
          </div>
        </template>
        <template v-slot:followPerson="scope">
          <p class="text">
            {{ scope.row.followPerson }}
          </p>
          <p class="text">
            {{ scope.row.followPersonPhone }}
          </p>
        </template>
        <template v-slot:city="scope">
          <p class="text">
            {{ scope.row.cityName }}/{{ scope.row.busiTypeName }}
          </p>
        </template>
        <template v-slot:lastTime="scope">
          <p class="text">
            {{ scope.row.lastTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
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
import { HandlePages, lock, parseTime } from '@/utils/index'
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
  private listQuery:IState = {
    driverName: '',
    phone: '',
    hasCar: '',
    carType: [],
    contactInfo: [],
    followPerson: '',
    time: [],
    busiType: '',
    onlyMe: false,
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
      key: 'driverName'
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
      key: 'hasCar',
      options: [
        {
          label: '有',
          value: true
        },
        {
          label: '无',
          value: false
        }
      ]
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
      key: 'carType',
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
      key: 'contactInfo',
      options: this.contactsOption
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '跟进人',
      key: 'followPerson',
      options: []
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
      type: 8,
      tagAttrs: {
        placeholder: '请选择',
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'city',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: this.showWork
        }
      },
      label: '城市',
      key: 'city'
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
      options: this.dutyListOptions
    },
    {
      type: 4,
      label: '只看自己',
      key: 'onlyMe',
      options: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ]
    },
    {
      type: 'mulBtn',
      col: 16,
      slot: true,
      w: '0px'
    },
    {
      type: 'status',
      col: 24,
      slot: true,
      w: '50px'
    }
  ];
  private btns:any[] = [
    {
      name: '',
      text: '全部'
    },
    {
      name: '1',
      text: '待分配'
    },
    {
      name: '3',
      text: '待跟进'// 审核通过
    },
    {
      name: '4',
      text: '跟进中'
    },
    {
      name: '2',
      text: '待面试'
    },
    {
      name: '5',
      text: '已面试'
    },
    {
      name: '6',
      text: '已成交'
    }
  ]
  private columns:IState[] = [
    {
      key: 'driverName',
      label: '姓名/手机号',
      'width': '140px',
      slot: true
    },
    {
      key: 'hasCar',
      label: '是否有车/车型',
      'width': '140px',
      slot: true
    },
    {
      key: 'experience',
      label: '货运经验',
      'width': '100px'
    },
    {
      key: 'contactInfo',
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
      key: 'lastTime',
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
          lazyLoad: this.showCityGroupPerson
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
  // 获取客户城市
  private async showWork(node:any, resolve:any) {
    let query: any = {
      parentId: ''
    }
    if (node.level === 1) {
      query.parentId = node.value
    }
    try {
      if (node.level === 0) {
        let nodes = await this.areaAddress({ type: 2 })
        resolve(nodes)
      } else if (node.level === 1) {
        let nodes = await this.cityDetail(query)
        resolve(nodes)
      }
    } catch (err) {
      resolve([])
    }
  }
  // 获取大区列表
  private async areaAddress(params: any) {
    try {
      let { data: res } = await getOfficeByType(params)
      if (res.success) {
        const nodes = res.data.map(function(item: any) {
          return {
            value: item.id,
            label: item.name,
            leaf: false
          }
        })
        return nodes
      }
    } catch (err) {
      console.log(`load city by code fail:${err}`)
    }
  }
  // 根据大区获取城市列表
  private async cityDetail(params: any) {
    let { data: city } = await getOfficeByTypeAndOfficeId(params)
    if (city.success) {
      const nodes = city.data.map(function(item: any) {
        return {
          value: item.areaCode,
          label: item.name,
          leaf: true
        }
      })
      return nodes
    }
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
      driverName: '',
      phone: '',
      hasCar: '',
      carType: [],
      contactInfo: [],
      followPerson: '',
      time: [],
      busiType: '',
      onlyMe: false
    }
  }
  // 表格是否禁用
  private disabledFunc(row:any) {
    if (row.id) {
      return false
    }
    return true
  }
  // 详情
  handleDetailClick(row:IState) {
    this.$router.push({
      path: '/driverClond/driverClueDetail',
      query: {
        id: row.id
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
        let params:IState = {
          hasCar: this.listQuery.hasCar,
          onlyMe: this.listQuery.onlyMe
        }
        this.listQuery.driverName && (params.driverName = this.listQuery.driverName)
        this.listQuery.phone && (params.phone = this.listQuery.phone)
        this.listQuery.carType && this.listQuery.carType.length !== 0 && (params.carType = this.listQuery.carType)
        this.listQuery.contactInfo && this.listQuery.contactInfo.length !== 0 && (params.contactInfo = this.listQuery.contactInfo)
        this.listQuery.followPerson && (params.followPerson = this.listQuery.followPerson)
        this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
        this.listQuery.status !== '' && (params.status = this.listQuery.status)
        if (this.listQuery.time && this.listQuery.time.length > 0) {
          let startDate = new Date(this.listQuery.time[0]).setHours(0, 0, 0)
          let endDate = new Date(this.listQuery.time[1]).setHours(23, 59, 59)
          params.startDate = startDate
          params.endDate = endDate
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
        page: this.page.page,
        hasCar: this.listQuery.hasCar,
        onlyMe: this.listQuery.onlyMe
      }
      this.listQuery.driverName && (params.driverName = this.listQuery.driverName)
      this.listQuery.phone && (params.phone = this.listQuery.phone)
      this.listQuery.carType && this.listQuery.carType.length !== 0 && (params.carType = this.listQuery.carType)
      this.listQuery.contactInfo && this.listQuery.contactInfo.length !== 0 && (params.contactInfo = this.listQuery.contactInfo)
      this.listQuery.followPerson && (params.followPerson = this.listQuery.followPerson)
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.status !== '' && (params.status = this.listQuery.status)
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
        marketClueId: this.rows.map((item:any) => item.id + ''),
        followerId: this.dialogListQuery.follow[2]
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
        let contactsOption = res.data.Intentional_compartment.map(function(item:any) {
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
  // 获取城市、小组、跟进人
  async showCityGroupPerson(node: any, resolve: any) {
    if (node.level === 0) {
      let citys = await this.getOpenCitys()
      resolve(citys)
    } else if (node.level === 1) {
      let groups = await this.getGroupInfoByCityCodeAndProductLine(+node.value)
      resolve(groups)
    } else if (node.level === 2) {
      let [groupId, busiType] = node.value.split(',')
      let users = await this.getGmOptions(node.parent.value, busiType, groupId)
      resolve(users)
    }
  }
  // 获取开通城市
  async getOpenCitys() {
    try {
      let { data: res } = await GetOpenCityData()
      if (res.success) {
        return res.data.map((item:any) => ({
          value: item.code,
          label: item.name
        }))
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get open city fail:${err}`)
    } finally {
      //
    }
  }
  // 获取小组
  async getGroupInfoByCityCodeAndProductLine(cityCode:number) {
    try {
      let params:IState = {
        busiLine: [0, 1].toString(),
        cityCode
      }
      let { data: res } = await getGroupInfoByCityCodeAndProductLine(params)
      if (res.success) {
        return res.data.map((item:any) => ({
          value: item.id + ',' + item.dutyId,
          label: item.name
        }))
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get group fail:${err}`)
    } finally {
      //
    }
  }
  // 获取小组下的人
  async getGmOptions(cityCode:number, busiType:number, groupId:number) {
    try {
      let params:IState = {
        roleTypes: [1],
        cityCode,
        busiType,
        groupId,
        uri: '/v2/driverBilling/shippingChange/queryGM'
      }

      let { data: res } = await GetSpecifiedRoleList(params)
      if (res.success) {
        return res.data.map(function(item: any) {
          return {
            label: item.name,
            value: item.id,
            disabled: item.status === 2,
            leaf: true
          }
        })
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
</style>
