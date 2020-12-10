<template>
  <el-row
    :gutter="20"
    class="selfForm"
    :class="{
      pc: pcBlock,
      mobile: mBlock,
      p15: isPC
    }"
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
            v-model.trim="listQuery[item.key]"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          />
          <el-input-number
            v-if="item.type === 14"
            v-model.number="listQuery[item.key]"
            style="width:100%"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          />
          <el-input
            v-if="item.type === 13"
            v-model.trim="listQuery[item.key]"
            type="textarea"
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
            :editable="false"
            v-bind="item.tagAttrs || {}"
            :type="item.dateType || 'daterange'"
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
            :editable="false"
            type="date"
            value-format="timestamp"
            v-on="item.listeners"
          />
          <!-- 显示文本 -->
          <span
            v-else-if="item.type ===7"
            v-bind="item.tagAttrs || {}"
            v-text="canNull(listQuery[item.key],item.isNull)"
          />
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
            :editable="false"
            type="datetime"
            value-format="timestamp"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          />
          <el-time-picker
            v-else-if="item.type ===10"
            v-model="listQuery[item.key]"
            :editable="false"
            is-range
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
import { DataIsNull } from '@/utils/index'
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
    @Prop({ default: false }) mBlock!:boolean
    @Prop({ default: false }) pcBlock!:boolean
    // 区分设备
    get isPC() {
      return SettingsModule.isPC
    }

    // 没有数据的情况下，是否展示暂无数据，默认展示否则为空
    canNull(val:any, isNull:any) {
      if (isNull) {
        if (val || val === 0) {
          return val
        } else {
          return ''
        }
      } else {
        return DataIsNull(val)
      }
    }
    // 提交表单
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
    // 重置表单
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
   .clearfix {
     display: block;
     content:'';
     overflow: hidden;
     clear: both;
   }
  }
</style>

<style scoped>
  .selfForm >>> .el-form-item__label {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #4A4A4A;
  }
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

  @media screen and (max-width: 700px){
    .mobile >>> .el-form-item {
      display: flex;
      flex-direction: column;
    }

    .mobile >>> .el-form-item__label {
      text-align: left;
    }

    .mobile >>> .el-form-item__content {
      margin-left: 0px!important;
    }
  }
  @media screen and (min-width: 700px){
    .pc >>> .el-form-item {
      display: flex;
      flex-direction: column;
    }

    .pc >>> .el-form-item__label {
      text-align: left;
    }

    .pc >>> .el-form-item__content {
      margin-left: 0px!important;
    }
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
