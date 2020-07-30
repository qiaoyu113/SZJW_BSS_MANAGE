<template>
  <div :class="isPC ? 'accountInfo' : 'accountInfo-m'">
    <dl>
      <!-- <dt>姓名：{{ listQuery.name }}</dt> -->
      <dd style="margin-left:0px">
        <el-row :class="isPC ? 'flex' :''">
          <el-col :span="isPC ? 16 : 24">
            <self-form
              class="base"
              :list-query="listQuery"
              :form-item="formItem"
              :pc-col="12"
              label-width="80px"
            >
              <template v-slot:c="{row}">
                {{ row.c | Timestamp }}
              </template>
              <template v-slot:detail="{row}">
                <router-link
                  :to="{path: '/'}"
                  class="link"
                >
                  {{ row.a }}
                </router-link>
              </template>
            </self-form>
          </el-col>
          <el-col :span="isPC ? 8 : 24">
            <div :class="isPC ? 'fee' : 'fee-m'">
              <span class="item">
                <h4>总运费</h4>
                <p>￥{{ listQuery.all }}</p>
              </span>
              <span class="item">
                <h4>总抽佣金额</h4>
                <p>￥{{ listQuery.yong }}</p>
              </span>
              <span class="item">
                <h4>账户余额</h4>
                <p>￥{{ listQuery.yu }}</p>
              </span>
            </div>
          </el-col>
        </el-row>
      </dd>
    </dl>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfForm from '@/components/base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
interface IState {
    [key: string]: any;
}
@Component({
  name: 'AccountInfo',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) listQuery!:IState
  @Prop({ default: () => [] }) formItem!:any[]

  get isPC() {
    return SettingsModule.isPC
  }
}
</script>
<style lang="scss" scoped>
  .accountInfo{
    dl {
      margin: 0;
      .title {
        padding-bottom: 20px;
        border-bottom:1px solid #EEEEEE;
        color:#303133;
        font-weight:bold;
      }
      dd {
        margin-left: 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .fee {
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-end;
          align-items: center;
          .item {
            margin-right:20px;
            text-align: center;
            h4 {
              margin:0px;
              color:#8F8F8F;
              font-size:12px;
            }
            p {
              font-size:14px;
              font-weight: bold;
            }
          }
        }
      }
      .link {
        color: #649CEE;
        font-weight:bold;
      }
      .flex {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
<style lang="scss" scoped>
.accountInfo-m{
  .fee-m{
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
<style scoped>
.accountInfo >>> .selfForm{
  padding: 0;
}
</style>
