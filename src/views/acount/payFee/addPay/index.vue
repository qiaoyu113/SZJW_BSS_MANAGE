<template>
  <div class="addPay">
    <SectionContainer
      title="基础信息"
      :md="true"
    >
      <template v-slot:rightBox>
        <el-button
          :size="isPC ? 'small' : 'mini'"
          @click="handleBackClick"
        >
          返回
        </el-button>
      </template>
      <self-form
        ref="SelfForm"
        :list-query="formData"
        :form-item="formItem"
        :rules="addRules"
        label-width="120px"
        label-position="right"
      />
    </SectionContainer>
    <SectionContainer
      title="支付信息"
      :md="true"
      class="payInfo"
    >
      <template>
        <el-form
          ref="payForm"
          :model="payForm"
        >
          <el-table
            :data="tableData"
            class="tableStyle"
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
            />
            <el-table-column
              label="交易流水号"
              width="180"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'list.'+scope.$index+'.payNumber'"
                  :rules="{required: true, message: '请输入交易流水号', trigger: 'blur'}"
                >
                  <el-input
                    v-model="payForm.list[scope.$index].payNumber"
                    placeholder="请输入交易流水号"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="交易时间"
              width="250"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'list.'+scope.$index+'.payDate'"
                  :rules="{required: true, message: '请选择日期', trigger: 'blur'}"
                >
                  <el-date-picker
                    v-model="payForm.list[scope.$index].payDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="timestamp"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="交易金额（元）"
              width="180"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'list.'+scope.$index+'.payMoney'"
                  :rules="{required: true, message: '请输入交易金额', trigger: 'blur'}"
                >
                  <el-input
                    v-model="payForm.list[scope.$index].payMoney"
                    placeholder="请输入交易金额"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="支付方式"
              width="180"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'list.'+scope.$index+'.payType'"
                  :rules="{required: true, message: '请输入支付方式', trigger: 'blur'}"
                >
                  <el-input
                    v-model="payForm.list[scope.$index].payType"
                    placeholder="请输入支付方式"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="交易凭证"
              width="180"
              align="center"
            >
              <template slot-scope="scope">
                <el-form-item

                  class="uploadItem"
                  :prop="'list.'+scope.$index+'.payPic'"
                  :rules="{required: true, message: '请选择上传图片', trigger: 'change'}"
                >
                  <el-upload
                    :ref="'upload'+scope.$index"
                    :key="'upload'+scope.$index"
                    :limit="1"
                    action="https://httpbin.org/post"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload(scope.$index)"
                    :class="'upload'+scope.$index"
                    @click.native="upload(scope)"
                  >
                    <span
                      v-if="tableData[scope.$index].canUpload"
                      :ref="'active'+scope.$index"
                      class="active"
                    >上传</span>

                    <div
                      v-if="!tableData[scope.$index].canUpload"
                      slot="file"
                      slot-scope="{file}"
                    >
                      <div
                        class="demo-image__preview"
                        :a="file"
                      >
                        <el-image
                          style="width: 100px; height: 100px"
                          :src="tableData[scope.$index].payPic"
                          :preview-src-list="[tableData[scope.$index].payPic]"
                        >
                          <div
                            slot="placeholder"
                            class="image-slot"
                          >
                            加载中<span class="dot">...</span>
                          </div>
                          <div
                            slot="error"
                            class="image-slot"
                          >
                            加载中<span class="dot">...</span>
                          </div>
                        </el-image>
                      </div>
                    </div>
                  </el-upload>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleAdd(scope.$index, scope.row)"
                >
                  添加
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="btnBox">
            <el-button @click="handleBackClick">
              取消
            </el-button>
            <el-button
              type="primary"
              @click="handleSaveClick"
            >
              提交
            </el-button>
          </div>
        </el-form>
      </template>
    </SectionContainer>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import SelfForm from '@/components/Base/SelfForm.vue'
import { deleteUser } from '@/api/users'
 @Component({
   name: 'addPay',
   components: {
     SectionContainer,
     SelfForm
   }
 })
export default class extends Vue {
  private ReceiptOptions:any = [
    { label: '否', value: 0 },
    { label: '是', value: 1 }
  ]
  private orderOptions:any[] = [
    { label: '否', value: 0 },
    { label: '是', value: 1 }
  ]
  private driverInfoOptions:any[] = [
    { label: '否', value: 0 },
    { label: '是', value: 1 }
  ]
  private addRules:any = {
    driverInfo: [
      { required: true, message: '请选择司机', trigger: 'change' }
    ],
    orderId: [
      { required: true, message: '请选择订单', trigger: 'change' }
    ],
    isReceipt: [
      { required: true, message: '请选择是否开收据', trigger: 'change' }
    ]
  }
  private formData:any = {
    driverInfo: '',
    cashMoney: '',
    orderId: '',
    driverId: '',
    phone: '',
    workCity: '',
    gmId: '',
    isReceipt: '',
    remarks: ''
  }
  private formItem: any[] = [
    {
      type: 2,
      key: 'driverInfo',
      label: '选择司机：',
      col: 24,
      tagAttrs: {
        placeholder: '选择司机',
        filterable: true
      },
      options: this.driverInfoOptions
    },
    {
      type: 7,
      key: 'cashMoney',
      label: '可提现金额：',
      col: 24
    },
    {
      type: 2,
      key: 'orderId',
      label: '订单编号：',
      col: 24,
      tagAttrs: {
        placeholder: '选择司机',
        filterable: true
      },
      options: this.orderOptions
    },
    {
      type: 7,
      key: 'driverId',
      label: '司机编号：',
      col: 24
    },
    {
      type: 7,
      key: 'phone',
      label: '联系电话：',
      col: 24
    },
    {
      type: 7,
      key: 'workCity',
      label: '所属城市：',
      col: 24
    },
    {
      type: 7,
      key: 'gmId',
      label: '加盟经理：',
      col: 24
    },
    {
      type: 4,
      key: 'isReceipt',
      label: '是否开收据：',
      col: 24,
      options: this.ReceiptOptions
    },
    {
      type: 1,
      key: 'remarks',
      label: '备注：',
      tagAttrs: {
        placeholder: '请填写最多100个字',
        type: 'textarea',
        maxlength: 100,
        'show-word-limit': true,
        clearable: true,
        rows: '4',
        name: 'interview_chooseRemarks_input'
      }
    }
  ]
  private tableData:any[] = [{
    payNumber: '',
    payMoney: '',
    payType: '',
    payPic: '',
    payDate: '',
    name: '',
    canUpload: true
  }]
  private columnIndex:number = 0
  private payForm:any = {
    list: [
      {
        payNumber: '',
        payMoney: '',
        payType: '',
        payPic: '',
        payDate: ''
      }
    ]
  }
  private picShow:Boolean = false
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  // @Watch('payForm.list', { deep: true })
  // private listChange(val:any) {
  //   val.forEach((ele:any, index:number) => {
  //     if (ele.payPic) {
  //       return index
  //     }
  //   })
  // }

  private handleAdd(index:number, row:any) {
    const column = {
      payNumber: '',
      payMoney: '',
      payType: '',
      payPic: '',
      payDate: '',
      canUpload: true
    }
    this.tableData.splice(index + 1, 0, column)
    this.payForm.list.splice(index + 1, 0, column)
  }
  private async handleDelete(index:number, row:any) {
    if (this.tableData.length === 1) {
      this.$message({
        message: '不能再删了，这是最后一条了。',
        type: 'warning'
      })
      return
    }
    await ((this.$refs.payForm) as any).clearValidate()
    await ((this.$refs['upload' + index]) as any).clearFiles()
    if (this.tableData[index].payPic) {
      setTimeout(() => {
        this.tableData.splice(index, 1)
        this.payForm.list.splice(index, 1)
      }, 1000)
    } else {
      this.tableData.splice(index, 1)
      this.payForm.list.splice(index, 1)
    }
  }
  private upload(value:any) {
    this.columnIndex = value.$index
  }
  private handleChange(file:any, fileList:any) {
    this.picShow = fileList.length > 0
  }
  private handleAvatarSuccess(res:any, file:any) {
    this.picShow = true
    this.tableData[this.columnIndex].payPic = URL.createObjectURL(file.raw)
    this.payForm.list[this.columnIndex].payPic = URL.createObjectURL(file.raw)
  }
  private beforeAvatarUpload(index:number) {
    return (file:any) => {
      this.tableData[index].canUpload = false
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
  private async handleSaveClick() {
    await this.handleValidateForm()
    await this.handleValidateTableForm()
    this.saveData()
  }

  private handleBackClick() {
    this.$confirm('确定要放弃已填写的内容返回上一页吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.$message({
        type: 'success',
        message: '成功!'
      })
      this.$router.push({
        path: '/driveraccount/payFee'
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消'
      })
    })
  }

  /**
   * 提交表单
   */
  private saveData() {
    let formData = this.formData
    let tableData = this.payForm.list
    // .map((ele:any) => {
    //   delete ele.canUpload
    // })
    let params = { ...formData }
    params.table = tableData
    console.log(params)
  }
  /**
   *校验表单
   */
  handleValidateForm() {
    ((this.$refs.SelfForm) as any).submitForm()
  }
  handleValidateTableForm() {
    ((this.$refs['payForm']) as any).validate((valid:any) => {
      if (valid) {
        console.log('payForm', this.payForm)
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.addPay {
  padding: 30px;
  box-sizing: border-box;
  .active {
    color: #649cee;
    cursor: pointer;
  }
  .el-upload-list__item-thumbnail{
    width: 100px;
    height: 100px;
  }
  .tableStyle{
    .el-form-item{
      margin-top: 20px;
    }
    .el-form-item__content{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
<style scoped>
.addPay >>> .el-select,
.addPay >>> .el-textarea {
  width: 500px;
  flex: none;
}
.addPay .payInfo >>> .el-input__inner {
  border: none;
}
.addPay .btnBox{
  width: 100%;
 margin: 30px auto;
 text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar {
  width: 64px;
  height: 64px;
  display: block;
}
</style>
<style scoped>
.hide >>> .el-upload--picture-card {
  display: none;
}
.uploadItem >>> .el-upload{
  display: block;
}
</style>
