<template>
  <div :class="isPC ? 'ClueList' : 'ClueList-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-date="handleDate"
      @handle-query="handleQuery"
    >
      <ClueListForm
        :list-query="listQuery"
        :date-value="DateValue"
        @handle-tags="handleTags"
      />
    </SuggestContainer>
    <div class="table_box">
      <!--操作栏-->
      <TableHeader
        :tab="tab"
        :active-name="listQuery.state"
      >
        <el-button
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          type="primary"
          name="cluelist_creat_btn"
          @click="createClue"
        >
          <i class="el-icon-s-operation" />
          <span v-if="isPC">新增线索</span>
        </el-button>
        <el-button
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          type="primary"
          name="cluelist_creat_btn"
          @click="goImport"
        >
          <i class="el-icon-s-operation" />
          <span v-if="isPC">导入</span>
        </el-button>

        <el-dropdown
          :hide-on-click="false"
          trigger="click"
        >
          <el-button
            :class="isPC ? 'btn-item-filtrate' : 'btn-item-filtrate-m'"
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
          :height="'100%'"
          fit
          :border="isPC"
          stripe
          highlight-current-row
          style="width: 100%"
          align="left"
          row-key="id"
          @cell-click="tableClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            reserve-selection
            align="center"
          />
          <el-table-column
            :key="Math.random()"
            type="index"
            width="55"
            label="序号"
            :index="indexMethod('listQuery')"
            align="center"
            fixed
          />
          <el-table-column
            v-if="checkList.indexOf('线索编号') > -1"
            label="线索编号"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.customerId }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('分配状态') > -1"
            label="分配状态"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.customerName }} （{{ scope.row.cityName }})</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('销售') > -1"
            class-name="status-col"
            label="销售"
          >
            <template slot-scope="{row}">
              <el-tag :type="row.status | articleStatusFilter">
                {{ row.primaryClassificationName
                }}<span
                  v-if="row.secondaryClassificationName"
                >/{{ row.secondaryClassificationName }}</span>
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('线索状态') > -1"
            label="线索状态"
          >
            <template slot-scope="{row}">
              {{ row.contractEffectiveness }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('线索来源') > -1"
            label="线索来源"
          >
            <template slot-scope="scope">
              <p>{{ scope.row.createDate | Timestamp }}</p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('城市') > -1"
            label="城市"
          >
            <template slot-scope="scope">
              <p>
                <span
                  v-if="scope.row.creatorName"
                >({{ scope.row.creatorName }})</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('公司') > -1"
            label="公司"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.contractEnd | Timestamp }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('姓名') > -1"
            label="姓名"
          >
            <template slot-scope="{row}">
              {{ row.lineSaleName | DataIsNull }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.indexOf('手机号') > -1"
            label="手机号"
          >
            <template slot-scope="{row}">
              {{ row.lineSaleName | DataIsNull }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.indexOf('职务') > -1"
            label="职务"
          >
            <template slot-scope="{row}">
              {{ row.lineSaleName | DataIsNull }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.indexOf('创建日期') > -1"
            label="创建日期"
          >
            <template slot-scope="{row}">
              {{ row.lineSaleName | DataIsNull }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.indexOf('更新日期') > -1"
            label="更新日期"
          >
            <template slot-scope="{row}">
              {{ row.lineSaleName | DataIsNull }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.indexOf('备注') > -1"
            label="备注"
          >
            <template slot-scope="{row}">
              {{ row.lineSaleName | DataIsNull }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.indexOf('姓名') > -1"
            label="姓名"
          >
            <template slot-scope="{row}">
              {{ row.lineSaleName | DataIsNull }}
            </template>
          </el-table-column>
          <el-table-column
            :key="Math.random()"
            label="操作"
            fixed="right"
            :width="isPC ? 'auto' : '50'"
          >
            <template slot-scope="scope">
              <el-dropdown>
                <span
                  v-if="isPC"
                  class="el-dropdown-link"
                >
                  更多操作<i
                    v-if="isPC"
                    class="el-icon-arrow-down el-icon--right"
                  />
                </span>
                <span
                  v-else
                  style="font-size: 18px;"
                  class="el-dropdown-link"
                >
                  <i class="el-icon-setting el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="goDetail(scope.row.customerNo)"
                  >
                    详情
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="goFollow(scope.row.customerNo)"
                  >
                    跟进
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="goConversion(scope.row.customerNo)"
                  >
                    转化
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="goEdit(scope.row.customerNo)"
                  >
                    编辑
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total > 0"
        :operation-list="operationList"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
        @olclick="olClicks"
      />
    </div>
    <!-- 提示信息 -->
    <Dialog
      :visible.sync="showMessage"
      :title="messageBox.title"
    >
      <p>{{ messageBox.message }}</p>
    </Dialog>
    <!-- 批量分配线索 -->
    <Dialog
      :visible.sync="showDialog"
      :title="`批量分配线索`"
      :confirm="confirm"
    >
      <el-alert
        class="mb10"
        :title="`已选线索${multipleSelection.length}条，请选择销售`"
        type="warning"
        :closable="false"
      />
      <el-table
        v-loading="dialogLoading"
        :data="dialogList"
        size="mini"
        stripe
        highlight-current-row
        height="38vh"
        style="width: 100%;"
        align="left"
        row-key="id"
        @selection-change="handleSelectionDialog"
      >
        <el-table-column
          type="selection"
          width="55"
          reserve-selection
          align="center"
        />
        <el-table-column
          type="index"
          width="55"
          label="序号"
          :index="indexMethod('dialogListQuery')"
          align="center"
        />
        <el-table-column
          label="销售姓名"
          prop="name"
        />
        <el-table-column
          label="联系电话"
          prop="name"
        />
        <el-table-column
          label="线索数量"
          prop="name"
        />
      </el-table>
      <pagination
        v-show="dialogTotal > 0"
        :small="true"
        :operation-list="[]"
        :total="dialogTotal"
        :page.sync="dialogListQuery.page"
        :limit.sync="dialogListQuery.limit"
        @pagination="getDialogList"
      />
    </Dialog>
    <!-- 右侧侧边栏 -->
    <PitchBox
      :drawer.sync="drawer"
      :drawer-list="multipleSelection"
      @deletDrawerList="deletDrawerList"
      @changeDrawer="changeDrawer"
    >
      <template slot-scope="{item}">
        <span>{{ item.customerName }}</span>
        <span>{{ item.customerName }}</span>
        <span>{{ item.customerName }}</span>
      </template>
    </PitchBox>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import SuggestContainer from '@/components/SuggestContainer/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'
import SelfTable from '@/components/base/SelfTable.vue'
import { ClueListForm } from './components'
import TableHeader from '@/components/TableHeader/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import PitchBox from '@/components/PitchBox/index.vue'

import { GetCustomerList } from '@/api/customer'
import { CargoListData } from '@/api/types'
import { HandlePages } from '@/utils/index'

import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}
@Component({
  name: 'ClueList',
  components: {
    SuggestContainer,
    SelfTable,
    ClueListForm,
    TableHeader,
    Pagination,
    Dialog,
    PitchBox
  }
})
export default class extends Vue {
  private tags: any[] = [];
  private tab: any[] = [
    {
      label: '待跟进',
      name: '0',
      num: 187
    },
    {
      label: '跟进中',
      name: '1',
      num: 1
    },
    {
      label: '已面试',
      name: '2'
    },
    {
      label: '已面试',
      name: '3'
    },
    {
      label: '已面试',
      name: '4'
    },
    {
      label: '已面试',
      name: '5'
    }
  ];

  private DateValue: any[] = [];
  private listQuery: IState = {
    key: '',
    city: '',
    page: 1,
    limit: 30,
    endDate: '',
    startDate: '',
    state: '',
    lineSaleId: ''
  };

  private dropdownList: any[] = [
    '线索编号',
    '分配状态',
    '销售',
    '线索状态',
    '线索来源',
    '城市',
    '公司',
    '姓名',
    '手机号',
    '职务',
    '创建日期',
    '更新日期',
    '备注'
  ];
  private checkList: any[] = this.dropdownList;

  // table
  private total = 0;
  private list: CargoListData[] = [];
  private page: Object | undefined = '';
  private listLoading = true;
  private multipleSelection: any[] = [];
  // 分页
  private operationList: any[] = [
    { icon: 'el-icon-finished', name: '查看选中', color: '#F2A33A', key: 1 },
    { icon: 'el-icon-thumb', name: '分配线索', color: '#5E7BBB', key: 2 },
    { icon: 'el-icon-circle-close', name: '清空选择', color: '#F56C6C', key: 3 }
  ];
  // message 提示
  private showMessage: boolean = false;
  private messageBox: IState = {
    title: '',
    message: ''
  };
  // 弹窗
  private dialogLoading: boolean = false;
  private showDialog: boolean = false;
  private multipleSelectionDialog: any[] = [];
  private dialogList: any[] = [];
  // 弹窗分页
  private dialogTotal: number = 0;
  private dialogListQuery: IState = {
    page: 1,
    limit: 10
  };
  // 侧边栏
  private drawer: boolean = false;

  // 计算属性
  get isPC() {
    return SettingsModule.isPC
  }
  // 事件处理
  // 处理tags方法
  private handleTags(value: any) {
    this.tags = value
  }
  // 所有请求方法
  private fetchData() {
    this.getList(this.listQuery)
  }
  // 处理query方法
  private handleQuery(value: any, key: any) {
    this.listQuery[key] = value
    this.fetchData()
  }
  // 处理选择日期方法
  private handleDate(value: any) {
    // this.DateValue = value
  }
  // button
  // 添加明细原因 row 当前行 column 当前列
  private tableClick(row: any, column: any, cell: any, event: any) {
    // switch (column.label) {
    //   case '原因说明':
    //     this.tabClickIndex = row.index
    //     this.tabClickLabel = column.label
    //     break
    //   case '判责金额(元)':
    //     this.tabClickIndex = row.index
    //     this.tabClickLabel = column.label
    //     break
    //   case '备注':
    //     this.tabClickIndex = row.index
    //     this.tabClickLabel = column.label
    //     break
    //   default: return
    // }
    // console.log('添加明细原因', row, column, cell, event)
  }
  // 选中
  private handleSelectionChange(val: any) {
    this.multipleSelection = val
  }
  // 请求列表
  private async getList(value: any) {
    this.listQuery.page = value.page
    this.listQuery.limit = value.limit
    this.listLoading = true
    const { data } = await GetCustomerList(this.listQuery)
    if (data.success) {
      this.list = data.data
      data.page = await HandlePages(data.page)
      this.total = data.page.total
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

  // 按钮操作
  // 详情
  private goDetail(id: string | (string | null)[] | null | undefined) {
    this.$router.push({ name: 'ClueDetail', query: { id: id } })
  }
  // 编辑
  private goEdit(id: string | (string | null)[] | null | undefined) {
    this.$router.push({ name: 'EditClue', query: { id: id } })
  }
  // 跟进
  private goFollow(id: string | (string | null)[] | null | undefined) {
    this.$router.push({ name: 'FollowClue', query: { id: id } })
  }
  // 转化
  private goConversion(id: string | (string | null)[] | null | undefined) {
    this.$router.push({ name: 'ConversionClue', query: { id: id } })
  }
  // 导入
  private goImport(id: string | (string | null)[] | null | undefined) {
    this.$router.push({ name: 'ImportClue', query: { id: id } })
  }

  // 新增线索
  private createClue() {
    this.$router.push({ name: 'AddClue' })
  }
  // 批量操作
  private olClicks(item: any) {
    const key: number = item.key
    if (this.multipleSelection.length === 0) {
      this.$message.warning(`请先选择线索`)
      return
    }
    switch (key) {
      case 1: // 查看选中
        this.drawer = true
        break
      case 2: // 批量分配线索
        if (key === 2) {
          this.messageBox.title = '提示'
          this.messageBox.message = '已选线索中包含已分配状态线索3条，请确认要对这些线索重新分配！'
          this.showMessage = true
        }
        this.showDialog = true
        this.$nextTick(() => {
          this.getDialogList(this.dialogListQuery)
        })
        break
      case 3: // 取消选中
        this.$confirm('确认清空所有选择吗？', '确认清空', {
          type: 'warning'
        }).then(() => {
          (this.$refs.multipleTable as any).clearSelection()
          this.multipleSelection = []
        }).catch(() => {})
        break
      default:
        break
    }
  }

  // table index
  private indexMethod(type: string) {
    let page: number, limit: number
    if (type === 'listQuery') {
      ({ page, limit } = this.listQuery)
    } else if (type === 'dialogListQuery') {
      ({ page, limit } = this.listQuery)
    }
    return (index: number) => {
      return index + 1 + (page - 1) * limit
    }
  }
  // 弹窗操作
  private confirm(done: any) {
    // 提交操作
    console.log(111)
  }
  // 弹窗表格选中
  private handleSelectionDialog(val: any) {
    this.multipleSelectionDialog = val
  }
  // 确认清除
  // private confirm(done:any) {
  //   (this.$refs.multipleTable as any).clearSelection()
  //   this.multipleSelection = []
  //   done()
  // }
  // 获取弹窗list
  async getDialogList(value: any) {
    this.dialogListQuery.page = value.page
    this.dialogListQuery.limit = value.limit
    this.dialogLoading = true
    const { data } = await GetCustomerList(this.dialogListQuery)
    if (data.success) {
      this.dialogList = data.data
      this.dialogTotal = data.page.total
    } else {
      this.$message.error(data)
    }
    setTimeout(() => {
      this.dialogLoading = false
    }, 0.5 * 1000)
  }
  // 侧边栏
  // 删除选中项目
  private deletDrawerList(item: any, i: any) {
    (this.$refs.multipleTable as any).toggleRowSelection(item, false)
    this.multipleSelection.splice(i, 1)
  }
  // 关闭查看已选
  private changeDrawer(val: any) {
    this.drawer = val
  }

  created() {
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped>
.ClueList {
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  .table_box {
    height: calc(100vh - 225px) !important;
    background: #ffffff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      height: calc(100vh - 360px) !important;
      padding: 30px;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
    }
  }
}
</style>

<style lang="scss" scoped>
.ClueList-m {
  padding-bottom: 0;
  box-sizing: border-box;
  .table_box {
    height: calc(100vh - 183px) !important;
    background: #ffffff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      height: calc(100vh - 300px) !important;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
    }
  }
}
</style>
<style lang="scss" scoped>
.mb10 {
  margin-bottom: 10px;
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
</style>
