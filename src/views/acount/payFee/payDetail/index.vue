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
        <el-col>
          <DetailItem
            name="订单编号："
            value="李威山"
            row="true"
          />
        </el-col>
        <el-col>
          <DetailItem
            name="司机姓名："
            value="李威山"
            row="true"
          />
        </el-col>
        <el-col>
          <DetailItem
            name="司机编号："
            value="李威山"
            row="true"
          />
        </el-col>
        <el-col>
          <DetailItem
            name="可提现金额："
            value="李威山"
            row="true"
          />
        </el-col>
        <el-col>
          <DetailItem
            name="联系电话："
            value="李威山"
            row="true"
          />
        </el-col>
        <el-col>
          <DetailItem
            name="所属城市："
            value="李威山"
            row="true"
          />
        </el-col>
        <el-col>
          <DetailItem
            name="订单编号："
            value="李威山"
            row="true"
          />
        </el-col>
        <el-col>
          <DetailItem
            name="加盟经理："
            value="李威山"
            row="true"
          />
        </el-col>
        <el-col>
          <DetailItem
            name="是否开收据："
            value="李威山"
            row="true"
          />
        </el-col>
        <el-col>
          <DetailItem
            name="备注："
            value="李威山"
            row="true"
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
          />
          <el-table-column
            prop="payNumber"
            label="交易流水号"
            width="180"
          />
          <el-table-column
            prop="payDate"
            label="交易时间"
            width="180"
          />
          <el-table-column
            prop="payMoney"
            label="交易金额"
            width="180"
          />
          <el-table-column
            prop="payType"
            label="支付方式"
          />
          <el-table-column
            prop="payPic"
            label="交易凭证"
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
      <span>审核通过</span>
    </div>

    <div
      v-if="routePage === 'payAudit'"
      class="btnBox"
    >
      <el-button @click="reject">
        审核未通过
      </el-button>
      <el-button
        type="primary"
        @click="resolve"
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
  }

  private showViewer:boolean = false
  private imageUrl:string = ''
  private routePage:string = ''
  private id:string = ''
  private tableData:any[] = [{
    payDate: '2016-05-02',
    payNumber: '王小虎',
    payMoney: '200333',
    payType: '上海市普陀区金沙江路 1518 弄',
    payPic: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
  }, {
    payDate: '2016-05-04',
    payNumber: '王小虎',
    payMoney: '200333',
    payType: '上海市普陀区金沙江路 1517 弄',
    payPic: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
  }, {
    payDate: '2016-05-01',
    payNumber: '王小虎',
    payMoney: '200333',
    payType: '上海市普陀区金沙江路 1519 弄',
    payPic: '家'
  }, {
    payDate: '2016-05-03',
    payNumber: '王小虎',
    payMoney: '200333',
    payType: '上海市普陀区金沙江路 1516 弄',
    payPic: '公司'
  }]

  private seePic(url:string) {
    this.showViewer = true
    this.imageUrl = url
  }
  private closePic() {
    this.imageUrl = ''
    this.showViewer = false
  }

  private reject() {
    this.$confirm('确定要审核未通过并驳回此退款信息?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.$message.success('审核未通过成功')
      this.$router.push({
        path: '/driveraccount/payFee'
      })
      console.log(this.id, 'resolve')
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消'
      })
    })
  }

  private resolve() {
    this.$confirm('确定要审核通过此退款信息?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.$message.success('审核通过成功')
      this.$router.push({
        path: '/driveraccount/payFee'
      })
      console.log(this.id, 'resolve')
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消'
      })
    })
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
