<template>
  <div :class="isPC ? 'OwnerList' : 'OwnerList-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-date="handleDate"
      @handle-query="handleQuery"
    >
      <OwnerListForm
        :list-query="listQuery"
        :date-value="DateValue"
        @handle-tags="handleTags"
        @handle-query="getList"
      />
    </SuggestContainer>

    <div class="table_box">
      <!--操作栏-->
      <TableHeader
        :tab="tab"
        :active-name="listQuery.state"
      >
        <el-dropdown
          :hide-on-click="false"
          trigger="click"
        >
          <el-button
            :class="isPC ? 'btn-item-filtrate' : 'btn-item-filtrate-m'"
            type="primary"
            size="small"
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
          row-key="customerNo"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            :key="checkList.length + 'c'"
            fixed
            reserve-selection
            type="selection"
            width="55"
          />
          <el-table-column
            v-if="checkList.indexOf('货主编号') > -1"
            :key="checkList.length + 'a'"
            align="left"
            fixed
            label="货主编号"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.customerId | DataIsNull }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('线索编号') > -1"
            :key="checkList.length + 'd'"
            align="left"
            label="线索编号"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.clueId | DataIsNull }} </span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('销售') > -1"
            :key="checkList.length + 'e'"
            align="left"
            label="销售"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.lineSaleName | DataIsNull }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('公司简称') > -1"
            :key="checkList.length + 'f'"
            align="left"
            label="公司简称"
          >
            <template slot-scope="{row}">
              {{ row.customerCompanyName | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('分类') > -1"
            :key="checkList.length + 'g'"
            align="left"
            label="分类"
          >
            <template slot-scope="scope">
              <p>{{ scope.row.classificationName | DataIsNull }}</p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('城市') > -1"
            :key="checkList.length + 'k'"
            align="left"
            label="城市"
          >
            <template slot-scope="scope">
              <p>
                <span>{{ scope.row.cityName | DataIsNull }}</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('联系人') > -1"
            :key="checkList.length + 'm'"
            align="left"
            label="联系人"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.bussinessName | DataIsNull }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('联系电话') > -1"
            :key="checkList.length + 'l'"
            align="left"
            label="联系电话"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.isPhone"
                type="text"
                style="padding: 0 4px"
                @click="getAllPhone(scope.row, scope.$index)"
              >
                {{ scope.row.bussinessPhone | DataIsNull }}
              </el-button>
              <span v-else>{{ scope.row.bussinessPhone | DataIsNull }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('身份证号') > -1"
            :key="checkList.length + 'n'"
            align="left"
            label="身份证号"
          >
            <template slot-scope="{row}">
              {{ row.bussinessCard | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('创建日期') > -1"
            :key="checkList.length + 'y'"
            align="left"
            label="创建日期"
          >
            <template slot-scope="{row}">
              {{ row.createDate | Timestamp }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('合同止期') > -1"
            :key="checkList.length + 'h'"
            align="left"
            label="合同止期"
          >
            <template slot-scope="{row}">
              {{ row.contractEnd | Timestamp }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('备注') > -1"
            :key="checkList.length + 'o'"
            align="left"
            label="备注"
          >
            <template slot-scope="{row}">
              {{ row.remark | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            :key="checkList.length + 'b'"
            align="left"
            label="操作"
            fixed="right"
            show-overflow-tooltip
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
                    @click.native="goDetail(scope.row.customerId)"
                  >
                    详情
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="goClue(scope.row.customerId)"
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
        :small="true"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
        @olclick="olClicks"
      />
    </div>
    <PitchBox
      :drawer.sync="drawer"
      :drawer-list="multipleSelection"
      @deletDrawerList="deletDrawerList"
      @changeDrawer="changeDrawer"
    >
      <template slot-scope="slotProp">
        <span>{{ slotProp.item.creater }}</span>
        <span>{{ slotProp.item.clientPhone }}</span>
        <span>{{ slotProp.item.city }}</span>
      </template>
    </PitchBox>

    <!-- 批量分配货主 -->
    <Dialog
      :visible.sync="assignShowDialog"
      :title="`分配货主`"
      :confirm="confirmAssign"
    >
      <el-alert
        class="mb10"
        :title="`已选货主${multipleSelection.length}位，请选择销售！(货主其关联的线索也会分配给该销售)`"
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
        row-key="saleId"
      >
        <el-table-column
          type="selection"
          width="55"
          reserve-selection
          align="center"
        >
          <template slot-scope="scope">
            <el-radio
              v-model="templateRadio"
              :label="scope.row.messageTemplateId"
              @change.native="handleSelectionDialog(scope.row.saleId)"
            />
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          width="55"
          label="序号"
          :index="indexMethod('dialogListQuery')"
          align="center"
        />
        <el-table-column
          label="销售姓名"
          prop="saleName"
        />
        <el-table-column
          label="联系电话"
          prop="phone"
        />
        <el-table-column
          label="线索数量"
          prop="nums"
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
    <!--提示窗口-->
    <Dialog
      :visible.sync="showDialog.visible"
      :title="showDialog.title"
      :center="true"
      :confirm="confirm"
    >
      <p>{{ showDialog.text }}</p>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { GetCustomerList, GetCustomerSaleList, Distribution } from '@/api/customer'
import { GetFindBusinessPhone } from '@/api/cargo'
import { CargoListData } from '@/api/types'
import { HandlePages } from '@/utils/index'
import Pagination from '@/components/Pagination/index.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import SelfTable from '@/components/base/SelfTable.vue'
import PitchBox from '@/components/PitchBox/index.vue'
import { OwnerListForm } from './components'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'OwnerList',
  components: {
    Pagination,
    SuggestContainer,
    TableHeader,
    OwnerListForm,
    Dialog,
    SelfTable,
    PitchBox
  }
})
export default class extends Vue {
    private showDialog: Object= {
      visible: false,
      title: '提示',
      text: '内容',
      name: ''
    };
    private drawer: boolean= false;
    private total = 0;
    private list: CargoListData[] = [];
    private page: Object | undefined = '';
    private listLoading = true;
    private tags: any[] = [];
    private templateRadio: any[] = []
    private DateValue: any[] = [];
    private multipleSelection: any[] = []
    private operationList: any[] = [
      { icon: 'el-icon-finished', name: '查看选中', color: '#F2A33A', key: '3' },
      { icon: 'el-icon-thumb', name: '分配货主', color: '#5E7BBB', key: '1' },
      { icon: 'el-icon-circle-close', name: '清空选择', color: '#F56C6C', key: '2' }
    ];
    private dropdownList: any[] = [
      '货主编号',
      '线索编号',
      '销售',
      '公司简称',
      '分类',
      '城市',
      '联系人',
      '联系电话',
      '身份证号',
      '是否为合同期内',
      '创建日期',
      '合同止期',
      '备注',
      '操作'
    ];
    private checkList: any[] = this.dropdownList;
    private tab: any[] = [
      {
        label: '全部',
        name: '0',
        num: ''
      }
    ];
    private listQuery: IState = {
      key: '',
      city: '',
      page: 1,
      limit: 30,
      endDate: '',
      startDate: '',
      state: '',
      lineSaleId: '',

      bussinessName: '',
      bussinessPhone: '',
      classification: '',
      contractEnd: '',
      contractEndEndTime: '',
      contractEndStartTime: '',
      createDate: '',
      customerCompanyName: '',
      customerId: '',
      pageNumber: ''
    };
    private saleId: any = '';
    // 弹窗分配
    private dialogList: any[] = [];
    private dialogLoading: boolean= false;
    private multipleSelectionAssign: any[] = []
    private assignShowDialog: boolean= false;
    // 弹窗分页
    private dialogTotal: number = 0;
    private dialogListQuery: IState = {
      page: 1,
      limit: 20
    };

    @Watch('checkList', { deep: true })
    private checkListChange(val:any) {
      this.$nextTick(() => {
        ((this.$refs['multipleTable']) as any).doLayout()
      })
    }

    created() {
      this.fetchData()
    }

    mounted() {}

    activated() {
    // this.handleScroll()
    }

    // 判断是否是PC
    get isPC() {
      return SettingsModule.isPC
    }
    // 确认清除
    private confirm(done:any) {
      if (this.showDialog[name] === '1') {
        (this.$refs.multipleTable as any).clearSelection()
        this.multipleSelection = []
      } else {
        this.assignShowDialog = true
        this.getDialogList(this.dialogListQuery)
      }
      done()
    }
    // 所有请求方法
    private fetchData() {
      this.getList(this.listQuery)
    }

    // 处理tags方法
    private handleTags(value: any) {
      this.tags = value
    }

    // 处理query方法
    private handleQuery(value: any, key: any) {
      this.listQuery[key] = value
      this.fetchData()
    }

    // 处理选择日期方法
    private handleDate(value: any) {
      this.DateValue = value
    }

    // 请求列表
    private async getList(value: any) {
      this.listQuery.page = value.page
      this.listQuery.limit = value.limit
      this.listLoading = true
      const { data } = await GetCustomerList(this.listQuery)
      if (data.success) {
        this.list = data.data
        this.tab[0].num = data.page.total
        data.page = await HandlePages(data.page)
        this.total = data.page.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      } else {
        this.$message.error(data)
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }
    }

    // 获取弹窗list
    async getDialogList(value: any) {
      this.dialogListQuery.page = value.page
      this.dialogListQuery.limit = value.limit
      this.dialogLoading = true
      const { data } = await GetCustomerSaleList(this.dialogListQuery)
      if (data.success) {
        this.dialogList = data.data
        this.dialogTotal = data.page ? data.page.total : data.data.length
      } else {
        this.$message.error(data)
      }
      setTimeout(() => {
        this.dialogLoading = false
      }, 0.5 * 1000)
    }

    // 按钮操作
    private goDetail(id: string | (string | null)[] | null | undefined) {
      this.$router.push({ name: 'OwnerDetail', query: { id: id } })
    }

    // 跳转线索
    private goClue(id: string | (string | null)[] | null | undefined) {
      this.$router.push({ name: 'EditCustomer', query: { id: id, info: 'edit' } })
    }

    // 批量操作
    private olClicks(item: any) {
      if (item.key === '2') {
        if (this.multipleSelection.length) {
          this.showDialog = {
            visible: true,
            title: '清空确认',
            text: '确认清空所有选择吗？',
            name: '1'
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择货主再进行操作！'
          })
        }
      } else if (item.key === '1') {
        if (this.multipleSelection.length) {
          this.showDialog = {
            visible: true,
            title: '提示',
            text: '分配货主后关联的相关线索也会分配给该销售！',
            name: '2'
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择货主再进行操作！'
          })
        }
      } else if (item.key === '3') {
        this.drawer = true
      }
    }

    // table选择框
    handleSelectionChange(val: any) {
      this.multipleSelection = val
    }

    // 关闭查看已选
    private changeDrawer(val: any) {
      this.drawer = val
    }

    // 删除选中项目
    private deletDrawerList(item:any, i:any) {
      (this.$refs.multipleTable as any).toggleRowSelection(item)
    }

    // 弹窗操作
    private async confirmAssign(done: any) {
      let linesIds: any = []
      this.multipleSelection.forEach(i => {
        linesIds.push(i.lineSaleId)
      })
      // 提交操作
      if (this.saleId) {
        const { data } = await Distribution({
          linesIds: linesIds,
          saleId: this.saleId
        })
        if (data.success) {
          this.$message.success('分配成功')
          this.assignShowDialog = false
        } else {
          this.$message.error(data.errorMsg)
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择货主再进行操作！'
        })
      }
    // done()
    }
    // 弹窗表格选中
    private handleSelectionDialog(val: any) {
      this.saleId = val
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

    // 查看手机号
    private async getAllPhone(detail:any, index: any) {
      const { data } = await GetFindBusinessPhone({ customerId: detail.customerId })
      if (data.success) {
        this.list[index].bussinessPhone = data.data
      } else {
        this.$message.error(data.errorMsg)
      }
    }
}
</script>

<style lang="scss" scoped>
.OwnerList {
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  .btn-item {
    background: #649cee;
    border-radius: 4px;
    border-radius: 4px;
    border: none;
    margin: 0 10px;
  }
  .btn-item-filtrate {
    background: #ffa000;
    border-radius: 4px;
    border-radius: 4px;
    border: none;
  }
  .table_box {
    height: calc(100vh - 225px) !important;
    background: #ffffff;
    // border: 1px solid #dfe6ec;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      height: calc(100vh - 360px) !important;
      padding: 30px;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
      overflow-y: scroll;
    }
  }
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .pagination-container {
    background: #fff;
  }
}
</style>

<style lang="scss" scoped>
.OwnerList-m {
  padding-bottom: 0;
  box-sizing: border-box;
  .btn-item-m {
    background: #649cee;
    border-radius: 4px;
    border-radius: 4px;
    border: none;
    margin: 0 10px;
  }
  .btn-item-filtrate-m {
    background: #ffa000;
    border-radius: 4px;
    border-radius: 4px;
    border: none;
  }
  .table_box {
    height: calc(100vh - 183px) !important;
    background: #ffffff;
    // border: 1px solid #dfe6ec;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      height: calc(100vh - 300px) !important;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
      overflow-y: scroll;
    }
  }
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .pagination-container {
    background: #f8f9fa;
  }
  .el-table th.gutter {
    display: table-cell !important
  }
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
