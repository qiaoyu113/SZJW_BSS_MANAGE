<template>
  <div :class="isPC ? 'BuyCarType' : 'BuyCarType-m'">
    <SuggestContainer
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.status"
      @handle-date="handleDate"
      @handle-query="handleQuery"
    >
      <BuyCarForm
        :list-query="listQuery"
        :date-value="DateValue"
        :data-types="{
          optionsCity,
          optionsCar,
          optionsCarModel
        }"
        @handle-tags="handleTags"
        @handle-query="search"
      />
    </SuggestContainer>
    <div class="table_box">
      <!--操作栏-->
      <TableHeader
        :tab="tab"
        :active-name="listQuery.status"
      >
        <el-button
          v-permission="['/v1/product/product/buyCar/download']"
          size="small"
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          @click="downLoad"
        >
          <i class="el-icon-download" />
          <span v-if="isPC">导出</span>
        </el-button>
        <el-button
          v-permission="['/v1/product/product/buyCar/create']"
          type="primary"
          size="small"
          :class="isPC ? 'btn-item' : 'btn-item-m'"
          @click="showDialog('create')"
        >
          <i class="el-icon-plus" />
          <span v-if="isPC">新建商品</span>
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
          :max-height="tableHeight"
          fit
          :border="isPC"
          stripe
          highlight-current-row
          style="width: 100%"
          align="left"
          row-key="id"
          @cell-click="tableClick"
        >
          <el-table-column
            v-if="checkList.includes('商品编号')"
            :key="checkList.length + 'productId'"
            prop="productId"
            label="商品编号"
            fixed
          />
          <el-table-column
            v-if="checkList.includes('购车车型')"
            :key="checkList.length + 'carType'"
            label="购车车型"
          >
            <template slot-scope="{row}">
              {{ findCar(row.carType) }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.includes('车辆型号')"
            :key="checkList.length + 'model'"
            prop="model"
            label="车辆型号"
          />
          <el-table-column
            v-if="checkList.includes('车辆信息')"
            :key="checkList.length + 'describe'"
            prop="describe"
            label="车辆信息"
          />
          <el-table-column
            v-if="checkList.includes('供应商')"
            :key="checkList.length + 'supplier'"
            prop="supplier"
            label="供应商"
          />
          <el-table-column
            v-if="checkList.includes('无税价格（元）')"
            :key="checkList.length + 'price'"
            prop="price"
            label="无税价格（元）"
          />
          <el-table-column
            v-if="checkList.includes('城市')"
            :key="checkList.length + 'city'"
            prop="city"
            label="城市"
          >
            <template slot-scope="{row}">
              {{ formatCity(row.city) }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.includes('车型状态')"
            :key="checkList.length + 'date'"
            prop="date"
            label="车型状态"
          >
            <template slot-scope="{row}">
              {{ row.status === 10 ? '已上架' : '已下架' }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.includes('创建时间')"
            :key="checkList.length + 'createDate'"
            prop="createDate"
            label="创建时间"
          >
            <template slot-scope="{row}">
              {{ row.createDate | Timestamp }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkList.includes('创建人')"
            :key="checkList.length + 'createrName'"
            prop="createrName"
            label="创建人"
          />
          <el-table-column
            v-if="checkList.includes('操作')"
            :key="checkList.length+ 'right'"
            label="操作"
            fixed="right"
            :width="isPC ? 'auto' : '50'"
            show-overflow-tooltip
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
                    v-permission="['/v1/product/product/buyCar/shelvesOrTheshelves']"
                    @click.native="shelvesOrTheshelves(row)"
                  >
                    {{ row.status === 10 ? '下架' : '上架' }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-permission="['/v1/product/product/buyCar/update']"
                    @click.native="showDialog(row)"
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
        :operation-list="[]"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
    <SelfDialog
      :visible.sync="dialogVisible"
      :title="dialogTit"
      :confirm="confirm"
      @closed="resetDialog"
    >
      <el-form
        ref="dialogForm"
        :model="dialogForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item
          label="供应商"
          prop="supplier"
        >
          <el-input
            v-model="dialogForm.supplier"
            placeholder="请输入供应商"
            maxlength="15"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="车型"
          prop="carType"
        >
          <el-select
            v-model="dialogForm.carType"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in optionsCar"
              :key="index"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="车辆型号"
          prop="model"
        >
          <el-input
            v-model="dialogForm.model"
            placeholder="请输入车型"
            maxlength="15"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="车辆信息"
          prop="carDescribe"
        >
          <el-input
            v-model="dialogForm.carDescribe"
            placeholder="请输入车辆信息"
            maxlength="50"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="无税价格"
          prop="price"
        >
          <el-input
            v-model="dialogForm.price"
            v-only-number="{min: 0, max: 1000000, precision: 2}"
            placeholder="请输入无税价格"
            clearable
          >
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="适用城市"
          prop="city"
        >
          <el-select
            v-model="dialogForm.city"
            placeholder="请选择"
            multiple
            collapse-tags
            clearable
            :disabled="!isAdd"
          >
            <el-option
              v-for="(item, index) in optionsDialogCity"
              :key="index"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import { BuyCarForm } from './components'
import TableHeader from '@/components/TableHeader/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { GetDictionaryList } from '@/api/common'
import { GetCustomerOff } from '@/api/cargo'
import { getProductList, shelvesOrTheshelves, createProduct, updateProduct, GetCarModelList, ProductDownload } from '@/api/product'
import { SettingsModule } from '@/store/modules/settings'
import { HandlePages } from '@/utils/index'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'BuyCarType',
  components: {
    SuggestContainer,
    BuyCarForm,
    TableHeader,
    Pagination,
    SelfDialog
  }
})
export default class extends Vue {
  private tags: any[] = [];
  private tab: any[] = [
    {
      label: '全部',
      name: '',
      num: ''
    },
    {
      label: '已上架',
      name: '10',
      num: ''
    },
    {
      label: '已下架',
      name: '20',
      num: ''
    }
  ];
  private DateValue: any[] = [];
  private listQuery: IState = {
    busiType: 1, // 业务类型：1购车，2租车
    carType: '',
    city: '',
    productCode: '',
    status: '',
    supplier: '',
    Intentional_compartment: '', // 车型
    endDate: '',
    startDate: '',
    page: 1,
    limit: 20
  };
  private dropdownList: any[] = [
    '商品编号',
    '购车车型',
    '车辆型号',
    '车辆信息',
    '供应商',
    '无税价格（元）',
    '城市',
    '车型状态',
    '创建时间',
    '创建人',
    '操作'
  ];
  private checkList: any[] = this.dropdownList;
  private optionsCity: any[] = []; // 字典查询定义(命名规则为options + 类型名称)
  private optionsCar: any = [];
  private optionsCarModel: any = [];
  private optionsDialogCity: any = [];
  // table
  private total = 0;
  private list: any[] = [];
  private page: Object | undefined = '';
  private listLoading = false;
  // dialog
  private isAdd: boolean = false;
  private dialogVisible: boolean = false;
  private dialogTit: string = '';
  private dialogForm: IState = {
    'busiType': 1,
    'carDescribe': '', // 车辆描述
    'carType': '', // 车型
    'model': '', // 车辆型号
    'city': [], // 适用地市
    'price': '', // 价格
    'supplier': ''// 供应商
  };
  private rules: any = {
    'carDescribe': [
      { required: true, message: '请输入车辆信息', trigger: 'blur' }
    ],
    'carType': [
      { required: true, message: '请选择车辆型号', trigger: 'blur' }
    ],
    'model': [
      { required: true, message: '请输入车辆型号', trigger: 'change' }
    ],
    'city': [
      { required: true, message: '请选择城市', trigger: 'change' }
    ],
    'price': [
      { required: true, message: '请输入无税价格', trigger: 'blur' }
    ],
    'supplier': [
      { required: true, message: '请输入供应商', trigger: 'blur' }
    ]
  }
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
  private formatCity(city:any) {
    const data = this.optionsCity.find((item:any) => {
      return item.code === city
    })
    return data ? data.name : city
  }
  // 处理tags方法
  private handleTags(value: any) {
    this.tags = value
  }
  // 所有请求方法
  private fetchData() {
    this.getCarModelList()
    this.getCity()
    this.getDictionary()
    // 获取弹窗城市
    this.getList(this.listQuery)
  }
  private async getCity() {
    const { data } = await GetCustomerOff()
    if (data.success) {
      this.optionsDialogCity = data.data
      this.optionsCity = data.data
    } else {
      this.$message.error(data)
    }
  }
  private findCar(value: number) {
    const item = this.optionsCar.find((item: any) => Number(item.dictValue) === value)
    return item ? item['dictLabel'] : value
  }
  // 处理query方法
  private handleQuery(value: any, key: any) {
    // this.listQuery[key] = value
    if (key === 'state') {
      this.listQuery.status = value
    } else {
      this.listQuery[key] = value
    }
    this.fetchData()
  }
  // search
  private search() {
    this.getList(this.listQuery)
  }
  // 处理选择日期方法
  private handleDate(value: any) {
    this.DateValue = value
  }
  // button
  // 添加明细原因 row 当前行 column 当前列
  private tableClick(row: any, column: any, cell: any, event: any) {}
  // 请求列表
  private async getList(value: any) {
    this.listQuery.page = value.page
    this.listQuery.limit = value.limit
    this.listLoading = true
    const postData = this.filterObj(this.listQuery)
    const { data } = await getProductList(postData)
    if (data.success) {
      this.list = data.data
      data.page = await HandlePages(data.page)
      this.total = data.page.total
      // title
      const title = data.title
      this.tab[0].num = title.totalCount
      this.tab[1].num = title.shelvesCount
      this.tab[2].num = title.theShelvesCount
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
  private filterObj(obj:any) {
    let result: any = {}
    Object.keys(obj).filter((key) => obj[key] !== '').forEach((key) => {
      result[key] = obj[key]
    })
    return result
  }
  // 清楚dialog
  private resetDialog() {
    this.dialogForm.carDescribe = ''
    this.dialogForm.carType = ''
    this.dialogForm.city = ''
    this.dialogForm.price = ''
    this.dialogForm.supplier = ''
    this.dialogForm.id = ''
    this.dialogForm.model = ''
    this.$nextTick(() => {
      (this.$refs.dialogForm as any).clearValidate()
    })
  }
  // dialog
  private showDialog(key: any) {
    if (key === 'create') {
      // 新建
      this.isAdd = true
      this.dialogTit = '新建商品'
      this.dialogVisible = true
    } else {
      // 编辑
      this.isAdd = false
      // console.log(key)
      this.dialogForm.carDescribe = key.describe // 车辆描述
      this.dialogForm.carType = key.carType // 车型
      this.dialogForm.model = key.model // 车辆类型
      this.dialogForm.city = typeof key.city === 'string' ? key.city.split(',') : key.city// 车辆描述
      this.dialogForm.price = key.price // 车辆描述
      this.dialogForm.supplier = key.supplier // 车辆描述
      this.dialogForm.id = key.id // 车辆描述
      this.dialogTit = '编辑商品'
      this.dialogVisible = true
    }
  }
  // 上架 or 下架
  private shelvesOrTheshelves(row: any) {
    let { id, status, productId } = row
    // status = 10 传20 status = 20 传10
    let statusText = status === 10 ? '下架' : '上架'
    this.$confirm(`您确定要${statusText}“${productId}”吗？`, `${statusText}商品`, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      const { data } = await shelvesOrTheshelves({
        id,
        status: status ^ 10 ^ 20,
        busiType: this.listQuery.busiType
      })
      if (data.success) {
        this.$message.success(`${statusText}成功`)
        this.search()
      } else {
        this.$message.error(data)
      }
    })
  }
  private confirm(done: any) {
    ((this.$refs['dialogForm']) as any).validate(async(valid:boolean) => {
      if (valid) {
        const postData = {
          ...this.dialogForm
        }
        postData.city = postData.city.join()
        postData.name = this.optionsCar.find((item: any) => Number(item.dictValue) === postData.carType).dictLabel + postData.model
        if (this.isAdd) {
          // 添加
          delete postData.id
          const { data } = await createProduct(postData)
          if (data.success) {
            this.$message.success(`创建成功`)
            this.dialogVisible = false
            this.search()
          } else {
            this.$message.error(data)
          }
        } else {
          // 编辑
          const { data } = await updateProduct(postData)
          if (data.success) {
            this.$message.success(`编辑成功`)
            this.dialogVisible = false
            this.search()
          } else {
            this.$message.error(data)
          }
        }
      }
    })
  }
  private async getDictionary() {
    const { data } = await GetDictionaryList(['Intentional_compartment'])
    if (data.success) {
      this.optionsCar = data.data.Intentional_compartment
    } else {
      this.$message.error(data)
    }
  }
  private async getCarModelList() {
    const { data } = await GetCarModelList({
      busiType: 1
    })
    if (data.success) {
      this.optionsCarModel = data.data
    } else {
      this.$message.error(data)
    }
  }
  private async downLoad() {
    const postData = this.filterObj(this.listQuery)
    delete postData.page
    delete postData.limit
    ProductDownload(postData)
      .then((res) => {
        this.$message({
          type: 'success',
          message: '导出成功!'
        })
        const fileName = res.headers['content-disposition'].split('fileName=')[1]
        this.download(res.data, decodeURI(fileName))
      })
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
  mounted() {
    this.fetchData()
  }
  activated() {
    this.$nextTick(() => {
      ((this.$refs['multipleTable']) as any).doLayout()
    })
  }
}
</script>
<style lang="scss" scoped>
.BuyCarType {
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  .el-select{
    display: block;
  }
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
</style>
<style scoped>

</style>
