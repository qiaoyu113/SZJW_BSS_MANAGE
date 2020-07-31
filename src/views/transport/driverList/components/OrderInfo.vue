<template>
  <div class="orderInfo">
    <template v-if="lists.length">
      <dl
        v-for="item in lists"
        :key="item.orderId"
      >
        <dt class="title">
          <span class="title_left_border" />
          订单编号:{{ item.orderId | DataIsNull }}
        </dt>
        <dd>
          <self-form
            class="base"
            :list-query="item"
            :form-item="formItem"
            label-width="80px"
            :m-block="true"
            :pc-block="true"
          >
            <template v-slot:cooperationModel="{row}">
              <span v-if="row.cooperationModel ===1">购车</span>
              <span v-else-if="row.cooperationModel ===2">租车</span>
              <span v-else-if="row.cooperationModel ===3">带车</span>
            </template>
            <template v-slot:cooperationTime="{row}">
              {{ row.cooperationTime }}个月
            </template>
            <template v-slot:goodsAmount="{row}">
              ￥{{ row.goodsAmount }}
            </template>
            <template v-slot:rake="{row}">
              {{ row.rake }}%
            </template>
            <template v-slot:payCompleteTime="{row}">
              {{ row.payCompleteTime | Timestamp }}
            </template>
            <template slot="detail">
              <router-link
                :to="{path: '/join/orderdetail',query: {id: item.orderId}}"
                class="link"
              >
                详情>>
              </router-link>
            </template>
          </self-form>
        </dd>
      </dl>
    </template>
    <div v-else>
      <span class="noData">暂无数据</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'

interface IState {
    [key: string]: any;
}
@Component({
  name: 'OrderInfo',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: () => [] }) lists!:IState[]

  /**
   *表单数组
   */
  private formItem:any[] = [
    {
      type: 7,
      key: 'busiTypeName',
      label: '商品分类'
    },
    {
      type: 'cooperationModel',
      slot: true,
      label: '合作模式'
    },
    {
      type: 7,
      key: 'cooperationCarName',
      label: '合作车型'
    },
    {
      type: 'cooperationTime',
      label: '合作期限',
      slot: true
    },
    {
      type: 'goodsAmount',
      label: '订单金额',
      slot: true
    },
    {
      type: 'rake',
      label: '抽佣比列',
      slot: true
    },
    {
      type: 'payCompleteTime',
      slot: true,
      label: '支付时间'
    },
    {
      slot: true,
      w: '10px',
      type: 'detail'
    }
  ]
}
</script>
<style lang="scss" scoped>
  .orderInfo{
    dl {
      .title {
        color:#303133;
        font-weight:bold;
        border-bottom: 1px solid #EEEEEE;
      }
      dd {
        margin-left: 0px;
      }
      .link {
        color: #649CEE;
        font-weight:bold;
      }
    }
    .noData {
      display: flex;
      justify-content: center;
      align-items: center;
      height:100px;
      color:#666;
      font-size:13px;
    }
  }
</style>

<style scoped>
 @media screen and (max-width:700px) {
    .orderInfo >>> .selfForm {
      padding: 0px;
    }
    .orderInfo >>> .el-form-item {
      width: 100%;
      padding: 10px 14px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-bottom: 1px solid #F8F9FA;
    }
    .orderInfo >>> .el-form-item__label {
      width: 100%!important;
      font-size: 12px!important;
      line-height: 13px;
      color: #666;
      font-weight: 400;
      text-align: left;
      padding-right: 15px;
      padding-bottom: 10px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    .orderInfo >>> .el-form-item__content {
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: #252525;
      line-height: 16px;
    }
    .orderInfo >>> dl {
      margin: 0px;
    }
    .orderInfo >>> dt {
      width: 100%;
      height: 45px!important;
      line-height: 40px;
      font-size: 15px;
      color: #4A4A4A;
      font-weight: 500;
      position: relative;
      padding: 0 20px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
 }
 @media screen and (min-width: 700px){
   .orderInfo >>> .el-form-item__label {
    font-size: 13px!important;
    color: #9e9e9e!important;
    font-weight: 400;
    padding-right: 16px;
  }
  .orderInfo >>> .el-form-item__content span {
      font-size: 14px;
      color: #333;
      font-weight: 700;
      overflow-wrap: break-word;
  }
 }
</style>
