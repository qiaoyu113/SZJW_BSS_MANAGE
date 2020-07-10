/* eslint-disable vue/no-parsing-error */
/* eslint-disable vue/no-parsing-error */
<template>
  <div :class="isPC ? 'TakePicture' : 'TakePicture-m'">
    <el-row class="infoLine">
      <el-col :span="24">
        <p>
          <span class="picName">线路名称：</span>
          <span class="picName_value">李威山的线路</span>
        </p>
      </el-col>
      <el-col :span="24">
        <p
          v-if="isPC"
          class="picInfo"
        >
          <span>线路编号：</span>
          <span>XL2020031401</span>
          <span>所属销售：李威山</span>
          <span>创建时间：2016-12-12</span>
        </p>
        <div v-else>
          <el-col>
            <p class="picInfo">
              <span>线路编号：</span>
              <span>XL2020031401</span>
            </p>
          </el-col>
          <el-col>
            <p class="picInfo">
              <span>所属销售：李威山</span>
              <span>创建时间：2016-12-12</span>
            </p>
          </el-col>
        </div>
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
                        <i class="el-icon-picture-outline" />
                        <p>暂无图片</p>
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
                <el-col :span="isPC ? 8 : 24">
                  <el-form-item
                    label-width="150px"
                    label=""
                  >
                    <el-button
                      @click="showDio = true"
                    >
                      取消
                    </el-button>
                    <el-button
                      type="primary"
                      @click="onSubmit"
                    >
                      提交
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="imageList"
    />

    <Dialog
      :visible.sync="showDio"
      :title="`取消上传`"
      :center="true"
      :cancel="picCancel"
      :confirm="picConfirm"
    >
      <div>
        <div
          class="dioBox"
          v-text="`是否确认取消上传线路照片，点击<确认>，将取消本次上传？`"
        />
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts">
// 引入element-ui 大图预览的隐藏组件
import ElImageViewer from 'element-ui/packages/image/src/image-viewer.vue'
import Dialog from '@/components/Dialog/index.vue'
import { Vue, Component } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'
var token = localStorage.getItem('token')
@Component({
  name: 'TakePicture',
  components: {
    Dialog,
    ElImageViewer
  }
})
export default class TakePicture extends Vue {
  private isdetail:boolean = false
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
      label: '库房装货位置:',
      key: 'warehouseLoadingLocation',
      imageList: []
    },
    {
      label: '货物库摆放:',
      key: 'cargoPlacement',
      imageList: []
    },
    {
      label: '装车情况:',
      key: 'loadingSituation',
      imageList: []
    },
    {
      label: '配送地点实景:',
      key: 'distributionSite',
      imageList: []
    }
  ]
  private showDio:boolean = false
  private isloading:boolean = false
  private getImgUrls:string = this.getImgUrl()
  private imageList:any[] = []
  private showViewer:boolean = false
  private myHeaders:any = { Authorization: token }
  private getImgUrl() {
    let url
    if (window.location.host === 'localhost:9529') {
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
    console.log('tag', '')
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
  private closeViewer() {
    this.showViewer = false
  }
  private picCancel(done: any) {
    done()
  }
  private picConfirm(done: any) {
    this.showDio = false
    this.$router.go(-1)
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
  private getDetails(id:string) {
    // this.isloading = true;
    // getLineDetail({ lineId: id }).then(res:any => {
    //   if (res.data.success) {
    //     const data = res.data.data;
    //     this.postForm.lineName = data.lineName;
    this.getLinePhoto()
    //   } else {
    //     this.$message.error(res.data.errorMsg)
    //   }
    // }).catch(err => {
    //   console.log(err)
    // }).finally(() => {
    //   this.isloading = false;
    // })
  }
  private getLinePhoto() {
    // getLinePhoto({ lineId: this.postForm.lineId })
    //   .then((res) => {
    //     if (res.data.success) {
    //       const data = res.data.data;
    //       this.postForm.id = data.id || '';
    //       this.formList.map(item => {
    //         if (data && data[item.key]) {
    //           item.imageList = [{
    //             name: item.key,
    //             url: data[item.key]
    //           }];
    //           this.postForm[item.key] = data[item.key];
    //         }
    //         return item;
    //       });
    //     } else {
    //       this.$message.error(res.data.errorMsg)
    //     }
    //   }).catch(() => {

    //   });
  }

  created() {
    this.postForm.lineId = this.$route.query.id
    let routeArr = this.$route.path.split('/')
    if (routeArr[2] === 'takepicture') {
      console.log('上传图片')
    } else {
      this.isdetail = true
      this.getDetails(this.postForm.lineId)
      console.log('查看图片')
      this.postForm.cargoPlacement = 'cargoPlacement'
      this.formList[1].imageList.push({
        url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
      })
    }
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
  .el-image{
    width: 148px;
    height: 148px;
  }

}
</style>
<style lang="scss" scoped>
.TakePicture-m {
  width: 100%;
  .infoLine{
    p{
      font-size: 12px;
      padding: 0px 60px;
      box-sizing: border-box;
    }
  }
      .hide{
    .el-upload--picture-card {
      display: none;
    }
  }
  .el-image{
    width: 90px;
    height: 90px;
  }
}
</style>
<style scoped>
    .hide >>> .el-upload--picture-card {
      display: none;
    }

.TakePicture >>> .el-dialog{
  width: 500px!important;
}
    .TakePicture >>>  .image-slot{
    width: 100%;
    height: 100%;
    border:1px dashed #c0ccda ;
    font-size: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
    text-align: center;
    }
        .TakePicture-m >>>  .image-slot{
    width: 100%;
    height: 100%;
    border:1px dashed #c0ccda ;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
    text-align: center;
    }
</style>
