<template>
  <div class="baseInfo">
    <dt class="title">
      {{ item.title }}
    </dt>
    <dd>
      <self-form
        class="base"
        :list-query="item"
        :form-item="item.title === '基本信息' ? formItem : formItemOther"
        label-width="150px"
      >
        <template v-slot:g="{row}">
          {{ row.g | Timestamp }}
        </template>
        <template v-slot:detail="{row}">
          <router-link
            :to="{path: '/'}"
            class="link"
          >
            {{ row.i }}
          </router-link>
        </template>
      </self-form>
    </dd>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfForm from '@/components/base/SelfForm.vue'

@Component({
  name: 'baseInfo',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: () => [] }) item!:any

  private formItem:any[] = [
    {
      type: 7,
      key: 'a',
      label: '运力编号:'
    },
    {
      type: 7,
      key: 'b',
      label: '姓名:'
    },
    {
      type: 7,
      key: 'c',
      label: '联系方式:'
    },
    {
      type: 7,
      key: 'd',
      label: '业务线:'
    },
    {
      key: 'e',
      type: 7,
      label: '工作城市:'
    },
    {
      key: 'f',
      type: 7,
      label: '意向车型:'
    },
    {
      key: 'g',
      type: 7,
      label: '车牌号:'
    },
    {
      key: 'h',
      type: 7,
      label: '运力状态:'
    },
    {
      key: 'i',
      type: 'detail',
      label: '所属司机编号:',
      slot: true
    },
    {
      key: 'j',
      type: 7,
      label: '所属司机:'
    },
    {
      key: 'q',
      type: 7,
      label: '所属司机手机号:'
    },
    {
      key: 'l',
      type: 7,
      label: '运营经理:'
    },
    {
      key: 'm',
      type: 7,
      label: '运营经理手机号:'
    },
    {
      key: 'n',
      type: 7,
      label: '创建人:'
    },
    {
      key: 'o',
      type: 7,
      label: '创建人手机号:'
    },
    {
      key: 'p',
      type: 7,
      label: '创建时间:'
    }
  ]

  private formItemOther:any[] = [
    {
      type: 7,
      key: 'a',
      label: '司机年龄:'
    },
    {
      type: 7,
      key: 'b',
      label: '城镇户口:'
    },
    {
      type: 7,
      key: 'c',
      label: '货物运输经验（月）:'
    },
    {
      type: 7,
      key: 'd',
      label: '家庭住址:'
    },
    {
      key: 'e',
      type: 7,
      label: '配送货物类型:'
    },
    {
      key: 'f',
      type: 7,
      label: '期望月收入:'
    },
    {
      key: 'g',
      type: 7,
      label: '平均月收入:'
    },
    {
      key: 'h',
      type: 7,
      label: '是否存在还贷款:'
    },
    {
      key: 'i',
      type: 7,
      label: '可接受一天工作时长:'
    },
    {
      key: 'j',
      type: 7,
      label: '备注:'
    }
  ]
}
</script>
<style lang="scss" scoped>
  .baseInfo{

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
</style>
