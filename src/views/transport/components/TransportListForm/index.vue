<template>
  <div class="SuggestForm">
    <div class-name="sub-navbar">
      <div class="filter-container">
        <div :class="isPC ? 'menuBox' : 'menuBox-m'">
          <el-row>
            <el-form :label-width="isPC ? '120px' : '28%'">
              <transportItem :span="8">
                <el-form-item
                  label="工作城市"
                >
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
              </transportItem>
              <transportItem :span="8">
                <el-form-item
                  label="工作城市"
                >
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
              </transportItem>
              <transportItem :span="8">
                <el-form-item
                  label="工作城市"
                >
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
              </transportItem>
              <transportItem :span="8">
                <el-form-item
                  label="工作城市"
                >
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
              </transportItem>
              <!-- <transportItem :s   -->
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
import { GetReginByCityCode } from '@/api/transport'
import { PermissionModule } from '@/store/modules/permission'
import { SettingsModule } from '@/store/modules/settings'
import { TimestampYMD } from '@/utils/index'
import transportItem from './TransportItem.vue'
import '@/styles/common.scss'

@Component({
  name: 'SuggestForm',
  components: {
    transportItem
  }
})
export default class extends Vue {
    @Prop({ default: {} }) private listQuery: any
    @Prop({ default: () => [] }) private DateValue!: any[]
    private options:any[] = []
    private formQuery:object = {}
    private optionsCity: any[] = [] // 字典查询定义(命名规则为options + 类型名称)
    private DateValueChild: any[] = [] // DateValue的赋值项
    private QUERY_KEY_LIST: any[] = ['page', 'limit', 'state', 'startDate'] // 添加过滤listQuery中key的名称

    @Watch('DateValue', { deep: true })
    private onDateChange(value: any) {
      this.DateValueChild = value
    }

    // listQuery同步tags公共方法
    @Watch('listQuery', { deep: true })
    private onListQueryChange(value: any) {
      let tags:any = []
      for (var key in value) {
        if (this.QUERY_KEY_LIST.indexOf(key) < 0) {
          if (value[key] && key === 'endDate') {
            tags.unshift(
              {
                name: TimestampYMD(value['startDate']) + '-' + TimestampYMD(value['endDate']),
                type: '',
                key: key
              }
            )
          } else {
            if (value[key]) {
              tags.unshift(
                {
                  name: this.matchName(key, value[key]),
                  type: '',
                  key: key
                }
              )
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
      // this.getCity()
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
}
</script>

<style lang="scss">
.SuggestForm{
    width: 100%;
    .filter-container{
        padding:0;
    }
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

        // .el-select {
        //   width: 100%;
        // }
        // .el-input{
        //   width: 78%;
        // }
    }
    .menuBox{
        padding: 20px 30px 0 0;
        box-sizing: border-box;
        position: absolute;
        z-index: 1;
        background: #fff;
        box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.85);
        right: 15px;
        left: 15px;
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
        // .el-select {
        //   width: 25%;
        // }
        // .el-input{
        //   width: 75%;
        // }
    }
  }
</style>

<style lang="scss" scope>
.el-collapse-item__content{
    padding-bottom:0;
}
.el-form-item__label{
  color: #999999;
}
</style>
