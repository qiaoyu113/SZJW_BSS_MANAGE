<template>
  <div
    :class="isPC ? 'SectionContainer' : 'SectionContainer-m'"
  >
    <div class="title">
      {{ title }}<span class="border" />
    </div>
    <div :class="md ? 'context_d' : 'context'">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'SuggestContainer'
})
export default class extends Vue {
  @Prop({ default: '' }) private title: any // 默认无法识别显示空
  @Prop({ default: false }) private md: any // 是否为移动端详情

  private TitleName: any

  created() {
  }

  get isPC() {
    return SettingsModule.isPC
  }
}
</script>

<style lang="scss" scope>
.SectionContainer{
    width: 100%;
    background: #FFFFFF;
    box-shadow: 4px 4px 10px 0 rgba(218,218,218,0.50);
    margin-bottom: 6px;
    .title{
        width:100%;
        height: 58px;
        line-height: 58px;
        font-size: 16px;
        color: #4A4A4A;
        font-weight: 500;
        border: 2px solid #F8F9FA;
        position: relative;
        padding:0 30px;
        box-sizing: border-box;
        .border{
            width:5px;
            height: 17px;
            position: absolute;
            left: 16px;
            top: 4px;
            bottom: 0;
            margin: auto;
            background-image: linear-gradient(270deg, #FF9600 0%, #FFB400 100%);
            border-radius: 2.5px;
            border-radius: 2.5px;
            display: inline-block;
        }
    }
    .context, .context_d{
        width:100%;
        padding: 30px;
        box-sizing: border-box;
    }
}
</style>

<style lang="scss" scope>
.SectionContainer-m{
    width: 100%;
    background: #FFFFFF;
    margin-bottom: 4px;
    box-shadow: 4px 4px 10px 0 rgba(218,218,218,0.50);
    .title{
        width:100%;
        height: 45px;
        line-height: 40px;
        font-size: 15px;
        color: #4A4A4A;
        font-weight: 500;
        border: 2px solid #F8F9FA;
        position: relative;
        padding:0 20px;
        box-sizing: border-box;
        .border{
            width: 4px;
            height: 14px;
            position: absolute;
            left: 10px;
            top: -1px;
            bottom: 0;
            margin: auto;
            background-image: linear-gradient(270deg, #FF9600 0%, #FFB400 100%);
            border-radius: 2.5px;
            border-radius: 2.5px;
            display: inline-block;
        }
    }
    .context{
        width:100%;
        padding: 20px 30px;
        box-sizing: border-box;
    }
    .context_d{
        width:100%;
    }
}
</style>
