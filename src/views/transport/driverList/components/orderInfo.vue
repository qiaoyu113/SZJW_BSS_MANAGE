<template>
  <div class="orderInfo">
    <template v-if="lists.length">
      <dl
        v-for="item in lists"
        :key="item.orderId"
      >
        <dt class="title">
          订单编号:{{ item.orderId | DataIsNull }}
        </dt>
        <dd>
          <self-form
            class="base"
            :list-query="item"
            :form-item="formItem"
            label-width="80px"
          >
            <template v-slot:cooperationModel="{row}">
              <span v-if="row.cooperationModel ===1">购车</span>
              <span v-else-if="row.cooperationModel ===2">租车</span>
              <span v-else-if="row.cooperationModel ===3">带车</span>
            </template>
            <template v-slot:d="{row}">
              {{ row.cooperationTime }}个月
            </template>
            <template v-slot:e="{row}">
              ￥{{ row.goodsAmount }}
            </template>
            <template v-slot:f="{row}">
              {{ row.rake }}%
            </template>
            <template v-slot:g="{row}">
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
import SelfForm from '@/components/base/SelfForm.vue'

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

  private formItem:any[] = [
    {
      type: 7,
      key: 'busiTypeName',
      label: '商品分类:'
    },
    {
      type: 'cooperationModel',
      slot: true,
      label: '合作模式:'
    },
    {
      type: 7,
      key: 'cooperationCarName',
      label: '合作车型:'
    },
    {
      key: 'cooperationTime',
      type: 'cooperationTime',
      label: '合作期限:',
      slot: true
    },
    {
      key: 'goodsAmount',
      type: 'goodsAmount',
      label: '订单金额:',
      slot: true
    },
    {
      key: 'rake',
      type: 'rake',
      label: '抽佣比列:',
      slot: true
    },
    {
      key: 'payCompleteTime',
      type: 'payCompleteTime',
      slot: true,
      label: '支付时间:'
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
    }
  }
</style>
