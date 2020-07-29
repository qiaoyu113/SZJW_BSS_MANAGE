<template>
  <div
    :class="isPC ? 'pagination-container' : 'pagination-container-m'"
  >
    <Operation
      v-if="total>0"
      :operation-list="operationList"
      @olclick="olclick"
    />
    <el-pagination
      :small="small"
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="isPC ? layout : layoutmini"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { scrollTo } from '@/utils/scroll-to'
import { SettingsModule } from '@/store/modules/settings'
import Operation from '@/components/Operation/index.vue'

@Component({
  name: 'Pagination',
  components: {
    Operation
  }
})
export default class extends Vue {
  @Prop({ required: true }) private total!: number
  @Prop({ default: 1 }) private page!: number
  @Prop({ default: 20 }) private limit!: number
  @Prop({ default: () => [10, 20, 30, 40, 50] }) private pageSizes!: number[]
  @Prop({ default: 'total, sizes, prev, pager, next, jumper' }) private layout!: string
  @Prop({ default: 'prev, pager, next' }) private layoutmini!: string
  @Prop({ default: true }) private background!: boolean
  @Prop({ default: true }) private autoScroll!: boolean
  @Prop({ default: false }) private hidden!: boolean
  @Prop({ default: !SettingsModule.isPC }) private small!: boolean
  // 批量操作按钮
  @Prop({ default: [] }) private operationList!:[]
  private showList: Boolean = false

  get currentPage() {
    return this.page
  }

  get isPC() {
    return SettingsModule.isPC
  }

  set currentPage(value) {
    this.$emit('update:page', value)
  }

  get pageSize() {
    return this.limit
  }

  set pageSize(value) {
    this.$emit('update:listQuery.limit', value)
  }

  handleSizeChange(value: number) {
    this.$emit('pagination', { page: this.currentPage, limit: value })
    if (this.autoScroll) {
      scrollTo(0, 800)
    }
  }

  handleCurrentChange(value: number) {
    this.$emit('pagination', { page: value, limit: this.pageSize })
    if (this.autoScroll) {
      scrollTo(0, 800)
    }
  }

  olclick(value:any) {
    this.showList = !this.showList
    this.$emit('olclick', value)
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  background: #fff;
  padding: 18px 32px;
  box-sizing: border-box;
  text-align: right;
  display: flex;
  .operation{
    flex: 1;
    text-align: left;
    position: relative;
    z-index: 10;
    .operation-main{
      width: 100px;
      height: 28px;
      line-height: 28px;
      border-radius: 25px;
      text-align: center;
      background:$main-btn;
      color: #fff;
      font-size: 13px;
      box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
    }
    .operation-main:hover{
      cursor: pointer;
    }
    .operation-main:before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border-radius: inherit;
    }
    .operation-list{
      width:100%;
      position: absolute;
      bottom: 32px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      .ol{
        position: relative;
        .ol-icon{
          width:32px;
          height:32px;
          line-height: 32px;
          text-align: center;
          overflow: hidden;
          background: $main-btn;
          border-radius: 100%;
          box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
          color:#fff;
          margin:12px 0;
        }
        span{
          position: absolute;
          left: 40px;
          top:6px;
          font-size: 10px;
          color: #fafafa;
          background: #757575;
          display: inline;
          padding:4px 6px;
          border-radius: 6px;
        }
      }
    }
    .operation-list:hover{
      cursor: pointer;
    }
  }
  .el-pagination{
    flex: 6;
  }
}

.pagination-container-m{
  padding: 16px;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  overflow-x: auto;
  .operation{
    flex: 1;
    text-align: left;
    position: relative;
    z-index: 10;
    .operation-main{
      width: 25px;
      height: 25px;
      line-height: 25px;
      border-radius: 25px;
      text-align: center;
      background:$main-btn;
      color: #fff;
      font-size: 13px;
      box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
      span{
        display: none;
      }
    }
    .operation-main:hover{
      cursor: pointer;
    }
    .operation-main:before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border-radius: inherit;
    }
    .operation-list{
      position: absolute;
      bottom: 32px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      .ol{
        position: relative;
        .ol-icon{
          width:32px;
          height:32px;
          line-height: 32px;
          text-align: center;
          overflow: hidden;
          background: $main-btn;
          border-radius: 100%;
          box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
          color:#fff;
          margin:12px 0;
        }
        span{
          min-width: max-content;
          position: absolute;
          left: 40px;
          top:6px;
          font-size: 10px;
          color: #fafafa;
          background: #757575;
          display: inline;
          padding:4px 6px;
          border-radius: 6px;
        }
      }
    }
    .operation-list:hover{
      cursor: pointer;
    }
  }
  .el-pagination{
    flex: 4;
  }
}

.pagination-container.hidden {
  display: none;
}
</style>
