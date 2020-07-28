<template>
  <el-row
    :gutter="20"
    class="selfForm"
  >
    <el-form
      ref="ruleForm"
      :model="listQuery"
      v-bind="$attrs"
      :rules="rules"
    >
      <el-col
        v-for="item in formItem"
        :key="item.label || item.key"
        :span="isPC ? item.col || pcCol : 24"
      >
        <el-form-item
          :label="item.label"
          :prop="item.key"
          :label-width="item.w"
          :class="item.class"
        >
          <!-- 输入框 -->
          <el-input
            v-if="item.type === 1"
            v-model="listQuery[item.key]"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          />
          <!-- 下拉框 -->
          <el-select
            v-else-if="item.type === 2"
            v-model="listQuery[item.key]"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
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
            v-on="item.listeners"
          />

          <el-radio-group
            v-else-if="item.type ===4"
            v-model="listQuery[item.key]"
            v-on="item.listeners"
          >
            <el-radio
              v-for="(sub,index) in item.options"
              :key="'radio-'+sub.value+'-'+index"
              :label="sub.value"
              v-bind="item.tagAttrs || {}"
            >
              {{ sub.label }}
            </el-radio>
          </el-radio-group>
          <el-checkbox-group
            v-else-if="item.type ===5"
            v-model="listQuery[item.key]"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          >
            <el-checkbox
              v-for="(sub,index) in item.options"
              :key="'checkbox-'+sub.value+'-'+index"
              :label="sub.value"
            >
              {{ sub.label }}
            </el-checkbox>>
          </el-checkbox-group>
          <!-- 选择日期 -->
          <el-date-picker
            v-else-if="item.type ===6"
            v-model="listQuery[item.key]"
            type="date"
            value-format="timestamp"
            placeholder="选择日期"
            v-on="item.listeners"
          />
          <!-- 显示文本 -->
          <span
            v-else-if="item.type ===7"
            v-bind="item.tagAttrs || {}"
          >{{ listQuery[item.key] | DataIsNull }}</span>
          <el-cascader
            v-else-if="item.type ===8"
            ref="cascader"
            v-model="listQuery[item.key]"
            v-bind="item.tagAttrs || {}"
            :options="item.options"
            v-on="item.listeners"
          />
          <!-- 选择日期时分秒 -->
          <el-date-picker
            v-else-if="item.type ===9"
            v-model="listQuery[item.key]"
            type="datetime"
            placeholder="选择日期"
            value-format="timestamp"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          />
          <el-time-picker
            v-else-if="item.type ===10"
            v-model="listQuery[item.key]"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="timestamp"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          />
          <el-autocomplete
            v-else-if="item.type ===11"
            v-model="listQuery[item.key]"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          />
          <template
            v-else-if="item.type ===12"
          >
            <el-time-select
              v-model="listQuery[item.key].jobStartDate"
              class="timeSelect"
              placeholder="起始时间"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:45'
              }"
            />
            <el-time-select
              v-model="listQuery[item.key].jobEndDate"
              class="timeSelect"
              placeholder="结束时间"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:45',
                minTime: listQuery[item.key].jobStartDate
              }"
            />
          </template>
          <slot
            v-else-if="item.slot"
            :name="item.type"
            :row="{...listQuery,...{key: item.key}}"
          />
        </el-form-item>
      </el-col>
      <div class="clearfix" />
    </el-form>
    <slot name="btn" />
  </el-row>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

  interface IState {
    [key: string]: any;
  }

  @Component({
    name: 'SelfForm.houseAddress'

  })
export default class extends Vue {
    // 判断是否是PC
    @Prop({ default: () => {} }) listQuery!:IState
    @Prop({ default: () => [] }) formItem!:any[]
    @Prop({ default: 6 }) pcCol!:Number
    @Prop({ default: () => {} }) rules!:IState
    get isPC() {
      return SettingsModule.isPC
    }

    submitForm(args:any) {
      ((this.$refs['ruleForm']) as any).validate((valid:boolean) => {
        if (valid) {
          this.handlePass(valid, args)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
    resetForm() {
      ((this.$refs['ruleForm']) as any).resetFields()
    }
    @Emit('onPass')
    handlePass(isPass:boolean, args:any) {
    }
}
</script>

<style lang="scss" scoped>
  .selfForm {
   padding:20px;
   .clearfix {
     display: block;
     content:'';
     overflow: hidden;
     clear: both;
   }
  }
</style>

<style scoped>
  .selfForm >>> .el-form-item__content {
    display: flex;
    flex: 1;
  }
  .selfForm >>> .el-input {
    display: flex;
    flex: 1;
  }
  .selfForm >>> .el-select {
    display: flex;
    flex: 1;
  }
  .selfForm >>> .el-date-editor {
    display: flex;
    flex: 1;
  }
  .selfForm >>> .el-cascader {
    display: flex;
    flex: 1;
  }

  .selfForm >>> .el-autocomplete {
    display: flex;
    flex: 1;
  }

  .selfForm >>> .el-radio {
    height:36px;
    line-height: 36px;
  }
</style>

<style>
  @media screen and (max-width: 700px) {
    .el-picker-panel{
      left: 0 !important;
      width: 100%!important;
      overflow-x: auto;
    }
  }
</style>
