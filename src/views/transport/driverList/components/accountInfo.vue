<template>
  <div class="accountInfo">
    <dl>
      <dt>{{ listQuery.name }}</dt>
      <dd>
        <el-row :class="isPC ? 'flex' :''">
          <el-col :span="isPC ? 11 : 24">
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
              <template slot="detail">
                <router-link
                  :to="{path: '/'}"
                  class="link"
                >
                  详情>>
                </router-link>
              </template>
            </self-form>
          </el-col>
          <el-col :span="isPC ? 13 : 24">
            <div class="fee">
              <span class="item">
                <h4>总运费</h4>
                <p>￥{{ listQuery.f }}</p>
              </span>
              <span class="item">
                <h4>总抽佣金额</h4>
                <p>￥{{ listQuery.g }}</p>
              </span>
              <span class="item">
                <h4>账户余额</h4>
                <p>￥{{ listQuery.h }}</p>
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
   private formItem:any[] = [
     {
       type: 7,
       key: 'a',
       label: '司机编号:'
     },
     {
       type: 7,
       key: 'b',
       label: '手机号:'
     },
     {
       type: 7,
       key: 'c',
       label: '工作城市:',
       slot: true
     },
     {
       key: 'd',
       type: 7,
       label: '车型:'
     },
     {
       key: 'e',
       type: 7,
       label: '加盟小组:'
     },
     {
       slot: true,
       w: '10px',
       type: 'detail'
     }
   ]

   get isPC() {
     return SettingsModule.isPC
   }
}
</script>
<style lang="scss" scoped>
  .accountInfo{
    dl {
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
