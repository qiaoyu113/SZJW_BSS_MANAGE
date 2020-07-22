<template>
  <div id="down-tool">
    <svg-icon
      name="down"
      @click="downFile"
    />

    <Dialog
      :visible.sync="dialogTableVisible"
      title="下载工具"
      width="50%"
      :before-close="beforeClose"
      :show-cancel-button="false"
      :show-confirm-button="false"
      append-to-body
    >
      <el-table
        v-loading="listLoading"
        :data="tableData"
        border
        style="width: 100%;max-height: 600px;overflow-y: auto;"
      >
        <el-table-column
          type="expand"
        >
          <template slot-scope="props">
            <el-form
              class="tableForm"
              label-position="left"
              inline
            >
              <el-form-item label="文件名称:">
                <span>{{ props.row.fileName }}</span>
              </el-form-item>
              <el-form-item label="文件格式:">
                <span>{{ props.row.fileFormat }}</span>
              </el-form-item>
              <el-form-item label="文件类型:">
                <span>{{ props.row.fileType }}</span>
              </el-form-item>
              <el-form-item label="数据数量:">
                <span>{{ props.row.dataNum }}</span>
              </el-form-item>
              <el-form-item label="创建时间:">
                <span>{{ props.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="文件名称">
          <template slot-scope="scope">
            <span>{{ scope.row.fileName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 1:待处理 2:处理中 3:成功 4:失败 -->
            <el-button
              v-if="scope.row.status === 3"
              style="float: right;"
              type="primary"
              size="mini"
              plain
              @click="exportBtn(scope.row)"
            >
              下载
            </el-button>
            <el-button
              v-if="[1,2].includes(scope.row.status)"
              :loading="true"
              type="text"
              size="mini"
              plain
            >
              文件生成中
            </el-button>
            <el-button
              v-if="scope.row.status === 4"
              type="text"
              size="mini"
              plain
            >
              文件生成失败
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="page.total>0"
        operation-list="[]"
        :total="page.total"
        :page.sync="page.page"
        :limit.sync="page.limit"
        @pagination="handlePageSizeChange"
      />
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Dialog from '@/components/Dialog/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { GetDownFileList } from '@/api/common'
interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}
@Component({
  name: 'DownTool',
  components: {
    Dialog,
    Pagination
  }
})
export default class extends Vue {
  private dialogTableVisible:boolean = false // 下载工具弹框
  private tableData:any[] = [] // 下载工具表格数据
  private listLoading:boolean = false // 下载工具表格loading

  private times:number = 30
  /**
   *下载表格分页对象
   */
  private page:PageObj = {
    page: 1,
    limit: 20,
    total: 0
  }

  /**
   * 打开下载工具弹框
   */
  private downFile() {
    this.dialogTableVisible = true
    this.tableData = []
    this.getList()
  }
  /**
   *获取下载列表
   */
  async getList() {
    try {
      this.listLoading = true
      let params = {
        limit: this.page.limit,
        page: this.page.page
      }
      let { data: res } = await GetDownFileList(params)
      this.listLoading = false
      if (res.success) {
        this.tableData = res.data
        this.tableData = []
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      this.listLoading = false
      console.log(`get file list fail:${err}`)
    }
  }
  /**
   * 下载工具关闭弹框
   */
  beforeClose() {
    this.dialogTableVisible = false
  }
  /**
   * 下载表格分页
   */
  handlePageSizeChange(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }
  /**
   *导出文件
   */
  exportBtn(row:any) {
    this.$confirm('是否确认下载?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      if (this.times === 30) {
        var overTime = setInterval(() => {
          if (this.times > 1) {
            this.times = this.times - 1
          } else {
            this.times = 30
            clearInterval(overTime)
          }
        }, 1000)
        this.$message({
          type: 'success',
          message: '下载完成!'
        })
        this.download(row)
      } else {
        this.$message({
          message: '下载冷却时间还剩' + this.times + '秒',
          type: 'warning'
        })
      }
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消'
      })
    })
  }
  download(row:any) {
    if (!row.fileUrl) {
      return
    }
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = row.fileUrl
    link.setAttribute(`download`, `${row.fileType}${row.recordId}.xls`)
    document.body.appendChild(link)
    link.click()
  }
}
</script>

<style scoped>
  .tableForm >>>.el-form-item {
    margin-bottom: 10px;
    display: inline-flex;
    align-items: center;
  }
</style>
