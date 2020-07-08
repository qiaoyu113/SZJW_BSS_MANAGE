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
        v-for="(item,idx) in formItem"
        :key="item.type + idx"
        :span="isPC ? pcCol : 24"
      >
        <el-form-item
          :label="item.label"
          :prop="item.key"
          :label-width="item.w"
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
          <slot
            v-else-if="item.slot"
            :name="item.type"
          />
        </el-form-item>
      </el-col>
      <div class="clearfix" />
    </el-form>
    <slot name="btn" />
  </el-row>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
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
    @Prop({ default: 6 }) pcCol!:Number
    @Prop({ default: () => {} }) rules!:IState
    get isPC() {
      return SettingsModule.isPC
    }
    submitForm() {
      ((this.$refs['ruleForm']) as any).validate((valid:boolean) => {
        if (valid) {
          this.handlePass(valid)
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
    handlePass(isPass:boolean) {
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

</style>
