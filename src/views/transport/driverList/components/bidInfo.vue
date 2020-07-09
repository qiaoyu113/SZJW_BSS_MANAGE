<template>
  <div class="bidInfo">
    <dl
      v-for="item in lists"
      :key="item.code"
    >
      <dt class="title">
        标书编号:{{ item.code }}
      </dt>
      <dd>
        <self-form
          class="base"
          :list-query="item"
          :form-item="formItem"
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
  name: 'BidInfo',
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
      label: '运力姓名:'
    },
    {
      type: 7,
      key: 'b',
      label: '标书名称:'
    },
    {
      type: 'c',
      key: 'c',
      label: '创建时间:',
      slot: true
    },
    {
      key: 'd',
      type: 7,
      label: '线路编号:'
    },
    {
      key: 'e',
      type: 7,
      label: '线路名称:'
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
  .bidInfo{
    dl {
      .title {
        padding-bottom: 20px;
        border-bottom:1px solid #EEEEEE;
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
