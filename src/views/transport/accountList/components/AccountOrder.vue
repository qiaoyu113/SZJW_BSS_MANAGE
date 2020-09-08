<template>
  <div :class="isPC ? 'accountOrder' : 'accountOrder-m'">
    <el-card v-if="pc">
      <h1>订单编号：DDDDDDDDDDD</h1>
      <el-row>
        <el-col :span="isPC ? 16 : 24">
          <el-col :span="span">
            <div class="orderItem">
              <span class="label">商品分类：</span>
              <span class="value">梧桐共享</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="orderItem">
              <span class="label">合作模式：</span>
              <span class="value">带车</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="orderItem">
              <span class="label">合作车型：</span>
              <span class="value">4.2米厢货</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="orderItem">
              <span class="label">合作期限：</span>
              <span class="value">3个月</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="orderItem">
              <span class="label">订单金额：</span>
              <span class="value">￥4000.00</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="orderItem">
              <span class="label">抽佣比例：</span>
              <span class="value">6.5%</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="orderItem">
              <span class="label">支付时间：</span>
              <span class="value">2020-07-01</span>
            </div>
          </el-col>
        </el-col>
        <el-col :span="isPC ? 8 : 24">
          <div class="fee">
            <span
              class="item"
              style="color: #5C9BDD;"
            >
              <h4>总运费：</h4>
              <p>￥{{ '4000' }}</p>
            </span>
            <span
              class="item"
              style="color: #FFA000;"
            >
              <h4>总抽佣金额：</h4>
              <p>￥{{ '5000' }}</p>
            </span>
            <span
              class="item"
              style="color: #3ACB8D;"
            >
              <h4>账户余额：</h4>
              <p>￥{{ '0' }}</p>
            </span>
          </div>
          <el-col class="btnGroup">
            <el-button
              type="primary"
              name="accountDetail_btn_look"
              @click="goDetail(item.lineId)"
            >
              查看
            </el-button>

            <div class="backMoney">
              <router-link to="/">
                退款
              </router-link>
            </div>
          </el-col>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-else>
      <h1>订单编号:订单编号：DDDDDDDDDDD</h1>
      <div class="contentBox">
        <el-row>
          <el-col :span="12">
            <span class="contentText">
              商品分类：梧桐共享
            </span>
          </el-col>
          <el-col :span="12">
            <span class="contentText">
              合作模式：带车
            </span>
          </el-col>
          <el-col :span="12">
            <span class="contentText">
              合作车型：4.2米厢货
            </span>
          </el-col>
          <el-col :span="12">
            <span class="contentText">
              合作期限：3个月
            </span>
          </el-col>
          <el-col :span="12">
            <span class="contentText">
              抽佣比例：6.5%
            </span>
          </el-col>
          <el-col :span="12">
            <span class="contentText">
              支付时间：2020-07-01
            </span>
          </el-col>
        </el-row>
        <dd class="acountTitle">
          <el-row>
            <el-col
              :span="8"
              class="afterBorder"
            >
              <div>
                <span style="color: #5C9BDD;font-weight: bold;">￥4000.00</span>
                <span class="infoText">运费</span>
              </div>
            </el-col>
            <el-col
              :span="8"
              class="afterBorder"
            >
              <div>
                <span style="color: #FFA000;font-weight: bold;">￥4000.00</span>
                <span class="infoText">抽佣金额</span>
              </div>
            </el-col>
            <el-col
              :span="8"
              class="afterBox"
            >
              <div>
                <span style="color: #3ACB8D;font-weight: bold;">￥4000.00</span>
                <span class="infoText">订单余额</span>
              </div>
            </el-col>
          </el-row>
        </dd>
      </div>
      <div class="btnGroup">
        <el-button
          type="primary"
          size="small"
          name="accorderdetail_goOrderDetail_btn"
          @click="goDetail(item.lineId)"
        >
          查看
        </el-button>
        <el-button
          size="small"
          name="accorderdetail_goOutPay_btn"
        >
          退款
        </el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
import { SettingsModule } from '@/store/modules/settings'
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({
  name: 'accountOrder',
  components: {}
})
export default class accountOrder extends Vue {
  @Prop({ default: () => {} }) private pc!: any;
  @Prop({ default: () => {} }) private item!: any;
  @Prop({ default: () => 8 }) private span!: number;
  private goDetail(id: string) {
    this.$router.push({ path: 'accorderdetail', query: { id: id } })
  }
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>
<style lang="scss" scoped>
.accountOrder {
  margin-bottom: 10px;
  h1 {
    margin: 0 0 20px 0;
    font-size: 16px;
  }
  .orderItem {
    display: flex;
    align-self: center;
    span {
      font-size: 14px;
      color: #1f2d3d;
      line-height: 40px;
      padding: 0 12px 0 0;
      box-sizing: border-box;
    }
    .label {
      font-weight: bold;
    }
  }
  .fee {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
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
  .btnGroup {
    text-align: right;
    padding-right: 20px;
    box-sizing: border-box;
    .backMoney {
      font-size: 14px;
      color: #649cee;
      margin: 10px 20px 10px 0;
    }
  }
}
.accountOrder-m {
  margin-bottom: 10px;
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
    padding-top: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e9ef;
    .acountTitle {
      width: 100%;
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
  }
  .contentText {
    display: inline-block;
    font-size: 12px;
    color: #838a9d;
    letter-spacing: 0;
    margin-bottom: 10px;
  }
  .btnGroup {
    width: 100%;
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-button {
      width: 70px;
    }
  }
}
</style>
<style scoped>
.accountOrder-m >>> .el-card__body {
  padding: 10px 20px;
  box-sizing: border-box;
}
.accountOrder >>> .el-card.is-always-shadow {
    box-shadow: 0 1px 10px 0 rgba(80, 79, 79, 0.1);
}
</style>
