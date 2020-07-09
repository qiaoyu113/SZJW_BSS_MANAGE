<template>
  <div class="transportInfo">
    <dl
      v-for="item in lists"
      :key="item.code"
    >
      <dt class="title">
        运力编号:{{ item.code }}
      </dt>
      <dd>
        <self-form
          class="base"
          :list-query="item"
          :form-item="formItem"
          label-width="80px"
        >
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
  name: 'TransportInfo',
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
      label: '姓名编号:'
    },
    {
      type: 7,
      key: 'b',
      label: '联系电话:'
    },
    {
      type: 7,
      key: 'c',
      label: '工作城市:'
    },
    {
      key: 'd',
      type: 7,
      label: '车牌号:'
    },
    {
      key: 'e',
      type: 7,
      label: '车型:'
    },
    {
      key: 'f',
      type: 7,
      label: '状态:'
    },
    {
      key: 'g',
      type: 'g',
      slot: true,
      label: '创建时间:'
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
  .transportInfo{
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
