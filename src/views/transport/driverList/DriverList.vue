<template>
  <div class="DriverList">
    <el-card>
      <!-- 查询表单 -->
      <self-form
        :list-query="listQuery"
        :form-item="formItem"
      >
        <div
          slot="btn1"
          :class="isPC ? 'btnPc' : ''"
        >
          <el-button
            type="primary"
            :class="isPC ? '' : 'btnMobile'"
            name="driverlist_query_btn"
            @click="handleQueryClick"
          >
            查询
          </el-button>
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            name="driverlist_reset_btn"
            @click="handleResetClick"
          >
            重置
          </el-button>
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            type="primary"
            name="driverlist_manager_btn"
            @click="handleModifyManager"
          >
            修改加盟经理
          </el-button>
        </div>
      </self-form>

      <self-table
        ref="selfTable"
        v-loading="listLoading"
        border
        :table-data="tableData"
        :columns="columns"
        :page="page"
        @onPageSize="handlePageSize"
        @onCommand="handleCommandChange"
      >
        <template v-slot:op="scope">
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
      </self-table>
    </el-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
import SelfTable from '@/components/base/SelfTable.vue'
interface IState {
    [key: string]: any;
}
interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}

@Component({
  name: 'DriverList',
  components: {
    SelfForm,
    SelfTable
  }
})
export default class extends Vue {
  private listLoading:boolean = false
  private listQuery:IState = {
    city: '',
    code: '',
    name: '',
    phone: '',
    line: '',
    group: '',
    manager: '',
    resource: '',
    up: true,
    quit: 1,
    time: []
  }

  private formItem:any[] = [
    {
      type: 2,
      key: 'city',
      label: '工作城市',
      tagAttrs: {
        placeholder: '请选择工作城市'
      }
    },
    {
      type: 1,
      key: 'code',
      label: '司机编号',
      tagAttrs: {
        placeholder: '请输入司机编号'
      }
    },
    {
      type: 1,
      key: 'name',
      label: '姓名',
      tagAttrs: {
        placeholder: '请输入姓名'
      }
    },
    {
      type: 1,
      key: 'phone',
      label: '手机号',
      tagAttrs: {
        placeholder: '请输入手机号'
      }
    },
    {
      type: 2,
      key: 'line',
      label: '业绩线',
      tagAttrs: {
        placeholder: '请选择业绩线'
      },
      options: [
        {
          label: '专车',
          value: 'car1'
        },
        {
          label: '共享',
          value: 'share1'
        }
      ]
    },
    {
      type: 2,
      key: 'group',
      label: '加盟小组',
      tagAttrs: {
        placeholder: '请选择加盟小组'
      },
      options: [
        {
          label: '专车',
          value: 'car2'
        },
        {
          label: '共享',
          value: 'share2'
        }
      ]
    },
    {
      type: 2,
      key: 'manager',
      label: '加盟经理',
      tagAttrs: {
        placeholder: '请选择加盟经理'
      },
      options: [
        {
          label: '专车',
          value: 'car3'
        },
        {
          label: '共享',
          value: 'share3'
        }
      ]
    },
    {
      type: 2,
      key: 'resource',
      label: '司机来源',
      tagAttrs: {
        placeholder: '请选择司机来源'
      },
      options: [
        {
          label: '专车',
          value: 'car5'
        },
        {
          label: '共享',
          value: 'share5'
        }
      ]
    },
    {
      type: 4,
      key: 'up',
      label: '是否有待上岗运力',
      options: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ]
    },
    {
      type: 4,
      key: 'quit',
      label: '是否有已退出运力',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    },
    {
      type: 3,
      key: 'time',
      label: '创建时间',
      tagAttrs: {
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker:any) {
              const end = new Date()
              const start = new Date()
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '昨天',
            onClick(picker:any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, start])
            }
          }, {
            text: '近7天',
            onClick(picker:any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '近30天',
            onClick(picker:any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }

    },
    {
      slot: true,
      type: 'btn1'
    }
  ]

  private tableData:any[] = [
    {
      a: '12131312313',
      b: 'tom',
      c: '15021578502',
      d: '共享',
      e: '北京市',
      f: '已成交',
      g: '面试转化',
      h: '王利',
      i: Date.now(),
      j: 5,
      k: '王利',
      l: '15021578502'
    }
  ]

  private columns:any[] = [
    {
      key: 'a',
      label: '司机编号'
    },
    {
      key: 'b',
      label: '司机姓名'
    },
    {
      key: 'c',
      label: '手机号'
    },
    {
      key: 'd',
      label: '业务线'
    },
    {
      key: 'e',
      label: '工作城市'
    },
    {
      key: 'f',
      label: '司机状态'
    },
    {
      key: 'g',
      label: '司机来源'
    },
    {
      key: 'h',
      label: '创建人'
    },
    {
      key: 'i',
      label: '创建时间'
    },
    {
      key: 'j',
      label: '运力数'
    },
    {
      key: 'k',
      label: '加盟经理'
    },
    {
      key: 'l',
      label: '加盟经理手机号'
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      slot: true,
      moreOp: [
        {
          label: '分配',
          value: 'distribution',
          icon: 'el-icon-edit'
        },
        {
          label: '跟进',
          value: 'follow',
          icon: 'el-icon-edit'
        },
        {
          label: '放弃',
          value: 'giveup',
          icon: 'el-icon-edit'
        },
        {
          label: '编辑',
          value: 'edit',
          icon: 'el-icon-edit'
        },
        {
          label: '详情',
          value: 'detail',
          icon: 'el-icon-chat-dot-square'
        },
        {
          label: '账户',
          value: 'account',
          icon: 'el-icon-chat-dot-square'
        },
        {
          label: '创建订单',
          value: 'order',
          icon: 'el-icon-chat-dot-square'
        },
        {
          label: '创建运力',
          value: 'transport',
          icon: 'el-icon-chat-dot-square'
        }
      ]
    },
    {
      key: 'u',
      label: '详情',
      slot: true
    }
  ]

  /**
   *分页对象
   */
  private page:PageObj = {
    page: 1,
    limit: 20,
    total: 100
  }
  /**
   * 查询
   */
  private handleQueryClick() {
    console.log(this.listQuery)
  }
  /**
   *重置
   */
  private handleResetClick() {
    this.listQuery = {
      city: '',
      code: '',
      name: '',
      phone: '',
      line: '',
      group: '',
      manager: '',
      resource: '',
      up: true,
      quit: 1,
      time: []
    }
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  /**
   * 修改加盟经理
   */
  handleModifyManager() {

  }

  /**
 * 分页
 */
  handlePageSize(page:any) {
    this.page.page = page.page
    this.page.limit = page.limit
  }

  /**
   * 更多操作
   */
  handleCommandChange(key:string|number, row:any) {
    console.log('xxx:', key, row)
    if (key === 'edit') { // 修改线索
      this.$router.push({
        path: '/transport/createClue',
        query: {
          id: row.id
        }
      })
    } else if (key === 'distribution') { // 分配线索
      (this.$refs.clueDistribution as any).openDialog()
    } else if (key === 'interview') { // 发起面试
      this.$router.push({
        path: '/transport/interview',
        query: {
          id: row.id
        }
      })
    } else if (key === 'follow') { // 线索跟进
      this.$router.push({
        path: '/transport/followClue',
        query: {
          id: row.id
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
  .DriverList {
    padding: 20px;
    .btnPc {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
    }
    .btnMobile {
      margin-left: 0;
      margin-top: 10px;
      width:100%;
    }
  }
</style>
