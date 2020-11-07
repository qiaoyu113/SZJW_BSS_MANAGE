<template>
  <div class="SuggestFormNew">
    <div class-name="sub-navbar">
      <div class="filter-container">
        <div :class="isPC ? 'menuBox' : 'menuBox-m'">
          <el-row>
            <el-form
              size="small"
              :label-width="isPC ? '90px' : '28%'"
            >
              <el-col :span="isPC ? 8 : 24">
                <el-form-item label="租车车型">
                  <el-select
                    v-model="listQuery.carType"
                    placeholder="请选择"
                    clearable
                    filterable
                    name="rentcartype_chooseCarType_select"
                  >
                    <el-option
                      v-for="(item, index) in dataTypes.optionsCar"
                      :key="index"
                      :label="item.dictLabel"
                      :value="Number(item.dictValue)"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 8 : 24">
                <el-form-item label="供应商">
                  <el-input
                    v-model="listQuery.supplier"
                    placeholder="请输入供应商"
                    name="rentcartype_chooseSupplier_input"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 8 : 24">
                <el-form-item label="城市">
                  <el-select
                    v-model="listQuery.city"
                    placeholder="请选择"
                    name="rentcartype_chooseCity_select"
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
              <el-col :span="isPC ? 8 : 24">
                <el-form-item label="商品编号">
                  <el-input
                    v-model="listQuery.productCode"
                    placeholder="请输入商品编号"
                    clearable
                    name="rentcartype_chooseProductCoder_input"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 8 : 24">
                <el-form-item label="车型状态">
                  <el-select
                    v-model="listQuery.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  >
                    <el-option
                      label="全部"
                      value=""
                    />
                    <el-option
                      label="已上架"
                      value="10"
                    />
                    <el-option
                      label="已下架"
                      value="20"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 8 : 24">
                <el-form-item label="创建日期">
                  <el-date-picker
                    v-model="DateValueChild"
                    :class="isPC ? '' : 'el-date-m'"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    clearable
                    :editable="false"
                    @change="changData()"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="isPC ? 24 : 24"
                class="btn-box"
              >
                <el-button
                  size="small"
                  :class="isPC ? 'filter-item' : 'filter-item-m'"
                  type="primary"
                  name="rentcartype_query_btn"
                  @click="search"
                >
                  查询
                </el-button>
                <el-button
                  size="small"
                  :class="isPC ? 'filter-item' : 'filter-item-m'"
                  name="rentcartype_reset_btn"
                  @click="resetForm"
                >
                  重置
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
      optionsCar: []
    };
  private DateValueChild: any = []; // DateValue的赋值项
  private QUERY_KEY_LIST: any[] = ['page', 'limit', 'status', 'busiType', 'startDate']; // 添加过滤listQuery中key的名称
  private loading: boolean = false;
  private optionsCity: any[] = []; // 字典查询定义(命名规则为options + 类型名称)

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

  private matchName(key: any, value: any) {
    let vodeName = ''
    const {
      optionsCity,
      optionsCar } = this.dataTypes
    const cityItem = optionsCity.find((item: any) => item.code === value)
    const carItem = optionsCar.find((item: any) => Number(item.dictValue) === value)
    switch (key) {
      // 根据listQuery中的key来判断
      case 'city':
        vodeName = cityItem ? cityItem['name'] : value
        break
      case 'carType':
        vodeName = carItem ? carItem['dictLabel'] : value
        break
      default:
        vodeName = this.listQuery[key] || ''
        break
    }
    return vodeName
  }
  // 重置
  private resetForm() {
    for (const key in this.listQuery) {
      if (!this.QUERY_KEY_LIST.includes(key)) {
        this.listQuery[key] = ''
      }
    }
    this.DateValueChild = null
    this.listQuery.status = ''
    this.listQuery.startDate = ''
    this.listQuery.endDate = ''
  }
  private changData() {
    if (this.DateValueChild) {
      this.listQuery.startDate = this.DateValueChild[0] + ' 00:00:00'
      this.listQuery.endDate = this.DateValueChild[1] + ' 23:59:59'
    } else {
      this.listQuery.startDate = ''
      this.listQuery.endDate = ''
    }
  }
  private search() {
    this.$emit('handle-query')
  }
}
</script>

<style lang="scss">
.SuggestFormNew {
  width: 100%;
  background: #fff;
  margin-bottom: 10px;
  margin-left:0px!important;
  margin-right:0px!important;
  box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
  .el-form-item{
    padding: 0 10px;
  }
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
    padding: 15px;
    box-sizing: border-box;
    position: relative;
    z-index: 1000;
    background: #fff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.85);
    right: 0;
    left: 0;
    .btn-box {
      text-align: center;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      .filter-item {
        margin-bottom: 0;
        // margin-left: 30px;
      }
      .filter-item-m {
        width: 80%;
        // margin: 0 auto 10px;
      }
    }
    .el-select {
      display: block;
    }
    .el-input {
      width: 100%;
    }
    .el-date-editor{
      width: 100%;
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
