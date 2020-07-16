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

import { EditDriverInfo, driverDetailByDriverId } from '@/api/driver'
import { phoneReg } from '@/utils/index.ts'

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
  private driverId:string = ''
  private listQuery:IState = {
    name: '',
    phone: '',
    idNo: '',
    email: '',
    remark: '',
    workCity: '',
    workCityName: ''
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
      key: 'workCityName',
      label: '工作城市:'
    },
    {
      type: 1,
      key: 'idNo',
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
      type: 1,
      key: 'remark',
      label: '备注:',
      col: 12,
      tagAttrs: {
        placeholder: '请输入备注',
        maxlength: 100,
        type: 'textarea',
        'show-word-limit': true,
        rows: 3
      }
    },
    {
      slot: true,
      col: 24,
      w: '0px',
      type: 'btn1'
    }
  ]
  /**
   * 校验手机号
   */
  private validatePhone = (rule: any, value: string, callback: Function) => {
    if (!phoneReg.test(this.listQuery.phone)) {
      return callback(new Error('请输入正确的手机号'))
    }
    callback()
  }
  private rules:IState = {
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { validator: this.validatePhone, trigger: 'blur' }
    ],
    email: [
      { required: false, type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ],
    remark: [
      { required: true, message: '请输入备注', trigger: ['blur'] }
    ]
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  mounted() {
    this.driverId = (this.$route as any).query.id
    this.getDriverInfoByDriverId()
  }
  /**
   *获取司机信息
   */
  async getDriverInfoByDriverId() {
    try {
      let params = {
        driverId: this.driverId
      }
      let { data: res } = await driverDetailByDriverId(params)
      if (res.success) {
        this.listQuery = {
          ...this.listQuery,
          ...{
            name: res.data.name,
            phone: res.data.phone,
            idNo: res.data.idNo,
            email: res.data.email,
            remark: res.data.remark,
            workCity: res.data.workCity,
            workCityName: res.data.workCityName
          }
        }
      }
    } catch (err) {
      console.log(`get driver fail:${err}`)
    }
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
  }

  /**
   * 表单验证通过
   */
  async handlePass() {
    try {
      let params = {
        ...this.listQuery,
        ...{
          driverId: this.driverId
        }
      }

      let { data: res } = await EditDriverInfo(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.$router.push({
          path: '/transport/driverlist'
        })
      }
    } catch (err) {
      console.log('edit save fail:', err)
    }
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
