<template>
  <div :class="isPC ? 'TakePicture' : 'TakePicture-m'">
    <el-row class="infoLine">
      <el-col :span="24">
        <p>
          <span class="picName">线路名称：</span>
          <span class="picName_value">{{ postForm.lineName | DataIsNull }}</span>
        </p>
      </el-col>
      <el-col :span="24">
        <p
          v-if="isPC"
          class="picInfo"
        >
          <span>线路编号:</span>
          <span>{{ postForm.lineId | DataIsNull }}</span>
          <span>所属销售:{{ postForm.lineSaleName | DataIsNull }}</span>
          <span>创建时间:{{ postForm.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </p>
        <div v-else>
          <el-col>
            <p class="picInfo">
              <span>线路编号:</span>
              <span>{{ postForm.lineId | DataIsNull }}</span>
            </p>
          </el-col>
          <el-col>
            <p class="picInfo">
              <span>所属销售:{{ postForm.lineSaleName | DataIsNull }}</span>
              <span>创建时间:{{ postForm.createDate | DataIsNull }}</span>
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
                      :on-remove="handleRemove(item)"
                      :on-success="handleUpSuccess(item)"
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
import { pictureDetail, SaveOrUpdatePicture } from '@/api/cargo'
import { UserModule } from '@/store/modules/user'
@Component({
  name: 'TakePicture',
  components: {
    Dialog,
    ElImageViewer
  }
})
export default class TakePicture extends Vue {
  private isdetail:boolean = false
  private info:any = {}
  private postForm:any = {
    id: '',
    lineId: '',
    lineName: '',
    lineSaleName: '',
    createDate: '',
    warehouseLoadingLocationUrl: '',
    cargoPlacementUrl: '',
    loadingSituationUrl: '',
    distributionSiteUrl: ''
  }
  private formList:any = [
    {
      label: '库房装货位置:',
      key: 'warehouseLoadingLocationUrl',
      imageList: []
    },
    {
      label: '货物库摆放:',
      key: 'cargoPlacementUrl',
      imageList: []
    },
    {
      label: '装车情况:',
      key: 'loadingSituationUrl',
      imageList: []
    },
    {
      label: '配送地点实景:',
      key: 'distributionSiteUrl',
      imageList: []
    }
  ]
  private showDio:boolean = false
  private isloading:boolean = false
  private getImgUrls:string = this.getImgUrl()
  private imageList:any[] = []
  private showViewer:boolean = false
  private myHeaders:any = { Authorization: UserModule.token }

  mounted() {
    this.postForm.lineId = this.$route.query.id
    let routeArr = this.$route.path.split('/')
    if (routeArr[2] === 'showpicture') {
      this.isdetail = true
      this.getDetails()
    } else {
      this.isdetail = false
      this.info = JSON.parse((this.$route.query.info) as any)
      this.postForm = { ...this.info }
    }
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
  private handleRemove(item:any) {
    let that = this
    return (file:any, fileList:any[]) => {
      that.postForm[item.key] = ''
      item.imageList = []
    }
  }
  /**
   * 上传成功
   */
  private handleUpSuccess(item:any) {
    let that = this
    return (res:any) => {
      if (res.success) {
        that.postForm[item.key] = res.data.url
        item.imageList.push({ url: res.data.url, name: res.data.name })
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
  private picCancel(done: any) {
    done()
  }
  private picConfirm(done: any) {
    this.showDio = false
    this.$router.go(-1)
  }
  /**
   *提交
   */
  private async onSubmit() {
    this.isloading = true
    try {
      let params = {
        id: this.postForm.id,
        cargoPlacementUrl: this.postForm.cargoPlacementUrl,
        distributionSiteUrl: this.postForm.distributionSiteUrl,
        loadingSituationUrl: this.postForm.loadingSituationUrl,
        warehouseLoadingLocationUrl: this.postForm.warehouseLoadingLocationUrl
      }
      let { data: res } = await SaveOrUpdatePicture(params)
      this.isloading = false
      if (res.success) {
        this.$message.success('保存成功')
        this.$router.go(-1)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      this.isloading = false
      console.log(`save fail:${err}`)
    }
  }
  /**
   * 获取详情
   */
  private async getDetails() {
    try {
      this.isloading = true
      let params = {
        lineId: this.postForm.lineId
      }
      let { data: res } = await pictureDetail(params)
      this.isloading = false
      if (res.success) {
        this.postForm = { ...this.postForm, ...res.data }
        this.formList.forEach((item:any) => {
          if (res.data[item.key]) {
            item.imageList = [{
              name: item.key,
              url: res.data[item.key]
            }]
          }
        })
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      this.isloading = false
      console.log(`get detail fail:${err}`)
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
