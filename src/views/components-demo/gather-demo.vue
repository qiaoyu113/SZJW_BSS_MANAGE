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
        <Dialog
          :visible.sync="showDialog"
        >
          <p>我是弹窗</p>
        </Dialog>
        <Dialog
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
        </Dialog>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import Operation from '@/components/Operation/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'Gather',
  components: {
    SuggestContainer,
    Operation,
    Dialog
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
