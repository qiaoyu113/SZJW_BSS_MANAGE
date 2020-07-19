<template>
  <div class="transportInfo">
    <template v-if="lists.length > 0">
      <dl
        v-for="item in lists"
        :key="item.carrierId"
      >
        <dt class="title">
          运力编号:{{ item.carrierId | DataIsNull }}
        </dt>
        <dd>
          <self-form
            class="base"
            :list-query="item"
            :form-item="formItem"
            label-width="80px"
          >
            <template v-slot:createDate="{row}">
              {{ row.createDate | Timestamp }}
            </template>
            <template slot="detail">
              <router-link
                :to="{path: '/transport/transportdetail',query: {carrierId: item.carrierId}}"
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
      key: 'name',
      label: '姓名:'
    },
    {
      type: 7,
      key: 'phone',
      label: '联系电话:'
    },
    {
      type: 7,
      key: 'workCityName',
      label: '工作城市:'
    },
    {
      key: 'plateNo',
      type: 7,
      label: '车牌号:'
    },
    {
      key: 'carTypeName',
      type: 7,
      label: '车型:'
    },
    {
      key: 'statusName',
      type: 7,
      label: '状态:'
    },
    {
      key: 'createDate',
      type: 'createDate',
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
    .noData {
      display: flex;
      justify-content: center;
      align-items: center;
      height:100px;
    }
  }
</style>
