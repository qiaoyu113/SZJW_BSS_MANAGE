<template>
  <div class="DriverClue">
    <suggest-container
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-query="handleQuery"
    >
      <self-form
        :list-query="listQuery"
        :form-item="formItem"
        label-with="80px"
      />
    </suggest-container>
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
      <template v-slot:lastTime="scope">
        <span>{{ scope.row.lastTime | Timestamp }}</span>
      </template>
    </self-table>
    <el-button
      size="small"
      type="primary"
      @click="handleGetNodeClick"
    >
      获取选中节点
    </el-button>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import SelfForm from '@/components/base/SelfForm.vue'
import SelfTable from '@/components/base/SelfTable.vue'
interface IState {
  [key: string]: any;
}

interface Tab {
  label:String,
  name:String,
  id:Number,
  num?:Number | undefined
}

interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}

@Component({
  name: 'DriverClue',
  components: {
    SuggestContainer,
    SelfForm,
    SelfTable
  }
})

export default class extends Vue {
  private tab:Tab[] = [
    {
      label: '全部',
      name: 'all',
      id: 0,
      num: 187
    },
    {
      label: '待分配',
      name: 'tab1',
      id: 1,
      num: 5
    },
    {
      label: '待跟进',
      name: 'tab2',
      id: 2,
      num: 1
    },
    {
      label: '跟进中',
      name: 'tab3',
      id: 3,
      num: 3
    },
    {
      label: '已面试',
      name: 'tab4',
      id: 4,
      num: 8
    },
    {
      label: '已成交',
      name: 'tab5',
      id: 5,
      num: 6
    },
    {
      label: '已放弃',
      name: 'tab6',
      id: 6,
      num: 5
    }
  ]
  private tags:any[] = []
  listQuery:IState = {
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
  formItem:any[] = [
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
      label: '车型',
      placeholder: '请选择车型',
      key: 'carType',
      options: [
        {
          label: '依维柯',
          value: 'yiweike'
        },
        {
          label: '金杯',
          value: 'jinbei'
        }
      ]
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
      type: 2,
      label: '组织机构',
      placeholder: '请选择组织机构',
      key: 'organization',
      options: [
        {
          label: '华北大区',
          value: 'huabei'
        }
      ]
    },
    {
      type: 2,
      label: '跟进人',
      placeholder: '请选择跟进人',
      key: 'followPerson',
      options: [
        {
          label: 'tom',
          value: 'tom'
        }
      ]
    },
    {
      type: 2,
      label: '只看我的',
      placeholder: '请选择只看我的',
      key: 'onlyCan',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 2
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

  tableData:any[] = [
    {
      name: '段秀英',
      code: 'SX-BJ-198002069437',
      phone: '14798446913',
      city: '秦皇岛市',
      carType: '金杯',
      channel: '58同城',
      status: '1',
      followPerson: 'tom',
      lastTime: Date.now()
    }
  ]

  columns:any[] = [
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
      key: 'carType',
      label: '车型'
    },
    {
      key: 'channel',
      label: '来源'
    },
    {
      key: 'status',
      label: '状态',
      slot: true
    },
    {
      key: 'followPerson',
      label: '跟进人'
    },
    {
      slot: true,
      key: 'lastTime',
      label: '最后时间'
    }
  ]

  arry:any[] = []

  page:PageObj = {
    page: 1,
    limit: 5,
    total: 20
  }

  mounted() {
    for (let i = 0; i < 10; i++) {
      this.arry.push({ ...this.tableData[0], ...{ lastTime: Date.now() } })
    }
    this.tableData = this.arry.slice(0, 4)
  }

  /**
   * 删除顶部表单的选项
   */
  handleQuery(value:any, key:any) {
    this.listQuery[key] = value
  }

  /**
   * 获取选中节点的集合
   */
  handleGetNodeClick() {
    let nodes = (this.$refs.selfTable as any).multipleSelection
    console.log(nodes)
  }

  /**
 * 分页
 */
  handlePageSize(page:any) {
    this.tableData = this.arry.slice(page.page, 4)
  }
}
</script>
<style lang="scss" scoped>
  .DriverClue {
    padding: 20px;
  }
</style>
