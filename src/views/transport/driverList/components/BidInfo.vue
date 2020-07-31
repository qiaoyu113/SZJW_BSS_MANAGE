<template>
  <div class="bidInfo">
    <template v-if="lists.length > 0">
      <dl
        v-for="item in lists"
        :key="item.code"
      >
        <dt class="title">
          <span class="title_left_border" />
          标书编号:{{ item.code }}
        </dt>
        <dd>
          <self-form
            class="base"
            :list-query="item"
            :form-item="formItem"
            label-width="80px"
            :m-block="true"
            :pc-block="true"
          >
            <template v-slot:c="{row}">
              {{ row.c | Timestamp }}
            </template>
            <template slot="detail">
              <router-link
                :to="{path: '/'}"
                class="link"
              >
                详情>>
              </router-link>
            </template>
          </self-form>
        </dd>
      </dl>
    </template>
    <div v-else>
      <span class="noData">暂无数据</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'

interface IState {
    [key: string]: any;
}
@Component({
  name: 'BidInfo',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: () => [] }) lists!:IState[]
  @Prop({ default: () => [] }) formItem!:any[]
}
</script>
<style lang="scss" scoped>
  .bidInfo{
    dl {
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
    .noData {
      display: flex;
      justify-content: center;
      align-items: center;
      height:100px;
      color:#666;
      font-size:13px;
    }
  }
</style>
<style scoped>
 @media screen and (max-width:700px) {
    .bidInfo >>> .selfForm {
      padding: 0px;
    }
    .bidInfo >>> .el-form-item {
      width: 100%;
      padding: 10px 14px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-bottom: 1px solid #F8F9FA;
    }
    .bidInfo >>> .el-form-item__label {
      width: 100%!important;
      font-size: 12px!important;
      line-height: 13px;
      color: #666;
      font-weight: 400;
      text-align: left;
      padding-right: 15px;
      padding-bottom: 10px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    .bidInfo >>> .el-form-item__content {
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: #252525;
      line-height: 16px;
    }
    .bidInfo >>> dl {
      margin: 0px;
    }
    .bidInfo >>> dt {
      width: 100%;
      height: 45px!important;
      line-height: 40px;
      font-size: 15px;
      color: #4A4A4A;
      font-weight: 500;
      position: relative;
      padding: 0 20px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
 }
 @media screen and (min-width: 700px){
   .orderInfo >>> .el-form-item__label {
    font-size: 13px!important;
    color: #9e9e9e!important;
    font-weight: 400;
    padding-right: 16px;
  }
  .orderInfo >>> .el-form-item__content span {
      font-size: 14px;
      color: #333;
      font-weight: 700;
      overflow-wrap: break-word;
  }
 }
</style>
