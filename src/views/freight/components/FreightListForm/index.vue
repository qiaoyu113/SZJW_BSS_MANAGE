<template>
  <div class="SuggestForm">
    <div class-name="sub-navbar">
      <div class="filter-container">
        <div :class="isPC ? 'menuBox' : 'menuBox-m'">
          <el-row>
            <el-form :label-width="isPC ? '120px' : '30%'">
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="出车单号">
                  <el-input
                    v-model="listQuery.wayBillId"
                    name="freightlist_wayBillId_input"
                    placeholder="请输入"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="司机城市">
                  <el-select
                    v-model="listQuery.driverCity"
                    name="freightlist_driverCity_input"
                    placeholder="请选择"
                    filterable
                  >
                    <el-option
                      v-for="item in optionsCity"
                      :key="item.codeVal"
                      :label="item.code"
                      :value="item.codeVal"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="司机姓名">
                  <el-input
                    v-model="listQuery.driver"
                    name="freightlist_driver_input"
                    placeholder="请输入姓名/手机号"
                    clearable
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
                  >
                    <el-option
                      v-for="item in optionsJoin"
                      :key="item.id"
                      :label="item.nick"
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
                    placeholder="线路名称/编号"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="业务线">
                  <el-select
                    v-model="listQuery.business"
                    name="freightlist_feeDiff_input"
                    placeholder="请选择"
                    filterable
                  >
                    <el-option
                      v-for="item in businessList"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="上岗经理">
                  <el-select
                    v-model="listQuery.dutyManagerId"
                    filterable
                    name="freightlist_dutyManagerId_input"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in optionsClassification"
                      :key="item.id"
                      :label="item.nick"
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

              <el-col :span="isPC ? 12 : 24">
                <el-form-item label="出车日期">
                  <el-date-picker
                    v-model="DateValueChild"
                    :class="isPC ? '' : 'el-date-m'"
                    :editable="false"
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
                    筛选
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
import { GetDictionary, GetOpenCityData, GetDictionaryList, GetManagerLists, GetJoinManageList } from '@/api/common'
import { GetSpecifiedRoleList } from '@/api/freight'
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
  private optionsClassification: any[] = []
  private DateValueChild: any[] = []; // DateValue的赋值项
  private DateValueChild2: any[] = []; // DateValue的赋值项
  private QUERY_KEY_LIST: any[] = ['page', 'limit', 'state', 'startDate', 'contractEndStartTime']; // 添加过滤listQuery中key的名称
  private hasDiff: any[] = [
    { dictValue: '1', dictLabel: '有' },
    { dictValue: '0', dictLabel: '无' }
  ]
  private uploading: any[] = [
    { dictValue: '', dictLabel: '全部' },
    { dictValue: '1', dictLabel: '未上报' },
    { dictValue: '2', dictLabel: '已上报' }
  ]
  private businessList: any[] = [
    { dictValue: '', dictLabel: '全部' },
    { dictValue: '1', dictLabel: '共享' },
    { dictValue: '2', dictLabel: '专车' }
  ]

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
  private onListQueryChange(value: any) {
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
          console.log(tags)
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
    this.getOpenCityData()
    this.getLowerStaffInfo()
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

  private async getOpenCityData() {
    try {
      let { data: res } = await GetOpenCityData()
      if (res.success) {
        this.optionsCity = res.data.map(function(item:any) {
          return {
            code: item.name,
            codeVal: item.code
          }
        })
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 获取加盟经理列表
  private async getDictionary() {
    return new Promise((resolve, reject) => {
      GetSpecifiedRoleList(3)
        .then(({ data }: any) => {
          if (data.success) {
            this.optionsClassification = data.data
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

  // 获取加盟经理
  private async getJoinManageList() {
    return new Promise((resolve, reject) => {
      GetSpecifiedRoleList(1)
        .then(({ data }: any) => {
          if (data.success) {
            this.optionsJoin = data.data
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
      if (key !== 'page' && key !== 'limit' && key !== 'state') { this.listQuery[key] = '' } else {
        this.listQuery['page'] = 1
      }
    }
    this.DateValueChild = []
    this.DateValueChild2 = []
  }
}
</script>

<style lang="scss" scope>
.SuggestForm {
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
    .el-input {
      width: 75%;
    }
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
</style>
