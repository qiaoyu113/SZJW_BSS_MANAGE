<template>
  <ul>
    <li
      v-for="(item,idx) in lists"
      :key="idx"
      :class="idx === 0 ? 'borderTop':''"
    >
      <div
        class="left"
      >
        <span
          class="tag"
        >{{ item.tag }}</span>
        <span
          class="desc"
        >{{ item.desc }}</span>
      </div>
      <div class="right">
        <span class="name">跟进人:{{ item.name }}</span>
        <span class="time">{{ item.time | Timestamp }}</span>
      </div>
    </li>
  </ul>
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
        border-bottom: 1px solid #ECECEC;
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
        padding: 10px 0px;
        display: block;
        width:100%;
        border-bottom: 1px solid #ECECEC;
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

</style>
