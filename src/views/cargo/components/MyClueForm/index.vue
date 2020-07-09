<template>
  <div :class="isPC ? 'MyClueForm' : 'MyClueForm-m'">
    <div class-name="sub-navbar">
      <div class="filter-container">
        <div :class="isPC ? 'menuBox' : 'menuBox-m'">
          <el-row>
            <el-form :label-width="isPC ? '120px' : '28%'">
              <ClueFormItem>
                <el-form-item label="城市">
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
              </ClueFormItem>

              <ClueFormItem>
                <el-form-item
                  label="创建日期"
                >
                  <el-date-picker
                    v-model="DateValueChild"
                    type="daterange"
                    value-format="timestamp"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changData()"
                  />
                </el-form-item>
              </ClueFormItem>

              <el-col
                :span="isPC ? 12 : 24"
                class="btn-box"
              >
                <el-button
                  :class="isPC ? 'filter-item' : 'filter-item-m'"
                  type="primary"
                  size="small"
                >
                  按钮
                </el-button>
                <el-button
                  :class="isPC ? 'filter-item' : 'filter-item-m'"
                  type="primary"
                  size="small"
                >
                  按钮2
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
import ClueFormItem from './MyClueItem.vue'
import { GetDictionary } from '@/api/common'
@Component({
  name: 'MyClueForm',
  components: {
    ClueFormItem
  }
})
export default class MyClueForm extends Vue {
  @Prop({ default: {} }) private listQuery:any
  @Prop({ default: () => [] }) private DateValue!:any[]
  private optionsCity:any[] = []
  private DateValueChild:object[] = []
  private QUERY_KEY_LIST: string[] = ['page', 'limit', 'state', 'startDate']

  @Watch('DateValue', { deep: true })
  private onDateChange(value: any) {
    this.DateValueChild = value
  }
  @Watch('listQuery', { deep: true })
  private onListQuery(value: any) {
    let tags:any[] = []
    for (let item in value) {
      if (this.QUERY_KEY_LIST.indexOf(item) < 0) {
        if (value[item] && item === 'endDate') {
          tags.unshift(
            {
              name: TimestampYMD(value['startDate']) + '-' + TimestampYMD(value['endDate']),
              type: '',
              key: item
            }
          )
        } else {
          if (value[item]) {
            tags.unshift(
              {
                name: this.matchName(item, value[item]),
                type: '',
                key: item
              }
            )
          }
        }
      }
    }
    this.$emit('handle-tags', tags)
  }
  created() {
    this.getDictionary()
  }

  private async getDictionary() {
    const { data } = await GetDictionary({ dictType: 'online_city' })
    this.optionsCity = data.data
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
      default:
        vodeName = ''
        break
    }
    return vodeName
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
}
</script>
<style lang="scss" scoped>
.MyClueForm{
      .menuBox{
        padding: 20px 30px 0 0;
        box-sizing: border-box;
        .btn-box{
            text-align: center;
            .filter-item{
                float: right;
                margin-left: 30px;
            }
            .filter-item-m{
                width: 80%;
                margin: 0 auto 10px;
            }
        }
    }
}
</style>
<style lang="scss" scoped>
.MyClueForm-m{
    .menuBox-m{
        padding: 20px 0 0 0;
        box-sizing: border-box;
        .el-date-m {
            width: 79%;
        }
        .btn-box{
            text-align: center;
            .filter-item{
                float: right;
                margin-left: 30px;
            }
            .filter-item-m{
                width: 80%;
                margin: 0 auto 10px;
            }
        }
    }
}
</style>
