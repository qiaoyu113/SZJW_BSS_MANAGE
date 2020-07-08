<template>
  <div class="followClue">
    <!-- 基本信息 -->
    <el-card>
      <div
        slot="header"
        class="card_header"
      >
        <div class="left">
          <span class="text">基本信息</span>
          <span class="status">跟进中</span>
        </div>
        <div class="right">
          <el-dropdown
            @command="handleCommandOp"
          >
            <el-button
              type="primary"
              size="small"
            >
              线索操作
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="clueDistribution">
                分配线索
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-row class="card_body">
        <el-col
          :span="isPC ? 6 :24"
          :class="isPC ? 'borderBottom' :''"
        >
          <p class="title">
            姓名
          </p>
          <p class="text">
            tom
          </p>
        </el-col>
        <el-col
          :span="isPC ? 6 :24"
          :class="isPC ? 'borderBottom' :''"
        >
          <p class="title">
            电话
          </p>
          <p class="text">
            15021578502
          </p>
        </el-col>
        <el-col
          :span="isPC ? 6 :24"
          :class="isPC ? 'borderBottom' :''"
        >
          <p class="title">
            城市
          </p>
          <p class="text">
            北京市
          </p>
        </el-col>
        <el-col
          :span="isPC ? 6 :24"
          :class="isPC ? 'borderBottom' :''"
        >
          <p class="title">
            车型
          </p>
          <p class="text">
            金杯
          </p>
        </el-col>
        <el-col :span="isPC ? 6 :24">
          <p class="title">
            来源
          </p>
          <p class="text">
            微信
          </p>
        </el-col>
        <el-col :span="isPC ? 6 :24">
          <p class="title">
            微信号
          </p>
          <p class="text">
            123131312
          </p>
        </el-col>
        <el-col :span="isPC ? 6 :24">
          <p class="title">
            业务线
          </p>
          <p class="text">
            共享
          </p>
        </el-col>
        <el-col :span="isPC ? 6 :24">
          <p class="title">
            当前跟进人
          </p>
          <p class="text">
            tom
          </p>
        </el-col>
      </el-row>
    </el-card>
    <!-- 线索分配 -->
    <clue-distribution
      :id="1"
      ref="clueDistribution"
    />
    <!-- 跟进记录 -->
    <el-card style="margin-top:20px;">
      <div
        slot="header"
        class="card_header"
      >
        <div class="left">
          <span class="text">跟进记录</span>
        </div>
        <div class="right">
          <el-dropdown
            @command="handleCommand"
          >
            <el-button
              type="primary"
              size="small"
            >
              线索跟进
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="phone">
                <el-link
                  :underline="false"
                  type="info"
                >
                  电话跟进
                </el-link>
              </el-dropdown-item>
              <el-dropdown-item command="wechat">
                <el-link
                  :underline="false"
                  type="info"
                >
                  微信跟进
                </el-link>
              </el-dropdown-item>
              <el-dropdown-item
                command="interview"
                divided
              >
                <el-link
                  :underline="false"
                  type="primary"
                >
                  邀请面试
                </el-link>
              </el-dropdown-item>
              <el-dropdown-item
                command="noValid"
                divided
              >
                <el-link
                  :underline="false"
                  type="danger"
                >
                  无效线索
                </el-link>
              </el-dropdown-item>
              <el-dropdown-item command="noFollow">
                <el-link
                  :underline="false"
                  type="danger"
                >
                  无法跟进
                </el-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <ul>
        <li
          v-for="(item,idx) in followLists"
          :key="idx"
          class="item"
          :style="{borderBottom: idx !== (followLists.length -1) ? '1px solid #E8E8E8' :''}"
        >
          <div class="left">
            <h4 class="title">
              <span class="tag">{{ item.tag }}</span>
              <span class="time">{{ item.time | Timestamp }}</span>
            </h4>
            <p class="content">
              {{ item.content }}
            </p>
          </div>
          <div class="right">
            <span class="name">跟进人:{{ item.name }}</span>
          </div>
        </li>
      </ul>
    </el-card>
    <!-- 专车 -->
    <interview-card
      name="专车"
      :is-add="true"
      @onBtn="handleBtnClick"
    />
    <!-- 共享 -->
    <interview-card
      name="共享"
      :is-add="false"
      @onBtn="handleBtnClick"
    />

    <followByPhoneOrWechat
      ref="follow"
      :type="type"
    />

    <InviteInterview ref="inviteInterview" />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import ClueDistribution from './components/clueDistribution.vue'
import InterviewCard from './components/interviewCard.vue'
import FollowByPhoneOrWechat from './components/followByPhoneOrWechat.vue'
import InviteInterview from './components/inviteInterview.vue'
@Component({
  name: 'FollowClue',
  components: {
    ClueDistribution,
    InterviewCard,
    FollowByPhoneOrWechat,
    InviteInterview
  }
})
export default class extends Vue {
  private type:string = ''
  private followLists:any[] = [
    {
      tag: '微信跟进',
      time: Date.now(),
      content: '啊大大辽阔的马上看代码阿达',
      name: 'jack'
    },
    {
      tag: '无效线索',
      time: Date.now(),
      content: '啊大大辽阔的马上看代码阿达',
      name: 'jack'
    }
  ]
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  /**
   * 线索操作
   */
  handleCommandOp(command:string) {
    if (command === 'clueDistribution') {
      (this.$refs.clueDistribution as any).openDialog()
    }
  }

  /**
   * 线索跟进
   */
  handleCommand(val:string) {
    if (val === 'phone') { // 电话跟进
      this.type = 'phone';
      (this.$refs.follow as any).openDialog()
    } else if (val === 'wechat') { // 微信跟进
      this.type = 'wechat';
      (this.$refs.follow as any).openDialog()
    } else if (val === 'interview') { // 邀请面试
      (this.$refs.inviteInterview as any).openDialog()
    } else if (val === 'noValid') { // 无效线索
      this.type = 'noValid';
      (this.$refs.follow as any).openDialog()
    } else if (val === 'noFollow') { // 无法跟进
      this.type = 'noFollow';
      (this.$refs.follow as any).openDialog()
    }
  }
  /**
   * 填写面试表或修改面试表
   */
  handleBtnClick() {
    this.$router.push({
      path: '/transport/interview'
    })
  }
}
</script>
<style lang="scss" scoped>
  $bgColor:#649CEE;
  .followClue {
    padding: 20px;
    .card_header {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      .left {
        .text {
          font-weight:bold;
          color:#000;
          font-size:14px;
        }
        .status {
          margin-left:10px;
          background: $bgColor;
          color:#fff;
          padding: 3px;
          font-size:12px;
          border-radius: 5px;
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
    ul {
      margin: 0px;
      list-style: none;
      padding-left: 0px;
      .item {
        margin: 10px 0px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        .left {
          padding: 0px 10px;
          h4 {
            margin: 0px;
            .tag {
              padding: 3px;
              border-radius: 12px;
              background: $bgColor;
              color:#fff;
              font-size:12px;
            }
            .time {
              margin-left:10px;
              color:#999;
              font-size:12px;
            }
          }
          .content {
            margin: 5px 0px;
            font-size:14px;
            color:#000;
            font-weight: bold;
          }
        }
        .right {
          .name {
            color:#999;
            font-size:12px;
          }
        }
      }
    }

  }
</style>

<style scoped>
  @media screen and (max-width: 700px){
    .followClue >>> .el-col {
      margin-bottom:5px;
      padding-bottom: 5px;
      border-bottom:1px solid #E0E0E0;
    }
  }
  .followClue >>> .el-card__header,
  .followClue >>> .el-card__body {
    padding: 10px;
  }
</style>
