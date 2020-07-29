<template>
  <div :class="isPC ? 'ContractDetail' : 'ContractDetail-m'">
    <SectionContainer
      title="司机信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="司机姓名"
            :value="ContractDetail.driverInfoBusiVO.name + '(' + ContractDetail.driverInfoBusiVO.phone + ')'"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="加盟经理"
            :value="ContractDetail.driverInfoBusiVO.gmName + '(' + ContractDetail.driverInfoBusiVO.gmPhone + ')'"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="城市"
            :value="ContractDetail.driverInfoBusiVO.workCityName"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <SectionContainer
      title="合同信息"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="合同编号"
            :value="ContractDetail.fileNo"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="订单单号"
            :value="ContractDetail.orderId"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="合同名称"
            :value="ContractDetail.subject"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="司机姓名"
            :value="ContractDetail.driverInfoBusiVO.name + (ContractDetail.driverInfoBusiVO.phone)"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="合同归属"
            :value="ContractDetail.busiTypeName"
          />
        </el-col>

        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="合同状态"
            :value="ContractDetail.statusName"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <SectionContainer
      title="操作记录"
      :md="true"
    >
      <el-row
        type="flex"
        justify="space-between"
        class="wrap"
      >
        <el-col
          class="follow-card"
          :span="isPC ? 24 : 24"
        >
          <div class="card-tit">
            <div class="card-t">
              最新记录
            </div>
          </div>
          <div class="card-box clearfix">
            <el-col :span="24">
              <DetailItem
                name="合同生成时间"
                :value="ContractDetail.createDate"
              >
                <template>
                  <span>{{ (ContractDetail.remark) }}</span>
                </template>
              </DetailItem>
            </el-col>
            <el-col
              v-if="ContractDetail.status === 2"
              :span="24"
            >
              <DetailItem
                name="合同签约时间"
                :value="ContractDetail.signTime"
              >
                <template>
                  <span>{{ ' 由' + ContractDetail.driverInfoBusiVO.name + (ContractDetail.driverInfoBusiVO.phone) + '签署成功;' }}</span>
                </template>
              </DetailItem>
            </el-col>
            <el-col
              v-if="ContractDetail.status === 3"
              :span="24"
            >
              <DetailItem
                name="合同过期时间"
                :value="ContractDetail.signTime"
              >
                <template>
                  <span> 由系统到期自动失效</span>
                </template>
              </DetailItem>
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
import { GetContractDetail } from '@/api/join'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'
@Component({
  name: 'ContractDetail',
  components: {
    DetailItem,
    SectionContainer
  }
})
export default class extends Vue {
    private id: any = ''
    private ContractDetail: any = {
      'busiType': 0,
      'busiTypeName': '',
      'certifiationIdcardNo': '',
      'certifiationName': '',
      'certifiationPhone': '',
      'contractId': '',
      'createDate': '',
      'createId': '',
      'createName': '',
      'driverId': '',
      'remark': '',
      'driverInfoBusiVO': {
        'address': '',
        'bankCardNo': '',
        'busiType': '',
        'busiTypeName': '',
        'carType': '',
        'carTypeName': '',
        'clueId': '',
        'corpUserId': '',
        'createDate': '',
        'createId': '',
        'createName': '',
        'delFlag': true,
        'driverId': '',
        'email': '',
        'exterUserId': '',
        'gmId': '',
        'gmName': '',
        'gmTeam': '',
        'gmTeamId': '',
        'idNo': '',
        'name': '',
        'phone': '',
        'remark': '',
        'sourceChannel': '',
        'sourceChannelName': '',
        'status': '',
        'statusName': '',
        'updateDate': '',
        'updateId': '',
        'updateName': '',
        'workCity': '',
        'workCityName': ''
      },
      'fileNo': '',
      'fileUrl': '',
      'orderId': '',
      'signTime': '',
      'status': '',
      'statusName': '',
      'subject': '',
      'updateDate': '',
      'updateId': '',
      'updateName': ''
    }
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

    mounted() {
      this.id = this.$route.query.id
      this.getDetail(this.id)
    }

    activated() {}

    // 判断是否是PC
    get isPC() {
      return SettingsModule.isPC
    }

    // 请求详情
    private async getDetail(value: any) {
      const { data } = await GetContractDetail({ contractId: value })
      if (data.success) {
        let datas = data.data
        if (!datas.driverInfoBusiVO) {
          datas.driverInfoBusiVO = {
            'address': '',
            'bankCardNo': '',
            'busiType': '',
            'busiTypeName': '',
            'carType': '',
            'carTypeName': '',
            'clueId': '',
            'corpUserId': '',
            'createDate': '',
            'createId': '',
            'createName': '',
            'delFlag': true,
            'driverId': '',
            'email': '',
            'exterUserId': '',
            'gmId': '',
            'gmName': '',
            'gmTeam': '',
            'gmTeamId': '',
            'idNo': '',
            'name': '',
            'phone': '',
            'remark': '',
            'sourceChannel': '',
            'sourceChannelName': '',
            'status': '',
            'statusName': '',
            'updateDate': '',
            'updateId': '',
            'updateName': '',
            'workCity': '',
            'workCityName': ''
          }
        }
        this.ContractDetail = Object.assign(this.ContractDetail, datas)
      } else {
        this.$message.error(data)
      }
    }
}
</script>

<style lang="scss">
.ContractDetail {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .el-form-item__label {
    color: #4a4a4a;
    font-weight: 400;
  }

  .hint_title{
      width: 100%;
      font-size: 13px;
      color: #333;
      margin: 0 0 15px 0;
      box-sizing: border-box;
      display: inline-block;
      border-radius: 6px;
      span{
        color: #9e9e9e;
      }
  }
}
</style>

<style lang="scss">
.ContractDetail-m {
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
  .hint_title{
      width: 100%;
      font-size: 13px;
      color: #333;
      padding: 10px 15px 0;
      box-sizing: border-box;
      display: inline-block;
      border-radius: 6px;
      span{
        color: #9e9e9e;
      }
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
