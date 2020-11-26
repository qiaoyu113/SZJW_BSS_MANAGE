<template>
  <div class="configManagercontainer">
    <el-card shadow="never">
      <div>
        <h4>配置管理</h4>
        <div
          v-permission="['/v2/line/label/create']"
          class="btn"
        >
          <el-button
            type="primary"
            size="small"
            @click="dialogTableVisible=true"
          >
            <i class="el-icon-plus" />新建城市配置
          </el-button>
        </div>
      </div>
      <!-- 表格 -->
      <self-table
        v-loading="listLoading"
        :index="false"
        :height="tableHeight"
        :is-p30="false"
        :operation-list="[]"
        :table-data="tableData"
        :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
        :columns="columns"
        :page="page"
        @onPageSize="handlePageSize"
      >
        <template v-slot:time="scope">
          {{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
        <template v-slot:person="scope">
          {{ scope.row.person }}
        </template>
        <template slot="busi">
          <div>共享</div>
          <div>专车</div>
        </template>
        <template v-slot:type="scope">
          <div>
            {{ scope.row.shareName.join('、') }}
          </div>
          <div>
            {{ scope.row.sepcialName.join('、') }}
          </div>
        </template>
        <template v-slot:op="scope">
          <el-link
            v-permission="['/v2/line/label/update']"
            :underline="false"
            type="primary"
            @click="handleModifyClick(scope.row)"
          >
            调整
          </el-link>
        </template>
      </self-table>
    </el-card>

    <SelfDialog
      :visible.sync="dialogTableVisible"
      width="40%"
      :show-confirm-button="false"
      :show-cancel-button="false"
      :show-close="false"
      title=""
      center
      append-to-body
      :sumbit-again="submitLoading"
      @closed="handleClosed"
    >
      <template v-if="stepOne">
        <self-form
          ref="form1"
          :rules="rules1"
          :list-query="form1"
          :form-item="formItem1"
          size="small"
          label-width="80px"
          class="p15 SuggestForm"
          :pc-col="24"
          @onPass="handlePassClick1"
        >
          <template slot="mulBtn">
            <div class="subBtn">
              <el-button
                size="small"
                @click="beforeClose"
              >
                取消
              </el-button>
              <el-button
                size="small"
                type="primary"
                :disabled="isvalidating"
                @click="handleForm1Click"
              >
                下一步
              </el-button>
            </div>
          </template>
        </self-form>
      </template>
      <template v-else>
        <self-form
          ref="form2"
          :list-query="form2"
          :form-item="formItem2"
          size="small"
          label-width="80px"
          class="p15 SuggestForm"
          :rules="rules2"
          :pc-col="24"
          @onPass="handlePassClick2"
        >
          <template slot="city">
            <div class="subBtn mt0 city">
              {{ city }}
            </div>
          </template>
          <template slot="desc">
            <div class="subBtn mt0 desc">
              须知:给某条业务线勾选肥瘦标签,代表该业务线司机可见该肥瘦类型线路
            </div>
          </template>
          <template slot="validator" />
          <template slot="mulBtn">
            <div class="subBtn">
              <el-button
                size="small"
                @click="beforeClose"
              >
                取消
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="handleForm2Click"
              >
                提交
              </el-button>
            </div>
          </template>
        </self-form>
      </template>
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
import { GetDictionaryCity, GetDictionary } from '@/api/common'
import { getLableLists, checkCityIsExist, saveLineLabel, updateLineLabel, getLineLabelById } from '@/api/line'
import { HandlePages, lock } from '@/utils/index'
import { delayTime } from '@/settings'

interface PageObj {
  page:number,
  limit:number,
  total?:number
}

interface IState {
  [key: string]: any;
}

interface ColumnObj {
  cityName:string;
  cityCode:string;
  sepcialName:string[];
  specialCode:string|number[];
  shareName:string[];
  shareCode:string|number[];
  person:string;
  time:string;
  busi?:boolean;
}
@Component({
  components: {
    SelfForm,
    SelfTable,
    SelfDialog
  }
})
export default class extends Vue {
  private listLoading:boolean = false
  private isvalidating:boolean = false
  private dialogTableVisible:boolean = false
  private submitLoading:boolean = false
  private stepOne:boolean = true
  private cityListOptions:IState[] = [] // 城市列表
  private fsListOptions:IState[] = [] // 肥瘦标签列表
  private tableData:ColumnObj[] = [];
  private columns:IState[] = [
    {
      key: 'cityName',
      label: '城市',
      'min-width': '140px'
    },
    {
      key: 'busi',
      label: '业务线',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'type',
      label: '可见线路肥瘦类型',
      slot: true,
      'width': '240px'
    },
    {
      key: 'person',
      label: '调整人',
      'min-width': '140px'
    },
    {
      key: 'time',
      label: '调整时间',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'op',
      label: '操作',
      slot: true,
      'min-width': '120px'
    }
  ];

  // 表格分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  private form1:IState = {
    cityCode: ''
  }
  private formItem1:any[] = [
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      w: '130px',
      label: '请选择城市:',
      key: 'cityCode',
      options: this.cityListOptions,
      listeners: {
        'change': this.validateCity
      }

    },
    {
      type: 'mulBtn',
      col: 24,
      slot: true,
      class: 'btn1',
      w: '0px'
    }
  ]
  private form2:IState = {
    shareCodes: [],
    sepcialCodes: [],
    id: ''
  }
  private rules1:IState ={
    cityCode: { required: true, message: '请选择城市', trigger: 'change' }
  }
  private formItem2:any[] = [
    {
      type: 'city',
      slot: true,
      w: '0px'
    },
    {
      type: 'desc',
      slot: true,
      w: '0px'
    },
    {
      type: 5,
      tagAttrs: {
        placeholder: '请选择'
      },
      label: '共享:',
      key: 'shareCodes',
      options: this.fsListOptions
    },
    {
      type: 5,
      tagAttrs: {
        placeholder: '请选择'
      },
      label: '专车:',
      key: 'sepcialCodes',
      options: this.fsListOptions
    },
    {
      type: 'validator',
      key: 'validator',
      slot: true
    },
    {
      type: 'mulBtn',
      col: 24,
      slot: true,
      w: '0px'
    }
  ]
  private rules2:IState = {
    shareCodes: [
      { required: true, message: '请选择肥瘦标签', trigger: 'change' }
    ],
    sepcialCodes: [
      { required: true, message: '请选择肥瘦标签', trigger: 'change' }
    ],
    validator: [
      { validator: this.validatorFunc, trigger: 'blur' }
    ]
  }
  // 验证专车和共享勾选的肥瘦标签是否通过
  validatorFunc(rule:any, value:any, callback:any) {
    let arr:number[] = this.form2.shareCodes.concat(this.form2.sepcialCodes)
    arr = [...new Set(arr)].sort((a, b) => a - b)
    let brr:number[] = this.fsListOptions.map((item:any) => item.value).sort((a, b) => a - b)
    if (arr.join(',') === brr.join(',')) {
      callback()
    } else {
      callback(new Error('注意:共享和专车的勾选项并集必须涵盖五个肥瘦标签,可重复,不可漏选！'))
    }
  }
  // 城市
  get city() {
    let arr:IState[] = this.cityListOptions.filter((item:any) => item.value === this.form1.cityCode)
    if (arr[0]) {
      return arr[0].label
    }
    return ''
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  get tableHeight() {
    let otherHeight = 340
    return document.body.offsetHeight - otherHeight || document.documentElement.offsetHeight - otherHeight
  }
  // 弹框即将关闭
  beforeClose() {
    this.dialogTableVisible = false
  }
  // 弹框关闭后
  handleClosed() {
    this.reset()
  }
  // 重置
  reset() {
    this.stepOne = true
    this.form1 = {
      cityCode: ''
    }
    this.form2 = {
      shareCodes: [],
      sepcialCodes: [],
      id: ''
    }

    if (this.$refs.form2) {
      ((this.$refs.form2) as any).resetForm()
    }
    this.dialogTableVisible = false
  }
  // 弹框第一步选择城市
  handleForm1Click() {
    ((this.$refs.form1) as any).submitForm()
  }
  // 表单验证选择城市通过
  handlePassClick1(valid:boolean) {
    this.stepOne = false
  }
  // 弹框第二步选择肥瘦标签
  handleForm2Click() {
    ((this.$refs.form2) as any).submitForm()
  }
  // 表单验证选择肥瘦通过
  handlePassClick2() {
    if (this.form2.id) {
      this.updateLineLabel()
    } else {
      this.saveLineLabel()
    }
  }
  // 调整
  handleModifyClick(row:any) {
    this.stepOne = false
    this.form1.cityCode = row.cityCode
    this.form2.id = row.id
    this.form2.sepcialCodes = row.sepcialCode
    this.form2.shareCodes = row.shareCode
    this.dialogTableVisible = true
  }
  // 获取城市列表
  async getCityLists() {
    try {
      interface City {
        value:string;
        label:string;
      }
      let { data: res } = await GetDictionaryCity()
      if (res.success) {
        let cityOptions:City[] = res.data.map((item:any) => ({
          label: item.name,
          value: +item.code
        }))
        this.cityListOptions.push(...cityOptions)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get city list fail:${err}`)
    }
  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 获取肥瘦标签列表
  async getLabelLists() {
    try {
      let params = {
        dictType: 'line_label'
      }
      let { data: res } = await GetDictionary(params)
      if (res.success) {
        let options:IState[] = res.data.map((item:any) => ({
          label: item.dictLabel,
          value: item.dictValue
        }))
        this.fsListOptions.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get label lists fail:${err}`)
    }
  }
  // 获取列表
  async getLists() {
    try {
      this.listLoading = true
      let params = {
        page: this.page.page,
        limit: this.page.limit
      }
      let { data: res } = await getLableLists(params)
      if (res.success) {
        this.tableData = res.data.map((item:any) => {
          item.busi = true
          return item
        })
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get list fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 校验当前城市是否配置过肥瘦标签
  async validateCity() {
    try {
      this.isvalidating = true
      let params = {
        cityCode: this.form1.cityCode
      }
      let { data: res } = await checkCityIsExist(params)
      if (res.success) {
        this.isvalidating = false
        if (res.data.isExist) {
          this.$message.warning('该城市已配置,点击下一步前往调整')
          this.getLineLabelById(res.data.labelId)
        }
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`validate city fail:${err}`)
    }
  }
  // 保存标签
  @lock
  async saveLineLabel() {
    try {
      this.submitLoading = true
      let params:IState = {
        cityCode: this.form1.cityCode,
        cityName: this.city,
        sepcialCodes: this.form2.sepcialCodes.join(','),
        shareCodes: this.form2.shareCodes.join(',')
      }
      let { data: res } = await saveLineLabel(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.reset()
        setTimeout(() => {
          this.page.page = 1
          this.getLists()
        }, delayTime)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`save label fail:${err}`)
    } finally {
      setTimeout(() => {
        this.submitLoading = false
      }, 1000)
    }
  }
  // 更新标签
  @lock
  async updateLineLabel() {
    try {
      this.submitLoading = true
      let params:IState = {
        cityCode: this.form1.cityCode,
        cityName: this.city,
        sepcialCodes: this.form2.sepcialCodes.join(','),
        shareCodes: this.form2.shareCodes.join(','),
        id: this.form2.id
      }
      let { data: res } = await updateLineLabel(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.reset()
        setTimeout(() => {
          this.page.page = 1
          this.getLists()
        }, delayTime)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`save label fail:${err}`)
    } finally {
      setTimeout(() => {
        this.submitLoading = false
      }, 1000)
    }
  }
  // 查询线路标签详情
  async getLineLabelById(id:number) {
    try {
      let params = {
        id
      }
      let { data: res } = await getLineLabelById(params)
      if (res.success) {
        let result:IState = res.data
        this.form1.cityCode = result.cityCode
        this.form2.id = result.id
        this.form2.sepcialCodes = result.sepcialCode
        this.form2.shareCodes = result.shareCode
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get detail by id fail:${err}`)
    }
  }
  mounted() {
    this.getLists()
    this.getCityLists()
    this.getLabelLists()
  }
}

</script>

<style lang='scss' scoped>
.configManagercontainer {
  padding: 20px;
  .btn {
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end;
  }
}

</style>

<style scoped>
  .subBtn {
    margin-top: 30px;
    width:100%;
    text-align: center;
  }
  .mt0 {
    margin-top:0px;
  }
  .city {
    color:#333;
    font-size:24px;
    font-weight: bold;
  }
  .desc {
    color:#999;
    font-size:14px;
  }
  .el-dialog__header {
    padding: 0px!important;
  }
</style>
