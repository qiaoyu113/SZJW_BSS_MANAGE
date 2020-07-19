<template>
  <div class="SuggestForm">
    <div class-name="sub-navbar">
      <div class="filter-container">
        <div :class="isPC ? 'menuBox' : 'menuBox-m'">
          <el-row>
            <el-form :label-width="isPC ? '120px' : '28%'">
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="线索编号">
                  <el-input
                    v-model="listQuery.clueId"
                    placeholder="请输入线索编号"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="姓名">
                  <el-input
                    v-model="listQuery.name"
                    placeholder="请输入姓名"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="手机号">
                  <el-input
                    v-model="listQuery.phone"
                    placeholder="请输入手机号"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="线索来源">
                  <el-select
                    v-model="listQuery.clueSource"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in dataTypes.optionsLineSource"
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
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in dataTypes.optionsCity"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="分配状态">
                  <el-select
                    v-model="listQuery.distributionState"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in dataTypes.optionsDistribution"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="销售">
                  <el-select
                    v-model="listQuery.lineSaleId"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in dataTypes.optionsSale"
                      :key="index"
                      :label="item.saleName"
                      :value="item.saleId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 12 : 24">
                <el-form-item label="创建日期">
                  <el-date-picker
                    v-model="DateValueChild"
                    :class="isPC ? '' : 'el-date-m'"
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
                <el-button
                  :class="isPC ? 'filter-item' : 'filter-item-m'"
                  @click="resetForm"
                >
                  重置
                </el-button>
                <el-button
                  :class="isPC ? 'filter-item' : 'filter-item-m'"
                  type="primary"
                  @click="search"
                >
                  查询
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
import { GetDictionary, GetOpenCityData } from '@/api/common'
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
  @Prop({ default: () => {} }) private dataTypes!: {
      optionsCity: [],
      optionsClue: [],
      optionsDistribution: [],
      optionsLineSource: [],
      optionsSale:[]
    };
  private optionsCity: any[] = []; // 字典查询定义(命名规则为options + 类型名称)
  private DateValueChild: any = []; // DateValue的赋值项
  private QUERY_KEY_LIST: any[] = ['page', 'limit', 'startDate']; // 添加过滤listQuery中key的名称

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
          if (value[key] || value[key] === 0) {
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

  // 匹配创建tags标签
  private matchName(key: any, value: any) {
    let vodeName = ''
    const {
      optionsCity,
      optionsClue,
      optionsDistribution,
      optionsLineSource,
      optionsSale } = this.dataTypes
    const cityItem = optionsCity.find((item: any) => item.code === value)
    const clueItem = optionsClue.find((item: any) => item.code === value)
    const distributionItem = optionsDistribution.find((item: any) => item.value === value)
    const sourceItem = optionsLineSource.find((item: any) => item.dictValue === value)
    const saleItem = optionsSale.find((item: any) => item.saleId === value)
    switch (key) {
      // 根据listQuery中的key来判断
      case 'city':
        vodeName = cityItem ? cityItem['name'] : value
        break
      case 'clueSource':
        vodeName = sourceItem ? sourceItem['dictLabel'] : value
        break
      case 'clueItem':
        vodeName = clueItem ? clueItem['name'] : value
        break
      case 'distributionState':
        vodeName = distributionItem ? distributionItem['label'] : value
        break
      case 'lineSaleId':
        vodeName = saleItem ? saleItem['saleName'] : value
        break
      default:
        vodeName = this.listQuery[key] || ''
        break
    }
    return vodeName
  }

  private async getDictionary() {
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

  private changData() {
    if (this.DateValueChild) {
      this.listQuery.startDate = this.DateValueChild[0]
      this.listQuery.endDate = this.DateValueChild[1]
    } else {
      this.listQuery.startDate = ''
      this.listQuery.endDate = ''
    }
  }

  private search() {
    this.$emit('handle-query')
  }
  // 重置
  private resetForm() {
    for (const key in this.listQuery) {
      if (!this.QUERY_KEY_LIST.includes(key)) {
        this.listQuery[key] = ''
      }
    }
    this.DateValueChild = null
  }
}
</script>

<style lang="scss">
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
      .filter-item {
        float: right;
        margin-left: 30px;
      }
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
        margin-left: 30px;
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
