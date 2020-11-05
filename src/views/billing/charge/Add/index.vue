<template>
  <div
    class="addContainer"
    :class="{
      p15: isPC,
      m15: isPC
    }"
  >
    <div class="top">
      <div class="btn">
        <el-button @click.stop="handleBackClick">
          返回
        </el-button>
      </div>
    </div>
    <SectionContainer
      title="SOP信息"
      :md="true"
    >
      <self-form
        ref="addForm"
        :list-query="listQuery"
        :form-item="formItem"
        :m-block="true"
        :pc-col="14"
        :rules="rules"
        label-width="100px"
        @onPass="handlePassClick"
      />
    </SectionContainer>
    <SectionContainer
      title="扣费标准"
      :md="true"
    >
      <self-form
        ref="addForm1"
        :list-query="listQuery"
        :form-item="formItem1"
        :pc-col="14"
        :rules="rules"
        :m-block="true"
        label-width="100px"
        @onPass="handlePassClick1"
      >
        <template slot="fixedAmount">
          <el-input
            v-model="listQuery.fixedAmount"
            v-only-number="{min: 0, max: 999999.99, precision: 2}"
            type="text"
            placeholder="请输入"
          >
            <template slot="append">
              元/次
            </template>
          </el-input>
        </template>
        <template slot="serviceRate">
          <el-input
            v-model="listQuery.serviceRate"
            v-only-number="{min: 0, max: 100, precision: 2}"
            type="text"
            placeholder="请输入"
          >
            <template slot="append">
              %
            </template>
          </el-input>
        </template>
        <template slot="freightRate">
          <el-input
            v-model="listQuery.freightRate"
            v-only-number="{min: 0, max: 100, precision: 2}"
            type="text"
            placeholder="请输入"
          >
            <template slot="append">
              %
            </template>
          </el-input>
        </template>
        <div
          slot="btn"
          :class="isPC ? 'btnPc' : 'mobile'"
        >
          <el-button @click="handleBackClick">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="handleValidateForm"
          >
            确定
          </el-button>
        </div>
      </self-form>
    </SectionContainer>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SelfForm from '@/components/Base/SelfForm.vue'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { GetDutyListByLevel } from '@/api/common'
import { AddCharging, EditCharging, GetChargingDetail } from '@/api/driver-account'
import { delayTime } from '@/settings'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SelfForm,
    SectionContainer
  }
})
export default class extends Vue {
  private formValidate:boolean = false;
  // 业务线列表
  private busiType:IState[] = [];
  private listQuery:IState = {
    id: '',
    chargingType: 1,
    sopType: '',
    sopDesc: '',
    busiType: '',
    remark: '',
    deductionType: '',
    fixedAmount: '',
    serviceRate: '',
    freightRate: ''
  }
  private formItem:any[] = [
    {
      type: 2,
      label: '计费类型:',
      tagAttrs: {
        placeholder: '请选择',
        disabled: true,
        clearable: true
      },
      key: 'chargingType',
      options: [
        {
          value: 1,
          label: 'SOP计费'
        }
      ]
    },
    {
      type: 1,
      label: 'SOP类型:',
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 20,
        clearable: true
      },
      key: 'sopType'
    },
    {
      type: 1,
      label: 'SOP描述:',
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 300,
        type: 'textarea',
        'show-word-limit': true,
        rows: '5',
        clearable: true
      },
      key: 'sopDesc'
    },
    {
      type: 2,
      label: '业务线:',
      key: 'busiType',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      options: this.busiType
    },
    {
      type: 1,
      label: '备注:',
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 300,
        type: 'textarea',
        'show-word-limit': true,
        rows: '5',
        clearable: true
      },
      key: 'remark'
    }
  ]
  private formItem1:any[] = [
    {
      type: 2,
      label: '扣款类型:',
      key: 'deductionType',
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true
      },
      listeners: {
        'change': this.handleDeductionTypeChange
      },
      options: [
        {
          label: '固定金额',
          value: 1
        },
        {
          label: '运费比例',
          value: 2
        },
        {
          label: '服务费比例',
          value: 3
        }
      ]
    },
    {
      label: '固定金额',
      key: 'fixedAmount',
      type: 'fixedAmount',
      slot: true
    }
  ]
  private rules:IState = {
    chargingType: [
      { required: true, message: '', trigger: 'blur' }
    ],
    sopType: [
      { required: true, message: '请输入SOP类型！', trigger: 'blur' }
    ],
    sopDesc: [
      { required: true, message: '请输入SOP描述！', trigger: 'blur' }
    ],
    busiType: [
      { required: true, message: '请选择业务线！', trigger: 'blur' }
    ],
    deductionType: [
      { required: true, message: '请选择扣款类型！', trigger: 'blur' }
    ],
    fixedAmount: [
      { required: true, message: '请输入固定金额！', trigger: 'blur' }
    ],
    serviceRate: [
      { required: true, message: '请输入运费比例！', trigger: 'blur' }
    ],
    freightRate: [
      { required: true, message: '请输入服务费比例！', trigger: 'blur' }
    ]
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 返回
  handleBackClick() {
    this.$router.go(-1)
  }
  // 扣款类型发生变化
  handleDeductionTypeChange(val:number) {
    if (val === 1) {
      this.formItem1.splice(1, 1, {
        label: '固定金额',
        key: 'fixedAmount',
        type: 'fixedAmount',
        slot: true
      })
    } else if (val === 2) {
      this.formItem1.splice(1, 1, {
        label: '运费比例',
        key: 'serviceRate',
        type: 'serviceRate',
        slot: true
      })
    } else if (val === 3) {
      this.formItem1.splice(1, 1, {
        label: '服务费比例',
        key: 'freightRate',
        type: 'freightRate',
        slot: true
      })
    }
  }
  handlePassClick(valid:boolean) {
    this.formValidate = valid
  }
  // 表单验证通过
  handlePassClick1(valid:boolean) {
    if (this.formValidate) {
      if (this.listQuery.id) {
        this.update()
      } else {
        this.save()
      }
    }
  }
  // 调整
  async update() {
    try {
      let params:IState = {
        id: this.listQuery.id,
        chargingType: this.listQuery.chargingType,
        sopType: this.listQuery.sopType,
        sopDesc: this.listQuery.sopDesc,
        busiType: this.listQuery.busiType,
        deductionType: this.listQuery.deductionType
      }
      this.listQuery.remark !== '' && (params.remark = this.listQuery.remark)
      this.listQuery.fixedAmount !== '' && (params.fixedAmount = this.listQuery.fixedAmount)
      this.listQuery.serviceRate !== '' && (params.serviceRate = this.listQuery.serviceRate)
      this.listQuery.freightRate !== '' && (params.freightRate = this.listQuery.freightRate)
      let { data: res } = await EditCharging(params)
      if (res.success) {
        this.$message.success('操作成功')
        setTimeout(() => {
          this.handleBackClick()
        }, delayTime)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`save fail:${err}`)
    }
  }
  // 新建
  async save() {
    try {
      let params:IState = {
        chargingType: this.listQuery.chargingType,
        sopType: this.listQuery.sopType,
        sopDesc: this.listQuery.sopDesc,
        busiType: this.listQuery.busiType,
        deductionType: this.listQuery.deductionType
      }
      this.listQuery.remark !== '' && (params.remark = this.listQuery.remark)
      this.listQuery.fixedAmount !== '' && (params.fixedAmount = this.listQuery.fixedAmount)
      this.listQuery.serviceRate !== '' && (params.serviceRate = this.listQuery.serviceRate)
      this.listQuery.freightRate !== '' && (params.freightRate = this.listQuery.freightRate)
      let { data: res } = await AddCharging(params)
      if (res.success) {
        this.$message.success('操作成功')
        setTimeout(() => {
          this.handleBackClick()
        }, delayTime)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`save fail:${err}`)
    }
  }
  // 表单校验
  handleValidateForm() {
    ((this.$refs.addForm) as any).submitForm()
    setTimeout(() => {
      ((this.$refs.addForm1) as any).submitForm()
    }, 20)
  }
  // 获取业务线列表
  async getBusiType() {
    try {
      let params = {
        dutyLevel: 1
      }
      let { data: res } = await GetDutyListByLevel(params)
      if (res.success) {
        let options = res.data.map((item:any) => ({
          label: item.dutyName,
          value: item.id
        }))
        this.busiType.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get busiType fail:${err}`)
    }
  }
  // 获取详情
  async getDetail() {
    try {
      let params:IState = {
        id: this.listQuery.id
      }
      let { data: res } = await GetChargingDetail(params)
      if (res.success) {
        let result = res.data
        this.listQuery = {
          ...this.listQuery,
          ...{
            chargingType: result.chargingType,
            sopType: result.sopType,
            sopDesc: result.sopDesc,
            busiType: result.busiType,
            remark: result.remark,
            deductionType: result.deductionType,
            fixedAmount: result.fixedAmount,
            serviceRate: result.serviceRate,
            freightRate: result.freightRate
          }
        }
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get detail fail:${err}`)
    }
  }
  mounted() {
    this.getBusiType()
    if (this.$route.query.id) {
      this.listQuery.id = this.$route.query.id
      this.getDetail()
    }
  }
}
</script>
<style lang="scss" scoped>
  .m15 {
     margin: 15px;
  }
  .addContainer {
    background: #ffffff;
    border-radius: 8px;
    .top {
      margin-bottom: 10px;
      .btn {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
      }
    }
    .btnPc {
       display: flex;
       flex-flow: row nowrap;
       justify-content: center;
     }
    .mobile {
      width:100%;
      text-align: center;
      .btnMobile {
        margin-left: 0;
        margin-top: 10px;
        width:80%;
      }
    }
  }
</style>

<style scoped>
  .addContainer >>> .el-input-group__append {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
