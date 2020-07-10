<template>
  <div :class="isPC ? 'ClueDetail' : 'ClueDetail-m'">
    <SectionContainer
      title="基本信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="姓名"
            value="刘德华123123"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="手机号"
            value="15071362991"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="线索编号"
            value="HXS000001"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="分配状态"
            value="已分配"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="线索状态"
            value="待跟进"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="线索来源"
            value="企查查"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="城市"
            value="北京"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="公司"
            value="云鸟"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="职务"
            value="前端开发"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="销售"
            value="测试1"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="销售电话"
            value="12345678911"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="创建日期"
            value="2020/06/06 11:56:08"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="更新日期"
            value="2020/06/06 11:56:08"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="详细地址"
            value="公司的详细地址，字数展示不下自动拓展至下一行展示"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="备注"
            value="公司的详细地址，字数展示不下自动拓展至下一行展示"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <SectionContainer
      title="无效信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="无效描述"
            value="这个信息是中介"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <SectionContainer
      title="跟进信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="是否继续跟进"
            value="是"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="需求车型1"
            value="面包/20辆"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="需求车型2"
            value="面包/20辆"
          />
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="space-between"
        class="wrap"
      >
        <el-col
          class="follow-card"
          :span="isPC ? 10 : 24"
        >
          <div class="card-tit">
            <div class="card-t">
              跟进记录1
            </div>
          </div>
          <div class="card-box clearfix">
            <el-col :span="24">
              <DetailItem
                name="拜访时间"
                value="这个信息是中介"
              />
            </el-col>
            <el-col :span="24">
              <DetailItem
                name="拜访地址"
                value="这个信息是中介"
              />
            </el-col>
            <el-col :span="24">
              <DetailItem
                name="拜访记录"
                value="这个信息是中介"
              />
            </el-col>
          </div>
        </el-col>
        <el-col
          class="follow-card"
          :span="isPC ? 10 : 24"
        >
          <div class="card-tit">
            <div class="card-t">
              跟进记录1
            </div>
          </div>
          <div class="card-box clearfix">
            <el-col :span="24">
              <DetailItem
                name="拜访时间"
                value="这个信息是中介"
              />
            </el-col>
            <el-col :span="24">
              <DetailItem
                name="拜访地址"
                value="这个信息是中介"
              />
            </el-col>
            <el-col :span="24">
              <DetailItem
                name="拜访记录"
                value="这个信息是中介"
              />
            </el-col>
          </div>
        </el-col>
        <el-col
          class="follow-card"
          :span="isPC ? 10 : 24"
        >
          <div class="card-tit">
            <div class="card-t">
              跟进记录1
            </div>
          </div>
          <div class="card-box clearfix">
            <el-col :span="24">
              <DetailItem
                name="拜访时间"
                value="这个信息是中介"
              />
            </el-col>
            <el-col :span="24">
              <DetailItem
                name="拜访地址"
                value="这个信息是中介"
              />
            </el-col>
            <el-col :span="24">
              <DetailItem
                name="拜访记录"
                value="这个信息是中介"
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
import '@/styles/common.scss'
@Component({
  name: 'ClueDetail',
  components: {
    DetailItem,
    SectionContainer
  }
})
export default class extends Vue {
  private ruleForm: any = {
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: ''
  };
  private rules: any = {
    name: [
      { required: true, message: '请输入活动名称', trigger: 'blur' },
      { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
    date1: [
      { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
    ],
    date2: [
      { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
    ],
    type: [
      {
        type: 'array',
        required: true,
        message: '请至少选择一个活动性质',
        trigger: 'change'
      }
    ],
    resource: [
      { required: true, message: '请选择活动资源', trigger: 'change' }
    ],
    desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
  };

  created() {}

  mounted() {}

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
  .follow-card{
    margin-left: 10px;
    margin-right: 10px;
  }
  .card-box{
    padding: 10px;
  }
}
</style>

<style lang="scss" scope>
.wrap {
  flex-wrap: wrap;
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
@media screen and (min-width: 701px) {
  .el-select {
    width: 100%;
  }
  .el-input {
    width: 75%;
  }
}

@media screen and (max-width: 700px) {
  .el-select {
    width: 100%;
  }
  .el-input {
    width: 90%;
  }
}
</style>
