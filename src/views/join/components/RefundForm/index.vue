<template>
  <div class="RefundForm">
    <div class-name="sub-navbar">
      <div class="filter-container">
        <div :class="isPC ? 'menuBox' : 'menuBox-m'">
          <el-row>
            <el-form :label-width="isPC ? '120px' : '30%'">
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="订单编号">
                  <el-input
                    v-model="listQuery.name"
                    placeholder="请输入货主编号"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="司机姓名">
                  <el-input
                    v-model="listQuery.name"
                    placeholder="请输入联系人"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="订单归属">
                  <el-input
                    v-model="listQuery.name"
                    placeholder="请输入订单归属"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="城市">
                  <el-input
                    v-model="listQuery.name"
                    placeholder="请输入联系电话"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="加盟经理">
                  <el-select
                    v-model="listQuery.joinManageId"
                    placeholder="请选择"
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
                <el-form-item label="支付方式">
                  <el-select
                    v-model="listQuery.city"
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
              <el-col :span="isPC ? 12 : 24">
                <el-form-item label="退款申请时间">
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
                :span="isPC ? 24 : 24"
                class="btn-box"
              >
                <el-button
                  :class="isPC ? 'filter-item' : 'filter-item-m'"
                  @click="reset"
                >
                  重置
                </el-button>
                <el-button
                  :class="isPC ? 'filter-item' : 'filter-item-m'"
                  type="primary"
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
  name: 'RefundForm',
  components: {}
})
export default class extends Vue {
  @Prop({ default: {} }) private listQuery: any;
  @Prop({ default: () => [] }) private DateValue!: any[];
  private optionsCity: any[] = []; // 字典查询定义(命名规则为options + 类型名称)
  private DateValueChild: any[] = []; // DateValue的赋值项
  private QUERY_KEY_LIST: any[] = ['page', 'limit', 'state', 'startDate']; // 添加过滤listQuery中key的名称
  private optionsJoin: any[] = []

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

  // 判断PC
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
      case 'diverName':
        vodeName = value
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
    const { data } = await GetJoinManageList({})
    if (data.success) {
      this.optionsJoin = data.data
    } else {
      this.$message.error(data)
    }
  }

  // 获取字典
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

  // 更改时间
  private changData() {
    if (this.DateValueChild) {
      this.listQuery.startDate = this.DateValueChild[0]
      this.listQuery.endDate = this.DateValueChild[1]
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
      this.listQuery[key] = ''
    }
    this.DateValueChild = []
  }

  // 生命周期
  created() {
    this.getDictionary()
  }
}
</script>

<style lang="scss" scope>
.RefundForm {
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
