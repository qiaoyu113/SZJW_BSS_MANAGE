<template>
  <div :class="isPC ? 'TakePicture' : 'TakePicture-m'">
    <el-row>
      <el-col :span="24">
        <p>
          <span class="picName">线路名称：</span>
          <span class="picName_value">李威山的线路</span>
        </p>
      </el-col>
      <el-col :span="24">
        <p class="picInfo">
          <span>线路编号：</span>
          <span>XL2020031401</span>
          <span>所属销售：李威山</span>
          <span>创建时间：2016-12-12</span>
        </p>
      </el-col>
    </el-row>
    <div class="picBox">
      <el-form
        ref="postForm"
        :model="postForm"
        class="form-container"
      >
        <el-row>
          <el-col
            v-for="(item, index) in formList"
            :key="index"
            :span="24"
          >
            <div class="postInfo-container">
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    v-if="postForm[item.key] || !isdetail"
                    :label="item.label"
                    label-width="150px"
                  >
                    <el-upload
                      :disabled="isdetail"
                      :class="{'hide': postForm[item.key]}"
                      :action="getImgUrls"
                      :headers="myHeaders"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemove(item.key)"
                      :on-success="handleUpSuccess(item.key)"
                      :limit="1"
                      :file-list="item.imageList"
                      :before-upload="beforeAvatarUpload"
                      accept="image/*"
                      list-type="picture-card"
                    >
                      <i class="el-icon-plus" />
                    </el-upload>
                  </el-form-item>
                  <el-form-item
                    v-else
                    :label="item.label"
                    label-width="150px"
                  >
                    <el-image>
                      <div
                        slot="error"
                        class="image-slot"
                      >
                        <div>
                          <i class="el-icon-picture-outline" />
                          <p>暂无图片</p>
                        </div>
                      </div>
                    </el-image>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col
            v-if="!isdetail"
            :span="24"
          >
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label-width="150px"
                    label=""
                  >
                    <el-button
                      type="primary"
                      @click="onSubmit"
                    >
                      保存
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'
var token = localStorage.getItem('token')
@Component({
  name: 'TakePicture',
  components: {}
})
export default class TakePicture extends Vue {
  private isdetail:boolean = true
  private postForm:any = {
    id: '',
    warehouseLoadingLocation: '',
    cargoPlacement: '',
    loadingSituation: '',
    distributionSite: '',
    lineId: '',
    lineName: ''
  }
  private formList:any = [
    {
      label: '库房装货位置',
      key: 'warehouseLoadingLocation',
      imageList: []
    },
    {
      label: '货物库摆放',
      key: 'cargoPlacement',
      imageList: []
    },
    {
      label: '装车情况',
      key: 'loadingSituation',
      imageList: []
    },
    {
      label: '配送地点实景',
      key: 'distributionSite',
      imageList: []
    }
  ]
  private isloading:boolean = false
  private getImgUrls:string = this.getImgUrl()
  private imageList:any[] = []
  private showViewer:boolean = false
  private myHeaders:any = { Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJwcm9maWxlIjoibTEiLCJ1c2VySWQiOiIzNyIsInVzZXJuYW1lIjoid3RhZG1pbiIsInR5cGUiOiIzIiwiYnVzaVBlcm1pc3Npb24iOiIwIiwiZXhwIjoxNTk2ODA5NDk0fQ.bZCTbKVN3RNRaPXoviC-llaKGCu23I7Ism62WEzk75s' }
  private getImgUrl() {
    let url
    if (window.location.host === 'localhost:9528') {
      url = 'http://firmiana-bss.m1.yunniao.cn/api/base/v1/upload/uploadOSS/img/true/-1'
    } else {
      url = '/api/base/v1/upload/uploadOSS/img/true/-1'
    }
    return url
  }
  private beforeAvatarUpload(file:any) {
    const isImage = file.type.includes('image')
    if (!isImage) {
      this.$message.error('上传图片格式不正确')
    }
    return isImage
  }
  private handlePictureCardPreview(file:any) {
    this.imageList = [file.url]
    if (this.imageList.length > 0) {
      this.showViewer = true
    }
  }
  private handleRemove(key:any) {
    let that = this
    return (file:any, fileList:any[]) => {
      that.postForm[key] = ''
    }
  }
  private handleUpSuccess(key:any) {
    let that = this
    return (res:any) => {
      if (res.success) {
        that.postForm[key] = res.data.url
      } else {
        this.$message.error('上传图片错误：' + res)
      }
    }
  }
  private onSubmit() {
    let data = { ...this.postForm }
    if (!data.id) {
      delete data.id
    }
    this.isloading = true
    console.log(data)
    // savePhoto(data)
    //   .then((res) => {
    //     if (res.data.success) {
    //       this.$message.success('保存成功')
    //     } else {
    //       this.$message.error(res.data.errorMsg)
    //     }
    //   })
    //   .catch(() => {})
    //   .finally(() => {
    //     this.isloading = false
    //   })
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>
<style lang="scss" scoped>
.TakePicture{
  width: 100%;
  padding: 50px 100px;
  box-sizing: border-box;
  p{
    margin-bottom: 20px;
  }
  .picName{
    font-weight: bold;
    font-size: 18px;
    margin-right: 30px;
  }
  .picName_value{
    font-weight: bold;
    font-size: 16px;
  }
  .picInfo span{
    margin-right: 20px;
    font-size: 18px;
  }

    .hide{
    .el-upload--picture-card {
      display: none;
    }
  }
  .el-image{
    width: 148px;
    height: 148px;
  }
  .image-slot{
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
    text-align: center;
    // p{
    //   margin: 0;
    //   padding: 0;
    //   line-height: 18px;
    //   font-size: 14px;
    //   color: #333;
    // }
  }
}
</style>
<style lang="scss">
.TakePicture-m {
  width: 100%;
}
</style>
