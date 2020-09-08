<template>
  <div>
    <ul v-if="lists.length > 0">
      <li
        v-for="(item,idx) in lists"
        :key="idx"
        :class="idx !== 0 ? 'borderTop':''"
      >
        <div
          class="left"
        >
          <span
            v-if="item.type ===5"
            class="tag"
          >成交意向</span>
          <span
            v-else-if="item.type ===6"
            class="tag"
          >征信通过情况</span>
          <span
            v-else-if="item.type ===7"
            class="tag"
          >跟车情况</span>
          <span
            v-else-if="item.type ===8"
            class="tag"
          >其他</span>
          <span
            class="desc"
          >{{ item.remarks }}</span>
        </div>
        <div class="right">
          <span class="name">跟进人:{{ item.createName }}</span>
          <span class="time">{{ item.createDate | Timestamp }}</span>
        </div>
      </li>
    </ul>
    <div v-else>
      <span class="noData">暂无数据</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
@Component({
  name: 'followItem'
})
export default class extends Vue {
  @Prop({ default: () => [] }) lists!:any[]

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>
<style lang="scss" scoped>
 ul {
    padding-left: 0px;
    margin:0px;
    .borderTop {
      border-top: 1px solid #ECECEC;
    }
    @media screen and (min-width: 700px) {
      li {
        padding: 0px 20px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        height:50px;
        .left {
          .tag {
            padding: 3px 6px;
            color:#fff;
            font-size:12px;
            background: #169BD5;
            border-radius: 12px;
          }
          .desc {
            margin-left:10px;
            color:#303133;
            font-size:14px;
          }
        }
        .right {
          .name {
            color:#303133;
            font-size:14px;
          }
          .time {
            margin-left:10px;
            color:#303133;
            font-size:14px;
          }
        }
      }
    }

  }
</style>

<style scoped lang="scss">
  @media screen and (max-width: 700px){
    li {
        padding: 10px 20px;
        display: block;
        width:100%;
        .left {
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          .tag {
            padding: 3px 6px;
            color:#fff;
            font-size:12px;
            background: #169BD5;
            border-radius: 12px;
          }
          .desc {
            margin-left:10px;
            color:#303133;
            font-size:14px;
          }
        }
        .right {
          margin-top:3px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          .name {
            color:#303133;
            font-size:14px;
          }
          .time {
            margin-left:10px;
            color:#303133;
            font-size:14px;
          }
        }
    }
  }
  .noData {
    display: flex;
    justify-content: center;
    align-items: center;
    height:100px;
    color:#666;
    font-size:13px;
  }

</style>
