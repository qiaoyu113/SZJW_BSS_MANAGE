<template>
  <div
    v-loading="loading"
    :class="isPC ? 'ClueDetail' : 'ClueDetail-m'"
  >
    <SectionContainer
      title="基本信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="姓名"
            :value="details.name"
          />
        </el-col>

        <el-col
          :span="isPC ? 6 : 24"
          class="posr"
        >
          <DetailItem
            name="手机号"
            :value="details.phone"
          />
          <el-button
            v-if="details.isPhone"
            class="showPhone"
            size="mini"
            @click="showPhone"
          >
            {{ "查看" }}
          </el-button>
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="线索编号"
            :value="details.clueId"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="分配状态"
            :value="details.distributionState | findDistribution"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="线索状态"
            :value="details.clueState | findClue"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="线索来源"
            :value="details.clueSourceName"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="城市"
            :value="details.cityName"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="公司"
            :value="details.company"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="职务"
            :value="details.position"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="销售"
            :value="details.lineSaleName"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="销售电话"
            :value="details.lineSalePhone"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="创建日期"
            :value="details.createDate | Timestamp"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="更新日期"
            :value="details.updateDate | Timestamp"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="详细地址"
            :value="details.address"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="备注"
            :value="details.remark"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <SectionContainer
      v-if="details.clueState === 3"
      title="无效信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="无效描述"
            :value="details.invalidDescription"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <SectionContainer
      v-if="details.clueState !== 3 && details.clueState !== 0"
      title="跟进信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="是否继续跟进"
            :value="details.isTransform === 1 ? '是' : '否'"
          />
        </el-col>
        <el-col
          v-for="(item, index) in details.lineClueDemandVos"
          :key="index"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            v-if="item"
            :name="`需求车型${index + 1}`"
            :value="`${item.demandCarTypeName}/${item.demandNo}辆`"
          />
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="space-between"
        class="wrap"
      >
        <el-col
          v-for="(item, index) in details.lineClueFollowVos"
          :key="index"
          class="follow-card"
          :span="isPC ? 10 : 24"
        >
          <div class="card-tit">
            <div class="card-t">
              跟进记录{{ index + 1 }}
            </div>
          </div>
          <div class="card-box clearfix">
            <el-col :span="24">
              <DetailItem
                v-if="item"
                name="拜访时间"
                :value="item.visitDate | Timestamp"
              />
            </el-col>
            <el-col :span="24">
              <DetailItem
                name="拜访地址"
                :value="item.visitAddress"
              />
            </el-col>
            <el-col :span="24">
              <DetailItem
                name="拜访记录"
                :value="item.visitRecord"
              />
            </el-col>
          </div>
        </el-col>
      </el-row>
    </SectionContainer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { GetCustomerList } from '@/api/customer'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { GetLineClueDetail, ShowPhone } from '@/api/cargo'
import '@/styles/common.scss'
const optionsClue: any = [
  // （0：待跟进 1：已跟进 2：已转化 3：无效）
  {
    value: 0,
    label: '待跟进'
  },
  {
    value: 1,
    label: '已跟进'
  },
  {
    value: 2,
    label: '已转化'
  },
  {
    value: 3,
    label: '无效'
  }
] // 线索状态
const optionsDistribution: any = [
  {
    value: 0,
    label: '待分配'
  },
  {
    value: 1,
    label: '已分配'
  }
] //
@Component({
  name: 'ClueDetail',
  components: {
    DetailItem,
    SectionContainer
  },
  filters: {
    findDistribution(status: string) {
      const item = optionsDistribution.find(
        ({ value }: any) => value === status
      )
      return item ? item['label'] : status
    },
    findClue(status: string) {
      const item = optionsClue.find(({ value }: any) => value === status)
      return item ? item['label'] : status
    }
  }
})
export default class extends Vue {
  private details: any = {};
  private loading: boolean = false;
  private id: any = '';
  private optionsClue: any = optionsClue; // 线索状态
  private optionsDistribution: any = optionsDistribution; //
  private async getDetail() {
    this.loading = true
    const { data } = await GetLineClueDetail({
      clueId: this.id,
      info: 'info'
    })
    this.loading = false
    if (data.success) {
      this.details = data.data
    } else {
      this.$message.error(data)
    }
  }
  private async showPhone() {
    const { data } = await ShowPhone({
      clueId: this.details.clueId
    })
    if (data.success) {
      this.details.phone = data.data
      this.details.isPhone = false
    } else {
      this.$message.error(data)
    }
  }
  private fetchData() {
    this.getDetail()
  }

  mounted() {
    this.id = this.$route.query.id
    this.fetchData()
  }

  activated() {}

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>

<style lang="scss">
.ClueDetail {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .el-form-item__label {
    color: #4a4a4a;
    font-weight: 400;
  }
}
</style>

<style lang="scss">
.ClueDetail-m {
  width: 100%;
  .el-form-item__label {
    color: #4a4a4a;
    font-weight: 400;
  }
  .follow-card {
    margin-left: 10px;
    margin-right: 10px;
  }
  .card-box {
    padding: 10px;
  }
}
</style>

<style lang="scss" scope>
.ClueDetail,
.ClueDetail-m {
  .posr {
    position: relative;
  }
  .wrap {
    flex-wrap: wrap;
  }
  .showPhone {
    position: absolute;
    left: 120px;
    bottom: 3px;
  }
  .follow-card {
    margin-bottom: 20px;
    border-radius: 4px;
    border: 1px solid #dde2ee;
    background: #fafbfc;
    .card-tit {
      position: relative;
      height: 32px;
      line-height: 32px;
      background: #dde2ee;
      font-size: 14px;
      color: #838a9d;
      text-align: center;
      border-radius: 4px 4px 0 0;
    }
    .card-box {
      padding: 24px 30px;
    }
  }
}
</style>
