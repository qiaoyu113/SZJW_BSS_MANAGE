<template>
  <div class="accountOrder">
    <el-card>
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
            <span class="item">
              <h4>总运费：</h4>
              <p>￥{{ '4000' }}</p>
            </span>
            <span class="item">
              <h4>总抽佣金额：</h4>
              <p>￥{{ '5000' }}</p>
            </span>
            <span class="item">
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
  </div>
</template>
<script lang="ts">
import { SettingsModule } from '@/store/modules/settings'
import { Vue, Component, Prop } from 'vue-property-decorator'
  @Component({
    name: 'accountOrder',
    components: {
    }
  })

export default class accountOrder extends Vue {
  @Prop({ default: () => {} }) private item!:any
  @Prop({ default: () => 8 }) private span!:number
  private goDetail(id:string) {
    this.$router.push({ path: 'accorderdetail', query: { id: id } })
  }
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>
<style lang="scss" scoped>
.accountOrder{
  margin-bottom: 20px;
  h1{
    margin: 0 0 20px 0;
    font-size: 16px;
  }
  .orderItem{
    display: flex;
    align-self: center;
    span{
      font-size: 14px;
      color: #1f2d3d;
      line-height: 40px;
      padding: 0 12px 0 0;
      box-sizing: border-box;
    }
    .label{
      font-weight: bold;
    }
  }
  .fee {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
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
  .btnGroup{
    text-align: right;
    padding-right:20px;
    box-sizing: border-box;
    .backMoney{
      font-size: 14px;
      color: #649CEE;
      margin: 10px 20px 10px 0;
    }
}
</style>
