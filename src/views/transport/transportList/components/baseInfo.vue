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
        <template v-slot:detail="{row}">
          <router-link
            :to="{path: '/transport/driverdetail',query: {id: row.driverId}}"
            class="link"
          >
            {{ row.driverId }}
          </router-link>
        </template>
        <template v-slot:createDate="{row}">
          <!-- {{ row.createDate | Timestamp }} -->
          {{ row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
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
      key: 'carrierId',
      label: '运力编号:'
    },
    {
      type: 7,
      key: 'name',
      label: '姓名:'
    },
    {
      type: 7,
      key: 'phone',
      label: '联系方式:'
    },
    {
      type: 7,
      key: 'busiTypeName',
      label: '业务线:'
    },
    {
      key: 'workCityName',
      type: 7,
      label: '工作城市:'
    },
    {
      key: 'carTypeName',
      type: 7,
      label: '意向车型:'
    },
    {
      key: 'plateNo',
      type: 7,
      label: '车牌号:'
    },
    {
      key: 'statusName',
      type: 7,
      label: '运力状态:'
    },
    {
      key: 'driverId',
      type: 'detail',
      label: '所属司机编号:',
      slot: true
    },
    {
      key: 'driverName',
      type: 7,
      label: '所属司机:'
    },
    {
      key: 'driverPhone',
      type: 7,
      label: '所属司机手机号:'
    },
    {
      key: 'gmName',
      type: 7,
      label: '运营经理:'
    },
    {
      key: 'gmPhone',
      type: 7,
      label: '运营经理手机号:'
    },
    {
      key: 'createName',
      type: 7,
      label: '创建人:'
    },
    {
      key: 'createPhone',
      type: 7,
      label: '创建人手机号:'
    },
    {
      type: 'createDate',
      key: 'createDate',
      label: '创建时间:',
      slot: true
    }
  ]

  private formItemOther:any[] = [
    {
      type: 7,
      key: 'age',
      label: '司机年龄:'
    },
    {
      type: 7,
      key: 'householdTypeName',
      label: '城镇户口:'
    },
    {
      type: 7,
      key: 'workExperienceName',
      label: '货物运输经验（月）:'
    },
    {
      type: 7,
      key: 'homeDistrict',
      label: '家庭住址:'
    },
    {
      key: 'cargoTypeName',
      type: 7,
      label: '配送货物类型:'
    },
    {
      key: 'expMonthlyIncomeName',
      type: 7,
      label: '期望月收入:'
    },
    {
      key: 'avgMonthlyIncomeName',
      type: 7,
      label: '平均月收入:'
    },
    {
      key: 'isIndebtedName',
      type: 7,
      label: '是否存在还贷款:'
    },
    {
      key: 'maxWorkTimeName',
      type: 7,
      label: '可接受一天工作时长:'
    },
    {
      key: 'remarks',
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
