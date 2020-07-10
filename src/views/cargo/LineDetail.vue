<template>
  <div :class="isPC ? 'LineDetail' : 'LineDetail-m'">
    <SectionContainer
      title="基础信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="货主姓名"
            value="北京京东"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="内部使用线路名称"
            value="北京京东传站618"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="备注信息/线路描述"
            value="北京京东传站618"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="线路类型"
            value="替换型"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="可上车数"
            value="1辆"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="仓位置"
            value="四川省成都市青白江区祥福镇宇培分拨中心"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="上架有效期（天）"
            value="1998年7月1日"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="线路稳定性"
            value="2-4个月（一般稳定）"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <SectionContainer
      title="配送信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="选择车型"
            value="4.2米厢货"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="配送区域"
            value="北京市朝阳区全区域"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="具体区域范围"
            value="全区域"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="是否需要返仓"
            value="是"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="是否需要回单"
            value="是"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="预计每日平均配送点位数"
            value="2"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="预计每日平均总公里数（公里）"
            value="60"
          />
        </el-col>
      </el-row>
    </SectionContainer>

    <SectionContainer
      title="结算信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="每日配送趟数"
            value="4"
          />
        </el-col>
        <el-col
          v-for="index in 4"
          :key="index"
          :span="isPC ? 6 : 24"
        >
          <DetailItem
            name="预计工作时间"
            value="09:00-10:22"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="预计每日平均总公里数（公里）"
            value="60"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="预计月出车天数"
            value="30"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="结算方式"
            value="整车"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="货主单趟报价"
            value="300"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="预计货主月报价"
            value="24000"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="结算周期"
            value="月结"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="结算天数"
            value="30天"
          />
        </el-col>
        <el-col
          :span="24"
          class="detail-group"
        >
          <template>
            <span class="detail-title">配送周期:</span>
            <el-checkbox-group v-model="checkList">
              <el-checkbox
                label="全选"
                disabled
              />
              <el-checkbox
                label="周一"
                disabled
              />
              <el-checkbox
                label="周二"
                disabled
              />
              <el-checkbox
                label="周三"
                disabled
              />
              <el-checkbox
                label="周四"
                disabled
              />
              <el-checkbox
                label="周五"
                disabled
              />
              <el-checkbox
                label="周六"
                disabled
              />
              <el-checkbox
                label="周日"
                disabled
              />
            </el-checkbox-group>
          </template>
        </el-col>
      </el-row>
    </sectioncontainer>
    <SectionContainer
      title="线路角色"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="线路打分"
            value="90"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="线路角色"
            value="梧桐专车"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <div class="steps">
      <el-steps
        :active="2"
        align-center
      >
        <el-step
          title="创建线路"
          description="张明明  2020-09-10"
        />
        <el-step
          title="外线BGL已审核"
          description="张明明"
        />
        <el-step
          title="标书可上岗"
          description="张明明"
        />
        <el-step
          title="售罄"
        />
      </el-steps>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { GetCustomerList } from '@/api/customer'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

    @Component({
      name: 'LineDetail',
      components: {
        DetailItem,
        SectionContainer
      }
    })

export default class extends Vue {
  private ruleForm:any = {
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: ''
  }

  private checkList:any[] = ['周一', '周末']

  private rules:any = {
    name: [
      { required: true, message: '请输入活动名称', trigger: 'blur' },
      { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    region: [
      { required: true, message: '请选择活动区域', trigger: 'change' }
    ],
    date1: [
      { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
    ],
    date2: [
      { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
    ],
    type: [
      { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
    ],
    resource: [
      { required: true, message: '请选择活动资源', trigger: 'change' }
    ],
    desc: [
      { required: true, message: '请填写活动形式', trigger: 'blur' }
    ]
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
.LineDetail {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .el-form-item__label{
    color: #4a4a4a;
    font-weight: 400;
  }
  .detail-group{
    padding: 10px;
    display: flex;
    align-items: center;
  }
  .detail-title{

    font-size: 14px;
    color: #666;
    font-weight: 400;
    text-align: right;
    padding-right: 16px;
    box-sizing: border-box;
  }
    .steps{
      margin: 60px 0 30px 0;
      }
}
</style>

<style lang="scss" scoped>
.LineDetail-m {
  width: 100%;
  .el-form-item__label{
    color: #4a4a4a;
    font-weight: 400;
  }
  .detail-group{
    padding: 10px 14px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-bottom: 1px solid #F8F9FA
  }

   .detail-title{
      width: 100%;
      display: block;
      font-size: 12px;
      color: #666;
      font-weight: 400;
      text-align: left;
      padding-right: 15px;
      padding-bottom: 10px;
      box-sizing: border-box;
    }
    .steps{
      margin: 30px 0 20px 0;
    }
}
</style>
<style>
  .steps >>> .el-step .el-step__title {
    font-size: 12px;
    line-height: 24px;
  }
</style>
<style scope>
@media screen and (min-width: 701px) {
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
}
</style>
