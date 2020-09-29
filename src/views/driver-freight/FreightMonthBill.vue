<template>
  <div
    class="DriverFreightMonthBill"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      :pc-col="8"
      label-width="90px"
      class="p15 SuggestForm"
    >
      <template slot="ddd">
        <el-date-picker
          v-model="listQuery.ddd"
          class="month-picker"
          type="monthrange"
          range-separator="-"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
        />
      </template>
      <template slot="cccc">
        <el-badge
          v-for="item in btns"
          :key="item.text"
        >
          <el-button
            size="small"
            type="primary"
            :plain="item.name !== listQuery.status"
            @click="listQuery.status =item.name"
          >
            {{ item.text }}
          </el-button>
        </el-badge>
      </template>
      <div
        slot="btn"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          type="primary"
          @click="handleExportClick"
        >
          导出
        </el-button>
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          type="primary"
          @click="handleFilterClick"
        >
          查询
        </el-button>
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          @click="handleResetClick"
        >
          重置
        </el-button>
      </div>
    </self-form>
    <div class="table_box">
      <div class="middle">
        <div class="count">
          筛选结果（1000条）
        </div>
      </div>
      <!-- 表格 -->
      <self-table
        ref="freighForm"
        v-loading="listLoading"
        :index="true"
        :is-p30="false"
        :indexes="false"
        :operation-list="operationList"
        :table-data="tableData"
        :columns="columns"
        :page="page"
        style="overflow: inherit;"
        @olclick="handleOlClick"
        @onPageSize="handlePageSize"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:createDate="scope">
          {{ scope.row.createDate }}
        </template>
        <template v-slot:op="scope">
          <el-dropdown
            :trigger="isPC ? 'hover' : 'click'"
            @command="(e) => handleCommandChange(e,scope.row)"
          >
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

            <el-dropdown-menu
              slot="dropdown"
            >
              <el-dropdown-item
                command="flow"
              >
                查看流水
              </el-dropdown-item>
              <el-dropdown-item
                command="driverCheck"
              >
                司机对账
              </el-dropdown-item>
              <el-dropdown-item
                command="download"
              >
                账单下载
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </self-table>
    </div>

    <!-- 标记收款弹窗 -->
    <SelfDialog
      :class="'distributionDialog'"
      :visible.sync="showDialog"
      :title="dialogTit"
      :confirm="confirm"
      :destroy-on-close="true"
      @closed="handleClosed"
    >
      <p>已选择{{ multipleSelection.length }}条</p>
      <self-form
        ref="dialogForm"
        :list-query="dialogForm"
        :form-item="dialogFormItem"
        size="small"
        label-width="90px"
        class="p15"
        :rules="dialogRole"
        @onPass="handlePassClick"
      >
        <template slot="d">
          <el-upload
            ref="upload"
            :http-request="customUpload"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :auto-upload="true"
            :multiple="false"
            :limit="1"
            action="/line/gmv/importFile"
            :show-file-list="true"
          >
            <el-button
              size="small"
              type="primary"
            >
              点击上传
            </el-button>
            <div
              slot="tip"
              class="el-upload__tip"
            >
              支持扩展名：.rar .zip .doc .docx .pdf .jpg...
            </div>
          </el-upload>
        </template>
      </self-form>
    </SelfDialog>
    <PitchBox
      :drawer.sync="drawer"
      :drawer-list="multipleSelection"
      @deletDrawerList="deletDrawerList"
      @changeDrawer="changeDrawer"
    >
      <template slot-scope="slotProp">
        <span>{{ slotProp.item.bussinessName }}</span>
        <span>{{ slotProp.item.bussinessPhone }}</span>
        <span>{{ slotProp.item.cityName }}</span>
      </template>
    </PitchBox>
  </div>
</template>
<script lang="ts">
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { HandlePages } from '@/utils/index'
import { SettingsModule } from '@/store/modules/settings'
import { Vue, Component } from 'vue-property-decorator'
import { fileUpload } from '@/api/cargo'
import PitchBox from '@/components/PitchBox/index.vue'

interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}

interface IState {
  [key: string]: any;
}
@Component({
  name: 'DriverFreightMonthBill',
  components: {
    SelfTable,
    SelfForm,
    SelfDialog,
    PitchBox
  }
})
export default class extends Vue {
  // loading
  private listLoading:Boolean = false;
  private btns:any[] = [
    {
      name: '',
      text: '全部'
    },
    {
      name: '1',
      text: '待对账'
    },
    {
      name: '2',
      text: '已对账'
    }
  ]
  // 查询表单
  private listQuery:IState = {
    cccc: []
  }
  // 查询表单容器
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 50
      },
      label: '月账单编号:',
      key: 'a'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 50
      },
      label: '司机姓名:',
      key: 'b'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '司机城市:',
      key: 'c',
      options: [
        {
          label: '全部',
          value: 1
        },
        {
          label: '北京',
          value: 2
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '业务线:',
      key: 'cc',
      options: [
        {
          label: '全部',
          value: 1
        },
        {
          label: '北京',
          value: 2
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '加盟经理:',
      key: 'ccc',
      options: [
        {
          label: '全部',
          value: 1
        },
        {
          label: '北京',
          value: 2
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '是否封账:',
      key: 'ccd',
      options: [
        {
          label: '全部',
          value: 1
        },
        {
          label: '北京',
          value: 2
        }
      ]
    },
    {
      col: 8,
      label: '月份:',
      key: 'ddd',
      type: 'ddd',
      slot: true
    },
    {
      col: 20,
      label: '对账状态:',
      key: 'cccc',
      type: 'cccc',
      slot: true
    }
  ]
  // 表格数据
  private tableData:any[] = [
    {
      a: 1
    },
    {
      a: 2
    }
  ]
  // 表格列
  private columns:any[] = [
    {
      key: 'a',
      label: '月账单编号',
      'min-width': '140px'
    },
    {
      key: 'b',
      label: '账单月份',
      'min-width': '140px'
    },
    {
      key: 'c',
      label: '司机姓名',
      'min-width': '140px'
    },
    {
      key: 'd',
      label: '司机城市',
      'min-width': '200px'
    },
    {
      key: 'e',
      label: '账单数(个)',
      'min-width': '140px'
    },
    {
      key: 'f',
      label: '出车单数(个)',
      'min-width': '140px'
    },
    {
      key: 'g',
      label: '是否封账',
      'min-width': '140px'
    },
    {
      key: 'aa',
      label: '对账状态',
      'min-width': '140px'
    },
    {
      key: 'h',
      label: '上传凭证',
      'min-width': '140px'
    },
    {
      key: 'h1',
      label: '加盟经理',
      'min-width': '140px'
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      slot: true,
      'min-width': this.isPC ? '200px' : '50px'
    }
  ]
  // 全选
  private operationList: any[] = [
    { icon: 'el-icon-finished', name: '查看选中', color: '#F2A33A', key: '3' },
    { icon: 'el-icon-thumb', name: '批量标记收款', color: '#5E7BBB', key: '1' },
    { icon: 'el-icon-circle-close', name: '清空选择', color: '#F56C6C', key: '2' }
  ]
  private multipleSelection: any[] = []
  private drawer: boolean= false;

  // 分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 100
  }
  // 弹窗
  private showDialog: boolean = false;
  // 弹窗标题
  private dialogTit: string = '';
  // 弹窗form
  private dialogForm: IState = {
  }
  private fileList: []= [];
  private dialogRole: IState= {
    d: [
      { required: true, message: '请上传凭证', trigger: 'change' }
    ]
  }
  private dialogFormItem:any[] = [];
  // 弹窗表单容器
  private dialogItem: any[] = [
    {
      type: 7,
      col: 12,
      label: '账单编号:',
      key: 'a'
    },
    {
      type: 7,
      col: 12,
      label: '出车编号:',
      key: 'b'
    },
    {
      type: 7,
      col: 24,
      label: '运费金额:',
      key: 'c'
    },
    {
      col: 24,
      label: '上传凭证:',
      key: 'd',
      type: 'd',
      slot: true
    },
    {
      type: 1,
      label: '备注:',
      col: 24,
      tagAttrs: {
        placeholder: '请输入不超过100字',
        maxlength: 100,
        type: 'textarea',
        'show-word-limit': true,
        autosize: { minRows: 3, maxRows: 4 },
        clearable: true
      },
      key: 'remark'
    }
  ];
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 重置表单
  private handleResetClick() {

  }
  // 查询表单
  private handleFilterClick() {

  }
  // 导出
  private handleExportClick() {

  }
  // 分页
  private handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 获取列表
  private getLists() {
  }
  // 更多操作
  private handleCommandChange(key:string, row:any) {
    if (key === 'flow') { // 查看流水
      this.$router.push({
        path: '/driverfreight/bill'
      })
    } else if (key === 'driverCheck') { // 司机对账
      this.dialogTit = '月账单对账'
      this.dialogFormItem = []
      setTimeout(() => {
        this.dialogFormItem.push(...this.dialogItem)
        this.showDialog = true
      }, 20)
    } else if (key === 'download') { // 账单下载
      console.log('账单下载')
    }
  }
  // 确认弹窗
  private handlePassClick(valid: any) {
    console.log('xxxx:', valid)
  }
  private async confirm(done: any) {
    ((this.$refs.dialogForm) as any).submitForm()
  }
  // 关闭弹窗清除数据
  private handleClosed() {
    this.showDialog = false;
    (this.$refs.freighForm as any).toggleRowSelection()
  }
  private customUpload(param: any) {
    // 自定义上传
    const formData = new FormData()
    formData.append('file', param.file)
    fileUpload(formData)
      .then(({ data } : any) => {
        if (data.success) {
          this.$message.success('上传成功')
        } else {
          this.fileList = []
          this.$message({
            showClose: true,
            duration: 0,
            message: data.errorMsg,
            type: 'error'
          })
        }
      })
      .catch(() => {
        this.fileList = []
      })
  }
  private handleRemove(file: any, fileList: any) {
    this.fileList = fileList
  }
  private handleChange(file: any, fileList: any) {
    this.fileList = fileList.slice(-3)
  }
  private handleExceed(files: any, fileList: any) {
    this.$message.warning(`当前限制选择 1 个文件`)
  }
  // table选择框
  private handleSelectionChange(val: any) {
    this.multipleSelection = val
  }
  // 批量操作
  private handleOlClick(item: any) {
    const { key } = item
    if (key === '3') {
      if (this.multipleSelection.length > 0) {
        this.drawer = true
      } else {
        this.$message.error('请先选择')
      }
    } else if (key === '2') {
      (this.$refs.freighForm as any).toggleRowSelection()
    } else if (key === '1') {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请先选择')
        return
      }
      this.dialogTit = '批量月账单对账'
      this.showDialog = true
      this.dialogFormItem = this.dialogItem.slice(3)
    }
  }
  // 关闭查看已选
  private changeDrawer(val: any) {
    this.drawer = val
  }

  // 删除选中项目
  private deletDrawerList(item: any, i: any) {
    let arr: any[] = [item];
    (this.$refs.freighForm as any).toggleRowSelection(arr)
    if (this.multipleSelection.length === 0) {
      this.drawer = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .DriverFreightMonthBill{
    .month-picker{
      ::v-deep{
        .el-range-separator{
          padding: 0;
        }
      }
    }
    .btnPc {
       display: flex;
       flex-flow: row nowrap;
       justify-content: flex-end;
     }
    .mobile {
      width:100%;
      text-align: center;
      .btnMobile {
        margin-left: 0;
        margin-top: 10px;
        width:80%;
      }
    }
    .middle {
      margin: 10px 0px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .count {
        font-size:14px;
        color:#666;
      }
    }
    .SuggestForm {
      width: 100%;
      background: #fff;
      margin-bottom: 10px;
      margin-left:0px!important;
      margin-right:0px!important;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    }
    .table_box {
      padding: 0px 30px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
  }
</style>

<style scoped>
  .DriverFreightMonthBill >>> .el-badge {
    margin-right:20px;
  }
</style>
