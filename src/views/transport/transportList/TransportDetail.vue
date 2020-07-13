<template>
  <div :class="isPC ? 'TransportDetail' : 'TransportDetail-m'">
    <template>
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="基本信息"
          name="first"
        >
          <el-card>
            <div class="baseBox">
              <self-form
                class="base"
                :list-query="listQuery"
                :form-item="formItem"
                label-width="80px"
              >
                <template slot="detail">
                  <router-link
                    :to="{path: '/'}"
                    class="link"
                  >
                    详情>>
                  </router-link>
                </template>
              </self-form>

              <base-info :item="baseObj" />
              <base-info :item="otherObj" />
              <!-- <SectionContainer
                title="基本信息"
                :md="true"
              >
                <el-row>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="运力编号"
                      value="HDNSONOSNOS"
                    />
                  </el-col>

                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="姓名"
                      value="穆佳祥"
                    />
                  </el-col>

                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="联系方式"
                      value="18848885135"
                    />
                  </el-col>

                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="业务线"
                      value="共享"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="工作城市"
                      value="杭州市"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="意向车型"
                      value="4.2米厢货"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="车牌号"
                      value="1998年7月1日"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="运力状态"
                      value="待上岗"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="所属司机编号"
                      value="515616161ad"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="所属司机"
                      value="穆佳祥"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="所属司机手机号"
                      value="18848885135"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="运营经理"
                      value="王利"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="运营经理手机号"
                      value="18848885135"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="创建人"
                      value="王利"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="创建人手机号"
                      value="18848885135"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="创建时间"
                      value="2020.9.5"
                    />
                  </el-col>
                </el-row>
              </SectionContainer>
              <SectionContainer
                title="其他信息"
                :md="true"
              >
                <el-row>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="司机年龄"
                      value="23"
                    />
                  </el-col>

                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="户口类型"
                      value="城镇户口"
                    />
                  </el-col>

                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="货物运输经验（月）"
                      value="34"
                    />
                  </el-col>

                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="家庭住址"
                      value="浙江省杭州市萧山区"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="配送货物类型"
                      value="水果"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="期望月收入"
                      value="10000以上"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="平均月收入"
                      value="9000"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="是否存在还贷款"
                      value="否"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="可接受一天工作时长"
                      value="10小时"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="平均月收入"
                      value="9000"
                    />
                  </el-col>
                  <el-col :span="isPC ? 6 : 24">
                    <DetailItem
                      name="备注"
                      value="我要9000"
                    />
                  </el-col>
                </el-row>
              </SectionContainer> -->
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane
          label="标书信息"
          name="second"
        >
          <el-card>
            <div class="bidBox">
              <bid-info :lists="bidLists" />
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { GetCustomerList } from '@/api/customer'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import SelfForm from '@/components/base/SelfForm.vue'
import bidInfo from '../driverList/components/bidInfo.vue'
import baseInfo from './components/baseInfo.vue'
import '@/styles/common.scss'
interface IState {
    [key: string]: any;
}

    @Component({
      name: 'TransportDetail',
      components: {
        DetailItem,
        SectionContainer,
        SelfForm,
        bidInfo,
        baseInfo
      }
    })

export default class extends Vue {
  private activeName:string = 'first'
  private listQuery:IState = {
    orderNum: 'DD202005060001',
    shopType: '梧桐共享',
    orderType: '带车',
    orderCar: '4.2米厢货',
    orderTime: '3个月',
    orderMoney: '订单金额',
    orderPay: '微信小程序',
    payTime: '2020-09-08 12:00'
  }

  private formItem:any[] = [
    {
      type: 7,
      key: 'orderNum',
      label: '订单编号:',
      col: 24,
      tagAttrs: {
        style: {
          fontWeight: 'bold',
          fontSize: '16px'
        }
      }
    },
    {
      type: 7,
      key: 'shopType',
      label: '商品分类:'
    },
    {
      type: 7,
      key: 'orderType',
      label: '合作模式:'
    },
    {
      type: 7,
      key: 'orderCar',
      label: '合作车型:'
    },
    {
      type: 7,
      key: 'orderTime',
      label: '合作期限:'
    },
    {
      type: 7,
      key: 'orderMoney',
      label: '订单金额:'
    },
    {
      type: 7,
      key: 'orderPay',
      label: '支付方式:'
    },
    {
      type: 7,
      key: 'payTime',
      label: '支付时间:'
    },
    {
      slot: true,
      w: '10px',
      type: 'detail'
    }
  ]

  private bidLists = [
    {
      code: '202007091001',
      a: '穆家祥',
      b: '吴江体育用品',
      c: Date.now(),
      d: '202007091001',
      e: '吴江体育用品'
    }
  ]

  private baseObj:any = {
    title: '基本信息',
    a: 'ZSS2020006446216',
    b: '穆家祥',
    c: '18848885135',
    d: '共享',
    e: '杭州市',
    f: '4.2米厢货',
    g: '京A B1556',
    h: '待上岗',
    i: 'ZOIHDOIANDOANDOPI313',
    j: '司机xingming',
    q: '1848885135',
    l: '运营经理名字',
    m: '运营手机号',
    n: '创建人姓名',
    o: '创建人手机号',
    p: '创建时间'
  }

    private otherObj:any = {
      title: '其他信息',
      a: '23',
      b: '城镇户口',
      c: '34',
      d: '浙江省杭州市萧山区',
      e: '水果',
      f: '10000以上',
      g: '9000',
      h: '否',
      i: '10小时',
      j: '备注'
    }

    private handleClick(tab:any, event:any) {
      console.log(tab, event)
    }
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

    private submitForm(formName:any) {
      (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    private resetForm(formName:any) {
      (this.$refs[formName] as ElForm).resetFields()
    }
}
</script>

<style lang="scss">
.TransportDetail {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .el-form-item__label{
    color: #4a4a4a;
    font-weight: 400;
  }
  .detail-group{
    padding: 15px;
  }
  // .detail-title{

  //   font-size: 14px;
  //   color: #666;
  //   font-weight: 400;
  //   text-align: right;
  //   padding-right: 16px;
  //   box-sizing: border-box;
  // }
    .steps{
      margin: 60px 0 30px 0;
      }
       .detail-title {
    font-size: 13px;
    color: #9e9e9e;
    font-weight: 400;
    padding-right: 16px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-bottom: 6px;
}
}
</style>

<style lang="scss" scoped>
.TransportDetail-m {
  width: 100%;
}
</style>
<style lang="scss" scoped>
.TransportDetail{
  .link {
        color: #649CEE;
        font-weight:bold;
      }
  .bidBox,.baseBox{
    min-height: calc(100vh - 250px);
  }
}
</style>
<style scope>
/* @media screen and (min-width: 701px) {
  .el-select {
    width: 100%;
  }
  .el-input{
    width: 75%;
  }
}

@media screen and (max-width: 700px) {
  .el-select {
    width: 100%;
  }
  .el-input{
    width: 90%;
  }
} */
</style>
