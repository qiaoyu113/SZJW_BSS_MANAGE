<template>
  <div class="ContractListForm">
    <div class-name="sub-navbar">
      <div class="filter-container">
        <div :class="isPC ? 'menuBox' : 'menuBox-m'">
          <el-row>
            <el-form :label-width="isPC ? '120px' : '30%'">
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="订单编号">
                  <el-input
                    v-model="listQuery.orderId"
                    name="contractlist_orderId_input"
                    placeholder="请输入订单编号"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="司机姓名">
                  <el-input
                    v-model="listQuery.driverName"
                    name="contractlist_driverName_input"
                    placeholder="请输入司机姓名"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="合同归属">
                  <el-select
                    v-model="listQuery.busiType"
                    name="contractlist_busiType_select"
                    placeholder="请选择合同归属"
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
                <el-form-item label="合同编号">
                  <el-input
                    v-model="listQuery.fileNo"
                    name="contractlist_fileNo_input"
                    placeholder="请输入合同编号"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="城市">
                  <el-select
                    v-model="listQuery.city"
                    name="contractlist_city_select"
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
                    name="contractlist_joinManageId_select"
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
              <el-col :span="isPC ? 12 : 24">
                <el-form-item label="生成时间">
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
                  name="contractlist_reset_btn"
                  @click="reset"
                >
                  重置
                </el-button>
                <el-button
                  :class="isPC ? 'filter-item' : 'filter-item-m'"
                  size="small"
                  type="primary"
                  name="contractlist_filter_btn"
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
import { GetDictionary, GetOpenCityData, GetJoinManageList } from '@/api/common'
import { PermissionModule } from '@/store/modules/permission'
import { SettingsModule } from '@/store/modules/settings'
import { TimestampYMD } from '@/utils/index'
import '@/styles/common.scss'

@Component({
  name: 'ContractListForm',
  components: {}
})
export default class extends Vue {
  @Prop({ default: {} }) private listQuery: any;
  @Prop({ default: () => [] }) private DateValue!: any[];
  private optionsCity: any[] = []; // 字典查询定义(命名规则为options + 类型名称)
  private optionsBusi: any[] = []
  private optionsJoin: any[] = []
  private DateValueChild: any[] = []; // DateValue的赋值项
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

  // 判断是否PC
  get isPC() {
    return SettingsModule.isPC
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
      case 'driverName':
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
      case 'joinManageId':
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

  // 获取加盟经理
  private async getJoinManageList() {
    const { data } = await GetJoinManageList({
      uri: '/v1/order/deliever/getDelieverList'
    })
    if (data.success) {
      this.optionsJoin = data.data
    } else {
      this.$message.error(data)
    }
  }

  // 查询城市
  private async getDictionaryCity() {
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

  // 查询合同归属
  private async getDictionaryContract() {
    const { data } = await GetDictionary({ dictType: 'busi_type' })
    if (data.success) {
      this.optionsBusi = data.data
    } else {
      this.$message.error(data)
    }
  }

  // 字典查询汇总
  private getDictionary() {
    this.getDictionaryCity()
    this.getDictionaryContract()
  }

  // 时间选择方法
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
    this.getDictionary()
    this.getJoinManageList()
  }
}
</script>

<style lang="scss" scope>
.ContractListForm {
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
