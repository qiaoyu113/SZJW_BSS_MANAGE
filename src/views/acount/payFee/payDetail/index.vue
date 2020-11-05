<template>
  <div class="payDetail">
    <SectionContainer
      title="基础信息"
      :md="true"
    >
      <template v-slot:rightBox>
        <el-button
          :size="isPC ? 'small' : 'mini'"
          @click="() => {
            $router.go(-1)
          }"
        >
          返回
        </el-button>
      </template>
      <el-row>
        <el-col span="6">
          <DetailItem
            name="订单编号："
            :value="formData.orderId"
          />
        </el-col>
        <el-col span="6">
          <DetailItem
            name="司机姓名："
            :value="formData.driverName"
          />
        </el-col>
        <el-col span="6">
          <DetailItem
            name="司机编号："
            :value="formData.driverId"
          />
        </el-col>
        <el-col span="6">
          <DetailItem
            name="可提现金额："
            :value="formData.canExtractMoney"
          />
        </el-col>
        <el-col span="6">
          <DetailItem
            name="联系电话："
            :value="formData.phone"
          />
        </el-col>
        <el-col span="6">
          <DetailItem
            name="所属城市："
            :value="formData.workCityName"
          />
        </el-col>
        <el-col span="6">
          <DetailItem
            name="订单编号："
            :value="formData.orderId"
          />
        </el-col>
        <el-col span="6">
          <DetailItem
            name="加盟经理："
            :value="formData.gmName"
          />
        </el-col>
        <el-col span="6">
          <DetailItem
            name="是否开收据："
            :value="formData.isReceipt ? '是' : '否'"
          />
        </el-col>
        <el-col span="6">
          <DetailItem
            name="备注："
            :value="formData.remark"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <SectionContainer
      title="支付信息"
      :md="true"
    >
      <template>
        <el-table
          :data="tableData"
          style="width: 100%"
          show-summary
        >
          <el-table-column
            type="index"
            label="序号"
            width="100"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="payNumber"
            label="交易流水号"
            width="180"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="payDate"
            label="交易时间"
            width="180"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="payMoney"
            label="交易金额"
            width="180"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="payTypeName"
            label="支付方式"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="payPic"
            label="交易凭证"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="seePic(scope.row.payPic)"
              >
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </SectionContainer>

    <div
      v-if="routePage === 'payDetail'"
      class="checkStatus"
    >
      <span>审核状态：</span>
      <span>{{ formData.statusName }}</span>
    </div>

    <div
      v-if="routePage === 'payAudit'"
      class="btnBox"
    >
      <el-button @click="audit('reject')">
        审核未通过
      </el-button>
      <el-button
        type="primary"
        @click="audit('resolve')"
      >
        审核通过
      </el-button>
    </div>

    <el-image-viewer
      v-if="showViewer"
      :on-close="closePic"
      :url-list="[imageUrl]"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import DetailItem from '@/components/DetailItem/index.vue'
import { payDetail, payAudit } from '@/api/driver-account'
// 引入element-ui 大图预览的隐藏组件
import ElImageViewer from 'element-ui/packages/image/src/image-viewer.vue'
 @Component({
   name: 'payDetail',
   components: {
     DetailItem,
     SectionContainer,
     ElImageViewer
   }
 })
export default class extends Vue {
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  mounted() {
    this.routePage = (this.$route.name) as string
    this.id = (this.$route.query.id) as string
    this.getDetail(this.id)
  }

  private showViewer:boolean = false
  private imageUrl:string = ''
  private routePage:string = ''
  private id:string = ''
  private formData:any = {}
  private tableData:any[] = []

  private seePic(url:string) {
    this.showViewer = true
    this.imageUrl = url
  }
  private closePic() {
    this.imageUrl = ''
    this.showViewer = false
  }

  private async getDetail(id:string) {
    try {
      let params = {
        payId: id
      }
      let { data: res } = await payDetail(params)
      this.tableData = res.data.payInfo
      this.formData = res.data.baseInfo
    } catch (err) {
      console.log(err)
    }
  }

  private audit(type:string) {
    let text:string = ''
    if (type === 'resolve') {
      text = '确定要审核通过此退款信息?'
    } else {
      text = '确定要审核未通过并驳回此退款信息?'
    }
    this.$confirm(text, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.doAudit(type)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消'
      })
    })
  }

  private async doAudit(flag:string) {
    try {
      let param = {
        payId: this.id,
        flag: flag
      }
      let { data: res } = await payAudit(param)
      if (res.success) {
        if (flag === 'pass') {
          this.$message.success('审核通过成功')
        } else {
          this.$message.success('审核未通过成功')
        }
        this.$router.push({
          path: '/driveraccount/payFee'
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
}
</script>
<style lang="scss" scoped>
.payDetail{
  padding: 30px;
  box-sizing: border-box;
  .checkStatus{
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-left: 20px;
    margin-top: 30px;
    padding-bottom: 60px;
  }
  .btnBox{
    padding: 30px 30%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
