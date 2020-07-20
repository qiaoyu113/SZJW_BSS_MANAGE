<template>
  <div
    v-loading="listLoading"
    :class="isPC ? 'ImportDetail' : 'ImportDetail-m'"
  >
    <SectionContainer
      title="导入详情"
      :md="true"
    >
      <el-row>
        <el-col :span="isPC ? 8 : 24">
          <DetailItem
            name="文档名称"
            :value="details.fileName"
          />
        </el-col>
        <el-col :span="isPC ? 8 : 24">
          <DetailItem
            name="导入日期"
            :value="details.createDate | Timestamp"
          />
        </el-col>
        <el-col :span="isPC ? 8 : 24">
          <DetailItem
            name="导入结果"
            :value="importStateList[details.importState]"
          />
        </el-col>
        <el-col :span="isPC ? 8 : 24">
          <DetailItem
            name="线索总数"
            :value="details.clueNo"
          />
        </el-col>
        <el-col :span="isPC ? 8 : 24">
          <DetailItem
            name="失败记录条数"
            :value="details.failureNo"
          />
        </el-col>
        <el-col :span="isPC ? 8 : 24">
          <DetailItem
            name="检测错误数"
            :value="details.errorNo"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <SectionContainer
      title="错误记录"
      :md="true"
    >
      <div class="table_box">
        <!--table表单-->
        <div class="table_center">
          <el-table
            ref="multipleTable"
            :data="list"
            :row-style="{height: '20px'}"
            :cell-style="{padding: '5px 0'}"
            size="mini"
            fit
            :border="isPC"
            stripe
            highlight-current-row
            style="width: 100%"
            align="left"
            row-key="id"
          >
            <el-table-column
              :key="checkList.length+ 'index'"
              type="index"
              width="55"
              label="序号"
              :index="indexMethod"
              align="center"
              fixed
            />
            <el-table-column
              v-if="checkList.includes('行数')"
              label="行数"
            >
              <template slot-scope="{row}">
                {{ `第${row.errorInRows}行` }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="checkList.includes('错误描述')"
              prop="errorDescribe"
              label="文档名称"
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
    </SectionContainer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import TableHeader from '@/components/TableHeader/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { importDetailList } from '@/api/cargo'
import { HandlePages } from '@/utils/index'

import '@/styles/common.scss'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'ImportDetail',
  components: {
    DetailItem,
    SectionContainer,
    TableHeader,
    Pagination
  }
})
export default class extends Vue {
  private id: any = ''
  private details: any = {}
  private tab: any[] = [];
  private listQuery: IState = {
    importId: '',
    page: 1,
    limit: 30
  };
  private importStateList: any[] = ['失败', '成功', '导入中']
  // table
  private total = 0;
  private list: any[] = [];
  private page: Object | undefined = '';
  private listLoading = false;
  private dropdownList: any[] = [
    '行数',
    '错误描述'
  ];
  private checkList: any[] = this.dropdownList;
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  // table index
  private indexMethod(index: number) {
    let { page, limit } = this.listQuery
    return index + 1 + (page - 1) * limit
  }

  // 获取列表
  private async getList(value: any) {
    this.listQuery.page = value.page
    this.listQuery.limit = value.limit
    this.listLoading = true
    const { data } = await importDetailList(this.listQuery)
    if (data.success) {
      const { pageDefailPages, lineClueImportInfoVO } = data.data
      this.list = pageDefailPages.list
      this.details = lineClueImportInfoVO
      const page = {
        limit: pageDefailPages.pageSize,
        page: pageDefailPages.pageNum,
        total: pageDefailPages.total
      }
      data.page = await HandlePages(page)
      this.total = page.total
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
  mounted() {
    this.id = this.$route.query.id
    this.listQuery.importId = this.id
    this.getList(this.listQuery)
  }
}
</script>

<style lang="scss" scoped>
.ImportDetail {
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  // .table_box {
  //   height: calc(100vh - 183px) !important;
  //   background: #ffffff;
  //   box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
  //   overflow: hidden;
  //   transform: translateZ(0);
  //   .table_center {
  //     height: calc(100vh - 300px) !important;
  //     padding-bottom: 0;
  //     box-sizing: border-box;
  //     background: #ffffff;
  //   }
  // }
}
.btn-item-filtrate,
.btn-item-filtrate-m {
  background-color: $assist-btn;
  border-color: $assist-btn;
}
</style>
