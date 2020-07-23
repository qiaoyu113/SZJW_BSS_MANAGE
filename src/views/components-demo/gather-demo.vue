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
          <p> <span>【label】</span> 为【tab】中的属性:展示名称 </p>
          <p> <span>【name】</span> 为【tab】中的属性:唯一标志符 </p>
          <p> <span>【num】</span> 为【tab】中的属性:状态数量 </p>
          <p> <span>【tags】</span> 为点击筛选后展示状态数据（Array） </p>
          <p> <span>【matchName】</span> 为子form模块中的方法，通过switch，case自定义那么来判断取值，赋值给tags展示在tags状态栏中 </p>
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
          <p> <span>【icon】</span> 【operation-list】中图标配置 </p>
          <p> <span>【name】</span> 【operation-list】中名称配置 </p>
          <p> <span>【color】</span>【operation-list】中背景色配置 </p>
          <p> <span>【自定义】</span>【operation-list】中自定义配置 </p>
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
            ref="demoForm"
            :list-query="form"
            :form-item="formItem"
            label-with="80px"
          >
            <template slot="button">
              <el-button
                type="primary"
                @click="handleGetAddress"
              >
                点击获取省市县
              </el-button>
            </template>
          </self-form>
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
            @onCommand="handleCommandChange"
            @olclick="handleOlClick"
          >
            <template v-slot:operate="scope">
              <!--下面这行不要用-->
              <span v-if="false">{{ scope }}</span>
              <!--上面这行不要用-->
              <el-button
                v-if="isPC"
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

    <div class="demo-container">
      <!--弹窗-->
      <div class="demo-list">
        <h4>
          弹窗
        </h4>
        <el-button @click="showDialog = true">
          打开弹窗
        </el-button>
        <el-button @click="showDialog2 = true">
          异步关闭
        </el-button>
        <div class="tip">
          <p> <span>【visible】</span> 是否显示 Dialog，支持 .sync 修饰符 </p>
          <p> <span>【showCancelButton】</span> 是否显示取消按钮 默认 true </p>
          <p> <span>【showConfirmButton】</span> 是否显示确认按钮 默认 true </p>
          <p> <span>【width】</span> Dialog 的宽度 默认 50%（移动端默认90%） </p>
          <p> <span>【cancelButtonText】</span> 取消按钮的文本内容 默认 取消 </p>
          <p> <span>【confirmButtonText】</span> 取消按钮的文本内容 默认 确定 </p>
          <p> <span>【title】</span> 取消按钮的文本内容 默认 提示 </p>
          <p> <span>【cancel】</span> 取消按钮事件 默认 关闭弹窗 </p>
          <p> <span>【confirm】</span> 确认按钮事件 默认 关闭弹窗 </p>
          <p> <span>【...】</span> 支持el-dialog 其他属性，如：center show-close 等 </p>
        </div>
        <div class="fucTip">
          <p> <span>[...]</span> 支持el-dialog 所有事件，如：open close 等 </p>
        </div>
        <SelfDialog
          :visible.sync="showDialog"
        >
          <p>我是弹窗</p>
        </SelfDialog>
        <SelfDialog
          :visible.sync="showDialog2"
          :title="`测试标题`"
          :before-close="beforeClose"
          :cancel="cancel"
          :confirm="confirm"
        >
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
          <p>我是弹窗</p>
        </SelfDialog>
      </div>
    </div>

    <div class="demo-container">
      <!--弹窗-->
      <div class="demo-list">
        <h4>
          v-only-number 指令
        </h4>
        <el-row class="demo">
          <el-col :span="8">
            <el-input
              v-model="onlyNumber.val1"
              v-only-number="{min: 0, max: 100}"
              placeholder="最小0,最大100,不保留小数"
            />
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="onlyNumber.val2"
              v-only-number="{min: 0, max: 100, precision: 2}"
              placeholder="最小0,最大100,保留2位小数"
            />
          </el-col>
        </el-row>
        <div class="tip">
          <p> <span>【min】</span> 最小值 </p>
          <p> <span>【max】</span> 最大值 </p>
          <p> <span>【precision】</span> 保留小数点 </p>
        </div>
      </div>
    </div>

    <div class="demo-container">
      <!--弹窗-->
      <div class="demo-list">
        <h4>
          选中列表
        </h4>
        <button @click="olClicks">
          模拟table点击选中
        </button>
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
        <div class="tip">
          <p> <span>【drawer】</span> 是否展示弹窗（Boolean） </p>
          <p> <span>【multipleSelection】</span> table表check数组 </p>
        </div>
        <div class="fucTip">
          <p> <span>[deletDrawerList]</span> 同步删除table中check的【multipleSelection】数组 </p>
          <p> <span>[changeDrawer]</span> 关闭展示弹窗 </p>
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
import SelfDialog from '@/components/SelfDialog/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import PitchBox from '@/components/PitchBox/index.vue'
import { GetCityByCode } from '@/api/common'

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
    SelfDialog,
    SelfForm,
    PitchBox,
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
        name: '0',
        num: 10
      },
      {
        label: '状态2',
        name: '1',
        num: 20
      },
      {
        label: '状态3',
        name: '2',
        num: 3
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
      checkbox: [],
      timeRange: [Date.now(), Date.now()],
      address: []
    }
    private formItem:any[] = [
      {
        type: 1,
        label: '姓名',
        key: 'name',
        tagAttrs: {
          placeholder: '请输入姓名'
        }
      },
      {
        type: 1,
        label: '电话',
        key: 'phone',
        tagAttrs: {
          placeholder: '请输入电话'
        }
      },
      {
        type: 2,
        label: '来源渠道',
        key: 'channel',
        tagAttrs: {
          // disabled: true,
          clearable: true,
          multiple: true,
          placeholder: '请选择来源渠道'
        },
        options: [
          {
            label: '58同城',
            value: '58'
          },
          {
            label: '朋友圈',
            value: 'wechat'
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
      },
      {
        type: 10,
        label: '时间选择',
        key: 'timeRange',
        tagAttrs: {
          'arrow-control': true
        }
      },
      {
        type: 8,
        label: '省、市、县',
        key: 'address',
        tagAttrs: {
          placeholder: '请选择',
          ref: 'cascader',
          props: {
            lazy: true,
            lazyLoad: this.loadinterviewAddress
          }
        }
      },
      {
        type: 'button',
        slot: true,
        col: 24
      }
    ]
    page:PageObj ={
      page: 1,
      limit: 5,
      total: 20
    }
    private tableData:any[] = [
      {
        name: '段秀英',
        code: 'SX-BJ-198002069437',
        phone: '14798446913',
        city: '秦皇岛市'
      }
    ]
    columns:any[] =[]

    array:any[] = [
      {
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
          }
        ]
      }
    ]

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

    // [Operation]批量操作点击回调
    private operationList: any[] = [{ icon: 'el-icon-phone', name: '1', color: '#999' }, { icon: 'el-icon-star-off', name: '2', color: '#978374' }]
    private olClick(item: any) {
      console.log(item)
    }

    // 弹窗操作
    private showDialog: boolean = false;
    private showDialog2: boolean = false;
    // 测试dialog
    private confirm(done: any) {
      this.$message.info('点击了确定')
      done()
    }
    private cancel(done: any) {
      this.$message.info('点击了取消')
      done()
    }
    private beforeClose(done: any) {
      this.$message.info('点击了X')
      done()
    }
    // [SuggestContainer]处理query方法
    private handleQuery(value:any, key:any) {
      this.listQuery[key] = value
    }

    private handleOlClick(value:any) {
      console.log('xx:', value)
    }

    // only-number
    private onlyNumber: any = {};

    get isPC() {
      return SettingsModule.isPC
    }
    set isPC(value) {
      SettingsModule.ChangeIsPC({ key: 'isPC', value })
    }
    created() {
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        this.isPC = false
      } else {
        this.isPC = true
      }
    }

    /**
     * 分页
     */
    handlePageSize(page:any) {
      this.page.page = page.page
      this.page.limit = page.limit
    }
    // 批量操作
    private drawer: boolean= false;
    private multipleSelection: any[] = [{
      creater: '黄杰',
      clientPhone: '13888888888',
      city: '成都市'
    }]
    private olClicks(item: any) {
      this.drawer = true
    }
    // 删除选中项目
    private deletDrawerList(item:any, i:any) {
      (this.$refs.multipleTable as any).toggleRowSelection(item)
    }
    // 关闭查看已选
    private changeDrawer(val: any) {
      this.drawer = val
    }
    // 表格下拉菜单
    handleCommandChange(key:string|number, row:any) {
      console.log('xxx:', key, row)
    }
    async loadinterviewAddress(node:any, resolve:any) {
      let params:string[] = []
      if (node.level === 0) {
        params = ['100000']
      } else if (node.level === 1) {
        params = ['100000']
        params.push(node.value)
      } else if (node.level === 2) {
        params = ['100000']
        params.push(node.parent.value)
        params.push(node.value)
      }
      try {
        let nodes = await this.loadCityByCode(params)
        resolve(nodes)
      } catch (err) {
        resolve([])
      }
    }
    /**
     * 加载城市
     */
    async loadCityByCode(params:string[]) {
      try {
        let { data: res } = await GetCityByCode(params)
        if (res.success) {
          const nodes = res.data.map(function(item:any) {
            return {
              value: item.code,
              label: item.name,
              leaf: params.length > 2
            }
          })
          return nodes
        }
      } catch (err) {
        console.log(`load city by code fail:${err}`)
      }
    }

    handleGetAddress() {
      if (this.form.address.length < 3) {
        return this.$message.warning('请选择省、市、县')
      }
      console.log((this.$refs.demoForm as any).$refs.cascader.getCheckedNodes()[0].pathLabels)
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
