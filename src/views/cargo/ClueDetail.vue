<template>
  <div :class="isPC ? 'ClueDetail' : 'ClueDetail-m'">
    <SectionContainer title="测试">
      123
    </sectioncontainer>
    <SectionContainer title="测试">
      1234
    </sectioncontainer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { GetCustomerList } from '@/api/customer'
import { CargoListData } from '@/api/types'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

    @Component({
      name: 'ClueDetail',
      components: {
        SectionContainer
      }
    })

export default class extends Vue {
  created() {
  }

  mounted() {
  }

  activated() {
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>

<style lang="scss">
.ClueDetail {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}
</style>

<style lang="scss">
.ClueDetail-m {
    width: 100%;
}
</style>
