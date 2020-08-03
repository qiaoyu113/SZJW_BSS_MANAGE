<template>
  <div :class="isPC ? 'accountInfo' : 'accountInfo-m'">
    <dl v-if="isPC">
      <dd style="margin-left:0px">
        <el-row
          :span="24"
          :class="isPC ? 'flex' :''"
        >
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
    <dl v-else>
      <dd class="acountTitle">
        <el-row>
          <el-col
            :span="8"
            class="afterBorder"
          >
            <div>
              <span style="color: #5C9BDD;">￥4000.00</span>
              <span class="infoText">总运费</span>
            </div>
          </el-col>
          <el-col
            :span="8"
            class="afterBorder"
          >
            <div>
              <span style="color: #FFA000;">￥4000.00</span>
              <span class="infoText">总抽佣金额</span>
            </div>
          </el-col>
          <el-col
            :span="8"
            class="afterBox"
          >
            <div>
              <span style="color: #3ACB8D;">￥4000.00</span>
              <span class="infoText">账户余额</span>
            </div>
          </el-col>
        </el-row>
      </dd>
      <div class="acountInfoText">
        <h1>姓名:白巧克力</h1>
        <div class="contentBox">
          <el-row>
            <el-col :span="12">
              <span class="contentText">
                司机编号：1313131311313
              </span>
            </el-col>
            <el-col :span="12">
              <span class="contentText">
                联系方式：1313131311313
              </span>
            </el-col>
            <el-col :span="12">
              <span class="contentText">
                工作城市：北京市
              </span>
            </el-col>
            <el-col :span="12">
              <span class="contentText">
                业务线：共享
              </span>
            </el-col>
            <el-col :span="12">
              <span class="contentText">
                加盟小组：共享一组
              </span>
            </el-col>
            <el-col :span="12">
              <span class="contentText">
                加盟经理：向畑静
              </span>
            </el-col>
          </el-row>
        </div>
      </div>
    </dl>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
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
  @Prop({ default: () => {} }) listQuery!: IState;
  @Prop({ default: () => [] }) formItem!: any[];

  get isPC() {
    return SettingsModule.isPC
  }
}
</script>
<style lang="scss" scoped>
.accountInfo {
  dl {
    margin: 0;
    .title {
      padding-bottom: 20px;
      border-bottom: 1px solid #eeeeee;
      color: #303133;
      font-weight: bold;
    }
    dd {
      margin-left: 0px;
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      .fee {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        .item {
          margin-right: 20px;
          text-align: center;
          h4 {
            margin: 0px;
            color: #8f8f8f;
            font-size: 12px;
          }
          p {
            font-size: 14px;
            font-weight: bold;
          }
        }
      }
    }
    .link {
      color: #649cee;
      font-weight: bold;
    }
    .flex {
      display: flex;
      align-items: center;
    }
  }
}
</style>
<style lang="scss" scoped>
.accountInfo-m {
  .fee-m {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .acountTitle {
    width: 100%;
    background: #2f448a;
    margin: 0;
    padding: 10px 0;
    box-sizing: border-box;
    .afterBorder div,
    .afterBox div {
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      letter-spacing: 0;
      line-height: 18px;
      .infoText {
        font-size: 12px;
        color: lightgrey;
        letter-spacing: 0;
        line-height: 18px;
      }
    }
    .afterBorder div::after {
      content: "";
      width: 1px;
      height: 100%;
      position: absolute;
      right: 0;
      background-color: #dde2ee;
    }
  }
  .acountInfoText {
    padding: 0 15px;
    box-sizing: border-box;
    h1 {
      font-size: 14px;
      line-height: 35px;
      height: 35px;
      color: #4a4a4a;
      letter-spacing: 0;
      margin: 0;
      padding: 0;
      border-bottom: 1px solid #e5e9ef;
    }
    .contentBox {
      padding: 10px 0;
      box-sizing: border-box;
    }
    .contentText {
      display: inline-block;
      font-size: 12px;
      color: #838a9d;
      letter-spacing: 0;
      margin-bottom: 10px;
    }
  }
}
</style>
<style scoped>
.accountInfo >>> .selfForm {
  padding: 0;
}
</style>
