<template>
  <div :class="isPC ? 'ContractList' : 'ContractList-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-date="handleDate"
      @handle-query="handleQuery"
    >
      <ContractListForm
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
        <el-button
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          type="primary"
          size="small"
          name="cluelist_creat_btn"
          @click="downLoad"
        >
          <i class="el-icon-download" />
          <span v-if="isPC">导出</span>
        </el-button>

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
          :max-height="tableHeight"
          fit
          :border="isPC"
          stripe
          highlight-current-row
          style="width: 100%"
          row-key="contractId"
        >
          <el-table-column
            v-if="checkList.indexOf('合同编号') > -1"
            :key="checkList.length + '1'"
            align="left"
            :fixed="isPC"
            label="合同编号"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.fileNo | DataIsNull }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('订单编号') > -1"
            :key="checkList.length + '2'"
            align="left"
            label="订单编号"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.orderId | DataIsNull }} </span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('合同名称') > -1"
            :key="checkList.length + '3'"
            class-name="status-col"
            align="left"
            label="合同名称"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.subject | DataIsNull }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('司机姓名') > -1"
            :key="checkList.length + '4'"
            align="left"
            label="司机姓名"
          >
            <template slot-scope="{row}">
              {{ row.driverName | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('合同归属') > -1"
            :key="checkList.length + '5'"
            align="left"
            label="合同归属"
          >
            <template slot-scope="scope">
              <p>{{ scope.row.busiTypeName | DataIsNull }}</p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('合同状态') > -1"
            :key="checkList.length + '6'"
            align="left"
            label="合同状态"
          >
            <template slot-scope="scope">
              <p>
                <span>{{ scope.row.statusName | DataIsNull }}</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('生成时间') > -1"
            :key="checkList.length + '7'"
            align="left"
            label="生成时间"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createDate | Timestamp }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('联系电话') > -1"
            :key="checkList.length + '8'"
            align="left"
            label="联系电话"
          >
            <template slot-scope="{row}">
              {{ row.bussinessPhone | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('身份证号') > -1"
            :key="checkList.length + '9'"
            align="left"
            label="身份证号"
          >
            <template slot-scope="{row}">
              {{ row.bussinessCard | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('创建日期') > -1"
            :key="checkList.length + '10'"
            align="left"
            label="创建日期"
          >
            <template slot-scope="{row}">
              {{ row.lineSaleName | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('合同止期') > -1"
            :key="checkList.length + '11'"
            align="left"
            label="合同止期"
          >
            <template slot-scope="{row}">
              {{ row.lineSaleName | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('备注') > -1"
            :key="checkList.length + '12'"
            align="left"
            label="备注"
          >
            <template slot-scope="{row}">
              {{ row.remark | DataIsNull }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('操作') > -1"
            :key="checkList.length + '13'"
            align="left"
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
                    v-if="scope.row.status === 3 || scope.row.status === 4"
                    @click.native="Down(scope.row.contractId)"
                  >
                    下载
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status === 3"
                    @click.native="Activate(scope.row.contractId)"
                  >
                    激活
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="goDetail(scope.row.contractId)"
                  >
                    详情
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
      />
    </div>

    <!--提示窗口-->
    <SelfDialog
      :visible.sync="showDialog.visible"
      :title="showDialog.title"
      :center="true"
      :confirm="confirm"
    >
      <p>{{ showDialog.text }}</p>
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { GetContractList, ActiveContract, DownloadContract, ContractExport } from '@/api/join'
import { CargoListData } from '@/api/types'
import { HandlePages } from '@/utils/index'
import Pagination from '@/components/Pagination/index.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfTable from '@/components/base/SelfTable.vue'
import PitchBox from '@/components/PitchBox/index.vue'
import { ContractListForm } from './components'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'ContractList',
  components: {
    Pagination,
    SuggestContainer,
    TableHeader,
    ContractListForm,
    SelfDialog,
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
    private ActivateId: any = ''
    private list: CargoListData[] = [];
    private page: Object | undefined = '';
    private listLoading = true;
    private tags: any[] = [];
    private operationList: any[] = [];
    private deletDrawerList: any[] = []
    private DateValue: any[] = [];
    private multipleSelection: any[] = []
    private dropdownList: any[] = [
      '合同编号',
      '订单编号',
      '合同名称',
      '司机姓名',
      '合同归属',
      '合同状态',
      '生成时间',
      '操作'
    ];
    private checkList: any[] = this.dropdownList;
    private tab: any[] = [
      {
        label: '全部',
        name: '',
        num: ''
      },
      {
        label: '未签约',
        name: '1',
        num: ''
      },
      {
        label: '已签约',
        name: '2',
        num: ''
      },
      {
        label: '已过期',
        name: '3',
        num: ''
      },
      {
        label: '已作废',
        name: '4',
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
      busiType: '',
      driverName: '',
      fileNo: '',
      joinManageId: '',
      orderId: '',
      pageNumber: ''
    };
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
      this.$nextTick(() => {
        ((this.$refs['multipleTable']) as any).doLayout()
      })
    }

    // 判断是否是PC
    get isPC() {
      return SettingsModule.isPC
    }

    get tableHeight() {
      return SettingsModule.tableHeight
    }
    // 确认激活
    private async confirm(done:any) {
      const { data } = await ActiveContract({ contractId: this.ActivateId })
      if (data.success) {
        if (data.data.flag) {
          this.$message.success('激活成功')
          this.fetchData()
        } else {
          this.$message.error(data.data.msg)
        }
      } else {
        this.$message.error(data.errorMsg)
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
      const { data } = await GetContractList(this.listQuery)
      if (data.success) {
        this.list = data.data
        if (data.title) {
          this.tab[0].num = data.title.all
          this.tab[1].num = data.title.notSign
          this.tab[2].num = data.title.sign
          this.tab[3].num = data.title.expired
          this.tab[4].num = data.title.abolished
        }
        data.page = await HandlePages(data.page)
        this.total = data.page.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      } else {
        this.$message.error(data.errorMsg)
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
      const { data } = await GetContractList(this.dialogListQuery)
      if (data.success) {
        this.dialogList = data.data
        this.dialogTotal = data.page.total
      } else {
        this.$message.error(data.errorMsg)
      }
      setTimeout(() => {
        this.dialogLoading = false
      }, 0.5 * 1000)
    }

    // 下载按钮操作
    private async Down(id: string | (string | null)[] | null | undefined) {
      const { data } = await DownloadContract({ contractId: id })
      if (data.success) {
        const link = document.createElement('a')
        link.download = name
        link.href = data.data
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.$message.success('下载成功！')
      } else {
        this.$message.error(data.errorMsg)
      }
    }

    // 激活提示
    private Activate(id: string | (string | null)[] | null | undefined) {
      this.showDialog = {
        visible: true,
        title: '激活',
        text: '合同已过期，激活后，将生成新的合同，请尽快让司机在小程序中签约！',
        name: ''
      }
      this.ActivateId = id
    }

    // 合同详情
    private goDetail(id: string | (string | null)[] | null | undefined) {
      this.$router.push({ name: 'ContractDetail', query: { id: id } })
    }

    // 导出
    private async downLoad() {
      const postData = this.listQuery
      // delete postData.page
      // delete postData.limit
      const { data } = await ContractExport(postData)
      if (data.success) {
        this.$message({
          type: 'success',
          message: '导出成功!'
        })
        // const fileName = headers['content-disposition'].split('fileName=')[1]
        // this.download(data, decodeURI(fileName))
      } else {
        this.$message.error(data.errorMsg)
      }
    }
    private download(data: any, name: any) {
      if (!data) {
        return
      }
      let url = window.URL.createObjectURL(new Blob([data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
    }
}
</script>

<style lang="scss">
.ContractList {
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
    // height: calc(100vh - 225px) !important;
    background: #ffffff;
    // border: 1px solid #dfe6ec;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      // height: calc(100vh - 340px) !important;
      padding: 0 30px;
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

<style lang="scss">
.ContractList-m {
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
    // height: calc(100vh - 183px) !important;
    background: #ffffff;
    // border: 1px solid #dfe6ec;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      // height: calc(100vh - 300px) !important;
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
