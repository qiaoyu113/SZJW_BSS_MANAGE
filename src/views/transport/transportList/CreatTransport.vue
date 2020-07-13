<template>
  <div :class="isPC ? 'CreatTransport' : 'CreatTransport-m'">
    <div class="creatBox">
      <h1 class="pageTitle">
        创建运力
      </h1>
      <p class="pageWord">
        为签约司机创建运力，运力即为该签约司机下可以承担货运任务的人和车，可以为每个运力撮合标书上岗。
      </p>
      <div class="creatInfo">
        <div class="stepsBox">
          <el-steps :active="activeCreat">
            <el-step
              title="选择签约司机和订单"
            />
            <el-step
              title="确认运力信息"
            />
            <el-step
              title="完成"
            />
          </el-steps>
        </div>
        <template v-if="activeCreat === 1">
          <div class="chooseBox">
            <div class="creatPhone">
              <span class="phoneLabel">签约司机姓名（手机号）:</span>
              <el-input
                v-model="phoneNum"
                placeholder="请输入司机姓名或手机号"
              />
            </div>
            <span class="orderLabel">请选择签约订单 :</span>
          </div>
          <div class="orderBox">
            <div class="boxItem">
              <i class="el-icon-star-on" />
              <div class="orderItem">
                <span class="orderNum">订单编号：DSADASDSA5313</span>
                <span>商品分类：梧桐共享</span>
                <span>合作模式：带车</span>
                <span>合作车型：4.2米厢货</span>
                <div class="goDetail">
                  <span>订单金额：￥4000.00</span>
                  <span>详情></span>
                </div>
              </div>
            </div>
            <div class="boxItem">
              <i class="el-icon-star-off" />
              <div class="orderItem">
                <span class="orderNum">订单编号：DSADASDSA5313</span>
                <span>商品分类：梧桐共享</span>
                <span>合作模式：带车</span>
                <span>合作车型：4.2米厢货</span>
                <div class="goDetail">
                  <span>订单金额：￥4000.00</span>
                  <span>详情></span>
                </div>
              </div>
            </div>
            <div class="boxItem">
              <i class="el-icon-star-off" />
              <div class="orderItem">
                <span class="orderNum">订单编号：DSADASDSA5313</span>
                <span>商品分类：梧桐共享</span>
                <span>合作模式：带车</span>
                <span>合作车型：4.2米厢货</span>
                <div class="goDetail">
                  <span>订单金额：￥4000.00</span>
                  <span>详情></span>
                </div>
              </div>
            </div>
          </div>
          <el-button
            type="primary"
            style="margin-top:40px"
            @click="nextChoose"
          >
            下一步
          </el-button>
        </template>
        <template v-if="activeCreat === 2">
          <div class="orderForm">
            <SectionContainer
              title="基础信息（必填项）"
              :md="true"
            >
              <self-form
                :list-query="orderInfo"
                :form-item="formItem"
                label-width="100px"
              />
            </SectionContainer>
            <SectionContainer
              title="基础信息（非必填项）"
              :md="true"
            >
              <self-form
                :list-query="orderInfo"
                :form-item="formItemOther"
                label-width="140px"
              />
            </SectionContainer>
          </div>
          <div class="btnGroup">
            <el-button
              @click="backChoose"
            >
              上一步
            </el-button>
            <el-button
              type="primary"
              @click="sureSubmit"
            >
              确定
            </el-button>
          </div>
        </template>
        <template v-if="activeCreat === 3">
          <div class="creatOver">
            <i
              class="el-icon-success icon"
              color="#52c41a"
            />
            <span class="successText">成功创建</span>
            <div>
              <el-button
                type="primary"
                @click="backAgain"
              >
                再次创建
              </el-button>
              <el-button

                @click="backRouter"
              >
                返回运力列表
              </el-button>
            </div>
          </div>
        </template>
      </div>
      <div
        v-if="activeCreat === 1"
        class="textInfo"
      >
        <p class="textTitle">
          说明
        </p>
        <div>
          <p class="textTitle">
            选择签约司机
          </p>
          <p class="textWord">
            为该签约司机创建可以承担货运任务的运力
          </p>
        </div>
        <div>
          <p class="textTitle">
            选择签约订单
          </p>
          <p class="textWord">
            绑定订单和运力，改运力的炮火情况收到订单影响
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SectionContainer from '@/components/SectionContainer/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'
import '@/styles/common.scss'

  interface IState {
    [key: string]: any;
  }

  @Component({
    name: 'TransportList',
    components: {
      SectionContainer,
      SelfForm
    }
  })

export default class extends Vue {
  private activeCreat:number = 3
  private phoneNum:string = ''
  private orderType:number = 0
  private orderInfo:IState = {
    soldnum: ''
  }
  private formItem:any[] = [
    {
      type: 1,
      label: '姓名',
      key: 'soldnum',
      tagAttrs: {
        placeholder: '请输入姓名'
      }
    },
    {
      type: 1,
      label: '联系方式',
      key: 'soldnum',
      tagAttrs: {
        placeholder: '请输入联系方式'
      }
    },
    {
      type: 2,
      key: 'name',
      label: '工作城市',
      tagAttrs: {
        placeholder: '请选择城市'
      },
      options: [
        {
          label: '58同城',
          value: '58'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
    },
    {
      type: 1,
      label: '车牌号',
      key: 'soldnum',
      tagAttrs: {
        placeholder: '请输入车牌号'
      }
    },
    {
      type: 2,
      key: 'name',
      label: '车型',
      tagAttrs: {
        placeholder: '请选择车型'
      },
      options: [
        {
          label: '58同城',
          value: '58'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
    },
    {
      type: 2,
      key: 'name',
      label: '运营经理',
      tagAttrs: {
        placeholder: '请选择运营经理'
      },
      options: [
        {
          label: '58同城',
          value: '58'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
    }
  ]

  private formItemOther:any[] = [
    {
      type: 1,
      label: '司机年龄',
      key: 'age',
      tagAttrs: {
        placeholder: '请输入司机年龄'
      }
    },
    {
      type: 2,
      key: 'name',
      label: '户口类型',
      tagAttrs: {
        placeholder: '请选择户口类型'
      },
      options: [
        {
          label: '58同城',
          value: '58'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
    },
    {
      type: 1,
      label: '货物运输经验（月）',
      key: 'age',
      tagAttrs: {
        placeholder: '请输入司机年龄'
      }
    },
    {
      type: 1,
      label: '货物运输经验（月）',
      key: 'age',
      tagAttrs: {
        placeholder: '请输入司机年龄'
      }
    },
    {
      type: 2,
      key: 'name',
      label: '配送货物类型',
      tagAttrs: {
        placeholder: '请选择配送货物类型'
      },
      options: [
        {
          label: '58同城',
          value: '58'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
    },
    {
      type: 2,
      key: 'name',
      label: '期望月收入',
      tagAttrs: {
        placeholder: '请选择期望月收入'
      },
      options: [
        {
          label: '58同城',
          value: '58'
        },
        {
          label: '朋友圈',
          value: 'wechat'
        }
      ]
    },
    {
      type: 1,
      label: '平均月收入',
      key: 'age',
      tagAttrs: {
        placeholder: '请输入平均月收入'
      }
    },
    {
      type: 2,
      key: 'name',
      label: '是否存在还贷款',
      tagAttrs: {
        placeholder: '请选择是否存在还贷款'
      },
      options: [
        {
          label: '否',
          value: '0'
        },
        {
          label: '是',
          value: '1'
        }
      ]
    },
    {
      type: 2,
      key: 'name',
      label: '可接受一天工作时长',
      tagAttrs: {
        placeholder: '请选择可接受一天工作时长'
      },
      options: [
        {
          label: '否',
          value: '0'
        },
        {
          label: '是',
          value: '1'
        }
      ]
    },
    {
      type: 1,
      label: '备注',
      key: 'age',
      tagAttrs: {
        placeholder: '请输入备注（最多可填100字）',
        type: 'textarea'
      }
    }
  ]

  nextChoose() {
    this.activeCreat = 2
  }
  backChoose() {
    this.activeCreat = 1
  }
  backAgain() {
    this.activeCreat = 1
  }
  backRouter() {
    this.$router.push('transportlist')
  }
  sureSubmit() {
    this.activeCreat = 3
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>
<style lang="scss" scoped>
.CreatTransport{
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  .creatBox{
    background-color: white;
    border-radius: 5px;
    padding: 30px 50px;
    box-sizing: border-box;
    .pageTitle{
      font-size: 18px;
      color: #4A4A4A;
      padding: 0;
      margin: 0;
    }
    .pageWord{
      font-size: 14px;
      color: #4A4A4A;
    }
    .creatInfo{
      border-bottom: 1px solid #ebebeb;
      .stepsBox{
        width: 100%;
      }
      padding:  30px 50px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      .chooseBox{
        margin-top: 60px;
        .creatPhone{
          display: flex;
          align-items: center;
          justify-content: center;
          .phoneLabel{
              display: block;
              width: 160px;
              text-align: right;
              color: #595959;
              margin-right: 10px;
              font-size: 14px;
            }
            .el-input{
              width: 600px;
            }
          }
        }
        .orderLabel{
          margin: 30px 0;
          display: block;
          width: 160px;
          text-align: right;
          color: #595959;
          margin-right: 10px;
        }
      .orderBox{
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .boxItem{
          display: flex;
          justify-content: space-between;
          align-items: center;
          .orderItem{
            cursor: pointer;
            margin-left: 20px;
            border: 1px solid #DCDFE6;
            padding: 10px 20px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            font-size: 14px;
            color: #c4c4c4;
            span{
              margin-bottom: 10px;
            }
            .goDetail{
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .orderNum{
              font-weight: bold;
              color: black;
            }
          }
          .orderItem:last-child{
            margin-bottom: 0;
          }
        }
      }
    }
    .textInfo{
      margin-top: 40px;
      .textTitle{
        font-weight: bold;
        font-size: 14px;
        color: #8d8d8d;
      }
      .textWord{
        color: #a0a0a0;
        font-size: 14px;
      }
    }
  }
  .orderForm{
    padding: 30px 0;
  }
  .btnGroup{
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }
  .creatOver{
    width: 100%;
    height: calc( 100vh - 400px );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .successText{
      font-weight: bold;
      font-size: 24px;
      margin: 40px 0;
    }
    .icon{
      font-size: 60px;
      color: #52c41a;
    }
  }
}
</style>
