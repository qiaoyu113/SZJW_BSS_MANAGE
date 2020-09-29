<template>
  <div class="payDetail">
    <SectionContainer
      title="订单编号"
      :md="true"
    >
      <template v-slot:rightBox>
        <el-button
          :size="isPC ? 'small' : 'mini'"
          @click="() => {
            $router.go(-1)
          }"
        >
          返回
        </el-button>
      </template>
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="订单编号"
            value="李威山"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="司机姓名"
            value="李威山"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="司机编号"
            value="李威山"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="可提现金额"
            value="李威山"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="联系电话"
            value="李威山"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="所属城市"
            value="李威山"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="加盟经理"
            value="李威山"
          />
        </el-col>
      </el-row>
    </SectionContainer>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import DetailItem from '@/components/DetailItem/index.vue'
 @Component({
   name: 'payDetail',
   components: {
     DetailItem,
     SectionContainer
   }
 })
export default class extends Vue {
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>
<style lang="scss" scoped>
.payDetail{
  padding: 30px;
  box-sizing: border-box;
}
</style>
