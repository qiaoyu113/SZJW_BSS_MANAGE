<template>
  <div class="SelfItem">
    <el-col
      :span="isPC ? pccol : 24"
    >
      <el-form-item
        v-if="params.type === 1"
        :label-width="width+'px'"
        :label="params.label+'：'"
        :prop="params.prop"
      >
        <el-input
          v-model="ruleForm[params.prop]"
          :type="params.kind"
          :placeholder="params.placeholder"
        />
      </el-form-item>
      <el-form-item
        v-if="params.type === 2"
        :label-width="width+'px'"
        :label="params.label+'：'"
        :prop="params.prop"
      >
        <el-date-picker
          v-model="ruleForm[params.prop]"
          :type="params.kind"
          range-separator="至"
          value-format="timestamp"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :placeholder="params.placeholder"
        />
      </el-form-item>

      <el-form-item
        v-if="params.type === 3"
        :label-width="width+'px'"
        :label="params.label+'：'"
        :prop="params.prop"
      >
        <el-radio-group v-model="ruleForm[params.prop]">
          <el-radio
            v-for="(item,index) in params.radio"
            :key="'radio-'+item.type+'-'+index"
            :label="item.type"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="params.type === 4"
        :label-width="width+'px'"
        :label="params.label+'：'"
        :prop="params.prop"
      >
        <cascaderMore
          :zindex="+params.kind"
          :iswrite="params.iswrite"
          @onGetcity="onGetcity"
        />
      </el-form-item>

      <el-form-item
        v-if="params.type === 5"
        :label-width="width+'px'"
        :label="params.label+'：'"
        :prop="params.prop"
      >
        <el-select
          v-model="ruleForm[params.prop]"
        >
          <el-option
            v-for="(sub,index) in params.options"
            :key="'select-'+sub.value+'-'+index"
            :label="sub.label"
            :value="sub.value"
          />
        </el-select>
      </el-form-item>
    </el-col>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import CascaderMore from '@/views/transport/components/TransportListForm/CascaderMore.vue'
import '@/styles/common.scss'
interface params {
  prop:string,
  type:number,
  label:string,
  kind?:string,
  radio?:any[],
  placeholder?:string,
  iswrite?:boolean
  options?:any[]
}

    @Component({
      name: 'SelfItem',
      components: {
        CascaderMore
      }
    })
export default class SelfItem extends Vue {
  @Prop({ default: {} }) ruleForm!:any
  @Prop({ default: () => {} }) params!:params

  @Prop({ default: 8 }) pccol!:number
  @Prop({ default: 180 }) width!:number
  get
  isPC() {
    return SettingsModule.isPC
  }
  private onGetcity(obj:any) {
    console.log(obj)
  }
}
</script>
<style lang="scss"></style>
