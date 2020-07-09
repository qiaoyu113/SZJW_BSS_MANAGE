<template>
  <div class="selfTable">
    <el-table
      ref="multipleTable"
      max-height="0"
      :row-style="{height: '20px'}"
      :cell-style="{padding: '5px 0'}"
      :data="tableData"
      v-bind="$attrs"
      style="width: 100%; "
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
      />
      <el-table-column
        v-for="(item,idx) in columns"
        :key="'table-'+idx"
        :align="item.align || 'center'"
        :min-width="item.width || 100"
        :label="item.label"
        :fixed="item.fixed"
      >
        <template
          slot-scope="scope"
        >
          <template v-if="item.moreOp && item.moreOp.length > 0">
            <el-dropdown @command="(e) => handleCommand(e,scope.row)">
              <span class="el-dropdown-link">
                <slot
                  v-if="item.slot"
                  :name="item.key"
                  :row="scope.row"
                />
                <template v-else>
                  {{ scope.row[item.key] }}
                </template>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(sub,index) in item.moreOp"
                  :key="'dropdown-'+sub.value+index"
                  :command="sub.value"
                  v-bind="sub.tagAttrs || {}"
                >
                  <template v-if="isPC">
                    {{ sub.label }}
                  </template>
                  <i
                    v-else
                    :class="sub.icon"
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template v-else>
            <slot
              v-if="item.slot"
              :name="item.key"
              :row="scope.row"
            />
            <template v-else>
              {{ scope.row[item.key] }}
            </template>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="page.total>0"
      :operation-list="operationList"
      :total="page.total"
      :page.sync="page.page"
      :limit.sync="page.limit"
      @olclick="handleOlClick"
      @pagination="handlePageSizeChange"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import { SettingsModule } from '@/store/modules/settings'
interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}
@Component({
  name: 'SelfTable',
  components: {
    Pagination
  }
})
export default class extends Vue {
  @Prop({ default: () => [] }) tableData!:any[]
  @Prop({ default: () => [] }) columns!:any[]
  @Prop({ default: () => [
    { icon: 'el-icon-phone', name: '1', color: '#999' },
    { icon: 'el-icon-star-off', name: '2', color: '#978374' }
  ] }) operationList!:any[]
  @Prop({ default: () => ({ current: 1, size: 20, total: 0 }) }) page!:PageObj

  get isPC() {
    return SettingsModule.isPC
  }
  multipleSelection:any[] =[]

  /**
   * 勾选中的item
   */
  handleSelectionChange(val:any) {
    this.multipleSelection = val
  }

  /**
   * 分页和切换页码
   */
   @Emit('onPageSize')
  handlePageSizeChange(value:PageObj) {
  }
   @Emit('onCommand')
   handleCommand(command:any, row:any) {
   }
   @Emit('olclick')
   handleOlClick(value:any) {
   }
}
</script>
<style lang="scss" scoped>
  .selfTable{
    padding: 10px;
    background: #FFFFFF;
    box-shadow: 4px 4px 10px 0 rgba(218,218,218,0.50);
    overflow: hidden;

  }
</style>
