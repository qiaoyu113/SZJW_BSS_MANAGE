<template>
  <div class="SuggestForm">
    <div class-name="sub-navbar">
      <div class="filter-container">
        <div :class="isPC ? 'menuBox' : 'menuBox-m'">
          <el-row>
            <el-form :label-width="isPC ? '120px' : '30%'">
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="货主编号">
                  <el-input
                    v-model="listQuery.customerId"
                    name="ownerlist_customerId_input"
                    placeholder="请输入货主编号"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="联系人">
                  <el-input
                    v-model="listQuery.bussinessName"
                    name="ownerlist_bussinessName_input"
                    placeholder="请输入联系人"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="联系电话">
                  <el-input
                    v-model="listQuery.bussinessPhone"
                    name="ownerlist_bussinessPhone_input"
                    placeholder="请输入联系电话"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="公司简称">
                  <el-input
                    v-model="listQuery.customerCompanyName"
                    name="ownerlist_customerCompanyName_input"
                    placeholder="请输入公司简称"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="分类">
                  <el-select
                    v-model="listQuery.classification"
                    name="ownerlist_classification_select"
                    placeholder="请选择分类"
                  >
                    <el-option
                      v-for="item in optionsClassification"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="城市">
                  <el-select
                    v-model="listQuery.city"
                    name="ownerlist_city_select"
                    placeholder="请选择"
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
                <el-form-item label="销售">
                  <el-select
                    v-model="listQuery.lineSaleId"
                    name="ownerlist_lineSaleId_select"
                    placeholder="请选择"
                    filterable
                  >
                    <el-option
                      v-for="item in optionsSale"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 12 : 24">
                <el-form-item label="创建日期">
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
              <el-col :span="isPC ? 12 : 24">
                <el-form-item label="合同止期">
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
              <el-col
                :span="isPC ? 24 : 24"
                class="btn-box"
              >
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
import { GetDictionary, GetOpenCityData, GetDictionaryList, GetManagerLists } from '@/api/common'
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
  private optionsCity: any[] = []; // 字典查询定义(命名规则为options + 类型名称)
  private optionsCompany: any[] = []
  private optionsSale: any[] = []
  private optionsClassification: any[] = []
  private DateValueChild: any[] = []; // DateValue的赋值项
  private DateValueChild2: any[] = []; // DateValue的赋值项
  private QUERY_KEY_LIST: any[] = ['page', 'limit', 'state', 'startDate', 'contractEndStartTime']; // 添加过滤listQuery中key的名称

  @Watch('DateValue', { deep: true })
  private onDateChange(value: any) {
    this.DateValueChild2 = value
  }

  @Watch('DateValue2', { deep: true })
  private onDateChange2(value: any) {
    this.DateValueChild = value
  }

  // listQuery同步tags公共方法
  @Watch('listQuery', { deep: true })
  private onListQueryChange(value: any) {
    let tags: any = []
    for (var key in value) {
      if (this.QUERY_KEY_LIST.indexOf(key) < 0) {
        if (value[key] && key === 'contractEndEndTime') {
          tags.unshift({
            name:
              TimestampYMD(value['contractEndStartTime']) +
              '-' +
              TimestampYMD(value['contractEndEndTime']),
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
    this.getOpenCityData()
    this.getLowerStaffInfo()
  }

  // 匹配创建tags标签
  private matchName(key: any, value: any) {
    let vodeName = ''
    switch (key) {
      // 根据listQuery中的key来判断
      case 'city':
        for (let entry of this.optionsCity) {
          if (entry.codeVal === value) {
            vodeName = entry.code
          }
        }
        break
      case 'customerId':
        vodeName = value
        break
      case 'bussinessName':
        vodeName = value
        break
      case 'bussinessPhone':
        vodeName = value
        break
      case 'customerCompanyName':
        vodeName = value
        break
      case 'lineSaleId':
        for (let entry of this.optionsSale) {
          if (entry.id === value) {
            vodeName = entry.name
          }
        }
        break
      case 'classification':
        for (let entry of this.optionsClassification) {
          if (entry.dictValue === value) {
            vodeName = entry.dictLabel
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
      console.log(`get `)
    }
  }

  private async getDictionary() {
    try {
      let params = ['customer_category']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        this.optionsClassification = res.data.customer_category
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
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

  private changData2() {
    if (this.DateValueChild2) {
      this.listQuery.startDate = this.DateValueChild2[0]
      this.listQuery.endDate = this.DateValueChild2[1] + 86399999
    } else {
      this.listQuery.startDate = ''
      this.listQuery.endDate = ''
    }
    console.log(this.listQuery)
  }

  private changData() {
    if (this.DateValueChild) {
      this.listQuery.contractEndStartTime = this.DateValueChild[0]
      this.listQuery.contractEndEndTime = this.DateValueChild[1] + 86399999
    } else {
      this.listQuery.contractEndStartTime = ''
      this.listQuery.contractEndEndTime = ''
    }
  }

  private research() {
    this.$emit('handle-query', this.listQuery)
  }

  private reset() {
    for (let key in this.listQuery) {
      if (key !== 'page' && key !== 'limit') { this.listQuery[key] = '' } else {
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
</style>
