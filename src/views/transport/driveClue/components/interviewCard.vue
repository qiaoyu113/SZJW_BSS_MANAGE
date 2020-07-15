<template>
  <div class="interviewCard">
    <el-card>
      <div
        slot="header"
        class="interHeader"
      >
        <div class="lTitle">
          <span class="interTitle">面试信息</span>
          <span class="interTag">{{ name }}</span>
        </div>
        <el-button
          type="primary"
          size="small"
          @click="handleBtnClick"
        >
          {{ isAdd ? '填写面试表' :'修改面试表' }}
        </el-button>
      </div>
      <el-row
        v-if="isAdd"
        class="card_body"
      >
        <el-col
          :span="isPC ? 6 :24"
          :class="isPC ? 'borderBottom' :''"
        >
          <p class="title">
            物流从业经验
          </p>
          <p class="text">
            xxx
          </p>
        </el-col>
        <el-col
          :span="isPC ? 6 :24"
          :class="isPC ? 'borderBottom' :''"
        >
          <p class="title">
            货物经验
          </p>
          <p class="text">
            {{ obj.experience | DataIsNull }}
          </p>
        </el-col>
        <el-col
          :span="isPC ? 6 :24"
          :class="isPC ? 'borderBottom' :''"
        >
          <p class="title">
            期望月收入
          </p>
          <p class="text">
            {{ obj.expIncomeAvg | DataIsNull }}
          </p>
        </el-col>
        <el-col
          :span="isPC ? 6 :24"
          :class="isPC ? 'borderBottom' :''"
        >
          <p class="title">
            可接受一天工作时长
          </p>
          <p class="text">
            xxx
          </p>
        </el-col>
        <el-col :span="isPC ? 6 :24">
          <p class="title">
            意向车型
          </p>
          <p class="text">
            {{ obj.intentDrivingCarTypeName | DataIsNull }}
          </p>
        </el-col>
        <el-col :span="isPC ? 6 :24">
          <p class="title">
            户口类型
          </p>
          <p class="text">
            <template v-if="obj.householdType ===1">
              农村
            </template>
            <template v-else-if="obj.householdType ===2">
              城镇
            </template>
          </p>
        </el-col>
        <el-col :span="isPC ? 6 :24">
          <p class="title">
            是否有在还贷款
          </p>
          <p class="text">
            xxxx
          </p>
        </el-col>
        <el-col :span="isPC ? 6 :24">
          <p class="title">
            家里有几个孩子
          </p>
          <p class="text">
            {{ obj.childNum | DataIsNull }}
          </p>
        </el-col>
      </el-row>
      <div
        v-else
        class="noData"
      >
        暂无面试信息
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
@Component({
  name: 'InterviewCard'
})
export default class extends Vue {
  @Prop({ default: '专车' }) name!:string
  @Prop({ default: false }) isAdd!:boolean
  @Prop({ default: () => {} }) obj!:any

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
          color:#000;
          font-size:14px;
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
      color:#000;
      font-size:14px;
      font-weight:bold;
      text-align: center;
    }
  }

</style>
