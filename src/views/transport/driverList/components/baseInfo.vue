<template>
  <div class="carInfo">
    <dl>
      <dt class="title">
        专车信息
      </dt>
      <dd>
        <span class="noData">暂无数据</span>
      </dd>
    </dl>
    <dl>
      <dt class="title">
        共享信息
      </dt>
      <dd>
        <span class="noData">暂无数据</span>
      </dd>
    </dl>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component({
  name: 'CarInfo'
})
export default class extends Vue {}
</script>
<style lang="scss" scoped>
  .carInfo {
    dl {
      dt {
       color:#303133;
       font-weight:bold;
       height:40px;
       border-bottom:1px solid #EBEBEB;
      }

      dd {
        margin-left: 0px;
        .noData {
          display: flex;
          justify-content: center;
          align-items: center;
          height:100px;
        }
      }
    }
  }
</style>
