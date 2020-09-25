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
      >
        <template slot="e">
          <el-select
            v-model="listQuery.e"
            placeholder="请选择"
            filterable
            clearable
            :disabled="$route.name === 'BillingAdjust'"
          >
            <el-option
              label="专车"
              :value="1"
            />
            <el-option
              label="共享"
              :value="2"
            />
          </el-select>
        </template>
      </self-form>
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
        <template slot="o">
          <el-input
            v-model="listQuery.o"
            v-only-number="{min: 0, max: 999999.99, precision: 2}"
            type="text"
            placeholder="请输入"
          >
            <template slot="append">
              元/次
            </template>
          </el-input>
        </template>
        <template slot="p">
          <el-input
            v-model="listQuery.p"
            v-only-number="{min: 0, max: 100, precision: 2}"
            type="text"
            placeholder="请输入"
          >
            <template slot="append">
              %
            </template>
          </el-input>
        </template>
        <template slot="q">
          <el-input
            v-model="listQuery.q"
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
  private listQuery:IState = {
    b: 'SOP计费',
    c: '',
    d: '',
    e: '',
    f: 1,
    o: '',
    p: '',
    q: ''
  }
  private formItem:any[] = [
    {
      type: 1,
      label: '计费类型:',
      tagAttrs: {
        placeholder: '请输入',
        disabled: true,
        maxlength: 10,
        clearable: true
      },
      key: 'b'
    },
    {
      type: 1,
      label: 'SOP类型:',
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 20,
        clearable: true
      },
      key: 'c'
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
      key: 'd'
    },
    {
      type: 'e',
      label: '加盟类型:',
      slot: true,
      key: 'e'
    },
    {
      type: 1,
      label: '备注:',
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 300,
        type: 'textarea',
        'show-word-limit': true,
        clearable: true
      },
      key: 'remark'
    }
  ]
  private formItem1:any[] = [
    {
      type: 2,
      label: '扣款类型:',
      key: 'f',
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
      key: 'o',
      type: 'o',
      slot: true
    }
  ]
  private rules:IState = {
    b: [
      { required: true, message: '', trigger: 'blur' }
    ],
    c: [
      { required: true, message: '请输入SOP类型！', trigger: 'blur' }
    ],
    d: [
      { required: true, message: '请输入SOP描述！', trigger: 'blur' }
    ],
    e: [
      { required: true, message: '请选择加盟类型！', trigger: 'blur' }
    ],
    f: [
      { required: true, message: '请选择扣款类型！', trigger: 'blur' }
    ],
    o: [
      { required: true, message: '请输入固定金额！', trigger: 'blur' }
    ],
    p: [
      { required: true, message: '请输入运费比例！', trigger: 'blur' }
    ],
    q: [
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
        key: 'o',
        type: 'o',
        slot: true
      })
    } else if (val === 2) {
      this.formItem1.splice(1, 1, {
        label: '运费比例',
        key: 'p',
        type: 'p',
        slot: true
      })
    } else if (val === 3) {
      this.formItem1.splice(1, 1, {
        label: '服务费比例',
        key: 'q',
        type: 'q',
        slot: true
      })
    }
  }
  handlePassClick(valid:boolean) {
    console.log('xxxx:', valid)
    this.formValidate = valid
  }
  handlePassClick1(valid:boolean) {
    if (this.formValidate) {
      console.log('yyyyy:', valid)
    }
  }
  // 表单校验
  handleValidateForm() {
    ((this.$refs.addForm) as any).submitForm()
    setTimeout(() => {
      ((this.$refs.addForm1) as any).submitForm()
    }, 20)
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
