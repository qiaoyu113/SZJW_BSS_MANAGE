<template>
  <div class="FreightListForm">
    <div class-name="sub-navbar">
      <div class="filter-container">
        <div :class="isPC ? 'menuBox' : 'menuBox-m'">
          <el-row>
            <el-form
              :label-width="isPC ? '120px' : '30%'"
              size="small"
            >
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="出车单号">
                  <el-input
                    v-model="listQuery.wayBillId"
                    name="freightlist_wayBillId_input"
                    maxlength="50"
                    placeholder="请输入"
                    clearable
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="司机城市">
                  <!-- <el-select
                    v-model="listQuery.driverCity"
                    name="freightlist_driverCity_input"
                    filterable
                    placeholder="请选择"
                    size="small"
                    @change="getManager()"
                  >
                    <el-option
                      v-for="item in optionsCity"
                      :key="item.codeVal"
                      :label="item.code"
                      :value="item.codeVal"
                    />
                  </el-select> -->
                  <el-cascader
                    v-model="arrayCity"
                    :props="{
                      lazy: true,
                      lazyLoad: showWork
                    }"
                    placeholder="请选择"
                    clearable
                    @clear="() => {
                      arrayCity = []
                    }"
                    @change="getManager()"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="司机姓名">
                  <el-input
                    v-model="listQuery.driver"
                    name="freightlist_driver_input"
                    maxlength="50"
                    placeholder="请输入姓名/手机号"
                    clearable
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="加盟经理">
                  <el-select
                    v-model="listQuery.gmId"
                    filterable
                    name="freightlist_gmId_input"
                    placeholder="请选择"
                    size="small"
                    clearable
                  >
                    <el-option
                      v-for="item in optionsJoin"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="线路名称">
                  <el-input
                    v-model="listQuery.line"
                    name="freightlist_line_input"
                    maxlength="50"
                    placeholder="线路名称/编号"
                    clearable
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="业务线">
                  <el-select
                    v-model="listQuery.business"
                    name="freightlist_business_input"
                    placeholder="请选择"
                    filterable
                    size="small"
                    @change="getManager()"
                  >
                    <el-option
                      v-for="item in businessList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="客户名称">
                  <el-input
                    v-model="listQuery.customerName"
                    name="freightlist_customerName_input"
                    maxlength="50"
                    placeholder="请输入"
                    clearable
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="项目名称">
                  <el-input
                    v-model="listQuery.productName"
                    name="freightlist_productName_input"
                    maxlength="50"
                    placeholder="请输入"
                    clearable
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="上岗经理">
                  <el-select
                    v-model="listQuery.dutyManagerId"
                    filterable
                    clearable
                    name="freightlist_dutyManagerId_input"
                    placeholder="请选择"
                    size="small"
                  >
                    <el-option
                      v-for="item in optionsClassification"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="有无差额">
                  <el-select
                    v-model="listQuery.feeDiff"
                    name="freightlist_feeDiff_input"
                    placeholder="请选择"
                    filterable
                    clearable
                    size="small"
                  >
                    <el-option
                      v-for="item in hasDiff"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="司机上报状态">
                  <el-select
                    v-model="listQuery.driverUpLoadState"
                    name="freightlist_feeDiff_input"
                    placeholder="请选择"
                    filterable
                    size="small"
                  >
                    <el-option
                      v-for="item in uploading"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="客户上报状态">
                  <el-select
                    v-model="listQuery.clientUpLoadState"
                    name="freightlist_feeDiff_input"
                    placeholder="请选择"
                    filterable
                    size="small"
                  >
                    <el-option
                      v-for="item in uploading"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="外线销售">
                  <el-select
                    v-model="listQuery.lineSaleId"
                    name="freightlist_feeDiff_input"
                    placeholder="请选择"
                    filterable
                    clearable
                    size="small"
                  >
                    <el-option
                      v-for="item in lineSaleList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 12 : 24">
                <el-form-item label="出车日期">
                  <el-date-picker
                    v-model="DateValueChild"
                    size="small"
                    :class="isPC ? '' : 'el-date-m'"
                    :editable="false"
                    :picker-options="pickerOptions"
                    type="daterange"
                    value-format="timestamp"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changData()"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 12 : 24">
                <el-form-item label="运费更新时间">
                  <el-date-picker
                    v-model="DateValueChild2"
                    size="small"
                    :class="isPC ? '' : 'el-date-m'"
                    :editable="false"
                    type="daterange"
                    value-format="timestamp"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changData2()"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="isPC ? 24 : 24"
                class="btn-box"
              >
                <el-form-item label="运费状态">
                  <div style="display: inline-block; float: left;">
                    <el-badge
                      v-for="i in tab"
                      :key="i.name"
                      class="item"
                      type="primary"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        :plain="listQuery.state !== i.name"
                        @click="handleClick(i, 0)"
                      >
                        {{ i.label }}
                      </el-button>
                    </el-badge>
                  </div>
                </el-form-item>
              </el-col>

              <el-col
                :span="isPC ? 24 : 24"
                class="btn-box"
              >
                <el-form-item label="出车状态">
                  <div style="display: inline-block; float: left;">
                    <el-badge
                      v-for="i in dispatch"
                      :key="i.name"
                      class="item"
                      type="primary"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        :plain="listQuery.dispatchState !== i.name"
                        @click="handleClick(i, 1)"
                      >
                        {{ i.label }}
                      </el-button>
                    </el-badge>
                  </div>
                  <el-button
                    :class="isPC ? 'filter-item' : 'filter-item-m'"
                    size="small"
                    name="ownerlist_reset_btn"
                    @click="reset"
                  >
                    重置
                  </el-button>
                  <el-button
                    :class="isPC ? 'filter-item' : 'filter-item-m'"
                    type="primary"
                    size="small"
                    name="ownerlist_query_btn"
                    @click="research"
                  >
                    查询
                  </el-button>
                  <el-button
                    v-permission="['/v2/waybill/amount/export']"
                    :class="isPC ? 'filter-item' : 'filter-item-m'"
                    type="primary"
                    size="small"
                    name="ownerlist_derive_btn"
                    :loading="isExport"
                    @click="handleDeriveClick"
                  >
                    导出
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { GetOpenCityData, GetDictionaryList, GetManagerLists, GetJoinManageList, GetSpecifiedLowerUserListByCondition, getOfficeByType, getOfficeByTypeAndOfficeId, GetDutyListByLevel } from '@/api/common'
import { GetSpecifiedRoleList, managementDerive } from '@/api/freight'
import { PermissionModule } from '@/store/modules/permission'
import { SettingsModule } from '@/store/modules/settings'
import { TimestampYMD } from '@/utils/index'
import '@/styles/common.scss'

@Component({
  name: 'SuggestForm',
  components: {}
})
export default class extends Vue {
  @Prop({ default: {} }) private listQuery: any;
  @Prop({ default: () => [] }) private DateValue!: any[];
  @Prop({ default: () => [] }) private DateValue2!: any[];
  @Prop({ default: () => [] }) private tab!: any[];
  @Prop({ default: () => [] }) private dispatch!: any[];
  private optionsCity: any[] = []; // 字典查询定义(命名规则为options + 类型名称)
  private optionsCompany: any[] = []
  private optionsJoin: any[] = []
  private optionsSale: any[] = []
  private isExport: boolean = false
  private arrayCity: any[] = []
  private dutyListOptions: any[] = []
  private optionsClassification: any[] = []
  private DateValueChild: any[] = []; // DateValue的赋值项
  private DateValueChild2: any[] = []; // DateValue的赋值项
  private QUERY_KEY_LIST: any[] = ['page', 'limit', 'state', 'startDate', 'contractEndStartTime']; // 添加过滤listQuery中key的名称
  private hasDiff: any[] = [
    { dictValue: '', dictLabel: '全部' },
    { dictValue: '1', dictLabel: '有' },
    { dictValue: '0', dictLabel: '无' }
  ]
  private uploading: any[] = [
    { dictValue: '', dictLabel: '全部' },
    { dictValue: '0', dictLabel: '待上报' },
    { dictValue: '1', dictLabel: '已上报' }
  ]
  private businessList: any[] = []
  private pickerOptions: any = {
    shortcuts: [ {
      text: '本月',
      onClick(picker: any) {
        const end = new Date()
        // end.setTime(end.getTime() - 3600 * 1000 * 24)
        end.setTime(end.getTime())
        const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '上月',
      onClick(picker: any) {
        let now = new Date()// 当前日期
        let nowYear = now.getFullYear()// 当前年
        nowYear += (nowYear < 2000) ? 1900 : 0//
        let lastMonthDate = new Date()// 上月日期
        lastMonthDate.setDate(1)
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
        let lastMonth = lastMonthDate.getMonth()
        // 获得某月天数
        let monthStartDate = new Date(nowYear, lastMonth, 1)
        let monthEndDate = new Date(nowYear, lastMonth + 1, 1)
        let subtract = Number(monthEndDate) - Number(monthStartDate)
        let days = subtract / (1000 * 60 * 60 * 24)
        const start = new Date(nowYear, lastMonth, 1)
        const end = new Date(nowYear, lastMonth, days)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '近三月',
      onClick(picker: any) {
        const date = new Date()
        const endTime = 1000 * 60 * 60 * 24 - 1
        const y = date.getFullYear()
        const m = date.getMonth()
        const d = date.getDate()
        const start = +new Date(y, m - 3, d)
        const end = +new Date(y, m, d) + endTime
        picker.$emit('pick', [start, end])
      }
    }]
  }

  @Watch('DateValue', { deep: true })
  private onDateChange(value: any) {
    this.DateValueChild = value
  }

  @Watch('DateValue2', { deep: true })
  private onDateChange2(value: any) {
    this.DateValueChild2 = value
  }

  // listQuery同步tags公共方法
  @Watch('listQuery', { deep: true })
  private onListQueryChange(value: any, oldValue: any) {
    let tags: any = []
    for (var key in value) {
      if (this.QUERY_KEY_LIST.indexOf(key) < 0) {
        if (value[key] && key === 'freightEndTime') {
          tags.unshift({
            name:
              TimestampYMD(value['freightStartTime']) +
              '-' +
              TimestampYMD(value['freightEndTime']),
            type: '',
            key: key
          })
        } else if (value[key] && key === 'endDate') {
          tags.unshift({
            name:
              TimestampYMD(value['startDate']) +
              '-' +
              TimestampYMD(value['endDate']),
            type: '',
            key: key
          })
        } else {
          if (value[key]) {
            tags.unshift({
              name: this.matchName(key, value[key]),
              type: '',
              key: key
            })
          }
        }
      }
    }
    this.$emit('handle-tags', tags)
  }

  get isPC() {
    return SettingsModule.isPC
  }

  get routes() {
    return PermissionModule.routes
  }

  get showLogo() {
    return SettingsModule.showSidebarLogo
  }

  created() {
    this.getDictionary()
    this.getJoinManageList()
    // this.getLowerStaffInfo()
    this.getDutyListByLevel()
    this.getDriverInfo()
  }
  // 外线销售列表
  // 司机列表收索
  private lineSaleList: any[] = []
  async getDriverInfo() {
    try {
      let { data: res } = await GetSpecifiedLowerUserListByCondition({
        cityCode: this.listQuery.driverCity,
        groupId: '',
        keyword: '',
        productLine: '',
        roleTypes: ['2'],
        uri: '/v2/waybill/queryLineSale'
      })
      if (res.success) {
        this.lineSaleList.splice(0)
        let driverInfos = res.data.map(function(item: any) {
          return {
            label: item.name,
            value: item.id
          }
        })
        driverInfos.unshift(
          { label: '全部',
            value: '' })
        this.lineSaleList.push(...driverInfos)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      return err
    }
  }
  // 状态点击逻辑
  private handleClick(tab:any, type:any) {
    if (type) {
      this.listQuery.dispatchState = tab.name
    } else {
      this.listQuery.state = tab.name
    }
    this.listQuery.page = 1
    this.$emit('handle-check')
    this.$emit('handle-query', this.listQuery)
  }

  // 匹配创建tags标签
  private matchName(key: any, value: any) {
    let vodeName = ''
    switch (key) {
      // 根据listQuery中的key来判断
      case 'driverCity':
        for (let entry of this.optionsCity) {
          if (entry.codeVal === value) {
            vodeName = entry.code
          }
        }
        break
      case 'wayBillId':
        vodeName = value
        break
      case 'driver':
        vodeName = value
        break
      case 'line':
        vodeName = value
        break
      case 'customerCompanyName':
        vodeName = value
        break
      case 'feeDiff':
        for (let entry of this.hasDiff) {
          if (entry.dictValue === value) {
            vodeName = entry.dictLabel
          }
        }
        break
      case 'dutyManagerId':
        for (let entry of this.optionsClassification) {
          if (entry.id === value) {
            vodeName = entry.name
          }
        }
        break
      case 'gmId':
        for (let entry of this.optionsJoin) {
          if (entry.id === value) {
            vodeName = entry.name
          }
        }
        break
      default:
        vodeName = ''
        break
    }
    return vodeName
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
        let nodes = await this.getOpenCityData({ type: 2 })
        resolve(nodes)
      } else if (node.level === 1) {
        let nodes = await this.cityDetail(query)
        resolve(nodes)
      }
    } catch (err) {
      resolve([])
    }
  }

  private async getOpenCityData(params: any) {
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
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
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

  // 获取加盟经理列表
  private async getDictionary() {
    return new Promise((resolve, reject) => {
      GetSpecifiedLowerUserListByCondition({
        cityCode: this.listQuery.driverCity,
        groupId: '',
        keyword: '',
        productLine: this.listQuery.business,
        // productLine: '',
        roleTypes: ['3'],
        uri: '/v2/waybill/queryDuty'
      })
        .then(({ data }: any) => {
          if (data.success) {
            this.optionsClassification = data.data
            this.optionsClassification.unshift({
              name: '全部',
              id: ''
            })
          } else {
            this.$message.error(data)
          }
          resolve(data)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
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
        this.businessList.push({
          label: '全部',
          value: ''
        })
        this.businessList.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get duty list fail:${err}`)
    }
  }

  // 重新获取加盟经理
  private getManager() {
    this.listQuery.driverCity = this.arrayCity[1]
    this.getDictionary()
    this.getJoinManageList()
    this.getDriverInfo()
    this.listQuery.lineSaleId = ''
    this.listQuery.dutyManagerId = ''
    this.listQuery.gmId = ''
  }

  // 获取加盟经理
  private async getJoinManageList() {
    return new Promise((resolve, reject) => {
      GetSpecifiedLowerUserListByCondition({
        cityCode: this.listQuery.driverCity,
        groupId: '',
        keyword: '',
        productLine: this.listQuery.business,
        roleTypes: ['1'],
        uri: '/v2/waybill/queryGm'
      })
        .then(({ data }: any) => {
          if (data.success) {
            this.optionsJoin = data.data
            this.optionsJoin.unshift({
              name: '全部',
              id: ''
            })
          } else {
            this.$message.error(data)
          }
          resolve(data)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }

  private async getLowerStaffInfo() {
    try {
      let { data: res } = await GetManagerLists({
        uri: '/v1/line/customer/queryLineCustomerList'
      })
      if (res.success) {
        this.optionsSale = res.data
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }

  private changData() {
    if (this.DateValueChild) {
      this.listQuery.startDate = this.DateValueChild[0]
      this.listQuery.endDate = this.DateValueChild[1] + 86399999
    } else {
      this.listQuery.startDate = ''
      this.listQuery.endDate = ''
    }
  }

  private changData2() {
    if (this.DateValueChild2) {
      this.listQuery.freightStartTime = this.DateValueChild2[0]
      this.listQuery.freightEndTime = this.DateValueChild2[1] + 86399999
    } else {
      this.listQuery.freightStartTime = ''
      this.listQuery.freightEndTime = ''
    }
  }

  private research() {
    this.$emit('handle-query', this.listQuery)
    this.$emit('handle-check')
  }

  private reset() {
    for (let key in this.listQuery) {
      if (key !== 'page' && key !== 'limit') { this.listQuery[key] = '' } else {
        this.listQuery['page'] = 1
      }
    }
    this.arrayCity = []
    this.DateValueChild = []
    this.DateValueChild2 = []
  }
  // 导出
  private async handleDeriveClick() {
    try {
      this.isExport = true
      let params = { ...this.listQuery }
      delete params.page
      delete params.limit
      if (this.DateValueChild && this.DateValueChild.length === 2) {
        const { data } = await managementDerive(params)
        if (data.success) {
          this.$message.success('导出成功')
        } else {
          this.$message.error(data.errorMsg || data.message)
        }
      } else {
        this.$message.error('请选择出车日期')
      }
    } catch (err) {
      console.log('export fail:', err)
    } finally {
      this.isExport = false
    }
  }
}
</script>

<style lang="scss" scope>
.FreightListForm {
  width: 100%;
  background: #fff;
  margin-bottom: 10px;
  box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
  .filter-container {
    padding: 0;
  }
  .menuBox-m {
    padding: 20px 10px;
    box-sizing: border-box;
    .el-date-m {
      width: 79%;
    }
    .btn-box {
      text-align: center;
      .filter-item-m {
        width: 80%;
        margin: 0 auto 10px;
      }
    }
    .el-select {
      width: 100%;
    }
    .el-input {
      width: 78%;
    }
  }
  .menuBox {
    padding: 20px 30px 0 0;
    box-sizing: border-box;
    .btn-box {
      text-align: center;
      .filter-item {
        float: right;
        // height: 34px;
        // font-size: 14px;
        margin-left: 10px;
      }
      .filter-item-m {
        width: 80%;
        margin: 0 auto 10px;
      }
    }
    .el-select {
      display: block;
    }
    // .el-input {
      // width: 75%;
    // }
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
.el-badge{
  margin-right: 20px;
}
.el-cascader{
  display: block;
}
</style>
