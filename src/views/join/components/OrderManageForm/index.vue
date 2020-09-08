<template>
  <div class="OrderManageForm">
    <div class-name="sub-navbar">
      <div class="filter-container">
        <div :class="isPC ? 'menuBox' : 'menuBox-m'">
          <el-row>
            <el-form :label-width="isPC ? '120px' : '30%'">
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="订单编号">
                  <el-input
                    v-model="listQuery.orderId"
                    name="ordermanage_orderId_input"
                    placeholder="请输入订单编号"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="司机姓名">
                  <el-input
                    v-model="listQuery.diverName"
                    name="ordermanage_diverName_input"
                    placeholder="请输入联系人"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="合作模式">
                  <el-select
                    v-model="listQuery.cooperationModel"
                    name="ordermanage_cooperationModel_select"
                    placeholder="请选择合作模式"
                  >
                    <el-option
                      v-for="item in optionsCooper"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="商品分类">
                  <el-select
                    v-model="listQuery.busiType"
                    name="ordermanage_busiType_select"
                    placeholder="请选择商品分类"
                  >
                    <el-option
                      v-for="item in optionsBusi"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="支付方式">
                  <el-select
                    v-model="listQuery.payType"
                    name="ordermanage_payType_select"
                    placeholder="请选择支付方式"
                  >
                    <el-option
                      v-for="item in optionsPay"
                      :key="item.dictTypeCode"
                      :label="item.dictTypeName"
                      :value="item.dictTypeCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="城市">
                  <el-select
                    v-model="listQuery.city"
                    name="ordermanage_city_select"
                    placeholder="请选择城市"
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
                <el-form-item label="加盟经理">
                  <el-select
                    v-model="listQuery.joinManageId"
                    name="ordermanage_joinManageId_select"
                    placeholder="请选择加盟经理"
                    filterable
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
              <!-- <el-col :span="isPC ? 6 : 24">
                <el-form-item label="所属小组">
                  <el-select
                    v-model="listQuery.groupId"
                    placeholder="请选择所属小组"
                  >
                    <el-option
                      v-for="item in optionsGroup"
                      :key="item.codeVal"
                      :label="item.code"
                      :value="item.codeVal"
                    />
                  </el-select>
                </el-form-item>
              </el-col> -->
              <el-col :span="isPC ? 12 : 24">
                <el-form-item label="订单创建时间">
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
                :span="isPC ? 12 : 24"
                class="btn-box"
              >
                <!-- <el-button
                  :class="isPC ? 'filter-item' : 'filter-item-m'"
                  type="success"
                >
                  导出订单
                </el-button> -->
                <el-button
                  :class="isPC ? 'filter-item' : 'filter-item-m'"
                  size="small"
                  name="ordermanage_reset_btn"
                  @click="reset"
                >
                  重置
                </el-button>
                <el-button
                  :class="isPC ? 'filter-item' : 'filter-item-m'"
                  size="small"
                  type="primary"
                  name="ordermanage_filter_btn"
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
import { GetDictionaryList, GetJoinManageList, GetOpenCityData, GetPayList } from '@/api/common'
import { PermissionModule } from '@/store/modules/permission'
import { SettingsModule } from '@/store/modules/settings'
import { TimestampYMD } from '@/utils/index'
import '@/styles/common.scss'

@Component({
  name: 'OrderManageForm',
  components: {}
})
export default class extends Vue {
  @Prop({ default: {} }) private listQuery: any;
  @Prop({ default: () => [] }) private DateValue!: any[];
  private optionsCity: any[] = []; // 字典查询定义(命名规则为options + 类型名称)
  private DateValueChild: any[] = []; // DateValue的赋值项
  private optionsBusi: any[] = []
  private optionsPay: any[] = []
  private optionsJoin: any[] = []
  private optionsGroup: any[] = []
  private optionsCooper: any[] = [
    {
      dictValue: '1',
      dictLabel: '购车'
    },
    {
      dictValue: '2',
      dictLabel: '租车'
    },
    {
      dictValue: '3',
      dictLabel: '带车'
    }
  ]
  private QUERY_KEY_LIST: any[] = ['page', 'limit', 'state', 'startDate']; // 添加过滤listQuery中key的名称

  @Watch('DateValue', { deep: true })
  private onDateChange(value: any) {
    this.DateValueChild = value
  }

  // listQuery同步tags公共方法
  @Watch('listQuery', { deep: true })
  private onListQueryChange(value: any) {
    let tags: any = []
    for (var key in value) {
      if (this.QUERY_KEY_LIST.indexOf(key) < 0) {
        if (value[key] && key === 'endDate') {
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

  // 汇总请求
  private fetchData() {
    this.getDictionary()
    this.getJoinManageList()
    this.getCity()
    this.getPayList()
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
      case 'orderId':
        vodeName = value
        break
      case 'diverName':
        vodeName = value
        break
      case 'fileNo':
        vodeName = value
        break
      case 'busiType':
        for (let entry of this.optionsBusi) {
          if (entry.dictValue === value) {
            vodeName = entry.dictLabel
          }
        }
        break
      case 'cooperationModel':
        for (let entry of this.optionsCooper) {
          if (entry.dictValue === value) {
            vodeName = entry.dictLabel
          }
        }
        break
      case 'payType':
        for (let entry of this.optionsPay) {
          if (entry.dictTypeCode === value) {
            vodeName = entry.dictTypeName
          }
        }
        break
      case 'joinManageId':
        for (let entry of this.optionsJoin) {
          if (entry.id === value) {
            vodeName = entry.name
          }
        }
        break
      case 'groupId':
        for (let entry of this.optionsGroup) {
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

  // 获取字典
  private async getDictionary() {
    const { data } = await GetDictionaryList(['busi_type', 'pay_type'])
    if (data.success) {
      this.optionsBusi = data.data.busi_type.splice(0, 2)
      // this.optionsPay = data.data.pay_type
    } else {
      this.$message.error(data)
    }
  }

  // 获取支付字典
  private async getPayList() {
    const { data } = await GetPayList({})
    if (data.success) {
      this.optionsPay = data.data
    } else {
      this.$message.error(data)
    }
  }

  // 获取城市字典
  async getCity() {
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

  // 获取加盟经理
  private async getJoinManageList() {
    const { data } = await GetJoinManageList({
      uri: '/v1/order/getOrderInfoList'
    })
    if (data.success) {
      this.optionsJoin = data.data
    } else {
      this.$message.error(data)
    }
  }

  // 时间选择
  private changData() {
    if (this.DateValueChild) {
      this.listQuery.startDate = this.DateValueChild[0]
      this.listQuery.endDate = this.DateValueChild[1] + 86399999
    } else {
      this.listQuery.startDate = ''
      this.listQuery.endDate = ''
    }
  }

  // 搜索
  private research() {
    this.$emit('handle-query', this.listQuery)
  }

  // 重置
  private reset() {
    for (let key in this.listQuery) {
      if (key !== 'page' && key !== 'limit') { this.listQuery[key] = '' } else {
        this.listQuery['page'] = 1
      }
    }
    this.DateValueChild = []
  }

  // 生命周期
  created() {
    this.fetchData()
  }
}
</script>

<style lang="scss" scope>
.OrderManageForm {
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
    position: absolute;
    z-index: 1000;
    background: #fff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.85);
    right: 15px;
    left: 15px;
    .btn-box {
      text-align: center;
      .filter-item {
        float: right;
        // height: 34px;
        font-size: 14px;
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
