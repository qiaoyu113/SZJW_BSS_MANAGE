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
              value="刘德华123123"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="线索编号"
              value="15071362991"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="销售"
              value="武汉市黄陂区前川街人信城"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="电话"
              value="四川省成都市青白江区祥福镇宇培分拨中心"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="公司简称"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="公司主体"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="对接业务联系人"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="对接业务联系电话"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="职务"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="对接业务身份证号"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="分类"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="城市"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="合同止期"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="创建日期"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="详细地址"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="备注"
              value="04:30-11:30"
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
              :preview-src-list="['https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg']"
              src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
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
              value="武汉市黄陂区前川街人信城"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="分配状态"
              value="四川省成都市青白江区祥福镇宇培分拨中心"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="线索状态"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="线索来源"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="公司"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="职务"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="城市"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="销售"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="销售电话"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="创建日期"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="更新日期"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="详细地址"
              value="04:30-11:30"
            />
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <DetailItem
              name="备注"
              value="04:30-11:30"
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
              value="刘德华123123"
            />
          </el-col>
          <el-col :span="isPC ? 8 : 24">
            <DetailItem
              name="需求车型"
              value="刘德华123123"
            />
          </el-col>
          <el-col :span="isPC ? 8 : 24">
            <DetailItem
              name="需求车型"
              value="刘德华123123"
            />
          </el-col>
        </el-row>

        <div class="follow">
          <p>
            <span class="follow_title">
              跟进记录1
            </span>
          </p>
          <el-row>
            <el-col :span="isPC ? 8 : 24">
              <DetailItem
                name="拜访时间"
                value="刘德华123123"
              />
            </el-col>
            <el-col :span="isPC ? 8 : 24">
              <DetailItem
                name="拜访地址"
                value="刘德华123123"
              />
            </el-col>
            <el-col :span="isPC ? 8 : 24">
              <DetailItem
                name="拜访记录"
                value="刘德华123123"
              />
            </el-col>
          </el-row>
        </div>

        <div class="follow">
          <p>
            <span class="follow_title">
              跟进记录2
            </span>
          </p>
          <el-row>
            <el-col :span="isPC ? 8 : 24">
              <DetailItem
                name="是否继续跟进"
                value="刘德华123123"
              />
            </el-col>
            <el-col :span="isPC ? 8 : 24">
              <DetailItem
                name="需求车型"
                value="刘德华123123"
              />
            </el-col>
            <el-col :span="isPC ? 8 : 24">
              <DetailItem
                name="需求车型"
                value="刘德华123123"
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
import { GetCustomerList } from '@/api/customer'
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
      this.id = this.$route.query.id
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

    private handleClick() {
      console.log(this.tabVal)
    }
}
</script>

<style lang="scss">
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
}
</style>

<style lang="scss">
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
  .el-radio-group{
      margin-bottom: 20px !important;
  }
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
