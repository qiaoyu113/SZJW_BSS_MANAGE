<template>
  <div class="editDriver">
    <el-card header="基础信息">
      <self-form
        ref="editDriver"
        :list-query="listQuery"
        :form-item="formItem"
        label-width="100px"
        :rules="rules"
        @onPass="handlePass"
      >
        <div
          slot="btn1"
          :class="isPC ? 'btnPc' : 'btnMobile'"
        >
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            name="editDriver_cancel_btn"
            @click="handleCancelClick"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            :class="isPC ? '' : 'btnMobile'"
            name="editDriver_confirm_btn"
            @click="handleConfirmClick"
          >
            确认
          </el-button>
        </div>
      </self-form>
    </el-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'

interface IState {
    [key: string]: any;
}

@Component({
  name: 'EditDriver',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  private listQuery:IState = {
    name: '',
    phone: '',
    city: '北京市',
    idCard: '',
    email: ''
  }

  private formItem:any[] = [
    {
      type: 1,
      key: 'name',
      label: '姓名:',
      tagAttrs: {
        placeholder: '请输入姓名',
        maxlength: 10
      }
    },
    {
      type: 1,
      key: 'phone',
      label: '联系方式:',
      tagAttrs: {
        placeholder: '请输入联系方式',
        maxlength: 11
      }
    },
    {
      type: 7,
      key: 'city',
      label: '工作城市:'
    },
    {
      type: 1,
      key: 'idCard',
      label: '身份证号:',
      tagAttrs: {
        placeholder: '请输入身份证号'
      }
    },
    {
      type: 1,
      key: 'email',
      label: '电子邮箱:',
      tagAttrs: {
        placeholder: '请输入电子邮箱',
        maxlength: 10
      }
    },

    {
      slot: true,
      col: 24,
      w: '0px',
      type: 'btn1'
    }
  ]
  private rules:IState = {
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' }
    ],
    email: [
      { required: false, type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  /**
   *取消按钮
   */
  handleCancelClick() {
    this.$router.push({
      path: '/transport/driverlist'
    })
  }
  /**
   *确认按钮
   */
  handleConfirmClick() {
    (this.$refs.editDriver as any).submitForm()
    console.log(this.listQuery)
  }

  /**
   * 表单验证通过
   */
  handlePass() {
    this.$router.push({
      path: '/transport/driverlist'
    })
  }
}
</script>
<style lang="scss" scoped>
  .editDriver {
    padding: 20px;
    .btnPc {
      margin-top:200px;
      display: flex;
      flex-flow: row nowrap;
      width: 100%;
    }
    .btnMobile {
      margin-left: 0;
      margin-top: 10px;
      width:100%;
    }
  }
</style>

<style scoped>
  .editDriver >>> .el-card__header {
    font-weight:bold;
  }
</style>
