<template>
  <div
    v-loading="loading"
    class="ConversionClue"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="isPC ? '160px' : '80px'"
    >
      <SectionContainer title="基本信息">
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="公司简称"
              prop="customerCompanyName"
            >
              <el-input
                v-model="ruleForm.customerCompanyName"
                placeholder="请输入公司简称"
                clearable
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="公司主体公司"
              prop="customerCompanyMain"
            >
              <el-input
                v-model="ruleForm.customerCompanyMain"
                placeholder="请输入公司主体公司"
                clearable
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="合同止期"
              prop="contractEnd"
            >
              <el-date-picker
                v-model="ruleForm.contractEnd"
                type="date"
                placeholder="选择合同止期"
                value-format="yyyy-MM-dd"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="分类"
              prop="classification"
            >
              <el-select
                v-model="ruleForm.classification"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(item, index) in optionsCustCategory"
                  :key="index"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="业务对接人姓名"
              prop="bussinessName"
            >
              <el-input
                v-model="ruleForm.bussinessName"
                placeholder="请输入业务对接人姓名"
                clearable
                maxlength="10"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="业务对接人联系电话"
              prop="bussinessPhone"
            >
              <el-input
                v-model="ruleForm.bussinessPhone"
                maxlength="11"
                clearable
                placeholder="请输入业务对接人联系电话"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="职务"
              prop="bussinessPosition"
            >
              <el-input
                v-model="ruleForm.bussinessPosition"
                maxlength="20"
                clearable
                placeholder="请输入职务"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="业务对接人身份证号"
              prop="bussinessCard"
            >
              <el-input
                v-model="ruleForm.bussinessCard"
                maxlength="18"
                clearable
                placeholder="请输入业务对接人身份证号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="城市"
              prop="city"
            >
              <el-select
                v-model="ruleForm.city"
                placeholder="请选择城市"
                clearable
              >
                <el-option
                  v-for="(item, index) in optionsCity"
                  :key="index"
                  :label="item.name"
                  :value="Number(item.code)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="详细地址"
              prop="address"
            >
              <el-input
                v-model="ruleForm.address"
                placeholder="请输入详细地址"
                clearable
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="营业执照"
              prop="businessLicenseUrl"
            >
              <el-upload
                :action="getImgUrls"
                :headers="myHeaders"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove('businessLicenseUrl')"
                :on-success="handleUpSuccess('businessLicenseUrl')"
                :limit="1"
                :file-list="imageList"
                :before-upload="beforeAvatarUpload"
                accept="image/*"
                list-type="picture-card"
              >
                <i class="el-icon-plus" />
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="备注"
              prop="remark"
            >
              <el-input
                v-model="ruleForm.remark"
                type="textarea"
                :autosize="{minRows: 2, maxRows: 4}"
                placeholder="请输入"
                maxlength="300"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <div class="btn_box">
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
            >
              提交
            </el-button>
            <el-button @click="resetForm('ruleForm')">
              重置
            </el-button>
          </div>
        </el-form-item>
      </SectionContainer>
    </el-form>
    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="imageList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { TagsViewModule } from '@/store/modules/tags-view'
import { TransformCustomer, GetCustomerOff, GetLineClueDetail } from '@/api/cargo'
import { GetDictionaryList, GetOpenCityData } from '@/api/common'
import { UserModule } from '@/store/modules/user'

import '@/styles/common.scss'
@Component({
  name: 'ConversionClue',
  components: {
    SectionContainer
  }
})
export default class extends Vue {
  private loading: boolean = false;
  private id: any = ''
  private optionsCity: any[] = []; // 字典查询定义(命名规则为options + 类型名称)
  private optionsCustCategory: any[] = []
  private ruleForm:any = {
    'address': '', // 详细地址
    'businessLicenseUrl': '', // 图片url
    'bussinessCard': '', // 身份证
    'bussinessName': '', // 业务对接人姓名
    'bussinessPhone': '', // 业务对接人联系电话
    'bussinessPosition': '', // 业务对接人职务
    'city': '', // 城市（开通业务）
    'classification': '', // 分类
    'clueId': '', // 线索编号id
    'contractEnd': '', // 合同截止时间
    'customerCompanyMain': '', // 货主公司主体
    'customerCompanyName': '', // 货主公司简称
    'customerId': '', // 货主编号id
    'lineSaleId': '', // 销售id
    'remark': ''// 备注
  }
  private rules:any = {
    address: [
      { required: true, message: '请输入详细地址', trigger: 'blur' }
    ],
    bussinessCard: [
      { required: false, message: '请输入身份证', trigger: 'blur' },
      { pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/, message: '请输入正确格式身份证', trigger: 'blur' }
    ],
    bussinessName: [
      { required: true, message: '请输入业务对接人姓名', trigger: 'blur' }
    ],
    bussinessPhone: [
      { required: true, message: '请输入业务对接人联系电话', trigger: 'blur' },
      { pattern: /^1\d{10}$/, message: '请输入正确格式手机号', trigger: 'blur' }
    ],
    city: [
      { required: true, message: '请选择城市', trigger: 'change' }
    ],
    classification: [
      { required: true, message: '请选择分类', trigger: 'change' }
    ],
    contractEnd: [
      { required: true, message: '请选择日期', trigger: 'change' }
    ],
    customerCompanyMain: [
      { required: true, message: '请输入货主公司主体', trigger: 'blur' }
    ],
    customerCompanyName: [
      { required: true, message: '请输入货主公司简称', trigger: 'blur' }
    ]
  }
  // 上传
  private showDio:boolean = false
  private isloading:boolean = false
  private getImgUrls:string = this.getImgUrl()
  private imageList:any[] = []
  private showViewer:boolean = false
  private myHeaders:any = { Authorization: UserModule.token }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  private submitForm(formName:any) {
    (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        // alert('submit!')
        this.loading = true
        const { data } = await TransformCustomer(this.ruleForm)
        this.loading = false
        if (data.success) {
          this.$message.success(`转化成功`)
          console.log(data)
        } else {
          this.$message.error(data)
        }
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  private resetForm(formName:any) {
    (this.$refs[formName] as ElForm).resetFields()
  }
  /**
   *获取上传路径
   */
  private getImgUrl() {
    let url
    if (window.location.host === 'http://192.168.0.134/:9528') {
      url = 'http://szjw-bss-web.m1.yunniao.cn/api/base/v1/base/upload/uploadOSS/lineImg/true/0'
    } else {
      url = '/api/base/v1/base/upload/uploadOSS/lineImg/true/0'
    }
    return url
  }
  /**
   *上传前的校验
   */
  private beforeAvatarUpload(file:any) {
    return true
  }
  /**
   * 预览
   */
  private handlePictureCardPreview(file:any) {
    this.imageList = [file.url]
    if (this.imageList.length > 0) {
      this.showViewer = true
    }
  }
  /**
   * 删除
   */
  private handleRemove(key:any) {
    let that = this
    return (file:any, fileList:any[]) => {
      that.ruleForm[key] = ''
      that.imageList = []
    }
  }
  /**
   * 上传成功
   */
  private handleUpSuccess(key:any) {
    let that = this
    return (res:any) => {
      if (res.success) {
        that.ruleForm[key] = res.data.url
        that.imageList.push({ url: res.data.url, name: res.data.name })
      } else {
        this.$message.error('上传图片错误：' + res)
      }
    }
  }
  /**
   *关闭预览框
   */
  private closeViewer() {
    this.showViewer = false
  }
  private async getDictionary() {
    try {
      let { data: res } = await GetOpenCityData()
      if (res.success) {
        this.optionsCity = res.data
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`${err}`)
    }
  }
  private async getDictionaryList() {
    const { data } = await GetDictionaryList(['customer_category'])
    if (data.success) {
      this.optionsCustCategory = data.data.customer_category
    } else {
      this.$message.error(data)
    }
  }
  private async getDetails() {
    const { data } = await GetLineClueDetail({
      clueId: this.id
    })
    if (data.success) {
      const { company, name, phone, position, address } = data.data
      this.ruleForm.clueId = this.id
      this.ruleForm.address = address // 详细地址
      this.ruleForm.bussinessName = name // 姓名
      this.ruleForm.bussinessPhone = phone // 手机号
      this.ruleForm.customerCompanyName = company // 公司
      this.ruleForm.bussinessPosition = position // 职务
    } else {
      this.$message.error(data)
    }
  }
  private async getCustomerOff() {
    const { data } = await GetCustomerOff()
    if (data.success) {
      console.log(data.data)
    } else {
      this.$message.error(data)
    }
  }
  private fetchData() {
    // 获取客户下销售
    this.getCustomerOff()
    // 获取字典
    this.getDictionaryList()
    // 获取工作城市
    this.getDictionary()
    // 获取线索详情
    if (this.id) {
      this.getDetails()
    }
  }
  mounted() {
    this.id = this.$route.query.id
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped>
.el-select{
  display: block;
}
.el-date-editor{
  display: block;
  width: auto;
}
</style>
<style lang="scss" scope>
.el-collapse-item__content {
  padding-bottom: 0;
}
.el-form-item__label {
  color: #999999;
}
</style>
