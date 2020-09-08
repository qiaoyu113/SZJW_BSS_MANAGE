<template>
  <div class="interviewCard">
    <el-card shadow="never">
      <div
        slot="header"
        class="interHeader"
      >
        <div class="lTitle">
          <span class="title_left_border" />
          <span class="interTitle">面试信息</span>
          <span class="interTag">{{ obj.busiType ===0 ? '专车' :'共享' }}</span>
        </div>
        <el-button
          type="primary"
          size="small"
          name="followClue_saveInfo_btn"
          @click="handleBtnClick"
        >
          {{ isAdd ? '填写面试表' :'修改面试表' }}
        </el-button>
      </div>
      <div
        v-if="isAdd"
        class="noData"
      >
        暂无面试信息
      </div>
      <template v-else>
        <template v-if="obj.busiType ===0">
          <special-card :form="obj" />
        </template>
        <template v-else>
          <share-card :form="obj" />
        </template>
      </template>
    </el-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SpecialCard from './SpecialCard.vue'
import ShareCard from './ShareCard.vue'
@Component({
  name: 'InterviewCard',
  components: {
    SpecialCard,
    ShareCard
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) obj!:any
  @Prop({ default: true }) isAdd!:boolean

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  @Emit('onBtn')
  handleBtnClick() {
  }
}
</script>
<style lang="scss" scoped>
  $bgColor:#649CEE;
  .interviewCard {
    margin-top:20px;
    .interHeader {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      .lTitle {
        .interTitle {
          margin-right:10px;
          font-size: 16px;
          color: #4A4A4A;
          font-weight:bold;
        }
        .interTag {
          padding: 3px;
          border-radius: 6px;
          background: $bgColor;
          color:#fff;
          font-size:12px;
        }
      }
    }
    .card_body {
      .title {
        margin:3px;
        font-size:12px;
        color:#999;
      }
      .text {
        margin:3px;
        font-size:14px;
        color:#000;
        font-weight:bold;
      }
      .borderBottom {
        margin-bottom:5px;
        padding-bottom: 5px;
        border-bottom:1px solid #E0E0E0;
      }
    }
    .noData {
      margin:50px auto;
      color:#666;
      font-size:13px;
      font-weight:bold;
      text-align: center;
    }
  }

</style>
