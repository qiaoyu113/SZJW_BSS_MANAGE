<template>
  <div :class="isPC ? 'ImportClue' : 'ImportClue-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-date="handleDate"
      @handle-query="handleQuery"
    >
      <ImportListForm
        :list-query="listQuery"
        :date-value="DateValue"
        @handle-tags="handleTags"
        @handle-query="handleSearch"
      />
    </SuggestContainer>
    <div class="table_box">
      <!--操作栏-->
      <TableHeader
        :tab="tab"
        :active-name="listQuery.state"
      >
        <el-upload
          ref="upload"
          :http-request="customUpload"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :file-list="fileList"
          :auto-upload="true"
          :multiple="false"
          :accept="'.xlsx'"
          class="upload-demo"
          action="/line/gmv/importFile"
          :show-file-list="false"
        >
          <el-button
            slot="trigger"
            type="primary"
            size="mini"
            :class="isPC ? 'btn-item' : 'btn-item-m'"
          >
            <i class="el-icon-upload2" />
            <span v-if="isPC">线索模板导入</span>
          </el-button>
        </el-upload>

        <el-button
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          size="mini"
          @click="downLoad(0)"
        >
          <i class="el-icon-download" />
          <span v-if="isPC">线索模板下载</span>
        </el-button>
        <el-button
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          size="mini"
          @click="downLoad(1)"
        >
          <i class="el-icon-download" />
          <span v-if="isPC">线索模板说明</span>
        </el-button>
        <el-dropdown
          :hide-on-click="false"
          trigger="click"
        >
          <el-button
            :class="isPC ? 'btn-item-filtrate' : 'btn-item-filtrate-m'"
            size="mini"
            type="primary"
          >
            <i class="el-icon-s-operation" />
            <span v-if="isPC">筛选</span>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-checkbox-group v-model="checkList">
              <el-dropdown-item
                v-for="item in dropdownList"
                :key="item"
              >
                <el-checkbox :label="item" />
              </el-dropdown-item>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </TableHeader>
      <!--table表单-->
      <div class="table_center">
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="list"
          :row-style="{height: '20px'}"
          :cell-style="{padding: '5px 0'}"
          size="mini"
          :max-height="tableHeight"
          fit
          :border="isPC"
          stripe
          highlight-current-row
          style="width: 100%"
          align="left"
          row-key="id"
        >
          <el-table-column
            :key="checkList.length + 'index'"
            type="index"
            width="55"
            label="序号"
            :index="indexMethod"
            align="center"
            fixed
          />
          <el-table-column
            v-if="checkList.includes('导入日期')"
            :key="checkList.length + 'date'"
            prop="date"
            label="导入日期"
          >
            <template slot-scope="{row}">
              {{ row.createDate | Timestamp }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.includes('文档名称')"
            :key="checkList.length + 'fileName'"
            prop="fileName"
            label="文档名称"
          >
            <template slot-scope="{row}">
              <el-link
                :underline="false"
                type="primary"
                @click="goDetails(row.importId)"
              >
                {{ row.fileName }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.includes('导入结果')"
            :key="checkList.length + 'center'"
            label="导入结果"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag
                v-if="row.importState === 1"
                :disable-transitions="false"
                type="success"
                size="mini"
              >
                成功
              </el-tag>
              <el-tag
                v-if="row.importState === 2"
                :disable-transitions="false"
                type="info"
                size="mini"
              >
                导入中
              </el-tag>
              <el-tag
                v-if="row.importState === 0"
                :disable-transitions="false"
                type="danger"
                size="mini"
              >
                失败
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.includes('线索总数')"
            :key="checkList.length + 'clueNo'"
            prop="clueNo"
            label="线索总数"
          />
          <el-table-column
            v-if="checkList.includes('失败记录数')"
            :key="checkList.length + 'failureNo'"
            prop="failureNo"
            label="失败记录数"
          />
          <el-table-column
            v-if="checkList.includes('检测错误数')"
            :key="checkList.length + 'errorNo'"
            prop="errorNo"
            label="检测错误数"
          />
        </el-table>
      </div>
      <pagination
        v-show="total > 0"
        :operation-list="[]"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { ImportListForm } from './components'
import TableHeader from '@/components/TableHeader/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { HandlePages } from '@/utils/index'
import { importInfoList, fileUpload } from '@/api/cargo'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'ImportClue',
  components: {
    SuggestContainer,
    ImportListForm,
    TableHeader,
    Pagination
  }
})
export default class extends Vue {
  private tags: any[] = [];
  private tab: any[] = [
    {
      label: '全部',
      name: '',
      num: ''
    }
  ];
  private DateValue: any[] = [];
  private listQuery: IState = {
    page: 1,
    limit: 30,
    endDate: '',
    startDate: ''
  };
  private dropdownList: any[] = [
    '导入日期',
    '文档名称',
    '导入结果',
    '线索总数',
    '失败记录数',
    '检测错误数'
  ];
  private downlist: any[] = [
    `https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/line_clue/货主线索导入模板.xlsx`,
    `https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/line_clue/线索模板说明.xls`
  ];

  private checkList: any[] = this.dropdownList;
  // table
  private total = 0;
  private list: any[] = [];
  private page: Object | undefined = '';
  private listLoading = false;

  // 导入
  private fileList: any[] = []
  // Watch
  @Watch('checkList', { deep: true })
  private onval(value: any) {
    this.$nextTick(() => {
      ((this.$refs['multipleTable']) as any).doLayout()
    })
  }
  // 计算属性
  get isPC() {
    return SettingsModule.isPC
  }
  get tableHeight() {
    return SettingsModule.tableHeight
  }
  // 事件处理
  // 导入
  private handleRemove(file: any, fileList: any) {
    this.fileList = fileList
  }
  private customUpload(param: any) {
    // 自定义上传
    const formData = new FormData()
    formData.append('file', param.file)
    fileUpload(formData).then(({ data } : any) => {
      if (data.success) {
        this.$message.success('上传成功')
      } else {
        this.$message({
          showClose: true,
          duration: 0,
          message: data.errorMsg,
          type: 'error'
        })
      }
    })
  }
  private handleChange(file: any, fileList: any) {
    this.fileList = fileList.slice(-3)
  }
  // 处理tags方法
  private handleTags(value: any) {
    this.tags = value
  }
  // 所有请求方法
  private fetchData() {
    this.getList(this.listQuery)
  }
  // search
  private handleSearch() {
    this.getList(this.listQuery)
  }
  // 处理query方法
  private handleQuery(value: any, key: any) {
    this.listQuery[key] = value
    if (key === 'startDate') {
      return
    }
    this.fetchData()
  }
  // 处理选择日期方法
  private handleDate(value: any) {
    this.DateValue = value
  }
  // downLoad
  private downLoad(key: number) {
    window.open(this.downlist[key])
  }
  // 请求列表
  private async getList(value: any) {
    this.listQuery.page = value.page
    this.listQuery.limit = value.limit
    this.listLoading = true
    const { data } = await importInfoList(this.listQuery)
    if (data.success) {
      this.list = data.data.list
      const page = {
        limit: data.data.pageSize,
        page: data.data.pageNum,
        total: data.data.total
      }
      data.page = await HandlePages(page)
      this.total = page.total
      this.tab[0].num = page.total
    } else {
      this.$message.error(data)
    }
    setTimeout(() => {
      const el = document.querySelector(
        '.el-table .el-table__body-wrapper'
      ) as HTMLElement
      el.scroll(0, 0)
      this.listLoading = false
    }, 0.5 * 1000)
  }
  // table index
  private indexMethod(index: number) {
    let { page, limit } = this.listQuery
    return index + 1 + (page - 1) * limit
  }
  private goDetails(id: any) {
    this.$router.push({ name: 'ImportDetail', query: { id: id } })
  }
  activated() {
    this.$nextTick(() => {
      ((this.$refs['multipleTable']) as any).doLayout()
    })
  }
  mounted() {
    this.fetchData()
  }
}
</script>
<style lang="scss" scoped>
.ImportClue {
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  .table_box {
    background: #ffffff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      padding: 0 30px;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
    }
  }
}
.btn-item,
.btn-item-m {
  margin: 0 10px;
}
.btn-item-filtrate,
.btn-item-filtrate-m {
  background-color: $assist-btn;
  border-color: $assist-btn;
}
.ImportClue-m {
  padding-bottom: 0;
  box-sizing: border-box;
  .table_box {
    background: #ffffff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
    }
  }
}
</style>
<style scoped>
.ImportClue >>> .TableHeader_title,
.ImportClue-m >>> .TableHeader_title {
  display: none;
}
.ImportClue >>> .TableHeader_button,
.ImportClue-m >>> .TableHeader_button{
  flex: 1
}
.upload-demo{
  display: inline-block;
}
</style>
