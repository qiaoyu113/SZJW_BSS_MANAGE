<template>
  <div class="components-container">
    <aside>
      云鸟最牛前端组的<span class="link-type">
        Components
      </span>使用手册
    </aside>
    <div class="demo-container">
      <!--状态栏+suggest父级框-->
      <div class="demo-list">
        <h4>
          状态栏+suggest父级框
        </h4>
        <div class="demo">
          <SuggestContainer
            :tab="tab"
            :tags="tags"
            :active-name="listQuery.state"
            @handle-date="handleDate"
            @handle-query="handleQuery"
          />
        </div>
        <div class="tip">
          <p> <span>【tab】</span> 为状态列表数据（Array） </p>
          <p> <span>【tags】</span> 为点击筛选后展示状态数据（Array） </p>
          <p> <span>【listQuery.state】</span> 需要和tab中name对应，点击tag栏修改listQuery.state的值（String） </p>
        </div>
        <div class="fucTip">
          <p> <span>[handleDate]</span> 处理选择日期方法,配合父组件内时间数据联动 </p>
          <p> <span>[handleQuery]</span> 处理请求数据query的方法,配合父组件使用 </p>
        </div>
      </div>
    </div>

    <div class="demo-container">
      <!--批量操作-->
      <div class="demo-list">
        <h4>
          批量操作
        </h4>
        <div class="demo">
          <Operation
            :operation-list="operationList"
            @olclick="olClick"
          />
        </div>
        <div class="tip">
          <p> <span>【operation-list】</span> 为批量操作列（Array） </p>
          <p> <span>【icon】</span> operation-list中图标配置 </p>
          <p> <span>【name】</span> operation-list中名称配置 </p>
          <p> <span>【color】</span> operation-list中背景色配置 </p>
        </div>
        <div class="fucTip">
          <p> <span>[olclick]</span> 点击操作时回调方法 </p>
        </div>
      </div>
    </div>

    <div class="demo-container">
      <!-- 自定义表单 -->
      <div class="demo-list">
        <h4>自定义表单</h4>
        <div class="demo">
          <self-form
            :list-query="form"
            :form-item="formItem"
            label-with="80px"
          />
        </div>
        <div class="tip">
          <p> <span>【self-form】</span> 为自定义表单 </p>
          <p> <span>【list-query】</span> list-query 为v-model绑定的值组成的集合 </p>
          <p> <span>【label-with】</span> form表单label的宽度 </p>
        </div>
      </div>
    </div>

    <div class="demo-container">
      <!-- 自定义表格 -->
      <div class="demo-list">
        <h4>自定义表格</h4>
        <div class="demo">
          <self-table
            ref="selfTable"
            border
            :table-data="tableData"
            :columns="columns"
            :page="page"
            @onPageSize="handlePageSize"
          >
            <template v-slot:status="scope">
              <span v-if="scope.row.status === 1">待分配</span>
              <span v-else-if="scope.row.status === 2">待跟进</span>
              <span v-else-if="scope.row.status === 3">已面试</span>
            </template>
          </self-table>
        </div>
        <div class="tip">
          <p> <span>【tableData】</span> self-table表格的填充数据 </p>
          <p> <span>【columns】</span> self-table表格的columns列的集合</p>
          <p> <span>【page】</span> self-table表格的分页对象,当前页page,每页展示的数据limit,总条数total </p>
        </div>
        <div class="fucTip">
          <p> <span>[onPageSize]</span> 点击分页的回调函数 </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import Operation from '@/components/Operation/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'
import SelfTable from '@/components/base/SelfTable.vue'

interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}
@Component({
  name: 'Gather',
  components: {
    SuggestContainer,
    Operation,
    SelfForm,
    SelfTable
  }
})
export default class extends Vue {
    // [SuggestContainer]所需参数
    private tags: any[] = []
    private DateValue: any[] = []
    private tab: any[] = [
      {
        label: '状态1',
        name: '0'
      },
      {
        label: '状态2',
        name: '1'
      },
      {
        label: '状态3',
        name: '2'
      },
      {
        label: '状态4',
        name: '3'
      }
    ]
    private listQuery: any = {
      key: '',
      city: '',
      page: 1,
      limit: 30,
      endDate: '',
      startDate: '',
      state: '',
      lineSaleId: ''
    }
    private form:any = {
      name: '',
      phone: '',
      carType: '',
      channel: '',
      organization: '',
      followPerson: '',
      onlyCan: '',
      time: [],
      gender: 'male',
      checkbox: []
    }
    private formItem:any[] = [
      {
        type: 1,
        label: '姓名',
        placeholder: '请输入姓名',
        key: 'name'
      },
      {
        type: 1,
        label: '电话',
        placeholder: '请输入电话',
        key: 'phone'
      },
      {
        type: 2,
        label: '来源渠道',
        placeholder: '请选择来源渠道',
        key: 'channel',
        options: [
          {
            label: '58同城',
            value: '58'
          }
        ]
      },
      {
        type: 3,
        label: '日期',
        key: 'time'
      },
      {
        type: 4,
        label: '性别',
        key: 'gender',
        options: [
          {
            label: '男',
            value: 'male'
          },
          {
            label: '女',
            value: 'female'
          }
        ]
      },
      {
        type: 5,
        label: '复选框',
        key: 'checkbox',
        options: [
          {
            label: '北京',
            value: 'beijing '
          },
          {
            label: '上海',
            value: 'shanghai'
          }
        ]
      }
    ]
    private tableData:any[] = [
      {
        name: '段秀英',
        code: 'SX-BJ-198002069437',
        phone: '14798446913',
        city: '秦皇岛市',
        status: '1'
      }
    ]

    columns:any[] =[]

    array:any[] = [
      {
        fixed: 'left',
        key: 'name',
        label: '姓名'
      },
      {
        key: 'code',
        label: '编号'
      },
      {
        key: 'phone',
        label: '电话'
      },
      {
        key: 'city',
        label: '城市'
      },
      {
        key: 'status',
        label: '状态',
        slot: true
      }
    ]
  page:PageObj = {
    page: 1,
    limit: 5,
    total: 20
  }

  mounted() {
    this.columns = [...this.array]
    this.form.checkbox = this.array.map(item => item.key)
    this.formItem[this.formItem.length - 1].options = [...this.array].map(item => {
      item.value = item.key
      return item
    })
  }

  @Watch('form.checkbox', { deep: true })
  onCheckBox(val:any) {
    this.columns = this.array.filter(item => val.includes(item.key))
  }
  // [SuggestContainer]处理选择日期方法
  private handleDate(value:any) {
    this.DateValue = value
  }

  // [SuggestContainer]处理query方法
  private handleQuery(value:any, key:any) {
    this.listQuery[key] = value
  }

    // [Operation]批量操作点击回调
    private operationList: any[] = [{ icon: 'el-icon-phone', name: '1', color: '#999' }, { icon: 'el-icon-star-off', name: '2', color: '#978374' }]
    private olClick(item: any) {
      console.log(item)
    }

    /**
     * 分页
     */
    handlePageSize(page:any) {
      this.page.page = page.page
      this.page.limit = page.limit
    }
}
</script>

<style lang="scss">
.demo-container{
    margin-bottom: 30px;
    .demo-list{
        width: 100%;
        border: 2px solid #e5e5e5;
        letter-spacing: .2px;
        color: #777;
        -webkit-transition: .2s linear;
        transition: .2s linear;
        padding:30px;
        box-sizing: border-box;
        h4{
            font-weight: 400;
            color: #1f2f3d;
        }
        .tip{
            padding: 8px 16px;
            background-color: #ecf8ff;
            border-radius: 4px;
            border-left: 5px solid #50bfff;
            margin: 20px 0;
            span{
                background-color: hsla(0,0%,100%,.7);
                color: #445368
            }
        }
        .fucTip{
            padding: 8px 16px;
            background-color: #f0f9eb;
            border-radius: 4px;
            border-left: 5px solid #67c23a;
            margin: 20px 0;
            span{
                background-color: hsla(0,0%,100%,.7);
                color: #445368
            }
        }
    }
}

</style>
