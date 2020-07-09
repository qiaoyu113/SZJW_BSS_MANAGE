<template>
  <div :class="isPC ? 'LineManage' : 'LineManage-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-date="handleDate"
      @handle-query="handleQuery"
    >
      <LineManageForm
        :list-query="listQuery"
        :date-value="DateValue"
        @handle-tags="handleTags"
      />
    </SuggestContainer>

    <div class="table_box">
      <!--操作栏-->
      <BettwenTitle
        :tab="tab"
        :active-name="listQuery.state"
      >
        <template v-slot:left>
          <div>
            <span>12332313213</span>
          </div>
        </template>

        <template v-slot:right>
          <div>
            <el-button
              :class="isPC ? 'btn-item-right' : 'btn-item-right-m'"
              type="primary"
              size="small"
              name="LineManage_creat_btn"
              @click="goCreat"
            >
              <i class="el-icon-plus" />
              <span v-if="isPC">新建</span>
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
                    :key="item.label"
                  >
                    <el-checkbox
                      :label="item.label"
                      :disabled="item.disabled"
                    />
                  </el-dropdown-item>
                </el-checkbox-group>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </BettwenTitle>
      <div class="table_center">
        <self-table
          ref="selfTable"
          v-loading="listLoading"
          border
          :table-data="tableData"
          :columns="columns"
          :page="page"
          @onPageSize="handlePageSize"
          @onCommand="handleCommandChange"
          @olclick="handleOlClick"
          @tableClick="tableClick"
        >
          <template v-slot:operate="scope">
            <el-button
              v-if="isPC"
              :a="scope"
              type="text"
            >
              更多操作
            </el-button>
            <i
              v-else
              class="el-icon-setting"
            />
          </template>
          <template v-slot:detail="scope">
            <el-button
              v-if="isPC"
              :a="scope"
              type="text"
            >
              详情
            </el-button>
            <i
              v-else
              class="el-icon-setting"
            />
          </template>
        </self-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { HandlePages } from '@/utils/index'
import { GetCustomerList } from '@/api/customer'
import Pagination from '@/components/Pagination/index.vue'
import BettwenTitle from '@/components/TableHeader/BettwenTitle.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { LineManageForm } from './components'
import SelfTable from '@/components/base/SelfTable.vue'
import '@/styles/common.scss'

  interface PageObj {
    page:Number,
    limit:Number,
    total?:Number
  }

  interface IState {
    [key: string]: any;
  }

  @Component({
    name: 'LineManage',
    components: {
      Pagination,
      SuggestContainer,
      BettwenTitle,
      LineManageForm,
      SelfTable
    }
  })

export default class LineManage extends Vue {
  private tab: any[] = [
    {
      label: '待上架',
      name: '0',
      num: 187
    },
    {
      label: '已上架',
      name: '1',
      num: 1
    },
    {
      label: '已售罄',
      name: '2'
    },
    {
      label: '已停用',
      name: '3'
    }
  ];
  private total = 0;
  private id:string = '';
  private list: any[] = [];
  private limit: number = 20;
  // private page: Object | undefined = '';
  private listLoading = true;
  private tags: any[] = [];
  private DateValue: any[] = [];
  private operationList: any[] = [
    { icon: 'el-icon-phone', name: '1', color: '#999' },
    { icon: 'el-icon-star-off', name: '2', color: '#978374' }
  ];
  private dropdownList: any[] = [];
  private checkList: any[] = this.dropdownList;
  private listQuery: IState = {
    key: '',
    city: '',
    page: 1,
    limit: 30,
    endDate: '',
    startDate: '',
    state: '',
    lineSaleId: '',
    name: '',
    soldName: '',
    soldnum: '',
    huozhuName: '',
    upstatus: '',
    linearea: '',
    fancang: '',
    stopstatus: '',
    creattime: [],
    starttime: []
  };
      page:PageObj ={
        page: 1,
        limit: 10,
        total: 20
      }
    private tableData:any[] = []

    private columns:any[] = [
      {
        key: 'customerNo',
        label: '货主编号',
        disabled: true
      },
      {
        key: 'customerName',
        label: '货主'
      },
      {
        key: 'distributionType',
        label: '类型'
      },
      {
        key: 'clueStatus',
        label: '合同状态'
      },
      {
        key: 'createDate',
        label: '创建时间'
      },
      {
        key: 'creater',
        label: '创建人'
      },
      {
        key: 'customerNo',
        label: '合同止期'
      },
      {
        key: 'clientsName',
        label: '线路销售'
      },
      {
        fixed: 'right',
        key: 'operate',
        label: '操作',
        slot: true,
        moreOp: [
          {
            label: '编辑',
            value: 'edit',
            icon: 'el-icon-edit'
          },
          {
            label: '删除',
            value: 'delete',
            icon: 'el-icon-delete'
          },
          {
            label: '拍照',
            value: 'take',
            icon: 'el-icon-camera'
          }
        ]
      },
      {
        fixed: 'right',
        key: 'detail',
        slot: true,
        label: '详情',
        moreOp: [
          {
            label: '查看线路详情',
            value: 'detail',
            icon: 'el-icon-delete'
          },
          {
            label: '查看线路照片',
            value: 'show',
            icon: 'el-icon-camera'
          }
        ]
      }
    ]

    private tableClick(row: any, column: any, cell: any, event: any) {
      this.id = row.clientPhone
      console.log('添加明细原因', row, column, cell, event)
    }
    /**
     * 分页
     */
    handlePageSize(page:any) {
      this.page.page = page.page
      this.page.limit = page.limit
      this.fetchData()
    }
    /**
     * 表格下拉菜单
     */
    handleCommandChange(key:string|number) {
      switch (key) {
        case 'take':
          this.$router.push({ path: 'takepicture', query: { id: this.id } })
          break
        default:
          break
      }
    }

    private handleOlClick(value:any) {
      console.log('xx:', value)
    }

    private olClicks(item: any) {
      console.log(item)
    }

    created() {
      this.fetchData()
      this.dropdownList = [...this.columns]
      this.checkList = this.dropdownList.map(item => item.label)
    }

    @Watch('checkList', { deep: true })
    private checkListChange(val:any) {
      this.columns = this.dropdownList.filter(item => val.includes(item.label))
    }
    // 所有请求方法
    private fetchData() {
      this.getList(this.listQuery)
    }

    private goDetail(id:string) {
      console.log(id, 'id')
      this.$router.push({ path: 'linedetail', query: { id: id } })
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
      this.listQuery.page = this.page.page
      this.listQuery.limit = this.page.limit
      this.listLoading = true
      const { data } = await GetCustomerList(this.listQuery)
      if (data.success) {
        this.tableData = data.data
        this.page.total = data.page.total
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

    private goCreat() {
      this.$router.push('creatline')
    }

    get isPC() {
      return SettingsModule.isPC
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';
.LineManage {
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  .btn-item-left{
    border-radius: 4px;
    border: none;
    margin-right: 10px;
  }
  .btn-item-right{
    border-radius: 4px;
    border: none;
    margin-left: 10px;
  }
  .btn-main-color{
    border: 1px solid $main-btn;
    color: $main-btn;
  }
  .btn-item-filtrate {
    background: #ffa000;
    border-radius: 4px;
    border: none;
    margin-left: 10px;
  }
  .table_box {
    height: calc(100vh - 225px) !important;
    background: #ffffff;
    // border: 1px solid #dfe6ec;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      height: calc(100vh - 300px) !important;
      padding: 30px;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
      // overflow-y: scroll;
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
.LineManage-m {
  padding-bottom: 0;
  box-sizing: border-box;
  .btn-item-right-m{
    border-radius: 4px;
    border: none;
    margin-right: 10px;
  }
  .btn-item-left-m{
    border-radius: 4px;
    border: none;
    margin-left: 10px;
  }
  .btn-item-filtrate-m {
    background: #ffa000;
    border-radius: 4px;
    border-radius: 4px;
    border: none;
  }
    .btn-main-color-m{
    border: 1px solid $main-btn;
    color: $main-btn;
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
}
</style>

<style lang="scss" scope>
.btn-main-color{
    border: 1px solid $main-btn;
    color:$main-btn
  }
.el-collapse-item__content {
  padding-bottom: 0;
}

.el-form-item__label {
  color: #999999;
}
</style>
