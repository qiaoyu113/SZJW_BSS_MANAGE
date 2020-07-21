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
          <span class="status">{{ baseForm.busiType === 1 ? '共享':'专车' }}</span>
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
            {{ baseForm.name | DataIsNull }}
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
            {{ baseForm.phone | DataIsNull }}
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
            {{ baseForm.workCityName | DataIsNull }}
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
            {{ baseForm.carTypeName | DataIsNull }}
          </p>
        </el-col>
        <el-col :span="isPC ? 6 :24">
          <p class="title">
            来源
          </p>
          <p class="text">
            {{ baseForm.sourceChannelName | DataIsNull }}
          </p>
        </el-col>
        <el-col :span="isPC ? 6 :24">
          <p class="title">
            微信号
          </p>
          <p class="text">
            {{ baseForm.wechatNo | DataIsNull }}
          </p>
        </el-col>
        <el-col :span="isPC ? 6 :24">
          <p class="title">
            业务线
          </p>
          <p class="text">
            {{ baseForm.busiType === 0 ? '专车' : baseForm.busiType === 1? '共享':'暂无数据' }}
          </p>
        </el-col>
        <el-col :span="isPC ? 6 :24">
          <p class="title">
            当前跟进人
          </p>
          <p class="text">
            {{ baseForm.gmName | DataIsNull }}
          </p>
        </el-col>
      </el-row>
    </el-card>
    <!-- 线索分配 -->
    <clue-distribution
      ref="clueDistribution"
      :rows="[{clueId: id}]"
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
              <el-dropdown-item :command="1">
                <el-link
                  :underline="false"
                  type="info"
                >
                  电话跟进
                </el-link>
              </el-dropdown-item>
              <el-dropdown-item :command="2">
                <el-link
                  :underline="false"
                  type="info"
                >
                  微信跟进
                </el-link>
              </el-dropdown-item>
              <el-dropdown-item
                :command="3"
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
                :command="4"
                divided
              >
                <el-link
                  :underline="false"
                  type="danger"
                >
                  无效线索
                </el-link>
              </el-dropdown-item>
              <el-dropdown-item :command="5">
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
              <span class="tag">{{ item.typeName }}</span>
              <span class="time">{{ item.createDate | Timestamp }}</span>
            </h4>
            <p class="content">
              {{ item.remarks | DataIsNull }}
            </p>
          </div>
          <div class="right">
            <span class="name">跟进人:{{ item.createrName }}</span>
          </div>
        </li>
      </ul>
    </el-card>
    <!-- 面试表 -->
    <interview-card
      :is-add="!baseForm.existInterviewData"
      :obj="interviewObj"
      @onBtn="handleBtnClick"
    />

    <followByPhoneOrWechat
      ref="follow"
      :type="type"
      :clue-id="id"
      @getRecord="getClueRecords"
    />

    <InviteInterview
      ref="inviteInterview"
      :clue-id="id"
      @getRecord="getClueRecords"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import ClueDistribution from './components/clueDistribution.vue'
import InterviewCard from './components/interviewCard.vue'
import FollowByPhoneOrWechat from './components/followByPhoneOrWechat.vue'
import InviteInterview from './components/inviteInterview.vue'
import { ClueFollowList, GetClueDetailByClueId, GetInterviewDetail } from '@/api/driver'
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
  private id:string|number = ''
  private type:number = 0
  private followLists:any[] = []
  private baseForm:any = {
    name: '',
    phone: '',
    workCityName: '',
    carTypeName: '',
    sourceChannelName: '',
    wechatNo: '',
    busiType: '',
    gmInfo: '',
    statusName: '',
    existInterviewData: false
  }
  private interviewObj:any = {}
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  mounted() {
    this.id = (this.$route.query.id) as string | number
    if (this.id) {
      this.getClueRecords()
      this.getClueDetailByClueId()
    }
  }

  /**
 *获取司机面试信息
 */
  async getInterviewInfo() {
    try {
      let params = {
        clueId: this.id
      }
      let { data: res } = await GetInterviewDetail(params)
      if (res.success) {
        this.interviewObj = res.data
        this.interviewObj.busiType = this.baseForm.busiType
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get interview fail:${err}`)
    }
  }
  /**
   *获取司机线索信息
   */
  async getClueDetailByClueId() {
    try {
      let params = {
        clueId: this.id
      }
      let { data: res } = await GetClueDetailByClueId(params)
      if (res.success) {
        this.baseForm = { ...this.baseForm, ...res.data }
        if (this.baseForm.existInterviewData) {
          this.getInterviewInfo()
        }
      }
    } catch (err) {
      console.log(`get clue detail fail:${err}`)
    }
  }
  /**
   *获取司机线索跟进记录
   */
  async getClueRecords() {
    try {
      let params = {
        clueId: this.id
      }
      let { data: res } = await ClueFollowList(params)
      if (res.success) {
        this.followLists = res.data
      }
    } catch (err) {
      console.log(`get clue record fail:${err}`)
    }
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
  handleCommand(val:number) {
    if (val !== 3) {
      this.type = val;
      (this.$refs.follow as any).openDialog()
    } else {
      (this.$refs.inviteInterview as any).openDialog()
    }
  }
  /**
   * 填写面试表或修改面试表
   */
  handleBtnClick() {
    this.$router.push({
      path: '/transport/interview',
      query: {
        id: this.id + ''
      }
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
