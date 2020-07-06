<template>
  <el-row
    :gutter="isPC ? 20 :0"
    class="selfForm"
  >
    <el-form
      ref="ruleForm"
      :form="listQuery"
      v-bind="$attrs"
    >
      <el-col
        v-for="(item,idx) in formItem"
        :key="item.type + idx"
        :span="isPC ? pcCol : 24"
      >
        <el-form-item
          :label="item.label"
          :prop="item.key"
        >
          <!-- 输入框 -->
          <el-input
            v-if="item.type === 1"
            v-model="listQuery[item.key]"
            v-bind="item.tagAttrs || {}"
          />
          <!-- 下拉框 -->
          <el-select
            v-else-if="item.type === 2"
            v-model="listQuery[item.key]"
            v-bind="item.tagAttrs || {}"
          >
            <el-option
              v-for="(sub,index) in item.options"
              :key="'select-'+sub.value+'-'+index"
              :label="sub.label"
              :value="sub.value"
            />
          </el-select>
          <!-- 日期区间控件 -->
          <el-date-picker
            v-else-if="item.type ===3"
            v-model="listQuery[item.key]"
            v-bind="item.tagAttrs || {}"
            type="daterange"
            range-separator="至"
            value-format="timestamp"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />

          <el-radio-group
            v-else-if="item.type ===4"
            v-model="listQuery[item.key]"
            v-bind="item.tagAttrs || {}"
          >
            <el-radio
              v-for="(sub,index) in item.options"
              :key="'radio-'+sub.value+'-'+index"
              :label="sub.value"
            >
              {{ sub.label }}
            </el-radio>
          </el-radio-group>
          <el-checkbox-group
            v-else-if="item.type ===5"
            v-model="listQuery[item.key]"
          >
            <el-checkbox
              v-for="(sub,index) in item.options"
              :key="'checkbox-'+sub.value+'-'+index"
              :label="sub.value"
            />
          </el-checkbox-group>
          <slot v-else-if="item.slot" />
        </el-form-item>
        <div class="btn">
          <slot name="btn" />
        </div>
      </el-col>
    </el-form>
  </el-row>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

  interface IState {
    [key: string]: any;
  }

  @Component({
    name: 'SelfForm'
  })
export default class extends Vue {
    // 判断是否是PC
    @Prop({ default: '80px' }) labelWith!:String
    @Prop({ default: () => {} }) listQuery!:IState
    @Prop({ default: () => [] }) formItem!:any[]
    @Prop({ default: 8 }) pcCol!:Number
    @Prop({ default: () => {} }) rules!:IState
    get isPC() {
      return SettingsModule.isPC
    }
}
</script>

<style lang="scss" scoped>
  .selfForm {
   padding:20px;
  }
</style>

<style scoped>
  .selfForm >>> .el-select {
    width:100%;
  }

</style>
