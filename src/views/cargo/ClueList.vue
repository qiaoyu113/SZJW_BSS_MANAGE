<template>
  <div :class="isPC ? 'ClueList' : 'ClueList-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.distributionState"
      @handle-date="handleDate"
      @handle-query="handleQuery"
    >
      <ClueListForm
        :list-query="listQuery"
        :date-value="DateValue"
        :data-types="{
          optionsCity,
          optionsClue,
          optionsDistribution,
          optionsLineSource,
          optionsSale
        }"
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
        <el-button
          size="small"
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          type="primary"
          name="cluelist_creat_btn"
          @click="createClue"
        >
          <i class="el-icon-s-operation" />
          <span v-if="isPC">新增线索</span>
        </el-button>
        <el-button
          size="small"
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
            size="small"
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
          row-key="clueId"
          @cell-click="tableClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            :key="checkList.length + 'selection'"
            type="selection"
            width="55"
            reserve-selection
            align="center"
          />
          <el-table-column
            :key="checkList.length + 'index'"
            type="index"
            width="55"
            label="序号"
            :index="indexMethod('listQuery')"
            align="center"
            fixed
          />
          <el-table-column
            v-if="checkList.indexOf('线索编号') > -1"
            :key="checkList.length + 'clueId'"
            label="线索编号"
            prop="clueId"
          />

          <el-table-column
            v-if="checkList.indexOf('分配状态') > -1"
            :key="checkList.length + 'distributionState'"
            label="分配状态"
          >
            <template slot-scope="{row}">
              {{ row.distributionState | findDistribution }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('销售') > -1"
            :key="checkList.length + 'lineSaleName'"
            label="销售"
            prop="lineSaleName"
          />

          <el-table-column
            v-if="checkList.indexOf('线索状态') > -1"
            :key="checkList.length + 'clueState'"
            label="线索状态"
          >
            <template slot-scope="{row}">
              {{ row.clueState | findClue }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('线索来源') > -1"
            :key="checkList.length + 'clueSourceName'"
            label="线索来源"
            prop="clueSourceName"
          />

          <el-table-column
            v-if="checkList.indexOf('城市') > -1"
            :key="checkList.length + 'cityName'"
            label="城市"
            prop="cityName"
          />

          <el-table-column
            v-if="checkList.indexOf('公司') > -1"
            :key="checkList.length + 'company'"
            label="公司"
            prop="company"
          >
            <!-- 保留8个字 -->
            <template slot-scope="{row}">
              {{ row.company | subString(8) }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkList.indexOf('姓名') > -1"
            :key="checkList.length + 'name'"
            label="姓名"
            prop="name"
          >
            <template slot-scope="{row}">
              {{ row.name | subString(8) }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.indexOf('手机号') > -1"
            :key="checkList.length + 'phone'"
            label="手机号"
          >
            <template slot-scope="{row}">
              <el-link
                v-if="row.phone.includes('*')"
                :underline="false"
                type="primary"
                @click="showPhone(row)"
              >
                {{ row.phone }}
              </el-link>
              <div v-else>
                {{ row.phone }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.indexOf('职务') > -1"
            :key="checkList.length + 'position'"
            label="职务"
            prop="position"
          >
            <template slot-scope="{row}">
              {{ row.position | subString(8) }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.indexOf('创建日期') > -1"

            :key="checkList.length + 'createDate'"
            label="创建日期"
          >
            <template slot-scope="{row}">
              {{ row.createDate | Timestamp }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.indexOf('更新日期') > -1"
            :key="checkList.length + 'updateDate'"
            label="更新日期"
          >
            <template slot-scope="{row}">
              {{ row.updateDate | Timestamp }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.indexOf('备注') > -1"
            :key="checkList.length + 'remark'"
            label="备注"
            prop="remark"
          >
            <template slot-scope="{row}">
              {{ row.remark | subString(15) }}
            </template>
          </el-table-column>
          <el-table-column
            :key="checkList.length"
            label="操作"
            fixed="right"
            :width="isPC ? 'auto' : '50'"
          >
            <template slot-scope="{row}">
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
                    @click.native="goDetail(row.clueId)"
                  >
                    详情
                  </el-dropdown-item>
                  <!--
                    已分配，待跟进
                    已分配，已跟进
                   -->
                  <el-dropdown-item
                    v-if="row.distributionState === 1 && (row.clueState === 0 || row.clueState === 1)"
                    @click.native="goFollow(row)"
                  >
                    跟进
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="row.isTransform !== '1' && row.clueState !== 2"
                    @click.native="goConversion(row.clueId)"
                  >
                    转化
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="goEdit(row)"
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
    <!-- 批量分配线索 -->
    <Dialog
      :class="'distributionDialog'"
      :visible.sync="showDialog"
      :title="`批量分配线索`"
      :confirm="confirm"
      :destroy-on-close="true"
      @closed="handleClosed"
    >
      <el-alert
        class="mb10"
        :title="`已选线索${multipleSelection.length}条，请选择销售`"
        type="warning"
        :closable="false"
      />
      <el-table
        :data="optionsDialogSale"
        size="mini"
        stripe
        highlight-current-row
        height="38vh"
        style="width: 100%;"
        align="left"
        row-key="saleId"
      >
        <el-table-column
          label="选择"
          align="center"
          width="55"
        >
          <template slot-scope="{row}">
            <el-radio
              v-model="dialogValue"
              :label="row.saleId"
            >
              &nbsp;
            </el-radio>
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
      <!-- <pagination
        v-show="dialogTotal > 0"
        :small="true"
        :operation-list="[]"
        :total="dialogTotal"
        :page.sync="dialogListQuery.page"
        :limit.sync="dialogListQuery.limit"
        @pagination="getDialogList"
      /> -->
    </Dialog>
    <!-- 右侧侧边栏 -->
    <PitchBox
      :drawer.sync="drawer"
      :drawer-list="multipleSelection"
      @deletDrawerList="deletDrawerList"
      @changeDrawer="changeDrawer"
    >
      <template slot-scope="{item}">
        <span>{{ item.name }}</span>
        <span>{{ item.phone }}</span>
        <span>{{ item.clueSourceName }}</span>
      </template>
    </PitchBox>
    <!-- 跟进弹窗 -->
    <Dialog
      :class="'invalidDialog'"
      :visible.sync="followDialog"
      :title="`跟进状态判定`"
      :confirm="confirmFollow"
      :destroy-on-close="true"
      @closed="handleClosedFollow"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :label-width="isPC ? '120px' : '80px'"
      >
        <el-form-item
          label="线索是否有效"
          prop="value"
        >
          <el-radio-group v-model="ruleForm.value">
            <el-radio :label="1">
              无效
            </el-radio>
            <el-radio :label="2">
              有效
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="ruleForm.value === 1"
          label="无效描述"
          prop="invalidDescription"
        >
          <el-input
            v-model="ruleForm.invalidDescription"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            maxlength="200"
          />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

import SuggestContainer from '@/components/SuggestContainer/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'
import SelfTable from '@/components/base/SelfTable.vue'
import { ClueListForm } from './components'
import TableHeader from '@/components/TableHeader/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import PitchBox from '@/components/PitchBox/index.vue'

import { GetDictionaryList, GetJoinManageList } from '@/api/common'
import { GetClueList, Distribution, ExpiredClue, ActivationClue, GetCustomerOff, GetSaleList, ShowPhone } from '@/api/cargo'
import { HandlePages } from '@/utils/index'

import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}
const optionsClue: any = [
  // （0：待跟进 1：已跟进 2：已转化 3：无效）
  {
    value: 0,
    label: '待跟进'
  },
  {
    value: 1,
    label: '已跟进'
  },
  {
    value: 2,
    label: '已转化'
  },
  {
    value: 3,
    label: '无效'
  }
] // 线索状态
const optionsDistribution: any = [
  {
    value: 0,
    label: '待分配'
  },
  {
    value: 1,
    label: '已分配'
  }
] //
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
  },
  filters: {
    findDistribution(status: string) {
      const item = optionsDistribution.find(({ value }:any) => value === status)
      return item ? item['label'] : status
    },
    findClue(status: string) {
      const item = optionsClue.find(({ value }:any) => value === status)
      return item ? item['label'] : status
    },
    subString(str: string, num: number) {
      let val = str
      if (typeof str === 'string') {
        val = str.substr(0, num) + (str.length > num ? '...' : '')
      }
      return val
    }
  }
})
export default class extends Vue {
  private tags: any[] = [];
  private tab: any[] = [
    {
      value: '',
      label: '全部'
    },
    ...optionsDistribution
  ];

  private DateValue: any[] = [];
  private listQuery: IState = {
    'city': '', // 城市编码
    'clueId': '', // 线索编号id
    'clueSource': '', // 线索来源编码
    'clueState': '', // 线索状态（0：待跟进 1：已跟进 2：已转化 3：无效）
    'distributionState': '', // 分配状态（0：待分配 1：已分配）
    'lineSaleId': '', // 销售id
    'name': '', // 姓名
    'phone': '', // 手机号
    'startDate': '',
    'endDate': '',
    'page': 1,
    'limit': 20
  }

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
  private optionsCity: any = []; // 下拉
  private optionsClue: any = optionsClue; // 线索状态
  private optionsDistribution: any = optionsDistribution; //
  private optionsLineSource: any = []
  private optionsSale: any = []
  private optionsDialogSale: any = [] // 弹窗销售列表
  // table
  private total = 0;
  private list: any[] = [];
  private page: Object | undefined = '';
  private listLoading = true;
  private multipleSelection: any[] = [];
  // 分页
  private operationList: any[] = [
    { icon: 'el-icon-finished', name: '查看选中', color: '#F2A33A', key: 1 },
    { icon: 'el-icon-thumb', name: '分配线索', color: '#5E7BBB', key: 2 },
    { icon: 'el-icon-circle-close', name: '清空选择', color: '#F56C6C', key: 3 }
  ];
  // 弹窗
  private dialogLoading: boolean = false;
  private showDialog: boolean = false;
  private dialogList: any[] = [];
  private dialogValue: any = ''
  // 跟进弹窗
  private followDialog: boolean = false;
  private ruleForm: any ={
    clueId: '',
    value: '',
    invalidDescription: ''
  }
  private rules:any = {
    value: [
      { required: true, message: '请选择线索是否有效', trigger: 'change' }
    ],
    invalidDescription: [
      { required: true, message: '请输入无效描述', trigger: 'change' }
    ]
  }
  // 侧边栏
  private drawer: boolean = false;

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
  // 事件处理
  // 处理tags方法
  private handleTags(value: any) {
    this.tags = value
  }
  // 所有请求方法
  private fetchData() {
    // this.getCity()
    this.getDictionary()
    this.getSaleList()

    Promise.all([this.getCity(), this.getJoinManageList()])
      .then(() => {
        this.getList(this.listQuery)
      })
  }
  // 处理query方法
  private handleQuery(value: any, key: any) {
    this.listQuery[key] = value
    this.getList(this.listQuery)
  }
  // 处理query方法
  private handleSearch() {
    this.getList(this.listQuery)
  }
  // 处理选择日期方法
  private handleDate(value: any) {
    this.DateValue = value
  }
  // button
  // 添加明细原因 row 当前行 column 当前列
  private tableClick(row: any, column: any, cell: any, event: any) {
  }
  // 选中
  private handleSelectionChange(val: any) {
    this.multipleSelection = val
  }
  // 获取手机号
  private async showPhone(row: any) {
    const { data } = await ShowPhone({ clueId: row.clueId })
    if (data.success) {
      // eslint-disable-next-line require-atomic-updates
      row.phone = data.data
    } else {
      this.$message.error(data)
    }
  }
  // 请求列表
  private async getList(value: any) {
    this.listQuery.page = value.page
    this.listQuery.limit = value.limit
    this.listLoading = true

    const postData = {
      ...this.listQuery
    }
    postData.citys = postData.city === '' ? this.optionsCity.map((item: any) => item.code) : [postData.city]
    postData.lineSaleIds = postData.lineSaleId === '' ? this.optionsSale.map((item: any) => item.id) : [postData.lineSaleId]
    delete postData.city
    delete postData.lineSaleId
    const { data } = await GetClueList(postData)
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
  // 获取字典
  private async getDictionary() {
    const { data } = await GetDictionaryList(['line_clue_source'])
    if (data.success) {
      this.optionsLineSource = data.data.line_clue_source
    } else {
      this.$message.error(data)
    }
  }
  private async getJoinManageList() {
    return new Promise((resolve, reject) => {
      GetJoinManageList({})
        .then(({ data }: any) => {
          if (data.success) {
            this.optionsSale = data.data
          } else {
            this.$message.error(data)
          }
          resolve(data)
        }).catch((err: any) => {
          reject(err)
        })
    })
  }
  // 获取弹窗销售
  private async getSaleList() {
    const { data } = await GetSaleList()
    if (data.success) {
      this.optionsDialogSale = data.data
    } else {
      this.$message.error(data)
    }
  }
  // 获取城市
  private async getCity() {
    return new Promise((resolve, reject) => {
      GetCustomerOff()
        .then(({ data }) => {
          if (data.success) {
            this.optionsCity = data.data
          } else {
            this.$message.error(data)
          }
          resolve(data)
        }).catch((err: any) => {
          reject(err)
        })
    })
  }
  // 按钮操作
  // 详情
  private goDetail(id: string | (string | null)[] | null | undefined) {
    this.$router.push({ name: 'ClueDetail', query: { id: id } })
  }
  // 编辑
  private goEdit(row: any) {
    const id = row.clueId
    if (row.clueState === 3) {
      // 失效状态弹窗
      this.$confirm(`该线索是无效线索！若想编辑请确定设置为有效线索，且线索状态为待跟进！`, `提示`, {
        type: 'warning'
      })
        .then(async() => {
          const { data } = await ActivationClue({ clueId: id })
          if (data.success) {
            this.$message.success(`设置成功`)
            this.handleSearch()
            this.$router.push({ name: 'EditClue', query: { id: id } })
          } else {
            this.$message.error(data)
          }
        }).catch(() => {
        })
    } else {
      this.$router.push({ name: 'EditClue', query: { id: id } })
    }
  }
  // 跟进
  private goFollow(row: any) {
    if (row.clueState === 0) {
      // 待跟进显示弹窗
      this.ruleForm.clueId = row.clueId
      this.followDialog = true
    } else {
      this.$router.push({ name: 'FollowUpClue', query: { id: row.clueId } })
    }
  }
  // 转化
  private goConversion(id: string | (string | null)[] | null | undefined) {
    this.$router.push({ name: 'ConversionClue', query: { id: id } })
  }
  // 导入
  private goImport() {
    this.$router.push({ name: 'ImportClue' })
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
    const len = this.multipleSelection.filter((item: any) => !!item.distributionState)
    switch (key) {
      case 1: // 查看选中
        this.drawer = true
        break
      case 2: // 批量分配线索
        if (len.length > 0) {
          this.$confirm(`已选线索中包含已分配状态线索${len.length}条，请确认要对这些线索重新分配！`, '提示', {
            type: 'warning'
          }).then(() => {
            this.showDialog = true
          }).catch(() => {})
        } else {
          this.showDialog = true
        }
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
  private async confirm(done: any) {
    if (!this.dialogValue) {
      this.$message.warning(`请选择销售`)
      return
    }
    const postData = {
      'linesIds': this.multipleSelection.map(item => item.clueId),
      'saleId': this.dialogValue
    }
    const loading = this.$loading({
      target: (document.querySelector('.distributionDialog .el-dialog') as any)
    })
    const { data } = await Distribution(postData)
    loading.close()
    if (data.success) {
      this.$message.success(`分配成功`)
      done()
      this.handleSearch()
    } else {
      this.$message.error(data)
    }
  }
  private async confirmFollow(done: any) {
    (this.$refs.ruleForm as any).validate(async(valid: boolean) => {
      if (valid) {
        // const {data} =
        const { value, clueId, invalidDescription } = this.ruleForm
        if (value === 1) {
          const { data } = await ExpiredClue({ clueId, invalidDescription })
          if (data.success) {
            // console.log(data)
            this.$message.success(`判定线索成功`)
            done()
            this.$nextTick(() => {
              this.handleSearch()
            })
          } else {
            this.$message.error(data)
          }
        } else {
          done()
          this.$nextTick(() => {
            this.$router.push({ name: 'FollowUpClue', query: { id: clueId } })
          })
        }
      }
    })
  }
  private handleClosedFollow() {
    this.ruleForm.value = ''
    this.ruleForm.clueId = ''
    this.ruleForm.invalidDescription = ''
    this.$nextTick(() => {
      (this.$refs.ruleForm as any).clearValidate()
    })
  }
  private handleClosed() {
    this.dialogValue = ''
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
