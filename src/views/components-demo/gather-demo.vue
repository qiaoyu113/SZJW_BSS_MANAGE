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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import Operation from '@/components/Operation/index.vue'

@Component({
  name: 'Gather',
  components: {
    SuggestContainer,
    Operation
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
