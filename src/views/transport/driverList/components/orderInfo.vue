<template>
  <div class="orderInfo">
    <dl
      v-for="item in lists"
      :key="item.code"
    >
      <dt class="title">
        订单编号:{{ item.code }}
      </dt>
      <dd>
        <self-form
          class="base"
          :list-query="item"
          :form-item="formItem"
          label-width="80px"
        >
          <template v-slot:d="{row}">
            {{ row.d }}个月
          </template>
          <template v-slot:e="{row}">
            ￥{{ row.e }}
          </template>
          <template v-slot:f="{row}">
            {{ row.f }}%
          </template>
          <template v-slot:g="{row}">
            {{ row.g | Timestamp }}
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
      </dd>
    </dl>
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
      key: 'a',
      label: '商品分类:'
    },
    {
      type: 7,
      key: 'b',
      label: '合作模式:'
    },
    {
      type: 7,
      key: 'c',
      label: '合作车型:'
    },
    {
      key: 'd',
      type: 'd',
      label: '合作期限:',
      slot: true
    },
    {
      key: 'e',
      type: 'e',
      label: '订单金额:',
      slot: true
    },
    {
      key: 'f',
      type: 'f',
      label: '抽佣比列:',
      slot: true
    },
    {
      key: 'g',
      type: 'g',
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
  }
</style>
