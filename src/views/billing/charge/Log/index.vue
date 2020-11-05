<template>
  <div
    class="logContainer"
    :class="{
      p15: isPC,
      m15: isPC
    }"
  >
    <div class="top">
      <div class="btn">
        <el-button @click.stop="handleBackClick">
          返回
        </el-button>
      </div>
      <h4>操作日志</h4>
    </div>
    <self-table
      v-loading="listLoading"
      :operation-list="[]"
      :height="tableHeight"
      :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
      :index="false"
      :indexes="false"
      :is-p30="false"
      :table-data="tableData"
      :columns="columns"
    >
      <template v-slot:opTime="scope">
        {{ scope.row.opTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
      </template>
    </self-table>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import { SettingsModule } from '@/store/modules/settings'
import { GetChargingLog } from '@/api/driver-account'
import { HandlePages } from '@/utils/index'

interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}
interface IState {
  [key: string]: any;
}

@Component({
  components: {
    SelfTable
  }
})
export default class extends Vue {
  private listLoading:boolean = false;
  private tableData:any[] = [];
  private columns:any[] = [
    {
      key: 'opName',
      label: '操作人',
      'min-width': '140px'
    },
    {
      key: 'opTime',
      label: '操作时间',
      slot: true,
      'min-width': '140px'
    },
    {
      key: 'content',
      label: '修改内容',
      'min-width': '140px',
      attrs: {
        'show-overflow-tooltip': true
      }
    }
  ];
  // 分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  get tableHeight() {
    let otherHeight = 340
    return document.body.offsetHeight - otherHeight || document.documentElement.offsetHeight - otherHeight
  }
  // 返回
  handleBackClick() {
    this.$router.go(-1)
  }
  // 获取列表
  async getLists() {
    try {
      let params:IState = {
        limit: this.page.limit,
        page: this.page.page,
        id: this.$route.query.id
      }
      let { data: res } = await GetChargingLog(params)
      if (res.success) {
        this.tableData = res.data
        res.page = await HandlePages(res.page)
        this.page.total = res.page
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get list fail:${err}`)
    }
  }
  mounted() {
    this.getLists()
  }
}
</script>
<style lang="scss" scoped>
  .m15 {
     margin: 15px;
  }
  .logContainer {
    background: #ffffff;
    border-radius: 8px;
  }
  .top {
    .btn {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
    }
    h4 {
      margin:10px 0px;
      font-size: 18px;
      color:#999;
    }
  }
</style>
