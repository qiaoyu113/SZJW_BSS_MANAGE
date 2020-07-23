<template>
  <div :class="isPC ? 'OwnerDetail' : 'OwnerDetail-m'">
    <el-radio-group
      v-model="tabVal"
      style="margin-bottom: 30px;"
    >
      <el-radio-button label="1">
        货主详情
      </el-radio-button>
      <el-radio-button label="2">
        线索详情
      </el-radio-button>
    </el-radio-group>

    <!--货主详情-->
    <div
      v-show="tabVal === '1'"
      class="ownerDetail"
    >
      <SectionContainer
        title="详情信息"
        :md="true"
      >
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="货主编号"
              :value="OwnerDetail.customerId"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="线索编号"
              :value="OwnerDetail.clueId"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="销售"
              :value="OwnerDetail.saleName"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="电话"
              :value="OwnerDetail.salePhone"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="公司简称"
              :value="OwnerDetail.customerCompanyName"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="公司主体"
              :value="OwnerDetail.customerCompanyMain"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="对接业务联系人"
              :value="OwnerDetail.bussinessName"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="对接业务联系电话"
              :value="OwnerDetail.bussinessPhone"
            >
              <template>
                <el-button
                  v-if="showReachPhone"
                  type="text"
                  style="padding: 0 4px"
                  @click="getAllPhone(true)"
                >
                  查看
                </el-button>
              </template>
            </DetailItem>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="职务"
              :value="OwnerDetail.bussinessPosition"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="对接业务身份证号"
              :value="OwnerDetail.bussinessCard"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="分类"
              :value="OwnerDetail.classificationName"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="城市"
              :value="OwnerDetail.cityName"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="合同止期"
              :value="OwnerDetail.contractEnd | Timestamp"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="创建日期"
              :value="OwnerDetail.createDate | Timestamp"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="详细地址"
              :value="OwnerDetail.address"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="备注"
              :value="OwnerDetail.remark"
            />
          </el-col>
        </el-row>
      </SectionContainer>
      <SectionContainer
        title="营业执照"
        :md="true"
      >
        <el-row>
          <el-col :span="isPC ? 12 : 24">
            <el-image
              :preview-src-list="[OwnerDetail.businessLicenseUrl]"
              :src="OwnerDetail.businessLicenseUrl"
            />
          </el-col>
        </el-row>
      </SectionContainer>
    </div>
    <div
      v-show="tabVal === '2'"
      class="clueDetail"
    >
      <SectionContainer
        title="基本信息"
        :md="true"
      >
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="姓名"
              :value="OwnerDetail.clueInfoVO.name"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="手机号"
              :value="OwnerDetail.clueInfoVO.phone"
            >
              <template>
                <el-button
                  v-if="OwnerDetail.clueInfoVO.isPhone"
                  type="text"
                  style="padding: 0 4px"
                  @click="getAllPhone(false)"
                >
                  查看
                </el-button>
              </template>
            </DetailItem>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="线索编号"
              :value="OwnerDetail.clueInfoVO.clueId"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="分配状态"
              :value="OwnerDetail.clueInfoVO.distributionState === 1 ? '待分配' : (OwnerDetail.clueInfoVO.distributionState === 2 ? '已分配' : '暂无数据')"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="线索状态"
              :value="OwnerDetail.clueInfoVO.clueState === 0 ? '待跟进' : (OwnerDetail.clueInfoVO.clueState === 1 ? '已跟进' : (OwnerDetail.clueInfoVO.clueState === 2 ? '已转化' : (OwnerDetail.clueInfoVO.clueState === 3 ? '无效' : '暂无数据')))"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="线索来源"
              :value="OwnerDetail.clueInfoVO.clueSourceName"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="公司"
              :value="OwnerDetail.clueInfoVO.company"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="职务"
              :value="OwnerDetail.bussinessPosition"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="城市"
              :value="OwnerDetail.clueInfoVO.cityName"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="销售"
              :value="OwnerDetail.saleName"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="销售电话"
              :value="OwnerDetail.salePhone"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="创建日期"
              :value="OwnerDetail.clueInfoVO.createDate | Timestamp"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="更新日期"
              :value="OwnerDetail.clueInfoVO.createDate | Timestamp"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="详细地址"
              :value="OwnerDetail.clueInfoVO.address"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="备注"
              :value="OwnerDetail.clueInfoVO.remark"
            />
          </el-col>
        </el-row>
      </SectionContainer>
      <SectionContainer
        title="跟进信息"
        :md="true"
      >
        <el-row>
          <el-col :span="isPC ? 8 : 24">
            <DetailItem
              name="是否继续跟进"
              :value="OwnerDetail.clueState === 1 || OwnerDetail.clueState === 2 ? '是' : '否'"
            />
          </el-col>
          <el-col
            v-for="item in OwnerDetail.clueInfoVO.lineClueDemandVos"
            :key="item.demandNo"
            :span="isPC ? 8 : 24"
          >
            <DetailItem
              name="需求车型"
              :value="item.demandCarTypeName + '/' + item.demandNo + '(辆)'"
            />
          </el-col>
        </el-row>

        <div
          v-for="(item, index) in OwnerDetail.clueInfoVO.lineClueFollowVos"
          :key="item.id"
          class="follow"
        >
          <p>
            <span class="follow_title">
              跟进记录{{ index + 1 }}
            </span>
          </p>
          <el-row>
            <el-col :span="isPC ? 8 : 24">
              <DetailItem
                name="拜访时间"
                :value="item.visitDate | Timestamp"
              />
            </el-col>
            <el-col :span="isPC ? 8 : 24">
              <DetailItem
                name="拜访地址"
                :value="item.visitAddress"
              />
            </el-col>
            <el-col :span="isPC ? 8 : 24">
              <DetailItem
                name="拜访记录"
                :value="item.visitRecord"
              />
            </el-col>
          </el-row>
        </div>
      </SectionContainer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { GetOwnerDetail, GetFindBusinessPhone, GetShowPhone } from '@/api/cargo'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

    @Component({
      name: 'OwnerDetail',
      components: {
        DetailItem,
        SectionContainer
      }
    })

export default class extends Vue {
    private id: any = ''
    private tabVal: any = '1'
    private showReachPhone: any = true
    private OwnerDetail:any = {
      'address': '',
      'businessLicenseUrl': '',
      'bussinessCard': '',
      'bussinessName': '',
      'bussinessPhone': '',
      'bussinessPosition': '',
      'city': 0,
      'cityName': '',
      'classification': 0,
      'classificationName': 0,
      'clueId': '',
      'clueInfoVO': {
        'address': '',
        'city': 0,
        'cityName': '',
        'clueId': '',
        'clueSource': 0,
        'clueSourceName': '',
        'clueState': 0,
        'company': '',
        'createDate': '',
        'createId': 0,
        'distributionState': 0,
        'invalidDescription': '',
        'lineClueDemandVos': [
          {
            'demandCarType': 0,
            'demandNo': 0,
            'id': 0
          }
        ],
        'lineClueFollowVos': [
          {
            'id': 0,
            'visitAddress': '',
            'visitDate': '',
            'visitRecord': ''
          }
        ],
        'lineSaleId': 0,
        'lineSaleName': '',
        'name': '',
        'phone': '',
        'position': '',
        'remark': '',
        'updateDate': '',
        'updateId': 0
      },
      'contractEnd': '',
      'createDate': '',
      'customerCompanyMain': '',
      'customerCompanyName': '',
      'customerId': '',
      'lineSaleId': 0,
      'remark': '',
      'saleName': '',
      'salePhone': ''
    }

    created() {
      this.id = this.$route.query.id
      this.fetchData(this.id)
    }

    mounted() {
    }

    activated() {
    }

    // 判断是否是PC
    get isPC() {
      return SettingsModule.isPC
    }

    // 请求详情
    private async fetchData(value: any) {
      const { data } = await GetOwnerDetail({ customerId: value, info: 'info' })
      if (data.success) {
        this.OwnerDetail = data.data
      } else {
        this.$message.error(data.errorMsg)
      }
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

    // 查看手机号
    private async getAllPhone(type: Boolean) {
      if (type) {
        const { data } = await GetFindBusinessPhone({ customerId: this.id })
        if (data.success) {
          this.OwnerDetail.bussinessPhone = data.data
          this.showReachPhone = false
        } else {
          this.$message.error(data.errorMsg)
        }
      } else {
        const { data } = await GetShowPhone({ clueId: this.OwnerDetail.clueId })
        if (data.success) {
          this.OwnerDetail.clueInfoVO.phone = data.data
        } else {
          this.$message.error(data)
        }
      }
    }
}
</script>

<style lang="scss" scope>
.OwnerDetail {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .el-form-item__label{
    color: #4a4a4a;
    font-weight: 400;
  }
  .follow{
      width:100%;
      .follow_title{
          line-height: 35px;
          color:#666;
          font-size: 12px;
          background: $main-btn;
          display: inline;
          padding: 3px 10px;
          color:#fff;
          border-radius: 16px;
      }
  }
  .el-radio-group{
      margin-bottom: 20px !important;
  }
}
</style>

<style lang="scss" scope>
.OwnerDetail-m {
  width: 100%;
  .el-form-item__label{
    color: #4a4a4a;
    font-weight: 400;
  }

  .follow{
      width:100%;
      p{
          width:100%;
          text-align: center;
        .follow_title{
            line-height: 35px;
            color:#666;
            font-size: 12px;
            background: $main-btn;
            display: inline;
            padding: 3px 10px;
            color:#fff;
            border-radius: 16px;
        }
      }
  }
}
</style>

<style lang="scss" scope>
@media screen and (min-width: 701px) {
  .el-select {
    width: 100%;
  }
  .el-input{
    width: 75%;
  }
//   .el-radio-button__orig-radio:checked + .el-radio-button__inner{
//       background: $assist-btn;
//       -webkit-box-shadow: -1px 0 0 0 $assist-btn;
//       box-shadow: -1px 0 0 0 $assist-btn;
//       border-color: $assist-btn;
//   }
//   .el-radio-button__inner:hover{
//       color: $assist-btn;
//   }
}

@media screen and (max-width: 700px) {
  .el-select {
    width: 100%;
  }
  .el-input{
    width: 90%;
  }
  .el-radio-group{
      width:100%;
      text-align: center;
      margin: auto;
  }
  .el-radio-group{
      margin-bottom: 10px !important;
      margin-top: 10px !important;
  }
  .el-radio-button__orig-radio + .el-radio-button__inner{
      font-size: 12px;
  }
}
</style>
